import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Check, ChevronRight, Sparkles, X, ShieldCheck } from 'lucide-react';
import { syncUserProfileToSheet } from '../lib/google-sheets';

interface OnboardingProps {
  onComplete: () => void;
  onClose: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    categories: [] as string[],
    ageRange: '',
    city: '',
    gender: '',
    agreePrivacy: false,
    signupDate: new Date().toISOString()
  });

  const categories = [
    'High-Octane Fitness', 'Competitive & Team Challenges', 'Casual & Social Fitness', 
    'Strength & Conditioning', 'Mindfulness & Holistic Wellness', 'Recovery & Longevity', 
    'Nutrition & Fuel', 'Movement & Sports', 'Skill-Based Training', 
    'Beauty & Glow', 'Community & Networking', 'Discovery & Brand Experiences'
  ];

  const handleToggleCategory = (cat: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(cat) 
        ? prev.categories.filter(c => c !== cat) 
        : [...prev.categories, cat]
    }));
  };

  const nextStep = () => setStep(s => s + 1);

  const handleFinalize = async () => {
    // Clear existing local activity/passport state to prevent leakage between test users
    localStorage.removeItem('registered_activity_ids');
    localStorage.removeItem('completed_ids');

    const savedProfile = localStorage.getItem('user_profile');
    const profile = savedProfile ? JSON.parse(savedProfile) : {};
    
    // Award 1 point bonus as a starter for Fitstreet
    const starterPoints = 1; 
    
    const updatedProfile = { 
      ...profile, 
      ...formData, 
      personalized: true,
      points: starterPoints,
      pointsOnboarding: 0,
      signupDate: formData.signupDate || new Date().toISOString()
    };
    
    // Sync to Supabase
    try {
      const { syncProfile } = await import('../lib/supabase');
      await syncProfile(updatedProfile, 'fitstreet');
    } catch (err) {
      console.warn('Supabase onboarding sync failed:', err);
    }

    console.log('Finalizing Onboarding - Saving Profile:', updatedProfile);
    localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
    syncUserProfileToSheet(updatedProfile);
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-[40px]">
      <div className="absolute inset-0 noise-bg opacity-[0.03] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white/5 border border-white/10 rounded-[4rem] p-10 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-fs-orange/10 rounded-full blur-[100px] -z-10 animate-pulse-slow" />
        
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-slate-500 hover:text-white transition-all hover:rotate-90 duration-300 z-50 p-2"
        >
          <X className="w-8 h-8" />
        </button>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="relative z-10"
            >
              <div className="mb-12">
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center px-4 py-1.5 rounded-full bg-fs-cyan/20 text-fs-cyan text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-fs-cyan/20"
                >
                  <ShieldCheck className="w-3.5 h-3.5 mr-2" />
                  PHASE 01: FAST-PASS
                </motion.div>
                <h2 className="text-5xl md:text-7xl font-black italic tracking-[-0.03em] mb-6 text-white uppercase leading-none">
                  Get Your Pass.<br /><span className="text-fs-orange">Let's Move!</span>
                </h2>
                <p className="text-xl text-slate-400 font-medium">Elevate your access to Heatwave 2026. Join the ecosystem.</p>
              </div>

              <div className="space-y-6 mb-12">
                <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-fs-cyan transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    className="w-full pl-16 pr-8 py-6 bg-white/5 border border-white/10 rounded-3xl focus:border-fs-cyan/50 outline-none text-white font-bold text-lg transition-all focus:bg-white/10"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-fs-cyan transition-colors" />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="w-full pl-16 pr-8 py-6 bg-white/5 border border-white/10 rounded-3xl focus:border-fs-cyan/50 outline-none text-white font-bold text-lg transition-all focus:bg-white/10"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="relative group">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-fs-cyan transition-colors" />
                  <input 
                    type="tel" 
                    placeholder="Mobile Number" 
                    className="w-full pl-16 pr-8 py-6 bg-white/5 border border-white/10 rounded-3xl focus:border-fs-cyan/50 outline-none text-white font-bold text-lg transition-all focus:bg-white/10"
                    value={formData.mobile}
                    onChange={e => setFormData({...formData, mobile: e.target.value})}
                  />
                </div>

                <label className="flex items-start gap-4 cursor-pointer group/check">
                  <div className="relative flex items-center justify-center mt-1">
                    <input 
                      type="checkbox"
                      className="peer h-6 w-6 opacity-0 absolute cursor-pointer"
                      checked={formData.agreePrivacy}
                      onChange={e => setFormData({...formData, agreePrivacy: e.target.checked})}
                    />
                    <div className="h-6 w-6 border-2 border-white/20 rounded-lg bg-white/5 peer-checked:bg-fs-cyan peer-checked:border-fs-cyan transition-all group-hover/check:border-fs-cyan/50" />
                    <Check className="absolute h-4 w-4 text-slate-900 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <span className="text-xs text-slate-400 font-medium leading-relaxed select-none">
                    I agree to the <button className="text-fs-cyan hover:underline">Terms & Conditions</button> and <button className="text-fs-cyan hover:underline">Data Privacy Policy</button>.
                  </span>
                </label>
              </div>

              <button 
                onClick={nextStep}
                disabled={!formData.name || !formData.email || !formData.mobile || !formData.agreePrivacy}
                className="w-full py-6 bg-fs-orange hover:bg-fs-pink disabled:opacity-30 disabled:grayscale transition-all rounded-3xl text-white font-black uppercase tracking-widest flex items-center justify-center gap-4 shadow-2xl shadow-fs-orange/30 text-lg hover:scale-[1.02] active:scale-95"
              >
                GENERATE MY PASS <ChevronRight className="w-6 h-6" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="relative z-10"
            >
              <div className="mb-12 text-center">
                <div className="w-20 h-20 bg-fs-cyan/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 animate-pulse">
                  <Sparkles className="w-10 h-10 text-fs-cyan" />
                </div>
                <h2 className="text-4xl md:text-6xl font-black italic tracking-tight mb-4 text-white uppercase italic">Define Your <span className="text-fs-cyan">Vibe.</span></h2>
                <p className="text-lg text-slate-400 font-medium">Tailor the ecosystem to your high-performance goals.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleToggleCategory(cat)}
                    className={`px-4 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.1em] transition-all duration-300 text-center flex items-center justify-center min-h-[56px] leading-tight ${
                      formData.categories.includes(cat)
                        ? 'bg-fs-cyan text-slate-900 shadow-[0_0_20px_rgba(45,212,191,0.5)] border-transparent'
                        : 'bg-white/5 text-white/80 border border-white/10 hover:border-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-6 mb-12">
                <select 
                  className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 outline-none focus:border-fs-cyan transition-all appearance-none cursor-pointer"
                  value={formData.ageRange}
                  onChange={e => setFormData({...formData, ageRange: e.target.value})}
                >
                  <option value="" className="bg-slate-900">Age</option>
                  <option value="18-24" className="bg-slate-900">18-24</option>
                  <option value="25-34" className="bg-slate-900">25-34</option>
                  <option value="35-44" className="bg-slate-900">35-44</option>
                  <option value="45+" className="bg-slate-900">45+</option>
                </select>
                <select 
                  className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 outline-none focus:border-fs-cyan transition-all appearance-none cursor-pointer"
                  value={formData.gender}
                  onChange={e => setFormData({...formData, gender: e.target.value})}
                >
                  <option value="" className="bg-slate-900">Gender</option>
                  <option value="Male" className="bg-slate-900">Male</option>
                  <option value="Female" className="bg-slate-900">Female</option>
                  <option value="Non-binary" className="bg-slate-900">Non-binary</option>
                </select>
                <select 
                  className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 outline-none focus:border-fs-cyan transition-all appearance-none cursor-pointer col-span-2"
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                >
                  <option value="" className="bg-slate-900">City</option>
                  <option value="Taguig" className="bg-slate-900">Taguig (BGC)</option>
                  <option value="Makati" className="bg-slate-900">Makati</option>
                  <option value="Manila" className="bg-slate-900">Manila</option>
                  <option value="Quezon City" className="bg-slate-900">Quezon City</option>
                  <option value="Other" className="bg-slate-900">Other</option>
                </select>
              </div>

              <button 
                onClick={handleFinalize}
                className="w-full py-6 bg-fs-cyan text-slate-900 rounded-3xl transition-all font-black uppercase tracking-widest flex items-center justify-center gap-4 shadow-2xl shadow-fs-cyan/30 text-lg hover:scale-[1.02] active:scale-95"
              >
                FINALIZE SETUP <Check className="w-6 h-6 border-2 border-slate-900 rounded-full p-0.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-16 flex justify-center gap-4">
          <div className={`h-1.5 transition-all duration-500 rounded-full ${step === 1 ? 'w-12 bg-fs-orange' : 'w-4 bg-slate-700'}`} />
          <div className={`h-1.5 transition-all duration-500 rounded-full ${step === 2 ? 'w-12 bg-fs-cyan' : 'w-4 bg-slate-700'}`} />
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
