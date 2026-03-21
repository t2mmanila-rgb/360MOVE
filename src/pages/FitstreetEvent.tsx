import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Zap, ChevronRight, Share2, Ticket, Sparkles, Map } from 'lucide-react';
import { MOCK_SCHEDULE, type Activity } from '../data/activities';
import Onboarding from '../components/Onboarding';
import { useNavigate, Link } from 'react-router-dom';
import UniversalCard from '../components/UniversalCard';

const FitstreetEvent: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const navigate = useNavigate();

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    navigate('/my-pass');
  };

  const featuredActivities = MOCK_SCHEDULE.slice(0, 6);

  const zones = [
    { name: 'Power Zone', desc: 'HIIT, CrossFit, and Strength challenges.', color: 'fs-orange', icon: Zap },
    { name: 'Zen Garden', desc: 'Yoga, Sound Baths, and Mindfulness.', color: 'fs-cyan', icon: Sparkles },
    { name: 'Beat Box', desc: 'Dance, Zumba, and Rhythm-based movement.', color: 'fs-pink', icon: Ticket },
    { name: 'Recovery Lounge', desc: 'Physiotherapy and cryotherapy.', color: 'fs-lime', icon: Map },
  ];

  return (
    <div className="bg-fs-dark text-white min-h-screen selection:bg-fs-orange/30">
      <div className="fixed inset-0 noise-bg opacity-[0.05] pointer-events-none z-50" />
      
      {/* Hero Section */}
      <section className="relative h-[110vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-fs-dark via-fs-dark/40 to-transparent z-10 pointer-events-none" />
          <iframe
            src="https://www.youtube.com/embed/ipux3varins?autoplay=1&mute=1&loop=1&playlist=ipux3varins&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1"
            title="Fitstreet HEATWAVE 2026"
            className="absolute top-1/2 left-1/2 w-[180%] h-[180%] -translate-x-1/2 -translate-y-1/2 pointer-events-none border-none opacity-60 scale-[1.1]"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,10,0.8)_100%)] z-10 pointer-events-none" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-6 py-2 rounded-full border border-fs-orange/30 bg-fs-orange/5 backdrop-blur-xl mb-10 shadow-2xl shadow-fs-orange/10"
          >
            <Zap className="w-4 h-4 text-fs-orange mr-2 animate-pulse" />
            <span className="text-fs-orange font-black uppercase tracking-[0.4em] text-[10px]">The Coachella of Wellness</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-[10rem] font-black italic tracking-[-0.05em] mb-10 leading-[0.85] uppercase"
          >
            FITSTREET <br />
            <span className="gradient-text-fs drop-shadow-[0_0_30px_rgba(255,107,44,0.3)]">HEATWAVE.</span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center gap-6 mb-16"
          >
            <p className="text-2xl md:text-3xl text-slate-100 font-black italic tracking-tighter uppercase">
              August 15-16, 2026 <span className="text-fs-orange mx-2">/</span> BGC, Manila.
            </p>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-fs-cyan to-transparent" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-8"
          >
            <button 
              onClick={() => setShowOnboarding(true)}
              className="pill-button bg-fs-orange hover:bg-fs-pink text-white px-16 py-7 shadow-[0_0_50px_-10px_rgba(255,107,44,0.5)] text-xl italic"
            >
              GET YOUR FREE PASS
            </button>
            <button className="flex items-center gap-4 font-black uppercase tracking-widest text-[10px] text-white/40 hover:text-white transition-all group">
              <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Spread the Heat
            </button>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 cursor-pointer hidden md:block"
        >
          <div className="w-px h-24 bg-gradient-to-b from-transparent via-fs-cyan to-transparent" />
        </motion.div>
      </section>

      {/* Ticker Tape */}
      <div className="bg-fs-orange overflow-hidden py-4 border-y border-white/10 relative z-30 -rotate-1 scale-105">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-xs font-black uppercase tracking-[0.5em] text-white mx-8 flex items-center gap-4">
              <Zap className="w-4 h-4 fill-white" /> 100+ Masterclasses <Sparkles className="w-4 h-4 fill-white" /> 50+ Brands <Ticket className="w-4 h-4 fill-white" /> 20k Athletes
            </span>
          ))}
        </div>
      </div>

      {/* Lineup Section */}
      <section className="py-48 relative">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-fs-cyan/5 rounded-full blur-[180px] -z-10" />
        
        <div className="max-w-7xl mx-auto px-6">
          <header className="flex flex-col md:flex-row items-end justify-between gap-12 mb-32">
            <div className="max-w-xl">
              <div className="text-fs-cyan font-black uppercase tracking-[0.3em] text-[10px] mb-6">Real-Time Schedule</div>
              <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-8 leading-[0.9] uppercase">
                THE <span className="text-fs-cyan">LINEUP.</span>
              </h2>
              <p className="text-xl text-slate-400 font-medium">From sunrise yoga rituals to midnight high-intensity showdowns.</p>
            </div>
            <Link to="/events/fitstreet-2026/schedule" className="pill-button bg-white/5 border border-white/10 hover:border-fs-cyan text-fs-cyan px-10 py-5 transition-all italic">
              View Full Schedule
            </Link>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {featuredActivities.map((act: Activity, i: number) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                  <UniversalCard 
                    variant="dark"
                    title={act.title}
                    category={act.location || 'BGC'}
                    duration={act.time}
                    image={act.image || '/activities/rope_flow_premium.png'}
                    ctaText="Secure Spot"
                    onClick={() => setShowOnboarding(true)}
                  />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Zones Grid */}
      <section className="py-48 bg-white/5 relative border-y border-white/5 overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-fs-pink/10 rounded-full blur-[140px]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-32">
            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-6 uppercase">8 MASSIVE <span className="text-fs-pink">ZONES.</span></h2>
            <p className="text-slate-400 font-medium text-lg max-w-2xl mx-auto">Explore specialized arenas designed for every type of movement lover.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {zones.map((zone) => (
              <motion.div 
                key={zone.name} 
                whileHover={{ y: -10 }}
                className="p-12 rounded-[3.5rem] glass-dark group transition-all duration-700 hover:border-fs-pink/30 hover:shadow-2xl hover:shadow-fs-pink/10"
              >
                <div className={`w-16 h-16 rounded-[1.5rem] bg-${zone.color}/10 border border-${zone.color}/20 flex items-center justify-center mb-10 transition-transform group-hover:scale-110 group-hover:rotate-6 duration-500`}>
                  <zone.icon className={`w-8 h-8 text-${zone.color}`} />
                </div>
                <h4 className="text-2xl font-black mb-4 uppercase italic tracking-tighter">{zone.name}.</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{zone.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map/Travel Link Tease */}
      <section className="py-48 text-center px-6">
        <div className="max-w-4xl mx-auto glass-dark p-20 rounded-[4rem] relative overflow-hidden group border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-br from-fs-cyan/5 to-transparent pointer-events-none" />
          <MapPin className="w-16 h-16 text-fs-cyan mx-auto mb-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" />
          <h2 className="text-4xl md:text-6xl font-black italic mb-8 uppercase tracking-tighter">BGC HIGH STREET.</h2>
          <p className="text-xl text-slate-400 font-medium mb-12 max-w-xl mx-auto">Metro Manila's premier lifestyle strip transforms into a 360° fitness arena across 4 blocks.</p>
          <button className="flex items-center gap-4 font-black uppercase tracking-widest text-[10px] text-fs-cyan mx-auto group-hover:gap-6 transition-all">
            Interactive Event Map <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Final Ticket CTA */}
      <section className="py-64 relative overflow-hidden text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-full opacity-30 pointer-events-none">
          <div className="w-full h-full bg-fs-orange/20 blur-[200px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <h2 className="text-6xl md:text-[12rem] font-black italic tracking-[-0.06em] mb-16 leading-[0.8] uppercase">
              BE THE <br /><span className="text-fs-orange">HEAT.</span>
            </h2>
            <p className="text-2xl text-slate-400 font-medium mb-20 max-w-2xl">
              Limited spots remain for Metro Manila's most anticipated weekend. 
              Claim your digital pass today.
            </p>
            <button 
              onClick={() => setShowOnboarding(true)}
              className="pill-button bg-white text-slate-900 px-24 py-8 text-2xl italic tracking-tighter shadow-[0_0_80px_rgba(255,255,255,0.15)] hover:bg-fs-orange hover:text-white hover:shadow-fs-orange/40"
            >
              GET YOUR FREE PASS
            </button>
            <div className="mt-10 flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /> 14.2k Subscribed</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500" /> 842 People Viewing</span>
            </div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {showOnboarding && (
          <Onboarding 
            onComplete={handleOnboardingComplete} 
            onClose={() => setShowOnboarding(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FitstreetEvent;
