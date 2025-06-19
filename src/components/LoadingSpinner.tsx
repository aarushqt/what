import Image from 'next/image';

export default function LoadingSpinner() {
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