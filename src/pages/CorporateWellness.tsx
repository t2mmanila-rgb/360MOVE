import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, BarChart3, TrendingUp, CheckCircle2, ArrowRight, Download, Sparkles, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CorporateWellness: React.FC = () => {
  const navigate = useNavigate();
  const metrics = [
    { value: '25%', label: 'Reduction in Sick Days', icon: ShieldCheck, color: 'brand-teal' },
    { value: '15%', label: 'Boost in Productivity', icon: BarChart3, color: 'brand-royalblue' },
    { value: '3x', label: 'ROI on Wellness Spend', icon: TrendingUp, color: 'brand-purple' },
  ];

  const journeySteps = [
    { title: 'Audit', desc: 'Baseline health & engagement assessment involving key stakeholders.' },
    { title: 'Design', desc: 'Customized 12-week roadmap tailored to your organizational goals.' },
    { title: 'Execute', desc: 'Workshops, on-site classes, and digital mental health tools.' },
    { title: 'Review', desc: 'Comprehensive post-journey analytics and ROI performance report.' },
  ];

  return (
    <div className="bg-white min-h-screen pt-40 pb-56 selection:bg-brand-teal/20">
      <div className="fixed inset-0 noise-bg opacity-[0.02] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-teal/5 rounded-full blur-[150px] -z-10 animate-pulse-slow" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-900/5 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-10 border border-slate-900/10"
            >
              <Building2 className="w-3.5 h-3.5 mr-2" />
              Corporate Excellence
            </motion.div>
            <h1 className="text-6xl md:text-[8rem] font-black text-slate-900 mb-10 tracking-[-0.04em] leading-[0.85] uppercase">
              Where Wellness <br /><span className="gradient-text tracking-tighter italic">Meets Work.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 font-medium mb-16 leading-relaxed max-w-2xl">
              Building high-performance cultures across Metro Manila through science-backed, 
              scalable physical and mental wellness ecosystems.
            </p>
            <div className="flex flex-wrap gap-8 items-center">
              <button 
                onClick={() => navigate('/proposal')}
                className="pill-button bg-brand-teal text-white hover:bg-brand-royalblue shadow-2xl shadow-brand-teal/30 px-14 py-6 text-lg tracking-tighter"
              >
                REQUEST A PROPOSAL
              </button>
              <button className="flex items-center gap-4 font-black uppercase tracking-widest text-[10px] text-slate-400 hover:text-brand-teal transition-all group">
                <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {metrics.map((m, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-12 rounded-[4rem] border-slate-100 hover:border-brand-teal/30 transition-all duration-700 group hover:shadow-2xl hover:shadow-brand-teal/10"
              >
                <div className={`w-20 h-20 rounded-[2rem] bg-${m.color}/10 flex items-center justify-center mb-10 transition-transform group-hover:scale-110 group-hover:rotate-6 duration-500`}>
                  <m.icon className={`w-10 h-10 text-${m.color}`} />
                </div>
                <h3 className="text-6xl font-black text-slate-900 mb-4 tracking-tighter leading-none">{m.value}</h3>
                <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">{m.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Journey */}
      <section className="py-48 overflow-hidden bg-slate-50 relative">
        <div className="absolute inset-0 noise-bg opacity-[0.01]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-32 items-center">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 mb-8">
                <div className="h-px w-12 bg-brand-teal" />
                <span className="text-brand-teal font-black uppercase tracking-[0.3em] text-[10px]">The Implementation</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-12 tracking-[-0.03em] leading-[0.9] uppercase italic">
                Full-Circle <br />12-Week Roadmap.
              </h2>
              <p className="text-xl text-slate-400 font-medium mb-16 leading-relaxed">
                A data-driven, scalable framework designed to move the needle on employee engagement, 
                physical vitality, and organizational resilience.
              </p>
              
              <div className="space-y-12">
                {journeySteps.map((step, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="flex gap-10 group"
                  >
                    <div className="shrink-0 w-16 h-16 rounded-[2rem] bg-white border border-slate-100 flex items-center justify-center text-xl font-black text-slate-300 group-hover:border-brand-teal group-hover:text-brand-teal transition-all shadow-lg shadow-slate-200/50 group-hover:scale-110">
                      0{i + 1}
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-900 mb-3 tracking-tighter uppercase italic">{step.title}</h4>
                      <p className="text-slate-400 font-medium max-w-sm">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative z-10 p-4 bg-white rounded-[5rem] shadow-2xl border border-slate-100"
              >
                <img 
                  src="/logos/Corporate Challenge banner.png" 
                  className="w-full h-auto rounded-[4rem]" 
                  alt="Corporate Wellness Journey" 
                />
              </motion.div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-brand-teal/10 rounded-full blur-[80px]" />
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-brand-purple/10 rounded-full blur-[80px]" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Dark Section */}
      <section className="py-48 px-6">
        <div className="max-w-7xl mx-auto rounded-[5rem] bg-slate-900 p-24 relative overflow-hidden text-center md:text-left">
          <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-brand-teal/5 rounded-full blur-[200px] pointer-events-none" />
          
          <header className="flex flex-col md:flex-row items-end justify-between gap-12 mb-32 relative z-10">
            <div className="max-w-2xl text-left">
              <h2 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none uppercase italic">The Service <br /> <span className="text-brand-teal">Ecosystem.</span></h2>
              <p className="text-xl text-slate-400 font-medium">Modular solutions designed for the modern, hybrid workforce.</p>
            </div>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10 text-left">
            {[
              { title: 'Executive Retreats', desc: 'Off-site deep dives into high-performance leadership, mental focus, and stress resilience.', color: 'brand-turquoise' },
              { title: 'Hybrid Vitality', desc: 'Weekly world-class classes (Yoga, HIIT, Breathwork) delivered on-site or via our secure portal.', color: 'brand-teal' },
              { title: 'Mental Wellbeing', desc: 'Clinical-grade stress management workshops and 1-on-1 counseling for HR and leadership teams.', color: 'brand-purple' }
            ].map((s, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className="p-12 rounded-[4rem] bg-white/5 border border-white/10 transition-all duration-700 hover:bg-white/[0.08] hover:border-brand-teal/40 group h-full flex flex-col"
              >
                <div className={`w-16 h-16 rounded-[1.5rem] bg-${s.color}/10 border border-${s.color}/20 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform`}>
                  <CheckCircle2 className={`w-8 h-8 text-${s.color}`} />
                </div>
                <h4 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter italic">{s.title}.</h4>
                <p className="text-slate-400 font-medium mb-12 leading-relaxed flex-grow">{s.desc}</p>
                <button className="flex items-center gap-4 text-brand-teal font-black uppercase tracking-widest text-[10px] group-hover:gap-6 transition-all mt-auto">
                  EXPLORE MODULE <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-24 text-center px-6">
        <div className="max-w-3xl mx-auto">
          <Sparkles className="w-12 h-12 text-brand-teal mx-auto mb-10" />
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-10 tracking-tighter uppercase leading-none">Elevate Your <br />Team's Baseline.</h2>
          <p className="text-xl text-slate-400 font-medium mb-16">
            Join Metro Manila's leading companies. Start your 360° corporate wellness journey today.
          </p>
          <button 
            onClick={() => navigate('/proposal')}
            className="pill-button bg-slate-900 text-white hover:bg-brand-teal px-16 py-7 text-xl italic tracking-tighter shadow-2xl hover:shadow-brand-teal/40 transition-all"
          >
            REQUEST A PROPOSAL
          </button>
        </div>
      </section>
    </div>
  );
};

export default CorporateWellness;
