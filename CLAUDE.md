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
