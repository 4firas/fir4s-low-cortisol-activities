import React from 'react';
import { animated, config } from '@react-spring/three';
import { Color } from 'three';
import { Text } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';
import bookFillPoints from './lines/bookFill';
import bookLinesPoints from './lines/bookLines';
import { Scribble } from './Scribble';
import { CoordArray } from './CoordArray';
import { fontUrls } from './typography';
import { useTrueAfterDelay } from './useTrueAfterDelay';
import colors from './colors';
import { useBreakpoints } from './useBreakpoints';

const bookFillColor = new Color('#3A2A1A');
const bookLinesColorVal = new Color(colors.blueSlate);
const notebookRotation: [number, number, number] = [Math.PI, 0, 0];

export function Notebook({ ...groupProps }:GroupProps) {
  let time = 450;
  const linesVisible = useTrueAfterDelay(time += 1000);
  const fillVisible = useTrueAfterDelay(time += 500);

  const breakpoints = useBreakpoints();

  const position:CoordArray = breakpoints.menu ? [4, 1.3, 2.5] : [-1.5, 3.8, 1.8];

  return (
    <animated.group
      {...groupProps}
      position={position}
    >
      <Scribble
        points={(bookFillPoints as CoordArray[])}
        size={1.5}
        position={[0.2, 0, -0.3]}
        lineWidth={0.5}
        color={bookFillColor}
        rotation={notebookRotation}
        visible={fillVisible}
        drawSpringConfig={config.molasses}
        curved
        nPointsInCurve={100}
      />
      <Scribble
        points={(bookLinesPoints as CoordArray[])}
        size={1.5}
        position={[0, 0, 0]}
        lineWidth={0.015}
        color={bookLinesColorVal}
        rotation={notebookRotation}
        visible={linesVisible}
        curved
        nPointsInCurve={700}
      />
      {/* @ts-ignore */}
      <Text
        position={[0, 0, 0.1]}
        rotation={[0, 0, 0]}
        color={colors.blueSlate}
        anchorX="center"
        anchorY="middle"
        fontSize={0.25}
        font={fontUrls.bryantBold}
        visible={linesVisible}
      >
        {'Blog\ncoming\nsoon'.toUpperCase()}
      </Text>
    </animated.group>
  );
}
