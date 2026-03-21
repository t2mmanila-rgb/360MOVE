import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, CheckCircle2, LayoutDashboard, Map as MapIcon, X, Calendar, MapPin, Info, ArrowRight, Zap } from 'lucide-react';
import { B2B_PASSPORT_BRANDS, MOCK_SCHEDULE } from '../data/activities';
import type { Activity, PassportBrand } from '../data/activities';
import { resolveDriveImageUrl, logRegistrationToSheet } from '../lib/google-sheets';
import MobileFooter from '../components/MobileFooter';
import { useNavigate } from 'react-router-dom';
import Scanner from '../components/Scanner';
import { cn } from '../lib/utils';

type ViewMode = 'dashboard' | 'passport';

const MyPass: React.FC = () => {
  const [userProfile, setUserProfile] = React.useState<any>(null);
  const [completedIds, setCompletedIds] = React.useState<string[]>([]);
  const [registeredActivityIds, setRegisteredActivityIds] = React.useState<string[]>([]);
  const [view, setView] = React.useState<ViewMode>('dashboard');
  const [activeZone, setActiveZone] = React.useState<string>('THE ARENA');
  const [selectedItem, setSelectedItem] = React.useState<Activity | PassportBrand | null>(null);
  const [showScanner, setShowScanner] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [successActivity, setSuccessActivity] = React.useState<Activity | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const savedProfile = localStorage.getItem('user_profile');
    const savedCompleted = localStorage.getItem('completed_ids');
    const savedRegistered = localStorage.getItem('registered_activity_ids');
    
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserProfile(profile);
    }
    if (savedCompleted) setCompletedIds(JSON.parse(savedCompleted));
    if (savedRegistered) setRegisteredActivityIds(JSON.parse(savedRegistered));
  }, []);

  const handleRegisterActivity = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (registeredActivityIds.includes(id)) return;
    
    const activity = MOCK_SCHEDULE.find(a => a.id === id);
    if (activity) {
      setSuccessActivity(activity);
      setShowSuccessModal(true);
      
      // Log to Google Sheet (Placeholder Script URL)
      logRegistrationToSheet('https://script.google.com/macros/s/AKfycbz_placeholder/exec', {
        userId: userProfile?.mobile || 'unknown',
        userName: userProfile?.name || 'Guest',
        activityId: activity.id,
        activityTitle: activity.title,
        type: 'activity',
        timestamp: new Date().toISOString()
      });
    }

    const newRegistered = [...registeredActivityIds, id];
    setRegisteredActivityIds(newRegistered);
    localStorage.setItem('registered_activity_ids', JSON.stringify(newRegistered));
  };

  const handleScanQR = (_brandId?: string) => {
    setShowScanner(true);
  };

  const handleScanSuccess = (_decodedTextValue: string) => {
    // In a real app, decodedTextValue would contain the brand ID or a secure token
    // For this simulation, we'll mark the first uncompleted brand as completed
    const brand = B2B_PASSPORT_BRANDS.find(b => !completedIds.includes(b.id));
    if (brand) {
      const newCompleted = [...completedIds, brand.id];
      setCompletedIds(newCompleted);
      localStorage.setItem('completed_ids', JSON.stringify(newCompleted));
      
      logRegistrationToSheet('https://script.google.com/macros/s/AKfycbz_placeholder/exec', {
        userId: userProfile?.mobile || 'unknown',
        userName: userProfile?.name || 'Guest',
        activityId: brand.id,
        activityTitle: brand.name,
        type: 'brand',
        timestamp: new Date().toISOString()
      });
      
      setShowScanner(false);
      setView('passport'); // Auto-return to passport challenge
      
      // Auto-open success state feedback
      alert(`SUCCESS! Scanned ${brand.name}. 10 Points Added to your Pass.`);
    }
  };

  const calculatePoints = () => {
    const passportPoints = completedIds.length * 10;
    const registrationPoints = registeredActivityIds.length * 5;
    return passportPoints + registrationPoints;
  };

  const displayName = userProfile?.name || "Member";
  const firstName = displayName ? displayName.split(' ')[0] : "Member";
  const userInitial = displayName ? displayName.charAt(0) : "M";
  const passId = userProfile?.passId || `360-FS26-${Math.floor(1000 + Math.random() * 9000)}`;

  const userInterests = userProfile?.categories || userProfile?.interests || [];

  const recommendedActivities = React.useMemo(() => {
    const all = [...MOCK_SCHEDULE];
    if (!userInterests.length) return all.slice(0, 3);
    return all.filter(act => 
      userInterests.some((interest: string) => 
        act.category?.toLowerCase().includes(interest.split(' ')[0].toLowerCase()) ||
        interest.toLowerCase().includes(act.category?.toLowerCase() || '')
      )
    ).slice(0, 3);
  }, [userInterests]);

  const zones = ['THE ARENA', 'PLAY', 'HEAL', 'EAT', 'GLOW'] as const;

  const DetailModal = () => (
    <AnimatePresence>
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 100 }}
            className="w-full max-w-lg bg-slate-800 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <div className="relative h-72">
               <img 
                 src={'logo' in selectedItem ? resolveDriveImageUrl(selectedItem.logo) : (selectedItem as Activity).image} 
                 className="w-full h-full object-cover" 
                 alt={'name' in selectedItem ? selectedItem.name : (selectedItem as Activity).title} 
               />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 left-6 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white z-10 hover:bg-black/70 transition-colors gap-2 text-xs font-bold"
              >
                <ArrowRight className="w-4 h-4 rotate-180" /> Go Back
              </button>
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white z-10 hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-fs-cyan/20 text-fs-cyan text-[10px] font-black uppercase tracking-widest leading-none">
                  {selectedItem.zone}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none">
                  {selectedItem.category}
                </span>
              </div>
              <h3 className="text-3xl font-black italic mb-6 tracking-tight uppercase leading-tight">
                {'name' in selectedItem ? selectedItem.name : (selectedItem as Activity).title}
              </h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                {selectedItem.description}
              </p>
              
              <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/5">
                <h3 className="text-fs-orange font-black text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4" /> Challenge Mechanics
                </h3>
                <p className="text-white text-sm font-medium leading-relaxed italic">
                  {selectedItem.mechanics}
                </p>
              </div>

              {'logo' in selectedItem ? (
                <button 
                  onClick={() => {
                    handleScanQR(selectedItem.id);
                    setSelectedItem(null);
                  }}
                  className="w-full py-5 bg-fs-orange text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-fs-orange/20 active:scale-95 transition-all"
                >
                  <QrCode className="w-5 h-5" /> Scan Booth QR
                </button>
              ) : (
                <button 
                  onClick={(e) => {
                    handleRegisterActivity(selectedItem.id, e);
                    setSelectedItem(null);
                  }}
                  disabled={registeredActivityIds.includes(selectedItem.id)}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg transition-all ${
                    registeredActivityIds.includes(selectedItem.id)
                      ? 'bg-slate-700 text-slate-500 cursor-default'
                      : 'bg-fs-cyan text-slate-900 shadow-fs-cyan/20 active:scale-95'
                  }`}
                >
                  {registeredActivityIds.includes(selectedItem.id) ? (
                    <><CheckCircle2 className="w-5 h-5" /> Already Registered</>
                  ) : (
                    'Register to Activate'
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-fs-cyan/30 pb-32 relative">
      {/* QR Scanner Modal */}
      {showScanner && (
        <Scanner 
          onScanSuccess={handleScanSuccess} 
          onClose={() => setShowScanner(false)} 
        />
      )}

      {/* Mobile Header */}
      <section className="pt-28 px-6 pb-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter uppercase italic">
                Hala, {firstName}!
              </h1>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mt-1">ID: {passId}</p>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fs-cyan to-brand-purple p-[1px] shadow-lg shadow-fs-cyan/20">
            <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center font-black text-white text-xl uppercase italic">
              {userInitial}
            </div>
          </div>
        </div>

        {/* Navigation Switcher */}
        <div className="flex bg-white/5 p-1.5 rounded-[2rem] border border-white/10 backdrop-blur-md">
          <button 
            onClick={() => setView('dashboard')}
            className={`flex-1 py-4 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${view === 'dashboard' ? 'bg-fs-cyan text-slate-900 shadow-lg shadow-fs-cyan/10' : 'text-slate-500 hover:text-white'}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </button>
          <button 
            onClick={() => setView('passport')}
            className={`flex-1 py-4 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${view === 'passport' ? 'bg-fs-orange text-white shadow-lg shadow-fs-orange/10' : 'text-slate-500 hover:text-white'}`}
          >
            <MapIcon className="w-4 h-4" /> Passport
          </button>
        </div>
      </section>

      {view === 'dashboard' ? (
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="px-6"
        >
          {/* Points Overview */}
          <div className="bg-white/5 rounded-[3rem] p-8 border border-white/10 mb-12 relative overflow-hidden group hover:border-fs-cyan/30 transition-colors">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Zap className="w-32 h-32 text-fs-cyan" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-fs-cyan mb-3 block">Total Accumulated Points</span>
            <div className="text-7xl font-black italic mb-8 tracking-tighter">{calculatePoints()}</div>
            <div className="flex gap-3">
              <button 
                onClick={() => setView('passport')}
                className="flex-1 bg-fs-orange hover:bg-fs-orange/90 transition-all py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 text-white shadow-lg shadow-fs-orange/20"
              >
                Go to Passport <MapIcon className="w-4 h-4" />
              </button>
              <button 
                onClick={() => navigate('/events/fitstreet-2026/schedule')}
                className="flex-1 bg-white text-slate-900 hover:bg-fs-cyan transition-all py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
              >
                Full Schedule <Calendar className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Suggested Activities */}
          <div className="mb-12">
            <h2 className="text-3xl font-black italic mb-8 uppercase tracking-tighter text-fs-cyan ml-2">Suggested for You.</h2>
            <div className="space-y-6">
              {recommendedActivities.map((act) => (
                <div 
                  key={act.id} 
                  className="bg-white/5 border border-white/10 rounded-[3rem] p-8 flex flex-col gap-8 hover:bg-white/10 transition-all group relative overflow-hidden"
                >
                  <div className="flex items-start gap-8">
                    <div className="w-24 h-24 rounded-3xl overflow-hidden shrink-0 shadow-2xl">
                      <img src={act.image} className="w-full h-full object-cover" alt={act.title} />
                    </div>
                    <div className="flex-grow pt-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-black text-fs-orange uppercase tracking-widest px-3 py-1.5 bg-fs-orange/10 rounded-full border border-fs-orange/10">{act.zone}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{act.category}</span>
                      </div>
                      <h4 className="font-black italic text-2xl leading-tight mb-3 tracking-tight">{act.title}</h4>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> {act.location}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => handleRegisterActivity(act.id, e)}
                    disabled={registeredActivityIds.includes(act.id)}
                    className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[12px] transition-all flex items-center justify-center gap-3 border-2 ${
                      registeredActivityIds.includes(act.id) 
                        ? 'bg-slate-800/50 border-slate-700 text-slate-500' 
                        : 'bg-fs-cyan border-fs-cyan text-slate-900 shadow-2xl shadow-fs-cyan/30 active:scale-95 hover:bg-white hover:border-white'
                    }`}
                  >
                    {registeredActivityIds.includes(act.id) ? (
                      <><CheckCircle2 className="w-5 h-5" /> Active in Passport</>
                    ) : (
                      <><Zap className="w-5 h-5" /> Activate Your Challenge</>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      ) : (
        <motion.section 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="px-6"
        >
          {/* Zone Filter Buttons */}
          <div className="flex gap-2 mb-12 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2 no-scrollbar">
            {zones.map(zone => (
              <button
                key={zone}
                onClick={() => setActiveZone(zone)}
                className={cn(
                  "px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap shrink-0 border-2",
                  activeZone === zone 
                    ? "bg-fs-orange border-fs-orange text-white shadow-xl shadow-fs-orange/20" 
                    : "bg-white/5 border-white/5 text-slate-500 hover:text-white hover:border-white/20"
                )}
              >
                {zone}
              </button>
            ))}
          </div>

           {/* Zone-based Passport Challenge */}
           <div className="space-y-16 mt-4">
             {zones.filter(z => z === activeZone).map(zone => (
               <div key={zone} className="relative">
                 <div className="flex items-center gap-4 mb-10">
                   <h3 className="text-4xl font-black italic uppercase tracking-tighter text-white whitespace-nowrap">
                     {zone} <span className="text-slate-700 ml-1">Zone.</span>
                   </h3>
                   <div className="h-0.5 bg-white/5 flex-grow rounded-full" />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   {/* Brands in this Zone - Active by Default */}
                   {B2B_PASSPORT_BRANDS.filter(b => b.zone === zone).map(brand => (
                     <motion.div 
                       key={brand.id}
                       whileTap={{ scale: 0.95 }}
                       onClick={() => setSelectedItem(brand)}
                       className={`relative aspect-square rounded-[3rem] border transition-all duration-500 overflow-hidden flex flex-col items-center justify-center p-6 cursor-pointer ${
                         completedIds.includes(brand.id) 
                           ? 'bg-white/10 border-fs-cyan/50 shadow-[0_0_40px_rgba(45,212,191,0.15)]' 
                           : 'bg-white/5 border-white/5 hover:border-slate-500 group'
                       }`}
                     >
                        <div className="absolute top-5 right-5 transition-transform duration-500 group-hover:scale-110">
                          {completedIds.includes(brand.id) ? (
                            <div className="text-fs-cyan drop-shadow-[0_0_8px_rgba(45,212,191,0.6)]">
                              <CheckCircle2 className="w-8 h-8" />
                            </div>
                          ) : (
                            <div className="p-2 rounded-full bg-slate-900/50 backdrop-blur-md">
                              <ArrowRight className="w-4 h-4 text-slate-600" />
                            </div>
                          )}
                        </div>
                        <img 
                          src={resolveDriveImageUrl(brand.logo)} 
                          className={`w-20 h-20 object-contain mb-4 transition-all duration-700 ${completedIds.includes(brand.id) ? 'grayscale-0 opacity-100' : 'grayscale opacity-30 group-hover:opacity-60'}`} 
                          alt={brand.name} 
                        />
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] text-center ${completedIds.includes(brand.id) ? 'text-white' : 'text-slate-600'}`}>{brand.name}</span>
                        <div className="absolute bottom-6 flex items-center gap-1.5 text-[8px] font-black uppercase text-slate-500 tracking-widest opacity-40">
                          <MapPin className="w-3 h-3" /> {brand.booth}
                        </div>
                     </motion.div>
                   ))}

                   {/* Activity Item (Inactive/Active) */}
                    {MOCK_SCHEDULE.filter(act => act.zone === zone).map(activity => (
                      <div 
                        key={activity.id} 
                        onClick={() => setSelectedItem(activity)}
                        className="relative aspect-square rounded-[3rem] overflow-hidden group border-2 border-white/5 hover:border-slate-500 transition-all shadow-2xl cursor-pointer"
                      >
                        <img 
                          src={activity.image} 
                          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 pointer-events-none ${
                            registeredActivityIds.includes(activity.id) ? 'grayscale-0 scale-105' : 'grayscale'
                          }`} 
                          alt={activity.title}
                        />
                        <div className={`absolute inset-0 transition-opacity duration-500 ${
                          registeredActivityIds.includes(activity.id) ? 'bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100' : 'bg-black/60 opacity-100'
                        }`} />
                        
                        <div className="absolute inset-0 p-8 flex flex-col justify-end items-center text-center gap-6">
                          <h4 className="text-xl font-black uppercase italic leading-tight tracking-tighter text-white drop-shadow-lg">
                            {activity.title}
                          </h4>
                          
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleRegisterActivity(activity.id, e); }}
                            disabled={registeredActivityIds.includes(activity.id)}
                            className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all backdrop-blur-md shadow-2xl ${
                              registeredActivityIds.includes(activity.id)
                                ? 'bg-fs-cyan/20 border border-fs-cyan/30 text-fs-cyan flex items-center justify-center gap-2'
                                : 'bg-white text-slate-900 border-2 border-white hover:bg-fs-cyan hover:border-fs-cyan active:scale-95'
                            }`}
                          >
                            {registeredActivityIds.includes(activity.id) ? (
                              <><CheckCircle2 className="w-5 h-5" /> ACTIVE</>
                            ) : (
                              'ACTIVATE'
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                 </div>
               </div>
             ))}
           </div>
        </motion.section>
      )}

      {/* Detail Sliding Modal */}
      <DetailModal />

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && successActivity && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-2xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm bg-slate-800 border-2 border-fs-cyan/30 rounded-[3rem] p-10 text-center shadow-2xl relative"
            >
              <div className="w-24 h-24 bg-fs-cyan/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                <CheckCircle2 className="w-12 h-12 text-fs-cyan" />
              </div>
              <h3 className="text-3xl font-black italic uppercase italic tracking-tighter mb-4">You're In!</h3>
              <p className="text-slate-400 text-sm mb-8 font-medium">
                You've successfully registered for <span className="text-white font-bold">{successActivity.title}</span>.
              </p>
              
              <div className="bg-white/5 rounded-3xl p-6 mb-8 border border-white/5 space-y-4">
                <div className="flex items-center gap-3 text-left">
                  <Calendar className="w-5 h-5 text-fs-orange" />
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Date & Time</p>
                    <p className="text-xs font-bold text-white">{successActivity.time || '10:00 AM'} | May 09, 2026</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <MapPin className="w-5 h-5 text-fs-orange" />
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Area / Location</p>
                    <p className="text-xs font-bold text-white uppercase">{successActivity.location}</p>
                  </div>
                </div>
              </div>

              <div className="bg-fs-orange/10 border border-fs-orange/20 rounded-2xl p-4 mb-8">
                <p className="text-[11px] font-bold text-fs-orange uppercase tracking-wider leading-relaxed italic">
                  IMPORTANT: You must sign-in at the registration area on location to earn your points!
                </p>
              </div>

              <button 
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-5 bg-fs-cyan text-slate-900 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-fs-cyan/20 active:scale-95 transition-all"
              >
                Got It!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <MobileFooter />
    </div>
  );
};

export default MyPass;
