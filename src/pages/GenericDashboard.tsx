import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Zap, Star, X, MapPin, Clock, ArrowRight, CheckCircle2, Globe } from 'lucide-react';
import { type Activity } from '../data/activities';
import { useActivity } from '../lib/useActivity';
import EarnPointsModal from '../components/EarnPointsModal';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

const GenericDashboard: React.FC = () => {
  const [genericUser, setGenericUser] = useState<any>(null);
  const [registeredPrograms, setRegisteredPrograms] = useState<string[]>([]);
  const [showEarnPointsModal, setShowEarnPointsModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Activity | null>(null);
  const { programs: B2CConfig } = useActivity();
  const navigate = useNavigate();

  useEffect(() => {
    const savedGeneric = localStorage.getItem('generic_user_profile');
    if (savedGeneric) {
      setGenericUser(JSON.parse(savedGeneric));
    } else {
      // If not logged in, redirect to register
      navigate('/register');
      return;
    }

    const savedRegistered = localStorage.getItem('registered_generic_activities');
    if (savedRegistered) {
      setRegisteredPrograms(JSON.parse(savedRegistered));
    }

    const fetchLatestProfile = async () => {
      const saved = localStorage.getItem('generic_user_profile');
      if (!saved) return;
      try {
        const parsed = JSON.parse(saved);
        if (parsed.email) {
          const { getProfile, migrateLocalData } = await import('../lib/supabase');
          const latest = await getProfile(parsed.email);
          if (latest) {
            const merged = { ...parsed, ...latest };
            setGenericUser(merged);
            localStorage.setItem('generic_user_profile', JSON.stringify(merged));
          }
          // Ensure any local-only data is migrated to Supabase (e.g. if sync failed previously)
          await migrateLocalData();
        }
      } catch (err) {
        console.warn('Silent sync from Supabase failed:', err);
      }
    };
    fetchLatestProfile();
  }, [navigate]);

  const handleRegisterProgram = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (registeredPrograms.includes(id)) return;
    
    const newRegistered = [...registeredPrograms, id];
    setRegisteredPrograms(newRegistered);
    localStorage.setItem('registered_generic_activities', JSON.stringify(newRegistered));

    // Sync to Supabase
    if (genericUser?.email) {
      try {
        const { syncUserActivity } = await import('../lib/supabase');
        // Find points from programs config
        const activity = B2CConfig.find(p => p.id === id || p.title === id);
        await syncUserActivity(genericUser.email, id, activity?.points || 10);
      } catch (err) {
        console.warn('Supabase registration sync failed:', err);
      }
    }
  };

  const handleUnregisterProgram = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newRegistered = registeredPrograms.filter(progId => progId !== id);
    setRegisteredPrograms(newRegistered);
    localStorage.setItem('registered_generic_activities', JSON.stringify(newRegistered));

    // Sync to Supabase
    if (genericUser?.email) {
      try {
        const { deleteUserActivity } = await import('../lib/supabase');
        await deleteUserActivity(genericUser.email, id);
      } catch (err) {
        console.warn('Supabase cancellation sync failed:', err);
      }
    }
  };

  const calculatePoints = () => {
    // 1. Initial starter point (1)
    const starterPoints = 1;
    
    // 2. Extra points from profile completion (10)
    const profilePoints = genericUser?.profileCompleted ? 10 : 0;
    
    // 3. Points from HR Share (10)
    const sharePoints = genericUser?.pointsHRShare || 0;

    // 4. Note: activity points are only added via completedIds (scans) in MyPass
    // GenericDashboard doesn't have scans yet, so we just return the bonuses
    return starterPoints + profilePoints + sharePoints;
  };

  const handlePointsEarned = async (updatedProfile: any) => {
    setGenericUser(updatedProfile);
    
    // Sync to Supabase
    try {
      const { syncProfile } = await import('../lib/supabase');
      await syncProfile(updatedProfile, 'generic');
    } catch (err) {
      console.warn('Supabase generic points sync failed:', err);
    }

    localStorage.setItem('generic_user_profile', JSON.stringify(updatedProfile));
  };

  const handleShareFitstreet = async () => {
    const shareData = {
      title: 'Join me at Fitstreet 2026!',
      text: 'I just got my Fitstreet Fast-Pass! Join the movement and earn rewards. Visit:',
      url: 'https://360move.vercel.app/events/fitstreet-2026'
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`, '_blank');
      }

      // Award 10 points if not already shared
      if (!genericUser?.pointsShared) {
        const updatedProfile = {
          ...genericUser,
          pointsShared: true
        };
        handlePointsEarned(updatedProfile);
        alert('🎉 10 Bonus Points awarded for sharing!');
      } else {
        alert('You already earned points for sharing, but thanks for spreading the word!');
      }
    } catch (err) {
      console.warn('Share failed:', err);
    }
  };

  const recommendedPrograms = React.useMemo(() => {
    const all = [...B2CConfig];
    const goal = genericUser?.training_goal?.toLowerCase() || '';
    const interests = (genericUser?.interests || []).map((i: string) => i.toLowerCase());

    // Map common goals to tags
    const targetTags: string[] = [...interests];
    if (goal.includes('high-octane')) targetTags.push('cardio', 'high intensity', 'physical');
    if (goal.includes('mind-body')) targetTags.push('mindfulness', 'wellness', 'recovery', 'heal');
    if (goal.includes('functional')) targetTags.push('movement', 'physical');
    if (goal.includes('body composition')) targetTags.push('physical', 'nutrition');
    if (goal.includes('longevity')) targetTags.push('wellness', 'heal', 'recovery');

    if (targetTags.length === 0) return all.slice(0, 3);
    
    return all.sort((a, b) => {
      const aMatch = targetTags.some(tag => 
        a.category?.toLowerCase().includes(tag) || tag.includes(a.category?.toLowerCase() || '')
      );
      const bMatch = targetTags.some(tag => 
        b.category?.toLowerCase().includes(tag) || tag.includes(b.category?.toLowerCase() || '')
      );
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    }).slice(0, 3);
  }, [genericUser, B2CConfig]);

  const firstName = (genericUser?.name?.split(' ')[0] || "Member").toUpperCase();
  const totalPoints = calculatePoints();

  const DetailModal = () => (
    <AnimatePresence>
      {selectedProgram && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="w-full max-w-lg bg-white rounded-[2rem] overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col"
          >
            <button
              onClick={() => setSelectedProgram(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="h-48 relative shrink-0">
              <img src={selectedProgram.image} alt={selectedProgram.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6">
                <div className="text-[10px] font-black uppercase tracking-widest text-brand-turquoise mb-1 flex items-center gap-2">
                  <Star className="w-3 h-3 fill-brand-turquoise text-brand-turquoise" />
                  {selectedProgram.category} 
                </div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">
                  {selectedProgram.title}
                </h3>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Universal Date/Time Block */}
              <div className="flex flex-wrap gap-4 text-xs font-black uppercase tracking-widest text-slate-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-purple" />
                    <span>Every Weekend</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-fs-pink" />
                    <span>{selectedProgram.duration || '60 mins'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-turquoise" />
                    <span>{selectedProgram.pax ? `Max ${selectedProgram.pax} pax` : 'BGC Studio'}</span>
                  </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">About Program</h4>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    {selectedProgram.description || 'A premium movement experience curated by 360MOVE.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 shrink-0 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Status</span>
                <span className={cn(
                  "text-sm font-black italic uppercase",
                  registeredPrograms.includes(selectedProgram.id || selectedProgram.title) ? "text-green-500" : "text-brand-purple"
                )}>
                  {registeredPrograms.includes(selectedProgram.id || selectedProgram.title) ? "Registered" : "Available"}
                </span>
              </div>
              
              {registeredPrograms.includes(selectedProgram.id || selectedProgram.title) ? (
                <button 
                  onClick={(e) => {
                    handleUnregisterProgram(selectedProgram.id || selectedProgram.title, e);
                    setSelectedProgram(null);
                  }}
                  className="pill-button bg-red-500 hover:bg-red-600 text-white shadow-xl shadow-red-500/20"
                >
                  Cancel Registration
                </button>
              ) : (
                <button 
                  onClick={(e) => {
                    handleRegisterProgram(selectedProgram.id || selectedProgram.title, e);
                    setSelectedProgram(null);
                  }}
                  className="pill-button bg-brand-purple hover:bg-brand-royalblue text-white shadow-xl shadow-brand-purple/20"
                >
                  Confirm Registration
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Points */}
        <header className="mb-12">
          <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-turquoise/20 rounded-full blur-[100px]" />
            
            <div className="relative z-10 flex items-center gap-6 w-full md:w-auto">
              <div className="w-20 h-20 bg-brand-purple rounded-full flex items-center justify-center text-3xl font-black shadow-lg shadow-brand-purple/50 border-4 border-white/10 shrink-0">
                {firstName.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-none mb-2">
                  Welcome, {firstName}!
                </h1>
                <p className="text-slate-400 font-medium tracking-wide">
                  Welcome to your 360MOVE Dashboard.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 w-full md:w-auto">
              <div className="relative z-10 flex border border-white/10 bg-white/5 rounded-[2rem] p-6 backdrop-blur-md w-full divide-x divide-white/10">
                <div className="px-6 flex flex-col items-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-turquoise mb-1">Total Points</span>
                  <span className="text-4xl font-black italic">{totalPoints}</span>
                </div>
                <div className="px-6 flex flex-col items-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-purple mb-1">Programs</span>
                  <span className="text-4xl font-black italic">{registeredPrograms.length}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Profile Completion CTA */}
        {!genericUser?.profileCompleted && (
          <div className="mb-12 bg-white rounded-[2rem] p-8 glass flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-brand-turquoise/30 transition-all cursor-pointer" onClick={() => setShowEarnPointsModal(true)}>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-brand-turquoise/10 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-brand-turquoise" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Level Up Your Profile</h3>
                <p className="text-slate-500 font-medium">Earn +50 points instantly by customizing your 360MOVE preferences.</p>
              </div>
            </div>
            <button className="pill-button bg-slate-900 text-white whitespace-nowrap hidden sm:flex items-center gap-2">
              Complete Profile <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <button 
          onClick={handleShareFitstreet}
          className="w-full bg-brand-purple/5 border border-brand-purple/10 rounded-[2rem] p-6 mb-12 flex items-center justify-between group hover:bg-brand-purple/10 transition-all text-slate-900"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 bg-brand-purple rounded-2xl flex items-center justify-center shadow-lg shadow-brand-purple/20 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-brand-purple mb-1">Spread the Word</div>
              <div className="text-sm font-bold">Share FITSTREET and earn 10 extra points!</div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-brand-purple group-hover:translate-x-2 transition-transform" />
        </button>

        {/* B2C Programs Sections */}

        {/* Available Programs */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Your Catalog</h2>
            <span className="text-[10px] uppercase font-black tracking-widest text-brand-purple px-4 py-1.5 bg-brand-purple/10 rounded-full">
              Recommended
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recommendedPrograms.map((program) => {
              const progId = program.id || program.title;
              const isRegistered = registeredPrograms.includes(progId);
              return (
                <div 
                  key={progId}
                  onClick={() => setSelectedProgram(program)}
                  className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:border-brand-purple/30 hover:shadow-2xl hover:shadow-brand-purple/10 transition-all cursor-pointer group"
                >
                  <div className="h-40 overflow-hidden relative">
                    <img 
                      src={program.image} 
                      alt={program.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                    {isRegistered && (
                      <div className="absolute top-4 right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <h3 className="absolute bottom-4 left-4 right-4 font-black text-white italic uppercase tracking-tight text-lg leading-tight">
                      {program.title}
                    </h3>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                      <span>{program.category}</span>
                      <span className="text-brand-purple">+{program.points || 10} PTS</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      <EarnPointsModal 
        isOpen={showEarnPointsModal} 
        onClose={() => setShowEarnPointsModal(false)}
        onComplete={handlePointsEarned}
        storageKey="generic_user_profile"
      />
      <DetailModal />
    </div>
  );
};

export default GenericDashboard;
