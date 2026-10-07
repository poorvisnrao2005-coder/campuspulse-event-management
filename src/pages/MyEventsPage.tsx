import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  UserCheck, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { CollegeEvent, User } from '../types';

interface MyEventsPageProps {
  events: CollegeEvent[];
  currentUser: User;
  onCreateEventClick: () => void;
  onEditEvent: (event: CollegeEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  onViewEventDetails: (eventId: string) => void;
  onViewParticipants: (event: CollegeEvent) => void;
}

export const MyEventsPage: React.FC<MyEventsPageProps> = ({
  events,
  currentUser,
  onCreateEventClick,
  onEditEvent,
  onDeleteEvent,
  onViewEventDetails,
  onViewParticipants,
}) => {
  const [filterView, setFilterView] = useState<'mine' | 'all'>('mine');

  // Events created by current user
  const myEvents = events.filter(e => e.createdBy === currentUser.id);
  const displayedEvents = filterView === 'mine' ? myEvents : events;

  // Aggregate metrics
  const totalRegistrations = myEvents.reduce((acc, e) => acc + (e.registeredCount || 0), 0);
  const totalCapacity = myEvents.reduce((acc, e) => acc + (e.capacity || 0), 0);
  const avgFillRate = totalCapacity > 0 ? Math.round((totalRegistrations / totalCapacity) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Organizer Hub</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Organized Events
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your published college events, update schedules, and track attendee check-ins.
          </p>
        </div>

        <button
          onClick={onCreateEventClick}
          className="self-start md:self-auto py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Event</span>
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Events Created</p>
            <p className="text-2xl font-black font-mono tabular-nums text-slate-900">{myEvents.length}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Attendees</p>
            <p className="text-2xl font-black font-mono tabular-nums text-emerald-600">{totalRegistrations}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Avg Capacity Filled</p>
            <p className="text-2xl font-black font-mono tabular-nums text-purple-600">{avgFillRate}%</p>
          </div>
        </div>
      </div>

      {/* View Toggle Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilterView('mine')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterView === 'mine' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            My Events ({myEvents.length})
          </button>
          <button
            onClick={() => setFilterView('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterView === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Campus Events ({events.length})
          </button>
        </div>

        <span className="text-xs text-slate-500 hidden sm:inline">
          Logged in as: <strong className="text-slate-700">{currentUser.name}</strong>
        </span>
      </div>

      {/* Events List */}
      {displayedEvents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No events found in this view</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You haven't created any events yet with this profile. Click below to host your first college hackathon, sports meet, or cultural evening!
          </p>
          <button
            onClick={onCreateEventClick}
            className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Event</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedEvents.map((event) => {
            const fillPercent = Math.min(100, Math.round(((event.registeredCount || 0) / event.capacity) * 100));
            const isUserCreator = event.createdBy === currentUser.id;

            return (
              <div
                key={event.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 p-5 shadow-xs transition-all flex flex-col md:flex-row gap-5"
              >
                {/* Thumbnail */}
                <div 
                  className="w-full md:w-52 h-36 rounded-xl overflow-hidden bg-slate-100 shrink-0 cursor-pointer relative"
                  onClick={() => onViewEventDetails(event.id)}
                >
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-white/95 text-indigo-700 shadow-xs">
                    {event.category}
                  </div>
                  {isUserCreator && (
                    <div className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-600 text-white shadow-xs">
                      Your Event
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="font-semibold text-slate-700">{event.date}</span>
                      <span>·</span>
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{event.time}</span>
                    </div>

                    <h3
                      onClick={() => onViewEventDetails(event.id)}
                      className="text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1 mb-1.5"
                    >
                      {event.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{event.location}</span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2">
                      {event.shortDescription || event.description}
                    </p>
                  </div>

                  {/* Registered Attendees bar & Actions */}
                  <div className="pt-3 border-t border-slate-100 mt-3 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
                    {/* Progress Bar */}
                    <div className="w-full lg:w-64 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-600">
                        <span>Participants: <strong className="text-slate-800 tabular-nums">{event.registeredCount}</strong> / {event.capacity}</span>
                        <span>{fillPercent}% filled</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all"
                          style={{ width: `${fillPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Buttons: View Participants, Edit, Delete, Details */}
                    <div className="flex items-center gap-2 w-full lg:w-auto justify-end flex-wrap">
                      <button
                        onClick={() => onViewParticipants(event)}
                        className="py-1.5 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>View Participants ({event.registeredCount})</span>
                      </button>

                      <button
                        onClick={() => onEditEvent(event)}
                        className="py-1.5 px-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
                            onDeleteEvent(event.id);
                          }
                        }}
                        className="py-1.5 px-2.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Delete Event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onViewEventDetails(event.id)}
                        className="py-1.5 px-3 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
