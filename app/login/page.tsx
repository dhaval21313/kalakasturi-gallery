"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Mail, Lock, ArrowLeft, Palette, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    code: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Admin bypass simulation
      if (formData.email === 'founder@kalakasturi.com' && formData.password === 'admin') {
        localStorage.setItem('kk_user_role', 'admin');
        localStorage.setItem('kk_user_email', formData.email);
        setSuccessMsg('Founder Admin Access Granted! Redirecting...');
        setTimeout(() => {
          router.push('/');
        }, 1200);
        return;
      }

      // Normal user mockup
      localStorage.setItem('kk_user_role', 'collector');
      localStorage.setItem('kk_user_email', formData.email);
      localStorage.setItem('kk_user_name', formData.name || 'Art Collector');

      if (isRegister) {
        setSuccessMsg('Collector account registered successfully! Redirecting...');
      } else {
        setSuccessMsg('Welcome back to the Kala Kasturi Gallery! Redirecting...');
      }

      setTimeout(() => {
        setIsSubmitting(false);
        router.push('/');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-6 relative overflow-hidden pt-20">
      
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[#1c140c]/40 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[#0a110a]/30 blur-[130px] pointer-events-none z-0" />

      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="absolute top-8 left-8 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors cursor-pointer bg-transparent border-0 text-xs uppercase tracking-widest font-semibold"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Auth Card Container */}
      <div className="relative z-10 w-full max-w-[420px] bg-white/2 border border-white/5 p-8 rounded-3xl backdrop-blur-xl shadow-2xl flex flex-col items-center">
        
        {/* Logo and header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative w-16 h-16 bg-black rounded-2xl overflow-hidden border border-white/10 mb-4 flex items-center justify-center">
            <Palette className="w-8 h-8 text-[#C19A6B]" />
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-widest text-white leading-tight flex items-center gap-1.5 justify-center">
            Kala Kasturi
            <Sparkles className="w-4 h-4 text-[#C19A6B]" />
          </h2>
          <p className="text-xs text-neutral-400 font-light mt-1">
            {isRegister ? 'Join as a Fine Art Collector' : 'Access your Private Collector Space'}
          </p>
        </div>

        {/* Status Messages */}
        {errorMsg && (
          <div className="w-full p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium rounded-xl mb-6 text-center">
            ⚠️ {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="w-full p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium rounded-xl mb-6 text-center">
            ✓ {successMsg}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          
          {isRegister && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Collector Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#C19A6B] focus:ring-1 focus:ring-[#C19A6B] outline-none transition-colors"
                required={isRegister}
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Email Address</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="collector@example.com"
                className="w-full bg-neutral-950 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-[#C19A6B] focus:ring-1 focus:ring-[#C19A6B] outline-none transition-colors"
                required
              />
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Password</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full bg-neutral-950 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-[#C19A6B] focus:ring-1 focus:ring-[#C19A6B] outline-none transition-colors"
                required
              />
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#C19A6B] hover:bg-[#b08c60] text-black font-bold text-xs uppercase tracking-widest rounded-full transition-colors active:scale-98 cursor-pointer disabled:opacity-50 mt-4 shadow-lg flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            {isSubmitting ? 'Authorizing Request...' : (isRegister ? 'Create Account' : 'Authorized Access')}
          </button>
        </form>

        {/* Toggle between Register/Login */}
        <div className="w-full text-center mt-6 border-t border-white/5 pt-6 text-xs text-neutral-400">
          {isRegister ? (
            <p>
              Already registered?{' '}
              <button
                onClick={() => { setIsRegister(false); setErrorMsg(''); }}
                className="text-[#C19A6B] hover:underline bg-transparent border-0 cursor-pointer font-semibold ml-1"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New collector?{' '}
              <button
                onClick={() => { setIsRegister(true); setErrorMsg(''); }}
                className="text-[#C19A6B] hover:underline bg-transparent border-0 cursor-pointer font-semibold ml-1"
              >
                Create Profile
              </button>
            </p>
          )}
        </div>

        {/* Hint card */}
        <div className="w-full bg-neutral-950 border border-white/5 p-4 rounded-xl mt-6 text-[10px] text-neutral-500 leading-relaxed font-light text-center">
          💡 <strong>Founder Account Demo Mode:</strong> Use <code className="text-[#C19A6B]">founder@kalakasturi.com</code> with password <code className="text-[#C19A6B]">admin</code> to bypass and simulate immediate access!
        </div>

      </div>
    </div>
  );
}
