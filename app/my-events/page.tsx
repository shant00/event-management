'use client';

import { EventForm } from '@/components/EventForm';
import { EventList } from '@/components/EventList';
import { Button } from '@/components/ui/Button';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { useEvents } from '@/context/EventContext';
import { Event, EventFormData } from '@/types/event';
import { Calendar, Plus, Trash2, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function MyEventsPage() {
    const { getMyEvents, updateEvent, deleteEvent } = useEvents();
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const myEvents = getMyEvents();

    const handleEdit = (event: Event) => {
        setEditingEvent(event);
    };

    const handleDelete = (eventId: string) => {
        const event = myEvents.find(e => e.id === eventId);
        if (event) {
            setDeletingEvent(event);
        }
    };

    const confirmDelete = () => {
        if (deletingEvent) {
            deleteEvent(deletingEvent.id);
            setDeletingEvent(null);
        }
    };

    const handleEditSubmit = async (eventData: EventFormData) => {
        if (!editingEvent) return;

        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            updateEvent(editingEvent.id, eventData);
            setEditingEvent(null);
        } catch (error) {
            console.error('Error updating event:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const stats = {
        total: myEvents.length,
        upcoming: myEvents.filter(event => new Date(event.date) > new Date()).length,
        past: myEvents.filter(event => new Date(event.date) <= new Date()).length,
        totalRSVPs: myEvents.reduce((sum, event) => sum + event.rsvps.length, 0)
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-3 rounded-lg">
                        <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
                        <p className="text-gray-600">Manage all your created events</p>
                    </div>
                </div>

                <Link href="/events/create">
                    <Button
                        size="lg"
                        leftIcon={<Plus className="w-5 h-5" />}
                        className="w-full md:w-auto"
                    >
                        Create New Event
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            <p className="text-gray-600 text-sm">Total Events</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.upcoming}</p>
                            <p className="text-gray-600 text-sm">Upcoming</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="bg-gray-100 p-3 rounded-lg">
                            <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.past}</p>
                            <p className="text-gray-600 text-sm">Past Events</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalRSVPs}</p>
                            <p className="text-gray-600 text-sm">Total RSVPs</p>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                {myEvents.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                            <Calendar className="w-10 h-10 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Events Yet</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            You haven&#39;t created any events yet. Start by creating your first event and building your community!
                        </p>
                        <Link href="/events/create">
                            <Button
                                size="lg"
                                leftIcon={<Plus className="w-5 h-5" />}
                            >
                                Create Your First Event
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <EventList
                        events={myEvents}
                        showSearch={true}
                        showActions={true}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        emptyMessage="No events match your search"
                        emptyDescription="Try adjusting your search criteria"
                    />
                )}
            </div>

            <Modal isOpen={!!editingEvent} onClose={() => setEditingEvent(null)} title="Edit Event">
                <ModalBody>
                    {editingEvent && (
                        <EventForm
                            event={editingEvent}
                            onSubmit={handleEditSubmit}
                            onCancel={() => setEditingEvent(null)}
                            isLoading={isLoading}
                            submitLabel="Update Event"
                        />
                    )}
                </ModalBody>
            </Modal>

            <Modal isOpen={!!deletingEvent} onClose={() => setDeletingEvent(null)} title="Delete Event">
                <ModalBody>
                    <div className="flex items-center gap-4">
                        <Trash2 className="w-8 h-8 text-red-600" />
                        <div>
                            <p className="font-semibold text-gray-900 mb-1">
                                Are you sure you want to delete this event?
                            </p>
                            <p className="text-gray-600 text-sm">
                                <span className="font-medium">{deletingEvent?.title}</span> will be permanently removed.
                            </p>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="outline" onClick={() => setDeletingEvent(null)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}
//