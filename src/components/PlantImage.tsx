'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sprout, Flower2, Apple, Carrot, Sun } from 'lucide-react';
import { PlantCategory } from '../types/plant';

interface PlantImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  category?: PlantCategory | string;
  commonName?: string;
}

export function PlantImage({
  src,
  alt,
  fill = true,
  width,
  height,
  className = '',
  sizes,
  priority = false,
  category = 'Indoor',
  commonName,
}: PlantImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Category based background styling for the fallback illustration
  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'Flowers':
        return {
          bg: 'from-rose-950 via-rose-900 to-forest-950',
          accent: 'text-rose-300',
          icon: Flower2,
          emoji: '🌸',
        };
      case 'Vegetables':
        return {
          bg: 'from-amber-950 via-amber-900 to-forest-950',
          accent: 'text-amber-300',
          icon: Carrot,
          emoji: '🍅',
        };
      case 'Fruit Trees':
        return {
          bg: 'from-amber-950 via-forest-900 to-forest-950',
          accent: 'text-amber-400',
          icon: Apple,
          emoji: '🍋',
        };
      case 'Succulents':
        return {
          bg: 'from-teal-950 via-emerald-900 to-forest-950',
          accent: 'text-teal-300',
          icon: Sun,
          emoji: '🌵',
        };
      case 'Herbs':
        return {
          bg: 'from-emerald-950 via-sprout-900 to-forest-950',
          accent: 'text-sprout-300',
          icon: Sprout,
          emoji: '🌿',
        };
      default:
        return {
          bg: 'from-forest-950 via-forest-900 to-forest-950',
          accent: 'text-sprout-400',
          icon: Sprout,
          emoji: '🪴',
        };
    }
  };

  const theme = getCategoryTheme(category);
  const FallbackIcon = theme.icon;

  if (hasError || !src) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br ${theme.bg} text-white relative overflow-hidden select-none ${className}`}
      >
        {/* Subtle decorative background circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/5 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center shadow-soft">
            <span className="text-3xl">{theme.emoji}</span>
          </div>

          <div className="space-y-1 max-w-[200px]">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.accent}`}>
              {category}
            </span>
            <h4 className="font-serif text-sm font-bold text-white leading-tight line-clamp-2">
              {commonName || alt}
            </h4>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-white/60">
            <FallbackIcon className="w-3.5 h-3.5" />
            <span>Botanical Profile</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Skeleton loader underneath while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-stone-200 dark:bg-forest-900/60 animate-pulse flex items-center justify-center">
          <Sprout className="w-8 h-8 text-stone-400 dark:text-forest-700 opacity-40 animate-pulse" />
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
        priority={priority}
        unoptimized
        className={`object-cover object-center transition-opacity duration-500 ease-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
