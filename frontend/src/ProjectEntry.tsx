import React, {
  Ref,
  useMemo, useRef, useState,
} from 'react';
import { MathUtils, Mesh, Object3D } from 'three';
import { extend, useFrame } from '@react-three/fiber';
import { useEventListener, useInterval } from 'usehooks-ts';
import { animated, config, useSpring } from '@react-spring/three';
import { RoundedBoxGeometry } from 'three-stdlib';
import { MeshDistortMaterial } from '@react-three/drei';
import { event } from 'nextjs-google-analytics';
import { Project } from '../generatedSanitySchemaTypes';
import { ThreeButton } from './ThreeButton';
import colors from './colors';
import { ProjectHtmlModal } from './ProjectHtmlModal';
import { useBreakpoints } from './useBreakpoints';
import { CoordArray } from './CoordArray';
import { useHasNoMouse } from './useHasNoMouse';
import { ProjectTitlePreview } from './ProjectTitlePreview';
import { useSceneController } from './SceneController';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';
import { CoffeeGifMaterial } from './CoffeeGifMaterial';

const ROTATION_MAX_SPEED = 0.008;
const MAX_WANDER_DISTANCE = 0.4;

const getRandomCubeOffset = ():CoordArray => [
  (Math.random() * 2 - 1) * MAX_WANDER_DISTANCE,
  (Math.random() * 2 - 1) * MAX_WANDER_DISTANCE,
  (Math.random() * 2 - 1) * MAX_WANDER_DISTANCE,
];

const circle = Math.PI * 2;

extend({ RoundedBoxGeometry });

/* eslint-disable no-unused-vars */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'roundedBoxGeometry': any;
    }
  }
}
/* eslint-enable no-unused-vars */

export const ProjectEntry = ({
  project,
  basePosition,
  open,
  setOpen,
  hovering,
  someProjectIsOpen,
  setHovering,
}:{
  project: Project;
  basePosition: CoordArray;
  open: boolean;
  setOpen: (_open: boolean) => void;
  someProjectIsOpen: boolean;
  hovering: boolean;
  setHovering: (_hovering: boolean) => void;
}) => {
  const breakpoints = useBreakpoints();
  const reducedMotion = usePrefersReducedMotion();

  const directionInterval = useMemo(() => Math.random() * 5000 + 2500, []);
  const [cubeFloatingOffset, setCubeFloatingOffset] = useState<CoordArray>(
    getRandomCubeOffset(),
  );
  const { animatedCubeFloatingOffset } = useSpring({
    animatedCubeFloatingOffset: (reducedMotion || open ? [0, 0, 0] as CoordArray : cubeFloatingOffset),
    config: {
      mass: 1,
      tension: 80,
      friction: 20,
      duration: open ? 150 : undefined,
    },
  });

  useInterval(() => {
    if (reducedMotion) return;
    setCubeFloatingOffset(getRandomCubeOffset());
  }, directionInterval);

  const cubeRef = useRef<Mesh>();
  const rotationSpeeds = useRef({
    x: (Math.random() * 2 - 1) * ROTATION_MAX_SPEED,
    y: (Math.random() * 2 - 1) * ROTATION_MAX_SPEED,
    z: (Math.random() * 2 - 1) * ROTATION_MAX_SPEED,
  });

  const objectAimedAtCamera = useMemo(() => new Object3D(), []);

  useFrame(({ camera }) => {
    if (!cubeRef.current || reducedMotion) return;
    if (hovering || open) {
      cubeRef.current.getWorldPosition(objectAimedAtCamera.position);
      objectAimedAtCamera.lookAt(camera.position);

      const { x, y, z } = cubeRef.current.rotation;
      cubeRef.current.rotation.x = MathUtils.lerp(
        x,
        Math.round(x / (circle)) * circle + objectAimedAtCamera.rotation.x,
        0.1,
      );
      cubeRef.current.rotation.y = MathUtils.lerp(
        y,
        Math.round(y / (circle)) * circle + objectAimedAtCamera.rotation.y,
        0.1,
      );
      cubeRef.current.rotation.z = MathUtils.lerp(
        z,
        Math.round(z / (circle)) * circle + objectAimedAtCamera.rotation.z,
        0.1,
      );
    } else {
      cubeRef.current.rotation.x += rotationSpeeds.current.x;
      cubeRef.current.rotation.y += rotationSpeeds.current.y;
      cubeRef.current.rotation.z += rotationSpeeds.current.z;
    }
  });

  useHasNoMouse();
  let cubeScale = 1;
  if (hovering) {
    cubeScale = 2.0;
    if (breakpoints.projects) {
      cubeScale = 2.0;
    }
  }
  if (open) cubeScale = 1;

  const cubePosition:CoordArray = open
    ? [0, 0, 4]
    : basePosition;
  const { animatedCubePosition } = useSpring({
    animatedCubePosition: cubePosition as [number, number, number],
    config: config.stiff,
  });

  const { animatedCubeScale } = useSpring({
    animatedCubeScale: cubeScale as number,
    config: config.wobbly,
  });

  const cubeOpacity = someProjectIsOpen && !open ? 0 : 1;
  const { animatedCubeOpacity: _animatedCubeOpacity } = useSpring({
    animatedCubeOpacity: cubeOpacity as number,
    config: config.default,
  });

  const { scene } = useSceneController();
  const active = hovering || open;
  const gifUrl = useMemo(() => (project as any)?.gifUrl ?? '', [project]);

  useEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) {
      setOpen(false);
    }
  });

  return (
    <>
      <group position={basePosition}>
        {scene === 'projects' && !someProjectIsOpen && (
        <ThreeButton
          position={[0, 0, 0]}
          width={2}
          height={2}
          description={`Open project: ${project?.title ?? 'project'}`}
          activationMsg={`${project?.title ?? 'Project'} opened`}
          cursor="open-project"
          onClick={() => {
            setOpen(true);
            event('project-opened', {
              project: project?.slug?.current ?? 'unset',
            });
          }}
          onFocus={() => {
            setHovering(true);
          }}
          onBlur={() => {
            setHovering(false);
          }}
        />
        )}
      </group>
      <animated.group position={animatedCubePosition}>
        <animated.group
          position={animatedCubeFloatingOffset}
          scale={animatedCubeScale}
          visible={!someProjectIsOpen || open}
        >
          {/* Distort sphere behind cube - scales and hides with the cube */}
          <animated.mesh position={[0, 0, -0.2]} scale={[1, 1, 0.1]} renderOrder={0}>
            <sphereBufferGeometry args={[1, 20, 20]} attach="geometry" />
            {/* @ts-ignore */}
            <MeshDistortMaterial
              color={colors.darkGoldenrod}
              speed={6}
              radius={1}
              distort={0.5}
              transparent
              opacity={cubeOpacity * 0.45}
              roughness={0}
              depthWrite={false}
            />
          </animated.mesh>
          <animated.mesh ref={cubeRef as Ref<Mesh>} renderOrder={1}>
            <roundedBoxGeometry args={[1, 1, 1, 4, 0.1]} attach="geometry" />
            <CoffeeGifMaterial gifUrl={gifUrl} active={active} />
          </animated.mesh>
        </animated.group>
      </animated.group>

      {open && (
        <ProjectHtmlModal
          project={project}
          position={breakpoints.projectOpen ? [-1.6, 0, 4.5] : [0, -0.6, 4.5]}
          setOpen={setOpen}
        />
      )}

      <ProjectTitlePreview project={project} basePosition={basePosition} visible={hovering} />
    </>
  );
};
