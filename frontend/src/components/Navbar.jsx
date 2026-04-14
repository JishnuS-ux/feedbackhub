import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { MessageSquarePlus, LayoutDashboard, BarChart3, Moon, Sun, Home } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cx(...inputs) {
  return twMerge(clsx(inputs));
}

function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Submit Feedback', path: '/submit', icon: MessageSquarePlus },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white">
            <MessageSquarePlus size={20} />
          </div>
          <span className="text-gray-900 dark:text-white">Feedback<span className="text-blue-500">Hub</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cx(
                  'flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200',
                  isActive 
                    ? 'bg-blue-50 dark:bg-gray-700/50 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                <Icon size={18} />
                {link.name}
              </Link>
            );
          })}
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
