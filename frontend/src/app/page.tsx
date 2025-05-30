import Link from 'next/link';
import { HomeIcon, ShieldCheckIcon, UserGroupIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Welcome to{' '}
          <span className="text-primary-600">RentGuard</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
          Malaysia's premier platform for landlords to rate tenants and manage property listings. 
          Build trust in the rental market with verified tenant ratings and comprehensive property management.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/auth/signin"
            className="btn-primary"
          >
            Get Started
          </Link>
          <Link
            href="/listings"
            className="btn-secondary"
          >
            Browse Listings
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Why Choose RentGuard?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Comprehensive tools for modern property management
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card">
            <div className="card-body text-center">
              <div className="mx-auto h-12 w-12 text-primary-600">
                <ShieldCheckIcon />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Verified Ratings
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Rate tenants with proof-backed reviews to help other landlords make informed decisions.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <div className="mx-auto h-12 w-12 text-primary-600">
                <BuildingOfficeIcon />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Property Listings
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Create and manage professional property listings with photos and detailed descriptions.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <div className="mx-auto h-12 w-12 text-primary-600">
                <UserGroupIcon />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Tenant Database
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Search and view tenant histories to find reliable renters for your properties.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <div className="mx-auto h-12 w-12 text-primary-600">
                <HomeIcon />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Easy Management
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Streamlined dashboard to manage all your properties and tenant relationships.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 rounded-2xl py-16 px-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready to get started?
        </h2>
        <p className="mt-4 text-lg text-primary-100">
          Join thousands of landlords who trust RentGuard for their property management needs.
        </p>
        <div className="mt-8">
          <Link
            href="/auth/signin"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-600 focus:ring-white transition-colors duration-200"
          >
            Start Your Free Account
          </Link>
        </div>
      </div>
    </div>
  );
} 