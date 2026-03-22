import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, MapPin, Star, ArrowLeft, Share2, Heart, Zap, ShieldCheck, Sparkles, User } from 'lucide-react';
import { useActivity } from '../lib/useActivity';

const ActivityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { schedule, programs, brands } = useActivity();

  // Find the actual program from our merged record
  const activity = React.useMemo(() => {
    // Search in all data sources
    const allActivities = [...schedule, ...programs];
    const brandMatch = brands?.find(b => b.id === id);
    
    // Convert brand to activity-like object if matched
    if (brandMatch) {
      return {
        title: brandMatch.name,
        category: brandMatch.category,
        points: brandMatch.points || 1,
        duration: 'Boots Visit',
        location: brandMatch.booth,
        instructor: 'Brand Representative',
        description: brandMatch.description,
        extendedDescription: brandMatch.extendedDescription,
        mechanics: brandMatch.mechanics,
        image: brandMatch.logo || '/activities/rope_flow_premium.png',
        isPaid: false
      };
    }

    const found = allActivities.find(p => 
      p.id === id || 
      p.title?.toLowerCase().replace(/\s+/g, '-') === id
    );
    
    if (found) {
      return {
        ...found,
        title: found.title,
        category: found.category,
        points: found.points || 1,
        duration: found.duration || 'Session',
        location: found.location || 'Fitstreet BGC',
        instructor: found.instructor || 'Lead Performance Coach',
        description: found.description,
        extendedDescription: found.extendedDescription,
        mechanics: (found as any).mechanics,
        image: found.image || '/activities/rope_flow_premium.png',
        isPaid: found.isPaid ?? false
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
      description: 'Experience a transformative journey.',
      extendedDescription: '',
      mechanics: '',
      image: '/activities/rope_flow_premium.png',
      isPaid: false
    };
  }, [id, schedule, programs]);

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

              <div className="prose prose-xl prose-slate max-w-none mb-10 text-slate-500 font-medium leading-relaxed italic">
                "{activity.description}"
              </div>

              {activity.extendedDescription && (
                <div className="prose prose-lg prose-slate max-w-none mb-10 text-slate-600 font-semibold leading-relaxed border-l-4 border-brand-purple/20 pl-8 py-2">
                  {activity.extendedDescription}
                </div>
              )}

              {activity.mechanics && (
                <div className="bg-slate-900 rounded-[3rem] p-12 mb-20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-turquoise/10 rounded-full blur-[80px] -z-10 group-hover:bg-brand-turquoise/20 transition-all" />
                  <div className="flex items-center gap-4 mb-6">
                    <Zap className="w-6 h-6 text-brand-turquoise fill-brand-turquoise" />
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Challenge Mechanics.</h3>
                  </div>
                  <div className="text-brand-turquoise/80 font-medium leading-relaxed italic text-lg">
                    {activity.mechanics}
                  </div>
                </div>
              )}

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
