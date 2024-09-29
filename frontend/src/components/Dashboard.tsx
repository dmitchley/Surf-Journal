
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import SpotsDropdown from '@/components/SpotsDropdown';
import Link from 'next/link';

function Dashboard() {
  const [active, setActive] = useState('dashboard');

  const handleNavigation = (section: string) => {
    setActive(section);
  };

  const handleLogout = async () => {
    await signOut({
      redirect: true,
      callbackUrl: '/login',
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-5">
        <h2 className="text-2xl font-bold mb-8">Surf Journal</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <button
                onClick={() => handleNavigation('dashboard')}
                className={`w-full text-left py-2 px-4 rounded-md ${active === 'dashboard' ? 'bg-indigo-600' : 'hover:bg-gray-700'
                  }`}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/KoelBay')}
                className={`w-full text-left py-2 px-4 rounded-md bg-[#18202b] hover:bg-gray-700'
                  }`}
              >
                Koel Bay
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLogout()}
                className="w-full text-left py-2 px-4 rounded-md bg-red-600 hover:bg-red-500"
              >
                Log out
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-10">
        <div>
          <h1 className="text-3xl font-semibold mb-4">Dashboard Overview</h1>
          <p className="text-gray-700">Welcome to your dashboard. Here’s a quick summary of your activities.</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard 
