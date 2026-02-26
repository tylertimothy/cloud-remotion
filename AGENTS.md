# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is a single-project **Remotion** (React-based video framework) app with **BuildAtScale Claude Code Plugins** integrated. No external services, databases, or Docker are required for the core Remotion app. All commands are documented in `README.md` and `package.json`.

The plugins provide: git workflow automation (buildatscale), AI image generation via Google Gemini (nano-banana-pro), and professional promo video creation with voiceover (promo-video). See `CLAUDE.md` for full plugin documentation.

### Key commands

| Action | Command |
|--------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` (Remotion Studio on port 3000) |
| Type check | `npx tsc --noEmit` |
| Tests | `node --test tests/create-video.test.js` |
| Build | `npm run build` |
| Render video | `npx remotion render src/index.ts <CompositionId> out.mp4` |
| Generate image | `uv run plugins/nano-banana-pro/skills/generate/scripts/image.py --prompt "..." --output out.png` |
| Generate voiceover | `python3 plugins/promo-video/skills/promo-video/scripts/generate_voiceover.py` |

### Gotchas

- **`npm test` on Node v22**: The `node --test tests/` directory form may fail with a module resolution error. Use `node --test tests/create-video.test.js` (explicit file) or `node --test 'tests/**/*.test.js'` (glob) instead.
- **Remotion Studio**: Runs on port 3000. The dev server starts and stays running in the background; the initial terminal output may look like it exited, but `curl http://localhost:3000` confirms it is serving.
- **No ESLint config file**: The project has `@remotion/eslint-plugin` as a devDependency but no `.eslintrc` or `eslint.config.*` file, so `npx eslint` will not produce meaningful results without first creating a config.
- **ESM project**: `"type": "module"` is set in `package.json`. All source uses ES module imports.
- **Plugin hooks require `jq`**: The safety hooks in `plugins/buildatscale/hooks/` parse JSON via `jq`. It is pre-installed in the cloud environment.
- **Image generation requires `GEMINI_API_KEY`**: The nano-banana-pro plugin needs this env var set. Also requires `uv` (Python package manager). The `uv` binary lives at `~/.local/bin/uv`; ensure `PATH` includes `$HOME/.local/bin`. Gemini-generated PNGs are ~1MB each; convert to JPEG with `ffmpeg` before using in Remotion compositions to avoid browser crashes.
- **Voiceover generation requires `ELEVEN_LABS_API_KEY`**: The promo-video plugin needs this env var for ElevenLabs API. Also requires `ffmpeg` (pre-installed). The free tier has very limited credits (~50 characters); keep test texts short (under 30 characters) to avoid quota errors. The `generate_voiceover.py` script's `sections` list must be edited before running.
- **Music files are binary MP3s**: The 3 royalty-free tracks in `plugins/promo-video/skills/promo-video/music/` are committed as binary files. They are used by the promo-video workflow for background music mixing.
- **Remotion composition performance**: Large images and complex CSS (filters, drop-shadow, backdrop-filter) can crash the browser preview. Use optimized JPEG images (under 200KB each), limit particle/animated element count, and avoid `drop-shadow` or `backdrop-filter` in image-heavy scenes. Timeline scrubbing works even when continuous playback crashes.
- **Remotion `interpolate()` ranges**: The `inputRange` array must be strictly monotonically increasing. When building fade-in/fade-out ranges like `[0, fadeIn, duration-fadeOut, duration]`, guard against cases where `fadeOut=0` produces duplicate values (e.g., `[0,12,90,90]`).
