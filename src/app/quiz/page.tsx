'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Sun,
  Droplets,
  Layers,
  Heart,
  Home,
  Check
} from 'lucide-react';
import { calculateQuizMatches } from '../../lib/plants';
import { QuizAnswers, QuizResultMatch } from '../../types/plant';
import { PlantCard } from '../../components/PlantCard';

interface StepQuestion {
  id: keyof QuizAnswers;
  title: string;
  subtitle: string;
  icon: any;
  options: {
    label: string;
    description: string;
    value: string;
    icon: string;
  }[];
}

const QUESTIONS: StepQuestion[] = [
  {
    id: 'location',
    title: 'Where will your plant live?',
    subtitle: 'Every plant has an ideal micro-climate based on air flow and space.',
    icon: Home,
    options: [
      {
        label: 'Indoor Living Room / Bedroom / Office',
        description: 'Enclosed indoor environment with standard room temperatures.',
        value: 'indoor',
        icon: '🪴',
      },
      {
        label: 'Sunny Balcony or Covered Patio',
        description: 'Outdoor pots, railings, or container gardening with fresh air.',
        value: 'outdoor-balcony',
        icon: '🏡',
      },
      {
        label: 'Outdoor Garden Bed or Ground Soil',
        description: 'Direct in-ground soil with plenty of root space to expand.',
        value: 'outdoor-garden',
        icon: '🌳',
      },
    ],
  },
  {
    id: 'light',
    title: 'How much sunlight does the spot get?',
    subtitle: 'Light is food for plants! Be honest about how bright your spot really is.',
    icon: Sun,
    options: [
      {
        label: 'Full Direct Sun (6+ hours daily)',
        description: 'Bright, unhindered sunny window, terrace, or open garden.',
        value: 'full-sun',
        icon: '☀️',
      },
      {
        label: 'Moderate / Bright Indirect Light (3-5 hours)',
        description: 'Brightly lit room, sheer curtain window, or dappled shade.',
        value: 'medium',
        icon: '🌤️',
      },
      {
        label: 'Low Light / North-Facing Corner',
        description: 'Dim interior corner or room with small or shaded windows.',
        value: 'low',
        icon: '☁️',
      },
    ],
  },
  {
    id: 'wateringTime',
    title: 'What is your plant care style?',
    subtitle: 'Pick a routine that realistically matches your lifestyle and schedule.',
    icon: Droplets,
    options: [
      {
        label: 'Busy & Forgetful (Low Maintenance)',
        description: 'I travel often or forget to water for weeks at a time.',
        value: 'busy',
        icon: '⏳',
      },
      {
        label: 'Predictable Weekly Checker',
        description: 'I can inspect and water my plants once every weekend.',
        value: 'regular',
        icon: '📅',
      },
      {
        label: 'Daily Attentive Plant Parent',
        description: 'I love tending, watering, and monitoring my plants every day.',
        value: 'daily',
        icon: '💚',
      },
    ],
  },
  {
    id: 'petSafe',
    title: 'Do you have furry pets at home?',
    subtitle: 'Some botanicals contain calcium oxalate crystals toxic to curious cats and dogs.',
    icon: ShieldCheck,
    options: [
      {
        label: 'Yes, strictly 100% Pet-Safe Plants Only!',
        description: 'Completely non-toxic if a curious cat or pup chews a leaf.',
        value: 'must-be-safe',
        icon: '🐾',
      },
      {
        label: 'No pets (or plant placed well out of reach)',
        description: 'Show me any botanical variety regardless of toxicity.',
        value: 'any',
        icon: '🌿',
      },
    ],
  },
  {
    id: 'purpose',
    title: 'What is your primary gardening goal?',
    subtitle: 'What would bring you the greatest satisfaction from this plant?',
    icon: Sparkles,
    options: [
      {
        label: 'Edible Kitchen Harvests',
        description: 'Fresh aromatic herbs, juicy vegetables, or homegrown citrus.',
        value: 'edible',
        icon: '🥗',
      },
      {
        label: 'Magnificent Flowers & Fragrance',
        description: 'Colorful blooms, sweet perfumes, and butterfly attractors.',
        value: 'flowers',
        icon: '🌸',
      },
      {
        label: 'Air Purification & Green Decor',
        description: 'Striking sculptural foliage that cleans toxins and calms the room.',
        value: 'air-purifying',
        icon: '✨',
      },
      {
        label: 'Easiest Beginner Winner',
        description: 'Virtually indestructible green confidence booster.',
        value: 'easy',
        icon: '🏆',
      },
    ],
  },
];

export default function PlantFinderQuizPage() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [results, setResults] = useState<QuizResultMatch[] | null>(null);

  const currentQ = QUESTIONS[currentStep];

  const handleSelectOption = (value: string) => {
    const updated = {
      ...answers,
      [currentQ.id]: value,
    };
    setAnswers(updated);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Completed all questions
      const matches = calculateQuizMatches(updated);
      setResults(matches);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentStep(0);
    setResults(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      {!results ? (
        <div className="space-y-8 animate-fade-in">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-sprout-300 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-sprout-600 dark:text-sprout-400" />
              Plant Matchmaker
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-black text-forest-950 dark:text-cream-50">
              Find Your Perfect Botanical Match
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
              Answer 5 quick questions about your light, care time, and space. We will calculate tailored recommendations.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-600 dark:text-stone-300">
              <span>Question {currentStep + 1} of {QUESTIONS.length}</span>
              <span>{Math.round(((currentStep) / QUESTIONS.length) * 100)}% Completed</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-stone-200 dark:bg-forest-900 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sprout-500 to-forest-700 transition-all duration-300 rounded-full"
                style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-forest-900/40 border border-forest-900/10 dark:border-forest-800/60 shadow-elevated">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-sprout-100 dark:bg-sprout-950/80 text-sprout-700 dark:text-sprout-300 flex items-center justify-center shrink-0">
                <currentQ.icon className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest-950 dark:text-cream-50">
                {currentQ.title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mb-8 pl-13">
              {currentQ.subtitle}
            </p>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt) => {
                const isSelected = answers[currentQ.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelectOption(opt.value)}
                    className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-left transition-all flex items-start justify-between gap-4 group ${
                      isSelected
                        ? 'border-forest-800 dark:border-sprout-400 bg-forest-50/80 dark:bg-forest-800/60 shadow-md'
                        : 'border-forest-900/10 dark:border-forest-800/60 bg-white/60 dark:bg-forest-900/40 hover:border-forest-600/50 hover:bg-forest-50/50 dark:hover:bg-forest-800/30'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <span className="text-2xl sm:text-3xl shrink-0 pt-0.5">{opt.icon}</span>
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-forest-950 dark:text-cream-50 group-hover:text-forest-700 dark:group-hover:text-sprout-300 transition-colors">
                          {opt.label}
                        </h3>
                        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                          {opt.description}
                        </p>
                      </div>
                    </div>

                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-all ${
                      isSelected
                        ? 'border-forest-800 dark:border-sprout-400 bg-forest-800 dark:bg-sprout-400 text-white dark:text-forest-950'
                        : 'border-stone-300 dark:border-forest-700'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Previous Step Button */}
            {currentStep > 0 && (
              <div className="mt-8 pt-4 border-t border-forest-900/10 dark:border-forest-800 flex justify-start">
                <button
                  onClick={handlePrevStep}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-forest-900 dark:hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" /> Previous Question
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* RESULTS VIEW */
        <div className="space-y-10 animate-slide-up">
          {/* Top Banner */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Tailored Botanical Matches
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-forest-950 dark:text-cream-50">
              Here are your Top Plant Recommendations!
            </h1>
            <p className="text-sm text-stone-600 dark:text-stone-300">
              Based on your sunlight level, routine, space, and pet-safety needs, these botanicals have the highest probability of flourishing in your hands.
            </p>

            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 text-xs font-semibold text-earth-600 dark:text-earth-400 hover:underline pt-2"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz with Different Answers
            </button>
          </div>

          {/* Matches List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {results.map(({ plant, score, matchReasons }) => (
              <div key={plant.id} className="flex flex-col h-full space-y-3">
                {/* Match Score Badge & Reasons Callout */}
                <div className="p-4 rounded-2xl bg-forest-100/70 dark:bg-forest-900/70 border border-forest-900/10 dark:border-forest-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-forest-800 dark:text-sprout-300">
                      Compatibility
                    </span>
                    <span className="text-xs font-black px-2 py-0.5 rounded-full bg-forest-800 text-white dark:bg-sprout-500 dark:text-forest-950">
                      {score}% Match
                    </span>
                  </div>

                  <ul className="space-y-1">
                    {matchReasons.map((reason, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-forest-900 dark:text-cream-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sprout-600 dark:text-sprout-400 shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Plant Card */}
                <div className="flex-grow">
                  <PlantCard plant={plant} />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="p-8 rounded-3xl bg-forest-900 text-white text-center space-y-4 shadow-elevated">
            <h3 className="font-serif text-2xl font-bold">
              Ready to learn more about your garden?
            </h3>
            <p className="text-cream-200 text-sm max-w-lg mx-auto">
              Save your favorites to your personal garden collection or browse our full library of 40+ plants.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/plants"
                className="px-5 py-2.5 rounded-xl bg-sprout-400 hover:bg-sprout-300 text-forest-950 font-bold text-sm shadow-soft transition-all"
              >
                Browse Full Library
              </Link>
              <Link
                href="/calendar"
                className="px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-white font-semibold text-sm border border-forest-700 transition-all"
              >
                Check Planting Calendar
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
