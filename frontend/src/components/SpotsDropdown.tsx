import { useEffect, useRef } from 'react';
import Link from 'next/link';

interface SpotsDropdownProps {
  isOpen: boolean;
  toggleDropdown: () => void;
}

export default function SpotsDropdown({ isOpen, toggleDropdown }: SpotsDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        toggleDropdown();  // Close dropdown when clicking outside
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleDropdown]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-500"
      >
        Surf Spots
      </button>

      {isOpen && (
        <div className="absolute mt-2 bg-white text-black shadow-lg rounded-md w-48">
          <ul className="py-2">
            <li>
              <Link href="/spots/koelbay">
                <a className="block px-4 py-2 hover:bg-gray-200">Koel Bay</a>
              </Link>
            </li>
            <li>
              <Link href="/spots/bikinibeach">
                <a className="block px-4 py-2 hover:bg-gray-200">Bikini Beach</a>
              </Link>
            </li>
            <li>
              <Link href="/spots/kommetjie">
                <a className="block px-4 py-2 hover:bg-gray-200">Kommetjie</a>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
