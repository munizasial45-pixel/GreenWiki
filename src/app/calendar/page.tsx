'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  MapPin,
  Sparkles,
  CheckCircle2,
  Thermometer,
  Droplets,
  Sun,
  ArrowRight,
  Leaf
} from 'lucide-react';
import { getAllPlants, MONTH_NAMES, MONTH_SHORT_NAMES } from '../../lib/plants';
import { PlantCard } from '../../components/PlantCard';
import { PlantCategory } from '../../types/plant';

// Regional gardening advisories per month
interface MonthAdvisory {
  summary: string;
  tasks: string[];
  tempSummary: string;
}

const REGIONAL_ADVISORIES: Record<string, Record<number, MonthAdvisory>> = {
  'hot-arid': {
    1: {
      summary: 'Peak cool-season growth. Abundant harvests of salad greens and vibrant winter blooms.',
      tasks: ['Harvest spinach, coriander, and leafy greens continuously', 'Feed roses with organic bloom booster', 'Water in late morning on warm sunny days'],
      tempSummary: '10°C - 24°C (Cool nights, mild sunny days)',
    },
    2: {
      summary: 'Spring transitions. Ideal time for transplanting summer fruiting vegetables and citrus.',
      tasks: ['Sow seeds for tomatoes, chilies, and eggplants', 'Fertilize lemon, mango, and guava trees before flowering', 'Begin propagating jasmine (motia) and succulents'],
      tempSummary: '15°C - 28°C (Pleasantly warm)',
    },
    3: {
      summary: 'Rapid spring flush. Trees burst into flower and seedlings establish quickly before summer heat.',
      tasks: ['Direct sow sunflowers, okra, and basil', 'Mulch soil surface generously with compost or straw', 'Watch for aphids and spider mites on tender new shoots'],
      tempSummary: '20°C - 34°C (Warming rapidly)',
    },
    4: {
      summary: 'Pre-summer heat arrival. Transition to heat-loving crops and provide afternoon shade.',
      tasks: ['Erect 30% green shade nets over delicate herbs', 'Water early morning before 8:00 AM', 'Pinch mint and basil for bushy growth'],
      tempSummary: '24°C - 38°C (Hot & dry)',
    },
    5: {
      summary: 'Intense summer heat. Priority shifts to root hydration and shade protection.',
      tasks: ['Water deep containers daily; never let pots dry out', 'Avoid transplanting or heavy chemical fertilizing', 'Bougainvillea and cacti revel in the intense heat'],
      tempSummary: '30°C - 44°C (Extreme heat)',
    },
    6: {
      summary: 'Peak summer solstice. Maintain soil mulch and hydration routines.',
      tasks: ['Check soil moisture twice daily for small pots', 'Mist indoor plants to combat dry air conditioning', 'Harvest mangoes and summer squash'],
      tempSummary: '32°C - 45°C (Scorching sun)',
    },
    7: {
      summary: 'Monsoon humidity arrives. Ideal window for tree planting, air-layering, and cuttings.',
      tasks: ['Plant neem, guava, and tropical fruit saplings', 'Propagate money plant and snake plant in water', 'Inspect pots for drainage clogs after downpours'],
      tempSummary: '28°C - 38°C (Humid & cloudy)',
    },
    8: {
      summary: 'Late monsoon lushness. Warm humid weather promotes rapid root development.',
      tasks: ['Sow seeds for autumn tomatoes and chilies', 'Prune dead or diseased branches after rainy spells', 'Prepare soil beds with aged farmyard manure for winter'],
      tempSummary: '28°C - 36°C (Humid, active growth)',
    },
    9: {
      summary: 'Autumn sowing kickoff! The most crucial gardening month of the year for winter gardens.',
      tasks: ['Sow marigold (genda), petunia, and winter annual seeds', 'Direct seed spinach, coriander, carrots, and radishes', 'Divide and repot aloe vera pups and houseplants'],
      tempSummary: '26°C - 35°C (Warm days, cooler evenings)',
    },
    10: {
      summary: 'Peak winter garden setup. Ideal weather for planting roses and winter vegetable seedlings.',
      tasks: ['Hard-prune rose bushes and feed with bone meal', 'Transplant cauliflower, cabbage, and tomato seedlings', 'Reduce watering for desert cacti and succulents'],
      tempSummary: '20°C - 32°C (Pleasantly mild)',
    },
    11: {
      summary: 'Cooling autumn breeze. Seedlings develop strong root networks in the gentle sunshine.',
      tasks: ['Stake tall flowers and vegetable vines', 'Thin out coriander and spinach beds to prevent crowding', 'Protect sensitive tropical seedlings from late-month cold nights'],
      tempSummary: '15°C - 28°C (Crisp and comfortable)',
    },
    12: {
      summary: 'Winter blooming wonderland. Enjoy roses, marigolds, and fresh sweet herbs.',
      tasks: ['Water only when topsoil is completely dry', 'Keep indoor tropical plants away from cold drafty windows', 'Apply generous layer of leaf compost mulch'],
      tempSummary: '10°C - 24°C (Cool & sunny)',
    },
  },
  'mediterranean': {
    // Standard Mediterranean climate profile
    1: { summary: 'Cool wet winter. Protect tender succulents from prolonged freezes.', tasks: ['Prune dormant deciduous fruit trees', 'Plant bare-root roses', 'Ensure outdoor pots have clear drainage holes'], tempSummary: '8°C - 16°C (Mild & rainy)' },
    2: { summary: 'Late winter awakening. Start early spring seeds indoors.', tasks: ['Start tomato and pepper seeds indoors', 'Prune lavender and rosemary lightly', 'Apply organic compost to citrus trees'], tempSummary: '10°C - 18°C (Transitioning mild)' },
    3: { summary: 'Spring explosion! Perfect sowing weather for cool-season and warm-season crops.', tasks: ['Direct sow basil, mint, and spinach', 'Move overwintered pots into full sun', 'Watch for spring snail and slug activity'], tempSummary: '12°C - 20°C (Sunny & mild)' },
    4: { summary: 'Peak spring blooming. Warm soil allows vigorous vegetable transplanting.', tasks: ['Transplant tomatoes and peppers outdoors', 'Deadhead spent spring bulbs', 'Mulch soil to retain upcoming summer moisture'], tempSummary: '14°C - 23°C (Pleasant sunshine)' },
    5: { summary: 'Warm sunny days. Transition to summer watering schedules.', tasks: ['Deep soak fruit trees weekly', 'Harvest fresh herbs regularly to stimulate foliage', 'Stake climbing vines and indeterminates'], tempSummary: '16°C - 26°C (Warm & dry)' },
    6: { summary: 'Summer begins. Mediterranean heat sets in; prioritize drought-tolerant species.', tasks: ['Bougainvillea and succulents thrive in direct sun', 'Water early morning to prevent evaporation', 'Check drip irrigation systems'], tempSummary: '20°C - 30°C (Dry & sunny)' },
    7: { summary: 'Mid-summer dry heat. Harvest fruits, tomatoes, and aromatic herbs.', tasks: ['Harvest tomatoes and chilies at peak ripeness', 'Harvest lavender flower spikes for drying', 'Ensure shade for container roots'], tempSummary: '22°C - 34°C (Hot & arid)' },
    8: { summary: 'Late summer bounty. Keep watering consistent to prevent fruit cracking.', tasks: ['Collect seeds from mature heirloom flowers', 'Deep water citrus and olive trees', 'Clean up fallen fruit to prevent pests'], tempSummary: '22°C - 34°C (Hot & dry)' },
    9: { summary: 'Autumn transition. Second sowing season for leafy greens and cool crops.', tasks: ['Sow winter greens: spinach, chard, cilantro', 'Plant perennial herbs and shrubs', 'Reduce water as daylight hours diminish'], tempSummary: '18°C - 28°C (Warm & pleasant)' },
    10: { summary: 'Autumn rains return. Prime planting month for perennials, trees, and winter flowers.', tasks: ['Plant spring-flowering bulbs', 'Prune roses lightly for autumn flush', 'Divide overgrown perennial clumps'], tempSummary: '14°C - 22°C (Mild autumn)' },
    11: { summary: 'Cooling weather. Prepare plants for rainy winter season.', tasks: ['Clear fallen leaves into compost bins', 'Reduce indoor houseplant feeding completely', 'Plant cool season annuals'], tempSummary: '10°C - 18°C (Crisp & rainy)' },
    12: { summary: 'Winter resting phase. Garden enjoys restorative damp chill.', tasks: ['Protect frost-tender succulents', 'Plan next year’s planting layout', 'Water outdoor plants sparingly'], tempSummary: '8°C - 15°C (Cool & damp)' },
  },
  'temperate': {
    // Standard temperate 4-season climate profile
    1: { summary: 'Deep winter freeze. Focus on indoor houseplants and seed catalog planning.', tasks: ['Increase humidity for indoor houseplants', 'Plan spring garden layout', 'Order vegetable seeds'], tempSummary: '-5°C - 5°C (Freezing & dormant)' },
    2: { summary: 'Late winter. Start long-season seedlings indoors under grow lights.', tasks: ['Start tomato and chili seeds indoors', 'Prune dormant woody fruit trees', 'Inspect stored tubers and bulbs'], tempSummary: '-2°C - 8°C (Cold & thawing)' },
    3: { summary: 'Early spring awakening. Cold-tolerant greens can be started under cover.', tasks: ['Sow spinach and peas in cold frames', 'Prune ornamental grasses and hydrangeas', 'Repot rootbound indoor houseplants'], tempSummary: '2°C - 12°C (Chilly & damp)' },
    4: { summary: 'Mid-spring. Soil begins to warm; spring bulbs burst into radiant bloom.', tasks: ['Direct sow cool crops outdoors', 'Harden off indoor seedlings on warm days', 'Divide spring perennials'], tempSummary: '6°C - 16°C (Mild & rainy)' },
    5: { summary: 'Last frost passes! The grand outdoor planting season begins.', tasks: ['Transplant tomatoes, peppers, and basil outside', 'Direct sow sunflowers and marigolds', 'Place houseplants on covered patios'], tempSummary: '12°C - 22°C (Warm & vibrant)' },
    6: { summary: 'Early summer explosion. Rapid vegetative growth and early harvests.', tasks: ['Stake tall perennials and tomato vines', 'Mulch beds 2-3 inches deep to retain water', 'Harvest fresh mint and lettuce'], tempSummary: '16°C - 26°C (Sunny & warm)' },
    7: { summary: 'Peak summer garden. Abundant harvests and daily watering routines.', tasks: ['Water early in the morning at ground level', 'Harvest sweet basil, zucchini, and berries', 'Deadhead flowers to promote continuous waves'], tempSummary: '20°C - 30°C (Warm & humid)' },
    8: { summary: 'Late summer bounty. Peak tomato harvest and start of autumn sowings.', tasks: ['Sow autumn spinach and winter greens', 'Harvest tomatoes, peppers, and herbs for drying', 'Take cuttings of favorite annuals'], tempSummary: '18°C - 28°C (Warm & golden)' },
    9: { summary: 'Autumn arrival. Crisp nights and glorious foliage color changes.', tasks: ['Harvest remaining tomatoes before first frost', 'Bring tender houseplants back indoors', 'Plant spring bulbs (tulips, daffodils)'], tempSummary: '12°C - 20°C (Crisp & mild)' },
    10: { summary: 'First frost window. Put the outdoor garden to bed for winter.', tasks: ['Apply thick layer of mulch over perennials', 'Clean and oil garden tools', 'Empty and store ceramic pots before freezes'], tempSummary: '6°C - 14°C (Cool autumn)' },
    11: { summary: 'Late autumn dormancy. Garden enters restful sleep.', tasks: ['Compost remaining garden debris', 'Mulch garlic beds thoroughly', 'Enjoy indoor greenery with bright window spots'], tempSummary: '0°C - 8°C (Cold & frosty)' },
    12: { summary: 'Winter solstice. Indoor plants enjoy cozy winter light.', tasks: ['Reduce indoor houseplant watering by half', 'Check indoor plants for spider mites from dry heating', 'Enjoy amaryllis and peace lily blooms'], tempSummary: '-5°C - 4°C (Freezing dormancy)' },
  },
};

function PlantingCalendarContent() {
  const searchParams = useSearchParams();
  const allPlants = useMemo(() => getAllPlants(), []);

  // Default to current month or query param
  const currentMonthNum = new Date().getMonth() + 1; // 1-12
  const initialMonth = searchParams.get('month')
    ? parseInt(searchParams.get('month')!, 10)
    : currentMonthNum;

  const [selectedMonth, setSelectedMonth] = useState<number>(initialMonth);
  const [selectedRegion, setSelectedRegion] = useState<string>('hot-arid');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const regions = [
    { id: 'hot-arid', name: 'Hot Arid & Subtropical (Pakistan / Sindh / South Asia / Desert)', badge: 'Recommended for hot dry zones' },
    { id: 'mediterranean', name: 'Mediterranean (Mild winters, dry sunny summers)', badge: 'California & Southern Europe' },
    { id: 'temperate', name: 'Temperate / Four-Season (Continental zones with freezing winters)', badge: 'Northern US & Europe' },
  ];

  // Advisory for active month & region
  const advisory = useMemo(() => {
    const reg = REGIONAL_ADVISORIES[selectedRegion] || REGIONAL_ADVISORIES['hot-arid'];
    return reg[selectedMonth] || reg[1];
  }, [selectedRegion, selectedMonth]);

  // Plants suitable for this month
  const monthPlants = useMemo(() => {
    let list = allPlants.filter((p) => p.season.bestMonths.includes(selectedMonth));
    if (categoryFilter !== 'All') {
      list = list.filter((p) => p.category === categoryFilter);
    }
    return list;
  }, [allPlants, selectedMonth, categoryFilter]);

  const categories: PlantCategory[] = ['Indoor', 'Outdoor', 'Flowers', 'Vegetables', 'Herbs', 'Succulents', 'Fruit Trees'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-sprout-300 text-xs font-bold uppercase tracking-wider mb-3">
          <CalendarIcon className="w-3.5 h-3.5" />
          Interactive 12-Month Sowing & Harvest Guide
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-forest-950 dark:text-cream-50">
          Seasonal Planting Calendar
        </h1>
        <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base mt-2 max-w-2xl">
          Discover exactly what to sow, transplant, and harvest every month of the year, tuned to your specific regional climate.
        </p>
      </div>

      {/* REGION SELECTOR BANNER */}
      <div className="p-6 rounded-3xl bg-white dark:bg-forest-900/50 border border-forest-900/10 dark:border-forest-800/60 shadow-soft mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-earth-100 dark:bg-earth-950 text-earth-700 dark:text-earth-300 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-earth-700 dark:text-earth-400 block">
                Growing Climate & Region
              </span>
              <h3 className="font-serif text-base sm:text-lg font-bold text-forest-950 dark:text-cream-100">
                Select Your Garden&apos;s Climate Zone
              </h3>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full sm:w-96 p-3 rounded-2xl bg-stone-50 dark:bg-forest-800/60 border border-forest-900/15 dark:border-forest-700 text-xs sm:text-sm font-semibold text-forest-950 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-sprout-400"
            >
              {regions.map((reg) => (
                <option key={reg.id} value={reg.id}>
                  {reg.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 12-MONTH INTERACTIVE SELECTOR */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">
            Select a Month to View:
          </span>
          <span className="text-xs text-stone-600 dark:text-stone-300">
            Current month: <strong className="text-forest-800 dark:text-sprout-300">{MONTH_NAMES[currentMonthNum - 1]}</strong>
          </span>
        </div>

        {/* 12 Month Grid Buttons */}
        <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2">
          {MONTH_NAMES.map((name, idx) => {
            const monthNum = idx + 1;
            const isSelected = selectedMonth === monthNum;
            const isCurrent = currentMonthNum === monthNum;

            return (
              <button
                key={name}
                onClick={() => setSelectedMonth(monthNum)}
                className={`py-3 px-2 rounded-2xl flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-forest-800 dark:bg-sprout-500 text-white dark:text-forest-950 font-bold shadow-elevated scale-105'
                    : 'bg-white dark:bg-forest-900/40 text-stone-700 dark:text-cream-200 border border-forest-900/10 dark:border-forest-800 hover:bg-forest-50 dark:hover:bg-forest-800'
                } ${isCurrent && !isSelected ? 'ring-2 ring-amber-400 dark:ring-amber-500' : ''}`}
              >
                <span className="text-xs uppercase tracking-wider font-semibold">
                  {MONTH_SHORT_NAMES[idx]}
                </span>
                <span className="text-[10px] opacity-80 mt-0.5">
                  {isCurrent ? 'Now' : `M${monthNum}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MONTHLY REGIONAL ADVISORY & CHECKLIST */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-forest-900 via-forest-800 to-forest-900 text-white mb-10 shadow-elevated relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-sprout-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-forest-700/60 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sprout-400 block mb-1">
                Regional Garden Advisory
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold">
                {MONTH_NAMES[selectedMonth - 1]} Action Plan
              </h2>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-950/60 border border-forest-700/50 text-xs font-medium text-cream-200">
              <Thermometer className="w-4 h-4 text-amber-400" />
              <span>{advisory.tempSummary}</span>
            </div>
          </div>

          <p className="text-cream-100 text-base leading-relaxed">
            {advisory.summary}
          </p>

          {/* Action Tasks */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-sprout-300 mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              Top Garden Tasks for {MONTH_NAMES[selectedMonth - 1]}:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {advisory.tasks.map((task, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-forest-950/40 border border-forest-700/40 text-xs sm:text-sm text-cream-200 leading-snug"
                >
                  <CheckCircle2 className="w-4 h-4 text-sprout-400 shrink-0 mt-0.5" />
                  <span>{task}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PLANTS TO SOW / GROW THIS MONTH */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950 dark:text-cream-50">
              Plants to Sow or Cultivate in {MONTH_NAMES[selectedMonth - 1]}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1">
              Found {monthPlants.length} plants that enjoy this seasonal window.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setCategoryFilter('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                categoryFilter === 'All'
                  ? 'bg-forest-800 text-white dark:bg-sprout-500 dark:text-forest-950 shadow-sm'
                  : 'bg-white dark:bg-forest-900 border text-stone-700 dark:text-cream-200 hover:bg-stone-50'
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  categoryFilter === c
                    ? 'bg-forest-800 text-white dark:bg-sprout-500 dark:text-forest-950 shadow-sm'
                    : 'bg-white dark:bg-forest-900 border text-stone-700 dark:text-cream-200 hover:bg-stone-50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Plants Grid */}
        {monthPlants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {monthPlants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white dark:bg-forest-900/30 rounded-3xl border text-stone-500">
            No plants found under the {categoryFilter} category for {MONTH_NAMES[selectedMonth - 1]}. Try switching category filters or explore the full library.
          </div>
        )}
      </section>
    </div>
  );
}

export default function PlantingCalendarPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center">Loading planting calendar...</div>}>
      <PlantingCalendarContent />
    </Suspense>
  );
}
