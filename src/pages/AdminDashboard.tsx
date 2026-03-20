import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, QrCode, RefreshCcw, TrendingUp, Search, Activity, Target, Zap, Building2, MousePointerClick, Sparkles } from 'lucide-react';
import { B2B_PASSPORT_BRANDS } from '../data/activities';

const AdminDashboard: React.FC = () => {
  const [sessionCount, setSessionCount] = React.useState(0);
  const [userProfile, setUserProfile] = React.useState<any>(null);

  React.useEffect(() => {
    const profile = localStorage.getItem('user_profile');
    const completed = localStorage.getItem('completed_ids');
    if (profile) setUserProfile(JSON.parse(profile));
    if (completed) setSessionCount(JSON.parse(completed).length);
  }, []);

  const stats = [
    { label: 'Live Signups', val: userProfile ? '1,249' : '1,248', change: '+1%', icon: Users, color: 'fs-cyan' },
    { label: 'Passport Stamps', val: (8402 + (sessionCount * 1)).toString(), change: '+45%', icon: QrCode, color: 'fs-orange' },
    { label: 'Avg. Points/User', val: '142', change: '+18%', icon: TrendingUp, color: 'brand-purple' },
    { label: 'Conversion Rate', val: '64%', change: '+5%', icon: BarChart3, color: 'brand-teal' },
  ];

  return (
    <div className="bg-white min-h-screen pt-40 pb-56 selection:bg-fs-cyan/20">
      <div className="fixed inset-0 noise-bg opacity-[0.02] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24 text-center md:text-left">
          <div className="max-w-2xl">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-white/10">
              <Activity className="w-3.5 h-3.5 mr-2 text-fs-cyan" />
              Real-Time Intelligence
            </div>
            <h1 className="text-6xl md:text-[7rem] font-black text-slate-900 mb-8 tracking-[-0.04em] leading-[0.85] uppercase italic">
              Event <span className="gradient-text tracking-tighter italic">Command.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed">
              Monitoring <span className="text-slate-900">Fitstreet Heatwave BGC 2026</span> performance metrics and participant engagement systems.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="glass px-8 py-4 rounded-3xl border-slate-100 flex items-center gap-4">
              <div className="w-3 h-3 bg-fs-cyan rounded-full animate-pulse shadow-[0_0_15px_rgba(45,212,191,0.6)]" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-900">Live Backend Stream</span>
            </div>
            <button className="pill-button bg-fs-orange text-white hover:bg-fs-pink px-10 py-5 text-sm italic tracking-tighter shadow-2xl shadow-fs-orange/30 group">
              <RefreshCcw className="w-4 h-4 mr-3 group-hover:rotate-180 transition-transform duration-700" />
              FORCE SYNC DRIVE
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-20">
          {stats.map((stat) => (
            <div key={stat.label} className="glass p-10 rounded-[4rem] border-slate-100 hover:border-fs-cyan/30 transition-all duration-700 group hover:shadow-2xl hover:shadow-fs-cyan/10">
              <div className="flex items-center justify-between mb-8">
                <div className={`w-16 h-16 rounded-[1.5rem] bg-fs-cyan/10 flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                  <stat.icon className={`w-8 h-8 text-fs-cyan`} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-black text-fs-cyan bg-fs-cyan/10 px-4 py-1.5 rounded-full mb-1">{stat.change}</span>
                </div>
              </div>
              <div className="text-5xl font-black text-slate-900 mb-3 tracking-tighter leading-none italic">{stat.val}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Booth Traffic Ranking */}
          <div className="lg:col-span-2 glass rounded-[5rem] border-slate-100 p-16 shadow-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-16">
              <div>
                <h3 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 mb-2">Brand Traffic</h3>
                <p className="text-sm font-bold text-slate-400">Total passport stamps collected by participating brands.</p>
              </div>
              <div className="relative group w-full md:w-auto">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Filter by brand..." 
                  className="w-full md:w-80 bg-slate-50 border-none rounded-3xl pl-16 pr-8 py-5 text-sm font-black uppercase tracking-widest outline-none focus:bg-white focus:ring-2 focus:ring-fs-cyan/20 transition-all shadow-inner" 
                />
              </div>
            </div>
            
            <div className="space-y-10">
              {B2B_PASSPORT_BRANDS.map((brand, i) => (
                <div key={brand.id} className="flex items-center gap-10 group cursor-pointer">
                  <div className="text-xl font-black text-slate-200 w-8 group-hover:text-fs-cyan transition-colors">0{i + 1}</div>
                  <div className="w-20 h-20 rounded-[1.5rem] bg-white p-4 border border-slate-100 shadow-xl group-hover:scale-110 transition-transform duration-500 flex items-center justify-center overflow-hidden">
                    <img src={brand.logo} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" alt={brand.name} />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-end mb-4">
                      <h4 className="font-black text-slate-900 text-lg uppercase italic tracking-tighter">{brand.name}</h4>
                      <div className="text-right">
                        <span className="font-black text-slate-900 text-xl italic tracking-tighter">{400 + (B2B_PASSPORT_BRANDS.length - i) * 123}</span>
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-2">STAMPS</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${95 - i * 15}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="bg-fs-cyan h-full rounded-full shadow-[0_0_10px_rgba(45,212,191,0.4)]" 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engagement Section */}
          <div className="space-y-12 h-full">
            <div className="bg-slate-900 rounded-[5rem] p-16 text-white shadow-2xl relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-fs-pink/10 rounded-full blur-[100px] -z-10" />
              
              <h3 className="text-4xl font-black italic uppercase tracking-tighter mb-16">Segment <br /><span className="text-fs-cyan">Heatmap.</span></h3>
              
              <div className="space-y-10 mb-20">
                {[
                  { label: 'High-Octane', pct: 88, color: 'fs-orange', icon: Zap },
                  { label: 'Mindfulness', pct: 64, color: 'fs-cyan', icon: Target },
                  { label: 'Beauty & Glow', pct: 52, color: 'fs-pink', icon: Sparkles },
                  { label: 'Competitive', pct: 45, color: 'fs-lime', icon: MousePointerClick },
                ].map((cat) => (
                  <div key={cat.label} className="group cursor-help">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <cat.icon className={`w-5 h-5 text-${cat.color}`} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-white transition-colors">{cat.label}</span>
                      </div>
                      <span className={`text-xl font-black italic text-${cat.color}`}>{cat.pct}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${cat.pct}%` }}
                        viewport={{ once: true }}
                        className={`bg-${cat.color} h-full rounded-full`} 
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-16 border-t border-white/5">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-slate-500" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">Top Access Hub</h4>
                    <div className="text-3xl font-black italic text-white leading-none tracking-tighter">TAGUIG CITY</div>
                  </div>
                </div>
                <div className="p-8 rounded-[3rem] bg-fs-cyan/20 border border-fs-cyan/40 text-center">
                  <span className="text-4xl font-black italic text-fs-cyan leading-none">72%</span>
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mt-3">Active Area Dominance</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Signups List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-20">
          <div className="lg:col-span-2 glass rounded-[5rem] border-slate-100 p-16 shadow-2xl">
            <h3 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 mb-12">User <span className="text-fs-orange">Registry.</span></h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-4">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <th className="pb-4 pl-6">Participant</th>
                    <th className="pb-4">Interests</th>
                    <th className="pb-4">Location</th>
                    <th className="pb-4 text-right pr-6">Status</th>
                  </tr>
                </thead>
                <tbody className="space-y-4">
                  {userProfile ? (
                    <tr className="bg-slate-50 rounded-[2rem] overflow-hidden group">
                      <td className="py-6 pl-6 rounded-l-[1.5rem]">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white font-black">{userProfile.name?.charAt(0)}</div>
                          <div>
                            <div className="font-black text-slate-900 uppercase italic text-sm">{userProfile.name}</div>
                            <div className="text-[10px] text-slate-400 font-bold">{userProfile.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 italic text-xs font-medium text-slate-500">
                        {userProfile.categories?.slice(0, 2).join(', ') || 'No interests yet'}...
                      </td>
                      <td className="py-6 text-xs font-black uppercase text-slate-900">{userProfile.city || 'N/A'}</td>
                      <td className="py-6 text-right pr-6 rounded-r-[1.5rem]">
                        <span className="px-4 py-1.5 rounded-full bg-green-500/10 text-green-500 text-[9px] font-black uppercase">Active</span>
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-400 font-black uppercase tracking-widest text-xs">Waiting for live data...</td>
                    </tr>
                  )}
                  {[
                    { name: 'S. Nandwani', email: 'sonaal@wellness.com', interests: 'Mindfulness', city: 'Makati' },
                    { name: 'Coach Will', email: 'will@fitstreet.ph', interests: 'High-Octane', city: 'Taguig' }
                  ].map((mock, i) => (
                    <tr key={mock.name} className="bg-white border border-slate-100 rounded-[2rem] opacity-40">
                      <td className="py-6 pl-6 rounded-l-[1.5rem]">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 font-black">{mock.name.charAt(0)}</div>
                          <div>
                            <div className="font-black text-slate-400 uppercase italic text-sm">{mock.name}</div>
                            <div className="text-[10px] text-slate-300 font-bold">{mock.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 italic text-xs font-medium text-slate-300">{mock.interests}</td>
                      <td className="py-6 text-xs font-black uppercase text-slate-300">{mock.city}</td>
                      <td className="py-6 text-right pr-6 rounded-r-[1.5rem]">
                        <span className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-300 text-[9px] font-black uppercase">Simulated</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-slate-900 rounded-[5rem] p-16 text-white shadow-2xl">
             <h3 className="text-4xl font-black italic uppercase tracking-tighter mb-8 text-fs-orange">Sync Logic.</h3>
             <p className="text-sm text-slate-400 mb-12 leading-relaxed">System is ready to ingest Google Drive data at `t2mmanila@gmail.com`. Use the defined structure in `spreadsheet_structure.md` to update brands and programs.</p>
             <div className="space-y-6">
               <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10">
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">API Gateway</span>
                 <span className="text-fs-cyan text-[10px] font-black">CONNECTED</span>
               </div>
               <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10">
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Drive Sync</span>
                 <span className="text-slate-500 text-[10px] font-black">IDLE</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
