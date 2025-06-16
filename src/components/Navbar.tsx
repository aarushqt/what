'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

export default function Navbar() {
    const { data: session, status } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="bg-white border-b-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 sm:h-20 md:h-24">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center gap-2 sm:gap-4">
                            <Image
                                src="/heart.svg"
                                width={24}
                                height={24}
                                alt="Heart Logo"
                                className='animate-heartbeat sm:w-[30px] sm:h-[30px]'
                            />
                            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold font-playfair text-black">Office of Girlfriend Affairs</span>
                        </Link>
                    </div>

                    {/* Desktop navigation */}
                    <div className="hidden sm:flex items-center font-lexend">
                        {status === 'authenticated' ? (
                            <div className="flex items-center space-x-4">
                                <p className="text-base sm:text-xl lg:text-2xl">Hey, <span className='font-bold'>{session.user?.name || 'User'}</span></p>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="py-1.5 px-4 lg:py-2 lg:px-6 bg-red-200 flex items-center gap-2 lg:gap-4 font-lexend hover:shadow-[5px_5px_0px_0px_rgba(0,0,0)] sm:hover:shadow-[10px_10px_0px_0px_rgba(0,0,0)] text-base sm:text-xl lg:text-2xl border-2 transition duration-300"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M5 3H19H21V5V7H19V5H5V19H19V17H21V19V21H19H5H3V19V5V3H5ZM21 11H19V9H17V7H15V9H17V11H7V13L17 13V15H15V17H17V15H19V13L21 13V11Z" fill="black" />
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/auth?mode=signin"
                                className="py-1.5 px-4 lg:py-2 lg:px-6 bg-red-200 flex items-center gap-2 lg:gap-4 font-lexend hover:shadow-[5px_5px_0px_0px_rgba(0,0,0)] sm:hover:shadow-[10px_10px_0px_0px_rgba(0,0,0)] text-base sm:text-xl lg:text-2xl border-2 transition duration-300"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M5 3H3V5V7H5V5H19V19H5V17H3V19V21H5H19H21V19V5V3H19H5ZM17 11H15V9H13V7H11V9H13V11H3V13L13 13V15H11V17H13V15H15V13L17 13V11Z" fill="black" />
                                </svg>
                                Log In
                            </Link>
                        )}
                    </div>

                    <div className="sm:hidden flex items-center">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                            onClick={toggleMenu}
                        >
                            <svg
                                className="h-6 w-6"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                {menuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {menuOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1 px-4">
                        {status === 'authenticated' ? (
                            <>
                                <div className="mb-2 text-base text-gray-700">Hey, {session.user?.name || 'User'}</div>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="w-full text-left py-2 px-4 flex items-center gap-2 bg-red-200 font-lexend hover:bg-red-100 text-base border-2 transition duration-300"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M5 3H19H21V5V7H19V5H5V19H19V17H21V19V21H19H5H3V19V5V3H5ZM21 11H19V9H17V7H15V9H17V11H7V13L17 13V15H15V17H17V15H19V13L21 13V11Z" fill="black" />
                                    </svg>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/auth?mode=signin"
                                className="w-full py-2 px-4 flex items-center gap-2 bg-red-200 font-lexend hover:bg-red-100 text-base border-2 transition duration-300"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M5 3H3V5V7H5V5H19V19H5V17H3V19V21H5H19H21V19V5V3H19H5ZM17 11H15V9H13V7H11V9H13V11H3V13L13 13V15H11V17H13V15H15V13L17 13V11Z" fill="black" />
                                </svg>
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}