'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselItems = [
    {
      id: 1,
      title: "Have your boyfriend sign up",
      content: "using email and password",
      image: "/Comments.svg"
    },
    {
      id: 2,
      title: "Create Link",
      content: "he will add you as his girlfriend and share a link with you",
      image: "/Comments.svg"
    },
    {
      id: 3,
      title: "File a Complaint",
      content: "Now you can file a complaint for him using the link as many times as you want",
      image: "/Comments.svg"
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev === carouselItems.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [carouselItems.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? carouselItems.length - 1 : prev - 1));
  };

  const goToSlide = (index: number): void => {
    setCurrentSlide(index);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col md:flex-row items-stretch gap-8">
        <div className="w-full md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-6xl md:text-6xl lg:text-8xl font-bold font-playfair tracking-tight text-gray-900 mb-4 sm:mb-6 md:mb-8">
              <span className='text-red-300'>Girlfriend</span> Grievance Portal
            </h1>
            <p className="text-lg sm:text-xl text-gray-800 font-lexend">
              Make your boyfriends sign up to get your complaints urgently.
            </p>
          </div>

          <div className="mt-6 sm:mt-auto pt-4 sm:pt-8">
            <Link href="/auth?mode=signup" className="inline-block">
              <button className="bg-red-200 flex items-center gap-2 sm:gap-4 font-lexend text-xl sm:text-2xl mb-6 sm:mb-10 font-medium py-2 px-4 sm:py-3 sm:px-6 border-2 transition duration-200 shadow-[6px_6px_0px_0px_rgba(0,0,0)] sm:shadow-[10px_10px_0px_0px_rgba(0,0,0)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0)] sm:hover:shadow-[15px_15px_0px_0px_rgba(0,0,0)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 2H20V22H23V2Z" fill="black" />
                  <path d="M8 4H10V5H11V6H12V7H13V8H14V9H15V10H16V11H17V13H16V14H15V15H14V16H13V17H12V18H11V19H10V20H8V19H7V17H8V16H9V15H10V14H1V10H10V9H9V8H8V7H7V5H8V4Z" fill="black" />
                </svg>
                Sign Up
              </button>
            </Link>
          </div>
        </div>

        <div className="w-full md:w-1/2 relative">
          <div className="relative overflow-hidden w-full">
            <div className="relative h-64 sm:h-72 md:h-80 lg:h-[50vh] overflow-hidden w-full">
              <div
                className="flex transition-transform duration-500 ease-in-out h-full w-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {carouselItems.map((item) => (
                  <div
                    key={item.id}
                    className="min-w-full h-full w-full flex-shrink-0 bg-red-200 border-2 flex flex-col items-center justify-center p-4 sm:p-6"
                  >
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mb-4 sm:mb-6">
                      <Image
                        src={item.image}
                        alt={`Icon for ${item.title}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 112px"
                      />
                    </div>

                    <h3 className="text-xl sm:text-2xl md:text-3xl font-playfair font-bold text-gray-800 mb-1 sm:mb-2 text-center break-words">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700 text-center px-2 break-words">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* navigation arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 hover:opacity-60 rounded-full p-1 sm:p-2 z-20"
              aria-label="Previous slide"
            >
              <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 5V7H16V8H15V9H14V10H13V11H12V13H13V14H14V15H15V16H16V17H17V19H16V20H14V19H13V18H12V17H11V16H10V15H9V14H8V13H7V11H8V10H9V9H10V8H11V7H12V6H13V5H14V4H16V5H17Z" fill="black" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 hover:opacity-60 rounded-full p-1 sm:p-2 z-20"
              aria-label="Next slide"
            >
              <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 19V17H8V16H9V15H10V14H11V13H12V11H11V10H10V9H9V8H8V7H7V5H8V4H10V5H11V6H12V7H13V8H14V9H15V10H16V11H17V13H16V14H15V15H14V16H13V17H12V18H11V19H10V20H8V19H7Z" fill="black" />
              </svg>
            </button>
          </div>

          {/* dot indicators */}
          <div className="flex justify-center mt-3 sm:mt-4 space-x-1 sm:space-x-2">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors duration-300 ${index === currentSlide ? 'bg-red-400' : 'bg-gray-300'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <HeroSection />
      </main>
    </div>
  );
}