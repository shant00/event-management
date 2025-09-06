'use client';

import { generateId } from '@/lib/utils';
import { Event, EventCategory, EventContextType, EventFormData } from '@/types/event';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

const mockEvents: Event[] = [
    {
        id: '1',
        title: 'React Developer Conference 2025',
        description: 'Join us for the biggest React conference of the year featuring industry experts, hands-on workshops, and networking opportunities. Learn about the latest React features, best practices, and upcoming trends.',
        date: '2025-10-15T10:00:00',
        location: 'Tech Convention Center, San Francisco',
        category: EventCategory.CONFERENCE,
        createdBy: 'system',
        rsvps: ['user1', 'user2', 'user3'],
        createdAt: '2025-09-01T12:00:00',
        maxAttendees: 500,
        tags: ['react', 'javascript', 'frontend']
    },
    {
        id: '2',
        title: 'AI & Machine Learning Workshop',
        description: 'Intensive 2-day workshop covering the fundamentals of AI and ML with practical examples, hands-on coding sessions, and real-world case studies.',
        date: '2025-10-20T09:00:00',
        location: 'Innovation Hub, New York',
        category: EventCategory.WORKSHOP,
        createdBy: 'system',
        rsvps: ['user1'],
        createdAt: '2025-09-02T14:30:00',
        maxAttendees: 50,
        tags: ['ai', 'machine-learning', 'python']
    },
    {
        id: '3',
        title: 'Startup Networking Meetup',
        description: 'Connect with fellow entrepreneurs, investors, and startup enthusiasts in a casual setting. Share ideas, find collaborators, and build meaningful connections.',
        date: '2025-10-25T18:00:00',
        location: 'WeWork Downtown, Austin',
        category: EventCategory.NETWORKING,
        createdBy: 'system',
        rsvps: [],
        createdAt: '2025-09-03T16:15:00',
        maxAttendees: 100,
        tags: ['networking', 'startup', 'entrepreneur']
    },
    {
        id: '4',
        title: 'TypeScript Deep Dive Seminar',
        description: 'Advanced TypeScript concepts, patterns, and best practices for large-scale applications. Perfect for developers looking to master TypeScript.',
        date: '2025-11-05T14:00:00',
        location: 'Microsoft Campus, Seattle',
        category: EventCategory.SEMINAR,
        createdBy: 'system',
        rsvps: ['user2'],
        createdAt: '2025-09-04T10:20:00',
        maxAttendees: 150,
        tags: ['typescript', 'javascript', 'programming']
    }
];

const EventContext = createContext<EventContextType | undefined>(undefined);

interface EventProviderProps {
    children: ReactNode;
}

export function EventProvider({ children }: EventProviderProps) {
    const [events, setEvents] = useState<Event[]>([]);
    const [userEvents, setUserEvents] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const savedEvents = localStorage.getItem('events');
            const savedUserEvents = localStorage.getItem('userEvents');

            if (savedEvents) {
                setEvents(JSON.parse(savedEvents));
            } else {
                setEvents(mockEvents);
                localStorage.setItem('events', JSON.stringify(mockEvents));
            }

            if (savedUserEvents) {
                setUserEvents(JSON.parse(savedUserEvents));
            }
        } catch (error) {
            console.error('Error loading data from localStorage:', error);
            setEvents(mockEvents);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!loading && events.length > 0) {
            try {
                localStorage.setItem('events', JSON.stringify(events));
            } catch (error) {
                console.error('Error saving events to localStorage:', error);
            }
        }
    }, [events, loading]);

    useEffect(() => {
        if (!loading) {
            try {
                localStorage.setItem('userEvents', JSON.stringify(userEvents));
            } catch (error) {
                console.error('Error saving user events to localStorage:', error);
            }
        }
    }, [userEvents, loading]);

    const createEvent = useCallback((eventData: EventFormData): Event => {
        const newEvent: Event = {
            ...eventData,
            id: generateId(),
            createdBy: 'user',
            rsvps: [],
            createdAt: new Date().toISOString()
        };

        setEvents(prev => [newEvent, ...prev]);
        setUserEvents(prev => [newEvent.id, ...prev]);
        return newEvent;
    }, []);

    const updateEvent = useCallback((eventId: string, updates: Partial<Event>) => {
        setEvents(prev => prev.map(event =>
            event.id === eventId
                ? { ...event, ...updates, updatedAt: new Date().toISOString() }
                : event
        ));
    }, []);

    const deleteEvent = useCallback((eventId: string) => {
        setEvents(prev => prev.filter(event => event.id !== eventId));
        setUserEvents(prev => prev.filter(id => id !== eventId));
    }, []);

    const toggleRSVP = useCallback((eventId: string, userId: string = 'current-user') => {
        setEvents(prev => prev.map(event => {
            if (event.id === eventId) {
                const rsvps = event.rsvps.includes(userId)
                    ? event.rsvps.filter(id => id !== userId)
                    : [...event.rsvps, userId];
                return { ...event, rsvps };
            }
            return event;
        }));
    }, []);

    const getEventById = useCallback((id: string): Event | undefined => {
        return events.find(event => event.id === id);
    }, [events]);

    const getMyEvents = useCallback((): Event[] => {
        return events.filter(event => userEvents.includes(event.id));
    }, [events, userEvents]);

    const value: EventContextType = {
        events,
        loading,
        createEvent,
        updateEvent,
        deleteEvent,
        toggleRSVP,
        getEventById,
        getMyEvents
    };

    return (
        <EventContext.Provider value={value}>
            {children}
        </EventContext.Provider>
    );
}

export function useEvents(): EventContextType {
    const context = useContext(EventContext);
    if (context === undefined) {
        throw new Error('useEvents must be used within an EventProvider');
    }
    return context;
}