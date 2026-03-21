import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, ArrowRight, CheckCircle2, Dumbbell, Brain, Sparkles, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

const steps = [
  { id: 1, title: 'Identity', description: 'Create your movement profile' },
  { id: 2, title: 'Interests', description: 'What moves you?' },
  { id: 3, title: 'Welcome', description: 'Ready for Fitstreet' }
];

const interests = [
  { id: 'move', label: 'Move', icon: Dumbbell, color: 'text-fs-orange', items: ['Functional Training', 'Animal Flow', 'Rope Flow', 'Dance'] },
  { id: 'mind', label: 'Mind', icon: Brain, color: 'text-fs-cyan', items: ['Breathwork', 'Sound Bath', 'Reiki', 'Mindful Movement'] },
  { id: 'live', label: 'Live', icon: Sparkles, color: 'text-brand-purple', items: ['Nutrition', 'Biohacking', 'Community Events', 'Recovery'] }
];

const Register: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    interests: [] as string[]
  });
  const navigate = useNavigate();

  const handleNext = () => setStep(prev => Math.min(prev + 1, 3));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const toggleInterest = (item: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(item)
        ? prev.interests.filter(i => i !== item)
        : [...prev.interests, item]
    }));
  };

  const handleSubmit = () => {
    // Save to local storage for My Pass page
    const finalData = {
      ...formData,
      categories: formData.interests, // Map interests to categories for MyPass.tsx compatibility
      personalized: true // Mark as personalized since we are skipping the onboarding/interest steps for now
    };
    localStorage.setItem('generic_user_profile', JSON.stringify(finalData));
    localStorage.setItem('is_generic_logged_in', 'true');
    // Navigate to Member Dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-stretch bg-white overflow-hidden">
      {/* Visual Brand Side (Left) */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1520&auto=format&fit=crop" 
            alt="Movement" 
            className="w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/40 to-fs-cyan/40 mix-blend-overlay" />
        </div>
        
        <div className="relative z-10 p-16 flex flex-col justify-between w-full">
          <div>
            <img src="/logos/360MOVE Logo.png" alt="360MOVE" className="h-20 w-auto brightness-0 invert mb-8" />
            <h1 className="text-6xl font-black text-white leading-tight uppercase italic tracking-tighter">
              The Future of <br />
              <span className="text-fs-cyan">Movement</span> starts <br />
              with <span className="text-fs-orange">You.</span>
            </h1>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
                <Zap className="w-6 h-6 text-fs-orange" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg uppercase tracking-widest">Move. Mind. Live.</h4>
                <p className="text-slate-400 max-w-sm">Access exclusive classes, track your Fitstreet passport, and unlock rewards.</p>
              </div>
            </div>
            <div className="pt-8 border-t border-white/10 flex items-center gap-12 text-white/40 font-black italic uppercase tracking-widest text-sm">
              <span>360MOVE Membership</span>
              <span>BGC Manila</span>
              <span>360MOVE</span>
            </div>
          </div>
        </div>

        {/* Floating noise SVG for texture */}
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* Form Side (Right) */}
      <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col items-center justify-center relative bg-white">
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 p-3 rounded-full bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-900 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest group"
        >
          <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
          Go Back
        </button>
        <div className="max-w-md w-full space-y-12">
          {/* Progress Stepper */}
          <div className="flex justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2" />
            {steps.map((s) => (
              <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500",
                    step >= s.id ? "bg-slate-900 border-slate-900 text-white scale-110" : "bg-white border-slate-200 text-slate-300"
                  )}
                >
                  {step > s.id ? <CheckCircle2 className="w-6 h-6" /> : s.id}
                </div>
                <span className={cn(
                  "text-[10px] uppercase font-black tracking-widest transition-colors",
                  step >= s.id ? "text-slate-900" : "text-slate-300"
                )}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Join the Movement</h2>
                  <p className="text-slate-500 font-medium">Elevate your wellness journey in Metro Manila.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-400">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-fs-cyan transition-colors" />
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-fs-cyan/20 transition-all text-slate-900 placeholder:text-slate-300 font-bold"
                        placeholder="Juana Dela Cruz"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-400">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-brand-purple transition-colors" />
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-purple/20 transition-all text-slate-900 placeholder:text-slate-300 font-bold"
                        placeholder="juana@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-400">Mobile Number</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-fs-orange transition-colors" />
                      <input 
                        type="tel" 
                        value={formData.mobile}
                        onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-fs-orange/20 transition-all text-slate-900 placeholder:text-slate-300 font-bold"
                        placeholder="+63 9xx xxx xxxx"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleNext}
                  disabled={!formData.name || !formData.email}
                  className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase italic tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Join the Movement
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                <div className="space-y-2">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Define Your Vibe</h2>
                  <p className="text-slate-500 font-medium">What moves you? Select your interests for personalized recommendations.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {interests.flatMap(i => i.items).map(item => (
                    <button
                      key={item}
                      onClick={() => toggleInterest(item)}
                      className={cn(
                        "px-6 py-4 rounded-[2.5rem] text-lg font-black uppercase tracking-widest transition-all duration-300 border-none text-center h-24 flex items-center justify-center leading-tight shadow-sm",
                        formData.interests.includes(item)
                          ? "bg-slate-900 text-white shadow-2xl shadow-slate-900/40 scale-[1.05]"
                          : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={handleBack}
                    className="flex-1 py-5 rounded-[2rem] font-black uppercase italic tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    Go Back
                  </button>
                  <button 
                    onClick={handleNext}
                    disabled={formData.interests.length === 0}
                    className="flex-[2] bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase italic tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 transition-all group disabled:opacity-50"
                  >
                    Next Step
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8"
              >
                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Welcome to the Movement</h2>
                  <p className="text-slate-500 font-medium">Your 360MOVE membership is now active.</p>
                </div>

                <div className="p-8 bg-slate-50 rounded-[3rem] space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Account Active</span>
                    <span className="text-green-500">Live</span>
                  </div>
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white font-black">
                      {formData.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 uppercase italic">{formData.name}</h4>
                      <p className="text-xs text-slate-500">{formData.email}</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleSubmit}
                  className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase italic tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-2xl shadow-slate-900/20"
                >
                  Enter Member Dashboard
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Register;
