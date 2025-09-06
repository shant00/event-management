'use client';

import { EventForm } from '@/components/EventForm';
import { Button } from '@/components/ui/Button';
import { useEvents } from '@/context/EventContext';
import { EventFormData } from '@/types/event';
import { ArrowLeft, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateEventPage() {
  const router = useRouter();
  const { createEvent } = useEvents();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (eventData: EventFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const newEvent = createEvent(eventData);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirect to the new event or my events page
      router.push(`/events/${newEvent.id}?created=true`);
    } catch (err) {
      setError('Failed to create event. Please try again.');
      console.error('Error creating event:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // ...existing code...
  return (
    <div className="max-w-2xl mx-auto py-10">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="sm" aria-label="Back to home">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600" />
          Create New Event
        </h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Event Form */}
      <EventForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
}