import fs from 'fs';
import path from 'path';

interface AuditResult {
  totalFilesScanned: number;
  totalComponents: number;
  totalRoutes: number;
  arabicLeakageInEnglish: { file: string; line: number; snippet: string }[];
  englishLeakageInArabic: { file: string; line: number; snippet: string }[];
}

const SRC_DIR = path.resolve(process.cwd(), 'src');
const APP_DIR = path.join(SRC_DIR, 'app');
const COMPONENTS_DIR = path.join(SRC_DIR, 'components');

const arabicRegex = /[\u0600-\u06FF]/;

function getAllFiles(dir: string, extensions: string[]): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, extensions));
    } else {
      if (extensions.some(ext => file.endsWith(ext))) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

function runAudit(): AuditResult {
  const tsxFiles = getAllFiles(APP_DIR, ['.tsx', '.jsx']).concat(
    getAllFiles(COMPONENTS_DIR, ['.tsx', '.jsx'])
  );

  const result: AuditResult = {
    totalFilesScanned: tsxFiles.length,
    totalComponents: 0,
    totalRoutes: 0,
    arabicLeakageInEnglish: [],
    englishLeakageInArabic: []
  };

  const routesSet = new Set<string>();

  for (const file of tsxFiles) {
    const relPath = path.relative(process.cwd(), file).replace(/\\/g, '/');
    if (relPath.includes('src/app') && file.endsWith('page.tsx')) {
      routesSet.add(path.dirname(relPath));
    }
    if (relPath.includes('src/components')) {
      result.totalComponents++;
    }

    if (relPath.includes('translations/index.ts')) continue;

    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');

    let inCommentBlock = false;
    let inArabicDataStructure = false;
    let openBrackets = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (trimmed.startsWith('/*')) inCommentBlock = true;
      if (trimmed.endsWith('*/') || trimmed.includes('*/')) {
        inCommentBlock = false;
        continue;
      }
      if (inCommentBlock || trimmed.startsWith('//')) continue;

      // Detect start of Arabic data structure like `const ...Ar = [` or `const ..._ar = [`
      if (/(?:const|let|var)\s+\w+(?:Ar|_ar|_AR|Arabic)\s*=\s*[\[\{]/.test(line)) {
        inArabicDataStructure = true;
        openBrackets = 0;
      }

      if (inArabicDataStructure) {
        for (const char of line) {
          if (char === '[' || char === '{') openBrackets++;
          if (char === ']' || char === '}') openBrackets--;
        }
        if (openBrackets <= 0) {
          inArabicDataStructure = false;
        }
        continue; // This data structure is specifically for Arabic mode
      }

      // Check for Arabic characters
      if (arabicRegex.test(line)) {
        const isBilingual =
          trimmed.includes('isAr') ||
          trimmed.includes('isRtl') ||
          trimmed.includes('isRTL') ||
          trimmed.includes("language === 'ar'") ||
          trimmed.includes('language === "ar"') ||
          trimmed.includes('direction === "rtl"') ||
          trimmed.includes('dir="rtl"') ||
          trimmed.includes('t(') ||
          trimmed.includes('arToEnMap') ||
          trimmed.includes('translations') ||
          trimmed.startsWith('//') ||
          (i > 0 && /(?:isAr|language\s*===|Ar\s*=\s*\[|ar:\s*|'ar'\s*:)/.test(lines[i - 1]));

        if (!isBilingual) {
          result.arabicLeakageInEnglish.push({
            file: relPath,
            line: i + 1,
            snippet: trimmed
          });
        }
      }
    }
  }

  result.totalRoutes = routesSet.size;
  return result;
}

const audit = runAudit();

console.log('====================================================');
console.log('METHQAL TECH — QA LOCALIZATION SCANNER REPORT');
console.log('====================================================');
console.log(`Files Scanned        : ${audit.totalFilesScanned}`);
console.log(`Routes Discovered    : ${audit.totalRoutes}`);
console.log(`Components Reviewed  : ${audit.totalComponents}`);
console.log(`Arabic Leakage (EN)  : ${audit.arabicLeakageInEnglish.length}`);
console.log(`English Leakage (AR) : ${audit.englishLeakageInArabic.length}`);
console.log('----------------------------------------------------');

if (audit.arabicLeakageInEnglish.length > 0) {
  console.log(`WARNING: Potential unguarded Arabic text found in English mode (${audit.arabicLeakageInEnglish.length} items):`);
  for (const item of audit.arabicLeakageInEnglish) {
    console.log(`  - [${item.file}:${item.line}] ${item.snippet}`);
  }
} else {
  console.log('PASS: 0 Unguarded Arabic leaks in English mode.');
}
console.log('====================================================');
