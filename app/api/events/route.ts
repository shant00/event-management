import { Event, EventCategory, EventFormData } from '@/types/event';
import { NextRequest, NextResponse } from 'next/server';


const mockEvents: Event[] = [
    {
        id: '1',
        title: 'React Developer Conference 2025',
        description: 'Join us for the biggest React conference of the year featuring industry experts, hands-on workshops, and networking opportunities.',
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
        description: 'Intensive 2-day workshop covering the fundamentals of AI and ML with practical examples.',
        date: '2025-10-20T09:00:00',
        location: 'Innovation Hub, New York',
        category: EventCategory.WORKSHOP,
        createdBy: 'system',
        rsvps: ['user1'],
        createdAt: '2025-09-02T14:30:00',
        maxAttendees: 50,
        tags: ['ai', 'machine-learning', 'python']
    }
];


export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const category = searchParams.get('category');
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        let filteredEvents = [...mockEvents];

        if (search) {
            const searchLower = search.toLowerCase();
            filteredEvents = filteredEvents.filter(event =>
                event.title.toLowerCase().includes(searchLower) ||
                event.description.toLowerCase().includes(searchLower) ||
                event.location.toLowerCase().includes(searchLower)
            );
        }

        if (category && category !== 'all') {
            filteredEvents = filteredEvents.filter(event =>
                event.category === category
            );
        }

        const total = filteredEvents.length;
        const paginatedEvents = filteredEvents.slice(offset, offset + limit);

        paginatedEvents.sort((a, b) => {
            const now = new Date().getTime();
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();

            if (dateA >= now && dateB >= now) {
                return dateA - dateB;
            }
            if (dateA < now && dateB < now) {
                return dateB - dateA;
            }
            return dateA >= now ? -1 : 1;
        });

        return NextResponse.json({
            events: paginatedEvents,
            total,
            hasMore: offset + limit < total
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: 'Failed to fetch events' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body: EventFormData = await request.json();

        if (!body.title || !body.description || !body.date || !body.location || !body.category) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (new Date(body.date) <= new Date()) {
            return NextResponse.json(
                { error: 'Event date must be in the future' },
                { status: 400 }
            );
        }

        const newEvent: Event = {
            id: Math.random().toString(36).substr(2, 9),
            ...body,
            createdBy: 'user',
            rsvps: [],
            createdAt: new Date().toISOString()
        };

        mockEvents.unshift(newEvent);

        return NextResponse.json(newEvent, { status: 201 });
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { error: 'Failed to create event' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Event ID is required' },
                { status: 400 }
            );
        }

        const eventIndex = mockEvents.findIndex(event => event.id === id);
        if (eventIndex === -1) {
            return NextResponse.json(
                { error: 'Event not found' },
                { status: 404 }
            );
        }

        mockEvents[eventIndex] = {
            ...mockEvents[eventIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        return NextResponse.json(mockEvents[eventIndex]);
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { error: 'Failed to update event' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Event ID is required' },
                { status: 400 }
            );
        }

        const eventIndex = mockEvents.findIndex(event => event.id === id);
        if (eventIndex === -1) {
            return NextResponse.json(
                { error: 'Event not found' },
                { status: 404 }
            );
        }

        const deletedEvent = mockEvents.splice(eventIndex, 1)[0];

        return NextResponse.json({
            message: 'Event deleted successfully',
            event: deletedEvent
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { error: 'Failed to delete event' },
            { status: 500 }
        );
    }
}