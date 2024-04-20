/* eslint-disable @next/next/no-img-element */
'use client';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { CarouselProps } from '../lib/definitions';
import { useState } from 'react';
import CarouselUI from './carousel';

export default function CarouselFullsize({ photos }: CarouselProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!photos) {
    return null;
  }

  const onViewPhotosClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      {!isOpen && (
        <button onClick={onViewPhotosClick}>
          <PhotoIcon className="h-5 w-5 cursor-pointer text-gray-400" />
        </button>
      )}
      {isOpen && (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-white p-2 text-black focus:outline-none"
          >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
          </button>
          <CarouselUI photos={photos} />
        </div>
      )}
    </>
  );
}
