'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { tenantsApi } from '@/lib/api';
import { UserGroupIcon, PlusIcon, MagnifyingGlassIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function TenantsPage() {
  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      setIsLoading(true);
      const data = await tenantsApi.getAll(searchTerm || undefined);
      setTenants(data);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTenants();
  };

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <StarIconSolid key={star} className="h-4 w-4 text-yellow-400" />
          ) : (
            <StarIcon key={star} className="h-4 w-4 text-gray-300" />
          )
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tenant Database</h1>
            <p className="mt-2 text-gray-600">Browse and rate tenants</p>
          </div>
          <Link href="/tenants/create" className="btn-primary">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Tenant
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="card mb-8">
        <div className="card-header">
          <h2 className="text-lg font-semibold flex items-center">
            <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
            Search Tenants
          </h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
                placeholder="Search by tenant name..."
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Tenants List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tenants...</p>
        </div>
      ) : tenants.length === 0 ? (
        <div className="text-center py-12">
          <UserGroupIcon className="h-24 w-24 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tenants found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Try a different search term' : 'Add your first tenant to the database!'}
          </p>
          <Link href="/tenants/create" className="btn-primary">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add First Tenant
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map((tenant: any) => {
            const avgRating = tenant.ratings?.length > 0
              ? tenant.ratings.reduce((sum: number, r: any) => sum + r.score, 0) / tenant.ratings.length
              : 0;

            return (
              <div key={tenant.id} className="card hover:shadow-md transition-shadow">
                <div className="card-body">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 rounded-full p-3 mr-4">
                      <UserGroupIcon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {tenant.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ID: {tenant.nationalIdHash ? '***' + tenant.nationalIdHash.slice(-4) : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    {tenant.ratings?.length > 0 ? (
                      <div>
                        {renderRating(avgRating)}
                        <p className="text-sm text-gray-600 mt-1">
                          {tenant.ratings.length} rating{tenant.ratings.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center text-gray-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon key={star} className="h-4 w-4" />
                          ))}
                          <span className="ml-1 text-sm">No ratings yet</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Added {new Date(tenant.createdAt).toLocaleDateString()}
                    </span>
                    <Link
                      href={`/tenants/${tenant.id}`}
                      className="btn-secondary btn-sm"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Action Button for Mobile */}
      <Link href="/tenants/create" className="fab md:hidden">
        <PlusIcon className="h-6 w-6" />
      </Link>
    </div>
  );
} 