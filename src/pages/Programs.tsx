import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import UniversalCard from '../components/UniversalCard';
import { useActivity } from '../lib/useActivity';

const Programs: React.FC = () => {
  const { programs: B2CConfig } = useActivity();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Physical', 'Mindfulness', 'Nutrition', 'Dance', 'Corporate Wellness'];

  const filteredPrograms = B2CConfig.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-40 pb-56 bg-white min-h-screen">
      <div className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-b from-brand-turquoise/5 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <header className="mb-24 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-purple/10 text-brand-purple text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-brand-purple/20"
            >
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              Premium Marketplace
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-none italic uppercase">
              The <span className="gradient-text">Movement</span> Catalog.
            </h1>
            <p className="text-xl text-slate-400 font-medium leading-relaxed">
              Curated by experts. Verified by science. Structured for your high-performance life. 
              Find your next level in Metro Manila.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Live Status</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-brand-turquoise rounded-full animate-pulse" />
              <span className="text-slate-900 font-black italic">{B2CConfig.length} Active Sessions</span>
            </div>
          </div>
        </header>

        {/* Filters & Controls */}
        <div className="sticky top-24 z-40 mb-20 px-4 md:px-8 py-4 glass rounded-[3rem] shadow-2xl shadow-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-brand-turquoise/30 transition-all">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${
                  activeCategory === cat 
                    ? 'bg-slate-900 text-white shadow-xl shadow-black/20 scale-105' 
                    : 'bg-white text-slate-400 hover:text-slate-600 border border-slate-100 hover:border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-80 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-brand-turquoise transition-colors" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search programs, categories, or keywords..." 
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-transparent rounded-[1.5rem] text-sm font-bold focus:ring-2 focus:ring-brand-turquoise focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12"
        >
          <AnimatePresence mode='popLayout'>
            {filteredPrograms.map((program, i) => (
              <motion.div
                layout
                key={program.id || program.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <UniversalCard 
                  title={program.title}
                  category={program.category}
                  points={program.points}
                  duration={program.duration}
                  maxPax={program.pax}
                  image={program.image}
                  ctaText="Secure Spot"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredPrograms.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-48 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-100"
          >
            <div className="w-20 h-20 bg-slate-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">No Move Found.</h3>
            <p className="text-slate-400 font-medium text-lg">Try broadening your horizons or searching for something else.</p>
            <button 
              onClick={() => {setActiveCategory('All'); setSearchQuery('');}}
              className="mt-10 pill-button bg-brand-turquoise text-white"
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Programs;
