import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// ─── Page title mapping ───
const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Tableau de Bord',
  '/members': 'Adhérents',
  '/events': 'Événements',
  '/finances': 'Finances',
  '/documents': 'Documents',
  '/settings': 'Paramètres',
};

// ─── Icons ───
const IconBell = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const IconChevronDown = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

// ─── Props ───
interface TopbarProps {
  onMenuToggle: () => void;
}

// ─── Component ───
const Topbar: React.FC<TopbarProps> = ({ onMenuToggle }) => {
  const location = useLocation();
  const [language, setLanguage] = useState<'FR' | 'AR'>('FR');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount] = useState(3);

  const langDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  // Determine page title from current path
  const pageTitle =
    PAGE_TITLES[location.pathname] || 'AssociaMA';

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setShowLangDropdown(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 border-b"
      style={{
        backgroundColor: 'white',
        borderColor: '#E5E7EB',
        paddingLeft: '4rem', // Space for mobile hamburger
      }}
    >
      {/* Left: Page Title */}
      <div className="flex items-center gap-4">
        <h1
          className="text-lg sm:text-xl font-semibold"
          style={{ color: '#1A5276' }}
        >
          {pageTitle}
        </h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Language Switcher */}
        <div className="relative" ref={langDropdownRef}>
          <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors hover:bg-gray-50"
            style={{ color: '#1A5276', borderColor: '#D1D5DB' }}
          >
            <span>{language}</span>
            <IconChevronDown />
          </button>

          {showLangDropdown && (
            <div className="absolute right-0 mt-2 w-28 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <button
                onClick={() => {
                  setLanguage('FR');
                  setShowLangDropdown(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  language === 'FR' ? 'font-semibold' : 'text-gray-600'
                }`}
                style={language === 'FR' ? { color: '#1A5276', backgroundColor: '#EBF5FB' } : {}}
              >
                Français
              </button>
              <button
                onClick={() => {
                  setLanguage('AR');
                  setShowLangDropdown(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  language === 'AR' ? 'font-semibold' : 'text-gray-600'
                }`}
                style={language === 'AR' ? { color: '#1A5276', backgroundColor: '#EBF5FB' } : {}}
              >
                العربية
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifDropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <IconBell />
            {notificationCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-xs font-bold text-white rounded-full"
                style={{ backgroundColor: '#E74C3C' }}
              >
                {notificationCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold" style={{ color: '#1A5276' }}>
                  Notifications
                </h3>
                <button className="text-xs text-blue-600 hover:underline">
                  Tout marquer lu
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {/* Sample notifications */}
                <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 cursor-pointer">
                  <p className="text-sm text-gray-800">Nouvel adhérent inscrit: Mohammed Alami</p>
                  <p className="text-xs text-gray-400 mt-1">Il y a 5 minutes</p>
                </div>
                <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 cursor-pointer">
                  <p className="text-sm text-gray-800">Événement "Formation" planifié</p>
                  <p className="text-xs text-gray-400 mt-1">Il y a 1 heure</p>
                </div>
                <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                  <p className="text-sm text-gray-800">Rapport financier disponible</p>
                  <p className="text-xs text-gray-400 mt-1">Il y a 3 heures</p>
                </div>
              </div>
              <div className="px-4 py-2 border-t border-gray-100">
                <button
                  className="w-full text-center text-sm py-1 rounded hover:bg-gray-50"
                  style={{ color: '#F39C12' }}
                >
                  Voir toutes les notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          {/* Avatar */}
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-semibold"
            style={{ backgroundColor: '#1A5276' }}
          >
            TA
          </div>

          {/* Name & Role (hidden on small screens) */}
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-medium text-gray-800">Tarik Alaoui</span>
            <span className="text-xs text-gray-400">Administrateur</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
