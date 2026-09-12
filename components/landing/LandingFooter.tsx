'use client';

import React from 'react';
import { LumiMascot } from '../LumiMascot';
import { IconSparkles } from '../icons/LumiIcons';

interface LandingFooterProps {
  onOpenAuth: () => void;
  onOpenShortcuts?: () => void;
  embedded?: boolean;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  onOpenAuth,
  onOpenShortcuts,
  embedded,
}) => {
  return (
    <footer
      className={`relative w-full ${
        embedded
          ? 'pt-12 pb-10 px-4 sm:px-10 bg-white'
          : 'bg-surface border-t-2 border-slate-200/80 pt-16 pb-12 px-4 sm:px-8'
      }`}
    >
      <div className="max-w-[1140px] mx-auto flex flex-col gap-12">
        {/* Pre-footer Call-To-Action Banner */}
        <div className="bg-gradient-to-br from-lavender-soft/60 to-surface rounded-3xl border-2 border-primary/20 p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white border-2 border-primary/25 shadow-xs flex items-center justify-center shrink-0">
              <LumiMascot mood="radiant" size={42} />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-copy tracking-tight">
                Ready to Turn Everyday Chores into Quests?
              </h3>
              <p className="text-xs sm:text-sm text-copy-muted font-medium mt-1">
                Free, open-source, and engineered to bridge the delayed gratification gap.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenAuth}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black text-white bg-primary hover:bg-[#8B54C2] border-b-4 border-[#7343A8] active:border-b-0 active:translate-y-1 shadow-md hover:shadow-lg transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-primary shrink-0"
          >
            <IconSparkles size={16} />
            <span>Join the Adventurers Guild</span>
          </button>
        </div>

        {/* Footer Navigation & Metadata */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-100 pt-8 text-xs font-semibold text-copy-muted">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-copy">Life RPG with Lumi</span>
            <span>·</span>
            <span>Chronicles of Mastery</span>
            <span>·</span>
            <span className="text-[#1B6E32] font-black">WCAG AA / AAA Compliant</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/bilalhydercodes/alphaCoders.git"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors cursor-pointer"
            >
              GitHub Repository
            </a>
            {onOpenShortcuts && (
              <button
                type="button"
                onClick={onOpenShortcuts}
                className="hover:text-primary transition-colors cursor-pointer"
              >
                Keyboard Shortcuts (?)
              </button>
            )}
            <a
              href="/llms.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors cursor-pointer"
            >
              llms.txt
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
