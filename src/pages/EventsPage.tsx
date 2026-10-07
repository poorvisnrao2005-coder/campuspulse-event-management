import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Calendar, 
  Filter, 
  Grid, 
  List, 
  X, 
  Clock, 
  MapPin, 
  User as UserIcon, 
  Users, 
  ArrowRight,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import { CollegeEvent, EventCategory } from '../types';
import { EventCard } from '../components/EventCard';

interface EventsPageProps {
  events: CollegeEvent[];
  userRegisteredEventIds: string[];
  selectedCategory: EventCategory | 'All';
  onSelectCategory: (category: EventCategory | 'All') => void;
  onSelectEvent: (eventId: string) => void;
  onRegisterQuick: (eventId: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onCreateEventClick: () => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({
  events,
  userRegisteredEventIds,
  selectedCategory,
  onSelectCategory,
  onSelectEvent,
  onRegisterQuick,
  searchQuery,
  setSearchQuery,
  onCreateEventClick,
}) => {
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [sortBy, setSortBy] = useState<'date-asc' | 'date-desc' | 'popular' | 'spots'>('date-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories: (EventCategory | 'All')[] = [
    'All',
    'Technology',
    'Cultural',
    'Sports',
    'Workshop',
    'Academic',
    'Social',
  ];

  // Filtering and sorting
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      // Category match
      if (selectedCategory !== 'All' && e.category !== selectedCategory) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = e.title.toLowerCase().includes(q);
        const matchesDesc = e.description.toLowerCase().includes(q);
        const matchesLoc = e.location.toLowerCase().includes(q);
        const matchesOrg = e.organizerName.toLowerCase().includes(q);
        const matchesTag = e.tags?.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesLoc && !matchesOrg && !matchesTag) {
          return false;
        }
      }

      // Date match
      if (dateFilter !== 'all') {
        const eventDate = new Date(e.date + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dateFilter === 'today') {
          return eventDate.toDateString() === today.toDateString();
        } else if (dateFilter === 'week') {
          const sevenDaysLater = new Date(today);
          sevenDaysLater.setDate(today.getDate() + 7);
          return eventDate >= today && eventDate <= sevenDaysLater;
        } else if (dateFilter === 'month') {
          const thirtyDaysLater = new Date(today);
          thirtyDaysLater.setDate(today.getDate() + 30);
          return eventDate >= today && eventDate <= thirtyDaysLater;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date-asc') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === 'date-desc') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'popular') {
        return (b.registeredCount || 0) - (a.registeredCount || 0);
      } else if (sortBy === 'spots') {
        const spotsA = a.capacity - a.registeredCount;
        const spotsB = b.capacity - b.registeredCount;
        return spotsA - spotsB;
      }
      return 0;
    });
  }, [events, selectedCategory, searchQuery, dateFilter, sortBy]);

  const resetAllFilters = () => {
    onSelectCategory('All');
    setSearchQuery('');
    setDateFilter('all');
    setSortBy('date-asc');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Events Schedule</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Campus Events
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search, filter by category or date, and register for university activities.
          </p>
        </div>

        <button
          onClick={onCreateEventClick}
          className="self-start md:self-auto py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Host a New Event</span>
        </button>
      </div>

      {/* Control Bar: Search, Category Tabs & Filters */}
      <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        {/* Row 1: Search & Sort & View */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event title, speaker, department, venue..."
              className="w-full pl-10 pr-9 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 hidden xl:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="date-asc">Date: Upcoming First</option>
                <option value="date-desc">Date: Furthest Out</option>
                <option value="popular">Most Popular</option>
                <option value="spots">Fewest Spots Left</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Category Filter Buttons (Functional Tabs) */}
        <div className="pt-2 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 text-xs mr-1 shrink-0">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Date Range Segmented Controls */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs self-start md:self-auto shrink-0">
            <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
            <button
              onClick={() => setDateFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                dateFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Dates
            </button>
            <button
              onClick={() => setDateFilter('today')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                dateFilter === 'today' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setDateFilter('week')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                dateFilter === 'week' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Next 7 Days
            </button>
            <button
              onClick={() => setDateFilter('month')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                dateFilter === 'month' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              This Month
            </button>
          </div>
        </div>
      </div>

      {/* Results Header / Active Filters indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div>
          Showing <span className="font-bold text-slate-800 font-mono tabular-nums">{filteredEvents.length}</span> campus event{filteredEvents.length === 1 ? '' : 's'}
          {selectedCategory !== 'All' && <span> in <strong className="text-slate-700">{selectedCategory}</strong></span>}
          {searchQuery && <span> matching "<strong className="text-slate-700">{searchQuery}</strong>"</span>}
        </div>

        {(selectedCategory !== 'All' || searchQuery || dateFilter !== 'all') && (
          <button
            onClick={resetAllFilters}
            className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Event Grid or List */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No events matched your criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Try adjusting your search query, clearing category filters, or selecting a broader date range.
          </p>
          <button
            onClick={resetAllFilters}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isRegistered={userRegisteredEventIds.includes(event.id)}
              onViewDetails={onSelectEvent}
              onRegisterQuick={onRegisterQuick}
            />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {filteredEvents.map((event) => {
            const isRegistered = userRegisteredEventIds.includes(event.id);
            const isFull = event.registeredCount >= event.capacity;
            return (
              <div
                key={event.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col md:flex-row gap-5 hover:border-indigo-300 transition-all shadow-xs hover:shadow-md"
              >
                <div 
                  className="w-full md:w-56 h-36 rounded-xl overflow-hidden bg-slate-100 shrink-0 cursor-pointer relative"
                  onClick={() => onSelectEvent(event.id)}
                >
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded bg-white/90 backdrop-blur-xs text-indigo-700">
                    {event.category}
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="font-semibold text-slate-700">{event.date}</span>
                      <span>·</span>
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{event.time}</span>
                    </div>

                    <h3
                      onClick={() => onSelectEvent(event.id)}
                      className="text-base sm:text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1 mb-1.5"
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

                  <div className="pt-3 border-t border-slate-100 mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Organizer: <strong className="text-slate-700">{event.organizerName}</strong></span>
                      <span className="font-mono tabular-nums">
                        Registered: <strong className="text-slate-800">{event.registeredCount}</strong> / {event.capacity}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => onSelectEvent(event.id)}
                        className="py-1.5 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Details
                      </button>
                      {isRegistered ? (
                        <button
                          onClick={() => onSelectEvent(event.id)}
                          className="py-1.5 px-3 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold"
                        >
                          View Pass
                        </button>
                      ) : isFull ? (
                        <button
                          disabled
                          className="py-1.5 px-3 rounded-lg bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed"
                        >
                          Full
                        </button>
                      ) : (
                        <button
                          onClick={() => onRegisterQuick(event.id)}
                          className="py-1.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
                        >
                          Register
                        </button>
                      )}
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
