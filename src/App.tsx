import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { TicketModal } from './components/TicketModal';
import { ParticipantsModal } from './components/ParticipantsModal';
import { AuthModal } from './components/AuthModal';

import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { CreateEventPage } from './pages/CreateEventPage';
import { MyEventsPage } from './pages/MyEventsPage';
import { MyRegistrationsPage } from './pages/MyRegistrationsPage';
import { DashboardPage } from './pages/DashboardPage';

import { StorageService } from './services/storage';
import { CollegeEvent, EventCategory, Page, Participant, User } from './types';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentUser, setCurrentUser] = useState<User>(() => StorageService.getCurrentUser());
  const [events, setEvents] = useState<CollegeEvent[]>(() => StorageService.getEvents());
  const [participants, setParticipants] = useState<Participant[]>(() => StorageService.getParticipants());

  // Routing and filter states
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingEvent, setEditingEvent] = useState<CollegeEvent | null>(null);

  // Modals state
  const [ticketModalData, setTicketModalData] = useState<{ event: CollegeEvent; participant: Participant } | null>(null);
  const [participantsModalEvent, setParticipantsModalEvent] = useState<CollegeEvent | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Toast feedback state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  };

  // Sync state whenever storage changes or on mount
  const refreshData = () => {
    setEvents(StorageService.getEvents());
    setParticipants(StorageService.getParticipants());
  };

  // Switch active user
  const handleSwitchUser = (user: User) => {
    StorageService.setCurrentUser(user);
    setCurrentUser(user);
    showToast(`Switched account to ${user.name} (${user.role})`);
  };

  // Open single event details
  const handleSelectEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    setCurrentPage('event-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Register for an event
  const handleRegister = (eventId: string) => {
    const res = StorageService.registerForEvent(eventId, currentUser);
    if (res.success && res.participant) {
      refreshData();
      showToast(res.message, 'success');
      const targetEvent = StorageService.getEventById(eventId);
      if (targetEvent) {
        setTicketModalData({ event: targetEvent, participant: res.participant });
      }
    } else {
      showToast(res.message, 'error');
    }
  };

  // Cancel registration
  const handleCancelRegistration = (eventId: string) => {
    const success = StorageService.cancelRegistration(eventId, currentUser.id);
    if (success) {
      refreshData();
      showToast('Registration cancelled.', 'success');
    }
  };

  // Create or Update Event
  const handleSaveEvent = (eventData: any) => {
    if (editingEvent) {
      StorageService.updateEvent(eventData as CollegeEvent);
      refreshData();
      showToast(`Updated "${eventData.title}" successfully!`);
      setEditingEvent(null);
      setSelectedEventId(eventData.id);
      setCurrentPage('event-details');
    } else {
      const created = StorageService.createEvent(eventData);
      refreshData();
      showToast(`Published "${created.title}" successfully!`);
      setSelectedEventId(created.id);
      setCurrentPage('event-details');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Edit Event triggered
  const handleStartEditEvent = (event: CollegeEvent) => {
    setEditingEvent(event);
    setCurrentPage('create-event');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete Event
  const handleDeleteEvent = (eventId: string) => {
    StorageService.deleteEvent(eventId);
    refreshData();
    showToast('Event removed from campus calendar.');
    if (currentPage === 'event-details') {
      setCurrentPage('my-events');
    }
  };

  // Toggle check-in status
  const handleToggleCheckIn = (participantId: string) => {
    StorageService.toggleCheckIn(participantId);
    refreshData();
  };

  // Reset demo data
  const handleResetData = () => {
    if (confirm('Reset all events and registrations to the initial demo state?')) {
      StorageService.resetToDefaults();
      refreshData();
      setCurrentUser(StorageService.getCurrentUser());
      showToast('All demo events and registrations have been reset.');
      setCurrentPage('home');
    }
  };

  // List of event IDs registered by current user
  const userRegisteredEventIds = participants
    .filter(p => p.userId === currentUser.id)
    .map(p => p.eventId);

  const selectedEvent = selectedEventId ? events.find(e => e.id === selectedEventId) : null;
  const selectedEventParticipant = selectedEventId 
    ? participants.find(p => p.eventId === selectedEventId && p.userId === currentUser.id)
    : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-3 duration-200">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold ${
            toast.type === 'success'
              ? 'bg-slate-900 text-white border-slate-800'
              : 'bg-rose-600 text-white border-rose-500'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-300 shrink-0" />
            )}
            <span>{toast.message}</span>
            <button 
              onClick={() => setToast(null)}
              className="ml-2 p-0.5 text-white/60 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={(page) => {
          if (page === 'create-event') {
            setEditingEvent(null);
          }
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onSelectEventId={setSelectedEventId}
        registeredCount={userRegisteredEventIds.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            events={events}
            userRegisteredEventIds={userRegisteredEventIds}
            onNavigate={(page) => {
              if (page === 'create-event') setEditingEvent(null);
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectEvent={handleSelectEvent}
            onSelectCategoryFilter={(cat) => {
              setSelectedCategory(cat);
              setCurrentPage('events');
            }}
            onRegisterQuick={handleRegister}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {currentPage === 'events' && (
          <EventsPage
            events={events}
            userRegisteredEventIds={userRegisteredEventIds}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectEvent={handleSelectEvent}
            onRegisterQuick={handleRegister}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onCreateEventClick={() => {
              setEditingEvent(null);
              setCurrentPage('create-event');
            }}
          />
        )}

        {currentPage === 'event-details' && selectedEvent && (
          <EventDetailsPage
            event={selectedEvent}
            currentUser={currentUser}
            isRegistered={userRegisteredEventIds.includes(selectedEvent.id)}
            participant={selectedEventParticipant}
            participantsCount={events.find(e => e.id === selectedEvent.id)?.registeredCount || 0}
            onBack={() => setCurrentPage('events')}
            onRegister={handleRegister}
            onCancelRegistration={handleCancelRegistration}
            onViewTicket={() => {
              if (selectedEventParticipant) {
                setTicketModalData({ event: selectedEvent, participant: selectedEventParticipant });
              }
            }}
            onViewParticipantsList={() => setParticipantsModalEvent(selectedEvent)}
            onEditEvent={handleStartEditEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        )}

        {currentPage === 'create-event' && (
          <CreateEventPage
            currentUser={currentUser}
            editEvent={editingEvent}
            onSaveEvent={handleSaveEvent}
            onCancel={() => setCurrentPage(editingEvent ? 'event-details' : 'events')}
          />
        )}

        {currentPage === 'my-events' && (
          <MyEventsPage
            events={events}
            currentUser={currentUser}
            onCreateEventClick={() => {
              setEditingEvent(null);
              setCurrentPage('create-event');
            }}
            onEditEvent={handleStartEditEvent}
            onDeleteEvent={handleDeleteEvent}
            onViewEventDetails={handleSelectEvent}
            onViewParticipants={(event) => setParticipantsModalEvent(event)}
          />
        )}

        {currentPage === 'my-registrations' && (
          <MyRegistrationsPage
            events={events}
            participants={participants}
            currentUser={currentUser}
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewEventDetails={handleSelectEvent}
            onOpenTicket={(event, participant) => setTicketModalData({ event, participant })}
            onCancelRegistration={handleCancelRegistration}
          />
        )}

        {currentPage === 'dashboard' && (
          <DashboardPage
            currentUser={currentUser}
            events={events}
            participants={participants}
            onNavigate={(page) => {
              if (page === 'create-event') setEditingEvent(null);
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectEvent={handleSelectEvent}
            onOpenTicket={(event, participant) => setTicketModalData({ event, participant })}
            onSwitchUser={handleSwitchUser}
          />
        )}
      </main>

      {/* Modals */}
      {ticketModalData && (
        <TicketModal
          isOpen={Boolean(ticketModalData)}
          onClose={() => setTicketModalData(null)}
          event={ticketModalData.event}
          participant={ticketModalData.participant}
          onCancelRegistration={() => handleCancelRegistration(ticketModalData.event.id)}
        />
      )}

      {participantsModalEvent && (
        <ParticipantsModal
          isOpen={Boolean(participantsModalEvent)}
          onClose={() => setParticipantsModalEvent(null)}
          event={participantsModalEvent}
          participants={participants.filter(p => p.eventId === participantsModalEvent.id)}
          onToggleCheckIn={handleToggleCheckIn}
        />
      )}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={(user) => {
          handleSwitchUser(user);
          refreshData();
        }}
        currentUser={currentUser}
      />

      {/* Footer */}
      <Footer
        onNavigate={(page) => {
          if (page === 'create-event') setEditingEvent(null);
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onResetData={handleResetData}
      />
    </div>
  );
}
