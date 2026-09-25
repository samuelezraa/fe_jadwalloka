import React from 'react';
import { Menu, Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 md:px-6 flex items-center justify-between transition-colors duration-200">
      <div className="flex items-center gap-2 md:gap-4">
        {/* Tombol Desktop Collapse */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="hidden md:block p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Toggle Navigation"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Tombol Toggle Dark Mode */}
        <button 
          type="button"
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 text-white transition-colors cursor-pointer shadow-sm"
          title="Toggle Dark/Light Mode"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div>
        <h1 className="text-sm md:text-lg font-bold text-gray-800 dark:text-gray-100 tracking-wide">
          LOKA HR SYSTEM
        </h1>
      </div>
    </header>
  );
};