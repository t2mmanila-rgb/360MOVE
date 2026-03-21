import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ChevronRight, Check, Share2, 
  Dumbbell, Utensils, Gift
} from 'lucide-react';

interface EarnPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: any) => void;
}

const EarnPointsModal: React.FC<EarnPointsModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [formData, setFormData] = useState({
    fitnessLevel: '',
    workoutFrequency: '',
    yearsActive: '',
    preferredTime: '',
    trainingGoal: '',
    dietType: '',
    supplementUsage: [] as string[],
    occupation: '',
    workSetup: '',
    incomeBracket: '',
    companyName: '',
  });

  const nextStep = () => setStep(s => s + 1);

  const handleSubmit = () => {
    const savedProfile = localStorage.getItem('user_profile');
    const profile = savedProfile ? JSON.parse(savedProfile) : {};
    
    const updatedProfile = {
      ...profile,
      ...formData,
      profileCompleted: true,
      pointsProfileCompletion: 1,
      points: (profile.points || 0) + 1 // Add 1 point for profile completion
    };
    
    localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
    
    if (formData.workSetup === 'Corporate') {
      onComplete(updatedProfile);
      setShowSharePopup(true);
    } else {
      onComplete(updatedProfile);
      onClose();
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Fitstreet 2026 Corporate Offers',
      text: 'Check out these exclusive corporate wellness offers for our team!',
      url: 'https://360corp.vercel.app/corporate-offers'
    };

    const savedProfile = localStorage.getItem('user_profile');
    const profile = savedProfile ? JSON.parse(savedProfile) : {};

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        window.open(shareData.url, '_blank');
      }
      
      const updated = {
        ...profile,
        pointsHRShare: (profile.pointsHRShare || 0) + 1,
        points: (profile.points || 0) + 1
      };
      localStorage.setItem('user_profile', JSON.stringify(updated));
      onComplete(updated);
      setShowSharePopup(false);
      onClose();
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-2xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-fs-dark border border-white/10 rounded-[3rem] p-8 md:p-12 overflow-hidden shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="mb-10 text-center">
                <div className="w-16 h-16 bg-fs-orange/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Dumbbell className="w-8 h-8 text-fs-orange" />
                </div>
                <h2 className="text-3xl font-black italic uppercase italic tracking-tighter text-white">Fitness <span className="text-fs-orange">DNA.</span></h2>
                <p className="text-slate-400 font-medium">Earn 1 point by sharing your athletic profile.</p>
              </div>

              <div className="space-y-6 mb-10">
                <div className="grid grid-cols-2 gap-4">
                  <select 
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold text-white outline-none focus:border-fs-orange transition-all"
                    value={formData.fitnessLevel}
                    onChange={e => setFormData({...formData, fitnessLevel: e.target.value})}
                  >
                    <option value="" className="bg-fs-dark">Fitness Level</option>
                    <option value="Beginner" className="bg-fs-dark">Beginner</option>
                    <option value="Intermediate" className="bg-fs-dark">Intermediate</option>
                    <option value="Advanced" className="bg-fs-dark">Advanced</option>
                    <option value="Athlete" className="bg-fs-dark">Athlete</option>
                  </select>
                  <select 
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold text-white outline-none focus:border-fs-orange transition-all"
                    value={formData.workoutFrequency}
                    onChange={e => setFormData({...formData, workoutFrequency: e.target.value})}
                  >
                    <option value="" className="bg-fs-dark">Frequency</option>
                    <option value="1-2x week" className="bg-fs-dark">1-2x week</option>
                    <option value="3-4x week" className="bg-fs-dark">3-4x week</option>
                    <option value="5+ times" className="bg-fs-dark">5+ times</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Years active in fitness"
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold text-white outline-none focus:border-fs-orange transition-all"
                    value={formData.yearsActive}
                    onChange={e => setFormData({...formData, yearsActive: e.target.value})}
                  />
                  <select 
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold text-white outline-none focus:border-fs-orange transition-all"
                    value={formData.preferredTime}
                    onChange={e => setFormData({...formData, preferredTime: e.target.value})}
                  >
                    <option value="" className="bg-fs-dark">Preferred Time</option>
                    <option value="Morning" className="bg-fs-dark">Morning</option>
                    <option value="Lunch" className="bg-fs-dark">Lunch</option>
                    <option value="Evening" className="bg-fs-dark">Evening</option>
                  </select>
                </div>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold text-white outline-none focus:border-fs-orange transition-all"
                  value={formData.trainingGoal}
                  onChange={e => setFormData({...formData, trainingGoal: e.target.value})}
                >
                  <option value="" className="bg-fs-dark">Main Training Goal</option>
                  <option value="Lose weight" className="bg-fs-dark">Lose weight</option>
                  <option value="Build muscle" className="bg-fs-dark">Build muscle</option>
                  <option value="Improve endurance" className="bg-fs-dark">Improve endurance</option>
                  <option value="Stay healthy" className="bg-fs-dark">Stay healthy</option>
                  <option value="Stress relief" className="bg-fs-dark">Stress relief</option>
                </select>
              </div>

              <button 
                onClick={nextStep}
                className="w-full py-5 bg-fs-orange text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-fs-orange/20"
              >
                Next Step <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="mb-10 text-center">
                <div className="w-16 h-16 bg-fs-cyan/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Utensils className="w-8 h-8 text-fs-cyan" />
                </div>
                <h2 className="text-3xl font-black italic uppercase italic tracking-tighter text-white">Fuel & <span className="text-fs-cyan">Lifestyle.</span></h2>
                <p className="text-slate-400 font-medium">Almost there. Complete your profile for 1 point.</p>
              </div>

              <div className="space-y-6 mb-10">
                <div className="grid grid-cols-2 gap-4">
                  <select 
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold text-white outline-none focus:border-fs-cyan transition-all"
                    value={formData.dietType}
                    onChange={e => setFormData({...formData, dietType: e.target.value})}
                  >
                    <option value="" className="bg-fs-dark">Diet Type</option>
                    <option value="None / Balanced" className="bg-fs-dark">None / Balanced</option>
                    <option value="High-protein" className="bg-fs-dark">High-protein</option>
                    <option value="Vegan / Vegetarian" className="bg-fs-dark">Vegan / Vegetarian</option>
                    <option value="Keto / Low carb" className="bg-fs-dark">Keto / Low carb</option>
                  </select>
                  <select 
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold text-white outline-none focus:border-fs-cyan transition-all"
                    value={formData.workSetup}
                    onChange={e => setFormData({...formData, workSetup: e.target.value})}
                  >
                    <option value="" className="bg-fs-dark">Work Setup</option>
                    <option value="Corporate" className="bg-fs-dark">Corporate</option>
                    <option value="Entrepreneur" className="bg-fs-dark">Entrepreneur</option>
                    <option value="Freelancer" className="bg-fs-dark">Freelancer</option>
                    <option value="Student" className="bg-fs-dark">Student</option>
                  </select>
                </div>
                
                <input 
                  type="text" 
                  placeholder="Occupation / Industry"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold text-white outline-none focus:border-fs-cyan transition-all"
                  value={formData.occupation}
                  onChange={e => setFormData({...formData, occupation: e.target.value})}
                />

                {formData.workSetup === 'Corporate' && (
                  <motion.input 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    type="text" 
                    placeholder="Company Name"
                    className="w-full bg-fs-cyan/10 border border-fs-cyan/30 rounded-2xl p-5 text-sm font-bold text-white outline-none focus:border-fs-cyan transition-all"
                    value={formData.companyName}
                    onChange={e => setFormData({...formData, companyName: e.target.value})}
                  />
                )}

                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold text-white outline-none focus:border-fs-cyan transition-all"
                  value={formData.incomeBracket}
                  onChange={e => setFormData({...formData, incomeBracket: e.target.value})}
                >
                  <option value="" className="bg-fs-dark">Income Bracket (Optional)</option>
                  <option value="Entry Level" className="bg-fs-dark">Entry Level</option>
                  <option value="Mid-Management" className="bg-fs-dark">Mid-Management</option>
                  <option value="Executive" className="bg-fs-dark">Executive</option>
                  <option value="Ultra-High" className="bg-fs-dark">Ultra-High Net Worth</option>
                </select>
              </div>

              <button 
                onClick={handleSubmit}
                className="w-full py-5 bg-fs-cyan text-slate-900 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-fs-cyan/20"
              >
                Submit Profile <Check className="w-5 h-5 border-2 border-slate-900 rounded-full p-0.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Corporate Share Popup */}
        <AnimatePresence>
          {showSharePopup && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-20 bg-fs-dark/95 flex items-center justify-center p-8 text-center"
            >
              <div className="max-w-xs">
                <div className="w-20 h-20 bg-fs-pink/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                  <Gift className="w-10 h-10 text-fs-pink" />
                </div>
                <h3 className="text-2xl font-black italic uppercase italic tracking-tighter mb-4 text-white">Bonus Goal!</h3>
                <p className="text-slate-400 mb-8 font-medium">Earn **1 EXTRA POINT** for telling us where you work and sharing Fitstreet with your HR team.</p>
                <div className="space-y-4">
                  <button 
                    onClick={handleShare}
                    className="w-full py-5 bg-fs-pink text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-fs-pink/30"
                  >
                    <Share2 className="w-5 h-5" /> Share with HR
                  </button>
                  <button 
                    onClick={() => { 
                      onClose(); 
                    }} 
                    className="w-full py-4 text-slate-500 font-bold uppercase transition-colors hover:text-white"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default EarnPointsModal;
