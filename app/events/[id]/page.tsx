'use client';

import { Button } from '@/components/ui/Button';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { useEvents } from '@/context/EventContext';
import { formatDate, getEventStatus } from '@/lib/utils';
import { ArrowLeft, Calendar, CheckCircle, Clock, Edit, MapPin, Share2, Trash2, Users } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getEventById, toggleRSVP, deleteEvent } = useEvents();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const eventId = params.id as string;
  const event = getEventById(eventId);
  const isCreated = searchParams.get('created') === 'true';

  // Show success message when event is created
  useEffect(() => {
    if (isCreated) {
      setShowSuccessMessage(true);
      // Remove the query parameter
      const url = new URL(window.location.href);
      url.searchParams.delete('created');
      window.history.replaceState({}, '', url.toString());

      // Hide message after 5 seconds
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
  }, [isCreated]);

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h1>
        <p className="text-gray-600 mb-6">The event you&#39;re looking for doesn&#39;t exist or has been removed.</p>
        <Link href="/">
          <Button leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Events
          </Button>
        </Link>
      </div>
    );
  }

  const status = getEventStatus(event.date);
  const isUpcoming = status === 'upcoming';
  const isOngoing = status === 'ongoing';
  const isUserEvent = event.createdBy === 'user';
  const hasUserRSVPed = event.rsvps.includes('current-user');
  const isAtCapacity = event.maxAttendees && event.rsvps.length >= event.maxAttendees;

  const handleRSVP = () => {
    toggleRSVP(event.id);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
        // Fallback to clipboard
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setToastMessage("Event link copied to clipboard!");
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleDelete = () => {
    deleteEvent(event.id);
    setShowDeleteModal(false);
    router.push('/my-events');
  };

  const categoryColors = {
    Conference: 'bg-blue-100 text-blue-800 border-blue-200',
    Workshop: 'bg-green-100 text-green-800 border-green-200',
    Meetup: 'bg-purple-100 text-purple-800 border-purple-200',
    Seminar: 'bg-orange-100 text-orange-800 border-orange-200',
    Networking: 'bg-pink-100 text-pink-800 border-pink-200',
    Webinar: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    Training: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  };

  return (
    <div className="max-w-4xl mx-auto">
      {toastMessage && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded shadow-lg animate-slide-up">
          {toastMessage}
          <button
            className="ml-4 text-gray-400 hover:text-white"
            onClick={() => setToastMessage(null)}
          >
            &times;
          </button>
        </div>
      )}


      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 animate-bounce-in">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-900">Event Created Successfully! 🎉</h3>
              <p className="text-green-700 text-sm">Your event is now live and people can start RSVPing.</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Events
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            leftIcon={<Share2 className="w-4 h-4" />}
          >
            Share
          </Button>

          {isUserEvent && (
            <>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Edit className="w-4 h-4" />}
                onClick={() => router.push(`/events/${event.id}/edit`)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                leftIcon={<Trash2 className="w-4 h-4" />}
                onClick={() => setShowDeleteModal(true)}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {isOngoing && (
        <div className="bg-green-500 text-white text-center py-3 rounded-lg mb-6 animate-pulse">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            <span className="font-semibold">🔴 THIS EVENT IS HAPPENING NOW!</span>
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.imageUrl || 'https://i.ibb.co.com/MD6rn1qW/top-10-tech-events-in-September-2023.jpg'}
              alt={event.title}
              width={800}
              height={192}
              className="w-full h-48 object-cover"
              style={{ objectFit: 'cover' }}
            />



            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className={`
                  px-3 py-1 rounded-full text-sm font-medium border
                  ${categoryColors[event.category] || 'bg-gray-100 text-gray-800 border-gray-200'}
                `}>
                  {event.category}
                </span>

                {!isUpcoming && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 border border-gray-200">
                    {status === 'ongoing' ? 'Live Now' : 'Past Event'}
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>

              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Event Details</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{formatDate(event.date)}</p>
                  {isOngoing && (
                    <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      Currently happening
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Location</p>
                  <p className="text-gray-600">{event.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Attendance</p>
                  <p className="text-gray-600">
                    {event.rsvps.length} attending
                    {event.maxAttendees && ` / ${event.maxAttendees} max capacity`}
                  </p>
                  {isAtCapacity && (
                    <p className="text-sm text-red-600 mt-1">Event is at full capacity</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* RSVP Card */}
          {isUpcoming && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Join This Event</h3>

              {isAtCapacity && !hasUserRSVPed ? (
                <div className="text-center">
                  <p className="text-sm text-red-600 mb-4">This event is at full capacity</p>
                  <Button disabled className="w-full">
                    Event Full
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-gray-900">{event.rsvps.length}</p>
                    <p className="text-sm text-gray-600">people attending</p>
                  </div>

                  <Button
                    onClick={handleRSVP}
                    variant={hasUserRSVPed ? 'secondary' : 'primary'}
                    className="w-full"
                    size="lg"
                  >
                    {hasUserRSVPed ? 'Cancel RSVP' : 'RSVP Now'}
                  </Button>

                  <p className="text-xs text-gray-500 mt-2">
                    {hasUserRSVPed ? 'You are attending this event' : 'Free to join'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Event Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Information</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Created by</span>
                <span className="font-medium">{event.createdBy === 'user' ? 'You' : 'EventHub'}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Created on</span>
                <span className="font-medium">{new Date(event.createdAt).toLocaleDateString()}</span>
              </div>

              {event.updatedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Last updated</span>
                  <span className="font-medium">{new Date(event.updatedAt).toLocaleDateString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">Event ID</span>
                <span className="font-mono text-xs">{event.id}</span>
              </div>
            </div>
          </div>

          {/* Similar Events placeholder */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">More Like This</h3>
            <p className="text-sm text-gray-600 mb-4">Discover similar events in your area</p>
            <Link href={`/?category=${event.category}`}>
              <Button variant="outline" size="sm" className="w-full">
                Browse {event.category} Events
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Event"
      >
        <ModalBody>
          <div className="text-center">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete &quot;{event.title}&quot;?</h3>
            <p className="text-gray-600 mb-4">
              This action cannot be undone. All RSVPs and event data will be permanently deleted.
            </p>
            {event.rsvps.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-left">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> {event.rsvps.length} people have RSVP&#39;d to this event.
                  They will no longer be able to access event details.
                </p>
              </div>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Event
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}