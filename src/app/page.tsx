'use client';

import { useEffect, useState, useRef, TouchEvent, useCallback } from 'react';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';


const HeroSection = ({ session }: { session: Session | null }) => {

  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const minSwipeDistance = 50;
  const autoSlideInterval = 5000;

  const carouselItems = [
    {
      id: 1,
      title: "Have your boyfriend sign up",
      content: "baddies don't have time to remember any email or password, so they will just use the link shared by him",
      image: "/contact-plus.svg"
    },
    {
      id: 2,
      title: "Submitting Complaints",
      content: "pour your heart out, you can submit as many complaints as you want with your current mood, and he will get notified",
      image: "/mail-arrow-right.svg"
    },
    {
      id: 3,
      title: "Immediate Resolution",
      content: "he will get notified immediately and can resolve your complaints in real-time, no more waiting",
      image: "/teach.svg"
    },
  ];

  const startAutoSlideTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev === carouselItems.length - 1 ? 0 : prev + 1));
    }, autoSlideInterval);
  }, [carouselItems.length]);

  useEffect(() => {
    startAutoSlideTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startAutoSlideTimer]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1));
    startAutoSlideTimer();
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? carouselItems.length - 1 : prev - 1));
    startAutoSlideTimer();
  };

  const goToSlide = (index: number): void => {
    setCurrentSlide(index);
    startAutoSlideTimer();
  };

  const handleTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="max-w-7xl mx-auto md:py-8 sm:py-4 md:mt-30 mt-16 px-4">
      <div className="flex-col sm:flex-col lg:flex lg:flex-row items-stretch gap-8">
        <div className="w-full md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-7xl md:text-7xl lg:text-8xl font-bold font-playfair tracking-tight text-gray-900 mb-4 sm:mb-6 md:mb-8">
              <span className='text-red-300'>Girlfriend</span> Grievance Portal
            </h1>
            <p className="text-lg sm:text-xl text-gray-800 font-lexend">
              Make your boyfriends sign up to get your complaints urgently.
            </p>
          </div>

          <Image
            src="/emoticons/puppy-face.svg"
            alt="happy"
            width={90}
            height={60}
            className="mt-4"
          />

          <div className="sm:mt-auto pt-4 sm:pt-8">
            {session ? (
              <Link href="/dashboard" className="inline-block">
                <button className="bg-red-200 flex items-center gap-2 sm:gap-4 font-lexend text-xl sm:text-2xl mb-2 sm:mb-10 font-medium py-2 px-4 sm:py-3 sm:px-6 border-2 transition duration-200 shadow-[6px_6px_0px_0px_rgba(0,0,0)] sm:shadow-[10px_10px_0px_0px_rgba(0,0,0)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0)] sm:hover:shadow-[15px_15px_0px_0px_rgba(0,0,0)]">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M2 5H22V19H2V5ZM4 7V9H20V7H4ZM20 11H4V13H20V11ZM20 15H4V17H20V15Z" fill="black" />
                  </svg>
                  Go to your Dashboard
                </button>
              </Link>
            ) : (
              <Link href="/auth?mode=signup" className="inline-block">
                <button className="bg-red-200 flex items-center gap-2 sm:gap-4 font-lexend text-xl sm:text-2xl mb-2 sm:mb-10 font-medium py-2 px-4 sm:py-3 sm:px-6 border-2 transition duration-200 shadow-[6px_6px_0px_0px_rgba(0,0,0)] sm:shadow-[10px_10px_0px_0px_rgba(0,0,0)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0)] sm:hover:shadow-[15px_15px_0px_0px_rgba(0,0,0)]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23 2H20V22H23V2Z" fill="black" />
                    <path d="M8 4H10V5H11V6H12V7H13V8H14V9H15V10H16V11H17V13H16V14H15V15H14V16H13V17H12V18H11V19H10V20H8V19H7V17H8V16H9V15H10V14H1V10H10V9H9V8H8V7H7V5H8V4Z" fill="black" />
                  </svg>
                  Sign Up
                </button>
              </Link>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 relative mt-6 sm:mt-0">
          <div className="relative overflow-hidden w-full">
            <div
              ref={carouselRef}
              className="relative h-64 sm:h-72 md:h-80 lg:h-[50vh] overflow-hidden w-full"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
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
                        sizes="(max-width: 640px) 120px, (max-width: 768px) 180px, 200px"
                      />
                    </div>

                    <h3 className="text-xl sm:text-2xl md:px-16 md:text-5xl font-playfair font-bold text-gray-800 mb-1 sm:mb-2 text-center break-words">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base md:px-16 mt-6 font-lexend text-gray-700 text-center break-words">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* navigation arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 hover:scale-130 transition duration-75 z-20"
              aria-label="Previous slide"
            >
              <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 5V7H16V8H15V9H14V10H13V11H12V13H13V14H14V15H15V16H16V17H17V19H16V20H14V19H13V18H12V17H11V16H10V15H9V14H8V13H7V11H8V10H9V9H10V8H11V7H12V6H13V5H14V4H16V5H17Z" fill="black" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 hover:scale-130 transition duration-75 z-20"
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
                className={`w-4 h-4 rounded-full transition-colors duration-300 ${index === currentSlide ? 'bg-black' : 'border-2 border-black bg-white'
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

  if (status === 'loading') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Image
          src="/heart.svg"
          width={100}
          height={100}
          alt="Heart Logo"
          className="animate-heartbeat"
        />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center align-middle px-4 py-auto">
        <HeroSection session={session} />
      </main>
    </div>
  );
}