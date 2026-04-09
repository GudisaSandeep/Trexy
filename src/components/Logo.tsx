import Image from 'next/image';
import Link from 'next/link';

export function Logo({ className = '', width = 90 }: { className?: string, width?: number }) {
  return (
    <Link href="/" className={`flex flex-col items-center justify-center group ${className}`}>
      <div className="relative hover:scale-105 active:scale-95 transition-transform duration-300">
        <Image 
          src="/Logo.png"
          alt="Trexy Logo"
          width={width}
          height={width}
          priority
          className="object-contain"
        />
      </div>
    </Link>
  );
}
