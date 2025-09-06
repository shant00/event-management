'use client';

import { validateEventForm } from '@/lib/utils';
import { Event, EventCategory, EventFormData } from '@/types/event';
import { useEffect, useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface EventFormProps {
    event?: Event;
    onSubmit: (data: EventFormData) => void;
    onCancel?: () => void;
    submitLabel?: string;
    isLoading?: boolean;
}

export function EventForm({
    event,
    onSubmit,
    onCancel,
    submitLabel = 'Create Event',
    isLoading = false
}: EventFormProps) {
    const [formData, setFormData] = useState<EventFormData>({
        title: '',
        description: '',
        date: '',
        location: '',
        category: EventCategory.MEETUP,
        maxAttendees: undefined,
        imageUrl: '',
        tags: []
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [tagsInput, setTagsInput] = useState('');

    useEffect(() => {
        if (event) {
            setFormData({
                title: event.title,
                description: event.description,
                date: new Date(event.date).toISOString().slice(0, 16),
                location: event.location,
                category: event.category,
                maxAttendees: event.maxAttendees,
                imageUrl: event.imageUrl || '',
                tags: event.tags || []
            });
            setTagsInput(event.tags?.join(', ') || '');
        }
    }, [event]);

    const handleInputChange = (field: keyof EventFormData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: field === 'maxAttendees' ? (value ? parseInt(value) : undefined) : value
        }));

        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTagsInput(value);

        const tags = value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0)
            .slice(0, 10);

        setFormData(prev => ({ ...prev, tags }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validation = validateEventForm(formData);

        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setErrors({});
        onSubmit(formData);
    };

    const minDate = new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16);

    return (
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <Input
                label="Event Title"
                type="text"
                value={formData.title}
                onChange={handleInputChange('title')}
                required
                error={errors.title}
                placeholder="Enter event title..."
                className="text-lg font-medium"
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={formData.description}
                    onChange={handleInputChange('description')}
                    required
                    rows={4}
                    placeholder="Describe your event..."
                    className={`
            block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
            placeholder-gray-400 text-gray-900
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-colors duration-200
            ${errors.description ? 'border-red-300 focus:ring-red-500' : ''}
          `}
                />
                {errors.description && (
                    <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                    {formData.description.length}/500 characters
                </p>
            </div>

            <Input
                label="Date & Time"
                type="datetime-local"
                value={formData.date}
                onChange={handleInputChange('date')}
                required
                error={errors.date}
                min={minDate}
                helperText="Event must be scheduled for the future"
            />

            <Input
                label="Location"
                type="text"
                value={formData.location}
                onChange={handleInputChange('location')}
                required
                error={errors.location}
                placeholder="Event venue or online platform..."
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                </label>
                <select
                    value={formData.category}
                    onChange={handleInputChange('category')}
                    required
                    className={`
            block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
            text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-colors duration-200
            ${errors.category ? 'border-red-300 focus:ring-red-500' : ''}
          `}
                >
                    {Object.values(EventCategory).map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
                {errors.category && (
                    <p className="text-sm text-red-600 mt-1">{errors.category}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Max Attendees"
                    type="number"
                    value={formData.maxAttendees || ''}
                    onChange={handleInputChange('maxAttendees')}
                    min="1"
                    error={errors.maxAttendees}
                    placeholder="Optional"
                    helperText="Leave blank for unlimited"
                />

                <Input
                    label="Event Image URL"
                    type="url"
                    value={formData.imageUrl || ''}
                    onChange={handleInputChange('imageUrl')}
                    placeholder="https://example.com/image.jpg"
                    helperText="Optional event banner image"
                />
            </div>

            <Input
                label="Tags"
                type="text"
                value={tagsInput}
                onChange={handleTagsChange}
                placeholder="react, javascript, networking (comma separated)"
                helperText="Add up to 10 tags to help people find your event"
            />

            {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                <Button
                    type="submit"
                    loading={isLoading}
                    className="flex-1 sm:flex-none"
                >
                    {submitLabel}
                </Button>

                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 sm:flex-none"
                    >
                        Cancel
                    </Button>
                )}
            </div>

            <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-2">📝 Tips for a great event:</h4>
                <ul className="space-y-1 text-xs">
                    <li>• Write a clear, descriptive title</li>
                    <li>• Include detailed information about what attendees can expect</li>
                    <li>• Provide the exact location or online meeting link</li>
                    <li>• Set a reasonable capacity for your venue</li>
                    <li>• Use relevant tags to help people discover your event</li>
                </ul>
            </div>
        </form>
    );
}