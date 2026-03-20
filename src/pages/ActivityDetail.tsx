import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, MapPin, Star, ArrowLeft, Share2, Heart, Zap, ShieldCheck, Sparkles, User } from 'lucide-react';
import { B2C_PROGRAMS, B2B_PASSPORT_BRANDS, MOCK_SCHEDULE } from '../data/activities';
import type { Activity, PassportBrand } from '../data/activities';

const ActivityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find the actual program from our data, or fallback to mock
  const activity = useMemo(() => {
    // Search in all collections
    const allActivities = [...B2C_PROGRAMS, ...B2B_PASSPORT_BRANDS, ...MOCK_SCHEDULE];
    const found = allActivities.find(p => p.id === id || ('title' in p && (p as Activity).title?.toLowerCase().replace(/\s+/g, '-') === id) || ('name' in p && (p as PassportBrand).name?.toLowerCase().replace(/\s+/g, '-') === id));
    
    if (found) {
      const isBrand = 'booth' in found;
      return {
        title: ('title' in found ? (found as Activity).title : (found as PassportBrand).name),
        category: found.category,
        points: (found as any).points || 1,
        duration: ('duration' in found ? (found as Activity).duration : 'Visit Booth'),
        location: (found as any).location || (found as any).booth || 'Fitstreet BGC',
        instructor: (found as any).instructor || (isBrand ? 'Brand Ambassador' : 'Coach Fai'),
        description: found.description,
        image: (found as any).image || (found as any).logo || '/activities/rope_flow_premium.png',
        isPaid: (found as any).isPaid ?? false
      };
    }
    
    // Fallback mock
    return {
      title: id?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Activity Detail',
      category: 'Lifestyle',
      points: 25,
      duration: '60 min',
      location: 'BGC Amphitheater',
      instructor: 'Coach Fai',
      description: 'Experience a transformative journey that combines physical movement with mindfulness. This session is designed for all levels and focuses on elevating your 360° wellbeing.',
      image: '/activities/rope_flow_premium.png',
      isPaid: false
    };
  }, [id]);

  return (
    <div className="bg-white min-h-screen pt-40 pb-56 selection:bg-brand-purple/20">
      <div className="fixed inset-0 noise-bg opacity-[0.02] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Navigation */}
        <header className="mb-16 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-3 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-brand-purple transition-all group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
            Go Back
          </button>
          <div className="flex gap-6">
            <button className="w-12 h-12 rounded-full glass border-slate-100 flex items-center justify-center hover:text-brand-pink transition-all">
              <Heart className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 rounded-full glass border-slate-100 flex items-center justify-center hover:text-brand-turquoise transition-all">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-24">
          {/* Main Visual & Details */}
          <div className="lg:w-[65%]">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-[16/9] rounded-[4rem] overflow-hidden shadow-2xl border border-slate-100 mb-16"
            >
              <img src={activity.image} className="w-full h-full object-cover" alt={activity.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              <div className="absolute bottom-12 left-12 flex gap-4">
                <div className="px-6 py-2 rounded-full glass border-white/40 shadow-2xl flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-turquoise fill-brand-turquoise" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{activity.category}</span>
                </div>
              </div>
            </motion.div>

            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-8">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-brand-purple text-brand-purple shadow-sm" />
                ))}
                <span className="text-xs font-bold text-slate-400 ml-2">4.9 (124 Verified Reviews)</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-10 tracking-[-0.04em] leading-[0.85] uppercase italic">
                {activity.title}.
              </h1>

              <div className="prose prose-xl prose-slate max-w-none mb-20 text-slate-500 font-medium leading-relaxed italic">
                "{activity.description}"
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-slate-100 pt-16">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-brand-turquoise/10 flex items-center justify-center shrink-0">
                    <User className="w-8 h-8 text-brand-teal" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-1 uppercase tracking-tighter italic">Trainer</h4>
                    <p className="text-slate-500 font-medium">{activity.instructor || 'Lead Performance Coach'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-brand-purple/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-8 h-8 text-brand-purple" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-1 uppercase tracking-tighter italic">Preparation</h4>
                    <p className="text-slate-500 font-medium">Hydration, yoga mat, and comfortable attire required.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Module */}
          <aside className="lg:w-[35%]">
            <div className="sticky top-40 glass p-12 rounded-[4rem] border-slate-100 shadow-2xl">
              <div className="flex items-center justify-between mb-12 pb-8 border-b border-slate-100">
                <div className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
                  {activity.isPaid ? '₱850.00' : 'FREE'}
                </div>
                <div className="px-5 py-2 rounded-full bg-brand-purple/10 text-brand-purple text-[10px] font-black uppercase tracking-widest">
                  {activity.isPaid ? 'Single Session' : 'Access Included'}
                </div>
              </div>

              <div className="space-y-8 mb-16">
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                    <Clock className="w-5 h-5 text-brand-turquoise" />
                    Duration
                  </div>
                  <div className="font-black text-slate-900 uppercase italic">{activity.duration}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                    <Zap className="w-5 h-5 text-brand-purple" />
                    Reward
                  </div>
                  <div className="font-black text-slate-900 uppercase italic">+{activity.points} Points</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                    <MapPin className="w-5 h-5 text-brand-teal" />
                    Location
                  </div>
                  <div className="font-black text-slate-900 uppercase italic tracking-tighter">{activity.location || 'BGC'}</div>
                </div>
              </div>

              <div className="space-y-6">
                <button 
                  onClick={() => navigate('/proposal')}
                  className="pill-button w-full bg-slate-900 text-white hover:bg-brand-purple py-7 text-xl italic tracking-tighter shadow-2xl hover:shadow-brand-purple/40 transition-all font-black"
                >
                  SECURE YOUR SPOT
                </button>
                <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] leading-relaxed">
                  Join 2,400+ members moving toward <br />their high-performance life.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;
