import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Img,
  staticFile,
} from 'remotion';

const SCENES = {
  HOOK: { start: 0, duration: 90 },
  APP_REVEAL: { start: 90, duration: 90 },
  PHONE_MOCKUP: { start: 180, duration: 105 },
  FEATURES: { start: 285, duration: 105 },
  SOCIAL_PROOF: { start: 390, duration: 75 },
  CTA: { start: 465, duration: 85 },
};

const FloatingParticles: React.FC = () => {
  const frame = useCurrentFrame();
  const particles = Array.from({ length: 8 }, (_, i) => {
    const baseX = (i * 23 + 10) % 90;
    const speed = 0.4 + (i % 3) * 0.2;
    const yPos = ((frame * speed + i * 80) % 120) - 10;
    const opacity = yPos > 10 && yPos < 100 ? 0.4 : 0;
    const size = 3 + (i % 3) * 2;
    return { x: baseX, y: yPos, opacity, size };
  });

  return (
    <>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.5)',
            opacity: p.opacity,
          }}
        />
      ))}
    </>
  );
};

const GradientBackground: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <AbsoluteFill
    style={{
      background: dark
        ? 'linear-gradient(160deg, #0a1628 0%, #0d2137 30%, #0f2b4a 60%, #0a1a30 100%)'
        : 'linear-gradient(160deg, #e8f4fd 0%, #b8d8f0 30%, #7ab8e0 60%, #4a90c4 100%)',
    }}
  />
);

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgScale = interpolate(frame, [0, 90], [1.1, 1], {
    extrapolateRight: 'clamp',
  });

  const iconScale = spring({ frame: frame - 15, fps, config: { damping: 12, mass: 0.8 } });
  const iconFloat = Math.sin(frame / 15) * 8;

  const taglineOpacity = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const taglineY = spring({ frame: frame - 40, fps, config: { damping: 18 } });

  const shimmerPos = interpolate(frame, [50, 80], [-100, 200], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <div style={{ transform: `scale(${bgScale})`, width: '100%', height: '100%' }}>
        <Img
          src={staticFile('assets/gradient-bg.jpg')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <FloatingParticles />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            transform: `scale(${iconScale}) translateY(${iconFloat - 40}px)`,
            filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.3))',
          }}
        >
          <Img
            src={staticFile('assets/ice-cube-hero.jpg')}
            style={{ width: 520, height: 520, objectFit: 'contain' }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 180,
            opacity: taglineOpacity,
            transform: `translateY(${(1 - taglineY) * 30}px)`,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 42,
              fontWeight: 300,
              color: '#1a3a5c',
              letterSpacing: 8,
              textTransform: 'uppercase',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            Time, Reimagined
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: `${shimmerPos}%`,
                width: 60,
                height: '100%',
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const AppRevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const nameScale = spring({ frame: frame - 10, fps, config: { damping: 14, mass: 0.6 } });
  const nameOpacity = interpolate(frame, [8, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const subtitleOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const subtitleY = spring({ frame: frame - 30, fps, config: { damping: 20 } });

  const lineWidth = interpolate(frame, [20, 50], [0, 400], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const glowPulse = 0.3 + Math.sin(frame / 10) * 0.15;

  return (
    <AbsoluteFill>
      <GradientBackground dark />
      <FloatingParticles />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 30,
        }}
      >
        <div
          style={{
            fontSize: 110,
            fontWeight: 200,
            color: '#ffffff',
            letterSpacing: 18,
            textTransform: 'uppercase',
            opacity: nameOpacity,
            transform: `scale(${nameScale})`,
            textShadow: `0 0 80px rgba(120, 180, 255, ${glowPulse})`,
          }}
        >
          Ice Chronos
        </div>
        <div
          style={{
            width: lineWidth,
            height: 1,
            background:
              'linear-gradient(90deg, transparent, rgba(120, 200, 255, 0.8), transparent)',
          }}
        />
        <div
          style={{
            fontSize: 32,
            fontWeight: 300,
            color: 'rgba(180, 210, 240, 0.9)',
            letterSpacing: 12,
            textTransform: 'uppercase',
            opacity: subtitleOpacity,
            transform: `translateY(${(1 - subtitleY) * 20}px)`,
          }}
        >
          Freeze Every Moment
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const PhoneMockupScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneScale = spring({ frame: frame - 5, fps, config: { damping: 13, mass: 0.7 } });
  const phoneFloat = Math.sin(frame / 18) * 6;
  const phoneRotateY = interpolate(frame, [0, 105], [-5, 5], {
    extrapolateRight: 'clamp',
  });

  const badgeOpacity = interpolate(frame, [50, 65], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const badgeScale = spring({ frame: frame - 50, fps, config: { damping: 10, mass: 0.5 } });

  return (
    <AbsoluteFill>
      <GradientBackground dark />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            transform: `scale(${phoneScale}) translateY(${phoneFloat}px) perspective(1200px) rotateY(${phoneRotateY}deg)`,
          }}
        >
          <Img
            src={staticFile('assets/phone-mockup.jpg')}
            style={{ height: 820, objectFit: 'contain' }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            right: 180,
            top: 160,
            opacity: badgeOpacity,
            transform: `scale(${badgeScale})`,
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              borderRadius: 24,
              padding: '24px 40px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 22, color: 'rgba(180, 220, 255, 0.7)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>
              Available on
            </div>
            <div style={{ fontSize: 36, fontWeight: 600, color: '#fff' }}>App Store</div>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 160,
            bottom: 180,
            opacity: badgeOpacity,
            transform: `scale(${badgeScale})`,
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              borderRadius: 24,
              padding: '24px 40px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 22, color: 'rgba(180, 220, 255, 0.7)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>
              Also on
            </div>
            <div style={{ fontSize: 36, fontWeight: 600, color: '#fff' }}>Google Play</div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const FeatureItem: React.FC<{
  icon: string;
  title: string;
  description: string;
  delay: number;
  index: number;
}> = ({ icon, title, description, delay, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryScale = spring({ frame: frame - delay, fps, config: { damping: 14 } });
  const opacity = interpolate(frame, [delay, delay + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const xOffset = (1 - entryScale) * 40;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 32,
        opacity,
        transform: `translateX(${xOffset}px) scale(${entryScale})`,
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 20,
          background: 'linear-gradient(135deg, rgba(100, 180, 255, 0.2), rgba(60, 130, 220, 0.1))',
          border: '1px solid rgba(120, 200, 255, 0.2)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 36,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            color: '#ffffff',
            marginBottom: 6,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 24,
            color: 'rgba(180, 210, 240, 0.7)',
            fontWeight: 300,
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
};

const FeaturesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [5, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleScale = spring({ frame: frame - 5, fps, config: { damping: 18 } });

  const features = [
    { icon: '⏰', title: 'Smart Alarms', description: 'Wake up naturally with adaptive alerts' },
    { icon: '⏱️', title: 'Precision Timer', description: 'Crystal-clear countdown tracking' },
    { icon: '🌍', title: 'World Clock', description: 'Every timezone at a glance' },
  ];

  const multiScreenOpacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const multiScreenScale = spring({ frame: frame - 10, fps, config: { damping: 15 } });

  return (
    <AbsoluteFill>
      <GradientBackground dark />
      <AbsoluteFill
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: '0 100px',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 40,
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontWeight: 200,
              color: '#ffffff',
              letterSpacing: 6,
              textTransform: 'uppercase',
              opacity: titleOpacity,
              transform: `scale(${titleScale})`,
              marginBottom: 20,
            }}
          >
            Features
          </div>
          {features.map((f, i) => (
            <FeatureItem
              key={i}
              icon={f.icon}
              title={f.title}
              description={f.description}
              delay={15 + i * 15}
              index={i}
            />
          ))}
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            opacity: multiScreenOpacity,
            transform: `scale(${multiScreenScale})`,
          }}
        >
          <Img
            src={staticFile('assets/multi-screen.jpg')}
            style={{ width: 780, objectFit: 'contain' }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SocialProofScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ratingScale = spring({ frame: frame - 5, fps, config: { damping: 12 } });
  const ratingOpacity = interpolate(frame, [3, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const statsOpacity = interpolate(frame, [25, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const downloadCount = Math.min(
    500000,
    Math.floor(interpolate(frame, [30, 60], [0, 500000], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }))
  );

  return (
    <AbsoluteFill>
      <GradientBackground dark />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 50,
        }}
      >
        <div
          style={{
            opacity: ratingOpacity,
            transform: `scale(${ratingScale})`,
          }}
        >
          <Img
            src={staticFile('assets/rating-stars.jpg')}
            style={{ width: 500, objectFit: 'contain' }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            gap: 100,
            opacity: statsOpacity,
          }}
        >
          {[
            { value: `${(downloadCount / 1000).toFixed(0)}K+`, label: 'Downloads' },
            { value: '50+', label: 'Countries' },
            { value: '#1', label: 'Clock App' },
          ].map((stat, i) => {
            const statScale = spring({ frame: frame - 30 - i * 8, fps, config: { damping: 14 } });
            return (
              <div
                key={i}
                style={{
                  textAlign: 'center',
                  transform: `scale(${statScale})`,
                }}
              >
                <div
                  style={{
                    fontSize: 64,
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: 22,
                    color: 'rgba(180, 210, 240, 0.6)',
                    letterSpacing: 4,
                    textTransform: 'uppercase',
                    marginTop: 10,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconScale = spring({ frame: frame - 5, fps, config: { damping: 10, mass: 0.6 } });
  const iconFloat = Math.sin(frame / 12) * 5;

  const titleOpacity = interpolate(frame, [15, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleY = spring({ frame: frame - 15, fps, config: { damping: 18 } });

  const buttonOpacity = interpolate(frame, [35, 48], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const buttonScale = spring({ frame: frame - 35, fps, config: { damping: 12 } });

  const buttonGlow = 0.3 + Math.sin(frame / 8) * 0.2;

  return (
    <AbsoluteFill>
      <GradientBackground dark />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 40,
        }}
      >
        <div
          style={{
            transform: `scale(${iconScale}) translateY(${iconFloat}px)`,
          }}
        >
          <Img
            src={staticFile('assets/ice-cube-hero.jpg')}
            style={{ width: 300, height: 300, objectFit: 'contain' }}
          />
        </div>

        <div
          style={{
            textAlign: 'center',
            opacity: titleOpacity,
            transform: `translateY(${(1 - titleY) * 25}px)`,
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 200,
              color: '#ffffff',
              letterSpacing: 14,
              textTransform: 'uppercase',
            }}
          >
            Ice Chronos
          </div>
          <div
            style={{
              fontSize: 28,
              color: 'rgba(180, 210, 240, 0.7)',
              letterSpacing: 8,
              textTransform: 'uppercase',
              marginTop: 10,
            }}
          >
            A cooler way to keep time
          </div>
        </div>

        <div
          style={{
            opacity: buttonOpacity,
            transform: `scale(${buttonScale})`,
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #4a9eff, #2d7ad6)',
              borderRadius: 60,
              padding: '22px 80px',
              fontSize: 30,
              fontWeight: 600,
              color: '#ffffff',
              letterSpacing: 4,
              textTransform: 'uppercase',
              boxShadow: `0 0 60px rgba(74, 158, 255, ${buttonGlow}), 0 10px 30px rgba(0,0,0,0.3)`,
            }}
          >
            Download Free
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const CrossfadeTransition: React.FC<{
  children: React.ReactNode;
  startFrame: number;
  duration: number;
  fadeIn?: number;
  fadeOut?: number;
}> = ({ children, startFrame, duration, fadeIn = 12, fadeOut = 12 }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  let opacity: number;
  if (fadeOut <= 0) {
    opacity = interpolate(localFrame, [0, fadeIn], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  } else {
    const fadeOutStart = Math.max(fadeIn + 1, duration - fadeOut);
    opacity = interpolate(
      localFrame,
      [0, fadeIn, fadeOutStart, duration],
      [0, 1, 1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  }

  return <div style={{ position: 'absolute', inset: 0, opacity }}>{children}</div>;
};

export const IceCubePromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a1628', fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif" }}>
      <Sequence from={SCENES.HOOK.start} durationInFrames={SCENES.HOOK.duration + 15}>
        <CrossfadeTransition startFrame={0} duration={SCENES.HOOK.duration + 15}>
          <HookScene />
        </CrossfadeTransition>
      </Sequence>

      <Sequence from={SCENES.APP_REVEAL.start - 5} durationInFrames={SCENES.APP_REVEAL.duration + 15}>
        <CrossfadeTransition startFrame={0} duration={SCENES.APP_REVEAL.duration + 15}>
          <AppRevealScene />
        </CrossfadeTransition>
      </Sequence>

      <Sequence from={SCENES.PHONE_MOCKUP.start - 5} durationInFrames={SCENES.PHONE_MOCKUP.duration + 15}>
        <CrossfadeTransition startFrame={0} duration={SCENES.PHONE_MOCKUP.duration + 15}>
          <PhoneMockupScene />
        </CrossfadeTransition>
      </Sequence>

      <Sequence from={SCENES.FEATURES.start - 5} durationInFrames={SCENES.FEATURES.duration + 15}>
        <CrossfadeTransition startFrame={0} duration={SCENES.FEATURES.duration + 15}>
          <FeaturesScene />
        </CrossfadeTransition>
      </Sequence>

      <Sequence from={SCENES.SOCIAL_PROOF.start - 5} durationInFrames={SCENES.SOCIAL_PROOF.duration + 15}>
        <CrossfadeTransition startFrame={0} duration={SCENES.SOCIAL_PROOF.duration + 15}>
          <SocialProofScene />
        </CrossfadeTransition>
      </Sequence>

      <Sequence from={SCENES.CTA.start - 5} durationInFrames={SCENES.CTA.duration + 5}>
        <CrossfadeTransition startFrame={0} duration={SCENES.CTA.duration + 5} fadeOut={0}>
          <CTAScene />
        </CrossfadeTransition>
      </Sequence>
    </AbsoluteFill>
  );
};
