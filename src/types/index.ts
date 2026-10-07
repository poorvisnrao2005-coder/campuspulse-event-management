export type EventCategory = 
  | 'Technology' 
  | 'Cultural' 
  | 'Sports' 
  | 'Workshop' 
  | 'Academic' 
  | 'Social';

export interface Participant {
  id: string;
  eventId: string;
  userId: string;
  fullName: string;
  email: string;
  studentId: string;
  department: string;
  registeredAt: string;
  ticketId: string;
  checkedIn: boolean;
}

export interface CollegeEvent {
  id: string;
  title: string;
  category: EventCategory;
  date: string; // YYYY-MM-DD
  time: string; // e.g., "10:00 AM - 4:00 PM"
  location: string; // e.g., "Main Auditorium, Campus Block A"
  description: string;
  shortDescription?: string;
  organizerName: string;
  organizerEmail: string;
  organizerDept: string;
  imageUrl: string;
  capacity: number;
  registeredCount: number;
  price: string; // e.g. "Free" or "₹100" / "$10"
  tags: string[];
  createdBy: string; // User ID
  createdAt: string;
  isFeatured?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
  role: 'student' | 'organizer' | 'admin';
  avatar?: string;
}

export type Page = 
  | 'home' 
  | 'events' 
  | 'event-details' 
  | 'create-event' 
  | 'edit-event' 
  | 'my-events' 
  | 'my-registrations' 
  | 'dashboard' 
  | 'auth';
