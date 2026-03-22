import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, MapPin, User, Home, Grid, Calendar, Award, Zap, Sparkles, Globe } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [genericUser, setGenericUser] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('user_profile');
    if (saved) setUserProfile(JSON.parse(saved));
    
    const savedGeneric = localStorage.getItem('generic_user_profile');
    if (savedGeneric) setGenericUser(JSON.parse(savedGeneric));
    
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_profile');
    localStorage.removeItem('generic_user_profile');
    localStorage.removeItem('is_generic_logged_in');
    localStorage.removeItem('is_fitstreet_logged_in');
    // Clear admin auth too if desired, but user mainly wants profile testing
    window.location.href = '/';
  };

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Programs', href: '/programs', icon: Grid },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Move', href: '#', icon: Zap, comingSoon: true },
    { name: 'Mind', href: '#', icon: Sparkles, comingSoon: true },
    { name: 'Live', href: '#', icon: Globe, comingSoon: true },
    { name: 'Rewards', href: '/rewards', icon: Award },
  ];

  const mobileLinks = userProfile 
    ? [
        { name: 'Home', href: '/my-pass', icon: Home },
        { name: 'Programs', href: '/programs', icon: Grid },
        { name: 'Passport', href: '/my-pass', icon: Calendar },
        { name: 'My Pass', href: '/my-pass', icon: User },
      ]
    : [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Programs', href: '/programs', icon: Grid },
        { name: 'Events', href: '/events', icon: Calendar },
        { name: 'Register', href: '/register', icon: User },
      ];

  return (
    <>
      {/* Desktop Header */}
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-24 flex items-center",
          isScrolled ? "bg-slate-900/95 backdrop-blur-xl shadow-2xl h-20" : "bg-slate-900"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 group">
            <img 
              src="/logos/360MOVE Logo.png" 
              alt="360MOVE" 
              className="h-12 md:h-16 w-auto transition-transform group-hover:scale-105" 
            />
            {userProfile && (
              <img 
                src="/logos/Fitstreet Logo simple.png" 
                alt="Fitstreet" 
                className="h-12 md:h-16 w-auto transition-transform" 
              />
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => (
              link.comingSoon ? (
                <div key={link.name} className="relative group/link cursor-not-allowed">
                  <span className="text-sm font-bold text-slate-500 transition-all">
                    {link.name}
                  </span>
                  <span className="absolute -top-3 -right-6 px-1.5 py-0.5 bg-white/10 text-[6px] font-black uppercase tracking-tighter text-white/40 rounded-sm opacity-0 group-hover/link:opacity-100 transition-opacity">
                    Soon
                  </span>
                </div>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "text-sm font-bold transition-all hover:text-fs-cyan",
                    location.pathname === link.href ? "text-fs-cyan" : "text-white"
                  )}
                >
                  {link.name}
                </Link>
              )
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden xl:flex items-center gap-4">
            <button className="p-2 text-white/60 hover:text-fs-cyan transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-white/60 hover:text-fs-cyan transition-colors">
              <MapPin className="w-5 h-5" />
            </button>
            { (userProfile || genericUser) && (
              <button 
                onClick={handleLogout}
                className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-red-500 transition-colors px-2"
              >
                Log Out
              </button>
            )}
            {location.pathname.includes('/events/fitstreet-2026') ? (
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-onboarding'))}
                className="pill-button bg-fs-orange text-white hover:bg-fs-pink px-6 py-2.5 text-sm font-bold uppercase tracking-widest transition-all shadow-lg shadow-fs-orange/20"
              >
                Register
              </button>
            ) : (
              <Link 
                to={genericUser ? "/dashboard" : "/register"} 
                className="pill-button bg-brand-purple text-white hover:bg-brand-royalblue px-6 py-1.5 flex flex-col items-center justify-center leading-tight transition-all"
              >
                <span className="font-bold text-sm tracking-wide">{genericUser ? "Dashboard" : "Let's Move!"}</span>
                {!genericUser && <span className="text-[9px] font-medium opacity-80 uppercase tracking-widest mt-0.5">Sign up today.</span>}
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="xl:hidden p-2 text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer (Desktop Header fallback) */}
      {isOpen && (
        <div className="fixed inset-0 z-40 xl:hidden bg-white/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="pt-24 px-6 flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="text-2xl font-black text-slate-900 border-b border-slate-100 pb-4"
              >
                {link.name}
              </Link>
            ))}
            {(userProfile || genericUser) && (
              <button 
                onClick={handleLogout}
                className="text-2xl font-black text-red-500 text-left border-b border-slate-100 pb-4"
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Bar */}
      <nav className={cn(
        "xl:hidden fixed bottom-12 left-6 right-6 z-50 glass border-t border-slate-100 flex items-center justify-between pb-safe rounded-3xl p-4 shadow-2xl transition-all duration-300",
        (location.pathname === '/my-pass' || location.pathname.includes('/events/fitstreet-2026')) && "opacity-0 pointer-events-none scale-95"
      )}>
        {mobileLinks.map((link) => (
          <Link
            key={link.name}
            to={link.href}
            className={cn(
              "flex flex-col items-center gap-1 min-w-[64px]",
              location.pathname === link.href ? "text-brand-purple" : "text-slate-400"
            )}
          >
            <link.icon className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{link.name}</span>
          </Link>
        ))}
      </nav>
    </>
  );
};

export default Navbar;
