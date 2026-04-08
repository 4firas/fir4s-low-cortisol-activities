import { useEffect, useRef, useState } from 'react';

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMuted = useRef(true);
  const startedRef = useRef(false);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const startMusic = () => {
      if (startedRef.current) return;
      startedRef.current = true;

      audioRef.current = new Audio('/music/Butterfly_Effect.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4;
      audioRef.current.play().then(() => {
        isMuted.current = false;
        setRendered(true);
      }).catch(() => {
        startedRef.current = false;
      });
    };

    startMusic();

    document.addEventListener('click', startMusic, { once: true });
    document.addEventListener('keydown', startMusic, { once: true });
    document.addEventListener('touchstart', startMusic, { once: true });

    return () => {
      document.removeEventListener('click', startMusic);
      document.removeEventListener('keydown', startMusic);
      document.removeEventListener('touchstart', startMusic);
      audioRef.current?.pause();
    };
  }, []);

  if (!rendered) {
    return null;
  }

  return null;
}
