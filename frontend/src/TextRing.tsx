import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { MeshBasicMaterial, Group } from 'three';
import colors from './colors';
import { fontUrls } from './typography';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const RING_TEXTS = [
  'Stills. Motion. Design. Sound.',
  "Hey, I'm Fir4s   --   17yo sailor   --   Photographer   --   Videographer   --   Coder   ^-^",
];

const RADIUS = 3.2;
const FONT_SIZE = 0.15;

function TextSegment({
  text,
  angle,
  color,
  material,
}: {
  text: string;
  angle: number;
  color: string;
  material: MeshBasicMaterial;
}) {
  return (
    <group rotation={[0, -angle, 0]}>
      {/* @ts-ignore */}
      <Text
        position={[RADIUS, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        fontSize={FONT_SIZE}
        font={fontUrls.bryantBold}
        color={color}
        anchorX="center"
        anchorY="middle"
        material={material}
        letterSpacing={FONT_SIZE * 0.3}
        outlineWidth={0.015}
        outlineColor={colors.pitchBlack}
        renderOrder={1}
      >
        {text}
      </Text>
    </group>
  );
}

export function TextRing() {
  const groupRef = useRef<Group>(null);
  const textMaterial = useMemo(
    () => new MeshBasicMaterial({ depthTest: false }),
    []
  );
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => () => textMaterial.dispose(), [textMaterial]);

  useFrame((_state, delta) => {
    if (reducedMotion) return;
    if (!groupRef.current) return;
    groupRef.current.rotation.y -= delta * 0.12;
  });

  return (
    <group ref={groupRef} position={[-1, 0, 2]}>
      {RING_TEXTS.map((text) => {
        const i = RING_TEXTS.indexOf(text);
        return (
          <TextSegment
            key={text.slice(0, 20)}
            text={text}
            angle={(Math.PI * 2 * i) / RING_TEXTS.length}
            color={i % 2 === 0 ? colors.darkGoldenrod : colors.blueSlate}
            material={textMaterial}
          />
        );
      })}
    </group>
  );
}
