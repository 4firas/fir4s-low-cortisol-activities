import React, { ReactNode } from 'react';
import { useTrueAfterDelay } from './useTrueAfterDelay';
import colors from './colors';

const InnerButtonContent = ({ children, disabled }:{children:ReactNode, disabled:boolean}) => (
  <>
    <span
      className="absolute top-0 left-0 block w-full h-full bg-black group-active:scale-75"
    />
    <span
      className={`border-[2px] border-[var(--color)]
        py-[0.5em] px-[0.5em] pointer-events-none
        relative block
        ${disabled ? '' : `
          translate-x-[0.15em] translate-y-[0.15em]
          group-hover:translate-x-0
          group-focus:translate-x-0
          group-hover:translate-y-0
          group-focus:translate-y-0
          group-active:scale-75
        `}
      `}
      style={{
        backgroundColor: 'var(--bgColor)',
      }}
    >
      {children}
    </span>
  </>
);

export const TerminalWindowButton = ({
  onClick,
  children,
  className = '',
  delay = 300,
  color = '#223434',
  bgColor = '#BAB5B2',
  disabled = false,
  href = null,
}: {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  delay?: number;
  color?: string;
  bgColor?: string;
  disabled?: boolean;
  href?: string|null;
}) => {
  const show = useTrueAfterDelay(delay);
  const buttonProps = {
    style: {
      '--color': disabled ? colors.charcoalBlue : color,
      '--bgColor': disabled ? colors.blueSlate : bgColor,
      color: 'var(--color)',
    } as React.CSSProperties & { '--color'?: string; '--bgColor'?: string },
    className: `
      relative
      ${show ? '' : 'scale-0 opacity-0'}
      transition-transform ease-[steps(5)] duration-300
      group block
      focus-visible:outline-2 focus-visible:outline-darkGoldenrod focus-visible:outline-offset-2
      ${className}
    `,
    disabled,
  };

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="group"
      >
        <div
          {...buttonProps}
        >
          <InnerButtonContent disabled={disabled}>{children}</InnerButtonContent>
        </div>

      </a>
    );
  }

  return (
    <button
      type="button"
      {...buttonProps}
      onClick={disabled ? () => { } : onClick}
    >
      <InnerButtonContent disabled={disabled}>{children}</InnerButtonContent>
    </button>
  );
};
