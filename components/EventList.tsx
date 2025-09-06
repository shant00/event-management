'use client';

import { Event, EventFilters } from '@/types/event';
import { Calendar, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EventCard } from './EventCard';
import { SearchAndFilter } from './SearchAndFilter';

interface EventListProps {
  events: Event[];
  showSearch?: boolean;
  showActions?: boolean;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
  emptyMessage?: string;
  emptyDescription?: string;
}

export function EventList({
  events,
  showSearch = true,
  showActions = false,
  onEdit,
  onDelete,
  emptyMessage = "No events found",
  emptyDescription = "Check back later for new events or create your own!"
}: EventListProps) {
  const [filters, setFilters] = useState<EventFilters>({
    search: '',
    category: 'all'
  });

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = !filters.search ||
        event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.location.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCategory = filters.category === 'all' ||
        event.category === filters.category;

      return matchesSearch && matchesCategory;
    });
  }, [events, filters]);

  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => {
      const now = new Date().getTime();
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      if (dateA >= now && dateB >= now) {
        return dateA - dateB;
      }
      if (dateA < now && dateB < now) {
        return dateB - dateA;
      }
      if (dateA >= now && dateB < now) {
        return -1;
      }
      if (dateA < now && dateB >= now) {
        return 1;
      }

      return dateA - dateB;
    });
  }, [filteredEvents]);

  const upcomingEvents = sortedEvents.filter(event => new Date(event.date) > new Date());
  const pastEvents = sortedEvents.filter(event => new Date(event.date) <= new Date());

  const handleFiltersChange = (newFilters: EventFilters) => {
    setFilters(newFilters);
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{emptyMessage}</h3>
        <p className="text-gray-600 max-w-md mx-auto">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showSearch && (
        <SearchAndFilter
          onFiltersChange={handleFiltersChange}
          initialFilters={filters}
        />
      )}

      {showSearch && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {filteredEvents.length === events.length ? (
              `Showing all ${events.length} events`
            ) : (
              `Showing ${filteredEvents.length} of ${events.length} events`
            )}
          </p>

          {filters.search && (
            <p className="text-sm text-gray-500">
              Search results for &quot;{filters.search}&quot;
            </p>
          )}
        </div>
      )}

      {sortedEvents.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No events match your filters</h3>
          <p className="text-gray-600">Try adjusting your search criteria or browse all events.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {upcomingEvents.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Upcoming Events
                </h2>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full">
                  {upcomingEvents.length}
                </span>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    showActions={showActions}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </section>
          )}

          {pastEvents.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Past Events
                </h2>
                <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2 py-1 rounded-full">
                  {pastEvents.length}
                </span>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pastEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    showActions={showActions}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}