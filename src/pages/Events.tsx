import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Trophy, Sparkles, Zap, Play } from 'lucide-react';
import UniversalCard from '../components/UniversalCard';
import { useNavigate, Link } from 'react-router-dom';

const Events: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('flagship');

  const tabs = [
    { id: 'flagship', label: 'Flagship Events', icon: Trophy },
    { id: 'pocket', label: 'Pocket Sessions', icon: Calendar },
    { id: 'challenges', label: 'Global Challenges', icon: Zap },
  ];

  const flagshipEvents = [
    { 
      title: 'Fitstreet Heatwave 2026', 
      category: 'Festival', 
      points: 500, 
      date: 'Aug 15-16, 2026',
      location: 'Bonifacio High Street',
      img: '/logos/Viking Games Banner - Fitstreet 2026.png',
      link: '/events/fitstreet-2026'
    },
    { 
      title: 'Corporate Wellness Cup', 
      category: 'B2B Elite', 
      points: 1000, 
      date: 'Oct 20, 2026',
      location: 'TGF Greenfield District',
      img: '/logos/Corporate Challenge banner.png',
      link: '/corporate'
    },
  ];

  const pocketEvents = [
    { title: 'Full Moon Sound Bath', category: 'Mindfulness', points: 50, date: 'May 14', location: 'BGC Amphitheater', img: '/activities/DLB_SoundBath.png' },
    { title: 'Animal Flow Workshop', category: 'Physical', points: 40, date: 'May 22', location: 'Central Park BGC', img: '/activities/DLB_SoundBath2.png' },
    { title: 'Holistic Cooking Demo', category: 'Nutrition', points: 30, date: 'June 05', location: 'Discovery Primea', img: '/activities/holistic_nutrition.png' },
  ];

  const challenges = [
    { title: '100k Step Week', category: 'Physical', points: 200, date: 'Weekly', location: 'App-Based', img: '/activities/rope_flow_premium.png' },
    { title: '30 Days of Zen', category: 'Mindfulness', points: 300, date: 'Monthly', location: 'App-Based', img: '/activities/guided_breathwork.png' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'flagship':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {flagshipEvents.map((event, i) => (
              <motion.div 
                key={event.title} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative group"
              >
                <UniversalCard 
                  title={event.title}
                  category={event.category}
                  points={event.points}
                  duration={event.date}
                  image={event.img}
                  ctaText="Secure Access"
                />
                <Link to={event.link} className="absolute inset-0 z-20" aria-label={`View ${event.title}`} />
              </motion.div>
            ))}
          </div>
        );
      case 'pocket':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {pocketEvents.map((event, i) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <UniversalCard 
                  title={event.title}
                  category={event.category}
                  points={event.points}
                  duration={event.date}
                  image={event.img}
                  ctaText="Learn More"
                />
              </motion.div>
            ))}
          </div>
        );
      case 'challenges':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {challenges.map((event, i) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <UniversalCard 
                  variant="dark"
                  title={event.title}
                  category={event.category}
                  points={event.points}
                  duration={event.date}
                  image={event.img}
                  ctaText="Join Challenge"
                />
              </motion.div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pt-40 pb-56 bg-white min-h-screen selection:bg-brand-turquoise/30">
      <div className="fixed inset-0 noise-bg opacity-[0.02] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 text-center md:text-left">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-turquoise/10 text-brand-teal text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-brand-turquoise/20"
            >
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              Event Marketplace
            </motion.div>
            <h1 className="text-6xl md:text-[8rem] font-black text-slate-900 mb-8 tracking-[-0.04em] leading-[0.85] uppercase">
              The Event <span className="gradient-text tracking-tighter italic">Hub.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed">
              From city-wide festivals to intimate community sessions. 
              Find your tribe and earn points in Metro Manila's high-performance ecosystem.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Total Reach</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-brand-purple rounded-full animate-pulse" />
              <span className="text-slate-900 font-black italic">42,000+ Participants</span>
            </div>
          </div>
        </header>

        {/* Custom Tabs */}
        <div className="sticky top-24 z-40 mb-20 px-4 md:px-8 py-4 glass rounded-[3rem] shadow-2xl shadow-slate-200/50 flex flex-wrap items-center gap-4 w-fit mx-auto md:mx-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-slate-900 text-white shadow-xl shadow-black/20 scale-105' 
                  : 'bg-white text-slate-400 hover:text-slate-600 border border-slate-100 hover:border-slate-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>

        {/* Host Section CTA */}
        <section className="mt-48 relative group">
          <div className="absolute inset-0 bg-brand-turquoise rounded-[5rem] rotate-1 scale-[1.02] group-hover:rotate-0 transition-transform duration-700 opacity-20 -z-10" />
          <div className="p-16 md:p-32 bg-slate-900 rounded-[5rem] text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-brand-turquoise rounded-full blur-[200px]" />
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="w-20 h-20 bg-brand-turquoise/10 rounded-[2rem] flex items-center justify-center mx-auto mb-12">
                <Play className="w-10 h-10 text-brand-turquoise fill-brand-turquoise" />
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white mb-10 tracking-[-0.03em] leading-none uppercase italic">
                Hosting an <span className="text-brand-turquoise">Event?</span>
              </h2>
              <p className="text-xl md:text-2xl text-slate-400 font-medium mb-16 leading-relaxed">
                Partner with 360MOVE to amplify your wellness workshop or major event. 
                We provide the platform, the community, and the tech.
              </p>
              <button 
                onClick={() => navigate('/proposal')}
                className="pill-button bg-brand-turquoise text-slate-900 hover:bg-white px-16 py-7 text-xl italic font-black"
              >
                Become a Partner
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Events;
