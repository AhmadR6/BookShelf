import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  return (
    <>
      <nav className="flex items-center justify-between px-4 md:px-6 py-3 bg-black text-white relative">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">📖</span>
          <Link to="/" className="font-semibold text-lg">
            BookShelf
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-6">
          <Link to="/" className="hover:text-red-400 transition-colors">
            Home
          </Link>
          <Link to="/explore" className="hover:text-red-400 transition-colors">
            Explore
          </Link>
        </div>

        {/* Desktop Search and Auth */}
        <div className="hidden lg:flex items-center gap-3">
          <input
            type="text"
            placeholder="Search books, authors..."
            className="bg-gray-800 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
          />
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-300 truncate max-w-32">
                Welcome, {user?.name || user?.email}
              </span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Search Toggle Button */}
          <button
            onClick={toggleSearch}
            className="p-2 hover:bg-gray-800 rounded transition-colors"
            aria-label="Toggle search"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="p-2 hover:bg-gray-800 rounded transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="lg:hidden bg-gray-900 px-4 py-3 border-b border-gray-700">
          <input
            type="text"
            placeholder="Search books, authors..."
            className="w-full bg-gray-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            autoFocus
          />
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-gray-900 border-b border-gray-700">
          {/* Navigation Links */}
          <div className="px-4 py-2 space-y-2">
            <Link
              to="/"
              className="block py-2 hover:text-red-400 transition-colors"
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
            <Link
              to="/explore"
              className="block py-2 hover:text-red-400 transition-colors"
              onClick={toggleMobileMenu}
            >
              Explore
            </Link>
          </div>

          {/* Auth Section */}
          <div className="px-4 py-3 border-t border-gray-700">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="text-sm text-gray-300">
                  Welcome, {user?.name || user?.email}
                </div>
                <button
                  onClick={() => {
                    logout();
                    toggleMobileMenu();
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="flex-1 text-center bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded text-sm transition-colors"
                  onClick={toggleMobileMenu}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="flex-1 text-center bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-sm transition-colors"
                  onClick={toggleMobileMenu}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
