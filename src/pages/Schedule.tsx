import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Zap, Calendar, ArrowLeft } from 'lucide-react';
import { MOCK_SCHEDULE } from '../data/activities';
import { useNavigate } from 'react-router-dom';
import MobileFooter from '../components/MobileFooter';

const Schedule: React.FC = () => {
  const [activeDay, setActiveDay] = useState('May 9');
  const navigate = useNavigate();

  const dayEvents = MOCK_SCHEDULE.filter(event => 
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
                  onClick={() => navigate(`/activity/${event.id}`)}
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
      <MobileFooter />
    </div>
  );
};

export default Schedule;
