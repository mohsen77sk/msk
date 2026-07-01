import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const workspaceRoot = process.cwd();
const sourcePath = resolve(workspaceRoot, 'apps/mirza-write/src/environments/environment.production.ts');
const targetPath = resolve(workspaceRoot, 'apps/mirza-write/src/environments/environment.production.generated.ts');
const sentryDsn = process.env.MSK_SENTRY_DSN_PRODUCTION ?? '';
const sentryDsnLiteral = sentryDsn ? JSON.stringify(sentryDsn) : "''";

const source = readFileSync(sourcePath, 'utf8');
const generated = source.replace(
  /sentryDsn:\s*(['"`])[\s\S]*?\1,/,
  () => `sentryDsn: ${sentryDsnLiteral},`,
);

if (generated === source && !source.includes('sentryDsn')) {
  throw new Error('Could not find sentryDsn in Mirza production environment.');
}

writeFileSync(targetPath, generated);
console.log(
  `Generated Mirza production environment with Sentry DSN ${sentryDsn ? 'configured' : 'empty'}.`,
);
