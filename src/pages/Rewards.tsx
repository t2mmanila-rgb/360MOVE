import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Star, Tag, Clock } from 'lucide-react';
import UniversalCard from '../components/UniversalCard';

const Rewards: React.FC = () => {
  const offers = [
    { title: 'Free Wellness Bowl', partner: 'FitKitchen', points: 150, image: '/activities/holistic_nutrition.png', category: 'F&B' },
    { title: '20% Off Recovery Session', partner: 'Focus PH', points: 500, image: '/activities/reiki.png', category: 'Recovery' },
    { title: 'Buy 1 Take 1 Class', partner: '360 Fitness', points: 300, image: '/activities/page.png', category: 'Studio' },
    { title: 'Free Protein Shake', partner: 'Whey King', points: 100, image: '/activities/guided_breathwork.png', category: 'F&B' },
  ];

  return (
    <div className="pt-32 pb-48 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-16">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter">
            Lifestyle <span className="gradient-text">Rewards.</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl">
            Redeem your Move Points for exclusive offers from our premium lifestyle partners. 
            The more you move, the more you earn.
          </p>
        </header>

        {/* Categories Carousel Placeholder */}
        <div className="flex gap-4 mb-16 overflow-x-auto no-scrollbar pb-4">
          {['All Rewards', 'Food & Drink', 'Recovery', 'Apparel', 'Studios'].map((cat, i) => (
            <button key={i} className={`px-8 py-3 rounded-full text-sm font-black whitespace-nowrap transition-all ${i === 0 ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {offers.map((offer, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <UniversalCard 
                title={offer.title}
                category={offer.partner}
                points={offer.points}
                duration="limited time"
                image={offer.image}
                ctaText="Redeem Points"
              />
            </motion.div>
          ))}
        </div>

        {/* Partner CTA */}
        <section className="mt-32 p-12 md:p-24 bg-slate-900 rounded-[3rem] text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/20 rounded-full blur-[100px]" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center text-left">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter italic">Partner with <span className="text-brand-turquoise">360MOVE.</span></h2>
              <p className="text-lg text-slate-400 font-medium mb-12">
                Join our premium ecosystem and connect your brand with Metro Manila's most active wellness community.
              </p>
              <button className="pill-button bg-brand-turquoise text-slate-900 hover:bg-white shadow-brand-turquoise/20">
                Become a Partner
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[Gift, Star, Tag, Clock].map((Icon, i) => (
                <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center text-center">
                  <Icon className="w-8 h-8 text-brand-purple mb-4" />
                  <div className="text-xs font-black uppercase tracking-widest text-slate-500">Feature {i+1}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Rewards;
