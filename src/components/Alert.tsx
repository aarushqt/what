import React from 'react';

interface ErrorAlertProps {
    message: string;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
    if (!message) return null;

    return (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M6 4H20V6H22V8V10V12H14V14H20V16H16V18H14V20H2V18V16V14V12V10V8H4V6H6V4ZM8 10H10V8H8V10Z" fill="#C10007" />
            </svg>
            {message}
        </div>
    );
}

interface SuccessAlertProps {
    message: string;
}

export function SuccessAlert({ message }: SuccessAlertProps) {
    if (!message) return null;

    return (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700">
            {message}
        </div>
    );
}