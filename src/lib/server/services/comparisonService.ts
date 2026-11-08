// ==============================================================================
// MEDICOMPARE INDIA — MEDICINE COMPARISON CORE SERVICE
// File: src/lib/server/services/comparisonService.ts
// Governance: AGENTS.md, Rules 01 & 02, DOC-API-001 (MC-009)
// ==============================================================================

import { getSupabaseAnonClient } from '../supabase';
import { normalizeUnitPrice, calculateSavings } from '../../matching/priceNormalizer';
import { rankBioequivalentAlternatives } from '../../matching/bioequivalenceRanker';
import { calculateHaversineDistance } from '../../geo/haversine';
import { ClinicalFormulation, MedicineSKU } from '../../matching/types';

export const STATUTORY_DISCLAIMER =
  'MediCompare India provides price comparison and informational discovery only. We do not prescribe, sell, or dispense medications. A valid physical prescription from a registered medical practitioner (RMP) is required to purchase Schedule H medicines from licensed retail pharmacies. Always consult a qualified physician before initiating or altering any treatment.';

export interface SearchMedicineResultItem {
  id: string;
  brandName: string;
  slug: string;
  manufacturer: string;
  formulation: {
    id: string;
    name: string;
    dosageForm: string;
    releaseType: string;
    normalizedStrength: string;
  };
  packSize: number;
  packUnit: string;
  mrp: number;
  unitPrice: number;
  formattedUnitPrice: string;
  schedule: string;
  isGenericGeneric: boolean;
}

/**
 * Searches the canonical medicine catalog by brand name or generic formulation.
 */
export async function searchMedicines(
  query: string,
  limit: number = 10
): Promise<SearchMedicineResultItem[]> {
  const supabase = getSupabaseAnonClient();

  // Search across brand_name or formulation name
  const { data, error } = await supabase
    .from('medicines')
    .select(`
      id,
      brand_name,
      slug,
      manufacturer,
      pack_size,
      pack_unit,
      mrp,
      schedule,
      is_generic_generic,
      is_discontinued,
      formulation_id,
      formulations!inner (
        id,
        name,
        dosage_form,
        release_type,
        normalized_strength
      )
    `)
    .eq('is_discontinued', false)
    .ilike('brand_name', `%${query}%`)
    .limit(limit);

  if (error) {
    throw new Error(`Database search query failed: ${error.message}`);
  }

  if (!data) {
    return [];
  }

  return data.map((row: any) => {
    const norm = normalizeUnitPrice(Number(row.mrp), Number(row.pack_size), row.pack_unit);
    return {
      id: row.id,
      brandName: row.brand_name,
      slug: row.slug,
      manufacturer: row.manufacturer,
      formulation: {
        id: row.formulations.id,
        name: row.formulations.name,
        dosageForm: row.formulations.dosage_form,
        releaseType: row.formulations.release_type,
        normalizedStrength: row.formulations.normalized_strength,
      },
      packSize: Number(row.pack_size),
      packUnit: row.pack_unit,
      mrp: Number(row.mrp),
      unitPrice: norm.unitPrice,
      formattedUnitPrice: norm.formattedUnitPrice,
      schedule: row.schedule,
      isGenericGeneric: row.is_generic_generic,
    };
  });
}

/**
 * Compiles complete price comparison data for a given medicine.
 */
export async function getMedicineComparison(
  medicineId: string,
  userLat?: number,
  userLng?: number,
  radiusKm: number = 5,
  sortBy: 'price' | 'distance' = 'price'
) {
  const supabase = getSupabaseAnonClient();

  // 1. Fetch Target Medicine and its Formulation
  const { data: targetData, error: targetError } = await supabase
    .from('medicines')
    .select(`
      id,
      brand_name,
      slug,
      manufacturer,
      pack_size,
      pack_unit,
      mrp,
      schedule,
      is_generic_generic,
      is_discontinued,
      formulation_id,
      formulations!inner (
        id,
        name,
        dosage_form,
        release_type,
        is_combination,
        normalized_strength
      )
    `)
    .eq('id', medicineId)
    .single();

  if (targetError || !targetData) {
    throw new Error(`Medicine with ID ${medicineId} not found.`);
  }

  const targetFormulation = targetData.formulations as any;
  const targetNorm = normalizeUnitPrice(
    Number(targetData.mrp),
    Number(targetData.pack_size),
    targetData.pack_unit
  );

  // 2. Fetch Active Salts / Ingredients for this Formulation
  const { data: ingredientsData } = await supabase
    .from('formulation_ingredients')
    .select(`
      strength_value,
      strength_unit,
      active_ingredients (
        inn_name
      )
    `)
    .eq('formulation_id', targetFormulation.id);

  const activeSalts = (ingredientsData || []).map(
    (row: any) => `${row.active_ingredients?.innName || row.active_ingredients?.inn_name} (${row.strength_value}${row.strength_unit})`
  );

  // 3. Fetch NPPA Government Ceiling Price Reference
  const { data: govtPriceData } = await supabase
    .from('government_price_references')
    .select('*')
    .eq('formulation_id', targetFormulation.id)
    .order('notification_date', { ascending: false })
    .limit(1)
    .maybeSingle();

  const governmentReference = govtPriceData
    ? {
        hasCeilingPrice: true,
        ceilingPricePerUnit: Number(govtPriceData.ceiling_price),
        applicableGstRate: Number(govtPriceData.applicable_gst_rate),
        statutoryMaxUnitPrice:
          Math.round(
            Number(govtPriceData.ceiling_price) * (1 + Number(govtPriceData.applicable_gst_rate) / 100) * 100
          ) / 100,
        dpcoOrderNumber: govtPriceData.dpco_order_number,
        notificationDate: govtPriceData.notification_date,
        sourceReference: govtPriceData.source_reference,
      }
    : {
        hasCeilingPrice: false,
      };

  // 4. Fetch Candidate Bioequivalent Medicines for the Same Formulation
  const { data: candidateMedicines } = await supabase
    .from('medicines')
    .select(`
      id,
      brand_name,
      slug,
      manufacturer,
      pack_size,
      pack_unit,
      mrp,
      schedule,
      is_generic_generic,
      is_discontinued,
      formulation_id
    `)
    .eq('formulation_id', targetFormulation.id)
    .eq('is_discontinued', false);

  const targetMedicineSKU: MedicineSKU = {
    id: targetData.id,
    brandName: targetData.brand_name,
    slug: targetData.slug,
    formulationId: targetData.formulation_id,
    manufacturer: targetData.manufacturer,
    packSize: Number(targetData.pack_size),
    packUnit: targetData.pack_unit,
    mrp: Number(targetData.mrp),
    schedule: targetData.schedule,
    isGenericGeneric: targetData.is_generic_generic,
    isDiscontinued: targetData.is_discontinued,
  };

  const targetFormulationDomain: ClinicalFormulation = {
    id: targetFormulation.id,
    name: targetFormulation.name,
    dosageForm: targetFormulation.dosage_form,
    releaseType: targetFormulation.release_type,
    isCombination: targetFormulation.is_combination,
    normalizedStrength: targetFormulation.normalized_strength,
  };

  const formulationMap = new Map<string, ClinicalFormulation>();
  formulationMap.set(targetFormulationDomain.id, targetFormulationDomain);

  const candidateSKUs: MedicineSKU[] = (candidateMedicines || []).map((m: any) => ({
    id: m.id,
    brandName: m.brand_name,
    slug: m.slug,
    formulationId: m.formulation_id,
    manufacturer: m.manufacturer,
    packSize: Number(m.pack_size),
    packUnit: m.pack_unit,
    mrp: Number(m.mrp),
    schedule: m.schedule,
    isGenericGeneric: m.is_generic_generic,
    isDiscontinued: m.is_discontinued,
  }));

  const bioequivalentAlternatives = rankBioequivalentAlternatives(
    targetMedicineSKU,
    targetFormulationDomain,
    candidateSKUs,
    formulationMap
  );

  // 5. Fetch Verified Nearby Pharmacy Offers
  const { data: offersData } = await supabase
    .from('pharmacy_offers')
    .select(`
      id,
      selling_price,
      stock_status,
      observation_timestamp,
      verification_status,
      pharmacies!inner (
        id,
        business_name,
        address_line,
        locality,
        city,
        phone_number,
        latitude,
        longitude,
        verification_status
      )
    `)
    .eq('medicine_id', medicineId)
    .eq('is_active', true)
    .eq('verification_status', 'PHARMACY_CONFIRMED');

  const offers = (offersData || [])
    .map((o: any) => {
      const pharm = o.pharmacies;
      const pharmLat = Number(pharm.latitude);
      const pharmLng = Number(pharm.longitude);
      const distanceKm =
        userLat !== undefined && userLng !== undefined
          ? calculateHaversineDistance(userLat, userLng, pharmLat, pharmLng)
          : null;

      const sellingPrice = Number(o.selling_price);
      const offerNorm = normalizeUnitPrice(sellingPrice, targetMedicineSKU.packSize, targetMedicineSKU.packUnit);
      const { savingsPerUnit, savingsPercentage } = calculateSavings(
        targetNorm.unitPrice,
        offerNorm.unitPrice
      );

      return {
        offerId: o.id,
        pharmacy: {
          id: pharm.id,
          businessName: pharm.business_name,
          address: `${pharm.address_line}, ${pharm.locality}, ${pharm.city}`,
          locality: pharm.locality,
          phone: pharm.phone_number,
          distanceKm,
          latitude: pharmLat,
          longitude: pharmLng,
        },
        sellingPrice,
        unitPrice: offerNorm.unitPrice,
        savingsVsMrp: Math.round((targetMedicineSKU.mrp - sellingPrice) * 100) / 100,
        savingsPercentage,
        stockStatus: o.stock_status,
        verificationStatus: o.verification_status,
        observationTimestamp: o.observation_timestamp,
      };
    })
    .filter((offer) => {
      // If user coords and radius are provided, filter within radius
      if (offer.pharmacy.distanceKm !== null && radiusKm) {
        return offer.pharmacy.distanceKm <= radiusKm;
      }
      return true;
    });

  // Sort offers
  offers.sort((a, b) => {
    if (sortBy === 'distance' && a.pharmacy.distanceKm !== null && b.pharmacy.distanceKm !== null) {
      return a.pharmacy.distanceKm - b.pharmacy.distanceKm;
    }
    return a.sellingPrice - b.sellingPrice;
  });

  return {
    targetMedicine: {
      id: targetMedicineSKU.id,
      brandName: targetMedicineSKU.brandName,
      slug: targetMedicineSKU.slug,
      manufacturer: targetMedicineSKU.manufacturer,
      mrp: targetMedicineSKU.mrp,
      packSize: targetMedicineSKU.packSize,
      packUnit: targetMedicineSKU.packUnit,
      unitPrice: targetNorm.unitPrice,
      formattedUnitPrice: targetNorm.formattedUnitPrice,
      schedule: targetMedicineSKU.schedule,
      requiresPrescription:
        targetMedicineSKU.schedule === 'SCHEDULE_H' ||
        targetMedicineSKU.schedule === 'SCHEDULE_H1' ||
        targetMedicineSKU.schedule === 'SCHEDULE_X',
    },
    formulation: {
      id: targetFormulation.id,
      name: targetFormulation.name,
      dosageForm: targetFormulation.dosage_form,
      releaseType: targetFormulation.release_type,
      normalizedStrength: targetFormulation.normalized_strength,
      activeSalts,
    },
    governmentReference,
    bioequivalentAlternatives,
    nearbyPharmacyOffers: offers,
    statutoryDisclaimer: STATUTORY_DISCLAIMER,
  };
}

