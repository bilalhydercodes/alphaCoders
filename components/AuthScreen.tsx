'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { sound } from '@/lib/sound';
import { Button } from './ui/Button';
import { LumiPresenter } from './lumi';
import { LumiMascot } from './LumiMascot';
import {
  IconShield,
  IconStreakFlame,
  IconHeart,
  IconArrowRight,
  IconUser,
} from './icons/LumiIcons';

export const AuthScreen: React.FC = () => {
  const { login, register } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLoginMode && (!username.trim() || !email.trim() || !password.trim())) {
      triggerError('Please fill in all fields');
      return;
    }

    if (isLoginMode && (!email.trim() && !username.trim() || !password.trim())) {
      triggerError('Please provide your credentials');
      return;
    }

    setIsSubmitting(true);

    if (isLoginMode) {
      const res = await login(email || username, password);
      if (!res.success) {
        triggerError(res.error || 'Invalid credentials');
      }
    } else {
      const res = await register(username.trim(), email.trim(), password);
      if (!res.success) {
        triggerError(res.error || 'Failed to create account');
      }
    }

    setIsSubmitting(false);
  };

  const triggerError = (msg: string) => {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const handleDemoLogin = async () => {
    setError('');
    setIsSubmitting(true);
    sound.playClick();
    const demoRes = await login('adventurer@liferpg.guild', 'Password123!');
    if (!demoRes.success) {
      await register('GuildChampion', 'adventurer@liferpg.guild', 'Password123!');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 sm:p-12">
      {/* Background ambient gradient glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lavender-soft/30 rounded-full blur-3xl pointer-events-none" />

      <main className="w-full max-w-4xl bg-surface rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 relative z-10">
        {/* Left Column: Hero & Companion Art */}
        <div className="bg-slate-50/70 p-8 sm:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r-2 border-slate-200">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-primary">
              The Adventurer’s Guild
            </span>

            <h1 className="text-3xl sm:text-4xl font-black text-copy tracking-tight mt-2 leading-tight">
              Level up your real life,{' '}
              <span className="text-primary block">one small quest at a time.</span>
            </h1>

            <p className="text-sm text-copy-muted mt-4 leading-relaxed font-semibold">
              Lumi is your supportive companion on a bigger journey. It turns everyday habits into rewarding quests, cheers for your milestones, and keeps you moving forward.
            </p>

            <div className="flex flex-col gap-3 mt-6">
              <div className="flex items-center gap-3 text-xs font-bold text-copy">
                <IconShield size={18} filled className="text-primary shrink-0" />
                <span>True relational persistence with secure server-side anti-cheat</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-copy">
                <IconStreakFlame size={18} filled className="text-accent shrink-0 animate-flame-breathe" />
                <span>Daily streak multipliers & non-linear leveling curves</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-copy">
                <IconHeart size={18} filled className="text-danger shrink-0" />
                <span>Real-time interactive 3D companion reacting to your real journey</span>
              </div>
            </div>
          </div>

          {/* Hero Mascot 3D Model */}
          <div className="relative mt-6 flex items-center justify-center">
            <LumiPresenter variant="dashboard" height={220} showSpeech={false} interactive={true} />
          </div>
        </div>

        {/* Right Column: Clean Form & 3D Tactile Buttons */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          {/* Mode Switcher */}
          <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200 mb-6">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setIsLoginMode(true);
                setError('');
              }}
              className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-primary ${
                isLoginMode ? 'bg-surface text-copy shadow-xs' : 'text-copy-muted hover:text-copy'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setIsLoginMode(false);
                setError('');
              }}
              className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-primary ${
                !isLoginMode ? 'bg-surface text-copy shadow-xs' : 'text-copy-muted hover:text-copy'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Message with Shake and ARIA alert */}
          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className={`mb-4 p-3.5 rounded-2xl bg-danger-soft border-2 border-danger/30 text-xs font-bold text-danger ${shake ? 'animate-shake' : ''}`}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isLoginMode && (
              <div>
                <label
                  htmlFor="auth-username"
                  className="block text-xs font-black uppercase tracking-wider text-copy mb-1.5"
                >
                  Adventurer Name
                </label>
                <input
                  id="auth-username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. StarKnight"
                  className="w-full h-12 px-4 rounded-2xl border-2 border-slate-200 bg-slate-50 text-sm font-bold text-copy placeholder:text-copy-muted/60 focus:bg-surface focus:border-primary outline-none transition-all focus-visible:outline-2 focus-visible:outline-primary"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="auth-email"
                className="block text-xs font-black uppercase tracking-wider text-copy mb-1.5"
              >
                {isLoginMode ? 'Email or Username' : 'Email Address'}
              </label>
              <input
                id="auth-email"
                type={isLoginMode ? 'text' : 'email'}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isLoginMode ? 'adventurer@guild.com or username' : 'adventurer@guild.com'}
                className="w-full h-12 px-4 rounded-2xl border-2 border-slate-200 bg-slate-50 text-sm font-bold text-copy placeholder:text-copy-muted/60 focus:bg-surface focus:border-primary outline-none transition-all focus-visible:outline-2 focus-visible:outline-primary"
              />
            </div>

            <div>
              <label
                htmlFor="auth-password"
                className="block text-xs font-black uppercase tracking-wider text-copy mb-1.5"
              >
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 px-4 rounded-2xl border-2 border-slate-200 bg-slate-50 text-sm font-bold text-copy placeholder:text-copy-muted/60 focus:bg-surface focus:border-primary outline-none transition-all focus-visible:outline-2 focus-visible:outline-primary"
              />
            </div>

            {/* 3D Tactile Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              className="mt-2"
              rightIcon={<IconArrowRight size={18} />}
            >
              {isLoginMode ? 'Enter the Guild' : 'Begin Your Journey'}
            </Button>
          </form>

          {/* 1-Click Instant Demo Button */}
          <div className="mt-6 pt-5 border-t-2 border-slate-100">
            <Button
              type="button"
              variant="accent"
              size="md"
              fullWidth
              disabled={isSubmitting}
              onClick={handleDemoLogin}
              leftIcon={<IconUser size={18} />}
            >
              1-Click Demo Explorer Login
            </Button>
            <p className="text-[11px] text-copy-muted text-center mt-2 font-medium">
              Immediate evaluation account pre-seeded with quests and gear.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
