import React from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Stats,
} from '@react-three/drei';
import { LinearToneMapping } from 'three';
import { A11yAnnouncer } from './a11yShim';
import { SceneDirector } from './SceneDirector';
import { SiteData } from './SiteData';
import { useParamOnLoad } from './useParamOnLoad';

const ThreeCanvas = ({ siteData }: { siteData: SiteData }) => {
  const showStats = useParamOnLoad('stats') === 'true';

  return (
    <>
      <Canvas
        // eslint-disable-next-line no-param-reassign
        onCreated={({ gl }) => { gl.toneMapping = LinearToneMapping; gl.setClearColor('#534328', 1); gl.setPixelRatio(Math.min(window.devicePixelRatio, 2)); }}
        dpr={[1, 2]}
        gl={{ alpha: false }}
      >
        <SceneDirector siteData={siteData} />
        {showStats && <Stats />}
        <ambientLight />
      </Canvas>
      <A11yAnnouncer />
    </>
  );
};
export default ThreeCanvas;
