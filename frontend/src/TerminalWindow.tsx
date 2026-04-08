import React, { PointerEventHandler, ReactNode, useState } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { useBreakpoints } from './useBreakpoints';
import { useTrueAfterDelay } from './useTrueAfterDelay';
import colors from './colors';

// import { fontUrls } from './typography';
export const TerminalWindow = ({
  children,
  title,
  className = '',
  delay = 300,
  color = 'pitchBlack',
  topColor = 'darkGoldenrod',
  wrapperClassName = '',
  draggableByTitleBarOnly = false,
  noCloseButton = false,
}: {
  children: ReactNode;
  title: string | null;
  className?: string;
  delay?: number;
  color?: string;
  topColor?: string;
  wrapperClassName?: string;
  draggableByTitleBarOnly?: boolean;
  noCloseButton?: boolean;
}) => {
  const showWindow = useTrueAfterDelay(delay);
  const breakpoints = useBreakpoints();
  const [flipped, setFlipped] = useState(false);

  const dragControls = useDragControls();
  const startDrag:PointerEventHandler<HTMLDivElement> = (event) => {
    dragControls.start(event);
  };

  return (
    <div
      className={`relative select-none touch-none ${className}`}
    >
      <motion.div
        // drag={draggable}
        drag
        dragMomentum={false}
        dragListener={false}
        className="relative w-full h-full"
        dragControls={dragControls}
        onPointerDown={draggableByTitleBarOnly ? () => {} : startDrag}
      >
        {/* eslint-disable jsx-a11y/click-events-have-key-events  */}
        {/* eslint-disable jsx-a11y/no-static-element-interactions */}
        <div
          className={`
            ${showWindow ? '' : 'scale-0'}
            transition-transform ease-[steps(8)]
            duration-500
            font-mono
            min-h-full
            pointer-events-auto

            border-[3px] overflow-hidden relative
            flex flex-col
            ${breakpoints.about ? 'text-[1em]' : 'text-[max(1em,16px)]'}
            ${flipped ? 'rotate-180 text-blueSlate' : ''}
          `}
          style={{
            boxShadow: `0.2em 0.2em 0 black`,
            borderColor: 'black',
          }}
          onClick={() => {
            if (flipped) {
              setFlipped(false);
            }
          }}
        >
          {/* eslint-enable jsx-a11y/click-events-have-key-events  */}
          {/* eslint-enable jsx-a11y/no-static-element-interactions */}
          {title && (
            <div
              className="border-b-[2px] border-pitchBlack grid place-items-center relative"
              style={{
                backgroundColor: colors[topColor as keyof typeof colors],
              }}
              onPointerDown={draggableByTitleBarOnly ? startDrag : () => {}}
            >
              {title}
              {!noCloseButton && (
                <button
                  className={`
                    border-pitchBlack border-[2px]
                    h-[0.75em] w-[0.75em]
                    absolute right-[0.5em]
                    ${flipped ? 'bg-darkGoldenrod' : ''}
                  `}
                  aria-label="this looks like a close button, but actually turns the window upside down. lol."
                  type="button"
                  onClick={() => {
                    setFlipped(!flipped);
                  }}
                />
              )}
            </div>
          )}
          <div className={`flex-grow relative ${wrapperClassName}`} style={{ backgroundColor: colors[color as keyof typeof colors] }}>
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
