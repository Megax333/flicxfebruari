import React, { ReactNode } from 'react';

interface SidebarIconProps {
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
  tooltip: string;
}

const SidebarIcon = ({ icon, active, onClick, tooltip }: SidebarIconProps) => (
  <div className="relative group">
    <button
      onClick={onClick}
      className={`p-3 rounded-xl transition-all duration-200 ${
        active ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-[#1E1E2A] hover:text-white'
      }`}
    >
      {icon}
    </button>
    <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#1E1E2A] text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-sm">
      {tooltip}
    </span>
  </div>
);

export default SidebarIcon;