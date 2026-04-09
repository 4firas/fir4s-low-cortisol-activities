import React, { useMemo } from 'react';
import { Color } from 'three';
import squiggle1Points from './lines/squiggle1';
import squiggleCirclePoints from './lines/squiggleCircle';
import { Scribble } from './Scribble';
import { CoordArray } from './CoordArray';
import { useTrueAfterDelay } from './useTrueAfterDelay';

const squiggle1Color = new Color(0x5D7F8C);
const squiggleCircleColor = new Color(0x996515);
const squiggle1Rotation: CoordArray = [0, Math.PI, Math.PI];
const squiggle1Position: CoordArray = [-4, -0.5, -34];
const squiggleCirclePosition: CoordArray = [13, -5, -20.4];

export const BackgroundScribbles = React.memo(function BackgroundScribbles() {
  let time = 0;
  const squiggle1Visible = useTrueAfterDelay(time += 50);
  const squiggle2Visible = useTrueAfterDelay(time += 400);

  return (
    <>
      <Scribble
        points={(squiggle1Points as CoordArray[])}
        size={130}
        position={squiggle1Position}
        lineWidth={3.5}
        color={squiggle1Color}
        rotation={squiggle1Rotation}
        visible={squiggle1Visible}
        curved
        nPointsInCurve={1200}
      />
      <Scribble
        points={(squiggleCirclePoints as CoordArray[])}
        size={40}
        position={squiggleCirclePosition}
        lineWidth={0.5}
        color={squiggleCircleColor}
        rotation={squiggle1Rotation}
        visible={squiggle2Visible}
        curved
        closed
        nPointsInCurve={700}
      />
    </>
  );
});
