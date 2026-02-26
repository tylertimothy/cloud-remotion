# Claude Remotion Video App - AI Video Creation Context

This project uses **Remotion** (React-based video framework) with **Claude Code** to create video animations from natural language prompts. When you ask to create a video, you generate Remotion compositions that render as MP4/WebM.

## Project Structure

```
src/
├── index.ts              # Entry point - registers Root
├── Root.tsx              # Registers all compositions (add new ones here)
└── compositions/        # Video composition components
    ├── HelloWorld.tsx    # Example composition
    └── PromptVideo.tsx   # Template for prompt-based videos

plugins/                  # Claude Code plugins (BuildAtScale)
├── buildatscale/         # Core tools: commit/PR commands, safety hooks
│   ├── commands/         # Slash commands (commit, pr, ceo)
│   ├── hooks/            # Safety hooks (bash-guard, file-guard, etc.)
│   └── scripts/          # Enhanced statusline
├── nano-banana-pro/      # AI image generation (Google Gemini)
│   └── skills/generate/  # Image generation skill + scripts
└── promo-video/          # Professional promo video creation
    └── skills/promo-video/
        ├── scripts/      # Voiceover generation (ElevenLabs)
        └── music/        # Royalty-free background tracks

.claude-plugin/           # Plugin marketplace registry
└── marketplace.json
```

## How to Create Videos from Prompts

When the user asks you to create a video animation:

1. **Create a new composition** in `src/compositions/` - name it descriptively (e.g., `ProductDemo.tsx`, `IntroAnimation.tsx`)
2. **Register it in `src/Root.tsx`** - add a `<Composition>` with id, component, durationInFrames, fps, width, height
3. **Use Remotion APIs** - `useCurrentFrame()`, `useVideoConfig()`, `interpolate()`, `spring()` for animations
4. **Never use CSS transitions** - all animations must be frame-driven via `useCurrentFrame()`

## Remotion Best Practices (from .agents/skills)

- **Animations**: Use `interpolate(frame, [start, end], [from, to])` or `spring()` - multiply seconds by `fps`
- **Compositions**: Define in Root.tsx with `component`, `durationInFrames`, `fps`, `width`, `height`
- **Default props**: Pass JSON-serializable props for customization
- **Sequencing**: Use `<Sequence>` for multi-scene videos with `from` and `durationInFrames`

## Key Remotion Imports

```tsx
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from 'remotion';
```

## Commands

- `npm run dev` - Start Remotion Studio (preview)
- `npx remotion render src/index.ts <CompositionId> out.mp4` - Render to MP4

## Prompt Workflow

The user will say things like "create a video animation for X". You should:
1. Create the composition component
2. Register it in Root.tsx
3. Tell them to run `npm run dev` to preview or `npx remotion render src/index.ts <Id> out.mp4` to render

## Claude Code Plugins

This project includes the **BuildAtScale Claude Code Plugins** for enhanced productivity:

### buildatscale (Core Tools)

**Slash Commands:**
- `/buildatscale:commit` - Create commit message(s) for staged/unstaged changes, breaking into logical units
- `/buildatscale:pr` - Create pull request with GitHub CLI, auto-branching from main/master
- `/buildatscale:ceo` - Create executive summary of work from git history

**Safety Hooks (automatic):**
- `bash-guard.sh` - Blocks dangerous bash commands (sudo, credential access, disk ops, exfiltration)
- `file-guard.sh` - Blocks writes to system directories, config files, and credential files
- `file-write-cleanup.sh` - Removes trailing whitespace and ensures newlines on file write
- `git-block-force-push.sh` - Prevents force pushes

**Scripts:**
- `statusline.sh` - Enhanced status line with context runway gauge, git branch, cost display

### nano-banana-pro (Image Generation)

Generate images using Google's Gemini models (Flash for speed, Pro for quality).

**Prerequisites:** `GEMINI_API_KEY` environment variable, `uv` Python package manager

**Usage:**
```bash
uv run plugins/nano-banana-pro/skills/generate/scripts/image.py \
  --prompt "Your image description" \
  --output "./output.png"
```

Options: `--aspect` (square/landscape/portrait), `--reference` (style reference image), `--model` (flash/pro), `--size` (1K/2K/4K for pro)

### promo-video (Professional Video Creation)

Create professional promotional videos with AI voiceover and background music. 5-phase workflow: product analysis → theme selection → Remotion build → voiceover generation → music + final render.

**Prerequisites:** `ELEVEN_LABS_API_KEY` environment variable, `ffmpeg`, Python 3.x

**Resources:**
- `plugins/promo-video/skills/promo-video/SKILL.md` - Full 5-phase workflow guide
- `plugins/promo-video/skills/promo-video/promo-patterns.md` - Visual inspiration and animation techniques
- `plugins/promo-video/skills/promo-video/voiceover.md` - Voiceover generation and timing guide
- `plugins/promo-video/skills/promo-video/metallic-swoosh.md` - Metallic shine transition implementation
- `plugins/promo-video/skills/promo-video/scripts/generate_voiceover.py` - ElevenLabs voiceover generation
- `plugins/promo-video/skills/promo-video/music/` - 3 royalty-free background tracks
