'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Type, RotateCcw, Sparkles } from 'lucide-react';

const ZOOM_LEVELS = [100, 115, 130, 145, 160, 175, 190, 200];

export default function AccessibilityManager() {
  const [zoomIndex, setZoomIndex] = useState(0); // Index for ZOOM_LEVELS
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'zoom' | 'reset'>('zoom');

  // Load initial zoom level from localStorage on mount
  useEffect(() => {
    try {
      const savedZoom = localStorage.getItem('kk-text-zoom');
      if (savedZoom) {
        const parsedZoom = parseInt(savedZoom, 10);
        const matchedIndex = ZOOM_LEVELS.indexOf(parsedZoom);
        if (matchedIndex !== -1) {
          setZoomIndex(matchedIndex);
          applyZoom(parsedZoom);
        }
      }
    } catch (e) {
      console.error('Error reading localStorage for text zoom:', e);
    }
  }, []);

  // Helper to apply HTML font size zoom
  const applyZoom = (multiplier: number) => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.fontSize = `${multiplier}%`;
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl/Cmd modifier
      const isModifierPressed = event.ctrlKey || event.metaKey;

      if (!isModifierPressed) return;

      // Ctrl + 2: Cycle/Increase font size
      if (event.key === '2') {
        event.preventDefault();
        
        setZoomIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % ZOOM_LEVELS.length;
          const nextZoom = ZOOM_LEVELS[nextIndex];
          
          applyZoom(nextZoom);
          
          try {
            localStorage.setItem('kk-text-zoom', nextZoom.toString());
          } catch (e) {
            console.error('Error saving zoom setting:', e);
          }

          setToastMessage(`Text Size: ${nextZoom}%`);
          setToastType('zoom');
          setShowToast(true);

          return nextIndex;
        });
      }

      // Ctrl + 0 or Ctrl + 1: Reset font size
      if (event.key === '0' || event.key === '1') {
        event.preventDefault();
        
        const defaultZoom = 100;
        setZoomIndex(0);
        applyZoom(defaultZoom);
        
        try {
          localStorage.setItem('kk-text-zoom', defaultZoom.toString());
        } catch (e) {
          console.error('Error saving zoom setting:', e);
        }

        setToastMessage('Text Size Reset (100%)');
        setToastType('reset');
        setShowToast(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showToast, zoomIndex]);

  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 260 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none"
        >
          <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(255,255,255,0.05)] text-white max-w-sm sm:max-w-md">
            <div className={`p-2.5 rounded-xl flex items-center justify-center ${
              toastType === 'reset' 
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {toastType === 'reset' ? (
                <RotateCcw className="w-5 h-5 animate-pulse" />
              ) : (
                <Type className="w-5 h-5" />
              )}
            </div>

            <div className="flex flex-col">
              <span className="text-[15px] font-semibold tracking-wide">
                {toastMessage}
              </span>
              <span className="text-[11px] text-[#A3A3A3] mt-0.5 leading-normal">
                Press <span className="text-white/80 font-mono bg-white/5 border border-white/10 px-1 py-0.5 rounded">Ctrl + 2</span> to zoom further. Press <span className="text-white/80 font-mono bg-white/5 border border-white/10 px-1 py-0.5 rounded">Ctrl + 0</span> to reset.
              </span>
            </div>

            {toastType === 'zoom' && ZOOM_LEVELS[zoomIndex] > 100 && (
              <div className="ml-auto pl-2 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-400/70" />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
