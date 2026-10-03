'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Sparkles,
  Calendar,
  Compass,
  ArrowRight,
  ShieldCheck,
  Droplets,
  Sun,
  Layers,
  CheckCircle2,
  Leaf
} from 'lucide-react';
import { getAllPlants, getFeaturedPlants, getPlantsForMonth, MONTH_NAMES } from '../lib/plants';
import { PlantCard } from '../components/PlantCard';
import { PlantCategory } from '../types/plant';

export default function HomePage() {
  const router = useRouter();
  const allPlants = useMemo(() => getAllPlants(), []);
  const featuredPlants = useMemo(() => getFeaturedPlants(6), []);
  
  const currentMonthIdx = new Date().getMonth(); // 0-11
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonthIdx + 1); // 1-12
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const categories: { label: PlantCategory; icon: string; count: number }[] = [
    { label: 'Indoor', icon: '🪴', count: allPlants.filter(p => p.category === 'Indoor').length },
    { label: 'Outdoor', icon: '🌳', count: allPlants.filter(p => p.category === 'Outdoor').length },
    { label: 'Flowers', icon: '🌸', count: allPlants.filter(p => p.category === 'Flowers').length },
    { label: 'Vegetables', icon: '🍅', count: allPlants.filter(p => p.category === 'Vegetables').length },
    { label: 'Herbs', icon: '🌿', count: allPlants.filter(p => p.category === 'Herbs').length },
    { label: 'Succulents', icon: '🌵', count: allPlants.filter(p => p.category === 'Succulents').length },
    { label: 'Fruit Trees', icon: '🍋', count: allPlants.filter(p => p.category === 'Fruit Trees').length },
  ];

  // Best to plant for the selected month
  const monthlyPlants = useMemo(() => {
    return getPlantsForMonth(selectedMonth).slice(0, 4);
  }, [selectedMonth]);

  // Live search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allPlants
      .filter(p => p.commonName.toLowerCase().includes(q) || p.scientificName.toLowerCase().includes(q))
      .slice(0, 5);
  }, [searchQuery, allPlants]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/plants?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/plants');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-forest-100/60 via-cream-50 to-cream-50 dark:from-forest-900/40 dark:via-forest-950 dark:to-forest-950">
        {/* Decorative background blobs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sprout-400/20 dark:bg-sprout-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-earth-400/10 dark:bg-earth-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-800/10 dark:bg-forest-800/50 border border-forest-800/20 dark:border-forest-700/60 text-forest-800 dark:text-sprout-300 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-6 backdrop-blur-sm animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-sprout-600 dark:text-sprout-400" />
            Complete Botanical Care Encyclopedia
          </div>

          {/* Heading */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-forest-950 dark:text-cream-50 tracking-tight leading-[1.15] mb-6">
            Grow Thriving Plants, <br className="hidden sm:inline" />
            <span className="text-forest-700 dark:text-sprout-400 italic">No Guesswork Required.</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-stone-600 dark:text-stone-300 mb-10 leading-relaxed font-sans">
            Look up any plant for exact watering rhythms, seasonal planting calendars, sun-meters, and soil formulas tailored for both indoor sanctuaries and outdoor gardens.
          </p>

          {/* SEARCH BAR */}
          <div className="relative max-w-2xl mx-auto mb-10">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <div className="absolute left-4 sm:left-5 text-forest-700 dark:text-forest-400 pointer-events-none">
                <Search className="w-6 h-6" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search any plant (e.g. Aloe Vera, Tomato, Motia, Snake Plant)..."
                className="w-full pl-12 sm:pl-14 pr-28 sm:pr-36 py-4 sm:py-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-forest-900 border-2 border-forest-800/20 dark:border-forest-700/60 shadow-elevated focus:outline-none focus:border-forest-600 dark:focus:border-sprout-400 text-forest-950 dark:text-cream-50 text-base sm:text-lg transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 sm:right-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-forest-800 hover:bg-forest-900 dark:bg-sprout-500 dark:hover:bg-sprout-400 text-white dark:text-forest-950 font-semibold text-sm sm:text-base shadow-soft hover:shadow-card transition-all active:scale-95"
              >
                Search
              </button>
            </form>

            {/* Live Autocomplete Suggestions */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <div
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-forest-900 rounded-2xl shadow-elevated border border-forest-900/10 dark:border-forest-700/60 overflow-hidden z-30 text-left animate-slide-up"
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              >
                <div className="p-2 text-xs font-semibold text-stone-600 dark:text-stone-300 uppercase tracking-wider px-3 border-b border-forest-900/10 dark:border-forest-800">
                  Instant Plant Suggestions
                </div>
                {searchSuggestions.map((plant) => (
                  <Link
                    key={plant.id}
                    href={`/plants/${plant.id}`}
                    className="flex items-center justify-between p-3 hover:bg-forest-50 dark:hover:bg-forest-800/60 transition-colors"
                    onClick={() => setIsSearchFocused(false)}
                  >
                    <div>
                      <div className="font-medium text-forest-950 dark:text-cream-100 text-sm">
                        {plant.commonName}
                      </div>
                      <div className="text-xs italic text-stone-600 dark:text-stone-300">
                        {plant.scientificName} • {plant.category}
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-sprout-300 font-medium">
                      {plant.difficulty}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* QUICK CATEGORY PILLS */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <span className="text-xs font-medium text-stone-600 dark:text-stone-300 mr-1 hidden sm:inline">
              Quick explore:
            </span>
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={`/plants?category=${encodeURIComponent(cat.label)}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-forest-900/80 hover:bg-forest-100 dark:hover:bg-forest-800 border border-forest-900/10 dark:border-forest-700/50 text-forest-900 dark:text-cream-100 text-xs sm:text-sm font-medium shadow-sm transition-all hover:scale-105"
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className="text-[10px] text-stone-600 dark:text-stone-300">({cat.count})</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BEST TO PLANT THIS MONTH */}
      <section className="py-16 md:py-20 bg-cream-100/60 dark:bg-forest-950 border-y border-forest-900/10 dark:border-forest-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sprout-700 dark:text-sprout-400 mb-2">
                <Calendar className="w-4 h-4" />
                Seasonal Planting Window
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-forest-950 dark:text-cream-50">
                Best to Plant in {MONTH_NAMES[selectedMonth - 1]}
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-300 mt-1 max-w-xl">
                Plants that thrive when sown or transplanted right now. Switch months to plan your upcoming garden cycles.
              </p>
            </div>

            {/* Month Switcher Tabs */}
            <div className="flex items-center gap-1 bg-white dark:bg-forest-900 p-1.5 rounded-2xl border border-forest-900/10 dark:border-forest-800 overflow-x-auto max-w-full">
              {[
                { num: currentMonthIdx + 1, label: `Now (${MONTH_NAMES[currentMonthIdx].slice(0, 3)})` },
                { num: ((currentMonthIdx + 1) % 12) + 1, label: MONTH_NAMES[((currentMonthIdx + 1) % 12)].slice(0, 3) },
                { num: ((currentMonthIdx + 2) % 12) + 1, label: MONTH_NAMES[((currentMonthIdx + 2) % 12)].slice(0, 3) },
              ].map((m) => (
                <button
                  key={m.num}
                  onClick={() => setSelectedMonth(m.num)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedMonth === m.num
                      ? 'bg-forest-800 text-white dark:bg-sprout-500 dark:text-forest-950 shadow-sm'
                      : 'text-forest-800 dark:text-cream-200 hover:bg-forest-50 dark:hover:bg-forest-800'
                  }`}
                >
                  {m.label}
                </button>
              ))}
              <Link
                href="/calendar"
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-sprout-700 dark:text-sprout-400 hover:underline flex items-center gap-1 whitespace-nowrap"
              >
                All 12 Months <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Monthly Plants Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {monthlyPlants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href={`/calendar?month=${selectedMonth}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-forest-800 dark:text-sprout-300 hover:text-forest-950 dark:hover:text-sprout-200 hover:underline"
            >
              Explore all plants suitable for {MONTH_NAMES[selectedMonth - 1]} in the Planting Calendar
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED PLANTS GRID */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-forest-300 mb-2">
              <Leaf className="w-4 h-4 text-sprout-500" />
              Botanical Highlights
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 dark:text-cream-50">
              Popular & Resilient Favorites
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">
              Top choices for indoor air purification, lush garden blooms, and low-maintenance greenery.
            </p>
          </div>
          <Link
            href="/plants"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-semibold text-sm shadow-soft hover:shadow-card transition-all"
          >
            Browse All {allPlants.length} Plants <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredPlants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} featured />
          ))}
        </div>
      </section>

      {/* INTERACTIVE QUIZ CALLOUT */}
      <section className="py-16 bg-gradient-to-r from-forest-900 via-forest-800 to-forest-900 text-white relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-sprout-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sprout-500/20 border border-sprout-400/30 text-sprout-300 text-xs font-bold tracking-wide uppercase">
                <Compass className="w-3.5 h-3.5" /> 60-Second Plant Matcher
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                Not sure what will thrive in your space?
              </h2>
              <p className="text-cream-200 text-base leading-relaxed">
                Take our 5-question Plant Finder Quiz. Tell us about your sunlight exposure, available care time, space, and whether you have pets, and we will match you with your ideal botanicals.
              </p>
              <div className="pt-2">
                <Link
                  href="/quiz"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-sprout-400 hover:bg-sprout-300 text-forest-950 font-bold text-base shadow-elevated transition-transform hover:scale-105"
                >
                  Start Plant Finder Quiz <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Quiz Preview Cards */}
            <div className="bg-forest-950/70 p-6 sm:p-8 rounded-3xl border border-forest-700/50 backdrop-blur-md space-y-4">
              <div className="text-xs uppercase font-bold text-sprout-400 tracking-wider">
                What the quiz evaluates:
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-3 rounded-xl bg-forest-900/60 border border-forest-700/40 flex items-center gap-2.5">
                  <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Sunlight exposure (full sun vs shade)</span>
                </div>
                <div className="p-3 rounded-xl bg-forest-900/60 border border-forest-700/40 flex items-center gap-2.5">
                  <Droplets className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Your watering frequency & time</span>
                </div>
                <div className="p-3 rounded-xl bg-forest-900/60 border border-forest-700/40 flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Pet safety filter (cats & dogs)</span>
                </div>
                <div className="p-3 rounded-xl bg-forest-900/60 border border-forest-700/40 flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-earth-300 shrink-0" />
                  <span>Indoor room vs outdoor garden</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY GREENWIKI SECTION */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 dark:text-cream-50">
            Engineered for Gardeners, Not Guessers
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base mt-2">
            Every plant profile contains realistic, actionable instructions verified across challenging climate conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-forest-900/50 border border-forest-900/10 dark:border-forest-800/60 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Sun className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest-950 dark:text-cream-100">
              Visual Sun-Meters
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              Clear 4-level light rating to immediately know if your windowsill, balcony, or garden patch provides sufficient lumens.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-forest-900/50 border border-forest-900/10 dark:border-forest-800/60 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest-950 dark:text-cream-100">
              Summer vs Winter Watering
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              Seasonal adjustments preventing the #1 cause of plant death: overwatering during cold dormancy or underwatering in 40°C heat.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-forest-900/50 border border-forest-900/10 dark:border-forest-800/60 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest-950 dark:text-cream-100">
              Climate-Adapted Calendars
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              Detailed coverage for hot arid climates (Pakistan/Sindh/Punjab), Mediterranean zones, and temperate regions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
