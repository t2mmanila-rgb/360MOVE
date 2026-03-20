import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Sparkles, Globe, ChevronRight } from 'lucide-react';
import { B2C_PROGRAMS } from '../data/activities';
import UniversalCard from '../components/UniversalCard';

const Home: React.FC = () => {
  const pillars = [
    { title: 'Move', icon: Zap, color: 'fs-cyan', desc: 'Physical performance & fitness' },
    { title: 'Mind', icon: Sparkles, color: 'fs-pink', desc: 'Mindfulness & recovery' },
    { title: 'Live', icon: Globe, color: 'fs-purple', desc: 'Lifestyle & community' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen selection:bg-brand-turquoise/30">
      {/* Hero Section */}
      <section className="relative pt-40 pb-56 overflow-hidden">
        {/* Animated Background Orbs */}
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 -mr-20 -mt-20 w-[800px] h-[800px] bg-brand-turquoise/10 rounded-full blur-[120px] pointer-events-none" 
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 left-0 -ml-20 w-[600px] h-[600px] bg-brand-purple/10 rounded-full blur-[100px] pointer-events-none" 
        />
        <div className="absolute inset-0 noise-bg opacity-[0.03] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-6 py-2 rounded-full bg-white/40 backdrop-blur-xl border border-white/40 text-brand-teal text-[10px] font-black uppercase tracking-[0.2em] mb-10 shadow-xl shadow-brand-teal/5"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Metromanila's Premium Wellness Hub
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-9xl font-black text-slate-900 mb-10 tracking-[ -0.05em] leading-[0.95]"
          >
            MOVE. MIND. <br /><span className="gradient-text italic">LIVE.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="max-w-2xl mx-auto text-xl text-slate-500 font-medium mb-16 leading-relaxed px-4"
          >
            Bridge the gap between executive performance and holistic health with 
            structured wellness journeys designed for the modern movement.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-8"
          >
            <Link to="/programs" className="pill-button bg-slate-900 text-white shadow-2xl shadow-black/20 hover:bg-slate-800 px-12 py-6">
              Explore Programs
            </Link>
            <Link to="/events" className="pill-button bg-white text-slate-900 shadow-xl shadow-slate-200/50 hover:bg-slate-50 px-12 py-6 border border-slate-100 italic">
              View Events <ChevronRight className="inline-block ml-1 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-32 relative group">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
            {pillars.map((pillar, i) => (
              <motion.div 
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                whileHover={{ y: -12 }}
                className="glass p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200/40 hover:shadow-brand-turquoise/10 transition-all duration-700 relative overflow-hidden group/card"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-[40px] opacity-0 group-hover/card:opacity-100 transition-opacity" />
                <div className={`w-16 h-16 rounded-3xl bg-${pillar.color}/10 flex items-center justify-center mb-10 transition-transform group-hover/card:scale-110 duration-500`}>
                  <pillar.icon className={`w-8 h-8 text-${pillar.color}`} />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">{pillar.title}.</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Flagship Event: Fitstreet */}
      <section className="py-40 bg-slate-900 mx-4 md:mx-12 rounded-[5rem] overflow-hidden relative border border-white/5">
        <div className="absolute inset-0 noise-bg opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-fs-orange/5 rounded-full blur-[150px] animate-pulse" />
        
        <div className="max-w-7xl mx-auto px-8 md:px-24 flex flex-col lg:flex-row items-center gap-24 relative z-10">
          <div className="lg:w-3/5">
            <span className="inline-block px-4 py-1.5 bg-fs-orange/10 text-fs-orange border border-fs-orange/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-10">Flagship 2026</span>
            <h2 className="text-6xl md:text-8xl font-black italic text-white mb-8 tracking-[-0.04em] leading-[0.9]">
              FITSTREET <br /><span className="gradient-text-fs">HEATWAVE.</span>
            </h2>
            <p className="text-2xl text-slate-400 font-medium mb-16 leading-relaxed max-w-xl">
              Bonifacio High Street transforms into a 360° wellness arena. 
              Join the movement that defines the city.
            </p>
            <div className="flex flex-wrap gap-8">
              <Link to="/events/fitstreet-2026" className="pill-button bg-fs-orange text-white hover:bg-fs-pink px-14 py-6 shadow-2xl shadow-fs-orange/30">
                GET YOUR PASS
              </Link>
              <Link to="/events" className="flex items-center gap-4 text-white font-black uppercase tracking-widest text-sm hover:gap-6 transition-all group">
                Full Calendar <ArrowRight className="w-5 h-5 text-fs-orange group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>
          <div className="lg:w-2/5 relative">
            <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl fs-shadow rotate-3 hover:rotate-0 transition-transform duration-1000">
              <img src="/logos/Viking Games Banner - Fitstreet 2026.png" className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-[2s]" alt="Fitstreet" />
            </div>
            <div className="absolute -bottom-8 -left-8 glass-dark p-8 rounded-[2.5rem] shadow-2xl">
              <div className="text-fs-cyan text-4xl font-black italic mb-1">MAY 09-10</div>
              <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Global Event Hub</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Fork: Dynamic Split */}
      <section className="py-48">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 h-[700px]">
            {/* Corporate/B2B */}
            <Link 
              to="/programs/corporate" 
              className="group relative flex-1 rounded-[4rem] overflow-hidden bg-brand-teal flex flex-col justify-end p-16 transition-all duration-700 hover:flex-[1.2]"
            >
              <div className="absolute inset-0 opacity-60 group-hover:scale-110 transition-transform duration-[3s]">
                <img src="/logos/Corporate Fitstreet Banner.png" className="w-full h-full object-cover" alt="Corporate" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
              </div>
              <div className="relative z-10">
                <h3 className="text-5xl font-black text-white mb-6 uppercase italic tracking-tighter leading-none">Corporate <br />Wellness.</h3>
                <p className="text-white/70 font-medium text-lg mb-10 max-w-sm">Elevate your organization's performance through science-backed vitality.</p>
                <div className="pill-button bg-white/10 text-white backdrop-blur-md w-fit group-hover:bg-brand-turquoise transition-colors">
                  Request Portfolio
                </div>
              </div>
            </Link>

            {/* Individual/B2C */}
            <Link 
              to="/programs" 
              className="group relative flex-1 rounded-[4rem] overflow-hidden bg-brand-purple flex flex-col justify-end p-16 transition-all duration-700 hover:flex-[1.2]"
            >
              <div className="absolute inset-0 opacity-60 group-hover:scale-110 transition-transform duration-[3s]">
                <img src="/activities/rope_flow_premium.png" className="w-full h-full object-cover" alt="Individual" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
              </div>
              <div className="relative z-10 text-right md:text-left">
                <h3 className="text-5xl font-black text-white mb-6 uppercase italic tracking-tighter leading-none">B2C <br />Programs.</h3>
                <p className="text-white/70 font-medium text-lg mb-10 max-w-sm">Discover thousands of weekly sessions and earn points as you move.</p>
                <div className="pill-button bg-white/10 text-white backdrop-blur-md w-fit ml-auto md:ml-0 group-hover:bg-brand-turquoise transition-colors">
                  Explore Hub
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Feed: Universal Cards Carousel */}
      <section className="py-40 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 italic tracking-tighter mb-4">LIVE FEED.</h2>
              <p className="text-xl text-slate-400 font-medium">Real-time sessions happening now in Metro Manila.</p>
            </div>
            <Link to="/programs" className="pill-button bg-slate-900 text-white hover:bg-brand-turquoise px-10 py-5 text-sm uppercase flex items-center gap-3">
              View Marketplace <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
        
        <div className="flex gap-10 px-8 md:px-24 overflow-x-auto no-scrollbar scroll-smooth pb-12 relative z-10">
          {B2C_PROGRAMS.map((item) => (
            <div key={item.id} className="min-w-[400px]">
              <UniversalCard 
                title={item.title}
                category={item.category}
                points={item.points}
                duration="45 mins"
                image={item.image}
              />
            </div>
          ))}
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
      </section>
    </div>
  );
};

export default Home;
