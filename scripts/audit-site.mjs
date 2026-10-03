#!/usr/bin/env node

/**
 * QRaft Automated Authenticity & Hygiene Audit Script
 * Checks for:
 * 1. Empty or stub hrefs (href="#" or href="")
 * 2. Unresolved TODO or FIXME markers
 * 3. Generic placeholder text (Lorem ipsum, foo, bar, baz, john doe)
 * 4. Banned marketing buzzwords & fake social proof (Fortune 500, trusted by 10,000+, etc.)
 * 5. Stray console.log statements
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const SCAN_DIRS = ['src'];
const SCAN_FILES = ['index.html'];
const IGNORED_DIRS = ['node_modules', 'dist', '.git', 'docs', 'scratch'];
const TARGET_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.html', '.css'];

const issues = [];

const RULES = [
  {
    type: 'Empty or Stub Link',
    regex: /href=["'](#|javascript:void\(0\)|)["']/i,
    message: 'Stub link detected; replace with meaningful route or button.',
  },
  {
    type: 'Unresolved Marker',
    regex: /\b(TODO|FIXME|HACK|XXX)\b/,
    message: 'Unresolved development marker found.',
  },
  {
    type: 'Placeholder Copy',
    regex: /\b(lorem\s+ipsum|placeholder\s+text|john\s+doe|jane\s+doe)\b/i,
    message: 'Generic placeholder text detected.',
  },
  {
    type: 'Fake Social Proof / Banned Buzzword',
    regex: /\b(fortune\s+500|trusted\s+by\s+10,?000|world['’]?s\s+best|award[-\s]winning\s+app)\b/i,
    message: 'Unsubstantiated marketing claim or fake social proof detected.',
  },
  {
    type: 'Stray Console Log',
    regex: /\bconsole\.log\s*\(/,
    message: 'console.log statement found in production code.',
  },
];

function scanFile(filePath) {
  const relativePath = path.relative(ROOT_DIR, filePath);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Ignore audit script itself
    if (filePath.includes('audit-site.mjs')) return;

    for (const rule of RULES) {
      if (rule.regex.test(line)) {
        issues.push({
          file: relativePath,
          line: index + 1,
          type: rule.type,
          detail: rule.message,
          snippet: line.trim().slice(0, 80),
        });
      }
    }
  });
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.includes(entry.name)) {
        walkDir(fullPath);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (TARGET_EXTENSIONS.includes(ext)) {
        scanFile(fullPath);
      }
    }
  }
}

console.log('----------------------------------------------------');
console.log('🔍 QRaft Automated Authenticity & Hygiene Audit');
console.log('----------------------------------------------------');

// 1. Scan target directories
for (const scanDir of SCAN_DIRS) {
  const fullPath = path.join(ROOT_DIR, scanDir);
  if (fs.existsSync(fullPath)) {
    walkDir(fullPath);
  }
}

// 2. Scan individual files
for (const file of SCAN_FILES) {
  const fullPath = path.join(ROOT_DIR, file);
  if (fs.existsSync(fullPath)) {
    scanFile(fullPath);
  }
}

if (issues.length === 0) {
  console.log('✅ PASS: All files checked. Zero placeholders, stub links, fake social proof, or stray console.logs found.\n');
  process.exit(0);
} else {
  console.error(`❌ FAIL: Found ${issues.length} audit issue(s):\n`);
  for (const issue of issues) {
    console.error(`  • [${issue.type}] ${issue.file}:${issue.line}`);
    console.error(`    ${issue.detail}`);
    console.error(`    Snippet: "${issue.snippet}"\n`);
  }
  process.exit(1);
}
