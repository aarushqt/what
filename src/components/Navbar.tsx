'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Navbar() {
    const { data: session, status } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                buttonRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


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
                            <div className="flex items-center justify-center space-x-4 relative">
                                <p className="text-base sm:text-xl lg:text-2xl">Hey, <span className='font-bold'>{session.user?.name || 'User'}</span></p>
                                <div className="relative">
                                    <button
                                        ref={buttonRef}
                                        onClick={toggleDropdown}
                                        className="bg-red-200 p-2 flex items-center gap-2 hover:cursor-pointer lg:gap-4 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0)] border-2 transition duration-300"
                                    >
                                        <svg
                                            width="36"
                                            height="36"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            {dropdownOpen ? (
                                                <path fillRule="evenodd" clipRule="evenodd" d="M5 5H7V7H5V5ZM9 9H7V7H9V9ZM11 11H9V9H11V11ZM13 11H11V13H9V15H7V17H5V19H7V17H9V15H11V13H13V15H15V17H17V19H19V17H17V15H15V13H13V11ZM15 9V11H13V9H15ZM17 7V9H15V7H17ZM17 7V5H19V7H17Z" fill="black" />
                                            ) : (
                                                <path fillRule="evenodd" clipRule="evenodd" d="M4 6H20V8H4V6ZM4 11.0001H20V13.0001H4V11.0001ZM20 16H4V18H20V16Z" fill="black" />
                                            )}
                                        </svg>
                                    </button>
                                    {dropdownOpen && (
                                        <div ref={dropdownRef} className="absolute right-0 top-full mt-2 w-56 bg-white z-10 border-2">
                                            <div className="py-1">
                                                <Link href="/change-password"
                                                    className="flex items gap-2 px-2 py-2 hover:bg-red-100"
                                                    onClick={() => setDropdownOpen(false)}
                                                >
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M10 3H8V5H6V7H8V5H10V7H12V9H10V11H8V13H6V15H4V13H2V15H4V17H6V15H8H10V17H12V19H10V21H12V19H14V17H12V15V13H14V11H16V13H18V15H20V13H22V11H20V13H18V11H16V9H18V5H14V7H12V5H10V3Z" fill="black" />
                                                    </svg>
                                                    Change Password
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        setDropdownOpen(false);
                                                        signOut({ callbackUrl: '/' });
                                                    }}
                                                    className="hover:cursor-pointer w-full text-left px-2 py-2 hover:bg-red-100 flex items-center gap-2"
                                                ><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M5 3H19H21V5V7H19V5H5V19H19V17H21V19V21H19H5H3V19V5V3H5ZM21 11H19V9H17V7H15V9H17V11H7V13L17 13V15H15V17H17V15H19V13L21 13V11Z" fill="black" />
                                                    </svg>
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/auth?mode=signin"
                                className="py-1.5 px-4 lg:py-2 lg:px-6 bg-red-200 flex items-center gap-2 hover:cursor-pointer lg:gap-4 font-lexend hover:shadow-[5px_5px_0px_0px_rgba(0,0,0)] sm:hover:shadow-[10px_10px_0px_0px_rgba(0,0,0)] text-base sm:text-xl lg:text-2xl border-2 transition duration-300"
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
                            className="border-2 p-1 bg-red-200"
                            onClick={toggleMenu}
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                {menuOpen ? (
                                    <path fillRule="evenodd" clipRule="evenodd" d="M5 5H7V7H5V5ZM9 9H7V7H9V9ZM11 11H9V9H11V11ZM13 11H11V13H9V15H7V17H5V19H7V17H9V15H11V13H13V15H15V17H17V19H19V17H17V15H15V13H13V11ZM15 9V11H13V9H15ZM17 7V9H15V7H17ZM17 7V5H19V7H17Z" fill="black" />
                                ) : (
                                    <path fillRule="evenodd" clipRule="evenodd" d="M4 6H20V8H4V6ZM4 11.0001H20V13.0001H4V11.0001ZM20 16H4V18H20V16Z" fill="black" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {menuOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1 px-4 font-lexend">
                        {status === 'authenticated' ? (
                            <>
                                <div className="mb-2 text-xl">Hey, <span className='font-bold'>{session.user?.name || 'User'}</span></div>
                                <Link
                                    href="/change-password"
                                    className="w-full text-left py-2 px-4 flex items-center gap-2 bg-red-200 font-lexend hover:bg-red-100 text-base border-2 transition duration-300 mb-2"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10 3H8V5H6V7H8V5H10V7H12V9H10V11H8V13H6V15H4V13H2V15H4V17H6V15H8H10V17H12V19H10V21H12V19H14V17H12V15V13H14V11H16V13H18V15H20V13H22V11H20V13H18V11H16V9H18V5H14V7H12V5H10V3Z" fill="black" />
                                    </svg>
                                    Change Password
                                </Link>
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