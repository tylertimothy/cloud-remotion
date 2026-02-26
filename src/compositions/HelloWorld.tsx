import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

export const HelloWorld: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = Math.min(1, frame / (fps * 0.5));

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0a0a0a',
        fontSize: 80,
        color: 'white',
      }}
    >
      <div style={{ opacity }}>Hello from Claude + Remotion!</div>
    </AbsoluteFill>
  );
};
