import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, ArrowRight, Zap } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UniversalCardProps {
  image: string;
  title: string;
  category: string;
  points?: number;
  duration?: string;
  maxPax?: number;
  ctaText?: string;
  onClick?: () => void;
  variant?: 'light' | 'dark';
}

const UniversalCard: React.FC<UniversalCardProps> = ({
  image,
  title,
  category,
  points,
  duration,
  maxPax,
  ctaText = 'Learn More',
  onClick,
  variant = 'light'
}) => {
  return (
    <motion.div 
      whileHover={{ y: -12 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group rounded-[3rem] p-8 border transition-all duration-700 card-shine h-full flex flex-col relative",
        variant === 'light' 
          ? "bg-white border-slate-100 hover:border-brand-turquoise/50 shadow-2xl shadow-slate-200/50 hover:shadow-brand-turquoise/20" 
          : "bg-slate-900 border-white/5 hover:border-fs-cyan/50 text-white shadow-2xl hover:shadow-fs-cyan/20"
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 noise-bg opacity-[0.02] pointer-events-none rounded-[inherit]" />
      
      <div className="aspect-[16/10] rounded-[2rem] overflow-hidden mb-10 relative shadow-xl">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {points && (
          <div className="absolute top-5 right-5 glass px-5 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-white/40">
            <Zap className="w-3.5 h-3.5 text-brand-teal fill-brand-teal" />
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{points} Points</span>
          </div>
        )}
      </div>

      <div className="flex-grow px-2">
        <div className="flex items-center gap-3 mb-6">
          <span className={cn(
            "text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border",
            variant === 'light' 
              ? `bg-brand-turquoise/10 text-brand-teal border-brand-turquoise/20` 
              : `bg-fs-cyan/10 text-fs-cyan border-fs-cyan/20`
          )}>
            {category}
          </span>
          {duration && (
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Clock className="w-4 h-4" />
              {duration}
            </div>
          )}
        </div>

        <h3 className={cn(
          "text-3xl font-black mb-6 leading-[1.1] tracking-tighter italic transition-colors font-heading",
          variant === 'light' ? "text-slate-900" : "text-white group-hover:text-fs-cyan"
        )}>
          {title}
        </h3>
      </div>

      <div className="mt-auto pt-8 flex items-center justify-between border-t border-slate-100/50 group-hover:border-brand-turquoise/20 transition-colors px-2">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {maxPax ? (
            <>
              <Users className="w-4 h-4" />
              Mind. {maxPax} Pax
            </>
          ) : (
            <span className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-fs-orange" /> Expert Led</span>
          )}
        </div>
        <button className={cn(
          "flex items-center gap-2 font-black uppercase tracking-widest text-[10px] transition-all group/btn",
          variant === 'light' ? "text-brand-purple hover:gap-4" : "text-fs-cyan hover:gap-4"
        )}>
          {ctaText}
          <ArrowRight className="w-4 h-4 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

export default UniversalCard;
