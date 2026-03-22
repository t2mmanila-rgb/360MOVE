import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, BarChart3, Save, Trash2, Clock, MapPin, ChevronRight,
  Search, CheckSquare, Square, X, CheckCircle2,
  Activity, Target, Zap, Sparkles, Lock, Settings, PieChart, Heart, QrCode,
  Utensils
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useActivity } from '../lib/useActivity';
import { cn } from '../lib/utils';

type Tab = 'fitstreet' | '360move' | 'editor';

const AdminDashboard: React.FC = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('fitstreet');
  const { schedule, programs } = useActivity();
  const [editingActivity, setEditingActivity] = useState<any>(null);
  const [overrides, setOverrides] = useState<any>({});
  const [stats, setStats] = useState<any>({
    totalRegistrants: 0,
    fitstreetRegistrants: 0,
    genericRegistrants: 0,
    demographics: [],
    categories: []
  });
  const [attendees, setAttendees] = useState<any[]>([]);
  const [isAttendeesLoading, setIsAttendeesLoading] = useState(false);

  const fetchAttendees = async (activityId: string) => {
    setIsAttendeesLoading(true);
    console.log('[Admin] Fetching attendees for:', activityId);
    try {
      // 1. Try a super-minimal select first to confirm the activity_id exists
      const { data: testData, error: testError } = await supabase
        .from('user_activities')
        .select('id')
        .eq('activity_id', activityId);

      if (testError) {
        alert("⚠️ DB Error: " + testError.message);
        throw testError;
      }

      console.log(`[Admin] DB Rows found for ${activityId}:`, testData?.length);

      // 2. Try the full select with profiles
      const { data, error } = await supabase
        .from('user_activities')
        .select(`
          id,
          user_email,
          registered_at,
          is_onsite,
          profiles!user_email (
            name,
            age_range,
            gender
          )
        `)
        .eq('activity_id', activityId)
        .order('registered_at', { ascending: false });

      if (error) {
         console.warn('[Admin] Profile join failed, showing minimal data...', error.message);
         // Fallback: Just the activity data + email
         const { data: minimalData, error: minimalError } = await supabase
           .from('user_activities')
           .select(`
             id,
             user_email,
             registered_at,
             is_onsite
           `)
           .eq('activity_id', activityId)
           .order('registered_at', { ascending: false });
           
         if (minimalError) {
           alert("⚠️ Fallback Error: " + minimalError.message);
           throw minimalError;
         }
         setAttendees(minimalData || []);
         return;
      }
      
      setAttendees(data || []);
    } catch (err) {
      console.error('Error fetching attendees:', err);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('PGRST204')) {
        alert("⚠️ SCHEMA ERROR: Please run the SQL migration I provided in Supabase.");
      } else {
        alert("⚠️ Fetch Failed: " + msg + " for ID: " + activityId);
      }
    } finally {
      setIsAttendeesLoading(false);
    }
  };

  const handleToggleOnsite = async (registrationId: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('user_activities')
        .update({ is_onsite: !currentStatus })
        .eq('id', registrationId);

      if (error) throw error;
      
      // Update local state
      setAttendees(prev => prev.map(a => 
        a.id === registrationId ? { ...a, is_onsite: !currentStatus } : a
      ));
    } catch (err) {
      console.error('Error updating onsite status:', err);
      alert('Failed to update status');
    }
  };

  useEffect(() => {
    if (editingActivity?.id) {
      fetchAttendees(editingActivity.id);
      
      // Real-time subscription for attendees
      const channel = supabase
        .channel(`attendees-${editingActivity.id}`)
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'user_activities',
          filter: `activity_id=eq.${editingActivity.id}`
        }, () => {
          fetchAttendees(editingActivity.id);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [editingActivity?.id]);

  const fetchStats = async () => {
    try {
      const { supabase } = await import('../lib/supabase');
      
      // Fetch all profiles
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;

      if (profiles) {
        const fitstreet = profiles.filter(p => p.profile_type === 'fitstreet').length;
        const generic = profiles.filter(p => p.profile_type === 'generic').length;
        
        // Count Passport Completions (assuming 9 brands total, 100 pts each)
        const passportCompletions = profiles.filter(p => (p.points_scans || 0) >= 900).length;

        // Age demographics from DB
        const ageCounts: Record<string, number> = {};
        let totalWithAge = 0;
        profiles.forEach(p => {
          if (p.age_range) {
            ageCounts[p.age_range] = (ageCounts[p.age_range] || 0) + 1;
            totalWithAge++;
          }
        });
        
        const demo = [
          { label: '18-24', val: totalWithAge > 0 ? (ageCounts['18-24'] || 0) / totalWithAge * 100 : 0, count: ageCounts['18-24'] || 0, color: 'fs-cyan' },
          { label: '25-34', val: totalWithAge > 0 ? (ageCounts['25-34'] || 0) / totalWithAge * 100 : 0, count: ageCounts['25-34'] || 0, color: 'fs-orange' },
          { label: '35-44', val: totalWithAge > 0 ? (ageCounts['35-44'] || 0) / totalWithAge * 100 : 0, count: ageCounts['35-44'] || 0, color: 'brand-purple' },
          { label: '45+', val: totalWithAge > 0 ? (ageCounts['45+'] || 0) / totalWithAge * 100 : 0, count: ageCounts['45+'] || 0, color: 'fs-pink' }
        ];

        // Categories/Interests
        const interestCounts: Record<string, number> = {};
        profiles.forEach(p => {
          (p.categories || []).forEach((cat: string) => {
            interestCounts[cat] = (interestCounts[cat] || 0) + 1;
          });
        });

        // Activity Registrations
        const { data: activityData } = await supabase.from('user_activities').select('activity_id');
        const regCounts: Record<string, number> = {};
        if (activityData) {
          activityData.forEach(reg => {
            regCounts[reg.activity_id] = (regCounts[reg.activity_id] || 0) + 1;
          });
        }

        // Booth Visits (Filter for booth-specific IDs)
        const boothIds = ['pb-nike', 'pb-skippys', 'pb-chobani', 'pb-goodies', 'pb-gballers', 'pb-viking', 'pb-adidas'];
        const boothVisits = boothIds.map(id => {
          const nameMap: Record<string, string> = {
            'pb-nike': 'Nike', 'pb-skippys': "Skippy's", 'pb-chobani': 'Chobani', 
            'pb-goodies': 'Goodies', 'pb-gballers': "G'Ballers", 'pb-viking': 'Viking Fitness', 
            'pb-adidas': 'Adidas'
          };
          return { label: nameMap[id] || id, val: regCounts[id] || 0 };
        }).sort((a,b) => b.val - a.val);

        setStats({
          totalRegistrants: profiles.length,
          fitstreetRegistrants: fitstreet,
          genericRegistrants: generic,
          passportCompletions,
          demographics: demo,
          activityCounts: regCounts,
          boothVisits,
          categories: Object.entries(interestCounts)
            .map(([label, val]) => ({ label, val }))
            .sort((a,b) => b.val - a.val)
            .slice(0, 4)
        });
      }
    } catch (err) {
      console.warn('Failed to fetch live stats:', err);
    }
  };

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('is_admin_authed');
    if (isAdmin) {
      setIsAdminLoggedIn(true);
      fetchStats();
    }

    const loadOverrides = async () => {
      const savedOverrides = localStorage.getItem('admin_activity_overrides');
      if (savedOverrides) setOverrides(JSON.parse(savedOverrides));
      
      try {
        const { supabase } = await import('../lib/supabase');
        const { data, error } = await supabase.from('activity_overrides').select('*');
        if (!error && data) {
          const ovs: any = {};
          data.forEach(row => {
            ovs[row.activity_id] = {
              category: row.category,
              points: row.points,
              day: row.day,
              time: row.time,
              isPaid: row.is_paid,
              location: row.location,
              description: row.description
            };
          });
          setOverrides(ovs);
        }
      } catch (err) {
        console.warn('Supabase overrides load failed');
      }
    };
    
    loadOverrides();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '360admin') {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('is_admin_authed', 'true');
      fetchStats();
    } else {
      alert('Invalid Passcode');
    }
  };

  const saveOverride = async (id: string, field: string, value: any) => {
    const newOverrides = {
      ...overrides,
      [id]: {
        ...(overrides[id] || {}),
        [field]: value
      }
    };
    setOverrides(newOverrides);
    localStorage.setItem('admin_activity_overrides', JSON.stringify(newOverrides));

    // Sync to Supabase
    try {
      const { supabase } = await import('../lib/supabase');
      const current = newOverrides[id];
      await supabase.from('activity_overrides').upsert({
        activity_id: id,
        category: current.category,
        points: current.points,
        day: current.day,
        time: current.time,
        is_paid: !!current.isPaid,
        location: current.location,
        description: current.description,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase CMS sync failed:', err);
    }

    window.dispatchEvent(new Event('admin-overrides-updated'));
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-[3rem] p-12 text-center shadow-2xl"
        >
          <div className="w-20 h-20 bg-fs-cyan/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Lock className="w-10 h-10 text-fs-cyan" />
          </div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 mb-4">Command <span className="text-fs-cyan">Login.</span></h1>
          <p className="text-slate-400 font-medium mb-10 text-sm">Authorized personnel only. Enter access code.</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="password" 
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="ENTER PASSCODE (360admin)" 
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-center font-black tracking-[0.5em] text-slate-900 outline-none focus:border-fs-cyan focus:ring-0 transition-all"
            />
            <button className="pill-button w-full bg-slate-900 text-white py-5 shadow-xl shadow-slate-900/20">
              Access Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const TabButton = ({ id, label, icon: Icon }: { id: Tab, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={cn(
        "flex items-center gap-3 px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all",
        activeTab === id 
          ? "bg-slate-900 text-white shadow-xl scale-105" 
          : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-40">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-12 mb-16 px-4">
          <div>
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-white/10">
              <Activity className="w-3.5 h-3.5 mr-2 text-fs-cyan" />
              Intelligence Center
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic text-slate-900 tracking-tighter uppercase leading-none">
              The <span className="gradient-text">Matrix.</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="px-4 py-2 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
              <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", import.meta.env.VITE_SUPABASE_URL ? "bg-green-500 animate-pulse" : "bg-red-500")} />
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Database Status</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-tighter text-slate-700 leading-none">
                    {import.meta.env.VITE_SUPABASE_URL ? "Connected" : "Disconnected"}
                  </span>
                  <button 
                    onClick={async () => {
                      if (!import.meta.env.VITE_SUPABASE_URL) {
                        alert("❌ CONFIG ERROR: VITE_SUPABASE_URL is missing. If you are on a live site (Vercel), add it to your deployment settings. If local, restart your npm server.");
                        return;
                      }
                      try {
                        const { supabase } = await import('../lib/supabase');
                        const { error } = await supabase.from('profiles').upsert({ email: 'test@360move.com', name: 'System Test' });
                        alert(error ? `❌ Supabase Error: ${error.message}` : "✅ Success! Database is reachable.");
                      } catch (err) {
                        alert(`❌ JS Error: ${err instanceof Error ? err.message : String(err)}`);
                      }
                    }}
                    className="text-[8px] font-black text-brand-purple hover:underline"
                  >
                    (Test Now)
                  </button>
                  <button 
                    onClick={async () => {
                      try {
                        const { migrateLocalData } = await import('../lib/supabase');
                        const res = await migrateLocalData();
                        alert(`✅ Sync Complete!\nProfiles: ${res?.profiles || 0}\nActivities: ${res?.activities || 0}\n\nRefresh to see live data.`);
                        window.location.reload();
                      } catch (err) {
                        alert(`❌ Sync Error: ${err instanceof Error ? err.message : String(err)}`);
                      }
                    }}
                    className="text-[8px] font-black text-fs-orange hover:underline ml-2"
                  >
                    (Sync Local Data)
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-2 bg-white rounded-full shadow-lg border border-slate-100 h-fit">
              <TabButton id="fitstreet" label="Fitstreet" icon={Zap} />
              <TabButton id="360move" label="360MOVE" icon={PieChart} />
              <TabButton id="editor" label="CMS Editor" icon={Settings} />
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'fitstreet' && (
            <motion.div 
              key="fitstreet"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { label: 'Total Signups', val: stats.totalRegistrants.toLocaleString(), change: 'LIVE', icon: Users, color: 'fs-cyan' },
                  { label: 'Fitstreet Attendees', val: stats.fitstreetRegistrants.toLocaleString(), change: 'EVENT', icon: Zap, color: 'fs-orange' },
                  { label: '360MOVE Members', val: stats.genericRegistrants.toLocaleString(), change: 'GENERIC', icon: PieChart, color: 'brand-purple' },
                  { label: 'Passport Completions', val: stats.passportCompletions?.toLocaleString() || '0', change: 'ALIVE', icon: Target, color: 'fs-pink' }
                ].map((stat) => (
                  <div key={stat.label} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className={cn("w-12 h-12 rounded-2xl bg-opacity-10 flex items-center justify-center", `bg-${stat.color} text-${stat.color}`)}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <span className={cn("text-[10px] font-black px-3 py-1 rounded-full bg-opacity-10", `bg-${stat.color} text-${stat.color}`)}>{stat.change}</span>
                    </div>
                    <div className="text-4xl font-black italic text-slate-900 tracking-tighter mb-1">{stat.val}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Zone Participation Map */}
                <div className="bg-slate-900 rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-12">
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter text-fs-orange">Zone Activity.</h3>
                    <PieChart className="w-6 h-6 text-fs-orange" />
                  </div>
                  <div className="space-y-8">
                    {[
                      { label: 'The ARENA', pct: 85, color: 'fs-orange', icon: Zap },
                      { label: 'EAT Zone', pct: 64, color: 'fs-cyan', icon: Utensils },
                      { label: 'PLAY Zone', pct: 52, color: 'fs-pink', icon: Target },
                      { label: 'HEAL Zone', pct: 38, color: 'fs-lime', icon: Heart },
                      { label: 'GLOW Zone', pct: 25, color: 'brand-purple', icon: Sparkles }
                    ].map((zone) => (
                      <div key={zone.label} className="group">
                        <div className="flex items-center justify-between mb-3 text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-400 flex items-center gap-3">
                            <zone.icon className={cn("w-4 h-4", `text-${zone.color}`)} />
                            {zone.label}
                          </span>
                          <span className={cn(`text-${zone.color}`)}>{zone.pct}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${zone.pct}%` }}
                            className={cn("h-full rounded-full", `bg-${zone.color}`)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Passport Engagement (Granular Breakdown) */}
                <div className="bg-white rounded-[4rem] p-12 text-slate-900 shadow-xl border border-slate-100">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">Passport Breakdown.</h3>
                    <QrCode className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="space-y-6">
                    {stats.boothVisits?.length > 0 ? stats.boothVisits.map((booth: any) => (
                      <div key={booth.label} className="bg-slate-50 p-4 rounded-3xl border border-slate-100/50 hover:border-fs-orange/20 transition-all group">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-fs-orange group-hover:scale-125 transition-transform" />
                            {booth.label}
                          </span>
                          <span className="text-xs font-black text-slate-900">{booth.val}</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${Math.min((booth.val / (stats.totalRegistrants || 1)) * 100, 100)}%` }}
                            className="h-full bg-fs-orange rounded-full"
                          />
                        </div>
                      </div>
                    )) : (
                      <p className="text-[10px] font-bold text-slate-400 italic py-4 text-center">No booth scans recorded yet.</p>
                    )}
                  </div>
                </div>

                {/* Demographics Chart */}
                <div className="bg-white rounded-[4rem] p-12 text-slate-900 shadow-xl border border-slate-100">
                  <div className="flex items-center justify-between mb-12">
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">Demographics.</h3>
                    <BarChart3 className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="flex items-end justify-between h-64 gap-4 px-4">
                    {stats.demographics.map((bar: any) => (
                      <div key={bar.label} className="flex-1 flex flex-col items-center gap-4">
                        <motion.div 
                          initial={{ height: 0 }}
                          whileInView={{ height: `${bar.val}%` }}
                          className={cn("w-full rounded-2xl relative group cursor-pointer", `bg-${bar.color} scroll-shadow`)}
                        >
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {bar.count} Users ({Math.round(bar.val)}%)
                          </div>
                        </motion.div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{bar.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity Signup Table */}
                <div className="bg-white rounded-[4rem] p-12 text-slate-900 shadow-xl border border-slate-100">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">Activity Signups.</h3>
                    <div className="px-4 py-1 bg-fs-cyan/10 rounded-full text-[10px] font-black text-fs-cyan uppercase tracking-widest">Live Multi-User Sync</div>
                  </div>
                               <div className="flex flex-col gap-4 max-h-[800px] overflow-y-auto pr-4 scrollbar-thin">
                    {[...schedule, ...programs].sort((a, b) => (stats.activityCounts?.[b.id] || 0) - (stats.activityCounts?.[a.id] || 0)).map((act) => {
                      const count = stats.activityCounts?.[act.id] || 0;
                      return (
                        <div key={act.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:border-fs-cyan/30 transition-all flex items-center justify-between group gap-8">
                          <div className="flex items-center gap-6 flex-1 min-w-0">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                              <img src={act.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                <span className="bg-slate-900 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shrink-0">
                                  {act.zone || 'FITSTREET'}
                                </span>
                                <div className="text-sm sm:text-lg font-black text-slate-900 uppercase italic truncate">{act.title}</div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                  <div className="w-1.5 h-1.5 rounded-full bg-fs-cyan" />
                                  {act.category}
                                </div>
                                {act.time && (
                                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Clock className="w-3 h-3" />
                                    {act.time}
                                  </div>
                                )}
                                {act.location && (
                                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 hidden sm:flex">
                                    <MapPin className="w-3 h-3" />
                                    {act.location}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-8 shrink-0">
                            <div className="flex flex-col items-end">
                              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Registrations</div>
                              <span className={cn(
                                "text-2xl font-black italic",
                                count > 0 ? "text-fs-cyan font-black" : "text-slate-200"
                              )}>
                                {count.toString().padStart(2, '0')}
                              </span>
                            </div>
                            <button 
                              onClick={() => setEditingActivity(act)}
                              className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === '360move' && (
            <motion.div 
              key="360move"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-slate-900 rounded-[4rem] p-16 text-white overflow-hidden relative shadow-2xl">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-turquoise/10 rounded-full blur-[120px] -z-10" />
                    <h3 className="text-5xl font-black italic tracking-tighter uppercase mb-4 leading-none">Preference <br /><span className="text-brand-turquoise">Heatmap.</span></h3>
                    <p className="text-slate-400 font-medium mb-12 text-lg">Top categories identified by 360MOVE members.</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                      {stats.categories.length > 0 ? stats.categories.map((pref: any) => (
                        <div key={pref.label} className="text-center group">
                          <div className="w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 text-brand-turquoise">
                            <Target className="w-10 h-10" />
                          </div>
                          <div className="text-3xl font-black italic mb-2 tracking-tighter text-white">{pref.val}</div>
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{pref.label}</div>
                        </div>
                      )) : (
                         <div className="col-span-4 py-20 text-center text-slate-500 font-bold uppercase italic tracking-widest">
                            No preference data collected yet.
                         </div>
                      )}
                    </div>
                </div>

                <div className="bg-white rounded-[4rem] p-12 border border-slate-100 flex flex-col justify-between shadow-xl">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 border-b border-slate-50 pb-4">Top Program Interest</h4>
                    <div className="space-y-8">
                      {programs.slice(0, 5).map((p, i) => (
                        <div key={p.id} className="flex items-center gap-4">
                          <span className="text-sm font-black text-slate-200">0{i+1}</span>
                          <span className="text-sm font-bold text-slate-600 truncate">{p.title}</span>
                          <span className="ml-auto text-xs font-black text-slate-900 italic">420+</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button className="pill-button w-full bg-brand-turquoise text-white mt-8 py-5 text-sm hover:bg-brand-teal transition-all shadow-xl shadow-brand-turquoise/20">
                    Export Analysis
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'editor' && (
            <motion.div 
              key="editor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="bg-white rounded-[4rem] p-12 border border-slate-100 shadow-xl flex flex-col overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                  <div className="flex items-center gap-4">
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Activity Oversight.</h3>
                    <div className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">{schedule.length + programs.length} Total</div>
                  </div>
                  
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search entries..." className="w-full bg-slate-50 rounded-2xl pl-14 pr-6 py-4 text-xs font-bold outline-none border border-transparent focus:border-fs-cyan/30 transition-all shadow-inner" />
                  </div>
                </div>
                
                <div className="space-y-12">
                  <div>
                    <div className="flex items-center gap-3 mb-6 ml-4">
                      <div className="w-2 h-2 rounded-full bg-fs-orange" />
                      <div className="text-[10px] font-black uppercase tracking-[0.3em] text-fs-orange">Fitstreet Schedule</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {schedule.map(act => (
                        <button 
                          key={act.id} 
                          onClick={() => {
                            setEditingActivity(act);
                            // Scroll to editor
                            setTimeout(() => {
                              document.getElementById('activity-editor')?.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                          }}
                          className={cn(
                            "group flex flex-col p-4 rounded-3xl transition-all border text-left h-full",
                            editingActivity?.id === act.id ? "bg-fs-cyan/5 border-fs-cyan/30 shadow-xl shadow-fs-cyan/5 ring-2 ring-fs-cyan/20" : "bg-white border-slate-100 hover:border-slate-300 hover:shadow-lg"
                          )}
                        >
                          <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 mb-4 relative">
                            <img src={act.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            {stats.activityCounts?.[act.id] > 0 && (
                              <div className="absolute top-3 right-3 bg-slate-900 text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                                <Users className="w-3 h-3 text-fs-cyan" />
                                {stats.activityCounts[act.id]}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{act.category}</div>
                            <div className="text-sm font-black text-slate-900 leading-tight uppercase italic group-hover:text-fs-cyan transition-colors line-clamp-2">{act.title}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-6 ml-4">
                      <div className="w-2 h-2 rounded-full bg-brand-purple" />
                      <div className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-purple">Movement Programs</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {programs.map(prog => (
                        <button 
                          key={prog.id} 
                          onClick={() => {
                            setEditingActivity(prog);
                            setTimeout(() => {
                              document.getElementById('activity-editor')?.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                          }}
                          className={cn(
                            "group flex flex-col p-4 rounded-3xl transition-all border text-left h-full",
                            editingActivity?.id === prog.id ? "bg-brand-purple/5 border-brand-purple/30 shadow-xl shadow-brand-purple/5 ring-2 ring-brand-purple/20" : "bg-white border-slate-100 hover:border-slate-300 hover:shadow-lg"
                          )}
                        >
                          <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 mb-4 relative">
                            <img src={prog.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            {stats.activityCounts?.[prog.id] > 0 && (
                              <div className="absolute top-3 right-3 bg-brand-purple text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                                <Users className="w-3 h-3" />
                                {stats.activityCounts[prog.id]}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{prog.category}</div>
                            <div className="text-sm font-black text-slate-900 leading-tight uppercase italic group-hover:text-brand-purple transition-colors line-clamp-2">{prog.title}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {editingActivity && (
                <div id="activity-editor" className="scroll-mt-32">
                  <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[4rem] p-16 border-4 border-slate-100 shadow-2xl relative"
                  >
                    <button 
                      onClick={() => setEditingActivity(null)}
                      className="absolute top-12 right-12 w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
                    >
                      <X className="w-6 h-6" />
                    </button>
                    <div className="flex items-center justify-between mb-16">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-3xl bg-slate-100 overflow-hidden">
                          <img src={editingActivity.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 mb-1">{editingActivity.title}</h4>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-1 bg-slate-100 rounded-full">{editingActivity.id}</span>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Display Category</label>
                          <input 
                            type="text" 
                            value={overrides[editingActivity.id]?.category ?? editingActivity.category}
                            onChange={(e) => saveOverride(editingActivity.id, 'category', e.target.value)}
                            className="w-full px-6 py-4 bg-slate-50 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-fs-cyan/20 border-transparent transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Point Reward</label>
                          <input 
                            type="number" 
                            value={overrides[editingActivity.id]?.points ?? editingActivity.points}
                            onChange={(e) => saveOverride(editingActivity.id, 'points', parseInt(e.target.value))}
                            className="w-full px-6 py-4 bg-slate-50 rounded-2xl text-xs font-bold font-black outline-none focus:ring-2 focus:ring-fs-cyan/20 border-transparent transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Session Date/Day</label>
                          <input 
                            type="text" 
                            value={overrides[editingActivity.id]?.day ?? editingActivity.day}
                            onChange={(e) => saveOverride(editingActivity.id, 'day', e.target.value)}
                            className="w-full px-6 py-4 bg-slate-50 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-fs-cyan/20 border-transparent transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Session Time / Booking Windows</label>
                          <input 
                            type="text" 
                            value={overrides[editingActivity.id]?.time ?? editingActivity.time}
                            onChange={(e) => saveOverride(editingActivity.id, 'time', e.target.value)}
                            className="w-full px-6 py-4 bg-slate-50 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-fs-cyan/20 border-transparent transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Price Label (e.g. "FREE" or "P1,500")</label>
                          <input 
                            type="text" 
                            value={overrides[editingActivity.id]?.isPaid ? "PAID" : "FREE"}
                            onChange={(e) => saveOverride(editingActivity.id, 'isPaid', e.target.value.toLowerCase().includes('paid'))}
                            className="w-full px-6 py-4 bg-slate-50 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-fs-cyan/20 border-transparent transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Location/Arena</label>
                          <input 
                            type="text" 
                            value={overrides[editingActivity.id]?.location ?? editingActivity.location}
                            onChange={(e) => saveOverride(editingActivity.id, 'location', e.target.value)}
                            className="w-full px-6 py-4 bg-slate-50 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-fs-cyan/20 border-transparent transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-10 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Extended Description</label>
                      <textarea 
                        rows={4}
                        value={overrides[editingActivity.id]?.description ?? editingActivity.description}
                        onChange={(e) => saveOverride(editingActivity.id, 'description', e.target.value)}
                        className="w-full px-8 py-6 bg-slate-50 rounded-[2rem] text-sm font-medium leading-relaxed outline-none focus:ring-2 focus:ring-fs-cyan/20 border-transparent transition-all resize-none"
                      />
                    </div>

                    {/* Attendees List Section */}
                    <div className="mt-16 space-y-8">
                      <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-fs-cyan" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">Attendees List.</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Registration Data</p>
                          </div>
                        </div>
                        <div className="bg-fs-cyan/10 px-4 py-2 rounded-full text-fs-cyan text-[10px] font-black uppercase tracking-widest">
                          {attendees.length} Total Registered
                        </div>
                      </div>

                      {isAttendeesLoading ? (
                        <div className="py-20 text-center text-slate-400 font-bold uppercase italic tracking-widest animate-pulse">
                          Synchronizing with Supabase...
                        </div>
                      ) : attendees.length > 0 ? (
                        <div className="overflow-hidden rounded-[2rem] border border-slate-100">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Name</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Demographics</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Reg Type</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {attendees.map((atdt) => (
                                <tr key={atdt.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="px-6 py-5">
                                    <div className="text-sm font-black text-slate-900 uppercase italic leading-none mb-1">
                                      {atdt.profiles?.name || 'Anonymous Move Member'}
                                    </div>
                                    <div className="text-[9px] font-medium text-slate-400">{atdt.user_email}</div>
                                  </td>
                                  <td className="px-6 py-5">
                                    <div className="flex items-center justify-center gap-2">
                                      <span className="bg-slate-100 px-2 py-1 rounded text-[10px] font-bold text-slate-600 uppercase">
                                        {atdt.profiles?.age_range || '--'}
                                      </span>
                                      <span className="bg-slate-100 px-2 py-1 rounded text-[10px] font-bold text-slate-600 uppercase">
                                        {atdt.profiles?.gender || '--'}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-5">
                                    <div className="flex justify-center">
                                      <span className={cn(
                                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm",
                                        atdt.is_onsite 
                                          ? "bg-green-100 text-green-600 border border-green-200" 
                                          : "bg-orange-50 text-orange-600 border border-orange-100"
                                      )}>
                                        {atdt.is_onsite ? (
                                          <><CheckCircle2 className="w-3.5 h-3.5" /> Checked In</>
                                        ) : (
                                          <><Clock className="w-3.5 h-3.5 opacity-50" /> Pre-Reg</>
                                        )}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-5">
                                    <div className="flex justify-end">
                                      <button 
                                        onClick={() => handleToggleOnsite(atdt.id, atdt.is_onsite)}
                                        className={cn(
                                          "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all",
                                          atdt.is_onsite 
                                            ? "bg-slate-100 text-slate-400 hover:bg-slate-200" 
                                            : "bg-fs-cyan text-slate-900 shadow-lg shadow-fs-cyan/20 hover:scale-105"
                                        )}
                                      >
                                        {atdt.is_onsite ? (
                                          <><CheckSquare className="w-3.5 h-3.5" /> Checked In</>
                                        ) : (
                                          <><Square className="w-3.5 h-3.5" /> Check In</>
                                        )}
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="py-20 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                          <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                          <h4 className="text-xl font-black italic uppercase tracking-tighter text-slate-300">No Attendees Yet.</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-[200px] mx-auto mt-2 text-center">As users activate this program on their phones, they will appear here.</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-12 p-8 rounded-[3rem] bg-fs-cyan/10 border border-fs-cyan/20 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-900 border-4 border-white flex items-center justify-center">
                          <Save className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-xs font-black text-slate-900 uppercase italic">Changes are instantly published to live browsers.</p>
                      </div>
                      <button className="pill-button bg-slate-900 text-white px-10">Done Editing</button>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
