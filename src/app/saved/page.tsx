'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Heart, Trash2, Printer, Compass, BookOpen, ArrowRight, Sprout } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import { getAllPlants } from '../../lib/plants';
import { PlantCard } from '../../components/PlantCard';
import { EmptyState } from '../../components/EmptyState';

export default function SavedPlantsPage() {
  const { favorites, clearFavorites } = useFavorites();
  const allPlants = useMemo(() => getAllPlants(), []);

  const savedPlants = useMemo(() => {
    return allPlants.filter((p) => favorites.includes(p.id));
  }, [allPlants, favorites]);

  const handlePrintList = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-forest-900/10 dark:border-forest-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            My Garden Collection
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-forest-950 dark:text-cream-50">
            Saved Plants
          </h1>
          <p className="text-stone-600 dark:text-stone-300 text-sm mt-1">
            Your personal digital garden collection, saved locally in your browser.
          </p>
        </div>

        {savedPlants.length > 0 && (
          <div className="flex items-center gap-2 no-print">
            <button
              onClick={handlePrintList}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-forest-900 border border-forest-900/10 dark:border-forest-700 text-xs sm:text-sm font-semibold text-stone-700 dark:text-cream-200 hover:bg-forest-50 dark:hover:bg-forest-800 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Collection</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to remove all saved plants from your garden?')) {
                  clearFavorites();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 text-xs sm:text-sm font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Garden</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid or Empty State */}
      {savedPlants.length > 0 ? (
        <div className="space-y-6">
          <div className="text-xs font-semibold text-stone-600 dark:text-stone-300">
            You have <strong className="text-forest-950 dark:text-cream-100">{savedPlants.length}</strong> {savedPlants.length === 1 ? 'plant' : 'plants'} saved in your garden
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedPlants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        </div>
      ) : (
        <div className="py-16 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-forest-100 dark:bg-forest-900 flex items-center justify-center text-forest-700 dark:text-sprout-400 mx-auto shadow-soft">
            <Heart className="w-8 h-8 opacity-60" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-forest-950 dark:text-cream-50">
            Your Garden is Empty
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
            Click the heart icon on any plant card or care page to save it here for quick offline access, watering reminders, and printable reference sheets.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              href="/plants"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-sm font-semibold shadow-soft"
            >
              <BookOpen className="w-4 h-4" /> Browse Library
            </Link>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sprout-100 dark:bg-forest-900 border border-forest-900/10 text-forest-900 dark:text-cream-100 hover:bg-forest-200 text-sm font-semibold"
            >
              <Compass className="w-4 h-4" /> Take Plant Quiz
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
