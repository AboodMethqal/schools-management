import fs from 'fs';
import path from 'path';

const roles = ['super-admin', 'principal', 'teacher', 'student', 'parent', 'accountant'];

const DASHBOARD_DIR = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard');

const roleStats: Record<string, { totalFiles: number; usesUseLanguage: number; filesWithoutUseLanguage: string[] }> = {};

for (const role of roles) {
  const roleDir = path.join(DASHBOARD_DIR, role);
  if (!fs.existsSync(roleDir)) continue;

  const files: string[] = [];
  function scan(dir: string) {
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) scan(full);
      else if (f.endsWith('.tsx') || f.endsWith('.jsx')) files.push(full);
    }
  }
  scan(roleDir);

  let uses = 0;
  const noLang: string[] = [];

  for (const f of files) {
    const content = fs.readFileSync(f, 'utf8');
    const rel = path.relative(DASHBOARD_DIR, f).replace(/\\/g, '/');
    if (content.includes('useLanguage') || content.includes("language === 'ar'") || content.includes('isAr')) {
      uses++;
    } else {
      noLang.push(rel);
    }
  }

  roleStats[role] = {
    totalFiles: files.length,
    usesUseLanguage: uses,
    filesWithoutUseLanguage: noLang
  };
}

console.log(JSON.stringify(roleStats, null, 2));
