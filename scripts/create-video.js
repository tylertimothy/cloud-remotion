#!/usr/bin/env node
/**
 * Create Video - Prompt-based video creation helper
 *
 * Usage:
 *   node scripts/create-video.js "Create a product demo with fade-in title"
 *   npm run create-video -- "Your video prompt here"
 *
 * This script saves your prompt to prompts/latest.txt so you can tell
 * your AI assistant (Claude/Cursor) to create the video using that prompt.
 * The AI will generate Remotion code based on your description.
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const promptsDir = join(__dirname, '..', 'prompts');
const latestPath = join(promptsDir, 'latest.txt');
const historyPath = join(promptsDir, 'history.txt');

const prompt = process.argv.slice(2).join(' ').trim();

if (!prompt) {
  console.log(`
Claude Remotion Video App - Create Video from Prompt

Usage:
  npm run create-video -- "Your video description here"
  node scripts/create-video.js "Create a 10-second intro with my company logo"

Examples:
  npm run create-video -- "Product demo with fade-in title and subtitle"
  npm run create-video -- "Cinematic intro with gradient background"
  npm run create-video -- "Animated list of 5 features with icons"

Then tell your AI assistant (in Cursor/Claude):
  "Create the video animation described in prompts/latest.txt"

Or directly:
  "Create a video animation: [paste your prompt]"
`);
  process.exit(0);
}

if (!existsSync(promptsDir)) {
  mkdirSync(promptsDir, { recursive: true });
}

writeFileSync(latestPath, prompt, 'utf8');

// Append to history
const timestamp = new Date().toISOString();
const historyEntry = `[${timestamp}] ${prompt}\n`;
try {
  const existing = existsSync(historyPath) ? readFileSync(historyPath, 'utf8') : '';
  writeFileSync(historyPath, existing + historyEntry, 'utf8');
} catch {
  writeFileSync(historyPath, historyEntry, 'utf8');
}

console.log(`\n✓ Prompt saved to prompts/latest.txt\n`);
console.log(`Your prompt: "${prompt}"\n`);
console.log(`Next step: Tell your AI assistant in Cursor:\n`);
console.log(`  "Create the video animation described in prompts/latest.txt"\n`);
console.log(`Or run: npm run dev (to preview) or npx remotion render src/index.ts <CompositionId> out.mp4\n`);
