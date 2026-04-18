import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  MessageSquarePlus,
  Moon,
  Sun,
  Home,
  LayoutDashboard,
  BarChart3,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cx(...inputs) {
  return twMerge(clsx(inputs));
}

function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminLoggedIn = !!localStorage.getItem('adminToken');
  const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || 'null');

  const publicLinks = [{ name: 'Home', path: '/', icon: Home }];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  const navLinkClass = (isActive) =>
    cx(
      'inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200',
      isActive
        ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
    );

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900">
            <MessageSquarePlus size={20} strokeWidth={2.2} />
          </div>

          <div className="leading-tight">
            <p className="text-[1.35rem] font-extrabold tracking-tight text-slate-900 dark:text-white">
              Feedback<span className="text-blue-600 dark:text-blue-400">Hub</span>
            </p>
            <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
              Smart customer feedback system
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {publicLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;

            return (
              <Link key={link.path} to={link.path} className={navLinkClass(isActive)}>
                <Icon size={17} strokeWidth={2} />
                <span>{link.name}</span>
              </Link>
            );
          })}

          {isAdminLoggedIn && (
            <>
              <div className="mx-1 h-6 w-px bg-slate-200 dark:bg-slate-700" />
              {adminLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;

                return (
                  <Link key={link.path} to={link.path} className={navLinkClass(isActive)}>
                    <Icon size={17} strokeWidth={2} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!isAdminLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link
                to="/admin/register"
                className="hidden md:inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Register
              </Link>

              <Link
                to="/admin/login"
                className="hidden md:inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                <ShieldCheck size={16} />
                Admin Login
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Hi, {adminInfo?.name}
              </span>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}

          <button
            onClick={toggleTheme}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;