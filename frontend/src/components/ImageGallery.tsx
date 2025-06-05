'use client';

import { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/24/outline';

interface ImageGalleryProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageGallery({ 
  images, 
  initialIndex = 0, 
  isOpen, 
  onClose 
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);

  // Reset state when gallery opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setZoom(1);
    }
  }, [isOpen, initialIndex]);

  // Reset zoom when image changes
  useEffect(() => {
    setZoom(1);
  }, [currentIndex]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (images.length > 1) {
            setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
          }
          break;
        case 'ArrowRight':
          if (images.length > 1) {
            setCurrentIndex((prev) => (prev + 1) % images.length);
          }
          break;
        case '+':
        case '=':
          setZoom(prev => Math.min(prev + 0.5, 3));
          break;
        case '-':
          setZoom(prev => Math.max(prev - 0.5, 0.5));
          break;
        case '0':
          setZoom(1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, images.length]);

  if (!isOpen || images.length === 0) return null;

  const handleNextImage = () => {
    if (images.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }
  };

  const handlePrevImage = () => {
    if (images.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  const handleImageClick = () => {
    if (zoom < 3) {
      handleZoomIn();
    }
  };

  const currentImage = images[currentIndex];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center"
      style={{ zIndex: 50000 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Header Controls */}
      <div 
        className="fixed top-0 left-0 right-0 bg-black bg-opacity-50 p-4"
        style={{ zIndex: 50001 }}
      >
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-4">
            <span className="text-lg font-medium">
              {currentIndex + 1} / {images.length}
            </span>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 disabled:opacity-50 transition-all"
                style={{ zIndex: 50002 }}
              >
                <MagnifyingGlassMinusIcon className="h-5 w-5" />
              </button>
              
              <span className="text-sm min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 disabled:opacity-50 transition-all"
                style={{ zIndex: 50002 }}
              >
                <MagnifyingGlassPlusIcon className="h-5 w-5" />
              </button>
              
              <button
                onClick={handleResetZoom}
                className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
                style={{ zIndex: 50002 }}
              >
                <ArrowsPointingOutIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
            style={{ zIndex: 50002 }}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrevImage}
            className="fixed left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-all"
            style={{ zIndex: 50001 }}
          >
            <ChevronLeftIcon className="h-8 w-8" />
          </button>
          
          <button
            onClick={handleNextImage}
            className="fixed right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-all"
            style={{ zIndex: 50001 }}
          >
            <ChevronRightIcon className="h-8 w-8" />
          </button>
        </>
      )}

      {/* Main Image */}
      <div className="flex items-center justify-center p-4 pt-20 pb-32 w-full h-full">
        <div 
          className="relative cursor-pointer"
          style={{
            transform: `scale(${zoom})`,
            transition: 'transform 0.3s ease-out',
          }}
          onClick={handleImageClick}
        >
          <img
            src={currentImage}
            alt={`Image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            style={{
              maxHeight: '80vh',
              maxWidth: '90vw',
            }}
            draggable={false}
          />
        </div>
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div 
          className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4"
          style={{ zIndex: 50001 }}
        >
          <div className="flex justify-center space-x-2 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 h-16 w-20 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex 
                    ? 'border-blue-400 ring-2 ring-blue-400' 
                    : 'border-gray-500 hover:border-gray-300'
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Help Text */}
      <div 
        className="fixed bottom-4 left-4 text-white text-sm opacity-70"
        style={{ zIndex: 50001 }}
      >
        <div>Click image to zoom • +/- keys • Arrow keys • Esc to close</div>
      </div>
    </div>
  );
} 