import React, { ReactNode } from 'react';
import { useTrueAfterDelay } from './useTrueAfterDelay';

export const TerminalButton = ({
  onClick, children, className = '', delay = 300, tabIndex = undefined,
}: {
  onClick: () => void;
  children: ReactNode;
  className?: string;
  delay?: number;
  tabIndex?: number;
}) => {
  const show = useTrueAfterDelay(delay);
  return (
    <div
      className={`relative
        ${show ? '' : 'scale-0'}
        transition-transform ease-[steps(5)] duration-400
        pointer-events-auto
      `}
    >
      <button
        type="button"
        className={`
          border-[2px] border-darkGoldenrod py-[0.5em] px-[0.5em] text-blueSlate
          hover:bg-darkGoldenrod
          focus:bg-darkGoldenrod
          focus-visible:ring-2 focus-visible:ring-darkGoldenrod focus-visible:ring-offset-2
          hover:text-pitchBlack
          focus:text-pitchBlack
          relative
          ${className}
        `}
        onClick={onClick}
        tabIndex={show ? tabIndex : -1}
      >
        {children}
      </button>

    </div>
  );
};
