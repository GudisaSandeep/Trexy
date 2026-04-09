'use client'

import { Logo } from '@/components/Logo'
import { login, signup, resetPassword } from './actions'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export default function AuthPage() {
  const searchParams = useSearchParams()
  const view = searchParams.get('view') || 'login' // 'login', 'signup', 'forgot-password'
  const error = searchParams.get('error')
  const message = searchParams.get('message')
  
  const [showPassword, setShowPassword] = useState(false)
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen relative overflow-hidden bg-[#180a1c] font-sans selection:bg-pink-500/30">
      {/* Immersive blurred painting to simulate the screenshot's gradient background */}
      <div className="absolute top-[-10%] left-[0%] w-[70%] h-[70%] bg-[#b83262] opacity-30 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-[30%] right-[-20%] w-[60%] h-[60%] bg-[#642475] opacity-40 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[0%] left-[-10%] w-[50%] h-[50%] bg-[#bd4522] opacity-20 blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[420px] px-6 py-6 animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10 flex flex-col items-center">
        
        <div className="flex justify-center mb-6">
          <Logo width={100} />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-[32px] font-display font-black text-white tracking-tight leading-tight">
            {view === 'login' && 'Welcome Back'}
            {view === 'signup' && 'Join Trex'}
            {view === 'forgot-password' && 'Password Reset'}
          </h2>
          <p className="text-white/70 font-semibold tracking-wide text-[15px] mt-1.5 drop-shadow-md">
            {view === 'login' && 'Sign in to continue your journey on Trex'}
            {view === 'signup' && 'Start your meme journey today'}
            {view === 'forgot-password' && 'Enter your email to recover access'}
          </p>
        </div>

        <div className="w-full bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden">
          
          {/* Subtle noise/texture overlay for the glass container */}
          <div className="absolute inset-0 bg-white/5 opacity-0 z-[-1]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")', mixBlendMode: 'overlay' }} />

          <form className="flex flex-col space-y-4">
            {error && (
              <div className="px-4 py-3 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-100 text-sm font-semibold text-center shadow-inner">
                {error}
              </div>
            )}
            {message && (
              <div className="px-4 py-3 rounded-2xl bg-[#FF0080]/20 border border-[#FF0080]/30 text-pink-100 text-sm font-semibold text-center shadow-inner">
                {message}
              </div>
            )}

            {view === 'signup' && (
              <div className="relative flex items-center">
                <div className="absolute left-5 text-white/50 pointer-events-none">
                  <User size={20} strokeWidth={2.5} />
                </div>
                <input 
                  id="username" 
                  name="username" 
                  type="text" 
                  required={view === 'signup'}
                  className="w-full pl-14 pr-5 py-4.5 rounded-[1.25rem] bg-[#3a2033]/60 backdrop-blur-md border border-white/5 text-white placeholder-white/40 focus:outline-none focus:bg-[#3a2033]/80 focus:border-white/20 transition-all font-semibold shadow-inner"
                  placeholder="Username"
                />
              </div>
            )}

            <div className="relative flex items-center">
              <div className="absolute left-5 text-white/50 pointer-events-none">
                <Mail size={20} strokeWidth={2.5} />
              </div>
              <input 
                id="email" 
                name="email" 
                type="email" 
                required 
                className="w-full pl-14 pr-5 py-4.5 rounded-[1.25rem] bg-[#3a2033]/60 backdrop-blur-md border border-white/5 text-white placeholder-white/40 focus:outline-none focus:bg-[#3a2033]/80 focus:border-white/20 transition-all font-semibold shadow-inner"
                placeholder="Email Address"
              />
            </div>
            
            {view !== 'forgot-password' && (
              <div className="relative flex items-center">
                <div className="absolute left-5 text-white/50 pointer-events-none">
                  <Lock size={20} strokeWidth={2.5} />
                </div>
                <input 
                  id="password" 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  required 
                  minLength={6}
                  className="w-full pl-14 pr-14 py-4.5 rounded-[1.25rem] bg-[#3a2033]/60 backdrop-blur-md border border-white/5 text-white placeholder-white/40 focus:outline-none focus:bg-[#3a2033]/80 focus:border-white/20 transition-all font-semibold shadow-inner"
                  placeholder={view === 'signup' ? "Password (min 6 chars)" : "Password"}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} strokeWidth={2.5} /> : <Eye size={20} strokeWidth={2.5} />}
                </button>
              </div>
            )}

            {view === 'login' && (
              <div className="flex justify-end pt-1">
                <Link href="/login?view=forgot-password" className="text-[13px] text-white/70 hover:text-white font-bold transition-colors">
                  Forgot Password?
                </Link>
              </div>
            )}
            
            <div className="pt-2">
              {view === 'login' && (
                <button 
                  formAction={login}
                  className="w-full relative flex items-center justify-center bg-gradient-to-r from-[#FF0080] to-[#7928CA] text-white font-bold py-4 rounded-[1.25rem] hover:opacity-90 active:scale-[0.98] transition-all shadow-[0_4px_25px_rgba(255,0,128,0.35)] text-[16px] tracking-wide"
                >
                  Log In <span className="absolute right-6 text-xl font-light">→</span>
                </button>
              )}
              {view === 'signup' && (
                <button 
                  formAction={signup}
                  className="w-full relative flex items-center justify-center bg-gradient-to-r from-[#FF512F] to-[#DD2476] text-white font-bold py-4 rounded-[1.25rem] hover:opacity-90 active:scale-[0.98] transition-all shadow-[0_4px_25px_rgba(221,36,118,0.35)] text-[16px] tracking-wide"
                >
                  Create Account <span className="absolute right-6 text-xl font-light">→</span>
                </button>
              )}
              {view === 'forgot-password' && (
                <button 
                  formAction={resetPassword}
                  className="w-full relative flex items-center justify-center bg-gradient-to-r from-[#FF0080] to-[#7928CA] text-white font-bold py-4 rounded-[1.25rem] hover:opacity-90 active:scale-[0.98] transition-all shadow-[0_4px_25px_rgba(255,0,128,0.35)] text-[16px] tracking-wide"
                >
                  Send Reset Link
                </button>
              )}
            </div>
          </form>

          {view === 'login' && (
            <div className="mt-8">
              <div className="relative flex items-center justify-center mb-6">
                <div className="absolute w-[80%] h-[1px] bg-white/10" />
                <span className="relative bg-transparent px-3 text-[13px] text-white/50 font-bold backdrop-blur-lg">
                  or continue with
                </span>
              </div>
              <button 
                type="button"
                className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white font-bold py-4 rounded-[1.25rem] hover:bg-white/10 active:scale-[0.98] transition-all"
              >
               <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
            </div>
          )}
        </div>

        <div className="pt-8 text-center text-[15px] font-bold pb-4">
          {view === 'login' && (
            <p className="text-white/60">
              Don't have an account?{' '}
              <Link href="/login?view=signup" className="text-[#FF0080] hover:text-white transition-colors ml-1">
                Sign Up
              </Link>
            </p>
          )}
          {view === 'signup' && (
            <p className="text-white/60">
              Already have an account?{' '}
              <Link href="/login?view=login" className="text-[#FF0080] hover:text-white transition-colors ml-1">
                Sign In
              </Link>
            </p>
          )}
          {view === 'forgot-password' && (
            <p className="text-white/60">
              Remembered your password?{' '}
              <Link href="/login?view=login" className="text-[#FF0080] hover:text-white transition-colors ml-1">
                Back to Sign In
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
