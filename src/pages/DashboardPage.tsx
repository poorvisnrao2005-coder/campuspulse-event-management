import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Ticket, 
  Plus, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  CheckCircle2,
  CalendarCheck,
  ChevronRight
} from 'lucide-react';
import { CollegeEvent, Participant, User, Page } from '../types';
import { DEFAULT_USERS } from '../data/mockEvents';

interface DashboardPageProps {
  currentUser: User;
  events: CollegeEvent[];
  participants: Participant[];
  onNavigate: (page: Page) => void;
  onSelectEvent: (eventId: string) => void;
  onOpenTicket: (event: CollegeEvent, participant: Participant) => void;
  onSwitchUser: (user: User) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentUser,
  events,
  participants,
  onNavigate,
  onSelectEvent,
  onOpenTicket,
  onSwitchUser,
}) => {
  // User's registered events
  const userRegistrations = participants.filter(p => p.userId === currentUser.id);
  const registeredEvents = userRegistrations
    .map(r => ({
      reg: r,
      event: events.find(e => e.id === r.eventId)
    }))
    .filter(item => Boolean(item.event)) as { reg: Participant; event: CollegeEvent }[];

  // User's organized events
  const organizedEvents = events.filter(e => e.createdBy === currentUser.id);
  const totalAttendeesForOrganized = organizedEvents.reduce((acc, e) => acc + (e.registeredCount || 0), 0);

  // Next upcoming registered event
  const nextEvent = registeredEvents
    .sort((a, b) => new Date(a.event.date).getTime() - new Date(b.event.date).getTime())[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Overview Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-md ring-4 ring-indigo-500/20">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">{currentUser.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                {currentUser.department}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-1">
                <span>ID: {currentUser.studentId}</span>
                <span>·</span>
                <span>{currentUser.email}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('create-event')}
              className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Host Event</span>
            </button>
            <button
              onClick={() => onNavigate('events')}
              className="py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 backdrop-blur-xs"
            >
              <span>Explore Events</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Registered Events</span>
            <Ticket className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-3xl font-black font-mono tabular-nums text-slate-900">
            {registeredEvents.length}
          </p>
          <p className="text-[11px] text-slate-500">Upcoming campus sessions</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Events Organized</span>
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-3xl font-black font-mono tabular-nums text-slate-900">
            {organizedEvents.length}
          </p>
          <p className="text-[11px] text-slate-500">Published on CampusPulse</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Attendees</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black font-mono tabular-nums text-emerald-600">
            {totalAttendeesForOrganized}
          </p>
          <p className="text-[11px] text-slate-500">Across your events</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Campus Standing</span>
            <ShieldCheck className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 font-mono">
            Active
          </p>
          <p className="text-[11px] text-slate-500">Official College Member</p>
        </div>
      </div>

      {/* Main Grid: Upcoming Schedule & Quick Action Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Next Upcoming Event & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next Immediate Event Card */}
          {nextEvent && (
            <div className="p-6 rounded-3xl bg-indigo-50/70 border border-indigo-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/80 px-2.5 py-0.5 rounded-full">
                  Next on Your Schedule
                </span>
                <span className="text-xs font-mono text-indigo-700 font-semibold">
                  Pass ID: {nextEvent.reg.ticketId}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                  <h3 
                    onClick={() => onSelectEvent(nextEvent.event.id)}
                    className="text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    {nextEvent.event.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1.5">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      {nextEvent.event.date}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {nextEvent.event.time}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {nextEvent.event.location}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenTicket(nextEvent.event, nextEvent.reg)}
                  className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shrink-0 shadow-xs"
                >
                  View Digital Pass
                </button>
              </div>
            </div>
          )}

          {/* Registered Schedule Timeline */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Your Registered Schedule</h3>
                <p className="text-xs text-slate-500">Upcoming sessions and activities you are attending</p>
              </div>
              <button
                onClick={() => onNavigate('my-registrations')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>All Passes</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {registeredEvents.length === 0 ? (
              <div className="text-center py-8 text-slate-500 space-y-2">
                <p className="text-xs">You have no upcoming events registered.</p>
                <button
                  onClick={() => onNavigate('events')}
                  className="text-xs text-indigo-600 font-semibold hover:underline"
                >
                  Browse events to register
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                {registeredEvents.map(({ reg, event }) => (
                  <div
                    key={reg.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {event.category.substring(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <h4 
                          onClick={() => onSelectEvent(event.id)}
                          className="text-xs sm:text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1"
                        >
                          {event.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span>{event.date}</span>
                          <span>·</span>
                          <span className="truncate max-w-[150px]">{event.location}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenTicket(event, reg)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-200 bg-white hover:bg-indigo-50 shrink-0"
                    >
                      Ticket
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 col): Quick Shortcuts & Demo Profile Switcher */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Quick Shortcuts</h3>
            
            <button
              onClick={() => onNavigate('events')}
              className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-800">Browse Campus Schedule</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigate('create-event')}
              className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <Plus className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold text-slate-800">Host a New Event</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigate('my-registrations')}
              className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <Ticket className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">My Registered Passes</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigate('my-events')}
              className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-slate-800">Manage My Events & Roster</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Test Roles Switcher */}
          <div className="bg-indigo-50/60 rounded-3xl border border-indigo-100 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900">Switch Demo Student</h3>
            </div>
            <p className="text-xs text-indigo-800/80">
              Easily toggle between student organizer and attendee views for review or demonstration:
            </p>
            <div className="space-y-1.5 pt-1">
              {DEFAULT_USERS.map((u) => (
                <button
                  key={u.id}
                  onClick={() => onSwitchUser(u)}
                  className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between border ${
                    currentUser.id === u.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-indigo-200/60'
                  }`}
                >
                  <div>
                    <p className="font-bold text-xs">{u.name}</p>
                    <p className={`text-[10px] ${currentUser.id === u.id ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {u.department} · {u.role}
                    </p>
                  </div>
                  {currentUser.id === u.id && (
                    <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded">Active</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
