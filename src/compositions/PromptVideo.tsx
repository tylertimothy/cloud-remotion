import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export type PromptVideoProps = {
  title: string;
  subtitle: string;
};

export const PromptVideo: React.FC<PromptVideoProps> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, fps], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const subtitleOpacity = interpolate(frame, [fps, fps * 2], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const scale = interpolate(
    frame,
    [0, fps * 0.5],
    [0.8, 1],
    { extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          transform: `scale(${scale})`,
        }}
      >
        <h1
          style={{
            fontSize: 72,
            color: 'white',
            margin: 0,
            opacity: titleOpacity,
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 700,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: 36,
            color: 'rgba(255,255,255,0.8)',
            marginTop: 24,
            opacity: subtitleOpacity,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {subtitle}
        </p>
      </div>
    </AbsoluteFill>
  );
};
