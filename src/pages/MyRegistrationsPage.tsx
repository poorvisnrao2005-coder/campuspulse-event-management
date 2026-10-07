import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Ticket, 
  Trash2, 
  ArrowRight, 
  CalendarPlus, 
  QrCode, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { CollegeEvent, Participant, User, Page } from '../types';

interface MyRegistrationsPageProps {
  events: CollegeEvent[];
  participants: Participant[];
  currentUser: User;
  onNavigate: (page: Page) => void;
  onViewEventDetails: (eventId: string) => void;
  onOpenTicket: (event: CollegeEvent, participant: Participant) => void;
  onCancelRegistration: (eventId: string) => void;
}

export const MyRegistrationsPage: React.FC<MyRegistrationsPageProps> = ({
  events,
  participants,
  currentUser,
  onNavigate,
  onViewEventDetails,
  onOpenTicket,
  onCancelRegistration,
}) => {
  // Find all registrations for this user
  const userRegistrations = participants.filter(p => p.userId === currentUser.id);

  // Map each registration to its event
  const registeredItems = userRegistrations.map(reg => {
    const event = events.find(e => e.id === reg.eventId);
    return {
      registration: reg,
      event,
    };
  }).filter(item => Boolean(item.event)) as { registration: Participant; event: CollegeEvent }[];

  const handleDownloadCalendar = (event: CollegeEvent) => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description.replace(/\n/g, ' ')}`,
      `LOCATION:${event.location}`,
      `DTSTART:${event.date.replace(/-/g, '')}T090000Z`,
      `DTEND:${event.date.replace(/-/g, '')}T180000Z`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Student Passes</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Registered Events
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            View your campus entry passes, check-in QR codes, and event schedules.
          </p>
        </div>

        <button
          onClick={() => onNavigate('events')}
          className="self-start sm:self-auto py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Discover More Events</span>
        </button>
      </div>

      {/* Roster / Passes List */}
      {registeredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Ticket className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No active registrations</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't signed up for any campus events yet. Explore upcoming hackathons, sports meets, and cultural festivals!
          </p>
          <button
            onClick={() => onNavigate('events')}
            className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-2"
          >
            <span>Browse Events Schedule</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {registeredItems.map(({ registration, event }) => (
            <div
              key={registration.id}
              className="bg-white rounded-3xl border border-slate-200 hover:border-indigo-300 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Event Header Banner */}
              <div className="relative aspect-[16/7] w-full overflow-hidden bg-slate-100">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent"></div>
                
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-white/90 text-indigo-700 shadow-xs">
                    {event.category}
                  </span>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500 text-white text-xs font-bold shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Pass Active</span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 
                    onClick={() => onViewEventDetails(event.id)}
                    className="text-base font-bold line-clamp-1 hover:text-indigo-200 transition-colors cursor-pointer"
                  >
                    {event.title}
                  </h3>
                </div>
              </div>

              {/* Pass details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  {/* Time & Date */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="font-semibold text-slate-800">{event.date}</span>
                    <span className="text-slate-300">·</span>
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{event.time}</span>
                  </div>

                  {/* Venue */}
                  <div className="flex items-start gap-1.5 text-xs text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                </div>

                {/* Digital Ticket Barcode Stub */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Digital Pass ID</p>
                    <p className="font-mono text-xs font-bold text-indigo-600">{registration.ticketId}</p>
                    <p className="text-[10px] text-slate-500">Registered: {new Date(registration.registeredAt).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => onOpenTicket(event, registration)}
                    className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                    title="View QR Entry Pass"
                  >
                    <QrCode className="w-5 h-5" />
                  </button>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenTicket(event, registration)}
                      className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>View Pass</span>
                    </button>
                    <button
                      onClick={() => handleDownloadCalendar(event)}
                      className="py-1.5 px-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-medium transition-colors"
                      title="Add to Calendar"
                    >
                      <CalendarPlus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewEventDetails(event.id)}
                      className="text-xs font-semibold text-slate-600 hover:text-indigo-600 py-1.5 px-2"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Cancel registration for "${event.title}"?`)) {
                          onCancelRegistration(event.id);
                        }
                      }}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 py-1.5 px-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
