'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { sound } from '@/lib/sound';
import { Sparkles, ArrowRight, ShieldCheck, Heart, UserCheck, Flame } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { login, register } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (isLoginMode) {
      const res = await login(email || username, password);
      if (!res.success) {
        setError(res.error || 'Failed to login');
      }
    } else {
      if (!username.trim() || !email.trim() || !password.trim()) {
        setError('All fields are required');
        setIsSubmitting(false);
        return;
      }
      const res = await register(username.trim(), email.trim(), password);
      if (!res.success) {
        setError(res.error || 'Failed to register');
      }
    }
    setIsSubmitting(false);
  };

  const handleDemoLogin = async () => {
    setError('');
    setIsSubmitting(true);
    sound.playClick();
    // Try login or register demo account
    const demoRes = await login('adventurer@liferpg.guild', 'Password123!');
    if (!demoRes.success) {
      await register('GuildChampion', 'adventurer@liferpg.guild', 'Password123!');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background ambient decorative shapes */}
      <div className="fixed -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-40 -left-40 w-96 h-96 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

      <main className="w-full max-w-4xl bg-white rounded-lumi-lg border border-primary/20 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 relative z-10">
        {/* Left: Companion Welcome & Story */}
        <div className="bg-gradient-to-br from-lavender-soft/60 to-white p-8 sm:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-primary/15">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-primary/20 text-xs font-bold text-primary shadow-xs mb-4">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Small steps. Big quests.</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-copy tracking-tight">
              Life RPG <span className="text-primary block">with Lumi</span>
            </h1>

            <p className="text-xs sm:text-sm text-copy-muted mt-3 leading-relaxed">
              Lumi is your little companion on a bigger journey. It turns your everyday tasks into adventures, cheers for your progress, and reminds you that a better you is always within reach!
            </p>

            {/* Feature highlights */}
            <div className="flex flex-col gap-2.5 mt-6">
              <div className="flex items-center gap-2.5 text-xs text-copy">
                <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Anti-cheat verified server-side progression & stats</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-copy">
                <Flame className="w-4 h-4 text-accent flex-shrink-0" />
                <span>Daily streak multipliers, non-linear level curves & raids</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-copy">
                <Heart className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>7 dynamic companion mood states reflecting your real standing</span>
              </div>
            </div>
          </div>

          {/* Hero Mascot Artwork */}
          <div className="relative mt-8 flex items-center justify-center">
            <img
              src="/lumi/extracted/lumi-hero.png"
              alt="Lumi waving enthusiastically"
              className="w-56 h-auto object-contain drop-shadow-md animate-float"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/lumi/extracted/mood-content.png';
              }}
            />
          </div>
        </div>

        {/* Right: Authentication Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          {/* Toggle between Login and Register */}
          <div className="flex rounded-xl bg-background-subtle p-1 border border-primary/15 mb-6" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={isLoginMode}
              onClick={() => {
                sound.playClick();
                setIsLoginMode(true);
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                isLoginMode ? 'bg-white text-copy shadow-sm' : 'text-copy-muted hover:text-copy'
              }`}
            >
              Enter Guild (Log In)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={!isLoginMode}
              onClick={() => {
                sound.playClick();
                setIsLoginMode(false);
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                !isLoginMode ? 'bg-white text-copy shadow-sm' : 'text-copy-muted hover:text-copy'
              }`}
            >
              New Adventurer (Sign Up)
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-danger-soft border border-danger/20 text-xs font-semibold text-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isLoginMode && (
              <div>
                <label className="block text-xs font-bold text-copy mb-1">
                  Adventurer Handle (Username)
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. StarKnight"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-primary/20 bg-background text-sm text-copy placeholder:text-copy-muted focus:bg-white focus:border-primary outline-none transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-copy mb-1">
                {isLoginMode ? 'Email or Username' : 'Guild Email'}
              </label>
              <input
                type={isLoginMode ? 'text' : 'email'}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isLoginMode ? 'adventurer@guild.com or username' : 'adventurer@guild.com'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-primary/20 bg-background text-sm text-copy placeholder:text-copy-muted focus:bg-white focus:border-primary outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-copy mb-1">
                Passcode / Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-primary/20 bg-background text-sm text-copy placeholder:text-copy-muted focus:bg-white focus:border-primary outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-primary text-primary-on font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-primary-hover active:scale-97 transition-all mt-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Verifying Codex...' : isLoginMode ? 'Enter Guild' : 'Begin Your Journey'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-Click Demo Account for Evaluators */}
          <div className="mt-6 pt-5 border-t border-primary/10">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-accent text-primary-on font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-accent-hover active:scale-97 transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Instant Demo Explorer Login (1-Click)</span>
            </button>
            <p className="text-[11px] text-copy-muted text-center mt-2">
              For judges & quick evaluation: auto-creates or logs into a seeded demo account!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
