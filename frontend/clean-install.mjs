import { execSync } from 'child_process';
import { rmSync } from 'fs';
import { resolve } from 'path';

const cwd = process.cwd();

console.log('Removing node_modules...');
try {
  rmSync(resolve(cwd, 'node_modules'), { recursive: true, force: true });
  console.log('✓ Removed node_modules');
} catch (e) {
  console.log('node_modules already clean');
}

console.log('Removing .next...');
try {
  rmSync(resolve(cwd, '.next'), { recursive: true, force: true });
  console.log('✓ Removed .next');
} catch (e) {
  console.log('.next already clean');
}

console.log('Removing pnpm-lock.yaml...');
try {
  rmSync(resolve(cwd, 'pnpm-lock.yaml'), { force: true });
  console.log('✓ Removed pnpm-lock.yaml');
} catch (e) {
  console.log('pnpm-lock.yaml already clean');
}

console.log('\nReinstalling dependencies...');
execSync('pnpm install', { stdio: 'inherit', cwd });

console.log('\n✓ Clean install complete!');
