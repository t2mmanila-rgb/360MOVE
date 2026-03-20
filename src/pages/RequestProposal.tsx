import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, FileText, Users, Building2, MessageSquare } from 'lucide-react';

const RequestProposal: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to Google Apps Script
    setTimeout(() => setSubmitted(true), 1000);
  };

  if (submitted) {
    return (
      <div className="pt-48 pb-48 min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full mx-4 bg-white p-12 rounded-[3rem] shadow-2xl text-center border border-slate-100"
        >
          <div className="w-20 h-20 bg-brand-teal/10 rounded-3xl flex items-center justify-center mb-8 mx-auto">
            <CheckCircle2 className="w-10 h-10 text-brand-teal" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-6">Proposal Received.</h2>
          <p className="text-lg text-slate-500 font-medium mb-12">
            Our wellness consultants have received your request. We'll reach out within 24 hours to schedule your initial Audit.
          </p>
          <button onClick={() => setSubmitted(false)} className="pill-button bg-slate-900 text-white w-full">
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-48 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter">
            Request a <span className="gradient-text">Proposal.</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
            Ready to transform your organization's culture? Fill out the form below and we'll design a custom wellness journey for your team.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 md:p-16 rounded-[4.5rem] shadow-2xl border border-slate-100 space-y-12">
          {/* Organization Info */}
          <div className="space-y-8">
            <h3 className="text-2xl font-black flex items-center gap-4 text-slate-900">
              <Building2 className="w-6 h-6 text-brand-teal" />
              Organization Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Organization Name</label>
                <input required type="text" placeholder="e.g. Acme Corp" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-brand-teal transition-all" />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Industry</label>
                <select className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-brand-teal appearance-none transition-all">
                  <option>Technology</option>
                  <option>Finance</option>
                  <option>Creative/Ad</option>
                  <option>Healthcare</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Scope */}
          <div className="space-y-8 pt-8 border-t border-slate-50">
            <h3 className="text-2xl font-black flex items-center gap-4 text-slate-900">
              <Users className="w-6 h-6 text-brand-purple" />
              Team Size & Scope
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Number of Employees</label>
                <select className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-brand-purple appearance-none transition-all">
                  <option>20-50</option>
                  <option>51-150</option>
                  <option>151-500</option>
                  <option>500+</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Primary Wellness Goal</label>
                <select className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-brand-purple appearance-none transition-all">
                  <option>Productivity Boost</option>
                  <option>Employee Retention</option>
                  <option>Health & Vitality</option>
                  <option>Mental Health Focus</option>
                </select>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-8 pt-8 border-t border-slate-50">
            <h3 className="text-2xl font-black flex items-center gap-4 text-slate-900">
              <MessageSquare className="w-6 h-6 text-brand-royalblue" />
              Additional Details
            </h3>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Message (Optional)</label>
              <textarea rows={4} placeholder="Tell us about your team's specific needs..." className="w-full px-6 py-6 bg-slate-50 border-none rounded-3xl font-bold focus:ring-2 focus:ring-brand-royalblue transition-all resize-none"></textarea>
            </div>
          </div>

          <div className="pt-8">
            <button type="submit" className="pill-button w-full bg-brand-teal text-white shadow-2xl shadow-brand-teal/20 hover:bg-slate-900 py-6 text-xl">
              Submit Request <Send className="w-5 h-5 ml-2" />
            </button>
            <p className="mt-6 text-center text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              You'll also receive our 2026 Wellness Catalog
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestProposal;
