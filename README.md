# Claude Remotion Video App

Create video animations from natural language prompts using **Claude Code** and **Remotion**. Tell your AI assistant what kind of video you want, and it will generate the Remotion code for you.

Includes **BuildAtScale Claude Code Plugins** for AI image generation, professional promo video creation with voiceover, git workflow automation, and safety hooks.

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

plugins/                  # Claude Code Plugins (BuildAtScale)
├── buildatscale/         # Core tools: git commands, safety hooks
│   ├── commands/         # /commit, /pr, /ceo slash commands
│   ├── hooks/            # bash-guard, file-guard, cleanup, force-push block
│   └── scripts/          # Enhanced statusline
├── nano-banana-pro/      # AI image generation (Google Gemini)
│   └── skills/generate/  # Image generation skill + Python script
└── promo-video/          # Professional promo video creation
    └── skills/promo-video/
        ├── scripts/      # Voiceover generation (ElevenLabs)
        └── music/        # 3 royalty-free background tracks
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Remotion Studio (preview) |
| `npm run create-video -- "prompt"` | Save prompt for AI to use |
| `npm run build` | Bundle the Remotion project |
| `npm test` | Run automated tests |
| `npx remotion render src/index.ts <Id> out.mp4` | Render composition to MP4 |

## Claude Code Plugins

### Add the Marketplace

```bash
/plugin marketplace add https://github.com/buildatscale-tv/claude-code-plugins
```

### Install Plugins

```bash
/plugin install buildatscale@buildatscale-claude-code
/plugin install nano-banana-pro@buildatscale-claude-code
/plugin install promo-video@buildatscale-claude-code
```

---

### buildatscale (Core Tools)

Git workflow automation and safety hooks.

**Slash Commands:**
- `/buildatscale:commit` - Create commit message(s) for staged/unstaged changes, breaking into logical units
- `/buildatscale:pr` - Create pull request with GitHub CLI, auto-branching from main/master
- `/buildatscale:ceo` - Create executive summary of work from git history

**Safety Hooks (automatic):**
- `bash-guard.sh` - Blocks dangerous bash commands (sudo, credential access, disk ops, exfiltration)
- `file-guard.sh` - Blocks writes to system directories, config files, and credential files
- `file-write-cleanup.sh` - Removes trailing whitespace and ensures newlines on file write
- `git-block-force-push.sh` - Prevents force pushes

**Statusline Setup:**

Add to `~/.claude/settings.json`:
```json
{
  "statusLine": {
    "type": "command",
    "command": "bash plugins/buildatscale/scripts/statusline.sh --detail full --color-usage warnings --cost"
  }
}
```

| Flag | Description | Default |
|------|-------------|---------|
| `--display <free\|used>` | What to show: free (runway left) or used (consumed) | `free` |
| `--detail <full\|minimal>` | `full` (progress bar + %) or `minimal` (just %) | `minimal` |
| `--color-usage` | Colorize context gauge (green/yellow/red) | off |
| `--color-usage warnings` | Only color at warning/critical levels | — |
| `--cost` | Show session cost | off |
| `--no-color` | Disable all ANSI colors | off |

---

### nano-banana-pro (Image Generation)

Generate images using Google's Gemini models (Flash for speed, Pro for quality).

**Prerequisites:**
- [uv](https://docs.astral.sh/uv/) - Python package manager
- `GEMINI_API_KEY` environment variable with your Google AI API key

**Usage:**
```bash
uv run plugins/nano-banana-pro/skills/generate/scripts/image.py \
  --prompt "Your image description" \
  --output "./output.png"
```

| Option | Description | Default |
|--------|-------------|---------|
| `--prompt` | Image description (required) | — |
| `--output` | Output file path (required) | — |
| `--aspect` | `square`, `landscape`, `portrait` | `square` |
| `--reference` | Reference image path (repeatable) | — |
| `--model` | `flash` (fast) or `pro` (high-quality, up to 4K) | `flash` |
| `--size` | `1K`, `2K`, `4K` (pro model only) | `1K` |

---

### promo-video (Professional Video Creation)

Create professional promotional videos with AI voiceover and background music. 5-phase guided workflow.

**Prerequisites:**
- Node.js 18+ (for Remotion)
- Python 3.x (for voiceover script)
- ffmpeg (for audio/video processing)
- `ELEVEN_LABS_API_KEY` environment variable
- Whisper (optional, for timing verification): `pip install openai-whisper`

**What it creates:**
- 1920x1080 full HD promotional videos
- AI-generated voiceover synced to on-screen visuals
- Background music mixing with fade in/out
- Professional transitions (metallic swoosh, zoom through, fade, slide)

**Included resources:**
- 3 royalty-free background music tracks (Pixabay)
- ElevenLabs voiceover generation script with Whisper timing verification
- Metallic swoosh transition implementation
- Visual design patterns and animation techniques

**Skill files:**
- `plugins/promo-video/skills/promo-video/SKILL.md` - Full 5-phase workflow
- `plugins/promo-video/skills/promo-video/promo-patterns.md` - Visual inspiration
- `plugins/promo-video/skills/promo-video/voiceover.md` - Voiceover generation guide
- `plugins/promo-video/skills/promo-video/metallic-swoosh.md` - Transition implementation

---

## How It Works

1. **Remotion** - React-based framework for programmatic video creation
2. **Remotion Agent Skills** - Installed in `.agents/skills/` - teaches AI best practices
3. **CLAUDE.md** - Project context file that guides AI when creating videos
4. **Claude Code Plugins** - Installed in `plugins/` - image generation, promo video workflow, git automation

When you ask for a video, the AI generates React components using Remotion's APIs (`useCurrentFrame`, `interpolate`, `spring`, `Sequence`) and registers them in `Root.tsx`.

## Resources

- [Remotion Docs](https://www.remotion.dev/docs)
- [Prompting videos with Claude Code](https://www.remotion.dev/docs/ai/claude-code)
- [Remotion Prompt Gallery](https://www.remotion.dev/prompts)
- [BuildAtScale Claude Code Plugins](https://github.com/buildatscale-tv/claude-code-plugins)
