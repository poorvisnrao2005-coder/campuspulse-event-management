import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User as UserIcon, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CollegeEvent } from '../types';

interface EventCardProps {
  event: CollegeEvent;
  isRegistered?: boolean;
  onViewDetails: (eventId: string) => void;
  onRegisterQuick?: (eventId: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  isRegistered = false,
  onViewDetails,
  onRegisterQuick,
}) => {
  const [imageError, setImageError] = useState(false);

  // Format date nicely: e.g. "Sat, Oct 24, 2026"
  const formattedDate = (() => {
    try {
      const d = new Date(event.date + 'T00:00:00');
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return event.date;
    }
  })();

  const isFull = event.registeredCount >= event.capacity;
  const spotsLeft = Math.max(0, event.capacity - event.registeredCount);

  // Category subtle accent colors
  const categoryStyles: Record<string, { text: string; bg: string }> = {
    Technology: { text: 'text-indigo-600', bg: 'bg-indigo-50/80' },
    Cultural: { text: 'text-rose-600', bg: 'bg-rose-50/80' },
    Sports: { text: 'text-amber-600', bg: 'bg-amber-50/80' },
    Workshop: { text: 'text-emerald-600', bg: 'bg-emerald-50/80' },
    Academic: { text: 'text-sky-600', bg: 'bg-sky-50/80' },
    Social: { text: 'text-purple-600', bg: 'bg-purple-50/80' },
  };

  const style = categoryStyles[event.category] || { text: 'text-slate-600', bg: 'bg-slate-100' };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
      {/* Event Image Container with aspect ratio and fallback */}
      <div 
        className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 cursor-pointer"
        onClick={() => onViewDetails(event.id)}
      >
        {!imageError && event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-6 text-white text-center">
            <div>
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-80" />
              <p className="font-bold text-sm tracking-tight">{event.category} Event</p>
            </div>
          </div>
        )}

        {/* Category & Status Overlay (Subtle unboxed badges) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md backdrop-blur-md shadow-xs ${style.bg} ${style.text}`}>
            {event.category}
          </span>
          {event.price === 'Free' && (
            <span className="text-[11px] font-medium px-2 py-1 rounded-md bg-white/90 backdrop-blur-md text-emerald-700 shadow-xs">
              Free Entry
            </span>
          )}
        </div>

        {/* Registration state badge if already registered */}
        {isRegistered && (
          <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Registered</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Zero-Pill Metadata Line: Date · Time */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 font-medium">
          <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span className="text-slate-700 font-semibold">{formattedDate}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{event.time}</span>
        </div>

        {/* Event Title */}
        <h3 
          onClick={() => onViewDetails(event.id)}
          className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2 cursor-pointer leading-snug"
          title={event.title}
        >
          {event.title}
        </h3>

        {/* Location / Venue */}
        <div className="flex items-start gap-1.5 text-xs text-slate-600 mb-2.5">
          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
          <span className="line-clamp-1">{event.location}</span>
        </div>

        {/* Description Snippet */}
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed flex-1">
          {event.shortDescription || event.description}
        </p>

        {/* Organizer & Capacity Divider */}
        <div className="pt-3 border-t border-slate-100 mt-auto flex items-center justify-between text-xs text-slate-500 mb-3">
          <div className="flex items-center gap-1.5 truncate max-w-[55%]">
            <UserIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate" title={event.organizerName}>
              {event.organizerName}
            </span>
          </div>

          <div className="flex items-center gap-1 font-mono text-[11px] text-slate-600 shrink-0">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>
              <strong className="text-slate-800 tabular-nums">{event.registeredCount}</strong>/{event.capacity}
            </span>
          </div>
        </div>

        {/* Action Buttons: View Details & Register */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => onViewDetails(event.id)}
            className="w-full py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {isRegistered ? (
            <button
              onClick={() => onViewDetails(event.id)}
              className="w-full py-2 px-3 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Pass Active</span>
            </button>
          ) : isFull ? (
            <button
              disabled
              className="w-full py-2 px-3 text-xs font-semibold text-slate-400 bg-slate-100 rounded-lg cursor-not-allowed text-center"
            >
              Full Capacity
            </button>
          ) : (
            <button
              onClick={() => onRegisterQuick ? onRegisterQuick(event.id) : onViewDetails(event.id)}
              className="w-full py-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1"
            >
              <span>Register</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
