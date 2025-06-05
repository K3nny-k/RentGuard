'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { listingsApi, uploadApi } from '@/lib/api';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function CreateListingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    rent: '',
    location: '',
  });

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/auth/signin');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > 6) {
      toast.error('Maximum 6 images allowed');
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrls(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.rent || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    let uploadToastId: string | undefined;

    try {
      let pictureUrls: string[] = [];

      // Upload images if any
      if (selectedFiles.length > 0) {
        uploadToastId = toast.loading('Uploading images...');
        try {
          pictureUrls = await uploadApi.uploadImages(selectedFiles);
          toast.success('Images uploaded successfully!', { id: uploadToastId });
        } catch (uploadError: any) {
          toast.error('Failed to upload images: ' + (uploadError.response?.data?.message || uploadError.message), { id: uploadToastId });
          throw uploadError;
        }
      }

      // Create listing
      const listingData = {
        title: formData.title,
        rent: parseFloat(formData.rent),
        location: formData.location,
        pictures: pictureUrls,
      };

      console.log('Creating listing with data:', listingData);
      await listingsApi.create(listingData);
      toast.success('Listing created successfully!');
      router.push('/dashboard');

    } catch (error: any) {
      console.error('Error creating listing:', error);
      
      // Dismiss upload toast if it exists and listing creation fails
      if (uploadToastId) {
        toast.dismiss(uploadToastId);
      }
      
      // Show specific error message
      if (error.response?.status === 401) {
        toast.error('You need to be logged in to create a listing');
        router.push('/auth/signin');
      } else if (error.response?.status === 400) {
        toast.error('Please check your input data: ' + (error.response?.data?.message || 'Invalid data'));
      } else {
        toast.error(error.response?.data?.message || error.message || 'Failed to create listing');
      }
    } finally {
      setIsSubmitting(false);
      // Ensure any remaining toasts are dismissed
      if (uploadToastId) {
        toast.dismiss(uploadToastId);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Listing</h1>
        <p className="mt-2 text-gray-600">Add a new property to your portfolio</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold">Property Details</h2>
          </div>
          <div className="card-body space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Property Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="input-field mt-1"
                placeholder="e.g., Modern 2BR Apartment in KLCC"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="rent" className="block text-sm font-medium text-gray-700">
                Monthly Rent (RM) *
              </label>
              <input
                type="number"
                id="rent"
                name="rent"
                value={formData.rent}
                onChange={handleInputChange}
                className="input-field mt-1"
                placeholder="2500"
                min="0"
                max="9999999.99"
                step="0.01"
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum: RM 9,999,999.99
              </p>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="input-field mt-1"
                placeholder="e.g., Kuala Lumpur City Centre"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold">Property Images</h2>
            <p className="text-sm text-gray-600">Upload up to 6 images (max 5MB each)</p>
          </div>
          <div className="card-body">
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="text-sm text-gray-600 mb-4">
                <label htmlFor="images" className="cursor-pointer">
                  <span className="text-primary-600 hover:text-primary-500">Click to upload images</span>
                  <span> or drag and drop</span>
                </label>
                <input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isSubmitting}
                />
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB each</p>
            </div>

            {/* Image Previews */}
            {previewUrls.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Selected Images ({previewUrls.length}/6)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={isSubmitting}
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
            disabled={isSubmitting || !formData.title || !formData.rent || !formData.location}
          >
            {isSubmitting ? 'Creating...' : 'Create Listing'}
          </button>
        </div>
      </form>
    </div>
  );
} 