import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Zap, Calendar, ArrowLeft, ArrowRight, X, Info, CheckCircle2 } from 'lucide-react';
import { type Activity } from '../data/activities';
import { useActivity } from '../lib/useActivity';
import { logRegistrationToSheet } from '../lib/google-sheets';
import { useNavigate } from 'react-router-dom';
import MobileFooter from '../components/MobileFooter';

const Schedule: React.FC = () => {
  const [activeDay, setActiveDay] = useState(() => {
    const now = new Date();
    const eventDay2 = new Date('2026-05-10T00:00:00');
    return now >= eventDay2 ? 'May 10' : 'May 9';
  });
  const { schedule } = useActivity();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<Activity | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [registeredActivityIds, setRegisteredActivityIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('registered_activity_ids');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const handleRegisterActivity = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newRegistered = [...registeredActivityIds, id];
    setRegisteredActivityIds(newRegistered);
    localStorage.setItem('registered_activity_ids', JSON.stringify(newRegistered));
  };

  const handleUnregisterActivity = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newRegistered = registeredActivityIds.filter(actId => actId !== id);
    setRegisteredActivityIds(newRegistered);
    localStorage.setItem('registered_activity_ids', JSON.stringify(newRegistered));
    
    if (selectedItem) {
      const stored = localStorage.getItem('user_profile');
      const userProfile = stored ? JSON.parse(stored) : null;
      logRegistrationToSheet('https://script.google.com/macros/s/AKfycby7--LX2UwK649yFZW8rvjnpxnuIoPoBp_3fN3_nblt03Tm4JWUndvvgb4wZJPnQ38w/exec', {
        userId: userProfile?.mobile || 'unknown',
        userName: userProfile?.name || 'Guest',
        activityId: selectedItem.id,
        activityTitle: selectedItem.title,
        type: 'cancel_activity',
        timestamp: new Date().toISOString()
      });
    }
  };

  const dayEvents = schedule.filter(event => 
    activeDay === 'May 9' ? event.day?.includes('May 9') : event.day?.includes('May 10')
  );

  return (
    <div className="bg-slate-900 min-h-screen text-white pt-24 pb-32">
      <div className="px-6 mb-12">
        <header className="mb-12">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-fs-orange/20 text-fs-orange text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-fs-orange/20">
            <Calendar className="w-3.5 h-3.5 mr-2" />
            Fitstreet Heatwave 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none mb-4">
            The <span className="text-fs-orange">Program.</span>
          </h1>
          <p className="text-slate-400 font-medium">Your 48-hour journey into high-performance living.</p>
        </header>

        {/* Day Tabs */}
        <div className="flex gap-4 p-2 bg-white/5 rounded-[2rem] border border-white/10 mb-12">
          {['May 9', 'May 10'].map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`flex-1 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                activeDay === day 
                  ? 'bg-fs-orange text-white shadow-lg shadow-fs-orange/20 scale-[1.02]' 
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              {day === 'May 9' ? 'Sat, May 09' : 'Sun, May 10'}
            </button>
          ))}
        </div>

        {/* Timeline View */}
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {dayEvents.map((event, i) => (
                <div 
                  key={event.id}
                  onClick={() => { setSelectedItem(event); setIsExpanded(false); }}
                  className="relative group cursor-pointer"
                >
                  <div className="flex gap-6">
                    {/* Time Column */}
                    <div className="w-16 shrink-0 pt-1 text-right">
                      <div className="text-[10px] font-black text-fs-orange uppercase tracking-tighter mb-1">
                        {event.time?.split('–')[0].trim() || event.time}
                      </div>
                      <div className="w-full h-px bg-gradient-to-r from-transparent to-fs-orange/20 mt-2" />
                    </div>

                    {/* Content Card */}
                    <div className="flex-grow bg-white/5 border border-white/10 rounded-[2.5rem] p-6 group-hover:bg-white/10 group-hover:border-fs-orange/30 transition-all duration-500 relative overflow-hidden">
                      {event.isPaid && (
                        <div className="absolute top-0 right-0 p-4">
                          <Zap className="w-4 h-4 text-fs-orange fill-fs-orange opacity-40" />
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-fs-orange transition-colors">
                          {event.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-fs-cyan bg-fs-cyan/10 px-3 py-1 rounded-full text-[9px] font-black">
                          +{event.points} PTS
                        </div>
                      </div>

                      <h4 className="text-xl font-black italic uppercase tracking-tighter mb-4 group-hover:translate-x-1 transition-transform">
                        {event.title}
                      </h4>

                      <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          {event.duration}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Connecting Line for Timeline */}
                  {i < dayEvents.length - 1 && (
                    <div className="absolute left-8 top-16 bottom-0 w-px bg-gradient-to-b from-white/10 via-white/10 to-transparent z-0 -translate-x-1/2" />
                  )}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

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
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-white hover:bg-black transition-colors gap-2 text-xs font-bold pointer-events-auto shadow-xl"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" /> <span className="hidden sm:inline">Go Back</span>
                </button>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-white hover:bg-black transition-colors pointer-events-auto shadow-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative h-72 shrink-0">
                 <img 
                   src={selectedItem.image || '/activities/rope_flow_premium.png'} 
                   className="w-full h-full object-cover" 
                   alt={selectedItem.title} 
                 />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-800 via-transparent to-transparent" />
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

                {registeredActivityIds.includes(selectedItem.id) && (
                  <div className="flex flex-col gap-2 mb-6 p-4 rounded-xl bg-fs-cyan/10 border border-fs-cyan/20">
                    <div className="flex items-center gap-2 text-fs-cyan text-[10px] font-black uppercase tracking-widest leading-none mb-1">
                      <CheckCircle2 className="w-4 h-4" /> Activated in Passport
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2 mb-6 p-4 rounded-xl bg-white/5 border border-white/5">
                  {selectedItem.day && (
                    <div className="flex items-center gap-2 text-slate-300 text-[10px] font-black uppercase tracking-widest">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {selectedItem.day}
                    </div>
                  )}
                  {(selectedItem.time || selectedItem.duration) && (
                    <div className="flex items-center gap-2 text-slate-300 text-[10px] font-black uppercase tracking-widest">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {selectedItem.time || selectedItem.duration}
                    </div>
                  )}
                  {selectedItem.location && (
                    <div className="flex items-center gap-2 text-slate-300 text-[10px] font-black uppercase tracking-widest">
                      <MapPin className="w-3.5 h-3.5 text-fs-orange" /> {selectedItem.location}
                    </div>
                  )}
                </div>
                
                <h3 className="text-3xl font-black italic mb-6 tracking-tight uppercase leading-tight">
                  {selectedItem.title}
                </h3>
                
                <div className="mb-8">
                  <h3 className="text-fs-orange font-black text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4" /> About {selectedItem.title}
                  </h3>
                  <div className="relative">
                    <p className={`text-slate-400 text-sm leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''}`}>
                      {selectedItem.description}
                    </p>
                    {!isExpanded && (
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-800 to-transparent pointer-events-none" />
                    )}
                  </div>
                </div>
                
                {selectedItem.mechanics && (
                  <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/5 relative">
                    <h3 className="text-fs-orange font-black text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4" /> Challenge Mechanics
                    </h3>
                    <div className="relative">
                      <p className={`text-white text-sm font-medium leading-relaxed italic ${!isExpanded ? 'line-clamp-3' : ''}`}>
                        {selectedItem.mechanics}
                      </p>
                      {!isExpanded && (
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#243347] to-transparent pointer-events-none" />
                      )}
                    </div>
                  </div>
                )}

                {((selectedItem.description?.length || 0) > 50 || (selectedItem.mechanics?.length || 0) > 50) && (
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full py-3 bg-white/5 border border-white/10 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-white/10 transition-colors text-xs mb-8 flex items-center justify-center gap-2"
                  >
                    {isExpanded ? 'Show Less' : 'Read More Details'}
                  </button>
                )}

                {(selectedItem.id === 'gballers-free' || selectedItem.id === 'viking-games-sat') && (
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

                {!registeredActivityIds.includes(selectedItem.id) ? (
                  <button 
                    onClick={(e) => {
                      handleRegisterActivity(selectedItem.id, e);
                      setSelectedItem(null);
                    }}
                    className="w-full py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 bg-fs-cyan text-slate-900 shadow-lg shadow-fs-cyan/20 active:scale-95 transition-all"
                  >
                    Register for Activity
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
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <MobileFooter />
    </div>
  );
};

export default Schedule;
