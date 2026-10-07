import React from 'react';
import { Calendar, RefreshCw, Heart, Sparkles } from 'lucide-react';
import { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
  onResetData: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onResetData }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">CampusPulse</span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              The modern college event management platform designed for student councils, academic departments, cultural clubs, and athletic teams to create, discover, and organize memorable campus experiences.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              <span>Active Semester 2026 · College Campus System</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('events')} className="hover:text-white transition-colors">
                  Upcoming Events
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('create-event')} className="hover:text-white transition-colors">
                  Host an Event
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('my-registrations')} className="hover:text-white transition-colors">
                  My Registrations & Tickets
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
                  Student Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Categories & Actions */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase mb-3">Campus Categories</h4>
            <div className="flex flex-wrap gap-1.5 text-xs text-slate-300 mb-6">
              <span className="bg-slate-800 px-2.5 py-1 rounded text-slate-300">Technology</span>
              <span className="bg-slate-800 px-2.5 py-1 rounded text-slate-300">Cultural & Arts</span>
              <span className="bg-slate-800 px-2.5 py-1 rounded text-slate-300">Sports Meets</span>
              <span className="bg-slate-800 px-2.5 py-1 rounded text-slate-300">Hands-on Workshops</span>
              <span className="bg-slate-800 px-2.5 py-1 rounded text-slate-300">Academic Colloquium</span>
            </div>

            <button
              onClick={onResetData}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
              title="Reset all sample events and registrations to default demo state"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 CampusPulse Event Management System. Built for College Academic & Cultural Communities.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Designed with clean, modern UI for College Projects</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
