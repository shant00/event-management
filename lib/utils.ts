import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatDateShort(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function isEventUpcoming(eventDate: string): boolean {
  return new Date(eventDate) > new Date();
}

export function getEventStatus(eventDate: string): 'upcoming' | 'ongoing' | 'past' {
  const now = new Date();
  const eventStart = new Date(eventDate);
  const eventEnd = new Date(eventStart.getTime() + 2 * 60 * 60 * 1000);

  if (now < eventStart) return 'upcoming';
  if (now >= eventStart && now <= eventEnd) return 'ongoing';
  return 'past';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout | null = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((...args: any[]) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength).trim() + '...';
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateEventForm(data: any): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.title?.trim()) {
    errors.title = 'Title is required';
  } else if (data.title.length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }

  if (!data.description?.trim()) {
    errors.description = 'Description is required';
  } else if (data.description.length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }

  if (!data.date) {
    errors.date = 'Date is required';
  } else if (new Date(data.date) <= new Date()) {
    errors.date = 'Date must be in the future';
  }

  if (!data.location?.trim()) {
    errors.location = 'Location is required';
  }

  if (!data.category) {
    errors.category = 'Category is required';
  }

  if (data.maxAttendees && data.maxAttendees < 1) {
    errors.maxAttendees = 'Max attendees must be at least 1';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}