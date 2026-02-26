# Claude Remotion Video App

Create video animations from natural language prompts using **Claude Code** and **Remotion**. Tell your AI assistant what kind of video you want, and it will generate the Remotion code for you.

## Quick Start

```bash
npm install
npm run dev
```

Then open Remotion Studio in your browser to preview videos.

## Creating Videos with Prompts

### Option 1: Tell Your AI Assistant Directly

In Cursor (or Claude Code), simply say:

> "Create a video animation: a 10-second product demo with a fade-in title and animated subtitle"

The AI has access to `CLAUDE.md` and Remotion skills, so it will:
1. Create a new composition in `src/compositions/`
2. Register it in `src/Root.tsx`
3. Use Remotion best practices (frame-driven animations, no CSS transitions)

### Option 2: Use the Prompt Script

```bash
npm run create-video -- "Cinematic intro with gradient background and company logo"
```

Then tell your AI:

> "Create the video animation described in prompts/latest.txt"

## Project Structure

```
src/
├── index.ts              # Entry point
├── Root.tsx              # Registers compositions
└── compositions/         # Your video components
    ├── HelloWorld.tsx    # Example
    └── PromptVideo.tsx   # Template
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Remotion Studio (preview) |
| `npm run create-video -- "prompt"` | Save prompt for AI to use |
| `npx remotion render src/index.ts <Id> out.mp4` | Render composition to MP4 |

## How It Works

1. **Remotion** - React-based framework for programmatic video creation
2. **Remotion Agent Skills** - Installed in `.agents/skills/` - teaches AI best practices
3. **CLAUDE.md** - Project context file that guides AI when creating videos

When you ask for a video, the AI generates React components using Remotion's APIs (`useCurrentFrame`, `interpolate`, `spring`, `Sequence`) and registers them in `Root.tsx`.

## Resources

- [Remotion Docs](https://www.remotion.dev/docs)
- [Prompting videos with Claude Code](https://www.remotion.dev/docs/ai/claude-code)
- [Remotion Prompt Gallery](https://www.remotion.dev/prompts)
