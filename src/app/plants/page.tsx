'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  X,
  Sun,
  Droplets,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { getAllPlants, filterPlants, MONTH_NAMES } from '../../lib/plants';
import { PlantCard } from '../../components/PlantCard';
import { EmptyState } from '../../components/EmptyState';
import { FilterOptions } from '../../types/plant';

function PlantLibraryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const allPlants = useMemo(() => getAllPlants(), []);

  // Initialize filters from URL query parameters
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';
  const initialDifficulty = searchParams.get('difficulty') || 'All';
  const initialMonth = searchParams.get('month') ? parseInt(searchParams.get('month')!, 10) : 0;
  const initialPetSafe = searchParams.get('petSafeOnly') === 'true';

  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: initialSearch,
    category: initialCategory,
    difficulty: initialDifficulty,
    lightLevel: 'All',
    waterNeed: 'All',
    soilType: 'All',
    location: 'All',
    petSafeOnly: initialPetSafe,
    bestMonth: initialMonth,
    sortBy: 'name-asc',
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state if URL changes
  useEffect(() => {
    const cat = searchParams.get('category');
    const srch = searchParams.get('search');
    const diff = searchParams.get('difficulty');
    const mon = searchParams.get('month');
    const pet = searchParams.get('petSafeOnly');

    setFilters((prev) => ({
      ...prev,
      category: cat || prev.category,
      searchQuery: srch !== null ? srch : prev.searchQuery,
      difficulty: diff || prev.difficulty,
      bestMonth: mon ? parseInt(mon, 10) : prev.bestMonth,
      petSafeOnly: pet === 'true' ? true : prev.petSafeOnly,
    }));
  }, [searchParams]);

  // Compute filtered plants
  const filteredPlants = useMemo(() => {
    return filterPlants(allPlants, filters);
  }, [allPlants, filters]);

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'All',
      difficulty: 'All',
      lightLevel: 'All',
      waterNeed: 'All',
      soilType: 'All',
      location: 'All',
      petSafeOnly: false,
      bestMonth: 0,
      sortBy: 'name-asc',
    });
    router.replace('/plants');
  };

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.category !== 'All' ||
    filters.difficulty !== 'All' ||
    filters.lightLevel !== 'All' ||
    filters.waterNeed !== 'All' ||
    filters.location !== 'All' ||
    filters.petSafeOnly ||
    (filters.bestMonth !== undefined && filters.bestMonth > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-forest-950 dark:text-cream-50">
              Plant Library
            </h1>
            <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base mt-2 max-w-2xl">
              Browse our comprehensive database of 40+ indoor and outdoor botanical profiles with verified watering, light, and seasonal cultivation data.
            </p>
          </div>

          {/* Quick Counter */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-forest-100 dark:bg-forest-900 text-forest-800 dark:text-sprout-300 border border-forest-900/10 dark:border-forest-800">
              Showing {filteredPlants.length} of {allPlants.length} plants
            </span>
          </div>
        </div>
      </div>

      {/* SEARCH AND MOBILE FILTER TRIGGER BAR */}
      <div className="flex flex-col sm:flex-row gap-3 items-center mb-8">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-600 dark:text-stone-300 pointer-events-none" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
            placeholder="Search by common name, scientific name, or family..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white dark:bg-forest-900/60 border border-forest-900/15 dark:border-forest-700/60 shadow-sm focus:outline-none focus:border-forest-600 dark:focus:border-sprout-400 text-forest-950 dark:text-cream-100 text-sm"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters({ ...filters, searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-900 dark:hover:text-white p-1"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-48">
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
              className="w-full appearance-none pl-9 pr-8 py-3 rounded-2xl bg-white dark:bg-forest-900/60 border border-forest-900/15 dark:border-forest-700/60 shadow-sm focus:outline-none focus:border-forest-600 dark:focus:border-sprout-400 text-forest-950 dark:text-cream-100 text-xs sm:text-sm font-medium"
            >
              <option value="name-asc">Sort: A-Z (Alphabetical)</option>
              <option value="name-desc">Sort: Z-A (Reverse)</option>
              <option value="difficulty-asc">Difficulty: Easiest First</option>
              <option value="growth-asc">Growth: Fastest First</option>
            </select>
            <ArrowUpDown className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-600 dark:text-stone-300 pointer-events-none" />
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-forest-800 text-white font-medium text-sm shadow-sm shrink-0"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-sprout-400" />
            )}
          </button>
        </div>
      </div>

      {/* ACTIVE FILTER PILLS */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-stone-600 dark:text-stone-300 font-medium">Active filters:</span>
          {filters.category !== 'All' && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-sprout-300">
              Category: {filters.category}
              <button onClick={() => setFilters({ ...filters, category: 'All' })}><X className="w-3 h-3" /></button>
            </span>
          )}
          {filters.difficulty !== 'All' && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-sprout-300">
              Difficulty: {filters.difficulty}
              <button onClick={() => setFilters({ ...filters, difficulty: 'All' })}><X className="w-3 h-3" /></button>
            </span>
          )}
          {filters.lightLevel !== 'All' && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-sprout-300">
              Light: Level {filters.lightLevel}
              <button onClick={() => setFilters({ ...filters, lightLevel: 'All' })}><X className="w-3 h-3" /></button>
            </span>
          )}
          {filters.waterNeed !== 'All' && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-sprout-300">
              Water: {filters.waterNeed}
              <button onClick={() => setFilters({ ...filters, waterNeed: 'All' })}><X className="w-3 h-3" /></button>
            </span>
          )}
          {filters.location !== 'All' && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-sprout-300">
              Location: {filters.location}
              <button onClick={() => setFilters({ ...filters, location: 'All' })}><X className="w-3 h-3" /></button>
            </span>
          )}
          {filters.bestMonth !== undefined && filters.bestMonth > 0 && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-sprout-300">
              Month: {MONTH_NAMES[filters.bestMonth - 1]}
              <button onClick={() => setFilters({ ...filters, bestMonth: 0 })}><X className="w-3 h-3" /></button>
            </span>
          )}
          {filters.petSafeOnly && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Pet-Safe Only
              <button onClick={() => setFilters({ ...filters, petSafeOnly: false })}><X className="w-3 h-3" /></button>
            </span>
          )}
          <button
            onClick={resetFilters}
            className="text-xs text-earth-600 dark:text-earth-400 hover:underline flex items-center gap-1 ml-2 font-medium"
          >
            <RotateCcw className="w-3 h-3" /> Clear All
          </button>
        </div>
      )}

      {/* MAIN LAYOUT: SIDEBAR + GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* DESKTOP FILTERS SIDEBAR */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-forest-900/40 border border-forest-900/10 dark:border-forest-800/60 shadow-soft sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-forest-900/10 dark:border-forest-800/60 mb-6">
              <div className="flex items-center gap-2 font-serif text-lg font-bold text-forest-950 dark:text-cream-50">
                <SlidersHorizontal className="w-4 h-4 text-sprout-600 dark:text-sprout-400" />
                <span>Filters</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs font-semibold text-earth-600 dark:text-earth-400 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-2 mb-6">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 block">
                Category
              </label>
              <div className="space-y-1">
                {['All', 'Indoor', 'Outdoor', 'Flowers', 'Vegetables', 'Herbs', 'Succulents', 'Fruit Trees'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilters({ ...filters, category: cat })}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                      filters.category === cat
                        ? 'bg-forest-800 text-white dark:bg-sprout-500 dark:text-forest-950 font-bold'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-forest-50 dark:hover:bg-forest-800/50'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-[10px] opacity-70">
                      {cat === 'All'
                        ? allPlants.length
                        : allPlants.filter((p) => p.category === cat).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="space-y-2 mb-6">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 block">
                Difficulty Level
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {['All', 'Easy', 'Moderate', 'Challenging'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setFilters({ ...filters, difficulty: diff })}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors text-center ${
                      filters.difficulty === diff
                        ? 'bg-forest-800 text-white dark:bg-sprout-500 dark:text-forest-950 font-bold'
                        : 'bg-stone-100 dark:bg-forest-800/40 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-forest-800'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Light Level Filter */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light Level</span>
              </div>
              <select
                value={filters.lightLevel}
                onChange={(e) => setFilters({ ...filters, lightLevel: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-forest-800/50 border border-forest-900/10 dark:border-forest-700 text-xs font-medium text-forest-950 dark:text-cream-100 focus:outline-none focus:ring-1 focus:ring-sprout-400"
              >
                <option value="All">All Light Conditions</option>
                <option value="1">Low Light / Filtered (1)</option>
                <option value="2">Medium / Partial Sun (2)</option>
                <option value="3">Bright Indirect Light (3)</option>
                <option value="4">Full Direct Sun (4)</option>
              </select>
            </div>

            {/* Water Need Filter */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">
                <Droplets className="w-3.5 h-3.5 text-sky-500" />
                <span>Watering Need</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {['All', 'Low', 'Moderate', 'High'].map((w) => (
                  <button
                    key={w}
                    onClick={() => setFilters({ ...filters, waterNeed: w })}
                    className={`px-2 py-1.5 rounded-xl text-xs font-medium transition-colors text-center ${
                      filters.waterNeed === w
                        ? 'bg-forest-800 text-white dark:bg-sprout-500 dark:text-forest-950 font-bold'
                        : 'bg-stone-100 dark:bg-forest-800/40 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Planting Season (Month) Filter */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">
                <Calendar className="w-3.5 h-3.5 text-sprout-600" />
                <span>Best Planting Month</span>
              </div>
              <select
                value={filters.bestMonth || 0}
                onChange={(e) => setFilters({ ...filters, bestMonth: parseInt(e.target.value, 10) })}
                className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-forest-800/50 border border-forest-900/10 dark:border-forest-700 text-xs font-medium text-forest-950 dark:text-cream-100 focus:outline-none"
              >
                <option value="0">Any Month</option>
                {MONTH_NAMES.map((name, idx) => (
                  <option key={name} value={idx + 1}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">
                <Layers className="w-3.5 h-3.5 text-earth-500" />
                <span>Indoor vs Outdoor</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {['All', 'Indoor', 'Outdoor'].map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setFilters({ ...filters, location: loc })}
                    className={`px-2 py-1.5 rounded-xl text-xs font-medium transition-colors text-center ${
                      filters.location === loc
                        ? 'bg-forest-800 text-white dark:bg-sprout-500 dark:text-forest-950 font-bold'
                        : 'bg-stone-100 dark:bg-forest-800/40 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Pet Safe Checkbox */}
            <div className="pt-2 border-t border-forest-900/10 dark:border-forest-800/60">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.petSafeOnly}
                  onChange={(e) => setFilters({ ...filters, petSafeOnly: e.target.checked })}
                  className="w-4 h-4 rounded text-forest-800 focus:ring-sprout-500 border-stone-300"
                />
                <div className="flex items-center gap-1.5 text-xs font-semibold text-forest-950 dark:text-cream-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Pet-Safe Plants Only</span>
                </div>
              </label>
            </div>
          </div>
        </aside>

        {/* PLANTS CARD GRID */}
        <section className="lg:col-span-3">
          {filteredPlants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPlants.map((plant) => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No plants match your filters"
              message="Try broadening your criteria, clearing some filters, or checking your spelling to explore our botanical collection."
              onReset={resetFilters}
            />
          )}
        </section>
      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in">
          <div className="w-full max-w-xs sm:max-w-sm h-full bg-cream-50 dark:bg-forest-950 p-6 overflow-y-auto space-y-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-forest-900/10 dark:border-forest-800">
                <h3 className="font-serif text-lg font-bold text-forest-950 dark:text-cream-100">
                  Filter Plants
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-stone-500 hover:text-forest-950 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Filter Controls */}
              <div className="space-y-6 pt-4">
                {/* Category */}
                <div>
                  <label className="text-xs font-bold uppercase text-stone-600 dark:text-stone-300 block mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-forest-900 border text-xs"
                  >
                    {['All', 'Indoor', 'Outdoor', 'Flowers', 'Vegetables', 'Herbs', 'Succulents', 'Fruit Trees'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="text-xs font-bold uppercase text-stone-600 dark:text-stone-300 block mb-2">Difficulty</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {['All', 'Easy', 'Moderate', 'Challenging'].map((d) => (
                      <button
                        key={d}
                        onClick={() => setFilters({ ...filters, difficulty: d })}
                        className={`p-2 text-xs rounded-xl font-medium ${
                          filters.difficulty === d
                            ? 'bg-forest-800 text-white dark:bg-sprout-500 dark:text-forest-950 font-bold'
                            : 'bg-stone-100 dark:bg-forest-900 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Light */}
                <div>
                  <label className="text-xs font-bold uppercase text-stone-600 dark:text-stone-300 block mb-2">Light Level</label>
                  <select
                    value={filters.lightLevel}
                    onChange={(e) => setFilters({ ...filters, lightLevel: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-forest-900 border text-xs"
                  >
                    <option value="All">All Light Levels</option>
                    <option value="1">Low Light (1)</option>
                    <option value="2">Medium Light (2)</option>
                    <option value="3">Bright Indirect (3)</option>
                    <option value="4">Full Sun (4)</option>
                  </select>
                </div>

                {/* Pet Safe */}
                <div className="pt-2 border-t border-forest-900/10 dark:border-forest-800">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.petSafeOnly}
                      onChange={(e) => setFilters({ ...filters, petSafeOnly: e.target.checked })}
                      className="w-4 h-4 rounded text-forest-800"
                    />
                    <span className="text-xs font-semibold">Pet-Safe Only</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-forest-900/10 dark:border-forest-800 flex gap-2">
              <button
                onClick={resetFilters}
                className="w-1/2 py-2.5 rounded-xl border border-forest-900/20 text-xs font-bold text-stone-700 dark:text-stone-300"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-1/2 py-2.5 rounded-xl bg-forest-800 text-white text-xs font-bold shadow-soft"
              >
                Apply ({filteredPlants.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlantLibraryPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center">Loading botanical library...</div>}>
      <PlantLibraryContent />
    </Suspense>
  );
}
