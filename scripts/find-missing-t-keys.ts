import fs from 'fs';
import path from 'path';
import { translations } from '../src/translations';

const APP_DIR = path.resolve(process.cwd(), 'src/app');
const COMPONENTS_DIR = path.resolve(process.cwd(), 'src/components');

function getAllFiles(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath));
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.js')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = getAllFiles(APP_DIR).concat(getAllFiles(COMPONENTS_DIR));

const tKeyRegex = /\bt\(\s*["'`«]([^"'`»]+)["'`»]\s*\)/g;
const allUsedKeys = new Map<string, string[]>();

for (const file of files) {
  const relPath = path.relative(process.cwd(), file).replace(/\\/g, '/');
  if (relPath.includes('translations/index.ts')) continue;
  const content = fs.readFileSync(file, 'utf8');
  let match: RegExpExecArray | null;
  while ((match = tKeyRegex.exec(content)) !== null) {
    const rawKey = match[1].trim();
    if (!allUsedKeys.has(rawKey)) {
      allUsedKeys.set(rawKey, []);
    }
    allUsedKeys.get(rawKey)!.push(relPath);
  }
}

const missingInAr: string[] = [];
const missingInEn: string[] = [];

for (const key of allUsedKeys.keys()) {
  if (!translations.ar[key] && !/[\u0600-\u06FF]/.test(key)) {
    missingInAr.push(key);
  }
  if (!translations.en[key] && !translations.ar[key]) {
    missingInEn.push(key);
  }
}

console.log('==================================================');
console.log(`TOTAL UNIQUE KEYS PASSED TO t(...): ${allUsedKeys.size}`);
console.log(`KEYS MISSING IN translations.ar   : ${missingInAr.length}`);
console.log('==================================================');

console.log(JSON.stringify(missingInAr, null, 2));
