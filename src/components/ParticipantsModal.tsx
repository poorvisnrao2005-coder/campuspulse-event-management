import React, { useState } from 'react';
import { X, Search, Download, Printer, CheckCircle2, UserCheck, Users, Mail, IdCard } from 'lucide-react';
import { CollegeEvent, Participant } from '../types';

interface ParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CollegeEvent;
  participants: Participant[];
  onToggleCheckIn: (participantId: string) => void;
}

export const ParticipantsModal: React.FC<ParticipantsModalProps> = ({
  isOpen,
  onClose,
  event,
  participants,
  onToggleCheckIn,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filtered = participants.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.fullName.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.studentId.toLowerCase().includes(q) ||
      (p.department && p.department.toLowerCase().includes(q)) ||
      p.ticketId.toLowerCase().includes(q)
    );
  });

  const checkedInCount = participants.filter(p => p.checkedIn).length;
  const attendanceRate = participants.length > 0 
    ? Math.round((checkedInCount / participants.length) * 100) 
    : 0;

  const handleExportCSV = () => {
    if (participants.length === 0) return;
    const headers = ['Ticket ID', 'Full Name', 'Email', 'Student ID', 'Department', 'Registered At', 'Checked In'];
    const rows = participants.map(p => [
      p.ticketId,
      `"${p.fullName}"`,
      p.email,
      p.studentId,
      `"${p.department || 'N/A'}"`,
      new Date(p.registeredAt).toLocaleString(),
      p.checkedIn ? 'YES' : 'NO'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}_Participants.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-start justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                Organizer Roster
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {event.date} · {event.time}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 line-clamp-1">{event.title}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Venue: <span className="text-slate-700 font-medium">{event.location}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-3 border-b border-slate-100 bg-white px-6 py-3 text-center">
          <div>
            <p className="text-[11px] text-slate-500">Registered</p>
            <p className="text-lg font-bold font-mono text-slate-900 tabular-nums">
              {participants.length} <span className="text-xs text-slate-400 font-normal">/ {event.capacity}</span>
            </p>
          </div>
          <div className="border-x border-slate-100">
            <p className="text-[11px] text-slate-500">Checked In</p>
            <p className="text-lg font-bold font-mono text-emerald-600 tabular-nums">
              {checkedInCount}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500">Attendance Rate</p>
            <p className="text-lg font-bold font-mono text-indigo-600 tabular-nums">
              {attendanceRate}%
            </p>
          </div>
        </div>

        {/* Toolbar: Search & Export */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between bg-white">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID, or ticket..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleExportCSV}
              disabled={participants.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handlePrint}
              disabled={participants.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print List</span>
            </button>
          </div>
        </div>

        {/* Participants Table */}
        <div className="flex-1 overflow-y-auto p-4">
          {participants.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-700">No participants registered yet</p>
              <p className="text-xs text-slate-400 mt-1">Registrations will appear here as soon as students sign up.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p className="text-xs">No matching participants found for "{searchQuery}".</p>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Ticket ID</th>
                    <th className="py-2.5 px-3">Participant</th>
                    <th className="py-2.5 px-3 hidden sm:table-cell">Dept / Roll No</th>
                    <th className="py-2.5 px-3 hidden md:table-cell">Registered Date</th>
                    <th className="py-2.5 px-3 text-right">Check-in Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-medium text-indigo-600">
                        {p.ticketId}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-900">{p.fullName}</div>
                        <div className="text-[11px] text-slate-500">{p.email}</div>
                      </td>
                      <td className="py-2.5 px-3 hidden sm:table-cell">
                        <div className="text-slate-800">{p.department}</div>
                        <div className="font-mono text-[11px] text-slate-500">{p.studentId}</div>
                      </td>
                      <td className="py-2.5 px-3 hidden md:table-cell text-slate-500 font-mono text-[11px]">
                        {new Date(p.registeredAt).toLocaleDateString()}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => onToggleCheckIn(p.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                            p.checkedIn
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <CheckCircle2 className={`w-3.5 h-3.5 ${p.checkedIn ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <span>{p.checkedIn ? 'Checked In' : 'Mark Present'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
          Showing {filtered.length} of {participants.length} registered students
        </div>
      </div>
    </div>
  );
};
