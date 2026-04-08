/**
 * Local shim for @react-three/a11y.
 * The installed package has a broken/missing dist file, so we provide
 * lightweight no-op replacements for the three things the codebase uses:
 *   - <A11y>        - wraps children, provides actionCall on click
 *   - <A11yAnnouncer> - renders nothing (screen reader live region)
 *   - useA11y()     - returns { focus: false }
 */
import React, { createContext, useContext, useMemo } from 'react';
import { GroupProps } from '@react-three/fiber';

// ── context ──────────────────────────────────────────────────────────────────
const A11yContext = createContext({ focus: false });

// ── useA11y ───────────────────────────────────────────────────────────────────
export function useA11y() {
  return useContext(A11yContext);
}

// ── A11y ──────────────────────────────────────────────────────────────────────
export function A11y({
  children,
  actionCall,
  role: _role,
  description: _description,
  activationMsg: _activationMsg,
  a11yElStyle: _a11yElStyle,
  ...groupProps
}: {
  children: React.ReactNode;
  actionCall?: () => void;
  role?: string;
  description?: string;
  activationMsg?: string;
  a11yElStyle?: React.CSSProperties;
} & GroupProps) {
  const value = useMemo(() => ({ focus: false }), []);
  return (
    <A11yContext.Provider value={value}>
      {/* @ts-ignore – group is a valid R3F element */}
      <group onClick={actionCall} {...groupProps}>
        {children}
      </group>
    </A11yContext.Provider>
  );
}

// ── A11yAnnouncer ─────────────────────────────────────────────────────────────
export function A11yAnnouncer() {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'absolute',
        width: 1,
        height: 1,
        overflow: 'hidden',
        clip: 'rect(0,0,0,0)',
        whiteSpace: 'nowrap',
      }}
    />
  );
}
