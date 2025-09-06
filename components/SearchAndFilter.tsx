'use client';

import { debounce } from '@/lib/utils';
import { EventCategory, EventFilters } from '@/types/event';
import { Filter, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface SearchAndFilterProps {
    onFiltersChange: (filters: EventFilters) => void;
    initialFilters?: EventFilters;
}

export function SearchAndFilter({
    onFiltersChange,
    initialFilters = { search: '', category: 'all' }
}: SearchAndFilterProps) {
    const [filters, setFilters] = useState<EventFilters>(initialFilters);
    const [showFilters, setShowFilters] = useState(false);

    const debouncedOnFiltersChange = debounce(onFiltersChange, 300);

    useEffect(() => {
        debouncedOnFiltersChange(filters);
    }, [filters, debouncedOnFiltersChange]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, search: e.target.value }));
    };

    const handleCategoryChange = (category: EventCategory | 'all') => {
        setFilters(prev => ({ ...prev, category }));
    };

    const clearFilters = () => {
        setFilters({ search: '', category: 'all' });
    };

    const hasActiveFilters = filters.search || filters.category !== 'all';

    return (
        <div className="space-y-4">
            <div className="flex gap-3">
                <div className="flex-1">
                    <Input
                        type="text"
                        placeholder="Search events by title..."
                        value={filters.search}
                        onChange={handleSearchChange}
                        leftIcon={<Search className="w-4 h-4" />}
                        className="w-full"
                    />
                </div>

                <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    leftIcon={<Filter className="w-4 h-4" />}
                    className={showFilters ? 'bg-gray-100' : ''}
                >
                    Filters
                </Button>

                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        onClick={clearFilters}
                        leftIcon={<X className="w-4 h-4" />}
                        size="sm"
                        className="text-gray-500"
                    >
                        Clear
                    </Button>
                )}
            </div>

            {showFilters && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 animate-fade-in">
                    <h3 className="font-medium text-gray-900 mb-3">Filter by Category</h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                        <button
                            onClick={() => handleCategoryChange('all')}
                            className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left
                ${filters.category === 'all'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                }
              `}
                        >
                            All Events
                        </button>

                        {Object.values(EventCategory).map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategoryChange(category)}
                                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left
                  ${filters.category === category
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                    }
                `}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 items-center text-sm">
                    <span className="text-gray-500">Active filters:</span>

                    {filters.search && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center gap-1">
                            Search: &quot;{filters.search}&quot;
                            <button
                                onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}

                    {filters.category !== 'all' && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center gap-1">
                            Category: {filters.category}
                            <button
                                onClick={() => setFilters(prev => ({ ...prev, category: 'all' }))}
                                className="text-green-600 hover:text-green-800"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}