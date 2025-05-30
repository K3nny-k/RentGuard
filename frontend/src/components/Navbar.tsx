'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-primary-600">RentGuard</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/listings" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              Listings
            </Link>
            <Link href="/tenants" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              Tenants
            </Link>
            {isAuthenticated && (
              <Link href="/dashboard" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                Dashboard
              </Link>
            )}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user?.email}
                </span>
                <button onClick={logout} className="btn-secondary">
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/auth/signin" className="btn-primary">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link href="/listings" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600">
              Listings
            </Link>
            <Link href="/tenants" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600">
              Tenants
            </Link>
            {isAuthenticated && (
              <Link href="/dashboard" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600">
                Dashboard
              </Link>
            )}
            
            {isAuthenticated ? (
              <div className="px-3 py-2 space-y-2">
                <div className="text-sm text-gray-600">
                  Welcome, {user?.email}
                </div>
                <button onClick={logout} className="btn-secondary w-full">
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/auth/signin" className="block px-3 py-2 text-base font-medium text-primary-600">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 