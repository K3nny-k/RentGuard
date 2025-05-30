'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { listingsApi } from '@/lib/api';
import { BuildingOfficeIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    minRent: '',
    maxRent: '',
  });

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      const filters: any = {};
      if (searchFilters.location) filters.location = searchFilters.location;
      if (searchFilters.minRent) filters.minRent = parseFloat(searchFilters.minRent);
      if (searchFilters.maxRent) filters.maxRent = parseFloat(searchFilters.maxRent);
      
      const data = await listingsApi.getAll(filters);
      setListings(data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchListings();
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
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={searchFilters.location}
                onChange={handleFilterChange}
                className="input-field mt-1"
                placeholder="e.g., Kuala Lumpur"
              />
            </div>
            <div>
              <label htmlFor="minRent" className="block text-sm font-medium text-gray-700">
                Min Rent (RM)
              </label>
              <input
                type="number"
                id="minRent"
                name="minRent"
                value={searchFilters.minRent}
                onChange={handleFilterChange}
                className="input-field mt-1"
                placeholder="1000"
                min="0"
              />
            </div>
            <div>
              <label htmlFor="maxRent" className="block text-sm font-medium text-gray-700">
                Max Rent (RM)
              </label>
              <input
                type="number"
                id="maxRent"
                name="maxRent"
                value={searchFilters.maxRent}
                onChange={handleFilterChange}
                className="input-field mt-1"
                placeholder="5000"
                min="0"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="btn-primary w-full"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Listings Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading listings...</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12">
          <BuildingOfficeIcon className="h-24 w-24 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
          <p className="text-gray-600 mb-6">Be the first to add a property listing!</p>
          <Link href="/listings/create" className="btn-primary">
            <PlusIcon className="h-5 w-5 mr-2" />
            Create First Listing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing: any) => (
            <div key={listing.id} className="card hover:shadow-md transition-shadow">
              {listing.pictures && listing.pictures.length > 0 ? (
                <img
                  src={listing.pictures[0]}
                  alt={listing.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                  <BuildingOfficeIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <div className="card-body">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {listing.title}
                </h3>
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  RM{listing.rent}/month
                </p>
                <p className="text-gray-600 mb-4">📍 {listing.location}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    By {listing.landlord?.email || 'Anonymous'}
                  </span>
                  <Link
                    href={`/listings/${listing.id}`}
                    className="btn-secondary btn-sm"
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
      <Link href="/listings/create" className="fab md:hidden">
        <PlusIcon className="h-6 w-6" />
      </Link>
    </div>
  );
} 