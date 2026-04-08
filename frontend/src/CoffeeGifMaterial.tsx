import React, { useMemo } from 'react';
import { shaderMaterial } from '@react-three/drei';
import { extend, ReactThreeFiber, useFrame } from '@react-three/fiber';
import {
  CanvasTexture,
  Clock,
  FrontSide,
  ShaderMaterial,
  Texture,
} from 'three';
// @ts-ignore
import glsl from 'glslify';
import { useGifTexture } from './useGifTexture';

const CoffeeShaderMaterial = shaderMaterial(
  {
    thumb: new Texture(),
    video: new Texture(),
    unfreeze: 0.0,
    time: 0.0,
    videoReady: 0.0,
  },
  glsl`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  glsl`
    uniform sampler2D thumb;
    uniform sampler2D video;
    varying vec2 vUv;
    uniform float unfreeze;
    uniform float seed;
    uniform float time;
    uniform float videoReady;

    float random (in vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    float noise (in vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);

      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));

      vec2 u = f*f*(3.0-2.0*f);
      return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    vec3 darkColor = vec3(0.,0.,1.);
    vec3 middleColor = vec3(0.,1.,1.);
    vec3 lightColor = vec3(0.8,1.,1.);

    void main() {
      float noiseValue1 = noise(vUv*5.0-seed + time);
      float noiseValue2 = noise(vUv*10.0-seed*50. + time);
      float noiseValue3 = noise(vUv*2.0-seed*100. + time);
      float noiseValue4 = noise(vUv*8.0-seed*150.*unfreeze + time);
      float noiseValue5 = noise(vUv*100.0-seed*250.*unfreeze + time);
      float noiseValue6 = noise(vUv*-seed*300. + time);
      float noiseValue = (noiseValue1+noiseValue2+noiseValue3+noiseValue4+noiseValue5+noiseValue6)/6.;
      float visible = smoothstep(0.0,2.0,(noiseValue+unfreeze*2.));
      visible = smoothstep(0.5,1.0,visible);

      vec3 distortedVideoColor = texture2D(video, (vUv-0.5)*visible+0.5).rgb;
      vec3 distortedThumbColor = texture2D(thumb, (vUv-0.5)*visible+0.5).rgb;
      vec3 unfrozenColor = mix(distortedThumbColor, distortedVideoColor, videoReady);

      vec3 frozenColor = texture2D(thumb, vUv).rgb;
      float grayscaleValue = (frozenColor.r + frozenColor.g + frozenColor.b) / 3.0 * 1. + 0.33;
      frozenColor =
        (1.-step(0.5, grayscaleValue)) * mix(darkColor,middleColor,grayscaleValue*2.)
        + step(0.5, grayscaleValue) * mix(middleColor,lightColor,grayscaleValue*2.-1.);
      frozenColor += noiseValue;

      vec3 color = mix(frozenColor,unfrozenColor,visible);
      gl_FragColor.rgba = vec4(color, 1.0);
    }
  `,
);

extend({ CoffeeShaderMaterial });

// eslint-disable-next-line no-redeclare
type CoffeeShaderMaterial = ShaderMaterial & {
  unfreeze: number;
  seed: number;
  thumb: Texture;
  video: Texture;
  time: number;
  videoReady: number;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'coffeeShaderMaterial': ReactThreeFiber.Object3DNode<
        CoffeeShaderMaterial,
        typeof CoffeeShaderMaterial
      >;
    }
  }
}

export const CoffeeGifMaterial = ({
  gifUrl,
  active = true,
}: {
  gifUrl?: string;
  active: boolean;
}) => {
  const materialRef = React.useRef<CoffeeShaderMaterial>(null);

  const unfreezeClock = useMemo(() => {
    const clock = new Clock();
    clock.start();
    return clock;
  }, []);

  const randomSeed = useMemo(() => Math.random(), []);
  const { texture: gifTexture, failed: gifFailed } = useGifTexture(gifUrl ?? '', active);
  const fallbackThumb = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // "blank ice" color, will still be stylized by the shader.
      ctx.fillStyle = '#b8f6ff';
      ctx.fillRect(0, 0, 1, 1);
    }
    const tex = new CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  useFrame(() => {
    if (!materialRef.current) return;
    const transitionTime = 1;
    const increment = unfreezeClock.getDelta() / transitionTime;

    if (active) {
      materialRef.current.uniforms.unfreeze.value = Math.min(
        materialRef.current.uniforms.unfreeze.value + increment * 0.7,
        1.0,
      );
    } else {
      materialRef.current.uniforms.unfreeze.value = Math.max(
        materialRef.current.uniforms.unfreeze.value - increment * 0.7,
        0.0,
      );
    }

    const ready = Boolean(gifUrl) && Boolean(gifTexture) && !gifFailed;
    if (ready) {
      materialRef.current.uniforms.videoReady.value = Math.min(
        materialRef.current.uniforms.videoReady.value + increment,
        1.0,
      );
    } else {
      materialRef.current.uniforms.videoReady.value = Math.max(
        materialRef.current.uniforms.videoReady.value - increment,
        0.0,
      );
    }

    materialRef.current.uniforms.time.value += increment;
  });

  return (
    <coffeeShaderMaterial
      depthTest={false}
      side={FrontSide}
      key={(CoffeeShaderMaterial as any).key}
      unfreeze={0}
      seed={randomSeed}
      ref={materialRef}
      thumb={(gifUrl && gifTexture && !gifFailed) ? gifTexture : fallbackThumb}
      videoReady={0}
      time={0}
      transparent
    >
      {/* attach GIF canvas texture as "video" sampler */}
      {gifUrl && gifTexture && !gifFailed && (
        // eslint-disable-next-line react/no-unknown-property
        <primitive attach="video" object={gifTexture} />
      )}
    </coffeeShaderMaterial>
  );
};

