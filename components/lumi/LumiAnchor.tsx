'use client';

import React, { useEffect, useRef } from 'react';
import { useLumi } from './LumiContext';

interface LumiAnchorProps {
  id: string;
  category?: 'quest' | 'daily' | 'boss' | 'focus' | 'shop' | 'codex';
  className?: string;
  children?: React.ReactNode;
}

export const LumiAnchor: React.FC<LumiAnchorProps> = ({
  id,
  category = 'quest',
  className = '',
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { registerAnchor, unregisterAnchor } = useLumi();

  useEffect(() => {
    if (ref.current && registerAnchor) {
      registerAnchor(id, ref.current, category);
    }
    return () => {
      if (unregisterAnchor) {
        unregisterAnchor(id);
      }
    };
  }, [id, category, registerAnchor, unregisterAnchor]);

  return (
    <div ref={ref} data-lumi-anchor={id} className={`inline-block ${className}`}>
      {children}
    </div>
  );
};
