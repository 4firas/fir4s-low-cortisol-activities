import { useFrame } from '@react-three/fiber';
import React, {
  useRef, useState,
} from 'react';
import { MathUtils, PerspectiveCamera } from 'three';
import { useEventListener, useWindowSize } from 'usehooks-ts';
import { Html } from '@react-three/drei';
import { event } from 'nextjs-google-analytics';
import { CoordArray } from './CoordArray';
import { CustomCursorHover } from './CustomCursor';
import { SceneName, useSceneController } from './SceneController';
import { Typewriter, TIME_PER_CHAR } from './Typewriter';
import { useBreakpoints } from './useBreakpoints';
import { SkillArtWindow } from './SkillArtWindow';
import { SlideName } from './SlideName';
import { ImageWindow } from './ImageWindow';
import { TerminalButton } from './TerminalButton';
import { TerminalWindow } from './TerminalWindow';
import { TerminalWindowButton } from './TerminalWindowButton';
import { aboutContent } from './aboutContent';
import { socialLinks, contactHref } from './fir4sData';
import selfConceptImage from '../public/images/self-concept.png';

export const Slides = ({
  slide, setScene, setSlide,
}:{
  slide:SlideName,
  setScene:(_scene:SceneName)=>void,
  setSlide:(_slide:SlideName)=>void,
}) => {
  const breakpoints = useBreakpoints();
  const breakpoint = breakpoints.about;

  const { scene } = useSceneController();

  if (slide === 'intro') {
    const text1Delay = 800;
    const text2Delay = text1Delay + 22 * TIME_PER_CHAR + 100;
    const buttonDelay = text2Delay + 23 * TIME_PER_CHAR + 300;
    return (
      <div className="p-[1em] font-mono text-white text-[2em]">
        <Typewriter delay={text1Delay} hideCaratAtEnd>
          {aboutContent.intro[0]}
        </Typewriter>
        <Typewriter delay={text2Delay}>
          {aboutContent.intro[1]}
        </Typewriter>
        <div className="grid place-items-center mt-[2em]">
          <TerminalButton
            onClick={() => {
              setSlide('mission');
              setScene('about');
            }}
            delay={buttonDelay}
            className="text-[max(1.5em,16px)]"
            tabIndex={scene === 'menu' ? 0 : -1}
          >
            ABOUT_FIR4S
          </TerminalButton>
        </div>
      </div>
    );
  }

  return (
    <>
      {(slide === 'mission' || slide === 'testimonials' || slide === 'skills') && (
        <div
          className={`
          grid h-full
          pointer-events-none
          absolute top-0 left-0 w-full
          ${breakpoints.about ? 'grid-cols-[65%_1fr]' : 'grid-rows-[max-content_1fr]'}
        `}
        >
            <TerminalWindow
              title="FIR4S.exe"
              className={`
              relative self-baseline
                ${breakpoints.about ? '' : 'w-[90%] max-w-[30em] justify-self-start'}
              transition-transform duration-[1s]
              ${slide === 'mission' ? '' : 'translate-x-[-80%] translate-y-[-40%]'}
            `}
            >
              <div className="p-[1em]">
                {aboutContent.mission.map((text, i) => (
                  <div key={text.slice(0, 20)} style={{ marginTop: i !== 0 ? '1em' : 0 }}>
                    <Typewriter delay={1000 + i * 500} hideCaratAtEnd={i !== aboutContent.mission.length - 1}>
                      {text}
                    </Typewriter>
                  </div>
                ))}
                <div className="grid place-items-center mt-[2em]">
                  <TerminalWindowButton
                    onClick={() => {
                      setSlide('testimonials');
                    }}
                    delay={2000}
                    color="#223434"
                    bgColor="#C39040"
                    disabled={slide !== 'mission'}
                  >
                    find me online!
                  </TerminalWindowButton>
                </div>
              </div>
            </TerminalWindow>
            <ImageWindow
              delay={300}
              title="SELF_CONCEPT.exe"
              positions={['center']}
              topColor="darkGoldenrod"
              className={`
              ${breakpoints.about ? `
                self-end min-h-[12em] h-[13em] ml-[-1em] mb-[2em]
              ` : `
                min-w-[220px]
                aspect-[9/8]
                justify-self-end mt-[2em]
              `}
              transition-transform duration-[1s]
              ${slide === 'mission' ? '' : 'translate-x-[20%] translate-y-[70%]'}
            `}
              srcs={[selfConceptImage]}
              alts={['Self concept visual']}
            />
        </div>
      )}
      {(slide === 'testimonials' || slide === 'skills') && (
      <div
        className={`
          absolute top-0 left-0 w-full h-full
          pointer-events-none
          grid grid-cols-1
        `}
      >
        <TerminalWindow
          className={`
            relative
            transition-transform duration-[1s]
            ${slide === 'testimonials' ? '' : 'translate-x-[43%] translate-y-[-80%]'}
            col-span-1 row-span-1 self-start
          `}
          title="FIND_ME_ONLINE.exe"
        >
          <div className="flex flex-col gap-2 mt-3 p-[1em] font-mono text-blueSlate">
            {Object.entries(socialLinks).map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-darkGoldenrod underline decoration-1 underline-offset-4"
                aria-label={`${platform} (opens in new tab)`}
              >
                {platform}
              </a>
            ))}
            <a
              href={contactHref}
              className="mt-2 hover:text-darkGoldenrod underline decoration-1 underline-offset-4"
              aria-label="email me (opens in new tab)"
            >
              email me
            </a>
            <div className="grid place-items-center mt-[2em]">
              <TerminalWindowButton
                onClick={() => {
                  setSlide('skills');
                }}
                delay={1000}
                color="#223434"
                bgColor="#C39040"
                disabled={slide !== 'testimonials'}
              >
                skills, tho?
              </TerminalWindowButton>
            </div>
          </div>
        </TerminalWindow>
      </div>
      )}
      {(slide === 'skills') && (
        <div
          className={`
          absolute top-0 left-0 w-full h-full
          grid
          ${breakpoint ? ' grid-rows-[1fr_1em]' : ' grid-rows-[1fr_6em]'}
          pointer-events-none
        `}
        >
          <SkillArtWindow
            className="w-full h-full"
            title="PAINT_TO_REVEAL_MY_SKILLS"
            color="blueSlate"
            topColor="darkGoldenrod"
            setScene={setScene}
            setSlide={setSlide}
          />
        </div>
      )}
    </>
  );
};

export function ComputerTerminal() {
  const { scene, setScene } = useSceneController();

  const [slide, _setSlide] = useState<SlideName>('intro');
  const setSlide = (name: SlideName) => {
    event('about-slide', {
      slide: name,
    });
    _setSlide(name);
  };

  // We cant use drei/HTML transform property to manage the size of this div
  // Why? Because a close camera will scale it up so much
  // On Safari (which kinda isnt great for subpixel rendering things)
  // it will be blurry
  // Instead, we do trigonometry to get the exact pixel size

  // Position and size of plane that our div should cover as closely as possible
  const position:CoordArray = [-1, 0.7, 2];
  const planeSizeInWorldUnits = [3.4, 2];

  // Canvas is full window
  const windowSize = useWindowSize();

  const breakpoints = useBreakpoints();

  // The div we will style (main terminal)
  const terminalDivRef = useRef<HTMLDivElement>(null);
  useFrame(({ camera }) => {
    if (!terminalDivRef.current) return;

    // get FOV in radians
    const perspectiveCamera = camera as PerspectiveCamera;
    const vFOV = MathUtils.degToRad(perspectiveCamera.fov);

    /** Distance of plane from camera */
    const dist = Math.abs(perspectiveCamera.position.z - position[2]);

    /** Height of full plane in view of camera at this dist */
    const worldCameraHeight = 2 * Math.tan(vFOV / 2) * dist;

    /** Width of full plane in view of camera at this dist */
    const worldCameraWidth = worldCameraHeight * perspectiveCamera.aspect;

    /** Width of our plane in screen pixels */
    const planeWidthInPixels = (planeSizeInWorldUnits[0] / worldCameraWidth) * windowSize.width;

    /** Height of our plane in screen pixels */
    const planeHeightInPixels = (planeSizeInWorldUnits[1] / worldCameraHeight) * windowSize.height;

    // We can help out with responsive behavior here by limiting this
    // div to be always smaller than the screen
    // const width = Math.min(planeWidthInPixels, windowSize.width * 0.9);
    // const height = Math.min(planeHeightInPixels, windowSize.height * 0.8);

    // Apply sizing to our terminal div via CSS vars
    // Round to prevent sub-pixel jitter during camera lerp transitions
    const roundedWidth = Math.round(windowSize.width * 0.9);
    const roundedPlaneW = Math.round(planeWidthInPixels);
    const roundedPlaneH = Math.round(planeHeightInPixels);
    terminalDivRef.current.style.setProperty('--terminal-width', `min(${roundedWidth}px, ${roundedPlaneW}px)`);
    terminalDivRef.current.style.setProperty('--terminal-height', `min(80 * var(--vh), ${roundedPlaneH}px)`);
  });

  // Exit on escape key - must use keydown, keypress doesn't fire for Escape
  useEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (scene === 'about') {
        setScene('menu');
        setSlide('intro');
      }
    }
  });

  return (
    <group
      position={position}
      rotation={[0, 0, Math.PI / 40]}
    >
      <Html>
        <CustomCursorHover cursor="terminal">
          <div
            className={`
                ${breakpoints.about ? 'rotate-[-5deg]' : 'rotate-[-4deg]'}
                 -translate-x-1/2 -translate-y-1/2
                w-[var(--terminal-width)] h-[var(--terminal-height)]
              `}
            style={{
              fontSize: 'calc(var(--terminal-width)/40)',
            }}
            ref={terminalDivRef}
          >
            <Slides slide={slide} setSlide={setSlide} setScene={setScene} />

            {slide !== 'intro' && (
            <div
              className={`absolute
                text-[max(0.7em,16px)]
                right-0
                top-0
                z-[-1]
              `}
            >
              <TerminalButton
                onClick={() => {
                  setScene('menu');
                  setSlide('intro');
                }}
                delay={500}
                className="font-mono"
              >
                {breakpoints.about ? 'BACK_TO_MENU' : 'BACK'}
              </TerminalButton>
            </div>
            )}
          </div>
        </CustomCursorHover>
      </Html>
    </group>
  );
}
