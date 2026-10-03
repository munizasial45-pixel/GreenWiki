'use client';

import React from 'react';
import Link from 'next/link';
import { PlantImage } from './PlantImage';
import { Heart, Sun, Droplets, ShieldCheck, AlertCircle, ArrowUpRight } from 'lucide-react';
import { Plant } from '../types/plant';
import { useFavorites } from '../context/FavoritesContext';
import { getLightScore, getWaterNeedCategory } from '../lib/plants';

interface PlantCardProps {
  plant: Plant;
  featured?: boolean;
}

export function PlantCard({ plant, featured = false }: PlantCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(plant.id);
  const lightScore = getLightScore(plant);
  const waterNeed = getWaterNeedCategory(plant);

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60';
      case 'Moderate':
        return 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60';
      case 'Challenging':
        return 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/60';
      default:
        return 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-300';
    }
  };

  const getSunLabel = (score: number) => {
    if (score >= 4) return 'Full Sun';
    if (score === 3) return 'Bright Ind.';
    if (score === 2) return 'Part Sun';
    return 'Low Light';
  };

  return (
    <article className="group relative bg-white dark:bg-forest-900/50 rounded-2xl sm:rounded-3xl border border-forest-900/10 dark:border-forest-800/60 shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col overflow-hidden h-full">
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-forest-100/50 dark:bg-forest-950">
        <Link href={`/plants/${plant.id}`} className="block w-full h-full">
          <PlantImage
            src={plant.imageUrl}
            alt={plant.commonName}
            category={plant.category}
            commonName={plant.commonName}
            className="group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-md ${getDifficultyBadge(plant.difficulty)}`}>
              {plant.difficulty}
            </span>
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-forest-900/80 text-white border border-white/20 backdrop-blur-md shadow-sm">
              {plant.category}
            </span>
          </div>

          {/* Favorite Heart Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(plant.id, plant.commonName);
            }}
            className={`pointer-events-auto p-2 rounded-full backdrop-blur-md transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-sprout-400 ${
              favorited
                ? 'bg-rose-500 text-white hover:bg-rose-600 scale-105'
                : 'bg-black/30 text-white/90 hover:bg-black/50 hover:text-white hover:scale-110'
            }`}
            aria-label={favorited ? `Remove ${plant.commonName} from saved` : `Save ${plant.commonName}`}
            title={favorited ? 'Saved in My Garden' : 'Save to My Garden'}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-white stroke-white' : ''}`} />
          </button>
        </div>

        {/* Bottom Image Overlay Badges */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {plant.petSafe ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-200 border border-emerald-400/30 backdrop-blur-md">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Pet Safe
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-200 border border-rose-400/30 backdrop-blur-md">
              <AlertCircle className="w-3 h-3 text-rose-400" /> Toxic to pets
            </span>
          )}

          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-forest-950/80 text-cream-200 backdrop-blur-md border border-white/10">
            {plant.growthSpeed} Growth
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link href={`/plants/${plant.id}`} className="group-hover:text-forest-600 dark:group-hover:text-sprout-400 transition-colors">
              <h3 className="font-serif text-lg font-bold text-forest-950 dark:text-cream-100 leading-snug">
                {plant.commonName}
              </h3>
            </Link>
            <Link
              href={`/plants/${plant.id}`}
              className="opacity-0 group-hover:opacity-100 text-forest-700 dark:text-sprout-400 transition-opacity p-0.5"
              aria-hidden="true"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-xs italic text-stone-600 dark:text-stone-300 font-serif mt-0.5">
            {plant.scientificName}
          </p>
          <p className="text-xs text-stone-700 dark:text-stone-300 mt-2 line-clamp-2 leading-relaxed">
            {plant.description}
          </p>
        </div>

        {/* Quick Specs Row */}
        <div className="pt-3 border-t border-forest-900/10 dark:border-forest-800/50 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
            <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">{getSunLabel(lightScore)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
            <Droplets className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span className="truncate">{waterNeed} Water</span>
          </div>
        </div>
      </div>
    </article>
  );
}
