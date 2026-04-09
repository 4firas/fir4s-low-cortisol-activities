import React, { useEffect, useRef } from 'react';
import {
  Vector3,
  PerspectiveCamera,
  MathUtils,
} from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useEventListener } from 'usehooks-ts';
import { useHasNoMouse } from './useHasNoMouse';

export const CameraController = ({
  stagePosition,
  stageSize,
  lerpAlpha = 0.05,
  debug = false,
  controllable = true,
}:{
  stagePosition:[number, number, number],
  stageSize: [number, number],
  lerpAlpha?:number,
  debug?:boolean,
  controllable?:boolean,
}) => {
  const mouseNormalizeCoords = useRef<{ x: number; y: number; } | null>(null);

  const hasNoMouse = useHasNoMouse();

  useEventListener('mousemove', (e) => {
    mouseNormalizeCoords.current = {
      x: e.clientX / window.innerWidth - 0.5,
      y: (1 - e.clientY / window.innerHeight) - 0.5,
    };
  });

  const cameraDistance = useRef(5);

  const { camera } = useThree();

  useEffect(() => {
    const perspectiveCamera = camera as PerspectiveCamera;
    const [width, height] = stageSize;

    const heightFitDistance = (height / 2)
      / Math.tan(MathUtils.degToRad(perspectiveCamera.fov / 2));

    const widthFitDistance = ((width / 2) / perspectiveCamera.aspect)
    / Math.tan(MathUtils.degToRad(perspectiveCamera.fov / 2));

    cameraDistance.current = Math.max(widthFitDistance, heightFitDistance);
  }, [camera, stageSize]);

  const targetPosition = useRef(new Vector3());

  useFrame(() => {
    let displaceX = 0;
    let displaceY = 0;

    if (controllable && !hasNoMouse && mouseNormalizeCoords.current) {
      displaceX = mouseNormalizeCoords.current.x;
      displaceY = mouseNormalizeCoords.current.y;
    }

    const [x, y, z] = stagePosition;

    targetPosition.current.set(
      x + displaceX * 2,
      y + displaceY * 1,
      cameraDistance.current + z,
    );
    camera.position.lerp(targetPosition.current, lerpAlpha);
  });

  return (
    <mesh
      position={stagePosition}
      {...(debug ? {
        renderOrder: 2,
      } : {})}
    >
      <boxGeometry
        attach="geometry"
        args={[...stageSize, 0.01]}
      />
      <meshBasicMaterial
        attach="material"
        {...(debug ? {
          color: 'lime',
          transparent: true,
          opacity: 0.2,
          depthTest: false,
        } : {
          visible: false,
        })}
      />
    </mesh>
  );
};
