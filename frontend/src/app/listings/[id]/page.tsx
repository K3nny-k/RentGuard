"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { listingsApi } from "@/lib/api";
import { BuildingOfficeIcon, ArrowLeftIcon, MagnifyingGlassPlusIcon } from "@heroicons/react/24/outline";
import ImageGallery from "@/components/ImageGallery";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    // Convert string ID to number and use correct API method
    const listingId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
    listingsApi.getById(listingId)
      .then((data) => setListing(data))
      .catch((error: any) => console.error('Failed to fetch listing:', error))
      .finally(() => setLoading(false));
  }, [id]);

  const openGallery = (index: number = imgIdx) => {
    setImgIdx(index);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!listing) return <div className="p-8 text-center">Listing not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        className="mb-6 flex items-center text-blue-600 hover:underline"
        onClick={() => router.back()}
      >
        <ArrowLeftIcon className="h-5 w-5 mr-1" /> Back to Listings
      </button>

      {/* Image Gallery */}
      <div className="mb-8">
        {listing.pictures && listing.pictures.length > 0 ? (
          <div>
            {/* Main Image */}
            <div className="relative group">
              <img
                src={listing.pictures[imgIdx]}
                alt={listing.title}
                className="w-full h-72 sm:h-80 lg:h-96 object-cover rounded-xl border shadow-md cursor-pointer transition-all duration-200 group-hover:shadow-lg"
                onClick={() => openGallery(imgIdx)}
              />
              {/* Overlay with expand icon */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-xl flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-50 rounded-full p-3">
                  <MagnifyingGlassPlusIcon className="h-8 w-8 text-white" />
                </div>
              </div>
              {/* Image counter badge */}
              {listing.pictures.length > 1 && (
                <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {imgIdx + 1} / {listing.pictures.length}
                </div>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {listing.pictures.length > 1 && (
              <div className="mt-4">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {listing.pictures.map((url: string, idx: number) => (
                    <div key={idx} className="relative flex-shrink-0">
                      <img
                        src={url}
                        alt={`View ${idx + 1}`}
                        className={`h-16 w-20 sm:h-20 sm:w-24 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 hover:scale-105 ${
                          imgIdx === idx 
                            ? 'border-blue-500 ring-2 ring-blue-200' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setImgIdx(idx)}
                      />
                      {/* Click to expand hint */}
                      <div 
                        className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center cursor-pointer"
                        onClick={() => openGallery(idx)}
                      >
                        <MagnifyingGlassPlusIcon className="h-4 w-4 text-white opacity-0 hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Click any image to view in full screen
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-72 sm:h-80 lg:h-96 bg-gray-200 rounded-xl flex items-center justify-center shadow-md">
            <div className="text-center">
              <BuildingOfficeIcon className="h-16 w-16 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No images available</p>
            </div>
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="card mb-8">
        <div className="card-header">
          <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
        </div>
        <div className="card-body space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:gap-8">
            <div className="text-3xl font-bold text-blue-600 mb-2 md:mb-0">RM{listing.rent}/month</div>
            <div className="text-gray-700 flex items-center">
              <span className="font-medium mr-2">Location:</span> {listing.location}
            </div>
          </div>
          <div className="text-gray-600">
            <span className="font-medium">Listing ID:</span> {listing.id}
          </div>
          <div className="text-gray-600">
            <span className="font-medium">Created:</span> {new Date(listing.createdAt).toLocaleString()}
          </div>
          <div className="text-gray-600">
            <span className="font-medium">Last Updated:</span> {new Date(listing.updatedAt).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Landlord Info */}
      <div className="card mb-8">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-900">Landlord Information</h2>
        </div>
        <div className="card-body">
          {listing.landlord ? (
            <div>
              <div className="font-medium text-gray-800">{listing.landlord.email}</div>
              <div className="text-gray-500 text-sm">User ID: {listing.landlord.id}</div>
            </div>
          ) : (
            <div className="text-gray-500">No landlord info available.</div>
          )}
        </div>
      </div>

      {/* Image Gallery Modal */}
      {listing.pictures && listing.pictures.length > 0 && (
        <ImageGallery
          images={listing.pictures}
          initialIndex={imgIdx}
          isOpen={isGalleryOpen}
          onClose={closeGallery}
        />
      )}
    </div>
  );
} 