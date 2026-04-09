import React, { useEffect, useState } from 'react';
import {
  GroupProps,
} from '@react-three/fiber';
import { Color } from 'three';
import { useUnmountEffect } from '@react-hookz/web';
import { useA11y } from './a11yShim';
import { CustomCursorState, useCursorSetters } from './CustomCursor';
import circlePoints from './lines/circle';
import { Scribble } from './Scribble';
import { CoordArray } from './CoordArray';

const debugColor = new Color(0xff0000);
const focusRingColor = new Color(0xff0000);
const focusRingRotation: CoordArray = [Math.PI, 0, -Math.PI / 15];

export const InvisibleInteractiveMesh = ({
  width = 1,
  height = 1,
  debug = false,
  cursor = 'default',
  /** Must be idempotent */
  onFocus = () => {},
  /** Must be idempotent */
  onBlur = () => {},
  onClick = () => {},
  ...groupProps
}: {
  width?: number;
  height?: number;
  debug?: boolean;
  cursor?: CustomCursorState;
  /** Must be idempotent */
  onFocus?: () => void;
  /** Must be idempotent */
  onBlur?: () => void;
  onClick?: () => void;
} & GroupProps) => {
  const { startHover, stopHover } = useCursorSetters();

  const [hovering, setHovering] = useState(false);

  const { focus } = useA11y();

  // If hovering and the target cursor changes, call setCursor to change the cursor
  useEffect(() => {
    if (hovering) startHover(cursor);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor]);

  // If the component unmounts, reset cursor and blue
  useUnmountEffect(() => {
    if (hovering) stopHover();
    if (focus || hovering) onBlur();
  });

  // Fire on
  useEffect(() => {
    if (focus || hovering) onFocus();
    else onBlur();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus, hovering]);

  return (
    <group
      {...groupProps}
    >
      <mesh
        onPointerEnter={() => {
          startHover(cursor);
          setHovering(true);
        }}
        onPointerLeave={() => {
          stopHover();
          setHovering(false);
        }}
        onPointerOver={() => {
          startHover(cursor);
          setHovering(true);
        }}
        onPointerDown={() => { onClick(); }}
        position={[0, 0, 0]}
      >
        <boxGeometry
          attach="geometry"
          args={[width, height, 0.01]}
        />
        <meshStandardMaterial
          attach="material"
          color={debugColor}
          opacity={debug ? 0.3 : 0}
          transparent
          depthTest={false}
        />
      </mesh>

      <Scribble
        points={(circlePoints as CoordArray[])}
        size={Math.min(height, width)}
        position={[0, 0, 0.1]}
        lineWidth={0.1}
        color={focusRingColor}
        rotation={focusRingRotation}
        visible={focus}
        curved
        nPointsInCurve={100}
        drawSpringConfig={{
          duration: 300,
        }}
        depthTest={false}
        renderOrder={1000}
      />
    </group>
  );
};
