import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  Ticket, 
  Sparkles,
  Menu,
  X,
  ChevronDown,
  Layers
} from 'lucide-react';
import { Page, User } from '../types';
import { DEFAULT_USERS } from '../data/mockEvents';

interface NavbarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  currentUser: User;
  onSwitchUser: (user: User) => void;
  onOpenAuth: () => void;
  onSelectEventId?: (id: string | null) => void;
  registeredCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  currentUser,
  onSwitchUser,
  onOpenAuth,
  onSelectEventId,
  registeredCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navigateTo = (page: Page) => {
    if (onSelectEventId) onSelectEventId(null);
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-md"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  CampusPulse
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Clean text with subtle underline/highlight) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => navigateTo('home')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                currentPage === 'home' 
                  ? 'text-indigo-600 bg-indigo-50/70 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('events')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                currentPage === 'events' 
                  ? 'text-indigo-600 bg-indigo-50/70 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Explore Events
            </button>
            <button
              onClick={() => navigateTo('my-registrations')}
              className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                currentPage === 'my-registrations' 
                  ? 'text-indigo-600 bg-indigo-50/70 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              My Passes
              {registeredCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-indigo-100 text-indigo-700 text-xs font-mono font-bold rounded-md">
                  {registeredCount}
                </span>
              )}
            </button>
            <button
              onClick={() => navigateTo('my-events')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                currentPage === 'my-events' 
                  ? 'text-indigo-600 bg-indigo-50/70 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Organizer Hub
            </button>
            <button
              onClick={() => navigateTo('dashboard')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                currentPage === 'dashboard' 
                  ? 'text-indigo-600 bg-indigo-50/70 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Dashboard
            </button>
          </nav>

          {/* Zone 3: Actions & User Switcher */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigateTo('create-event')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-all whitespace-nowrap hover:shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left"
                aria-expanded={profileDropdownOpen}
              >
                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs ring-1 ring-slate-200">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden xl:flex flex-col text-xs leading-tight pr-1">
                  <span className="font-semibold text-slate-800 truncate max-w-[110px]">{currentUser.name}</span>
                  <span className="text-slate-500 text-[10px] capitalize">{currentUser.role}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="font-semibold text-slate-900 text-sm">{currentUser.name}</p>
                    <p className="text-slate-500 font-mono text-[11px] truncate">{currentUser.email}</p>
                    <div className="mt-1.5 text-[11px] text-slate-600 flex items-center gap-1.5">
                      <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">{currentUser.studentId}</span>
                      <span>{currentUser.department}</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigateTo('dashboard');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      <span>My Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        navigateTo('my-registrations');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Ticket className="w-4 h-4 text-slate-400" />
                      <span>Registered Events ({registeredCount})</span>
                    </button>
                    <button
                      onClick={() => {
                        navigateTo('my-events');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Layers className="w-4 h-4 text-slate-400" />
                      <span>Manage My Events</span>
                    </button>
                  </div>

                  {/* Switch Demo Role */}
                  <div className="border-t border-slate-100 pt-2 pb-1 px-3.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Switch Demo User
                    </p>
                    <div className="space-y-1">
                      {DEFAULT_USERS.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            onSwitchUser(u);
                            setProfileDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2 py-1.5 rounded-md flex items-center justify-between text-xs transition-colors ${
                            currentUser.id === u.id
                              ? 'bg-indigo-50 text-indigo-700 font-semibold'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <span className="truncate">{u.name} ({u.role})</span>
                          {currentUser.id === u.id && <span className="text-indigo-600 text-[10px]">Active</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-1 mt-1">
                    <button
                      onClick={() => {
                        onOpenAuth();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 font-medium"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>Sign In with another Account</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => navigateTo('create-event')}
              className="p-2 text-white bg-indigo-600 rounded-lg text-xs"
              aria-label="Create Event"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 mb-3">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-500 capitalize">{currentUser.role} · {currentUser.department}</p>
            </div>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => navigateTo('home')}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg font-medium ${
                currentPage === 'home' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('events')}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg font-medium ${
                currentPage === 'events' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700'
              }`}
            >
              Explore Events
            </button>
            <button
              onClick={() => navigateTo('my-registrations')}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg font-medium flex items-center justify-between ${
                currentPage === 'my-registrations' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700'
              }`}
            >
              <span>My Passes</span>
              {registeredCount > 0 && (
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-mono rounded-full font-bold">
                  {registeredCount}
                </span>
              )}
            </button>
            <button
              onClick={() => navigateTo('my-events')}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg font-medium ${
                currentPage === 'my-events' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700'
              }`}
            >
              My Organized Events
            </button>
            <button
              onClick={() => navigateTo('dashboard')}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg font-medium ${
                currentPage === 'dashboard' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700'
              }`}
            >
              User Dashboard
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => {
                onOpenAuth();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 px-3 text-xs text-center border border-slate-200 text-slate-700 rounded-lg font-medium"
            >
              Sign In / Switch
            </button>
            <button
              onClick={() => navigateTo('create-event')}
              className="flex-1 py-2 px-3 text-xs text-center bg-indigo-600 text-white rounded-lg font-semibold"
            >
              + Create Event
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
