import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, QrCode, Gift, User } from 'lucide-react';

const MobileFooter: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] md:hidden px-6 pb-8 pointer-events-none">
      <div className="max-w-md mx-auto relative pointer-events-auto">
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[30px] rounded-[3rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] -z-10" />
        <div className="flex items-center justify-between p-3 relative">
          
          <NavLink 
            to="/" 
            className={({ isActive }) => `flex flex-col items-center gap-1.5 flex-1 py-3 transition-all duration-500 rounded-2xl ${isActive ? 'text-fs-cyan scale-110' : 'text-slate-400 hover:text-white'}`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Home</span>
            <div className="h-1 w-1 rounded-full bg-fs-cyan opacity-0 transition-opacity aria-selected:opacity-100" />
          </NavLink>

          <NavLink 
            to="/events/fitstreet-2026" 
            className={({ isActive }) => `flex flex-col items-center gap-1.5 flex-1 py-3 transition-all duration-500 rounded-2xl ${isActive ? 'text-fs-cyan scale-110' : 'text-slate-400 hover:text-white'}`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Live</span>
          </NavLink>

          <div className="flex-1 flex justify-center -mt-16 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-fs-orange/20 rounded-full blur-2xl animate-pulse -z-10" />
            <button className="w-20 h-20 bg-fs-orange rounded-[2.5rem] flex items-center justify-center shadow-[0_15px_35px_rgba(249,115,22,0.4)] hover:scale-110 active:scale-90 transition-all text-white border-[6px] border-[#0a0f1a] group">
              <QrCode className="w-8 h-8 group-hover:rotate-12 transition-transform" />
            </button>
          </div>

          <NavLink 
            to="/rewards" 
            className={({ isActive }) => `flex flex-col items-center gap-1.5 flex-1 py-3 transition-all duration-500 rounded-2xl ${isActive ? 'text-fs-cyan scale-110' : 'text-slate-400 hover:text-white'}`}
          >
            <Gift className="w-5 h-5" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Win</span>
          </NavLink>

          <NavLink 
            to="/my-pass" 
            className={({ isActive }) => `flex flex-col items-center gap-1.5 flex-1 py-3 transition-all duration-500 rounded-2xl ${isActive ? 'text-fs-cyan scale-110' : 'text-slate-400 hover:text-white'}`}
          >
            <User className="w-5 h-5" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Pass</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default MobileFooter;
