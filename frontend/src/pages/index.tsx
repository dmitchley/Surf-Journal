

import { signOut } from 'next-auth/react';
import { useState } from 'react';
import SpotsDropdown from '@/components/SpotsDropdown';
import Link from 'next/link';
import withAuth from '@/lib/index';

const Dashboard = () => {
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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div>dd</div>
  );
}

export default withAuth(Dashboard)