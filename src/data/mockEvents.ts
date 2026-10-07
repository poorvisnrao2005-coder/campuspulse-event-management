import { CollegeEvent, Participant, User } from '../types';

export const DEFAULT_USERS: User[] = [
  {
    id: 'user-alex',
    name: 'Alex Rivera',
    email: 'alex.rivera@campus.edu',
    studentId: 'CS-2023-042',
    department: 'Computer Science & Engineering',
    role: 'organizer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-priya',
    name: 'Priya Sharma',
    email: 'priya.sharma@campus.edu',
    studentId: 'EC-2023-118',
    department: 'Electronics & Communication',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-marcus',
    name: 'Marcus Vance',
    email: 'marcus.v@campus.edu',
    studentId: 'ME-2022-089',
    department: 'Mechanical Engineering',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  }
];

export const PRESET_EVENT_IMAGES = [
  {
    name: 'Tech & Hackathon',
    url: '/src/assets/images/event_tech_hackathon_1791290039047.jpg',
    category: 'Technology'
  },
  {
    name: 'Cultural Festival & Music',
    url: '/src/assets/images/event_cultural_fest_1791290059090.jpg',
    category: 'Cultural'
  },
  {
    name: 'Athletics & Sports Meet',
    url: '/src/assets/images/event_sports_meet_1791290073213.jpg',
    category: 'Sports'
  },
  {
    name: 'Robotics & AI Workshop',
    url: '/src/assets/images/event_robotics_workshop_1791290092906.jpg',
    category: 'Workshop'
  }
];

export const INITIAL_EVENTS: CollegeEvent[] = [
  {
    id: 'event-hackathon-2026',
    title: 'HackPulse 2026: 24-Hour Campus Hackathon',
    category: 'Technology',
    date: '2026-10-24',
    time: '09:00 AM - 09:00 AM (Next Day)',
    location: 'Innovation Hub, Block C (3rd Floor)',
    shortDescription: 'Collaborate with fellow innovators to build AI and web solutions with cash prizes and mentor feedback.',
    description: 'Join HackPulse 2026, the biggest annual 24-hour hackathon on campus! Open to all branches and years. Teams of 2 to 4 students will tackle challenges in Smart Campus, Generative AI, Sustainable Tech, and Healthcare. Mentors from top tech firms will be present. Free food, stickers, certificates, and exciting prizes worth over ₹50,000!',
    organizerName: 'Alex Rivera (Coding Club President)',
    organizerEmail: 'alex.rivera@campus.edu',
    organizerDept: 'Computer Science Department',
    imageUrl: '/src/assets/images/event_tech_hackathon_1791290039047.jpg',
    capacity: 120,
    registeredCount: 84,
    price: 'Free',
    tags: ['Hackathon', 'Coding', 'Prizes', 'Team Event', 'AI'],
    createdBy: 'user-alex',
    createdAt: '2026-10-01T10:00:00Z',
    isFeatured: true
  },
  {
    id: 'event-cultural-fest',
    title: 'Aura 2026: Annual Inter-College Cultural Extravaganza',
    category: 'Cultural',
    date: '2026-11-06',
    time: '04:00 PM - 10:00 PM',
    location: 'Open Air Amphitheatre',
    shortDescription: 'Experience sensational live bands, acoustic sets, dance battles, and campus street food.',
    description: 'Get ready for an electric evening of music, theater, dance, and creative arts! Featuring live performances by student bands, a classical dance showcase, beatboxing showdown, and celebrity guest DJ set. Food stalls with cuisines from across the country will be set up.',
    organizerName: 'Cultural Committee & Arts Council',
    organizerEmail: 'cultural.council@campus.edu',
    organizerDept: 'Student Affairs',
    imageUrl: '/src/assets/images/event_cultural_fest_1791290059090.jpg',
    capacity: 500,
    registeredCount: 382,
    price: 'Free',
    tags: ['Music', 'Dance', 'Concert', 'Food Stalls', 'Fest'],
    createdBy: 'user-alex',
    createdAt: '2026-10-02T14:30:00Z',
    isFeatured: true
  },
  {
    id: 'event-robotics-workshop',
    title: 'Hands-on ROS & Autonomous Rover Workshop',
    category: 'Workshop',
    date: '2026-10-18',
    time: '01:30 PM - 05:30 PM',
    location: 'Mechatronics Lab 2, Mechanical Wing',
    shortDescription: 'Learn robot operating systems, sensor interfacing, and hardware kinematics from scratch.',
    description: 'A comprehensive, practical workshop on microcontrollers, sensor integration (LiDAR & ultrasonic), and robot navigation using ROS2. Hardware kits provided for hands-on exercises in pairs. Certificate of completion provided to all attendees.',
    organizerName: 'Dr. Katherine Wood & Alex Rivera',
    organizerEmail: 'robotics.club@campus.edu',
    organizerDept: 'Robotics & Automation Club',
    imageUrl: '/src/assets/images/event_robotics_workshop_1791290092906.jpg',
    capacity: 45,
    registeredCount: 38,
    price: 'Free',
    tags: ['Robotics', 'Hardware', 'Hands-on', 'Certificate'],
    createdBy: 'user-alex',
    createdAt: '2026-10-03T11:20:00Z',
    isFeatured: true
  },
  {
    id: 'event-sports-meet',
    title: 'Inter-Department Athletics & Sports Championship',
    category: 'Sports',
    date: '2026-11-14',
    time: '08:00 AM - 06:00 PM',
    location: 'University Sports Complex & Track',
    shortDescription: 'Compete in sprint events, football, basketball, and relay races for department glory.',
    description: 'The annual inter-department sports tournament is here! Over 15 athletic events including 100m, 400m, 4x100m Relay, Long Jump, Basketball finals, and Tug of War. Cheer for your branch, win medals, and celebrate true sportsmanship.',
    organizerName: 'Physical Education Department',
    organizerEmail: 'sports@campus.edu',
    organizerDept: 'Athletics & PE Dept',
    imageUrl: '/src/assets/images/event_sports_meet_1791290073213.jpg',
    capacity: 300,
    registeredCount: 215,
    price: 'Free',
    tags: ['Athletics', 'Track & Field', 'Tournament', 'Fitness'],
    createdBy: 'user-marcus',
    createdAt: '2026-10-04T09:15:00Z',
    isFeatured: false
  },
  {
    id: 'event-ai-symposium',
    title: 'NextGen AI & Research Colloquium',
    category: 'Academic',
    date: '2026-10-30',
    time: '10:00 AM - 03:00 PM',
    location: 'Seminar Hall 1, Central Library',
    shortDescription: 'Keynote presentations on Machine Learning ethics, quantum computing, and paper submissions.',
    description: 'Leading researchers and visiting professors discuss advancements in Foundation Models, Vision AI, and Scientific Computing. Students can submit abstract posters for review and prize awards.',
    organizerName: 'Research & Development Cell',
    organizerEmail: 'research.cell@campus.edu',
    organizerDept: 'Academic Affairs',
    imageUrl: '/src/assets/images/event_tech_hackathon_1791290039047.jpg',
    capacity: 100,
    registeredCount: 72,
    price: 'Free',
    tags: ['Research', 'AI', 'Keynote', 'Poster Session'],
    createdBy: 'user-alex',
    createdAt: '2026-10-05T08:00:00Z',
    isFeatured: false
  },
  {
    id: 'event-freshers-welcome',
    title: 'Freshers Social & Networking Mixer',
    category: 'Social',
    date: '2026-10-20',
    time: '05:00 PM - 08:30 PM',
    location: 'Student Activity Center (SAC) Lawn',
    shortDescription: 'Meet club heads, seniors, and peers with fun icebreakers, games, and campus snacks.',
    description: 'Welcome freshers to campus life! An evening of engaging icebreakers, trivia quizzes, interactive club booths, and snacks. The perfect opportunity to discover campus societies, ask questions, and build lasting friendships.',
    organizerName: 'Student Council',
    organizerEmail: 'studentcouncil@campus.edu',
    organizerDept: 'Student Leadership Body',
    imageUrl: '/src/assets/images/event_cultural_fest_1791290059090.jpg',
    capacity: 250,
    registeredCount: 198,
    price: 'Free',
    tags: ['Freshers', 'Social', 'Networking', 'Games'],
    createdBy: 'user-alex',
    createdAt: '2026-10-05T16:00:00Z',
    isFeatured: false
  }
];

export const INITIAL_PARTICIPANTS: Participant[] = [
  {
    id: 'part-1',
    eventId: 'event-hackathon-2026',
    userId: 'user-priya',
    fullName: 'Priya Sharma',
    email: 'priya.sharma@campus.edu',
    studentId: 'EC-2023-118',
    department: 'Electronics & Communication',
    registeredAt: '2026-10-02T11:20:00Z',
    ticketId: 'CP-HACK-8401',
    checkedIn: true
  },
  {
    id: 'part-2',
    eventId: 'event-hackathon-2026',
    userId: 'user-marcus',
    fullName: 'Marcus Vance',
    email: 'marcus.v@campus.edu',
    studentId: 'ME-2022-089',
    department: 'Mechanical Engineering',
    registeredAt: '2026-10-03T14:10:00Z',
    ticketId: 'CP-HACK-8402',
    checkedIn: false
  },
  {
    id: 'part-3',
    eventId: 'event-hackathon-2026',
    userId: 'user-rohit',
    fullName: 'Rohit Kulkarni',
    email: 'rohit.k@campus.edu',
    studentId: 'CS-2024-004',
    department: 'Computer Science',
    registeredAt: '2026-10-04T09:45:00Z',
    ticketId: 'CP-HACK-8403',
    checkedIn: false
  },
  {
    id: 'part-4',
    eventId: 'event-cultural-fest',
    userId: 'user-priya',
    fullName: 'Priya Sharma',
    email: 'priya.sharma@campus.edu',
    studentId: 'EC-2023-118',
    department: 'Electronics & Communication',
    registeredAt: '2026-10-03T16:00:00Z',
    ticketId: 'CP-AURA-3821',
    checkedIn: false
  },
  {
    id: 'part-5',
    eventId: 'event-robotics-workshop',
    userId: 'user-priya',
    fullName: 'Priya Sharma',
    email: 'priya.sharma@campus.edu',
    studentId: 'EC-2023-118',
    department: 'Electronics & Communication',
    registeredAt: '2026-10-04T12:00:00Z',
    ticketId: 'CP-ROBO-3801',
    checkedIn: true
  }
];
