import React from 'react';
import { Composition } from 'remotion';
import { PromptVideo } from './compositions/PromptVideo';
import { HelloWorld } from './compositions/HelloWorld';
import { FlowerTowTruck } from './compositions/FlowerTowTruck';
import { IceCubePromo } from './compositions/IceCubePromo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="IceCubePromo"
        component={IceCubePromo}
        durationInFrames={550}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="FlowerTowTruck"
        component={FlowerTowTruck}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="PromptVideo"
        component={PromptVideo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'AI-Generated Video',
          subtitle: 'Created with Claude + Remotion',
        }}
      />
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
