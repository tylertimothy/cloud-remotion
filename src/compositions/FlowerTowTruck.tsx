import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';

export const FlowerTowTruck: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Flower blooms over first 3 seconds (0-90 frames)
  const bloomProgress = spring({
    frame,
    fps,
    config: {
      damping: 25,
      stiffness: 80,
    },
    durationInFrames: 90,
  });

  // Petals: scale from small (closed bud) to full (open flower)
  const petalScale = interpolate(bloomProgress, [0, 1], [0.4, 1.15]);
  const petalOpacity = interpolate(bloomProgress, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Tow truck reveals as flower opens (slight delay)
  const truckRevealProgress = interpolate(bloomProgress, [0.4, 0.9], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const truckScale = interpolate(truckRevealProgress, [0, 1], [0.5, 1]);
  const truckOpacity = interpolate(truckRevealProgress, [0, 0.5], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const petalCount = 8;
  const centerX = 960;
  const centerY = 540;

  // Petal tilt: when closed, petals tilt inward (overlap); when open, they spread flat
  const petalTilt = interpolate(bloomProgress, [0, 1], [-35, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#1a3a2e',
        background: 'linear-gradient(180deg, #87ceeb 0%, #98d8aa 40%, #2d5a3d 100%)',
      }}
    >
      {/* Stem */}
      <div
        style={{
          position: 'absolute',
          left: centerX - 15,
          top: centerY + 100,
          width: 30,
          height: 250,
          backgroundColor: '#228b22',
          borderRadius: 15,
          transform: 'rotate(-3deg)',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)',
        }}
      />

      {/* Petals - arranged in circle, bloom outward like flower opening */}
      {Array.from({ length: petalCount }).map((_, i) => {
        const baseAngle = (i / petalCount) * 360;
        const tiltAngle = baseAngle + petalTilt;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: centerX - 70,
              top: centerY - 100,
              width: 140,
              height: 180,
              transformOrigin: '70px 140px',
              transform: `rotate(${tiltAngle}deg) scale(${petalScale})`,
              opacity: petalOpacity,
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(180deg, #ffb6c1 0%, #ff69b4 40%, #ff1493 100%)',
                borderRadius: '50% 50% 45% 45%',
                boxShadow: '0 4px 20px rgba(0,0,0,0.25), inset 0 -10px 20px rgba(255,255,255,0.2)',
              }}
            />
          </div>
        );
      })}

      {/* Tow truck - simple SVG in center */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) scale(${truckScale})`,
          opacity: truckOpacity,
        }}
      >
        <svg
          width={280}
          height={140}
          viewBox="0 0 280 140"
          style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' }}
        >
          {/* Flatbed/tow bed */}
          <rect
            x={20}
            y={50}
            width={140}
            height={50}
            fill="#4a4a4a"
            stroke="#2a2a2a"
            strokeWidth={2}
            rx={4}
          />
          <rect
            x={25}
            y={55}
            width={130}
            height={40}
            fill="#5a5a5a"
            rx={2}
          />
          {/* Tow hitch */}
          <rect x={155} y={65} width={25} height={20} fill="#333" rx={2} />
          <circle cx={167} cy={95} r={12} fill="#222" stroke="#444" strokeWidth={2} />
          <circle cx={167} cy={95} r={6} fill="#666" />

          {/* Cab */}
          <rect
            x={170}
            y={40}
            width={90}
            height={70}
            fill="#c41e3a"
            stroke="#8b0000"
            strokeWidth={2}
            rx={6}
          />
          {/* Cab window */}
          <rect
            x={180}
            y={50}
            width={35}
            height={25}
            fill="#87ceeb"
            rx={2}
          />
          {/* Cab grill */}
          <rect x={220} y={55} width={30} height={20} fill="#333" rx={2} />
          {/* Headlights */}
          <rect x={255} y={55} width={8} height={6} fill="#ffeb3b" rx={1} />
          <rect x={255} y={65} width={8} height={6} fill="#ffeb3b" rx={1} />

          {/* Wheels */}
          <circle cx={70} cy={115} r={18} fill="#222" stroke="#444" strokeWidth={3} />
          <circle cx={70} cy={115} r={10} fill="#555" />
          <circle cx={70} cy={115} r={4} fill="#888" />

          <circle cx={170} cy={115} r={18} fill="#222" stroke="#444" strokeWidth={3} />
          <circle cx={170} cy={115} r={10} fill="#555" />
          <circle cx={170} cy={115} r={4} fill="#888" />

          <circle cx={250} cy={115} r={18} fill="#222" stroke="#444" strokeWidth={3} />
          <circle cx={250} cy={115} r={10} fill="#555" />
          <circle cx={250} cy={115} r={4} fill="#888" />

          {/* Tow truck text */}
          <text
            x={215}
            y={85}
            textAnchor="middle"
            fill="white"
            fontSize={14}
            fontWeight="bold"
            fontFamily="system-ui, sans-serif"
          >
            TOW
          </text>
          <text
            x={215}
            y={100}
            textAnchor="middle"
            fill="white"
            fontSize={14}
            fontWeight="bold"
            fontFamily="system-ui, sans-serif"
          >
            TRUCK
          </text>
        </svg>
      </div>
    </AbsoluteFill>
  );
};
