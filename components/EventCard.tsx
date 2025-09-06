'use client';

import { useEvents } from '@/context/EventContext';
import { formatDateShort, getEventStatus, truncateText } from '@/lib/utils';
import { Event } from '@/types/event';
import { Calendar, Clock, Edit, MapPin, Trash2, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/Button';

interface EventCardProps {
  event: Event;
  showActions?: boolean;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
}

export function EventCard({
  event,
  showActions = false,
  onEdit,
  onDelete
}: EventCardProps) {
  const { toggleRSVP } = useEvents();
  const status = getEventStatus(event.date);
  const isUpcoming = status === 'upcoming';
  const isOngoing = status === 'ongoing';

  const handleRSVP = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleRSVP(event.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.(event);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(event.id);
  };

  const categoryColors = {
    Conference: 'bg-blue-100 text-blue-800',
    Workshop: 'bg-green-100 text-green-800',
    Meetup: 'bg-purple-100 text-purple-800',
    Seminar: 'bg-orange-100 text-orange-800',
    Networking: 'bg-pink-100 text-pink-800',
    Webinar: 'bg-indigo-100 text-indigo-800',
    Training: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <Link href={`/events/${event.id}`}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-gray-300 group cursor-pointer overflow-hidden">
        {isOngoing && (
          <div className="bg-green-500 text-white text-center py-1 text-xs font-medium animate-pulse">
            🔴 LIVE NOW
          </div>
        )}

        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <span className={`
                px-2 py-1 rounded-full text-xs font-medium
                ${categoryColors[event.category] || 'bg-gray-100 text-gray-800'}
              `}>
                {event.category}
              </span>

              {!isUpcoming && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  {status === 'ongoing' ? 'Live' : 'Past'}
                </span>
              )}
            </div>

            {showActions && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleEdit}
                  className="p-1 h-8 w-8"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDelete}
                  className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {event.title}
          </h3>

          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            {truncateText(event.description, 120)}
          </p>

          {/* Event Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{formatDateShort(event.date)}</span>
              {isOngoing && (
                <span className="flex items-center gap-1 text-green-600">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs font-medium">Happening now</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{event.location}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4 text-gray-400" />
              <span>
                {event.rsvps.length} attending
                {event.maxAttendees && ` / ${event.maxAttendees} max`}
              </span>
            </div>
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {event.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                >
                  #{tag}
                </span>
              ))}
              {event.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                  +{event.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              Created {new Date(event.createdAt).toLocaleDateString()}
            </span>

            {isUpcoming && (
              <Button
                size="sm"
                variant={event.rsvps.includes('current-user') ? 'secondary' : 'primary'}
                onClick={handleRSVP}
                className="ml-auto"
              >
                {event.rsvps.includes('current-user') ? 'Cancel RSVP' : 'RSVP'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}