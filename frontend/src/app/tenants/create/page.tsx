'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { tenantsApi } from '@/lib/api';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function CreateTenantPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    icNumber: '',
  });

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/auth/signin');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Simple hash function for IC number (for privacy)
  const hashIcNumber = (ic: string) => {
    let hash = 0;
    if (ic.length === 0) return '';
    for (let i = 0; i < ic.length; i++) {
      const char = ic.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return `hash_${Math.abs(hash).toString(16)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Please enter the tenant\'s name');
      return;
    }

    // IC number validation (basic format check) - optional
    if (formData.icNumber) {
      const icRegex = /^\d{6}-?\d{2}-?\d{4}$|^\d{12}$/;
      if (!icRegex.test(formData.icNumber.replace(/\s/g, ''))) {
        toast.error('Please enter a valid IC number (format: YYMMDD-XX-XXXX) or leave it blank');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const tenantData: { name: string; nationalIdHash?: string } = {
        name: formData.name.trim(),
      };

      // Add hashed IC number if provided
      if (formData.icNumber.trim()) {
        const cleanedIc = formData.icNumber.replace(/\s|-/g, '');
        tenantData.nationalIdHash = hashIcNumber(cleanedIc);
      }

      await tenantsApi.create(tenantData);
      toast.success('Tenant added successfully!');
      router.push('/dashboard');

    } catch (error: any) {
      console.error('Error creating tenant:', error);
      if (error.response?.status === 409) {
        toast.error('A tenant with this IC number already exists');
      } else {
        toast.error(error.response?.data?.message || 'Failed to add tenant');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Tenant</h1>
        <p className="mt-2 text-gray-600">Add a tenant to the system for rating and management</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold flex items-center">
              <UserPlusIcon className="h-6 w-6 mr-2 text-primary-600" />
              Tenant Information
            </h2>
          </div>
          <div className="card-body space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input-field mt-1"
                placeholder="e.g., Ahmad Bin Abdullah"
                required
                disabled={isSubmitting}
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter the tenant's full legal name
              </p>
            </div>

            <div>
              <label htmlFor="icNumber" className="block text-sm font-medium text-gray-700">
                IC Number (Optional)
              </label>
              <input
                type="text"
                id="icNumber"
                name="icNumber"
                value={formData.icNumber}
                onChange={handleInputChange}
                className="input-field mt-1"
                placeholder="990101-01-1234 (optional)"
                disabled={isSubmitting}
              />
              <p className="mt-1 text-xs text-gray-500">
                Malaysian IC number for unique identification. This will be hashed for privacy.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                About Adding Tenants
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Once added, you can rate and review this tenant</li>
                  <li>Other landlords can also view and rate this tenant</li>
                  <li>IC numbers are hashed for privacy and security</li>
                  <li>The tenant will not be notified when added to the system</li>
                  <li>Only the name is required - IC number is optional but recommended</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || !formData.name.trim()}
          >
            {isSubmitting ? 'Adding...' : 'Add Tenant'}
          </button>
        </div>
      </form>
    </div>
  );
} 