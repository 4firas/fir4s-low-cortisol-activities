import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DoubleSide,
} from 'three';
import { useInterval } from 'usehooks-ts';
import { Text, MeshDistortMaterial } from '@react-three/drei';
import { animated, useSpring, config } from '@react-spring/three';
import { GroupProps } from '@react-three/fiber';
import { Project } from '../generatedSanitySchemaTypes';
import { ProjectEntry } from './ProjectEntry';
import colors from './colors';
import { useBreakpoints } from './useBreakpoints';
import { useHasNoMouse } from './useHasNoMouse';
import { useSceneController } from './SceneController';
import { fontUrls } from './typography';
import { BackgroundColorMaterial } from './ProjectBackgroundMaterial';

export function ProjectListing({ active, projects, ...groupProps }:
  { active:boolean, projects: Project[] | null; } & GroupProps) {
  const [blobIsBig, setBlobIsBig] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<null|number>(null);
  const [openIndex, setOpenIndex] = useState<null|number>(null);
  const breakpoints = useBreakpoints();
  const nProjects = projects?.length ?? 0;
  const arcPerProject = projects ? ((Math.PI * 2) / nProjects) : 0;
  const [autoHover, setAutoHover] = useState(false);
  const hasNoMouse = useHasNoMouse();
  const aProjectIsOpen = openIndex !== null;

  useInterval(() => {
    if (aProjectIsOpen) return;
    if (hasNoMouse && autoHover) setHoveredIndex(((hoveredIndex ?? 0) + 1) % nProjects);
  }, 2000);

  let blobTargetPosition = [0, 0, 0];
  if (!blobIsBig) {
    blobTargetPosition = [1, 3.91, 0];
    if (breakpoints.projects) blobTargetPosition = [3.62, 1.91, 0];
  }

  const { blobScale, blobPosition } = useSpring({
    blobPosition: blobTargetPosition as [number, number, number],
    blobScale: blobIsBig ? 1 : 0,
    config: active ? config.gentle : config.stiff,
  });

  useEffect(() => {
    if (active) {
      let delay = 0;
      setTimeout(() => {
        setBlobIsBig(true);
      }, delay += 500);
      setTimeout(() => {
        setAutoHover(true);
      }, delay += 3000);
    } else {
      setHoveredIndex(null);
      setAutoHover(false);
      setTimeout(() => {
        setBlobIsBig(false);
      }, 500);
    }
  }, [active]);

  const radius = breakpoints.projects ? 2.7 : 2.4;
  const { setScene } = useSceneController();
  const currentProject = (openIndex !== null ? projects?.[openIndex] ?? null : null);

  const createSetHovering = useCallback((index: number) => (isHovering: boolean) => {
    if (isHovering) {
      setHoveredIndex(index);
    } else {
      setHoveredIndex((prev) => (prev === index ? null : prev));
    }
  }, []);

  const createSetOpen = useCallback((index: number) => (isOpening: boolean) => {
    setOpenIndex((prevIndex) => {
      if (isOpening && prevIndex === null) {
        setScene('project-open');
        return index;
      }
      if (!isOpening && prevIndex === index) {
        setScene('projects');
        setHoveredIndex(null);
        return null;
      }
      return prevIndex;
    });
  }, [setScene]);

  const basePositions = useMemo(() =>
    projects?.map((_, index) => [
      Math.sin(index * arcPerProject) * radius,
      Math.cos(index * arcPerProject) * radius,
      0,
    ] as [number, number, number]) ?? [],
  [projects, arcPerProject, radius]);

  return (
    <group {...groupProps}>
      <animated.group scale={blobScale} position={blobPosition as any}>
        <mesh position={[0, 0, -5]} scale={[2.5, 2.5, 0.1]}>
          <sphereBufferGeometry args={[4, 70, 70]} attach="geometry" />
          {/* @ts-ignore */}
          <MeshDistortMaterial
            color={colors.pitchBlack}
            speed={6}
            radius={1}
            distort={0.3}
            transparent
            opacity={0.7}
            side={DoubleSide}
          />
        </mesh>
        {/* @ts-ignore */}
        <Text
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          color={colors.darkGoldenrod}
          anchorX="center"
          anchorY="middle"
          textAlign="center"
          fontSize={0.5}
          font={fontUrls.bryantBold}
          material-toneMapped={false}
        >
          {`${hasNoMouse ? 'Tap' : 'Click'} a \ncube.`}
        </Text>
      </animated.group>
      <mesh position={[0, 0, 3]}>
        <boxGeometry attach="geometry" args={[10, 10, 0.01]} />
        <BackgroundColorMaterial opacity={aProjectIsOpen} project={currentProject} />
      </mesh>
      <animated.group scale={blobScale} position={blobPosition}>
        {projects && projects.map((project, index) => (
          <ProjectEntry
            project={project}
            key={`${project._id}-${index.toString()}`}
            basePosition={basePositions[index]}
            someProjectIsOpen={openIndex !== null}
            hovering={openIndex === null && hoveredIndex === index}
            setHovering={createSetHovering(index)}
            open={openIndex === index}
            setOpen={createSetOpen(index)}
          />
        ))}
      </animated.group>
    </group>
  );
}
