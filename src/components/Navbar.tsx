'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sprout, BookOpen, Calendar, Compass, Heart, Sun, Moon, Menu, X } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';

export function Navbar() {
  const pathname = usePathname();
  const { count } = useFavorites();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/', icon: Sprout },
    { name: 'Plant Library', href: '/plants', icon: BookOpen },
    { name: 'Planting Calendar', href: '/calendar', icon: Calendar },
    { name: 'Plant Finder Quiz', href: '/quiz', icon: Compass },
    { name: 'My Garden', href: '/saved', icon: Heart, badge: count },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-cream-50/90 dark:bg-forest-950/90 backdrop-blur-md border-b border-forest-900/10 dark:border-forest-800/40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 rounded-lg p-1">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-sprout-500 to-forest-700 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-forest-900 dark:text-cream-50 leading-tight">
                Green<span className="text-sprout-600 dark:text-sprout-400">Wiki</span>
              </span>
              <span className="text-[10px] sm:text-xs tracking-wider uppercase text-forest-700/80 dark:text-forest-200/80 font-medium">
                Plant Care Encyclopedia
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-forest-800 text-white dark:bg-sprout-500/20 dark:text-sprout-300 shadow-sm'
                      : 'text-forest-800/80 dark:text-cream-200 hover:text-forest-950 dark:hover:text-white hover:bg-forest-100/60 dark:hover:bg-forest-900/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-sprout-300 dark:text-sprout-400' : 'text-forest-600 dark:text-forest-400'}`} />
                  <span>{link.name}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-earth-500 text-white animate-fade-in">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Dark Mode & Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl border border-forest-900/10 dark:border-forest-700/50 bg-white/70 dark:bg-forest-900/60 text-forest-800 dark:text-cream-100 hover:bg-forest-50 dark:hover:bg-forest-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-sprout-500"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-forest-800 hover:text-forest-950" />
              ) : (
                <Sun className="w-5 h-5 text-amber-300 hover:text-amber-200" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-forest-900/10 dark:border-forest-700/50 bg-white/70 dark:bg-forest-900/60 text-forest-800 dark:text-cream-100 hover:bg-forest-50 dark:hover:bg-forest-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-forest-900/10 dark:border-forest-800 bg-cream-50 dark:bg-forest-950 px-4 pt-2 pb-6 space-y-2 animate-fade-in shadow-lg">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  active
                    ? 'bg-forest-800 text-white dark:bg-sprout-500/20 dark:text-sprout-300'
                    : 'text-forest-800 dark:text-cream-200 hover:bg-forest-100/70 dark:hover:bg-forest-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-sprout-600 dark:text-sprout-400" />
                  <span>{link.name}</span>
                </div>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-earth-500 text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
