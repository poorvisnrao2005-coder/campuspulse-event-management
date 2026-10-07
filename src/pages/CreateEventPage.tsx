import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User as UserIcon, 
  Users, 
  Image as ImageIcon, 
  Tag, 
  FileText, 
  Check, 
  ArrowLeft,
  Sparkles,
  Info
} from 'lucide-react';
import { CollegeEvent, EventCategory, User } from '../types';
import { PRESET_EVENT_IMAGES } from '../data/mockEvents';

interface CreateEventPageProps {
  currentUser: User;
  editEvent?: CollegeEvent | null;
  onSaveEvent: (eventData: any) => void;
  onCancel: () => void;
}

export const CreateEventPage: React.FC<CreateEventPageProps> = ({
  currentUser,
  editEvent,
  onSaveEvent,
  onCancel,
}) => {
  const isEditing = Boolean(editEvent);

  const [title, setTitle] = useState(editEvent?.title || '');
  const [category, setCategory] = useState<EventCategory>(editEvent?.category || 'Technology');
  const [date, setDate] = useState(editEvent?.date || '2026-10-25');
  const [time, setTime] = useState(editEvent?.time || '10:00 AM - 04:00 PM');
  const [location, setLocation] = useState(editEvent?.location || 'Main Auditorium, Campus Block A');
  const [shortDescription, setShortDescription] = useState(editEvent?.shortDescription || '');
  const [description, setDescription] = useState(editEvent?.description || '');
  const [organizerName, setOrganizerName] = useState(editEvent?.organizerName || currentUser.name);
  const [organizerEmail, setOrganizerEmail] = useState(editEvent?.organizerEmail || currentUser.email);
  const [organizerDept, setOrganizerDept] = useState(editEvent?.organizerDept || currentUser.department);
  const [capacity, setCapacity] = useState<number>(editEvent?.capacity || 100);
  const [price, setPrice] = useState(editEvent?.price || 'Free');
  const [imageUrl, setImageUrl] = useState(editEvent?.imageUrl || PRESET_EVENT_IMAGES[0].url);
  const [tagsInput, setTagsInput] = useState(editEvent?.tags?.join(', ') || 'College, CampusEvent');
  const [errorMsg, setErrorMsg] = useState('');

  // When category changes, if user hasn't set custom image, suggest matching preset
  const handleCategoryChange = (newCat: EventCategory) => {
    setCategory(newCat);
    const match = PRESET_EVENT_IMAGES.find(p => p.category === newCat);
    if (match) {
      setImageUrl(match.url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter an event name.');
      return;
    }
    if (!location.trim()) {
      setErrorMsg('Please enter a campus venue/location.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please write an event description.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const eventPayload = {
      ...(editEvent ? { id: editEvent.id, createdAt: editEvent.createdAt, registeredCount: editEvent.registeredCount } : {}),
      title: title.trim(),
      category,
      date,
      time: time.trim(),
      location: location.trim(),
      shortDescription: shortDescription.trim() || description.substring(0, 110) + '...',
      description: description.trim(),
      organizerName: organizerName.trim(),
      organizerEmail: organizerEmail.trim(),
      organizerDept: organizerDept.trim(),
      capacity: Number(capacity) || 50,
      price: price.trim() || 'Free',
      imageUrl,
      tags,
      createdBy: editEvent?.createdBy || currentUser.id,
    };

    onSaveEvent(eventPayload);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors py-1 px-2.5 rounded-lg hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className="text-xs text-slate-400 font-mono">
          Organizer: {currentUser.name} ({currentUser.department})
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Container (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                {isEditing ? 'Update Event' : 'Create New Event'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isEditing ? 'Edit Campus Event' : 'Host a College Event'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Provide event details, select a cover photo, and specify venue capacity.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Event Name *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. CodeCamp 2026: Annual Inter-College Hackathon"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
              />
            </div>

            {/* Category & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value as EventCategory)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                >
                  <option value="Technology">Technology</option>
                  <option value="Cultural">Cultural & Arts</option>
                  <option value="Sports">Sports & Athletics</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Academic">Academic Seminar</option>
                  <option value="Social">Social & Club Mixer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Registration Entry Fee
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. Free or ₹100"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                />
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Date (YYYY-MM-DD) *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Time / Duration *
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 10:00 AM - 04:00 PM"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Location & Capacity */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Campus Venue / Location *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-rose-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Main Auditorium, Block A (Ground Floor)"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Max Capacity
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="1"
                    max="2000"
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-mono text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Image Selector / Presets */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Event Banner Photo
              </label>
              <p className="text-[11px] text-slate-500 mb-2">
                Choose a high-resolution college theme or enter a direct image URL.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {PRESET_EVENT_IMAGES.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`relative rounded-xl overflow-hidden aspect-[16/10] border-2 transition-all ${
                      imageUrl === preset.url
                        ? 'border-indigo-600 ring-2 ring-indigo-200 scale-[1.02]'
                        : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2 text-left">
                      <span className="text-[10px] text-white font-medium line-clamp-1">{preset.name}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="relative">
                <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Or paste an image URL..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-slate-600"
                />
              </div>
            </div>

            {/* Organizer Info (Auto-filled with user, editable) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Organizer Contact Details
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Organizer Name</label>
                  <input
                    type="text"
                    required
                    value={organizerName}
                    onChange={(e) => setOrganizerName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Department / Society</label>
                  <input
                    type="text"
                    required
                    value={organizerDept}
                    onChange={(e) => setOrganizerDept(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Official Email</label>
                  <input
                    type="email"
                    required
                    value={organizerEmail}
                    onChange={(e) => setOrganizerEmail(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Short Summary & Full Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Brief Hook (1-2 sentences)
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="e.g. Learn ROS2 and autonomous rover kinematics in a 4-hour hands-on lab."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Description & Agenda *
              </label>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the event schedule, rules, guidelines, what attendees should bring, prizes, and requirements..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed text-slate-900"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Tags (Comma Separated)
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Coding, AI, FreeStickers, Prizes"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="py-2.5 px-5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>{isEditing ? 'Save Changes' : 'Publish Campus Event'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Card (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Live Student View Preview</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden sticky top-20">
            <div className="aspect-[16/9] w-full bg-slate-100 overflow-hidden relative">
              <img
                src={imageUrl}
                alt="Preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded bg-white/90 text-indigo-700">
                {category}
              </div>
              <div className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500 text-white">
                {price}
              </div>
            </div>

            <div className="p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Calendar className="w-3 h-3 text-indigo-500" />
                <span className="font-semibold text-slate-700">{date || 'YYYY-MM-DD'}</span>
                <span>·</span>
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{time || 'Time'}</span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm line-clamp-2">
                {title || 'Event Name Will Appear Here'}
              </h3>

              <div className="flex items-center gap-1 text-[11px] text-slate-600">
                <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                <span className="truncate">{location || 'Campus Location'}</span>
              </div>

              <p className="text-[11px] text-slate-500 line-clamp-2">
                {shortDescription || description || 'Your event description snippet will show here.'}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="truncate max-w-[120px]">{organizerName || 'Organizer'}</span>
                <span className="font-mono">0 / {capacity}</span>
              </div>

              <button
                disabled
                className="w-full mt-2 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg opacity-80 cursor-default text-center"
              >
                Register Button
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
