import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, CheckCircle2, Coffee, Gift, Calendar } from 'lucide-react';
import { syncUserProfileToSheet } from '../lib/google-sheets';

const VIPUpgradeModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-vip-modal', handleOpen);

    const interval = setInterval(() => {
      try {
        const stored = localStorage.getItem('user_profile');
        const prompted = localStorage.getItem('vip_prompt_shown');
        
        if (stored && !prompted) {
          const profile = JSON.parse(stored);
          if (!profile.vipRequested && !profile.isVIP) {
            
            const isFitstreetPage = window.location.pathname.includes('/my-pass') || 
                                  window.location.pathname.includes('/events/fitstreet-2026') || 
                                  window.location.pathname.includes('/scanner');
            
            if (isFitstreetPage) {
              let startTime = sessionStorage.getItem('fitstreet_start_time');
              if (!startTime) {
                startTime = Date.now().toString();
                sessionStorage.setItem('fitstreet_start_time', startTime);
              }
              
              if (Date.now() - parseInt(startTime) >= 20000) {
                setIsOpen(true);
                localStorage.setItem('vip_prompt_shown', 'true');
                clearInterval(interval);
              }
            }
          }
        }
      } catch (e) {}
    }, 1000);

    return () => {
      window.removeEventListener('open-vip-modal', handleOpen);
      clearInterval(interval);
    };
  }, []);

  const handleUpgrade = async () => {
    setIsSubmitting(true);
    try {
      const stored = localStorage.getItem('user_profile');
      let profile = stored ? JSON.parse(stored) : {};
      profile.vipRequested = true;
      localStorage.setItem('user_profile', JSON.stringify(profile));
      
      await syncUserProfileToSheet(profile);
      
      setIsSubmitting(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        setIsOpen(false);
        // Dispatch an event so the footer can update immediately
        window.dispatchEvent(new Event('storage'));
      }, 3000);
    } catch (e) {
      setIsSubmitting(false);
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="relative w-full max-w-sm bg-slate-800 border-2 border-fs-orange/30 rounded-[3rem] p-8 text-center shadow-[0_0_50px_rgba(249,115,22,0.15)] overflow-hidden"
        >
          {!isSuccess && (
            <button 
              onClick={() => setIsOpen(false)} 
              className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors z-50"
            >
              <X className="w-6 h-6" />
            </button>
          )}

          <div className="absolute top-0 right-0 w-64 h-64 bg-fs-orange/10 rounded-full blur-[80px] -z-10 pointer-events-none" />

          {isSuccess ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8">
              <div className="w-24 h-24 bg-fs-orange/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-12 h-12 text-fs-orange" />
              </div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4 text-white">Request Sent!</h3>
              <p className="text-slate-400 font-medium leading-relaxed">
                Your request to become VIP has been submitted. We will get back to you with further details.
              </p>
            </motion.div>
          ) : (
            <>
              <div className="w-20 h-20 bg-gradient-to-br from-fs-orange to-fs-pink rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-fs-orange/30 animate-pulse">
                <Star className="w-10 h-10 text-white fill-white" />
              </div>
              
              <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4 text-white">Upgrade to <span className="text-fs-orange">VIP.</span></h2>
              <div className="flex justify-center mb-6">
                <span className="bg-fs-cyan text-slate-900 px-6 py-2 rounded-full font-black text-xl italic tracking-widest shadow-lg shadow-fs-cyan/20 border-2 border-slate-900">
                  P1,500
                </span>
              </div>
              <p className="text-slate-400 text-sm mb-8 font-medium">Elevate your Fitstreet Heatwave experience entirely.</p>
              
              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <Coffee className="w-5 h-5 text-fs-orange shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Dedicated Lounge</h4>
                    <p className="text-slate-400 text-[10px] font-medium mt-1 uppercase tracking-widest">Premium retreat area</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <Gift className="w-5 h-5 text-fs-orange shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Exclusive Goodie Bag</h4>
                    <p className="text-slate-400 text-[10px] font-medium mt-1 uppercase tracking-widest">Valued at P3,000</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <Calendar className="w-5 h-5 text-fs-orange shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Priority Slots</h4>
                    <p className="text-slate-400 text-[10px] font-medium mt-1 uppercase tracking-widest">Early access to classes</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleUpgrade}
                disabled={isSubmitting}
                className="w-full py-5 bg-fs-orange text-white rounded-[2rem] font-black uppercase tracking-widest text-lg shadow-xl shadow-fs-orange/30 hover:bg-fs-pink transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Sign me Up!'}
              </button>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VIPUpgradeModal;
