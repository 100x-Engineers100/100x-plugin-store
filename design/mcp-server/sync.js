// sync.js — uploads design wiki/ markdown files to Cloudflare KV
// Run: node sync.js
// Requires: wrangler authenticated (npx wrangler login)
// After running: wrangler kv namespace create "DESIGN_WIKI" — update KV_NAMESPACE_ID below

import { readdirSync, readFileSync, statSync, writeFileSync, unlinkSync } from 'fs';
import { join, relative, extname, basename } from 'path';
import { execSync } from 'child_process';

const WIKI_DIR = join(process.cwd(), '..', 'wiki', 'wiki');
const KV_NAMESPACE_ID = 'c28b29ab4d0e41259c089c16664e6fe8';
const BULK_FILE = join(process.cwd(), 'bulk-upload.json');

const SPECIAL = {
  'index.md':    '__index__',
  'overview.md': '__overview__',
  'log.md':      '__log__',
};

function kvKey(filePath) {
  const rel = relative(WIKI_DIR, filePath).replace(/\\/g, '/');
  const name = basename(rel);
  if (SPECIAL[name] && !rel.includes('/')) return SPECIAL[name];
  return rel.replace(/\.md$/, '');
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, out);
    } else if (extname(entry) === '.md') {
      out.push(full);
    }
  }
  return out;
}

const files = walk(WIKI_DIR);
console.log(`Found ${files.length} markdown files in wiki/`);
const pairs = files.map(f => ({ key: kvKey(f), value: readFileSync(f, 'utf-8') }));
console.log('\nPages to sync:');
pairs.forEach(p => console.log(`  ${p.key}`));
writeFileSync(BULK_FILE, JSON.stringify(pairs, null, 2), 'utf-8');
console.log(`\nUploading ${pairs.length} pages to KV namespace ${KV_NAMESPACE_ID}...`);
try {
  execSync(`npx wrangler kv bulk put "${BULK_FILE}" --namespace-id ${KV_NAMESPACE_ID} --remote`, { stdio: 'inherit', cwd: process.cwd() });
  console.log('\nSync complete.');
} finally {
  if (statSync(BULK_FILE, { throwIfNoEntry: false })) unlinkSync(BULK_FILE);
}
