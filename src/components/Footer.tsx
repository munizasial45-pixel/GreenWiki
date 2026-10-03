import React from 'react';
import Link from 'next/link';
import { Sprout, Heart, Compass, Calendar, BookOpen, Droplets, Sun, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-forest-950 text-cream-100 border-t border-forest-800/60 transition-colors">
      {/* Top Banner Tip */}
      <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-forest-900 border-b border-forest-800 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 text-sprout-400 text-sm font-medium">
            <Sparkles className="w-4 h-4 shrink-0 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Gardener&apos;s Pro Tip: Always check soil moisture 2 inches down with your finger before reaching for the watering can!</span>
          </div>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-sprout-500 hover:bg-sprout-400 text-forest-950 px-3.5 py-1.5 rounded-full transition-all hover:scale-105 shrink-0"
          >
            Find Your Match <Compass className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sprout-500 flex items-center justify-center text-forest-950 shadow-soft">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Green<span className="text-sprout-400">Wiki</span>
              </span>
            </div>
            <p className="text-sm text-cream-300 leading-relaxed max-w-sm">
              The modern, beautifully curated encyclopedia for home gardeners. Discover exact watering rhythms, seasonal calendars, soil mixes, and troubleshooting solutions tailored for indoor and outdoor living.
            </p>
            <div className="pt-2 text-xs text-cream-400/80">
              Specially tuned for diverse climates, including hot & arid regions (Pakistan/Sindh/Punjab), Mediterranean zones, and temperate indoor spaces.
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="font-serif text-base font-semibold text-white mb-4">Categories</h4>
            <ul className="space-y-2.5 text-sm text-cream-300">
              <li>
                <Link href="/plants?category=Indoor" className="hover:text-sprout-300 transition-colors">
                  Indoor Houseplants
                </Link>
              </li>
              <li>
                <Link href="/plants?category=Flowers" className="hover:text-sprout-300 transition-colors">
                  Flowering Beauties
                </Link>
              </li>
              <li>
                <Link href="/plants?category=Herbs" className="hover:text-sprout-300 transition-colors">
                  Aromatic Culinary Herbs
                </Link>
              </li>
              <li>
                <Link href="/plants?category=Vegetables" className="hover:text-sprout-300 transition-colors">
                  Homegrown Vegetables
                </Link>
              </li>
              <li>
                <Link href="/plants?category=Succulents" className="hover:text-sprout-300 transition-colors">
                  Succulents & Cacti
                </Link>
              </li>
              <li>
                <Link href="/plants?category=Fruit+Trees" className="hover:text-sprout-300 transition-colors">
                  Fruit & Shade Trees
                </Link>
              </li>
            </ul>
          </div>

          {/* Growing Tools */}
          <div>
            <h4 className="font-serif text-base font-semibold text-white mb-4">Garden Tools</h4>
            <ul className="space-y-2.5 text-sm text-cream-300">
              <li>
                <Link href="/calendar" className="flex items-center gap-1.5 hover:text-sprout-300 transition-colors">
                  <Calendar className="w-3.5 h-3.5 text-sprout-400" /> Planting Calendar
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="flex items-center gap-1.5 hover:text-sprout-300 transition-colors">
                  <Compass className="w-3.5 h-3.5 text-sprout-400" /> Plant Finder Quiz
                </Link>
              </li>
              <li>
                <Link href="/saved" className="flex items-center gap-1.5 hover:text-sprout-300 transition-colors">
                  <Heart className="w-3.5 h-3.5 text-earth-400" /> My Garden Collection
                </Link>
              </li>
              <li>
                <Link href="/plants?difficulty=Easy" className="hover:text-sprout-300 transition-colors">
                  Beginner-Friendly Plants
                </Link>
              </li>
              <li>
                <Link href="/plants?petSafeOnly=true" className="hover:text-sprout-300 transition-colors">
                  100% Pet-Safe Plants
                </Link>
              </li>
            </ul>
          </div>

          {/* Care Guides */}
          <div>
            <h4 className="font-serif text-base font-semibold text-white mb-4">Care Principles</h4>
            <ul className="space-y-2.5 text-sm text-cream-300">
              <li className="flex items-center gap-2">
                <Droplets className="w-3.5 h-3.5 text-sky-400" /> Soak & dry method
              </li>
              <li className="flex items-center gap-2">
                <Sun className="w-3.5 h-3.5 text-amber-400" /> Sun-meter tracking
              </li>
              <li className="flex items-center gap-2">
                <Sprout className="w-3.5 h-3.5 text-sprout-400" /> Aerated soil mixes
              </li>
              <li>
                <span className="text-xs text-cream-400 block pt-2">
                  All profiles include printable one-page care sheets for quick garden reference.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-forest-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream-400">
          <p>© {new Date().getFullYear()} GreenWiki. Accurate, practical botanical knowledge for every grower.</p>
          <div className="flex items-center gap-6">
            <Link href="/plants" className="hover:text-white transition-colors">Explore All Plants</Link>
            <Link href="/calendar" className="hover:text-white transition-colors">12-Month Calendar</Link>
            <Link href="/quiz" className="hover:text-white transition-colors">Plant Quiz</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
