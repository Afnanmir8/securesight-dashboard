'use client';

import { useState } from 'react';

interface NavbarProps {
  unresolvedCount: number;
  resolvedCount: number;
}

const Navbar = ({ unresolvedCount, resolvedCount }: NavbarProps) => {
  const [currentUser] = useState('Afnan Mir');
  
  return (
    <nav className="bg-[#1a2332] text-white px-6 py-3 flex items-center justify-between border-b border-gray-700">
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">MS</span>
          </div>
          <h1 className="text-xl font-bold">MANDLACX</h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <NavItem icon="📊" label="Dashboard" active />
          <NavItem icon="📹" label="Cameras" />
          <NavItem icon="🎬" label="Scenes" />
          <NavItem icon="⚠️" label="Incidents" />
          <NavItem icon="👥" label="Users" />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-red-400">{unresolvedCount}</span>
          <span className="text-blue-400">🔓</span>
          <span className="text-blue-400">{resolvedCount} resolved incidents</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium">{currentUser.split(' ').map(n => n[0]).join('')}</span>
          </div>
          <span className="text-sm">{currentUser}</span>
          <span className="text-gray-400">▼</span>
        </div>
      </div>
    </nav>
  );
};

interface NavItemProps {
  icon: string;
  label: string;
  active?: boolean;
}

const NavItem = ({ icon, label, active }: NavItemProps) => (
  <button className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
    active 
      ? 'bg-yellow-600 text-white' 
      : 'text-gray-300 hover:text-white hover:bg-gray-700'
  }`}>
    <span>{icon}</span>
    <span className="text-sm font-medium">{label}</span>
  </button>
);

export default Navbar;
