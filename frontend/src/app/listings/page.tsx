'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { listingsApi } from '@/lib/api';
import { 
  BuildingOfficeIcon, 
  MagnifyingGlassIcon, 
  PlusIcon,
  PhotoIcon 
} from '@heroicons/react/24/outline';

export default function ListingsPage() {
  const { isAuthenticated } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    minRent: '',
    maxRent: '',
  });

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Convert string values to proper types for API
        const apiFilters: any = {};
        if (filters.location) apiFilters.location = filters.location;
        if (filters.minRent) apiFilters.minRent = parseFloat(filters.minRent);
        if (filters.maxRent) apiFilters.maxRent = parseFloat(filters.maxRent);
        
        const data = await listingsApi.getAll(apiFilters);
        setListings(data);
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      minRent: '',
      maxRent: '',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Property Listings</h1>
            <p className="mt-2 text-gray-600">Browse available rental properties</p>
          </div>
          <Link href="/listings/create" className="btn-primary">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Listing
          </Link>
        </div>
      </div>

      {/* Search Filters */}
      <div className="card mb-8">
        <div className="card-header">
          <h2 className="text-lg font-semibold flex items-center">
            <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
            Search & Filter
          </h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="input-field"
                placeholder="e.g., Kuala Lumpur"
              />
            </div>
            <div>
              <label htmlFor="minRent" className="block text-sm font-medium text-gray-700 mb-1">
                Min Rent (RM)
              </label>
              <input
                type="number"
                id="minRent"
                name="minRent"
                value={filters.minRent}
                onChange={handleFilterChange}
                className="input-field"
                placeholder="1000"
                min="0"
              />
            </div>
            <div>
              <label htmlFor="maxRent" className="block text-sm font-medium text-gray-700 mb-1">
                Max Rent (RM)
              </label>
              <input
                type="number"
                id="maxRent"
                name="maxRent"
                value={filters.maxRent}
                onChange={handleFilterChange}
                className="input-field"
                placeholder="5000"
                min="0"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="btn-secondary w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="card animate-pulse">
              <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
              <div className="card-body space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12">
          <BuildingOfficeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search filters or create a new listing.</p>
          {isAuthenticated && (
            <Link href="/listings/create" className="btn-primary">
              Create Your First Listing
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing: any) => (
            <div key={listing.id} className="card hover:shadow-md transition-all duration-200 group">
              {/* Image Section */}
              <div className="relative">
                {listing.pictures && listing.pictures.length > 0 ? (
                  <>
                    <img
                      src={listing.pictures[0]}
                      alt={listing.title}
                      className="w-full h-48 object-cover rounded-t-lg transition-transform duration-200 group-hover:scale-105"
                    />
                    {/* Image count indicator */}
                    {listing.pictures.length > 1 && (
                      <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <PhotoIcon className="h-3 w-3 mr-1" />
                        {listing.pictures.length}
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-t-lg">
                    </div>
                  </>
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <div className="text-center">
                      <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No images</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="card-body">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {listing.title}
                </h3>
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  RM{typeof listing.rent === 'number' ? listing.rent.toLocaleString() : listing.rent}/month
                </p>
                <p className="text-gray-600 mb-4 flex items-center">
                  <span className="text-gray-400 mr-1">📍</span>
                  <span className="truncate">{listing.location}</span>
                </p>
                
                {/* Footer */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    <span className="block">By {listing.landlord?.email?.split('@')[0] || 'Anonymous'}</span>
                    <span className="text-xs">
                      {listing.pictures?.length || 0} image{listing.pictures?.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <Link
                    href={`/listings/${listing.id}`}
                    className="btn-primary btn-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Action Button for Mobile */}
      {isAuthenticated && (
        <Link href="/listings/create" className="fab md:hidden">
          <PlusIcon className="h-6 w-6" />
        </Link>
      )}
    </div>
  );
} 