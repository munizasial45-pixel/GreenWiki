import React from 'react';
import Link from 'next/link';
import { Sprout, BookOpen, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-5">
      <div className="w-16 h-16 rounded-3xl bg-forest-100 dark:bg-forest-900 flex items-center justify-center text-forest-700 dark:text-sprout-400 mx-auto shadow-soft">
        <Sprout className="w-8 h-8 opacity-70" />
      </div>
      <h1 className="font-serif text-3xl font-bold text-forest-950 dark:text-cream-50">
        Plant or Page Not Found
      </h1>
      <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
        We couldn&apos;t find the botanical profile you were looking for. It may have been relocated or hasn&apos;t been added to the encyclopedia yet.
      </p>
      <div className="flex items-center justify-center gap-3 pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-800 text-white text-xs sm:text-sm font-semibold shadow-soft hover:bg-forest-900 transition-colors"
        >
          <Home className="w-4 h-4" /> Go to Home
        </Link>
        <Link
          href="/plants"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-forest-900/15 bg-white dark:bg-forest-900 text-xs sm:text-sm font-semibold text-stone-700 dark:text-cream-200 hover:bg-forest-50 transition-colors"
        >
          <BookOpen className="w-4 h-4" /> Browse Library
        </Link>
      </div>
    </div>
  );
}
