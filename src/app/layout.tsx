import type { Metadata } from 'next';
import { Inter, Merriweather } from 'next/font/google';
import './globals.css';
import { FavoritesProvider } from '../context/FavoritesContext';
import { ThemeProvider } from '../context/ThemeContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Toast } from '../components/Toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-merriweather',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'GreenWiki - Modern Plant Care Encyclopedia',
    template: '%s | GreenWiki',
  },
  description:
    'A beautiful, searchable encyclopedia for plant lovers and home gardeners. Learn optimal watering rhythms, sunlight needs, soil formulas, and seasonal planting calendars.',
  keywords: [
    'plant care',
    'gardening guide',
    'plant encyclopedia',
    'houseplants',
    'watering guide',
    'planting calendar',
    'home garden',
    'Pakistan climate plants',
  ],
  authors: [{ name: 'GreenWiki Botanical Team' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-cream-50 text-forest-950 dark:bg-forest-950 dark:text-cream-100 transition-colors duration-200">
        <ThemeProvider>
          <FavoritesProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 bg-forest-800 text-white px-4 py-2 rounded-lg"
            >
              Skip to main content
            </a>
            <Navbar />
            <main id="main-content" className="flex-grow">
              {children}
            </main>
            <Footer />
            <Toast />
          </FavoritesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
