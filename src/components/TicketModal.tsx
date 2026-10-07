import React from 'react';
import { X, Calendar, Clock, MapPin, QrCode, Download, Printer, CheckCircle, ShieldCheck } from 'lucide-react';
import { CollegeEvent, Participant } from '../types';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CollegeEvent;
  participant: Participant;
  onCancelRegistration?: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  isOpen,
  onClose,
  event,
  participant,
  onCancelRegistration,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official Campus Event Pass</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight line-clamp-2 px-4">
            {event.title}
          </h2>
          <p className="text-indigo-100 text-xs mt-1">
            {event.category} · Organized by {event.organizerName}
          </p>
        </div>

        {/* Perforated Divider */}
        <div className="relative flex items-center justify-between px-6 py-2 bg-slate-50 border-y border-dashed border-slate-300">
          <div className="w-4 h-8 bg-slate-900/60 rounded-r-full -ml-6"></div>
          <span className="font-mono text-xs tracking-widest text-slate-500 font-semibold uppercase">
            Pass ID: <span className="text-indigo-600">{participant.ticketId}</span>
          </span>
          <div className="w-4 h-8 bg-slate-900/60 rounded-l-full -mr-6"></div>
        </div>

        {/* Ticket Body */}
        <div className="p-6 space-y-5">
          {/* Attendee Details */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Attendee</p>
              <p className="text-sm font-bold text-slate-800">{participant.fullName}</p>
              <p className="text-xs text-slate-500 font-mono">{participant.studentId}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Department</p>
              <p className="text-xs font-semibold text-slate-700 truncate">{participant.department || 'Student'}</p>
              <p className="text-[11px] text-slate-500 truncate">{participant.email}</p>
            </div>
          </div>

          {/* Date & Location */}
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="font-semibold text-slate-800">{event.date}</span>
              <span className="text-slate-400">·</span>
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span className="text-slate-700">{event.location}</span>
            </div>
          </div>

          {/* Mock QR Code for Check-in */}
          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-32 h-32 bg-white p-2 rounded-lg border border-slate-200 shadow-xs flex items-center justify-center relative">
              {/* Simulated crisp QR pattern */}
              <div className="w-full h-full bg-slate-900 flex items-center justify-center rounded text-white p-2 text-center">
                <QrCode className="w-24 h-24 text-white" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 font-mono">
              Scan at venue entrance for entry verification
            </p>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{participant.checkedIn ? 'Already Checked In' : 'Confirmed Active'}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handlePrint}
              className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Pass</span>
            </button>
            {onCancelRegistration && (
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to cancel your registration for this event?')) {
                    onCancelRegistration();
                    onClose();
                  }
                }}
                className="py-2.5 px-4 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-medium transition-colors"
              >
                Cancel Pass
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
