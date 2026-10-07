import React from 'react';
import { 
  Calendar, 
  Search, 
  ArrowRight, 
  Sparkles, 
  Users, 
  MapPin, 
  Ticket, 
  Layers, 
  CheckCircle2, 
  Award,
  Zap
} from 'lucide-react';
import { CollegeEvent, EventCategory, Page } from '../types';
import { EventCard } from '../components/EventCard';

interface HomePageProps {
  events: CollegeEvent[];
  userRegisteredEventIds: string[];
  onNavigate: (page: Page) => void;
  onSelectEvent: (eventId: string) => void;
  onSelectCategoryFilter: (category: EventCategory | 'All') => void;
  onRegisterQuick: (eventId: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  events,
  userRegisteredEventIds,
  onNavigate,
  onSelectEvent,
  onSelectCategoryFilter,
  onRegisterQuick,
  searchQuery,
  setSearchQuery,
}) => {
  const featuredEvents = events.filter(e => e.isFeatured).slice(0, 3);
  const upcomingEvents = events.slice(0, 6);

  const categories: { label: string; cat: EventCategory; color: string; desc: string }[] = [
    { label: 'Technology', cat: 'Technology', color: 'from-blue-500 to-indigo-600', desc: 'Hackathons, coding & AI' },
    { label: 'Cultural & Arts', cat: 'Cultural', color: 'from-rose-500 to-pink-600', desc: 'Music, drama & dance fests' },
    { label: 'Sports', cat: 'Sports', color: 'from-amber-500 to-orange-600', desc: 'Athletics, tournaments & fitness' },
    { label: 'Workshops', cat: 'Workshop', color: 'from-emerald-500 to-teal-600', desc: 'Hands-on skill bootcamps' },
    { label: 'Academic', cat: 'Academic', color: 'from-sky-500 to-cyan-600', desc: 'Colloquiums & paper seminars' },
    { label: 'Social & Clubs', cat: 'Social', color: 'from-purple-500 to-violet-600', desc: 'Mixers, orientations & games' },
  ];

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('events');
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-950 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 rounded-3xl mx-2 sm:mx-6 lg:mx-8 shadow-xl">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Spring & Fall Semester 2026 Campus Lineup</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-balance">
            Discover, Register & Host <span className="bg-gradient-to-r from-indigo-300 via-purple-200 to-pink-300 bg-clip-text text-transparent">College Events</span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The all-in-one event hub for students, campus clubs, and organizers. Explore technical hackathons, cultural fests, sports tournaments, and workshops in one unified place.
          </p>

          {/* Search Box in Hero */}
          <form 
            onSubmit={handleHeroSearch}
            className="max-w-2xl mx-auto bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 border border-white/20"
          >
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by title, keyword, or venue..."
                className="w-full pl-11 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 bg-transparent placeholder-slate-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm shrink-0"
            >
              <span>Find Events</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Category Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 text-xs">Popular categories:</span>
            {categories.slice(0, 4).map((c) => (
              <button
                key={c.cat}
                onClick={() => {
                  onSelectCategoryFilter(c.cat);
                  onNavigate('events');
                }}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors"
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Bottom Stats */}
        <div className="relative max-w-4xl mx-auto mt-12 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-white">
              {events.length}
            </p>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-0.5">Upcoming Events</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-indigo-300">
              1,400+
            </p>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-0.5">Registered Students</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-purple-300">
              18+
            </p>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-0.5">Campus Societies</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-emerald-300">
              100%
            </p>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-0.5">Free Student Access</p>
          </div>
        </div>
      </section>

      {/* Featured Spotlight Section */}
      {featuredEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Must Attend</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Featured Campus Highlights
              </h2>
            </div>
            <button
              onClick={() => onNavigate('events')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              <span>View All ({events.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isRegistered={userRegisteredEventIds.includes(event.id)}
                onViewDetails={onSelectEvent}
                onRegisterQuick={onRegisterQuick}
              />
            ))}
          </div>
        </section>
      )}

      {/* Category Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Browse by Event Category
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Filter activities based on your passion, whether technical skills, artistic stage performances, or athletic contests.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((c) => (
            <button
              key={c.cat}
              onClick={() => {
                onSelectCategoryFilter(c.cat);
                onNavigate('events');
              }}
              className="group p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${c.color} text-white flex items-center justify-center font-bold text-sm mb-3 group-hover:scale-110 transition-transform shadow-xs`}>
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-indigo-600 transition-colors">
                  {c.label}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  {c.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Upcoming Events Catalog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Calendar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Upcoming College Schedule
            </h2>
          </div>
          <button
            onClick={() => onNavigate('events')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <span>Explore All Events</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isRegistered={userRegisteredEventIds.includes(event.id)}
              onViewDetails={onSelectEvent}
              onRegisterQuick={onRegisterQuick}
            />
          ))}
        </div>
      </section>

      {/* How It Works (For College Project Presentation) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">College Project Architecture</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Simple 3-Step Campus Experience
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Designed for effortless adoption across colleges, academic departments, and student clubs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white">
                1
              </div>
              <h4 className="text-base font-bold">1. Discover & Filter</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Browse upcoming college activities by department, category, or date. Search keywords for hackathons, sports, or cultural nights.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center font-bold text-white">
                2
              </div>
              <h4 className="text-base font-bold">2. One-Click Digital Pass</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Register instantly with your student details. Receive a digital ticket pass with unique QR code for seamless venue entry.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white">
                3
              </div>
              <h4 className="text-base font-bold">3. Organize & Track Attendees</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Club heads can publish new events, monitor live registration rosters, check in attendees at the door, and export attendance sheets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Host Event Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold text-slate-900">
              Are you planning a campus event or club workshop?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Publish your schedule in under 2 minutes. Manage participant capacity, track registrations, and provide digital passes to attendees.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('create-event')}
              className="py-3 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md transition-all flex items-center gap-2"
            >
              <span>Create Event Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
