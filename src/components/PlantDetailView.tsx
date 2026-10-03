'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PlantImage } from './PlantImage';
import {
  Heart,
  Share2,
  Printer,
  Sun,
  Droplets,
  Calendar,
  Layers,
  Thermometer,
  ShieldCheck,
  AlertTriangle,
  Scissors,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Wind,
  Compass,
  Sprout
} from 'lucide-react';
import { Plant } from '../types/plant';
import { useFavorites } from '../context/FavoritesContext';
import { SunMeter } from './SunMeter';
import { SeasonCalendarBar } from './SeasonCalendarBar';
import { PlantCard } from './PlantCard';
import { getLightScore, getLightLabel } from '../lib/plants';

interface PlantDetailViewProps {
  plant: Plant;
  relatedPlants: Plant[];
}

export function PlantDetailView({ plant, relatedPlants }: PlantDetailViewProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(plant.id);
  const [selectedImage, setSelectedImage] = useState<string>(plant.imageUrl);

  // Collect image gallery (main + any alternates, deduplicated)
  const gallery = Array.from(new Set([plant.imageUrl, ...(plant.gallery || [])].filter(Boolean)));

  const lightScore = getLightScore(plant);
  const lightLabel = getLightLabel(lightScore);

  const handleShare = async () => {
    if (typeof window !== 'undefined') {
      const shareData = {
        title: `${plant.commonName} Care Guide - GreenWiki`,
        text: `Check out complete growing instructions, watering guide, and planting season for ${plant.commonName} on GreenWiki!`,
        url: window.location.href,
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          // User cancelled or share failed, fallback to copy
        }
      } else {
        await navigator.clipboard.writeText(window.location.href);
        window.dispatchEvent(
          new CustomEvent('greenwiki-toast', {
            detail: { message: 'Link copied to clipboard!', type: 'success' },
          })
        );
      }
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 print:p-0">
      {/* Breadcrumb & Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 no-print">
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-stone-600 dark:text-stone-300">
          <Link href="/" className="hover:text-forest-900 dark:hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/plants" className="hover:text-forest-900 dark:hover:text-white transition-colors">
            Plant Library
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-forest-950 dark:text-cream-100 truncate max-w-[200px]">
            {plant.commonName}
          </span>
        </nav>

        {/* Action Buttons: Favorite, Share, Print */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavorite(plant.id, plant.commonName)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border shadow-sm ${
              favorited
                ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300'
                : 'bg-white dark:bg-forest-900/60 border-forest-900/10 dark:border-forest-700/60 text-stone-700 dark:text-cream-200 hover:bg-forest-50 dark:hover:bg-forest-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{favorited ? 'Saved in Garden' : 'Save Plant'}</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2 sm:px-3.5 sm:py-2 rounded-xl border border-forest-900/10 dark:border-forest-700/60 bg-white dark:bg-forest-900/60 text-stone-700 dark:text-cream-200 hover:bg-forest-50 dark:hover:bg-forest-800 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
            title="Share this plant care sheet"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-2 sm:px-3.5 sm:py-2 rounded-xl border border-forest-900/10 dark:border-forest-700/60 bg-white dark:bg-forest-900/60 text-stone-700 dark:text-cream-200 hover:bg-forest-50 dark:hover:bg-forest-800 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
            title="Print one-page care guide"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print Care Sheet</span>
          </button>
        </div>
      </div>

      {/* PRINT-ONLY HEADER */}
      <div className="hidden print:block mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold font-serif">{plant.commonName}</h1>
        <p className="italic text-sm text-stone-600">{plant.scientificName} • Family: {plant.family || 'N/A'}</p>
        <p className="text-xs text-stone-500 mt-1">Printed from GreenWiki Plant Care Encyclopedia (https://greenwiki.garden)</p>
      </div>

      {/* HERO / OVERVIEW SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left: Image & Gallery (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-3xl overflow-hidden shadow-elevated border border-forest-900/10 dark:border-forest-800 bg-stone-100 dark:bg-forest-900">
            <PlantImage
              src={selectedImage}
              alt={plant.commonName}
              category={plant.category}
              commonName={plant.commonName}
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            {/* Overlay badge */}
            <div className="absolute top-4 left-4 flex gap-2 pointer-events-none">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-forest-950/80 text-white backdrop-blur-md border border-white/20">
                {plant.category}
              </span>
            </div>
          </div>

          {/* Thumbnails if multiple images */}
          {gallery.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 no-print">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-forest-700 dark:border-sprout-400 scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <PlantImage
                    src={img}
                    alt={`${plant.commonName} photo ${i + 1}`}
                    category={plant.category}
                    commonName={plant.commonName}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Overview & Quick Facts (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-sprout-300">
                {plant.family ? `Family: ${plant.family}` : plant.category}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                plant.difficulty === 'Easy'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : plant.difficulty === 'Moderate'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}>
                {plant.difficulty} Care
              </span>
              {plant.lifespan && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-stone-100 dark:bg-forest-900 text-stone-700 dark:text-stone-300">
                  {plant.lifespan}
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-forest-950 dark:text-cream-50 leading-tight">
              {plant.commonName}
            </h1>
            <p className="font-serif italic text-base sm:text-lg text-stone-600 dark:text-stone-300">
              {plant.scientificName}
            </p>

            <p className="text-stone-700 dark:text-stone-300 text-base leading-relaxed pt-2">
              {plant.description}
            </p>
          </div>

          {/* QUICK FACTS CARD */}
          <div className="p-6 rounded-3xl bg-white dark:bg-forest-900/40 border border-forest-900/10 dark:border-forest-800/60 shadow-soft">
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-forest-900 dark:text-cream-100 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sprout-500" />
              Quick Botanical Facts
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-stone-600 dark:text-stone-300 font-semibold block">
                  Difficulty
                </span>
                <span className="text-sm font-bold text-forest-950 dark:text-cream-50">
                  {plant.difficulty}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-stone-600 dark:text-stone-300 font-semibold block">
                  Growth Speed
                </span>
                <span className="text-sm font-bold text-forest-950 dark:text-cream-50">
                  {plant.growthSpeed}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-stone-600 dark:text-stone-300 font-semibold block">
                  Pet Toxicity
                </span>
                <div className="inline-flex items-center gap-1 text-sm font-bold">
                  {plant.petSafe ? (
                    <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> Non-Toxic
                    </span>
                  ) : (
                    <span className="text-rose-700 dark:text-rose-400 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" /> Toxic
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-stone-600 dark:text-stone-300 font-semibold block">
                  Location
                </span>
                <span className="text-sm font-bold text-forest-950 dark:text-cream-50 truncate block">
                  {plant.environment.location}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE CARE DETAIL GRID */}
      <div className="space-y-8">
        {/* 1. BEST GROWING SEASON & 12-MONTH CALENDAR */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-forest-900/40 border border-forest-900/10 dark:border-forest-800/60 shadow-soft">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-sprout-100 dark:bg-sprout-950/80 text-sprout-700 dark:text-sprout-300 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest-950 dark:text-cream-50">
                Best Growing Season
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                Ideal months to sow seeds, propagate, or plant outdoors.
              </p>
            </div>
          </div>

          {/* 12-Month Calendar Bar */}
          <SeasonCalendarBar
            bestMonths={plant.season.bestMonths}
            bloomOrHarvest={plant.season.bloomOrHarvest}
            notes={plant.season.notes}
          />
        </section>

        {/* 2-COLUMN SECTION: WATERING GUIDE & LIGHT REQUIREMENTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* WATERING GUIDE */}
          <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-forest-900/40 border border-forest-900/10 dark:border-forest-800/60 shadow-soft flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 flex items-center justify-center">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-forest-950 dark:text-cream-50">
                    Watering Guide
                  </h2>
                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    Seasonal watering rhythms & testing moisture.
                  </p>
                </div>
              </div>

              {/* Summer vs Winter Cards */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 block mb-1">
                    Summer / Active
                  </span>
                  <p className="text-sm font-bold text-forest-950 dark:text-cream-100">
                    {plant.watering.summer}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-900/40">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 dark:text-sky-400 block mb-1">
                    Winter / Dormant
                  </span>
                  <p className="text-sm font-bold text-forest-950 dark:text-cream-100">
                    {plant.watering.winter}
                  </p>
                </div>
              </div>

              {/* Method */}
              <div className="mb-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                <strong className="text-forest-950 dark:text-cream-100">Recommended Method: </strong>
                {plant.watering.method}
              </div>
            </div>

            {/* Overwater vs Underwater Warnings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-forest-900/10 dark:border-forest-800/60 text-xs">
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/50 dark:border-rose-900/50">
                <div className="flex items-center gap-1.5 font-bold text-rose-800 dark:text-rose-400 mb-1">
                  <XCircle className="w-3.5 h-3.5" /> Signs of Overwatering
                </div>
                <p className="text-stone-700 dark:text-stone-300 leading-snug">
                  {plant.watering.overwaterSigns}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/50">
                <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-400 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Signs of Underwatering
                </div>
                <p className="text-stone-700 dark:text-stone-300 leading-snug">
                  {plant.watering.underwaterSigns}
                </p>
              </div>
            </div>
          </section>

          {/* LIGHT REQUIREMENTS */}
          <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-forest-900/40 border border-forest-900/10 dark:border-forest-800/60 shadow-soft flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-forest-950 dark:text-cream-50">
                    Light Requirements
                  </h2>
                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    Optimal sunlight intensity & daily duration.
                  </p>
                </div>
              </div>

              {/* Sun Meter Component */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-forest-900/60 border border-forest-900/10 dark:border-forest-800/60 mb-6">
                <SunMeter score={lightScore} label={plant.light.type} />
              </div>

              {/* Specs */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-forest-900/10 dark:border-forest-800/40">
                  <span className="text-stone-600 dark:text-stone-300 font-medium">Daily Direct Sun:</span>
                  <span className="font-bold text-forest-950 dark:text-cream-100">{plant.light.hoursPerDay}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-forest-900/10 dark:border-forest-800/40">
                  <span className="text-stone-600 dark:text-stone-300 font-medium">Exposure Type:</span>
                  <span className="font-bold text-forest-950 dark:text-cream-100 text-right">{plant.light.type}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-forest-900/10 dark:border-forest-800/60 text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              <strong className="text-forest-950 dark:text-cream-100">Sunlight advice: </strong>
              {plant.light.notes}
            </div>
          </section>
        </div>

        {/* 2-COLUMN SECTION: SOIL NEEDS & IDEAL ENVIRONMENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* SOIL NEEDS */}
          <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-forest-900/40 border border-forest-900/10 dark:border-forest-800/60 shadow-soft">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-earth-100 dark:bg-earth-950/80 text-earth-700 dark:text-earth-300 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-forest-950 dark:text-cream-50">
                  Soil & Potting Mix
                </h2>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  Texture, pH balance, and homemade potting formula.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-forest-900/50 border border-forest-900/10 dark:border-forest-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-earth-700 dark:text-earth-400 block mb-1">
                  Soil Type & Drainage
                </span>
                <p className="font-semibold text-forest-950 dark:text-cream-100">{plant.soil.type}</p>
                <p className="text-stone-600 dark:text-stone-300 text-xs mt-0.5">{plant.soil.drainage}</p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-forest-900/50 border border-forest-900/10 dark:border-forest-800">
                <span className="text-stone-600 dark:text-stone-300 font-medium">Ideal Soil pH:</span>
                <span className="font-bold text-forest-950 dark:text-cream-100">{plant.soil.phRange}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-forest-50/60 dark:bg-forest-900/30 border border-forest-100 dark:border-forest-800 text-xs leading-relaxed">
                <strong className="text-forest-900 dark:text-sprout-300 block mb-1">
                  Recommended Potting Mix Recipe:
                </strong>
                <p className="text-stone-700 dark:text-stone-300">{plant.soil.mix}</p>
              </div>
            </div>
          </section>

          {/* IDEAL ENVIRONMENT */}
          <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-forest-900/40 border border-forest-900/10 dark:border-forest-800/60 shadow-soft">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <Thermometer className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-forest-950 dark:text-cream-50">
                  Ideal Environment
                </h2>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  Temperature tolerance, humidity, and climate zones.
                </p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between py-2 border-b border-forest-900/10 dark:border-forest-800/40">
                <span className="text-stone-600 dark:text-stone-300 font-medium">Temperature Range:</span>
                <span className="font-bold text-forest-950 dark:text-cream-100">{plant.environment.tempRange}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-forest-900/10 dark:border-forest-800/40">
                <span className="text-stone-600 dark:text-stone-300 font-medium">Humidity Level:</span>
                <span className="font-bold text-forest-950 dark:text-cream-100">{plant.environment.humidity}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-forest-900/10 dark:border-forest-800/40">
                <span className="text-stone-600 dark:text-stone-300 font-medium">Frost & Wind Tolerance:</span>
                <span className="font-bold text-forest-950 dark:text-cream-100 text-right">{plant.environment.frostTolerance}</span>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 block mb-1.5">
                  Adapted Climate Zones:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {plant.environment.climateZones.map((zone, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-forest-100/70 dark:bg-forest-800 text-forest-800 dark:text-sprout-300 border border-forest-900/10 dark:border-forest-700"
                    >
                      {zone}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* FERTILIZER AND MAINTENANCE CARE */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-forest-900/40 border border-forest-900/10 dark:border-forest-800/60 shadow-soft">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-sprout-100 dark:bg-sprout-950/80 text-sprout-700 dark:text-sprout-300 flex items-center justify-center">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-forest-950 dark:text-cream-50">
                Fertilizer, Pruning & Repotting
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                Ongoing nutrition, shaping tips, and root health maintenance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-stone-50 dark:bg-forest-900/50 border border-forest-900/10 dark:border-forest-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sprout-700 dark:text-sprout-400 block">
                Fertilization Feeding
              </span>
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                {plant.care.fertilizer}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 dark:bg-forest-900/50 border border-forest-900/10 dark:border-forest-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sprout-700 dark:text-sprout-400 block">
                Pruning & Deadheading
              </span>
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                {plant.care.pruning}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 dark:bg-forest-900/50 border border-forest-900/10 dark:border-forest-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sprout-700 dark:text-sprout-400 block">
                Repotting Schedule
              </span>
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                {plant.care.repotting}
              </p>
            </div>
          </div>
        </section>

        {/* COMMON PROBLEMS & TROUBLESHOOTING */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-forest-900/40 border border-forest-900/10 dark:border-forest-800/60 shadow-soft">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-forest-950 dark:text-cream-50">
                Common Problems & Solutions
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                Diagnose symptoms, uncover root causes, and apply actionable organic fixes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plant.problems.map((prob, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-stone-50 dark:bg-forest-900/40 border border-forest-900/10 dark:border-forest-800 space-y-3"
              >
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <h3 className="font-bold text-sm sm:text-base text-forest-950 dark:text-cream-100">
                    {prob.issue}
                  </h3>
                </div>

                <div className="pl-7 space-y-2 text-xs sm:text-sm">
                  <div>
                    <span className="font-semibold text-rose-800 dark:text-rose-400">Probable Cause: </span>
                    <span className="text-stone-600 dark:text-stone-300">{prob.cause}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-forest-100/60 dark:bg-forest-800/50 border border-forest-200 dark:border-forest-700">
                    <span className="font-semibold text-forest-900 dark:text-sprout-300 flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sprout-600 dark:text-sprout-400" />
                      How to Fix:
                    </span>
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                      {prob.fix}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RELATED PLANTS SECTION */}
        {relatedPlants.length > 0 && (
          <section className="pt-8 no-print">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-forest-950 dark:text-cream-50">
                  Related Plants You May Love
                </h2>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  Similar {plant.category.toLowerCase()} varieties with compatible care routines.
                </p>
              </div>
              <Link
                href={`/plants?category=${encodeURIComponent(plant.category)}`}
                className="text-xs font-semibold text-sprout-700 dark:text-sprout-400 hover:underline"
              >
                View all in {plant.category} →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedPlants.map((relPlant) => (
                <PlantCard key={relPlant.id} plant={relPlant} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
