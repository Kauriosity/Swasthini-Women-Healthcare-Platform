'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import Button from './Button';
import { Heart, Menu, X } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    setIsAuthenticated(!!token);
  }, [pathname]);

  const handleLogout = () => {
    Cookies.remove('token');
    setIsAuthenticated(false);
    router.push('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Cycle Tracker', path: '/cycle-tracker' },
    { name: 'Appointments', path: '/appointments' },
    { name: 'Forum', path: '/forum' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-secondary sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <span className="font-bold text-xl text-foreground tracking-tight">Swasthini</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`text-sm font-medium transition-colors ${
                      pathname === link.path ? 'text-primary' : 'text-foreground hover:text-primary'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="h-6 w-px bg-secondary mx-2"></div>
                <Button variant="ghost" onClick={handleLogout} className="text-sm">Logout</Button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Login</Link>
                <Link href="/register">
                  <Button variant="primary" className="text-sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground hover:text-primary focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-secondary px-4 pt-2 pb-4 space-y-1">
          {isAuthenticated ? (
            <>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-foreground hover:text-primary hover:bg-secondary"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="my-2 border-secondary" />
              <button
                onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-500 hover:bg-red-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-foreground hover:text-primary hover:bg-secondary">
                Login
              </Link>
              <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 mt-2 rounded-lg text-base font-medium text-white bg-primary hover:bg-primary-dark">
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
