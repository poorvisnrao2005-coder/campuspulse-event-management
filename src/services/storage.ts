import { CollegeEvent, Participant, User } from '../types';
import { INITIAL_EVENTS, INITIAL_PARTICIPANTS, DEFAULT_USERS } from '../data/mockEvents';

const STORAGE_KEYS = {
  EVENTS: 'campuspulse_events_v1',
  PARTICIPANTS: 'campuspulse_participants_v1',
  USERS: 'campuspulse_users_v1',
  CURRENT_USER: 'campuspulse_current_user_v1',
};

export const StorageService = {
  getUsers(): User[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  },

  getCurrentUser(): User {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    const defaultUser = DEFAULT_USERS[0]; // Alex Rivera (Organizer)
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(defaultUser));
    return defaultUser;
  },

  setCurrentUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },

  addUser(user: User): void {
    const users = this.getUsers();
    if (!users.some(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase())) {
      users.push(user);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
  },

  getEvents(): CollegeEvent[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EVENTS);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
    return INITIAL_EVENTS;
  },

  saveEvents(events: CollegeEvent[]): void {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  },

  getEventById(id: string): CollegeEvent | undefined {
    const events = this.getEvents();
    return events.find(e => e.id === id);
  },

  createEvent(event: Omit<CollegeEvent, 'id' | 'createdAt' | 'registeredCount'>): CollegeEvent {
    const events = this.getEvents();
    const newEvent: CollegeEvent = {
      ...event,
      id: `event-${Date.now()}`,
      createdAt: new Date().toISOString(),
      registeredCount: 0,
    };
    events.unshift(newEvent);
    this.saveEvents(events);
    return newEvent;
  },

  updateEvent(updatedEvent: CollegeEvent): void {
    const events = this.getEvents();
    const index = events.findIndex(e => e.id === updatedEvent.id);
    if (index !== -1) {
      events[index] = updatedEvent;
      this.saveEvents(events);
    }
  },

  deleteEvent(id: string): void {
    let events = this.getEvents();
    events = events.filter(e => e.id !== id);
    this.saveEvents(events);

    // Also remove associated participants
    let participants = this.getParticipants();
    participants = participants.filter(p => p.eventId !== id);
    this.saveParticipants(participants);
  },

  getParticipants(): Participant[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(INITIAL_PARTICIPANTS));
    return INITIAL_PARTICIPANTS;
  },

  saveParticipants(participants: Participant[]): void {
    localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(participants));
  },

  getParticipantsForEvent(eventId: string): Participant[] {
    return this.getParticipants().filter(p => p.eventId === eventId);
  },

  getRegistrationsForUser(userId: string): Participant[] {
    return this.getParticipants().filter(p => p.userId === userId);
  },

  isUserRegistered(eventId: string, userId: string): boolean {
    return this.getParticipants().some(p => p.eventId === eventId && p.userId === userId);
  },

  registerForEvent(eventId: string, user: User): { success: boolean; message: string; participant?: Participant } {
    const event = this.getEventById(eventId);
    if (!event) return { success: false, message: 'Event not found.' };

    const participants = this.getParticipants();
    if (participants.some(p => p.eventId === eventId && p.userId === user.id)) {
      return { success: false, message: 'You are already registered for this event!' };
    }

    if (event.registeredCount >= event.capacity) {
      return { success: false, message: 'Sorry, this event is already at maximum capacity.' };
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const codePrefix = event.category.substring(0, 3).toUpperCase();
    const newParticipant: Participant = {
      id: `part-${Date.now()}-${randomSuffix}`,
      eventId,
      userId: user.id,
      fullName: user.name,
      email: user.email,
      studentId: user.studentId || `STU-${randomSuffix}`,
      department: user.department || 'General',
      registeredAt: new Date().toISOString(),
      ticketId: `CP-${codePrefix}-${randomSuffix}`,
      checkedIn: false
    };

    participants.unshift(newParticipant);
    this.saveParticipants(participants);

    // Update event counter
    event.registeredCount = (event.registeredCount || 0) + 1;
    this.updateEvent(event);

    return { success: true, message: 'Registration confirmed! Check your digital pass.', participant: newParticipant };
  },

  cancelRegistration(eventId: string, userId: string): boolean {
    let participants = this.getParticipants();
    const exists = participants.some(p => p.eventId === eventId && p.userId === userId);
    if (!exists) return false;

    participants = participants.filter(p => !(p.eventId === eventId && p.userId === userId));
    this.saveParticipants(participants);

    const event = this.getEventById(eventId);
    if (event && event.registeredCount > 0) {
      event.registeredCount -= 1;
      this.updateEvent(event);
    }
    return true;
  },

  toggleCheckIn(participantId: string): boolean {
    const participants = this.getParticipants();
    const participant = participants.find(p => p.id === participantId);
    if (!participant) return false;

    participant.checkedIn = !participant.checkedIn;
    this.saveParticipants(participants);
    return true;
  },

  resetToDefaults(): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
    localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(INITIAL_PARTICIPANTS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USERS[0]));
  }
};
