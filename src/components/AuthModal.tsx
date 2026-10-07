import React, { useState } from 'react';
import { X, User, Mail, Lock, Building, IdCard, Check, ArrowRight } from 'lucide-react';
import { User as UserType } from '../types';
import { DEFAULT_USERS } from '../data/mockEvents';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserType) => void;
  currentUser: UserType;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  currentUser,
}) => {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  
  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [role, setRole] = useState<'student' | 'organizer'>('student');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setErrorMsg('Please enter your campus email address.');
      return;
    }

    // Match demo user or create a session
    const matched = DEFAULT_USERS.find(u => u.email.toLowerCase() === loginEmail.trim().toLowerCase());
    if (matched) {
      onLogin(matched);
      onClose();
    } else {
      // Create user session for this custom email
      const customUser: UserType = {
        id: `user-${Date.now()}`,
        name: loginEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email: loginEmail.trim(),
        studentId: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
        department: 'Campus Student',
        role: 'student',
      };
      onLogin(customUser);
      onClose();
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMsg('Please fill in your name and campus email.');
      return;
    }

    const newUser: UserType = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      studentId: studentId.trim() || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      department: department.trim() || 'General Studies',
      role,
    };

    onLogin(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Campus Account</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {tab === 'login' ? 'Sign in to CampusPulse' : 'Create Student Account'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Access event registrations, passes, and organizer controls.
          </p>
        </div>

        {/* Quick Demo Accounts Switcher (College Project Convenience) */}
        <div className="bg-indigo-50/60 p-4 border-b border-indigo-100">
          <p className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider mb-2">
            ⚡ Quick Demo Accounts (1-Click Switch)
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {DEFAULT_USERS.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => {
                  onLogin(u);
                  onClose();
                }}
                className={`py-1.5 px-2 rounded-lg text-left text-xs transition-all border ${
                  currentUser.id === u.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-indigo-200/60'
                }`}
              >
                <div className="font-semibold truncate text-[11px]">{u.name.split(' ')[0]}</div>
                <div className={`text-[10px] capitalize truncate ${currentUser.id === u.id ? 'text-indigo-100' : 'text-slate-400'}`}>
                  {u.role}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 m-4 rounded-xl text-xs font-semibold">
          <button
            onClick={() => { setTab('login'); setErrorMsg(''); }}
            className={`py-1.5 rounded-lg transition-all ${
              tab === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => { setTab('signup'); setErrorMsg(''); }}
            className={`py-1.5 rounded-lg transition-all ${
              tab === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Form area */}
        <div className="px-6 pb-6">
          {errorMsg && (
            <div className="mb-4 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Campus Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. alex.rivera@campus.edu"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Student / Roll ID</label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. CS-2024-099"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Account Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'student' | 'organizer')}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  >
                    <option value="student">Student Attendee</option>
                    <option value="organizer">Club Organizer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Business Administration">Business Administration</option>
                  <option value="Design & Arts">Design & Arts</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Campus Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maya.lin@campus.edu"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Register & Continue</span>
                <Check className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
