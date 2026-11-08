// ==============================================================================
// MEDICOMPARE INDIA — FORMULATION MATCHING ENGINE
// File: src/lib/matching/formulationMatcher.ts
// Governance: AGENTS.md, Rule 02, DOC-DATA-002 (MC-008)
// ==============================================================================

import { ClinicalFormulation, DosageForm, FormulationMatchResult, ReleaseType } from './types';

/**
 * Validates whether two release mechanisms are therapeutically interchangeable.
 * Strict rule: Release profiles must match identically. Swapping IR with SR/ER is strictly forbidden.
 */
export function validateReleaseLock(
  targetRelease: ReleaseType,
  candidateRelease: ReleaseType
): { isValid: boolean; warning?: string } {
  if (targetRelease === candidateRelease) {
    return { isValid: true };
  }

  const formatRelease = (r: ReleaseType) => r.replace('_', ' ');

  return {
    isValid: false,
    warning: `Clinical Safety Lock: Incompatible release mechanism. Prescribed is ${formatRelease(
      targetRelease
    )}, candidate is ${formatRelease(
      candidateRelease
    )}. Substituting immediate release with modified/sustained release alters pharmacokinetics and requires a physician prescription.`,
  };
}

/**
 * Validates dosage form compatibility.
 */
export function validateDosageForm(
  targetForm: DosageForm,
  candidateForm: DosageForm
): boolean {
  return targetForm === candidateForm;
}

/**
 * Evaluates whether two clinical formulations are bioequivalent direct substitutes.
 *
 * @param target The reference formulation prescribed or searched by the patient
 * @param candidate The alternative formulation being evaluated for substitution
 * @returns FormulationMatchResult indicating match status, score, and clinical warnings
 */
export function evaluateFormulationEquivalence(
  target: ClinicalFormulation,
  candidate: ClinicalFormulation
): FormulationMatchResult {
  // 1. Direct Monograph Identity Check
  if (target.id === candidate.id) {
    return {
      isMatch: true,
      matchScore: 100,
      releaseLockPassed: true,
      dosageFormPassed: true,
    };
  }

  // 2. Dosage Form Invariant
  const dosageFormPassed = validateDosageForm(target.dosageForm, candidate.dosageForm);
  if (!dosageFormPassed) {
    return {
      isMatch: false,
      matchScore: 0,
      releaseLockPassed: target.releaseType === candidate.releaseType,
      dosageFormPassed: false,
      reason: `Dosage form mismatch: Target is ${target.dosageForm}, Candidate is ${candidate.dosageForm}.`,
    };
  }

  // 3. Release Mechanism Safety Lock
  const releaseCheck = validateReleaseLock(target.releaseType, candidate.releaseType);
  if (!releaseCheck.isValid) {
    return {
      isMatch: false,
      matchScore: 0,
      releaseLockPassed: false,
      dosageFormPassed: true,
      reason: 'Release mechanism lock violation',
      clinicalWarning: releaseCheck.warning,
    };
  }

  // 4. Normalized Strength & Combination Invariant
  if (target.normalizedStrength !== candidate.normalizedStrength) {
    return {
      isMatch: false,
      matchScore: 0,
      releaseLockPassed: true,
      dosageFormPassed: true,
      reason: `Strength mismatch: Target is ${target.normalizedStrength}, Candidate is ${candidate.normalizedStrength}.`,
    };
  }

  if (target.isCombination !== candidate.isCombination) {
    return {
      isMatch: false,
      matchScore: 0,
      releaseLockPassed: true,
      dosageFormPassed: true,
      reason: 'Combination flag mismatch (single salt vs fixed-dose combination).',
    };
  }

  // 5. Deep Component Verification (if component arrays are populated)
  if (target.components && candidate.components) {
    if (target.components.length !== candidate.components.length) {
      return {
        isMatch: false,
        matchScore: 0,
        releaseLockPassed: true,
        dosageFormPassed: true,
        reason: 'Active ingredient component count mismatch.',
      };
    }

    // Sort components by normalized INN name for deterministic comparison
    const sortedTarget = [...target.components].sort((a, b) => a.innName.localeCompare(b.innName));
    const sortedCandidate = [...candidate.components].sort((a, b) => a.innName.localeCompare(b.innName));

    for (let i = 0; i < sortedTarget.length; i++) {
      const t = sortedTarget[i];
      const c = sortedCandidate[i];

      if (t.innName.toLowerCase() !== c.innName.toLowerCase()) {
        return {
          isMatch: false,
          matchScore: 0,
          releaseLockPassed: true,
          dosageFormPassed: true,
          reason: `Active salt mismatch: ${t.innName} vs ${c.innName}`,
        };
      }

      if (t.strengthValue !== c.strengthValue || t.strengthUnit.toLowerCase() !== c.strengthUnit.toLowerCase()) {
        return {
          isMatch: false,
          matchScore: 0,
          releaseLockPassed: true,
          dosageFormPassed: true,
          reason: `Component strength mismatch for ${t.innName}: ${t.strengthValue}${t.strengthUnit} vs ${c.strengthValue}${c.strengthUnit}`,
        };
      }
    }
  }

  // All invariants satisfied
  return {
    isMatch: true,
    matchScore: 100,
    releaseLockPassed: true,
    dosageFormPassed: true,
  };
}

