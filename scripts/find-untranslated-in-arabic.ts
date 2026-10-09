import fs from 'fs';
import path from 'path';
import { translations } from '../src/translations';

const APP_DIR = path.resolve(process.cwd(), 'src/app');
const COMPONENTS_DIR = path.resolve(process.cwd(), 'src/components');

interface Finding {
  file: string;
  line: number;
  text: string;
  reason: string;
}

function getAllFiles(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath));
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = getAllFiles(APP_DIR).concat(getAllFiles(COMPONENTS_DIR));
const findings: Finding[] = [];
const missingTKeys: Set<string> = new Set();

// Regular expression to find JSX text: text between > and <
// e.g. >Some English Text<
const jsxTextRegex = />\s*([A-Za-z][A-Za-z0-9 ,.?!:;'"’()\-/$&%#@+]+?)\s*</g;

// Check placeholder, title, label attributes
const attrRegex = /(?:placeholder|title|aria-label|alt)=["']([A-Za-z][A-Za-z0-9 ,.?!:;'"()\-/$&%#@+]+?)["']/g;

// Check t("...") calls to ensure they exist in translations.ar
const tCallRegex = /\bt\(\s*["'`]([^"'`]+)["'`]\s*\)/g;

for (const file of files) {
  const relPath = path.relative(process.cwd(), file).replace(/\\/g, '/');
  if (relPath.includes('translations/index.ts')) continue;

  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  // Check t(...) calls in this file
  let match: RegExpExecArray | null;
  while ((match = tCallRegex.exec(content)) !== null) {
    const key = match[1].trim();
    if (!translations.ar[key] && !/[\u0600-\u06FF]/.test(key)) {
      // It's an English key passed to t() but missing in translations.ar!
      missingTKeys.add(key);
    }
  }

  // Scan line by line for raw English JSX
  let inComment = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('/*')) inComment = true;
    if (trimmed.includes('*/')) { inComment = false; continue; }
    if (inComment || trimmed.startsWith('//')) continue;

    // Skip lines with explicit language checks
    if (
      trimmed.includes('isAr') ||
      trimmed.includes('isRtl') ||
      trimmed.includes('language ===') ||
      trimmed.includes('t(') ||
      trimmed.includes('className=') && !trimmed.includes('>') && !trimmed.includes('placeholder=')
    ) {
      continue;
    }

    // Check for raw JSX text
    let jsxMatch: RegExpExecArray | null;
    while ((jsxMatch = jsxTextRegex.exec(line)) !== null) {
      const text = jsxMatch[1].trim();
      // Ignore technical / code tokens or single characters or numbers
      if (
        text.length > 2 &&
        !/^(true|false|null|undefined|px|rem|em|vh|vw|id|key|className|div|span|button)$/i.test(text) &&
        !/^[0-9+.\-/$% ]+$/.test(text) &&
        !text.includes('{') &&
        !text.includes('}')
      ) {
        findings.push({
          file: relPath,
          line: i + 1,
          text,
          reason: 'Raw JSX English text'
        });
      }
    }

    // Check attributes
    let attrMatch: RegExpExecArray | null;
    while ((attrMatch = attrRegex.exec(line)) !== null) {
      const text = attrMatch[1].trim();
      if (
        text.length > 2 &&
        !text.includes('{') &&
        !text.includes('}')
      ) {
        findings.push({
          file: relPath,
          line: i + 1,
          text,
          reason: 'Raw English attribute'
        });
      }
    }
  }
}

console.log('====================================================');
console.log('METHQAL TECH — ARABIC LOCALIZATION AUDIT SCANNER');
console.log('====================================================');
console.log(`Files Scanned                  : ${files.length}`);
console.log(`Missing t(...) Arabic Keys     : ${missingTKeys.size}`);
console.log(`Raw English JSX/Attr Findings : ${findings.length}`);
console.log('----------------------------------------------------');

if (missingTKeys.size > 0) {
  console.log('MISSING KEYS IN translations.ar:');
  for (const k of Array.from(missingTKeys).slice(0, 30)) {
    console.log(`  - "${k}"`);
  }
}

console.log('\nSAMPLE RAW ENGLISH FINDINGS:');
for (const f of findings.slice(0, 30)) {
  console.log(`  [${f.file}:${f.line}] ${f.reason}: "${f.text}"`);
}
console.log('====================================================');
