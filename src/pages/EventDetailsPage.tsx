import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User as UserIcon, 
  Users, 
  Share2, 
  ArrowLeft, 
  CheckCircle2, 
  Download, 
  Ticket, 
  Edit, 
  Trash2, 
  Mail, 
  ShieldCheck, 
  Sparkles,
  CalendarPlus,
  AlertCircle
} from 'lucide-react';
import { CollegeEvent, Participant, User } from '../types';

interface EventDetailsPageProps {
  event: CollegeEvent;
  currentUser: User;
  isRegistered: boolean;
  participant?: Participant;
  participantsCount: number;
  onBack: () => void;
  onRegister: (eventId: string) => void;
  onCancelRegistration: (eventId: string) => void;
  onViewTicket: () => void;
  onViewParticipantsList: () => void;
  onEditEvent: (event: CollegeEvent) => void;
  onDeleteEvent: (eventId: string) => void;
}

export const EventDetailsPage: React.FC<EventDetailsPageProps> = ({
  event,
  currentUser,
  isRegistered,
  participant,
  participantsCount,
  onBack,
  onRegister,
  onCancelRegistration,
  onViewTicket,
  onViewParticipantsList,
  onEditEvent,
  onDeleteEvent,
}) => {
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);

  const isCreator = currentUser.id === event.createdBy;
  const isFull = (event.registeredCount || 0) >= event.capacity;
  const spotsLeft = Math.max(0, event.capacity - (event.registeredCount || 0));
  const capacityPercent = Math.min(100, Math.round(((event.registeredCount || 0) / event.capacity) * 100));

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCalendar = () => {
    // Generate iCal format event
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
      {/* Top Navigation & Action Row */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={handleDownloadCalendar}
            className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            title="Download iCal file to add to Google Calendar or Outlook"
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            <span>Add to Calendar</span>
          </button>

          {isCreator && (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200">
              <button
                onClick={() => onEditEvent(event)}
                className="inline-flex items-center gap-1 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to delete "${event.title}"? This cannot be undone.`)) {
                    onDeleteEvent(event.id);
                  }
                }}
                className="inline-flex items-center gap-1 py-1.5 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-600 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Event Showcase Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 aspect-[21/9] min-h-[300px]">
        {!imageError && event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover opacity-90"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-indigo-900 to-purple-900 flex items-center justify-center p-8 text-white text-center">
            <div>
              <Calendar className="w-16 h-16 mx-auto mb-3 opacity-60" />
              <p className="text-xl font-bold">{event.title}</p>
            </div>
          </div>
        )}

        {/* Gradient Contrast Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

        {/* Bottom Banner Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-md bg-indigo-600 text-white text-xs font-semibold uppercase tracking-wider">
              {event.category}
            </span>
            <span className="px-3 py-1 rounded-md bg-white/20 backdrop-blur-md text-white text-xs font-medium">
              {event.price}
            </span>
            {isRegistered && (
              <span className="px-3 py-1 rounded-md bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>You're Registered</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight max-w-4xl leading-tight">
            {event.title}
          </h1>
        </div>
      </div>

      {/* Grid: 2 Column Layout (Left: Details, Description, Agenda; Right: Registration Card, Organizer) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Key Schedule & Venue Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Date & Day</p>
                <p className="text-sm font-bold text-slate-800">{event.date}</p>
                <p className="text-xs text-slate-500">Add to your semester calendar</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Timing</p>
                <p className="text-sm font-bold text-slate-800">{event.time}</p>
                <p className="text-xs text-slate-500">Please arrive 10 min early</p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:col-span-2 pt-2 border-t border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Venue & Campus Location</p>
                <p className="text-sm font-bold text-slate-800">{event.location}</p>
                <p className="text-xs text-slate-500">Campus Entry via Main Gate · Student ID required at check-in</p>
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">About This Event</h2>
            <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {event.description}
            </div>

            {event.tags && event.tags.length > 0 && (
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-400 mr-1">Tags:</span>
                {event.tags.map((tag) => (
                  <span key={tag} className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Registered Participants Roster Preview */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Registered Attendees</h3>
                <p className="text-xs text-slate-500">
                  <span className="font-mono font-bold text-indigo-600 tabular-nums">{event.registeredCount}</span> students enrolled out of {event.capacity} total seats
                </p>
              </div>
              <button
                onClick={onViewParticipantsList}
                className="py-1.5 px-3 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                <span>View Full Roster</span>
              </button>
            </div>

            {/* Capacity Progress Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-slate-600 font-mono">
                <span>Registration Status: {capacityPercent}% Filled</span>
                <span>{spotsLeft} spots remaining</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    capacityPercent >= 90 ? 'bg-rose-500' : capacityPercent >= 70 ? 'bg-amber-500' : 'bg-indigo-600'
                  }`}
                  style={{ width: `${capacityPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Action Card & Organizer Card */}
        <div className="space-y-6">
          {/* Registration Action Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-5 sticky top-20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Registration</p>
                <p className="text-2xl font-black text-slate-900 font-mono">
                  {event.price}
                </p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${
                  isFull ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {isFull ? 'Full Capacity' : `${spotsLeft} Spots Open`}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              {isRegistered ? (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                    <div className="flex items-center gap-2 font-bold mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Registration Confirmed!</span>
                    </div>
                    <p className="text-emerald-700">
                      Your seat is reserved. Access your digital pass and QR code anytime.
                    </p>
                  </div>

                  <button
                    onClick={onViewTicket}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>View My Digital Pass</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Cancel your registration for this event?')) {
                        onCancelRegistration(event.id);
                      }
                    }}
                    className="w-full py-2 px-4 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Cancel Registration
                  </button>
                </div>
              ) : isFull ? (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>This event has reached maximum capacity.</span>
                  </div>
                  <button
                    disabled
                    className="w-full py-3 px-4 bg-slate-200 text-slate-400 rounded-xl text-xs font-bold cursor-not-allowed text-center"
                  >
                    Registration Closed
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => onRegister(event.id)}
                    className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Register for Event</span>
                  </button>
                  <p className="text-[11px] text-center text-slate-400">
                    Instant confirmation · Digital entry pass generated
                  </p>
                </div>
              )}
            </div>

            {/* Fast Event Highlights */}
            <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Audience:</span>
                <span className="font-medium text-slate-800">All College Students</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Certificate:</span>
                <span className="font-medium text-slate-800">Provided to Attendees</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Department:</span>
                <span className="font-medium text-slate-800">{event.organizerDept}</span>
              </div>
            </div>
          </div>

          {/* Organizer Details Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Organized By</p>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm ring-2 ring-indigo-50">
                {event.organizerName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 truncate">{event.organizerName}</h4>
                <p className="text-xs text-slate-500 truncate">{event.organizerDept}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <a
                href={`mailto:${event.organizerEmail}`}
                className="inline-flex items-center gap-2 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
              >
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate">{event.organizerEmail}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
