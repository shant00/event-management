export enum EventCategory {
    CONFERENCE = 'Conference',
    WORKSHOP = 'Workshop',
    MEETUP = 'Meetup',
    SEMINAR = 'Seminar',
    NETWORKING = 'Networking',
    WEBINAR = 'Webinar',
    TRAINING = 'Training'
}

export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    category: EventCategory;
    createdBy: string;
    rsvps: string[];
    createdAt: string;
    updatedAt?: string;
    maxAttendees?: number;
    imageUrl?: string;
    tags?: string[];
}

export interface EventFormData {
    title: string;
    description: string;
    date: string;
    location: string;
    category: EventCategory;
    maxAttendees?: number;
    imageUrl?: string;
    tags?: string[];
}

export interface EventFilters {
    search: string;
    category: EventCategory | 'all';
    dateRange?: {
        start: string;
        end: string;
    };
}

export interface EventContextType {
    events: Event[];
    loading: boolean;
    createEvent: (eventData: EventFormData) => Event;
    updateEvent: (eventId: string, updates: Partial<Event>) => void;
    deleteEvent: (eventId: string) => void;
    toggleRSVP: (eventId: string, userId?: string) => void;
    getEventById: (id: string) => Event | undefined;
    getMyEvents: () => Event[];
}