/**
 * Tests for the create-video script
 */
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const promptsDir = join(projectRoot, 'prompts');
const latestPath = join(promptsDir, 'latest.txt');

describe('create-video script', () => {
  it('saves prompt to prompts/latest.txt when run with a prompt', () => {
    const testPrompt = `Test video prompt ${Date.now()}`;
    execSync(`node scripts/create-video.js "${testPrompt}"`, {
      cwd: projectRoot,
      encoding: 'utf8',
    });

    assert.ok(existsSync(latestPath), 'prompts/latest.txt should exist');
    const content = readFileSync(latestPath, 'utf8');
    assert.strictEqual(content, testPrompt, 'Saved prompt should match input');
  });
});
