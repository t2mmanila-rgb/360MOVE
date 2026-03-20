import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white pt-24 pb-12 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-turquoise/5 rounded-full blur-[100px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="space-y-6">
            <Link to="/">
              <img src="/logos/360MOVE Logo.png" alt="360MOVE" className="h-12 w-auto brightness-0 invert" />
            </Link>
            <p className="text-slate-400 font-medium leading-relaxed">
              Elevating the wellness landscape in Metro Manila through structured journeys in movement, mindfulness, and living.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-turquoise hover:border-brand-turquoise transition-all group">
                  <Icon className="w-5 h-5 text-slate-400 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Individual Col */}
          <div className="space-y-6">
            <h4 className="text-lg font-black uppercase tracking-widest text-brand-turquoise">Individuals</h4>
            <ul className="space-y-4">
              <li><Link to="/programs" className="text-slate-400 hover:text-white transition-colors">Class Catalog</Link></li>
              <li><Link to="/events" className="text-slate-400 hover:text-white transition-colors">Event Hub</Link></li>
              <li><Link to="/rewards" className="text-slate-400 hover:text-white transition-colors">Rewards Wallet</Link></li>
              <li><Link to="/my-pass" className="text-slate-400 hover:text-white transition-colors">My Pass</Link></li>
            </ul>
          </div>

          {/* Corporate Col */}
          <div className="space-y-6">
            <h4 className="text-lg font-black uppercase tracking-widest text-brand-purple">Corporate</h4>
            <ul className="space-y-4">
              <li><Link to="/programs/corporate" className="text-slate-400 hover:text-white transition-colors">Wellness Audit</Link></li>
              <li><Link to="/programs/corporate" className="text-slate-400 hover:text-white transition-colors">12-Week Journey</Link></li>
              <li><Link to="/programs/corporate" className="text-slate-400 hover:text-white transition-colors">Executive Retreats</Link></li>
              <li><Link to="/programs/corporate" className="text-slate-400 hover:text-white transition-colors">Request Proposal</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-6">
            <h4 className="text-lg font-black uppercase tracking-widest text-brand-royalblue">Connect</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-400">
                <Mail className="w-5 h-5 text-brand-turquoise" />
                <span>hello@360move.live</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Phone className="w-5 h-5 text-brand-purple" />
                <span>+63 917 123 4567</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <MapPin className="w-5 h-5 text-brand-royalblue shrink-0" />
                <span>Bonifacio Global City, Metro Manila, Philippines</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
          <p>© 2026 360MOVE. Part of the 360 Health & Wellness Festival.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
