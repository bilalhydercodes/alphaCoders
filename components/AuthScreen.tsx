'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { sound } from '@/lib/sound';
import { ArrowRight, UserCheck } from 'lucide-react';
import { IconShield, IconStreak, IconHeart } from './icons/LumiIcons';

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

      <main className="w-full max-w-4xl bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 relative z-10">
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
              Lumi is your supportive companion on a bigger journey. It turns your everyday tasks into adventures, cheers for your progress, and reminds you that a better you is always within reach.
            </p>

            <div className="flex flex-col gap-3 mt-6">
              <div className="flex items-center gap-3 text-xs font-bold text-copy">
                <IconShield size={18} filled className="text-primary" />
                <span>True relational persistence with secure server-side anti-cheat</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-copy">
                <IconStreak size={18} filled className="text-accent" />
                <span>Daily streak multipliers & non-linear leveling curves</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-copy">
                <IconHeart size={18} filled className="text-rose-500" />
                <span>7 dynamic companion moods reflecting your real-world journey</span>
              </div>
            </div>
          </div>

          {/* Hero Mascot Illustration */}
          <div className="relative mt-8 flex items-center justify-center">
            <img
              src="/lumi/extracted/lumi-hero.png"
              alt="Lumi waving"
              className="w-52 h-auto object-contain drop-shadow-md animate-float"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/lumi/extracted/mood-content.png';
              }}
            />
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
              className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                isLoginMode ? 'bg-white text-copy shadow-xs' : 'text-copy-muted hover:text-copy'
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
              className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                !isLoginMode ? 'bg-white text-copy shadow-xs' : 'text-copy-muted hover:text-copy'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Message with Shake */}
          {error && (
            <div className={`mb-4 p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-xs font-bold text-danger ${shake ? 'animate-shake' : ''}`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isLoginMode && (
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-copy mb-1.5">
                  Adventurer Name
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. StarKnight"
                  className="w-full h-12 px-4 rounded-2xl border-2 border-slate-200 bg-slate-50 text-sm font-bold text-copy placeholder:text-copy-muted/60 focus:bg-white focus:border-primary outline-none transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-copy mb-1.5">
                {isLoginMode ? 'Email or Username' : 'Email Address'}
              </label>
              <input
                type={isLoginMode ? 'text' : 'email'}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isLoginMode ? 'adventurer@guild.com or username' : 'adventurer@guild.com'}
                className="w-full h-12 px-4 rounded-2xl border-2 border-slate-200 bg-slate-50 text-sm font-bold text-copy placeholder:text-copy-muted/60 focus:bg-white focus:border-primary outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-copy mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 px-4 rounded-2xl border-2 border-slate-200 bg-slate-50 text-sm font-bold text-copy placeholder:text-copy-muted/60 focus:bg-white focus:border-primary outline-none transition-all"
              />
            </div>

            {/* 3D Tactile Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 mt-2 rounded-2xl btn-3d-primary font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Entering Codex...' : isLoginMode ? 'Enter the Guild' : 'Begin Your Journey'}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </form>

          {/* 1-Click Instant Demo Button */}
          <div className="mt-6 pt-5 border-t-2 border-slate-100">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isSubmitting}
              className="w-full h-11 rounded-2xl btn-3d-accent font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 stroke-[2.5]" />
              <span>1-Click Demo Explorer Login</span>
            </button>
            <p className="text-[11px] text-copy-muted text-center mt-2 font-medium">
              Immediate evaluation account pre-seeded with quests and gear.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
