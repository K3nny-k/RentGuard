'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { listingsApi, tenantsApi } from '@/lib/api';
import { PlusIcon, BuildingOfficeIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingsData, tenantsData] = await Promise.all([
          listingsApi.getAll(),
          tenantsApi.getAll(),
        ]);
        setListings(listingsData);
        setTenants(tenantsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back, {user?.email}</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link href="/listings/create" className="card hover:shadow-md transition-shadow">
          <div className="card-body text-center">
            <BuildingOfficeIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Listing</h3>
            <p className="text-gray-600">Add a new property listing with photos and details</p>
            <div className="mt-4">
              <span className="btn-primary inline-flex items-center">
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Property
              </span>
            </div>
          </div>
        </Link>

        <Link href="/tenants/create" className="card hover:shadow-md transition-shadow">
          <div className="card-body text-center">
            <UserGroupIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Add New Tenant</h3>
            <p className="text-gray-600">Add a tenant to the database for rating</p>
            <div className="mt-4">
              <span className="btn-primary inline-flex items-center">
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Tenant
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Dashboard Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <div className="card-header flex justify-between items-center">
            <h2 className="text-xl font-semibold">My Listings</h2>
            <Link href="/listings/create" className="btn-secondary btn-sm">
              <PlusIcon className="h-4 w-4 mr-1" />
              Add New
            </Link>
          </div>
          <div className="card-body">
            {isLoading ? (
              <p className="text-gray-600">Loading...</p>
            ) : listings.length > 0 ? (
              <div className="space-y-3">
                {listings.slice(0, 3).map((listing: any) => (
                  <div key={listing.id} className="border-l-4 border-primary-600 pl-3">
                    <h4 className="font-medium text-gray-900">{listing.title}</h4>
                    <p className="text-sm text-gray-600">RM{listing.rent}/month • {listing.location}</p>
                  </div>
                ))}
                {listings.length > 3 && (
                  <Link href="/listings" className="text-sm text-primary-600 hover:underline">
                    View all {listings.length} listings →
                  </Link>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No listings yet</p>
                <Link href="/listings/create" className="btn-primary mt-4">
                  Create your first listing
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Tenants</h2>
            <Link href="/tenants/create" className="btn-secondary btn-sm">
              <PlusIcon className="h-4 w-4 mr-1" />
              Add New
            </Link>
          </div>
          <div className="card-body">
            {isLoading ? (
              <p className="text-gray-600">Loading...</p>
            ) : tenants.length > 0 ? (
              <div className="space-y-3">
                {tenants.slice(0, 3).map((tenant: any) => (
                  <div key={tenant.id} className="border-l-4 border-green-500 pl-3">
                    <h4 className="font-medium text-gray-900">{tenant.name}</h4>
                    <p className="text-sm text-gray-600">
                      {tenant.ratings?.length || 0} rating(s)
                    </p>
                  </div>
                ))}
                {tenants.length > 3 && (
                  <Link href="/tenants" className="text-sm text-primary-600 hover:underline">
                    View all tenants →
                  </Link>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No tenants added yet</p>
                <Link href="/tenants/create" className="btn-primary mt-4">
                  Add your first tenant
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 