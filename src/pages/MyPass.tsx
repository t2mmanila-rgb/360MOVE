import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCode, Star, MapPin, Zap, LayoutDashboard, Map as MapIcon, 
  User, Calendar, CheckCircle2, Globe, ArrowRight, X, Clock
} from 'lucide-react';
import { B2B_PASSPORT_BRANDS, type Activity, type PassportBrand } from '../data/activities';
import { useActivity } from '../lib/useActivity';
import { resolveDriveImageUrl, logRegistrationToSheet, syncUserProfileToSheet, fetchGoogleSheetData, PASSPORT_CHALLENGE_SHEET_ID } from '../lib/google-sheets';
import MobileFooter from '../components/MobileFooter';
import { useNavigate, useLocation } from 'react-router-dom';
import EarnPointsModal from '../components/EarnPointsModal';
import { cn } from '../lib/utils';

type ViewMode = 'dashboard' | 'passport';

const MyPass: React.FC = () => {
  const { schedule, programs } = useActivity();
  const allActivities = React.useMemo(() => [...schedule, ...programs], [schedule, programs]);
  
  const [userProfile, setUserProfile] = React.useState<any>(null);
  const [completedIds, setCompletedIds] = React.useState<string[]>([]);
  const [registeredActivityIds, setRegisteredActivityIds] = React.useState<string[]>([]);
  const [view, setView] = React.useState<ViewMode>('dashboard');
  const [activeZone, setActiveZone] = React.useState<string>('THE ARENA');
  const [selectedItem, setSelectedItem] = React.useState<Activity | PassportBrand | null>(null);
  const [showEarnPointsModal, setShowEarnPointsModal] = React.useState(false);
  const [showProfileModal, setShowProfileModal] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [successActivity, setSuccessActivity] = React.useState<Activity | null>(null);
  const [brands, setBrands] = React.useState<PassportBrand[]>([]);
  const [scannedActivityIds, setScannedActivityIds] = React.useState<string[]>(JSON.parse(localStorage.getItem('scanned_activity_ids') || '[]'));
  const [gLeagueRegistered, setGLeagueRegistered] = React.useState(localStorage.getItem('gleague_registered') === 'true');
  const [isExpanded, setIsExpanded] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const savedProfile = localStorage.getItem('user_profile');
    const savedCompleted = localStorage.getItem('completed_ids');
    const savedRegistered = localStorage.getItem('registered_activity_ids');
    const savedScanned = localStorage.getItem('scanned_activity_ids');
    
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserProfile(profile);
    }
    if (savedCompleted) setCompletedIds(JSON.parse(savedCompleted));
    if (savedRegistered) setRegisteredActivityIds(JSON.parse(savedRegistered));
    if (savedScanned) setScannedActivityIds(JSON.parse(savedScanned));
  }, []);

  const location = useLocation();

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('profile') === 'true') {
      setShowProfileModal(true);
      navigate('/my-pass', { replace: true });
    }
  }, [location.search, navigate]);

  // Handle external scan redirect
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scanId = params.get('scan');
    if (scanId && userProfile) {
      handleScanSuccess(scanId);
      navigate('/my-pass', { replace: true });
    }
  }, [location.search, userProfile, navigate, brands]); // Add brands to deps just in case handleScanSuccess uses them

  // Sync profile from Supabase
  React.useEffect(() => {
    const fetchLatestProfile = async () => {
      if (!userProfile?.email) return;
      try {
        const { getProfile, migrateLocalData } = await import('../lib/supabase');
        const latest = await getProfile(userProfile?.email);
        if (latest) {
          const merged = { ...userProfile, ...latest };
          setUserProfile(merged);
          localStorage.setItem('user_profile', JSON.stringify(merged));
        }
        await migrateLocalData();
      } catch (err) {
        console.warn('Silent sync from Supabase failed:', err);
      }
    };
    fetchLatestProfile();
  }, [userProfile?.email, navigate]);

  // Sync with Spreadsheet for Passport Challenge Details
  React.useEffect(() => {
    const syncBrands = async () => {
      if (!PASSPORT_CHALLENGE_SHEET_ID || PASSPORT_CHALLENGE_SHEET_ID.includes('PLACEHOLDER')) return;
      
      const remoteData = await fetchGoogleSheetData(PASSPORT_CHALLENGE_SHEET_ID);
      if (remoteData && remoteData.length > 0) {
        const updatedBrands = B2B_PASSPORT_BRANDS.map(localBrand => {
          const remoteBrand = remoteData.find((r: any) => {
            const rName = r['Brand Name'] || r.name || r.Brand || '';
            const normalizedRName = rName.toLowerCase();
            const normalizedLocalName = localBrand.name.toLowerCase();
            return r.id === localBrand.id || 
                   (rName && (normalizedRName.includes(normalizedLocalName) || normalizedLocalName.includes(normalizedRName))) ||
                   (rName.includes("G'League") && localBrand.id === 'pb-gballers') ||
                   (rName.includes("Viking Games") && localBrand.id === 'pb-viking');
          });
          
          if (remoteBrand) {
            return {
              ...localBrand,
              description: remoteBrand['Description'] || remoteBrand.description || localBrand.description,
              mechanics: remoteBrand['Mechanics'] || remoteBrand.mechanics || localBrand.mechanics,
              booth: remoteBrand['Booth'] || remoteBrand.booth || localBrand.booth,
              category: remoteBrand['Category'] || remoteBrand.category || localBrand.category
            };
          }
          return localBrand;
        });
        setBrands(updatedBrands);
      }
    };
    syncBrands();
  }, [schedule, PASSPORT_CHALLENGE_SHEET_ID]);

  // Sync with spreadsheet removed or handled via useActivity if needed

  const handleRegisterActivity = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (registeredActivityIds.includes(id)) return;
    
    if (id === 'gballers-free') {
      window.open('https://docs.google.com/forms/d/e/1FAIpQLScWdRby7ihZAorlCC-4Tb0TjNcuV6woib15u47EeMTedC27Yg/viewform', '_blank');
      setGLeagueRegistered(true);
      localStorage.setItem('gleague_registered', 'true');
    }
    const activity = schedule.find(a => a.id === id);
    if (activity) {
      setSuccessActivity(activity);
      setShowSuccessModal(true);
      
      // Sync to Supabase
      if (userProfile?.email) {
        try {
          const { syncUserActivity } = await import('../lib/supabase');
          await syncUserActivity(userProfile?.email, id, activity.points, userProfile);
        } catch (err) {
          console.warn('Supabase registration sync failed:', err);
        }
      }

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

  const handleUnregisterActivity = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newRegistered = registeredActivityIds.filter(actId => actId !== id);
    setRegisteredActivityIds(newRegistered);
    localStorage.setItem('registered_activity_ids', JSON.stringify(newRegistered));
    
    // Sync to Supabase
    if (userProfile?.email) {
      try {
        const { deleteUserActivity } = await import('../lib/supabase');
        await deleteUserActivity(userProfile?.email, id);
      } catch (err) {
        console.warn('Supabase cancellation sync failed:', err);
      }
    }

    if (selectedItem) {
      logRegistrationToSheet('https://script.google.com/macros/s/AKfycby7--LX2UwK649yFZW8rvjnpxnuIoBp_3fN3_nblt03Tm4JWUndvvgb4wZJPnQ38w/exec', {
        userId: userProfile?.mobile || 'unknown',
        userName: userProfile?.name || 'Guest',
        activityId: selectedItem.id,
        activityTitle: 'name' in selectedItem ? selectedItem.name : selectedItem.title,
        type: 'cancel_activity',
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleScanSuccess = async (decodedTextValue: string) => {
    if (!userProfile?.email) {
      alert("Please log in to scan and earn points.");
      return;
    }

    let rawQuery = decodedTextValue.trim();
    
    // Extract ID from URL if necessary (e.g., https://.../activity/fs-morning-run)
    if (rawQuery.startsWith('http')) {
      try {
        const url = new URL(rawQuery);
        // Special case: check if it's a deep link with ?scan=true
        const scanId = url.searchParams.get('scanId') || url.searchParams.get('id');
        if (scanId) {
          rawQuery = scanId;
        } else {
          const pathParts = url.pathname.split('/').filter(p => p !== '');
          rawQuery = pathParts[pathParts.length - 1] || rawQuery;
        }
      } catch (e) {
        console.warn('Failed to parse scanned URL:', rawQuery);
      }
    }

    const query = rawQuery.toLowerCase().trim();
    const slugQuery = query.replace(/\s+/g, '-');

    // 1. Check if it's a Brand/Booth
    const brand = [...brands, ...B2B_PASSPORT_BRANDS].find(b => 
      b.id.toLowerCase() === query ||
      b.id.toLowerCase() === `pb-${query}` ||
      b.id.toLowerCase() === `pb-${slugQuery}` ||
      b.name.toLowerCase().includes(query) ||
      query.includes(b.name.toLowerCase())
    );
    
    // 2. Check if it's an Activity
    const activity = allActivities.find(a => 
      a.id.toLowerCase() === query ||
      a.id.toLowerCase() === `fs-${slugQuery}` ||
      a.id.toLowerCase().replace(/\s+/g, '-') === slugQuery ||
      a.title?.toLowerCase().replace(/\s+/g, '-') === slugQuery ||
      a.title?.toLowerCase().includes(query)
    );

    if (brand) {
      if (completedIds.includes(brand.id)) {
        alert(`You have already accomplished the ${brand.name} passport challenge`);
        return;
      }
      
      const newCompleted = [...completedIds, brand.id];
        setCompletedIds(newCompleted);
        localStorage.setItem('completed_ids', JSON.stringify(newCompleted));
        
        const isPaid = brand.id === 'pb-viking';
        const pointsAdded = isPaid && (userProfile?.paidActivities?.includes(brand.id)) ? 10 : 1;

        const updated = {
          ...userProfile,
          points: (userProfile?.points || 0) + pointsAdded
        };
        setUserProfile(updated);
        localStorage.setItem('user_profile', JSON.stringify(updated));
        
        // Sync to Supabase
        try {
          const { syncUserActivity } = await import('../lib/supabase');
          await syncUserActivity(updated.email, brand.id, pointsAdded, updated, 'completed', true);
        } catch (err) {
          console.warn('Supabase scan sync failed:', err);
        }

        setSuccessActivity({
          id: brand.id,
          title: brand.name,
          points: pointsAdded,
          category: brand.category,
          image: brand.logo,
          duration: 'Booth Visit',
          location: brand.booth,
          description: brand.description
        } as any);
        setShowSuccessModal(true);
        setView('passport');
      } else if (activity) {
      // Activity Scan logic - Mark as both Registered and Participated (Checked-in)
      if (!registeredActivityIds.includes(activity.id)) {
        const newRegistered = [...registeredActivityIds, activity.id];
        setRegisteredActivityIds(newRegistered);
        localStorage.setItem('registered_activity_ids', JSON.stringify(newRegistered));
      }

      // Track as COMPLETED for UI
      if (!scannedActivityIds.includes(activity.id)) {
        const newScanned = [...scannedActivityIds, activity.id];
        setScannedActivityIds(newScanned);
        localStorage.setItem('scanned_activity_ids', JSON.stringify(newScanned));
      }

      setSuccessActivity(activity);
      setShowSuccessModal(true);
      
      // Sync to Supabase (Record as Check-in/Participated)
      try {
        const { syncUserActivity } = await import('../lib/supabase');
        await syncUserActivity(userProfile.email!, activity.id, activity.points, userProfile, 'checked-in', true);
      } catch (err) {
        console.warn('Supabase activity scan sync failed:', err);
      }
    } else {
      console.warn('Scanned ID not recognized:', query);
      alert("QR code recognized but not linked to any valid activity or booth.");
    }
  };

  const calculatePoints = () => {
    // Standard brand scan is now 1 point. G'Ballers and Viking are 10 points ONLY if paid.
    // The "paidActivities" array should be populated by syncing with the payment sheet.
    const passportPoints = completedIds.reduce((total, id) => {
      const isPaidContent = id === 'pb-viking';
      const hasPaid = userProfile?.paidActivities?.includes(id) || false;
      return total + (isPaidContent ? (hasPaid ? 10 : 0) : 1);
    }, 0);

    const registrationPoints = registeredActivityIds.reduce((total, _id) => {
      // Points should only be given once the user registers physically on site (QR scan)
      return total + 0;
    }, 0);

    const profilePoints = (userProfile?.profileCompleted ? 10 : 0);
    const sharePoints = userProfile?.pointsHRShare || 0;
    const starterPoints = userProfile?.points ?? 1;
    
    return starterPoints + passportPoints + registrationPoints + profilePoints + sharePoints;
  };

  const handlePointsEarned = async (updatedProfile: any) => {
    setUserProfile(updatedProfile);
    
    // Sync to Supabase
    try {
      const { syncProfile } = await import('../lib/supabase');
      await syncProfile(updatedProfile, 'fitstreet');
    } catch (err) {
      console.warn('Supabase points earned sync failed:', err);
    }

    syncUserProfileToSheet(updatedProfile);
  };

  const displayName = userProfile?.name || "Member";
  const firstName = displayName ? displayName.split(' ')[0] : "Member";
  const userInitial = userProfile?.name?.charAt(0) || "?";
  const passId = userProfile?.passId || `360-FS26-${Math.floor(1000 + Math.random() * 9000)}`;

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
      if (!userProfile?.pointsShared) {
        const updatedProfile = {
          ...userProfile,
          pointsHRShare: 10,
          pointsShared: true
        };
        setUserProfile(updatedProfile);
        localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
        
        const { syncProfile } = await import('../lib/supabase');
        await syncProfile(updatedProfile, 'fitstreet');
        alert('🎉 10 Bonus Points awarded for sharing!');
      } else {
        alert('You already earned points for sharing, but thanks for spreading the word!');
      }
    } catch (err) {
      console.warn('Share failed:', err);
    }
  };

  const recommendedActivities = React.useMemo(() => {
    const all = [...allActivities];
    const goal = userProfile?.training_goal?.toLowerCase() || '';
    const interests = (userProfile?.interests || []).map((i: string) => i.toLowerCase());

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
  }, [userProfile, allActivities]);

  const zones = ['THE ARENA', 'PLAY', 'HEAL', 'EAT', 'GLOW'] as const;

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-fs-cyan/30 pb-32 relative">


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
                <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-none mb-2">
                  Welcome, {firstName}!
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
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
              <Zap className="w-32 h-32 text-fs-cyan" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-fs-cyan mb-4 block">Total Accumulated Points</span>
            
            <div className="flex items-center justify-between gap-6 mb-8">
              <div className="text-7xl font-black italic tracking-tighter shrink-0">{calculatePoints()}</div>
              
              {!userProfile?.profileCompleted && (
                <button 
                  onClick={() => setShowEarnPointsModal(true)}
                  className="flex-grow bg-fs-orange hover:bg-fs-pink transition-all py-4 px-6 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 text-white shadow-lg shadow-fs-orange/20 leading-tight text-center"
                >
                  <Star className="w-4 h-4 fill-white shrink-0" /> 
                  <span>Finish your profile and earn 10 extra points</span>
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {userProfile?.profileCompleted && (
                <button 
                  onClick={() => setShowProfileModal(true)}
                  className="w-full bg-fs-cyan text-slate-900 hover:bg-fs-cyan/90 transition-all py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
                >
                  <User className="w-4 h-4" /> My Profile
                </button>
              )}
              <button 
                onClick={() => navigate('/events/fitstreet-2026/schedule')}
                className="w-full bg-white text-slate-900 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl border border-slate-100 hover:scale-[1.02] active:scale-[0.98] transition-all mt-1"
              >
                Full Schedule <Calendar className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button 
            onClick={handleShareFitstreet}
            className="w-full bg-fs-cyan/10 border border-fs-cyan/20 rounded-[2rem] p-6 mb-12 flex items-center justify-between group hover:bg-fs-cyan/20 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-fs-cyan rounded-2xl flex items-center justify-center shadow-lg shadow-fs-cyan/20 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6 text-slate-900" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-black uppercase tracking-widest text-fs-cyan mb-1">Spread the Word</div>
                <div className="text-sm font-bold text-white">Share FITSTREET and earn 10 extra points!</div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-fs-cyan group-hover:translate-x-2 transition-transform" />
          </button>

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

                 <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
                   {/* Brands in this Zone - Active by Default */}
                   {brands.filter(b => b.zone === zone).map(brand => (
                     <motion.div 
                       key={brand.id}
                       whileTap={{ scale: 0.95 }}
                       onClick={() => { setSelectedItem(brand); setIsExpanded(false); }}
                       className={`relative aspect-square rounded-[3rem] border transition-all duration-500 overflow-hidden group cursor-pointer ${
                         completedIds.includes(brand.id) 
                           ? 'bg-white/10 border-fs-cyan/50 shadow-[0_0_40px_rgba(45,212,191,0.15)]' 
                           : 'bg-white/5 border-white/5 hover:border-slate-500'
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
                          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${completedIds.includes(brand.id) ? 'grayscale-0 opacity-100' : 'grayscale opacity-30 group-hover:opacity-60'}`} 
                          alt={brand.name} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100" />
                        
                        <div className="absolute inset-0 p-8 flex flex-col justify-end items-center text-center gap-2">
                          <span className={`text-xs font-black uppercase tracking-[0.2em] text-white drop-shadow-md`}>{brand.name}</span>
                          <div className="flex items-center gap-1.5 text-[8px] font-black uppercase text-white/60 tracking-widest opacity-80">
                            <MapPin className="w-3 h-3" /> {brand.booth}
                          </div>
                        </div>
                     </motion.div>
                   ))}

                   {/* Activity Item (Inactive/Active) */}
                    {allActivities.filter(act => act.zone === zone).map(activity => (
                      <div 
                        key={activity.id} 
                        onClick={() => { setSelectedItem(activity); setIsExpanded(false); }}
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
                        
                        <div className="absolute inset-0 p-8 pt-24 flex flex-col justify-end items-center text-center gap-6">
                          <h4 className="text-lg font-black uppercase italic leading-tight tracking-tighter text-white drop-shadow-lg">
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
                            {scannedActivityIds.includes(activity.id) ? (
                              <><CheckCircle2 className="w-5 h-5" /> COMPLETED</>
                            ) : registeredActivityIds.includes(activity.id) ? (
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
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 100 }}
              className="w-full max-w-lg max-h-[90vh] scrollbar-hide bg-slate-800 border border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-y-auto flex flex-col"
            >
              {/* Sticky Header */}
              <div className="sticky top-0 z-50 w-full flex justify-between px-6 pt-6 pb-2 -mb-[80px] pointer-events-none">
                <button 
                  onClick={() => {
                    setSelectedItem(null);
                    setIsExpanded(false);
                  }}
                  className="px-4 py-2 rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-white hover:bg-black transition-colors gap-2 text-xs font-bold pointer-events-auto shadow-xl"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" /> <span className="hidden sm:inline">Go Back</span>
                </button>
                <button 
                  onClick={() => {
                    setSelectedItem(null);
                    setIsExpanded(false);
                  }}
                  className="w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-white hover:bg-black transition-colors pointer-events-auto shadow-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative h-80 shrink-0">
                 <img 
                   src={'logo' in selectedItem ? resolveDriveImageUrl((selectedItem as any).logo) : (selectedItem as Activity).image} 
                   className="w-full h-full object-cover" 
                   alt={'name' in selectedItem ? (selectedItem as any).name : (selectedItem as Activity).title} 
                 />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-800 via-slate-800/20 to-transparent" />
                
                {/* Title Overlay in Image Frame */}
                <div className="absolute bottom-8 left-8 right-8">
                  <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-[0.85] text-white drop-shadow-2xl">
                    {'name' in selectedItem ? (selectedItem as any).name : (selectedItem as Activity).title}
                  </h3>
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-fs-cyan/20 text-fs-cyan text-[10px] font-black uppercase tracking-widest leading-none">
                    {selectedItem.zone || 'FITSTREET'}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none">
                    {selectedItem.category}
                  </span>
                </div>

                <div className="flex flex-col gap-2 mb-8 p-6 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3 text-slate-300 text-[10px] font-black uppercase tracking-widest">
                    <Calendar className="w-4 h-4 text-fs-cyan" /> {(selectedItem as any).day || 'Fitstreet 2026'}
                  </div>
                  <div className="flex items-center gap-3 text-slate-300 text-[10px] font-black uppercase tracking-widest">
                    <Clock className="w-4 h-4 text-fs-pink" /> {(selectedItem as any).time || ('duration' in selectedItem ? (selectedItem as any).duration : 'All Day')}
                  </div>
                  <div className="flex items-center gap-3 text-slate-300 text-[10px] font-black uppercase tracking-widest">
                    <MapPin className="w-4 h-4 text-fs-orange" /> {(selectedItem as any).location || ('booth' in selectedItem ? (selectedItem as any).booth : 'BGC Amphitheater')}
                  </div>
                </div>


                <div className="mb-8">
                  <h4 className="text-white font-black text-2xl uppercase italic tracking-tighter mb-4 flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-fs-cyan rounded-full" />
                    {selectedItem.id === 'pb-viking' || selectedItem.id === 'viking-games-sat' ? 'Win Prizes up to P40K' : 
                     (selectedItem.id === 'gballers-free' ? 'About G\'League' : 
                     ('name' in selectedItem ? 'About ' + (selectedItem as any).name : 'About ' + (selectedItem as Activity).title))}
                  </h4>
                  <div className="space-y-6">
                    <p className="text-slate-400 text-sm leading-relaxed italic">
                      "{(selectedItem as any).description}"
                    </p>
                    
                    {(selectedItem as any).extendedDescription && (
                      <div className={`text-slate-200 text-sm leading-relaxed font-medium bg-white/5 p-6 rounded-2xl border border-white/5 ${!isExpanded ? 'line-clamp-4 overflow-hidden' : ''}`}>
                        {(selectedItem as any).extendedDescription}
                      </div>
                    )}
                  </div>
                </div>
                
                {(selectedItem as any).mechanics && (
                  <div className="bg-fs-cyan/5 rounded-[2rem] p-8 mb-8 border border-fs-cyan/20">
                    <h4 className="text-fs-cyan font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Zap className="w-4 h-4 fill-fs-cyan" /> Challenge Mechanics
                    </h4>
                    <p className={`text-white text-sm font-medium leading-relaxed italic ${!isExpanded ? 'line-clamp-3 overflow-hidden' : ''}`}>
                      {(selectedItem as any).mechanics}
                    </p>
                  </div>
                )}

                {((selectedItem as any).extendedDescription || (selectedItem as any).mechanics) && (
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full py-3 bg-white/5 border border-white/10 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-white/10 transition-colors text-xs mb-8 flex items-center justify-center gap-2"
                  >
                    {isExpanded ? 'Show Less' : 'Read More Details'}
                  </button>
                )}

                {(selectedItem.id === 'pb-viking' || selectedItem.id === 'gballers-free' || selectedItem.id === 'viking-games-sat') && (
                  <div className="bg-fs-orange/10 rounded-2xl p-6 mb-8 border border-fs-orange/20">
                    <h3 className="text-fs-orange font-black text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4" /> Participation Details
                    </h3>
                    <div className="space-y-2">
                      <p className="text-white text-sm font-bold italic">Cost: P10,000 for a team of 4</p>
                      <p className="text-slate-400 text-xs font-medium leading-relaxed">Exclusive for non-corporates. Standard registration rates apply for individuals.</p>
                    </div>
                  </div>
                )}

                {'logo' in selectedItem ? (
                  <button 
                    onClick={() => {
                      navigate('/scanner');
                    }}
                    className="w-full py-5 bg-fs-orange text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-fs-orange/20 active:scale-95 transition-all"
                  >
                    <QrCode className="w-5 h-5" /> Scan Booth QR
                  </button>
                ) : (
                  <>
                  {selectedItem.id === 'gballers-free' && gLeagueRegistered && (
                    <div className="bg-fs-cyan/10 rounded-2xl p-6 mb-8 border border-fs-cyan/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <p className="text-fs-cyan text-sm font-bold leading-relaxed italic text-center">
                        "Thank you for registering to G'League 3x3 Womens Basketball Tournament. Once your payment has been confirmed we will credit 10 points to your passport challenge."
                      </p>
                    </div>
                  )}

                  {!registeredActivityIds.includes(selectedItem.id) ? (
                    <button 
                      onClick={(e) => {
                        handleRegisterActivity(selectedItem.id, e);
                        setSelectedItem(null);
                      }}
                      className="w-full py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 bg-fs-cyan text-slate-900 shadow-lg shadow-fs-cyan/20 active:scale-95 transition-all"
                    >
                      Register to Activate
                    </button>
                  ) : (
                    <button 
                      onClick={(e) => {
                        handleUnregisterActivity(selectedItem.id, e);
                        setSelectedItem(null);
                      }}
                      className="w-full py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors border border-red-500/20 shadow-lg active:scale-95"
                    >
                      <X className="w-5 h-5" /> Cancel Registration
                    </button>
                  )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4 text-white leading-tight">
                {successActivity.id?.startsWith('pb-') ? 'Congratulations 👏🥳' : "YOU'RE IN!"}
              </h3>
              <p className="text-slate-400 text-sm mb-12 font-medium px-4 leading-relaxed">
                {successActivity.id?.startsWith('pb-') 
                  ? <>You've completed the <span className="text-fs-cyan font-bold italic">{successActivity.title}</span> passport challenge!</>
                  : <>Thank you for registering at <span className="text-fs-cyan font-bold italic">{successActivity.title}</span>.</>}
              </p>
              
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-6 bg-fs-cyan text-slate-900 rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-fs-cyan/20 active:scale-95 transition-all"
              >
                GOT IT!
              </button>
              
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <MobileFooter />
      
      <EarnPointsModal 
        isOpen={showEarnPointsModal}
        onClose={() => setShowEarnPointsModal(false)}
        onComplete={handlePointsEarned}
      />

      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-2xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-fs-dark border border-white/10 rounded-[3rem] p-8 md:p-12 overflow-y-auto max-h-[90vh] shadow-2xl"
            >
              <button onClick={() => setShowProfileModal(false)} className="absolute top-8 right-8 text-slate-500">
                <X className="w-6 h-6" />
              </button>
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-fs-cyan/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <User className="w-10 h-10 text-fs-cyan" />
                </div>
                <h2 className="text-3xl font-black italic uppercase italic tracking-tighter text-white">Full Profile.</h2>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Member Since: {userProfile?.signupDate ? new Date(userProfile.signupDate).toLocaleDateString() : 'N/A'}</p>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Email", value: userProfile?.email || userProfile?.name?.toLowerCase()?.replace(' ', '.') + '@gmail.com' },
                  { label: "Mobile", value: userProfile?.mobile || '09XX XXX XXXX' },
                  { label: "Work Setup", value: userProfile?.workSetup },
                  { label: "Company", value: userProfile?.companyName },
                  { label: "Occupation", value: userProfile?.occupation },
                  { label: "Income Bracket", value: userProfile?.incomeBracket },
                  { label: "Fitness Level", value: userProfile?.fitnessLevel },
                  { label: "Years Active", value: userProfile?.yearsActive },
                  { label: "Training Goal", value: userProfile?.trainingGoal },
                  { label: "Workout Frequency", value: userProfile?.workoutFrequency },
                  { label: "Preferred Time", value: userProfile?.preferredTime },
                  { label: "Diet Type", value: userProfile?.dietType },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-4 border-b border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</span>
                    <span className="text-sm font-bold text-white">{item.value || 'N/A'}</span>
                  </div>
                ))}
              </div>

              <div className="mt-12 space-y-4">
                <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
                    You consented to our <button className="text-fs-cyan">Terms & Conditions</button> and <button className="text-fs-cyan">Data Privacy Policy</button> on {userProfile?.signupDate ? new Date(userProfile.signupDate).toLocaleDateString() : new Date().toLocaleDateString()}.
                  </p>
                </div>
                <button 
                  onClick={() => setShowProfileModal(false)}
                  className="w-full py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyPass;
