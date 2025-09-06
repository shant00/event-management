'use client';

import { EventForm } from '@/components/EventForm';
import { useEvents } from '@/context/EventContext';
import { Event, EventFormData } from '@/types/event';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const EditEventPage = () => {
  const { id } = useParams();
  const { getMyEvents, updateEvent } = useEvents();
  const router = useRouter();

  const [eventData, setEventData] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const event = getMyEvents().find(e => e.id === id);
    if (event) {
      setEventData(event);
    }
  }, [id, getMyEvents]);

  if (!eventData) return <p className="text-center py-12">Event not found</p>;

  const handleSubmit = async (data: EventFormData) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      updateEvent(Array.isArray(id) ? id[0] : id!, data);
      router.push('/');
    } catch (err) {
      console.error('Failed to update event:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Edit Event</h1>
      <EventForm
        event={eventData}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/events')}
        isLoading={isLoading}
        submitLabel="Update Event"
      />
    </div>
  );
};

export default EditEventPage;