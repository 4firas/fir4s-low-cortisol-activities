import { useEffect, useRef, useState } from 'react';
import { CanvasTexture } from 'three';
import { parseGIF, decompressFrames, ParsedFrame } from 'gifuct-js';

export function useGifTexture(
  gifUrl: string,
  active: boolean = true,
): { texture: CanvasTexture | null; failed: boolean } {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [texture, setTexture] = useState<CanvasTexture | null>(null);
  const [failed, setFailed] = useState(false);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    let cancelled = false;
    let animFrameId: number | null = null;
    let animTimeout: ReturnType<typeof setTimeout> | null = null;

    if (!gifUrl || !gifUrl.trim()) return () => { cancelled = true; };

    fetch(gifUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`GIF fetch failed: ${res.status}`);
        return res.arrayBuffer();
      })
      .then((gifArrayBuffer) => {
        if (cancelled) return;
        const gif = parseGIF(gifArrayBuffer);
        const frames = decompressFrames(gif, true) as ParsedFrame[];
        if (frames.length === 0) return;

        const dims = gif.lsd;
        const canvas = document.createElement('canvas');
        canvas.width = dims.width;
        canvas.height = dims.height;
        const ctx = canvas.getContext('2d')!;

        const offscreen = document.createElement('canvas');
        offscreen.width = dims.width;
        offscreen.height = dims.height;
        const offCtx = offscreen.getContext('2d')!;

        const tex = new CanvasTexture(canvas);
        tex.needsUpdate = true;
        setTexture(tex);
        canvasRef.current = canvas;

        let frameIndex = 0;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = dims.width;
        tempCanvas.height = dims.height;
        const tempCtx = tempCanvas.getContext('2d')!;

        const animate = () => {
          if (cancelled) return;
          const frame = frames[frameIndex];
          if (!frame) return;
          const { dims: frameDims, delay } = frame;

          // Only advance frames while active (hover/open). When inactive, we keep
          // showing the last rendered frame (typically the "thumb"/first frame).
          if (activeRef.current) {
            frameIndex = (frameIndex + 1) % frames.length;
          }

          const imageData = new ImageData(
            new Uint8ClampedArray(frame.patch),
            frameDims.width,
            frameDims.height,
          );

          tempCtx.clearRect(0, 0, dims.width, dims.height);
          tempCtx.putImageData(imageData, frameDims.left, frameDims.top);
          offCtx.drawImage(tempCanvas, 0, 0);
          ctx.drawImage(offscreen, 0, 0);

          if (tex && !cancelled) tex.needsUpdate = true;

          animTimeout = setTimeout(() => {
            animFrameId = requestAnimationFrame(animate);
          }, Math.max(10, delay || 10));
        };

        animate();
      })
      .catch((err) => {
        if (!cancelled) {
          // eslint-disable-next-line no-console
          console.warn(`[useGifTexture] Failed to load GIF: ${gifUrl}`, err);
          setFailed(true);
        }
      });

    return () => {
      cancelled = true;
      if (animTimeout) clearTimeout(animTimeout);
      if (animFrameId !== null) cancelAnimationFrame(animFrameId);
      canvasRef.current = null;
    };
  }, [gifUrl]);

  useEffect(() => () => texture?.dispose(), [texture]);

  return { texture, failed };
}
