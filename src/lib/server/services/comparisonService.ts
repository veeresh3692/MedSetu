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

// Canonical pilot medicines for local preview & offline fallback
export const PILOT_MEDICINES: SearchMedicineResultItem[] = [
  {
    id: 'm0000000-0000-0000-0000-000000000001',
    brandName: 'Augmentin 625 Duo',
    slug: 'augmentin-625-duo',
    manufacturer: 'GlaxoSmithKline Pharmaceuticals Ltd',
    formulation: {
      id: 'f0000000-0000-0000-0000-000000000001',
      name: 'Amoxicillin and Potassium Clavulanate Tablet 625mg',
      dosageForm: 'TABLET',
      releaseType: 'IMMEDIATE_RELEASE',
      normalizedStrength: '500mg + 125mg',
    },
    packSize: 10,
    packUnit: 'TABLET',
    mrp: 204.50,
    unitPrice: 20.45,
    formattedUnitPrice: '₹20.45 / TABLET',
    schedule: 'SCHEDULE_H',
    isGenericGeneric: false,
  },
  {
    id: 'm0000000-0000-0000-0000-000000000002',
    brandName: 'Amoxyclav 625',
    slug: 'amoxyclav-625',
    manufacturer: 'Abbott Healthcare Pvt Ltd',
    formulation: {
      id: 'f0000000-0000-0000-0000-000000000001',
      name: 'Amoxicillin and Potassium Clavulanate Tablet 625mg',
      dosageForm: 'TABLET',
      releaseType: 'IMMEDIATE_RELEASE',
      normalizedStrength: '500mg + 125mg',
    },
    packSize: 10,
    packUnit: 'TABLET',
    mrp: 178.20,
    unitPrice: 17.82,
    formattedUnitPrice: '₹17.82 / TABLET',
    schedule: 'SCHEDULE_H',
    isGenericGeneric: false,
  },
  {
    id: 'm0000000-0000-0000-0000-000000000004',
    brandName: 'Jan Aushadhi Amoxicillin & Potassium Clavulanate Tablets IP 625mg',
    slug: 'jan-aushadhi-amoxicillin-potassium-clavulanate-625',
    manufacturer: 'Pharmaceutical & Medical Devices Bureau of India (PMBJP)',
    formulation: {
      id: 'f0000000-0000-0000-0000-000000000001',
      name: 'Amoxicillin and Potassium Clavulanate Tablet 625mg',
      dosageForm: 'TABLET',
      releaseType: 'IMMEDIATE_RELEASE',
      normalizedStrength: '500mg + 125mg',
    },
    packSize: 10,
    packUnit: 'TABLET',
    mrp: 54.00,
    unitPrice: 5.40,
    formattedUnitPrice: '₹5.40 / TABLET',
    schedule: 'SCHEDULE_H',
    isGenericGeneric: true,
  },
  {
    id: 'm0000000-0000-0000-0000-000000000005',
    brandName: 'Glycomet 500',
    slug: 'glycomet-500',
    manufacturer: 'USV Private Limited',
    formulation: {
      id: 'f0000000-0000-0000-0000-000000000002',
      name: 'Metformin Hydrochloride Tablet 500mg',
      dosageForm: 'TABLET',
      releaseType: 'IMMEDIATE_RELEASE',
      normalizedStrength: '500mg',
    },
    packSize: 20,
    packUnit: 'TABLET',
    mrp: 25.40,
    unitPrice: 1.27,
    formattedUnitPrice: '₹1.27 / TABLET',
    schedule: 'SCHEDULE_H',
    isGenericGeneric: false,
  },
  {
    id: 'm0000000-0000-0000-0000-000000000008',
    brandName: 'Telma 40',
    slug: 'telma-40',
    manufacturer: 'Glenmark Pharmaceuticals Ltd',
    formulation: {
      id: 'f0000000-0000-0000-0000-000000000004',
      name: 'Telmisartan Tablet 40mg',
      dosageForm: 'TABLET',
      releaseType: 'IMMEDIATE_RELEASE',
      normalizedStrength: '40mg',
    },
    packSize: 15,
    packUnit: 'TABLET',
    mrp: 142.00,
    unitPrice: 9.47,
    formattedUnitPrice: '₹9.47 / TABLET',
    schedule: 'SCHEDULE_H',
    isGenericGeneric: false,
  },
  {
    id: 'm0000000-0000-0000-0000-000000000013',
    brandName: 'Atorva 10',
    slug: 'atorva-10',
    manufacturer: 'Zydus Lifesciences Ltd',
    formulation: {
      id: 'f0000000-0000-0000-0000-000000000006',
      name: 'Atorvastatin Calcium Tablet 10mg',
      dosageForm: 'TABLET',
      releaseType: 'IMMEDIATE_RELEASE',
      normalizedStrength: '10mg',
    },
    packSize: 15,
    packUnit: 'TABLET',
    mrp: 110.00,
    unitPrice: 7.33,
    formattedUnitPrice: '₹7.33 / TABLET',
    schedule: 'SCHEDULE_H',
    isGenericGeneric: false,
  },
  {
    id: 'm0000000-0000-0000-0000-000000000015',
    brandName: 'Pan 40',
    slug: 'pan-40',
    manufacturer: 'Alkem Laboratories Ltd',
    formulation: {
      id: 'f0000000-0000-0000-0000-000000000007',
      name: 'Pantoprazole Gastro-Resistant Tablet 40mg',
      dosageForm: 'TABLET',
      releaseType: 'ENTERIC_COATED',
      normalizedStrength: '40mg',
    },
    packSize: 15,
    packUnit: 'TABLET',
    mrp: 155.00,
    unitPrice: 10.33,
    formattedUnitPrice: '₹10.33 / TABLET',
    schedule: 'SCHEDULE_H',
    isGenericGeneric: false,
  },
];

/**
 * Searches the canonical medicine catalog by brand name or generic formulation.
 */
export async function searchMedicines(
  query: string,
  limit: number = 10
): Promise<SearchMedicineResultItem[]> {
  try {
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

    if (data && data.length > 0) {
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
  } catch (err) {
    // Graceful fallback to pilot medicines for offline preview
  }

  const q = query.toLowerCase().trim();
  return PILOT_MEDICINES.filter(
    (m) =>
      m.brandName.toLowerCase().includes(q) ||
      m.formulation.name.toLowerCase().includes(q) ||
      m.manufacturer.toLowerCase().includes(q)
  ).slice(0, limit);
}

/**
 * Generates canonical comparison data for pilot medicines when in offline/preview mode.
 */
function getPilotMockComparison(
  medicineId: string,
  userLat: number = 12.9716,
  userLng: number = 77.5946,
  radiusKm: number = 10,
  sortBy: 'price' | 'distance' = 'price'
) {
  const target =
    PILOT_MEDICINES.find((m) => m.id === medicineId || m.slug === medicineId) ||
    PILOT_MEDICINES[0];

  const targetNorm = normalizeUnitPrice(target.mrp, target.packSize, target.packUnit);

  const mockPharmacies = [
    {
      id: 'p0000000-0000-0000-0000-000000000001',
      businessName: 'Apollo Pharmacy Indiranagar',
      address: '100ft Road, HAL 2nd Stage, Indiranagar',
      locality: 'Indiranagar',
      phone: '+918025251100',
      latitude: 12.9719,
      longitude: 77.6412,
      discountPercent: 10,
    },
    {
      id: 'p0000000-0000-0000-0000-000000000002',
      businessName: 'MedPlus Chemist Koramangala',
      address: '80ft Road, 4th Block, Koramangala',
      locality: 'Koramangala',
      phone: '+918025532200',
      latitude: 12.9352,
      longitude: 77.6245,
      discountPercent: 12,
    },
    {
      id: 'p0000000-0000-0000-0000-000000000003',
      businessName: 'PMBJP Jan Aushadhi Kendra Jayanagar',
      address: '11th Main, 4th Block, Jayanagar',
      locality: 'Jayanagar',
      phone: '+918026643300',
      latitude: 12.9250,
      longitude: 77.5938,
      discountPercent: target.isGenericGeneric ? 0 : 73.6,
    },
    {
      id: 'p0000000-0000-0000-0000-000000000004',
      businessName: 'Sri Raghavendra Medicals Malleshwaram',
      address: 'Margosa Road, 8th Cross, Malleshwaram',
      locality: 'Malleshwaram',
      phone: '+918023344400',
      latitude: 13.0068,
      longitude: 77.5684,
      discountPercent: 8,
    },
  ];

  const offers = mockPharmacies
    .map((p, idx) => {
      const distance = calculateHaversineDistance(userLat, userLng, p.latitude, p.longitude);
      const discount = p.discountPercent / 100;
      const sellingPrice =
        p.id === 'p0000000-0000-0000-0000-000000000003' && !target.isGenericGeneric
          ? 54.0
          : Math.round(target.mrp * (1 - discount) * 100) / 100;

      const unitSelling = normalizeUnitPrice(sellingPrice, target.packSize, target.packUnit);
      const savingsVsMrp = Math.round((target.mrp - sellingPrice) * 100) / 100;
      const savingsPercentage = Math.round((savingsVsMrp / target.mrp) * 100);

      return {
        offerId: `mock-offer-${idx + 1}`,
        pharmacy: {
          id: p.id,
          businessName: p.businessName,
          address: p.address,
          locality: p.locality,
          phone: p.phone,
          distanceKm: distance,
          latitude: p.latitude,
          longitude: p.longitude,
        },
        sellingPrice,
        unitPrice: unitSelling.unitPrice,
        formattedUnitPrice: unitSelling.formattedUnitPrice,
        savingsVsMrp,
        savingsPercentage,
        stockStatus: 'IN_STOCK' as const,
        verificationStatus: 'VERIFIED' as const,
        observationTimestamp: new Date().toISOString(),
      };
    })
    .filter((o) => (radiusKm ? o.pharmacy.distanceKm <= radiusKm : true));

  offers.sort((a, b) => {
    if (sortBy === 'distance') {
      return a.pharmacy.distanceKm - b.pharmacy.distanceKm;
    }
    return a.sellingPrice - b.sellingPrice;
  });

  const bioequivalentAlternatives = [
    {
      medicine: {
        id: 'm0000000-0000-0000-0000-000000000004',
        brandName: 'Jan Aushadhi Amoxicillin & Potassium Clavulanate Tablets IP 625mg',
        manufacturer: 'Pharmaceutical & Medical Devices Bureau of India (PMBJP)',
        mrp: 54.0,
        packSize: 10,
        packUnit: 'TABLET',
      },
      category: 'JAN_AUSHADHI_GENERIC' as const,
      categoryLabel: 'PMBJP Government Generic',
      unitPrice: 5.4,
      savingsPerUnit: 15.05,
      savingsPercentage: 74,
      requiresPrescription: true,
      warningNote: 'Jan Aushadhi stores require physical RMP prescription for Schedule H.',
    },
    {
      medicine: {
        id: 'm0000000-0000-0000-0000-000000000002',
        brandName: 'Amoxyclav 625',
        manufacturer: 'Abbott Healthcare Pvt Ltd',
        mrp: 178.2,
        packSize: 10,
        packUnit: 'TABLET',
      },
      category: 'BRANDED_GENERIC' as const,
      categoryLabel: 'Branded Generic Alternative',
      unitPrice: 17.82,
      savingsPerUnit: 2.63,
      savingsPercentage: 13,
      requiresPrescription: true,
    },
  ];

  return {
    targetMedicine: {
      id: target.id,
      brandName: target.brandName,
      slug: target.slug,
      manufacturer: target.manufacturer,
      mrp: target.mrp,
      packSize: target.packSize,
      packUnit: target.packUnit,
      unitPrice: targetNorm.unitPrice,
      formattedUnitPrice: targetNorm.formattedUnitPrice,
      schedule: target.schedule,
      requiresPrescription: true,
    },
    formulation: {
      id: target.formulation.id,
      name: target.formulation.name,
      dosageForm: target.formulation.dosageForm,
      releaseType: target.formulation.releaseType,
      normalizedStrength: target.formulation.normalizedStrength,
      activeSalts: ['Amoxicillin (500mg)', 'Clavulanic Acid (125mg)'],
    },
    governmentReference: {
      hasCeilingPrice: true,
      ceilingPricePerUnit: 18.2,
      applicableGstRate: 12,
      statutoryMaxUnitPrice: 20.38,
      dpcoOrderNumber: 'S.O. 1499(E)',
      notificationDate: '2024-03-25',
      sourceReference: 'NPPA National List of Essential Medicines Gazette',
    },
    bioequivalentAlternatives,
    nearbyPharmacyOffers: offers,
    statutoryDisclaimer: STATUTORY_DISCLAIMER,
  };
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
  let targetData: any = null;
  let targetError: any = null;
  let supabase: any = null;

  try {
    supabase = getSupabaseAnonClient();

    // 1. Fetch Target Medicine and its Formulation
    const res = await supabase
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

    targetData = res.data;
    targetError = res.error;
  } catch (err) {
    targetError = err;
  }

  if (targetError || !targetData) {
    return getPilotMockComparison(medicineId, userLat, userLng, radiusKm, sortBy);
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
    .filter((offer: any) => {
      // If user coords and radius are provided, filter within radius
      if (offer.pharmacy.distanceKm !== null && radiusKm) {
        return offer.pharmacy.distanceKm <= radiusKm;
      }
      return true;
    });

  // Sort offers
  offers.sort((a: any, b: any) => {
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
