import React from 'react';

interface InputFieldProps {
    id: string;
    label: string;
    type: 'text' | 'password' | 'email';
    value: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    icon: React.ReactNode;
}

export default function InputField({
    id,
    label,
    type,
    value,
    placeholder,
    onChange,
    required = true,
    icon
}: InputFieldProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {icon}
                </div>
                <input
                    type={type}
                    id={id}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    className="w-full pl-12 px-3 py-2 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-red-200"
                    required={required}
                />
            </div>
        </div>
    );
}