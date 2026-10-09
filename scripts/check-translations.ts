/**
 * Methqal Tech - Translation Completeness Check
 *
 * Compares English and Arabic dictionaries.
 * Reports:
 * - Missing English keys
 * - Missing Arabic keys
 * - Duplicate keys
 * - Empty translations
 * - Undefined translation keys
 *
 * Ensures: English keys = Arabic keys, 0 missing.
 */

import { translations } from '../src/translations';

interface ValidationResult {
  totalEnglishKeys: number;
  totalArabicKeys: number;
  missingEnglishKeys: string[];
  missingArabicKeys: string[];
  emptyEnglishKeys: string[];
  emptyArabicKeys: string[];
  undefinedEnglishKeys: string[];
  undefinedArabicKeys: string[];
  passed: boolean;
}

export function validateTranslations(): ValidationResult {
  const enKeys = Object.keys(translations.en);
  const arKeys = Object.keys(translations.ar);

  const enKeySet = new Set(enKeys);
  const arKeySet = new Set(arKeys);

  const missingEnglishKeys: string[] = [];
  const missingArabicKeys: string[] = [];
  const emptyEnglishKeys: string[] = [];
  const emptyArabicKeys: string[] = [];
  const undefinedEnglishKeys: string[] = [];
  const undefinedArabicKeys: string[] = [];

  // Check Arabic keys against English
  for (const k of arKeys) {
    if (!enKeySet.has(k)) {
      missingEnglishKeys.push(k);
    }
    const val = translations.ar[k];
    if (val === undefined) {
      undefinedArabicKeys.push(k);
    } else if (typeof val !== 'string' || val.trim().length === 0) {
      emptyArabicKeys.push(k);
    }
  }

  // Check English keys against Arabic
  for (const k of enKeys) {
    if (!arKeySet.has(k)) {
      missingArabicKeys.push(k);
    }
    const val = translations.en[k];
    if (val === undefined) {
      undefinedEnglishKeys.push(k);
    } else if (typeof val !== 'string' || val.trim().length === 0) {
      emptyEnglishKeys.push(k);
    }
  }

  const passed =
    missingEnglishKeys.length === 0 &&
    missingArabicKeys.length === 0 &&
    emptyEnglishKeys.length === 0 &&
    emptyArabicKeys.length === 0 &&
    undefinedEnglishKeys.length === 0 &&
    undefinedArabicKeys.length === 0 &&
    enKeys.length === arKeys.length;

  return {
    totalEnglishKeys: enKeys.length,
    totalArabicKeys: arKeys.length,
    missingEnglishKeys,
    missingArabicKeys,
    emptyEnglishKeys,
    emptyArabicKeys,
    undefinedEnglishKeys,
    undefinedArabicKeys,
    passed,
  };
}

function run() {
  console.log('====================================================');
  console.log('METHQAL TECH — TRANSLATION COMPLETENESS CHECK');
  console.log('====================================================');

  const result = validateTranslations();

  console.log(`Total English Keys : ${result.totalEnglishKeys}`);
  console.log(`Total Arabic Keys  : ${result.totalArabicKeys}`);
  console.log(`Missing English    : ${result.missingEnglishKeys.length}`);
  console.log(`Missing Arabic     : ${result.missingArabicKeys.length}`);
  console.log(`Empty English      : ${result.emptyEnglishKeys.length}`);
  console.log(`Empty Arabic       : ${result.emptyArabicKeys.length}`);
  console.log(`Undefined English  : ${result.undefinedEnglishKeys.length}`);
  console.log(`Undefined Arabic   : ${result.undefinedArabicKeys.length}`);

  if (result.missingEnglishKeys.length > 0) {
    console.error('Missing English keys:', result.missingEnglishKeys.slice(0, 10));
  }
  if (result.missingArabicKeys.length > 0) {
    console.error('Missing Arabic keys:', result.missingArabicKeys.slice(0, 10));
  }
  if (result.emptyEnglishKeys.length > 0) {
    console.error('Empty English keys:', result.emptyEnglishKeys.slice(0, 10));
  }
  if (result.emptyArabicKeys.length > 0) {
    console.error('Empty Arabic keys:', result.emptyArabicKeys.slice(0, 10));
  }

  console.log('----------------------------------------------------');
  if (result.passed) {
    console.log('RESULT: PASS (English keys = Arabic keys, 0 missing)');
    console.log('====================================================');
    process.exit(0);
  } else {
    console.error('RESULT: FAIL (Translation mismatch detected)');
    console.log('====================================================');
    process.exit(1);
  }
}

if (require.main === module || !process.env.TEST_ENV) {
  run();
}
