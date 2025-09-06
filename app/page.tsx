'use client';

import { EventList } from '@/components/EventList';
import { Button } from '@/components/ui/Button';
import { useEvents } from '@/context/EventContext';
import { Calendar, Plus, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { events, loading } = useEvents();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <div className="skeleton h-8 w-64 mb-4"></div>
          <div className="skeleton h-4 w-96 mb-6"></div>
          <div className="skeleton h-10 w-32"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="skeleton h-12 w-12 rounded-lg mb-4"></div>
              <div className="skeleton h-8 w-16 mb-2"></div>
              <div className="skeleton h-4 w-24"></div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="skeleton h-6 w-20 rounded-full mb-3"></div>
              <div className="skeleton h-6 w-full mb-2"></div>
              <div className="skeleton h-4 w-3/4 mb-4"></div>
              <div className="space-y-2">
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const upcomingEvents = events.filter(event => new Date(event.date) > new Date());
  const totalRSVPs = events.reduce((sum, event) => sum + event.rsvps.length, 0);

  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl p-8 md:p-12 shadow-lg">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome to EventHub
          </h1>
          <p className="text-blue-100 text-lg mb-6 leading-relaxed">
            Discover amazing events in your community or create your own. Connect with like-minded people and make meaningful connections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/events/create">
              <Button
                variant="secondary"
                size="lg"
                leftIcon={<Plus className="w-5 h-5" />}
              >
                Create Event
              </Button>
            </Link>

            <Button
              variant="outline"
              size="lg"
              onClick={() =>
                document
                  .getElementById("events-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Browse Events
            </Button>
          </div>
        </div>
      </section>


      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{events.length}</p>
              <p className="text-gray-600 text-sm">Total Events</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{upcomingEvents.length}</p>
              <p className="text-gray-600 text-sm">Upcoming Events</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalRSVPs}</p>
              <p className="text-gray-600 text-sm">Total RSVPs</p>
            </div>
          </div>
        </div>
      </section>

      {upcomingEvents.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Events</h2>
            <Link href="#events-section">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {event.category}
                  </span>
                  {event.rsvps.length > 0 && (
                    <span className="text-xs text-gray-500">
                      {event.rsvps.length} attending
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {event.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>

                <Link href={`/events/${event.id}`}>
                  <Button size="sm" className="w-full">
                    Learn More
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Events Section */}
      <section id="events-section">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">All Events</h2>
          <div className="text-sm text-gray-500">
            {events.length === 0 ? 'No events yet' : `${events.length} total events`}
          </div>
        </div>

        <EventList
          events={events}
          showSearch={true}
          emptyMessage="No events yet"
          emptyDescription="Be the first to create an event in your community!"
        />
      </section>
    </div>
  );
}