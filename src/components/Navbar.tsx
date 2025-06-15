'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
    const { data: session, status } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="bg-white border-b-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-24">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center gap-4">
                            <svg width="30.75" height="25" viewBox="0 0 52 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M51.6663 7V18.6667H49.333V21H46.9997V23.3333H44.6663V25.6667H42.333V28H39.9997V30.3333H37.6663V32.6667H35.333V35H32.9997V37.3333H30.6663V39.6667H28.333V42H23.6663V39.6667H21.333V37.3333H18.9997V35H16.6663V32.6667H14.333V30.3333H11.9997V28H9.66634V25.6667H7.33301V23.3333H4.99967V21H2.66634V18.6667H0.333008V7H2.66634V4.66667H4.99967V2.33333H7.33301V0H21.333V2.33333H23.6663V4.66667H28.333V2.33333H30.6663V0H44.6663V2.33333H46.9997V4.66667H49.333V7H51.6663Z" fill="black" />
                            </svg>
                            <span className="text-3xl font-bold font-playfair text-black">Office of Girlfriend Affairs</span>
                        </Link>
                    </div>

                    {/* Desktop navigation */}
                    <div className="hidden sm:flex items-center">
                        {status === 'authenticated' ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-700">Hey, {session.user?.name || 'User'}</span>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="py-2 px-6 bg-red-200 flex items-center gap-4 font-lexend hover:shadow-[10px_10px_0px_0px_rgba(0,0,0)] text-2xl border-2 transition duration-300"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/auth?mode=signin"
                                className="py-2 px-6 bg-red-200 flex items-center gap-4 font-lexend hover:shadow-[10px_10px_0px_0px_rgba(0,0,0)] text-2xl border-2 transition duration-300"
                            ><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M23 2H20V22H23V2Z" fill="black" />
                                    <path d="M8 4H10V5H11V6H12V7H13V8H14V9H15V10H16V11H17V13H16V14H15V15H14V16H13V17H12V18H11V19H10V20H8V19H7V17H8V16H9V15H10V14H1V10H10V9H9V8H8V7H7V5H8V4Z" fill="black" />
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
                                <div className="mb-2 text-gray-700">Hey, {session.user?.name || 'User'}</div>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="w-full text-left py-2 px-6 flex items-center gap-4 bg-red-200 font-lexend hover:bg-red-100 text-2xl border-2 transition duration-300"
                                ><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14 5V4H16V5H17V6H18V7H19V8H20V9H21V10H22V11H23V13H22V14H21V15H20V16H19V17H18V18H17V19H16V20H14V19H13V17H14V16H15V15H16V14H7V10H16V9H15V8H14V7H13V5H14Z" fill="black" />
                                        <path d="M4 2H1V22H4V2Z" fill="black" />
                                    </svg>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/auth?mode=signin"
                                className="py-2 px-6 flex items-center gap-4 bg-red-200 font-lexend hover:bg-red-100 text-2xl border-2 transition duration-300"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}