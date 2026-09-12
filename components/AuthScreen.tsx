'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { sound } from '@/lib/sound';
import { Button } from './ui/Button';
import { LumiPresenter } from './lumi';
import {
  IconHeart,
  IconArrowRight,
  IconUser,
  IconClose,
  IconSparkles,
  IconEye,
  IconEyeOff,
  IconCheck,
} from './icons/LumiIcons';

export interface AuthScreenProps {
  initialMode?: 'login' | 'register';
  onClose?: () => void;
  onSuccess?: () => void;
  isModal?: boolean;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialMode = 'login',
  onClose,
  onSuccess,
  isModal = false,
}) => {
  const { login, loginAsGuest, register } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(initialMode === 'login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  // Sync mode whenever initialMode prop updates
  useEffect(() => {
    setIsLoginMode(initialMode === 'login');
    setError('');
    setSuccessMsg('');
  }, [initialMode]);

  // Dynamic Lumi companion commentary based on active state
  const companionMessage = isSubmitting
    ? 'Checking the Guild archive scrolls...'
    : successMsg
    ? 'Access granted! Welcome, honored hero!'
    : error
    ? 'Hmm, that didn’t match our records. Check your details!'
    : isLoginMode
    ? 'Welcome back, Adventurer! Ready to continue your journey?'
    : 'A new legend begins! Choose your moniker and enter the realm.';

  const companionMood = isSubmitting
    ? 'explore'
    : successMsg
    ? 'celebrate'
    : error
    ? 'sad'
    : isLoginMode
    ? 'happy'
    : 'sparkle';

  const triggerError = (msg: string) => {
    setError(msg);
    setSuccessMsg('');
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const targetIdentifier = (email || username).trim();

    if (!isLoginMode) {
      const cleanUser = username.trim();
      const cleanEmail = email.trim();

      if (!cleanUser || !cleanEmail || !password) {
        triggerError('Please fill in all required registration fields');
        return;
      }

      if (cleanUser.length < 3) {
        triggerError('Adventurer name must be at least 3 characters');
        return;
      }

      if (!/^[a-zA-Z0-9_-]+$/.test(cleanUser)) {
        triggerError('Adventurer name may only contain letters, numbers, hyphens, and underscores');
        return;
      }

      if (password.length < 6) {
        triggerError('Password must be at least 6 characters long');
        return;
      }

      if (password !== confirmPassword) {
        triggerError('Passwords do not match. Please re-enter carefully.');
        return;
      }

      setIsSubmitting(true);
      const res = await register(cleanUser, cleanEmail, password);
      if (!res.success) {
        triggerError(res.error || 'Failed to create account');
        setIsSubmitting(false);
      } else {
        setSuccessMsg('Account created successfully! Entering the Guild...');
        sound.playLevelUp();
        setTimeout(() => {
          onSuccess?.();
        }, 500);
      }
      return;
    }

    // Login mode
    if (!targetIdentifier) {
      triggerError('Please enter your email or adventurer name');
      return;
    }

    let targetPassword = password;
    if (!targetPassword) {
      if (targetIdentifier.toLowerCase() === 'guest') {
        targetPassword = 'guest123';
      } else if (targetIdentifier.toLowerCase() === 'demo') {
        targetPassword = 'demo123';
      } else {
        triggerError('Please enter your password');
        return;
      }
    }

    setIsSubmitting(true);
    const res = await login(targetIdentifier, targetPassword);
    if (!res.success) {
      triggerError(res.error || 'Invalid credentials');
      setIsSubmitting(false);
    } else {
      setSuccessMsg('Credentials verified! Welcome back.');
      sound.playQuestComplete();
      setTimeout(() => {
        onSuccess?.();
      }, 400);
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);
    sound.playClick();
    const guestRes = await loginAsGuest();
    if (!guestRes.success) {
      // Fallback to standard guest user
      const fallback = await login('guest', 'guest123');
      if (!fallback.success) {
        const demoFallback = await login('demo', 'demo123');
        if (!demoFallback.success) {
          triggerError(guestRes.error || 'Guest access currently unavailable');
          setIsSubmitting(false);
          return;
        }
      }
    }
    setSuccessMsg('Guest session initialized! Entering realm...');
    sound.playQuestComplete();
    setTimeout(() => {
      onSuccess?.();
    }, 400);
  };

  // Quick helper to fill test accounts
  const handleQuickFill = (testUser: string, testPass: string) => {
    sound.playClick();
    setEmail(testUser);
    setPassword(testPass);
    setError('');
  };

  const content = (
    <main className="w-full max-w-4xl bg-surface rounded-3xl border-2 border-slate-200 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 relative z-10 font-headline">
      {/* Top right close button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 text-copy-muted hover:text-copy rounded-xl hover:bg-slate-100 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary"
          aria-label="Close authentication window"
        >
          <IconClose size={20} />
        </button>
      )}

      {/* Left Column: Adventurer Guild Showcase & 3D Companion */}
      <div className="bg-slate-50/80 p-6 sm:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r-2 border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#7A4BC2] bg-[#EADFFF]/60 px-3 py-1 rounded-full font-draft-mono">
              The Adventurer’s Guild
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#1F1730] tracking-tight mt-3.5 leading-tight font-headline">
            Level up your real life, <br />
            <span className="text-[#9966CC]">one small quest at a time.</span>
          </h1>
        </div>

        {/* Dynamic 3D Mascot Companion & Speech Bubble (Enlarged to fill space) */}
        <div className="relative mt-6 my-auto flex flex-col items-center justify-center">
          {/* Ambient Speech Bubble */}
          <div className="mb-2 px-4 py-2.5 bg-white rounded-2xl border-2 border-slate-200/90 shadow-sm text-xs font-bold text-[#2E2438] max-w-[280px] text-center relative animate-in fade-in font-headline">
            {companionMessage}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white" />
          </div>

          <div className="w-full flex items-center justify-center pointer-events-auto">
            <LumiPresenter variant="auth" height={280} showSpeech={false} interactive={true} />
          </div>
          <p className="text-[11px] font-semibold text-copy-muted mt-1 text-center font-headline tracking-wide">
            Tap Lumi to share a moment!
          </p>
        </div>
      </div>

      {/* Right Column: Clean Form & 3D Tactile Action Buttons */}
      <div className="p-6 sm:p-10 flex flex-col justify-center">
        {/* Mode Switcher Tabs */}
        <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200 mb-5 font-headline">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsLoginMode(true);
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-primary ${
              isLoginMode ? 'bg-surface text-[#1F1730] shadow-xs' : 'text-copy-muted hover:text-[#1F1730]'
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
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-primary ${
              !isLoginMode ? 'bg-surface text-[#1F1730] shadow-xs' : 'text-copy-muted hover:text-[#1F1730]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className={`mb-4 p-3 rounded-2xl bg-danger-soft border-2 border-danger/30 text-xs font-semibold text-danger font-headline ${
              shake ? 'animate-shake' : ''
            }`}
          >
            {error}
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div
            role="status"
            aria-live="polite"
            className="mb-4 p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in font-headline"
          >
            <IconCheck size={16} className="text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 font-headline">
          {/* Create Account: Adventurer Name */}
          {!isLoginMode && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="auth-username"
                  className="text-xs font-bold uppercase tracking-wider text-[#2E2438]"
                >
                  Adventurer Name
                </label>
                <span
                  className={`text-[10px] font-bold font-draft-mono ${
                    username.trim().length >= 3 ? 'text-emerald-600' : 'text-copy-muted'
                  }`}
                >
                  {username.trim().length >= 3 ? '✓ 3+ chars' : 'min 3 chars'}
                </span>
              </div>
              <input
                id="auth-username"
                name="username"
                type="text"
                required
                autoComplete="username"
                autoCapitalize="none"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. StarKnight"
                className="w-full h-11 px-4 rounded-2xl border-2 border-slate-200 bg-slate-50 text-sm font-semibold text-[#1F1730] placeholder:text-copy-muted/50 placeholder:font-normal focus:bg-surface focus:border-primary outline-none transition-all"
              />
            </div>
          )}

          {/* Email or Username (Login) / Email Address (Register) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="auth-email"
                className="text-xs font-bold uppercase tracking-wider text-[#2E2438]"
              >
                {isLoginMode ? 'Email or Adventurer Name' : 'Email Address'}
              </label>
              {isLoginMode && (
                <span className="text-[11px] font-medium text-copy-muted">
                  Email or username
                </span>
              )}
            </div>
            <input
              id="auth-email"
              name="email"
              type={isLoginMode ? 'text' : 'email'}
              required
              autoComplete={isLoginMode ? 'username' : 'email'}
              autoCapitalize="none"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder={isLoginMode ? 'arthur@guild.com or hero123' : 'adventurer@guild.com'}
              className="w-full h-11 px-4 rounded-2xl border-2 border-slate-200 bg-slate-50 text-sm font-semibold text-[#1F1730] placeholder:text-copy-muted/50 placeholder:font-normal focus:bg-surface focus:border-primary outline-none transition-all"
            />
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="auth-password"
                className="text-xs font-bold uppercase tracking-wider text-[#2E2438]"
              >
                {isLoginMode ? 'Password' : 'Create Password'}
              </label>
              {!isLoginMode && (
                <span
                  className={`text-[10px] font-bold font-draft-mono ${
                    password.length >= 6 ? 'text-emerald-600' : 'text-copy-muted'
                  }`}
                >
                  {password.length >= 6 ? '✓ 6+ chars' : 'min 6 chars'}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                id="auth-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete={isLoginMode ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder={isLoginMode ? '••••••••' : 'At least 6 characters'}
                className="w-full h-11 pl-4 pr-11 rounded-2xl border-2 border-slate-200 bg-slate-50 text-sm font-semibold text-[#1F1730] placeholder:text-copy-muted/50 placeholder:font-normal focus:bg-surface focus:border-primary outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-copy transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </button>
            </div>
          </div>

          {/* Create Account: Confirm Password */}
          {!isLoginMode && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="auth-confirm-password"
                  className="text-xs font-bold uppercase tracking-wider text-[#2E2438]"
                >
                  Confirm Password
                </label>
                {confirmPassword && (
                  <span
                    className={`text-[10px] font-bold font-draft-mono ${
                      confirmPassword === password ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {confirmPassword === password ? '✓ Passwords match' : 'Passwords differ'}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  id="auth-confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Re-enter your password"
                  className={`w-full h-11 pl-4 pr-11 rounded-2xl border-2 text-sm font-semibold text-[#1F1730] placeholder:text-copy-muted/50 placeholder:font-normal focus:bg-surface outline-none transition-all ${
                    confirmPassword && confirmPassword !== password
                      ? 'border-amber-300 bg-amber-50/30'
                      : confirmPassword && confirmPassword === password
                      ? 'border-emerald-300 bg-emerald-50/30'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-copy transition-colors cursor-pointer"
                  aria-label={showConfirmPassword ? 'Hide confirmed password' : 'Show confirmed password'}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
            </div>
          )}

          {/* Sign In Mode: Quick Test Adventurer Chips */}
          {isLoginMode && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-semibold text-copy-muted">Quick Autofill:</span>
              <div className="flex gap-1.5 font-draft-mono">
                <button
                  type="button"
                  onClick={() => handleQuickFill('hero123', 'password123')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#EADFFF]/50 text-[11px] font-bold text-[#1F1730] border border-slate-200 transition-colors cursor-pointer"
                  title="Autofill hero123"
                >
                  hero123
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('guest', 'guest123')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#EADFFF]/50 text-[11px] font-bold text-[#1F1730] border border-slate-200 transition-colors cursor-pointer"
                  title="Autofill guest"
                >
                  guest
                </button>
              </div>
            </div>
          )}

          {/* 3D Tactile Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            className="mt-2 font-headline font-bold tracking-wide"
            rightIcon={isLoginMode ? <IconArrowRight size={18} /> : <IconSparkles size={18} />}
          >
            {isLoginMode ? 'Enter the Guild' : 'Begin Your Journey'}
          </Button>
        </form>

        {/* 1-Click Instant Guest Access */}
        <div className="mt-5 pt-4 border-t-2 border-slate-100 font-headline">
          <Button
            id="guest-login-button"
            type="button"
            variant="accent"
            size="md"
            fullWidth
            isLoading={isSubmitting}
            onClick={handleGuestLogin}
            className="font-headline font-bold"
            leftIcon={<IconUser size={18} />}
          >
            Continue as Guest (Instant Access)
          </Button>
          <p className="text-xs text-copy-muted text-center mt-2 font-medium">
            Immediate guest session with starter quests. No registration required.
          </p>
        </div>
      </div>
    </main>
  );

  if (isModal) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-copy/60 backdrop-blur-md animate-in fade-in"
        role="dialog"
        aria-modal="true"
        aria-label="Authentication modal"
        onClick={(e) => {
          if (e.target === e.currentTarget && onClose) onClose();
        }}
      >
        <div className="relative w-full max-w-4xl animate-in zoom-in-95 duration-200">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 sm:p-12 relative">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="fixed top-6 left-6 z-40 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface border-2 border-slate-200 text-xs font-bold text-copy hover:border-primary transition-all cursor-pointer shadow-xs"
        >
          <span>← Return to Guild Realm</span>
        </button>
      )}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lavender-soft/30 rounded-full blur-3xl pointer-events-none" />
      {content}
    </div>
  );
};
