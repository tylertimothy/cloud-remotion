# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is a single-project **Remotion** (React-based video framework) app. No external services, databases, or Docker are required. All commands are documented in `README.md` and `package.json`.

### Key commands

| Action | Command |
|--------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` (Remotion Studio on port 3000) |
| Type check | `npx tsc --noEmit` |
| Tests | `node --test tests/create-video.test.js` |
| Build | `npm run build` |
| Render video | `npx remotion render src/index.ts <CompositionId> out.mp4` |

### Gotchas

- **`npm test` on Node v22**: The `node --test tests/` directory form may fail with a module resolution error. Use `node --test tests/create-video.test.js` (explicit file) or `node --test 'tests/**/*.test.js'` (glob) instead.
- **Remotion Studio**: Runs on port 3000. The dev server starts and stays running in the background; the initial terminal output may look like it exited, but `curl http://localhost:3000` confirms it is serving.
- **No ESLint config file**: The project has `@remotion/eslint-plugin` as a devDependency but no `.eslintrc` or `eslint.config.*` file, so `npx eslint` will not produce meaningful results without first creating a config.
- **ESM project**: `"type": "module"` is set in `package.json`. All source uses ES module imports.
