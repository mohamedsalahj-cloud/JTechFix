'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { usePiAuth } from '@/contexts/pi-auth-context';
import { getListings } from '@/lib/listings-storage';
import type { Language } from '@/lib/translations';
import type { Listing } from '@/lib/listings-storage';

const PROMOTIONAL_BANNERS = [
  {
    id: 1,
    title: '🎮 Gaming Paradise',
    subtitle: 'Discover latest video games & consoles. Buy & sell with Pi coins - Zero fees!',
    gradient: 'from-indigo-600 via-purple-500 to-pink-500',
    cta: 'Browse Games',
  },
  {
    id: 2,
    title: '₿ Pi Network Powered',
    subtitle: 'Peer-to-peer marketplace secured by Pi blockchain technology. Direct transactions, no middleman.',
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    cta: 'Learn More',
  },
  {
    id: 3,
    title: '🕹️ Exclusive Game Deals',
    subtitle: 'AAA titles at unbeatable prices. Limited time offers on popular games',
    gradient: 'from-blue-600 via-cyan-500 to-teal-500',
    cta: 'Shop Games',
  },
  {
    id: 4,
    title: '🚀 Pi Community Rewards',
    subtitle: 'Earn Pi coins with every transaction. Join thousands of satisfied Pi users',
    gradient: 'from-green-500 via-emerald-500 to-teal-600',
    cta: 'Join Now',
  },
];

const CATEGORIES = [
  { id: 'cars', name: 'Cars', icon: '🚗' },
  { id: 'electronics', name: 'Electronics', icon: '💻' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' },
  { id: 'homes', name: 'Homes', icon: '🏠' },
  { id: 'fashion', name: 'Fashion', icon: '👔' },
  { id: 'furniture', name: 'Furniture', icon: '🪑' },
  { id: 'services', name: 'Services', icon: '🔧' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'books', name: 'Books', icon: '📚' },
];

const GAMING_SUBCATEGORIES = [
  { id: 'xbox', name: 'Xbox', icon: '📦' },
  { id: 'ps4', name: 'PS4', icon: '📦' },
  { id: 'ps5', name: 'PS5', icon: '📦' },
];



export default function BrowsePage() {
  const { language, setLanguage, t, dir } = useLanguage();
  const { sdk } = usePiAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedGamingSubcategory, setSelectedGamingSubcategory] = useState<string | null>(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Load listings from storage
  useEffect(() => {
    const loadListings = async () => {
      try {
        if (!sdk) {
          setListings([]);
          return;
        }
        const data = await getListings(sdk);
        setListings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('[v0] Error loading listings:', error);
        setListings([]);
      }
    };

    // Set initial state to not loading after a short delay to ensure UI renders
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    loadListings();

    return () => clearTimeout(timer);
  }, [sdk]);

  // Auto-rotate banners every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % PROMOTIONAL_BANNERS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredListings = listings.filter((item) => {
    // Filter by category if selected
    if (selectedCategory && item.category !== selectedCategory) {
      return false;
    }
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.location.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const goToBanner = (index: number) => {
    setCurrentBannerIndex(index);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" dir={dir}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
            <Link href="/" className="text-foreground hover:text-primary transition whitespace-nowrap flex-shrink-0">
              {dir === 'rtl' ? '→' : '←'} {t('form.cancel')}
            </Link>
            <h1 className="text-xl md:text-2xl font-bold truncate">{t('browse.title')}</h1>
          </div>
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <Link
              href="/dashboard"
              className="bg-secondary text-foreground px-3 md:px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition whitespace-nowrap text-sm md:text-base border border-border"
            >
              {t('browse.myDashboard')}
            </Link>
            <Link
              href="/create-listing"
              className="bg-primary text-primary-foreground px-3 md:px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition whitespace-nowrap text-sm md:text-base"
            >
              + {t('hero.create')}
            </Link>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="px-2 md:px-3 py-2 border border-border rounded-lg bg-background text-foreground text-xs md:text-sm font-medium"
            >
              <option value="en">EN</option>
              <option value="ar">AR</option>
              <option value="fr">FR</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advertisement Banner Slider */}
      <section className="bg-secondary/50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="relative rounded-2xl overflow-hidden shadow-lg">
            {/* Banner Background with Animation */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${PROMOTIONAL_BANNERS[currentBannerIndex].gradient} opacity-95 transition-all duration-700 ease-out`}
            />
            
            {/* Overlay Pattern */}
            <div className="absolute inset-0 bg-black/10" />

            {/* Banner Content */}
            <div className="relative min-h-64 md:min-h-72 flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-8 md:py-12 gap-8">
              <div className="flex-1 z-10">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">
                  {PROMOTIONAL_BANNERS[currentBannerIndex].title}
                </h2>
                <p className="text-base md:text-lg text-white/95 mb-8 max-w-lg leading-relaxed">
                  {PROMOTIONAL_BANNERS[currentBannerIndex].subtitle}
                </p>
                <button className="px-8 py-3 md:py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-50 transform hover:scale-105 transition-all shadow-lg">
                  {PROMOTIONAL_BANNERS[currentBannerIndex].cta}
                </button>
              </div>

              {/* Banner Navigation Arrows - Hidden on mobile, visible on md+ */}
              <div className="hidden md:flex gap-3 absolute right-6 top-1/2 -translate-y-1/2 z-20">
                <button
                  onClick={() =>
                    goToBanner(
                      currentBannerIndex === 0
                        ? PROMOTIONAL_BANNERS.length - 1
                        : currentBannerIndex - 1
                    )
                  }
                  className="p-3 bg-white/25 hover:bg-white/40 text-white rounded-full transition-all hover:scale-110"
                  aria-label="Previous banner"
                >
                  ❮
                </button>
                <button
                  onClick={() => goToBanner((currentBannerIndex + 1) % PROMOTIONAL_BANNERS.length)}
                  className="p-3 bg-white/25 hover:bg-white/40 text-white rounded-full transition-all hover:scale-110"
                  aria-label="Next banner"
                >
                  ❯
                </button>
              </div>
            </div>

            {/* Dot Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
              {PROMOTIONAL_BANNERS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToBanner(index)}
                  className={`rounded-full transition-all transform ${
                    index === currentBannerIndex
                      ? 'bg-white w-3 h-3 scale-125'
                      : 'bg-white/60 w-2.5 h-2.5 hover:bg-white/80 hover:scale-110'
                  }`}
                  aria-label={`Go to banner ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-secondary/50 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <input
            type="text"
            placeholder={t('browse.filterByCategory') || 'Search listings...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition flex-shrink-0 ${
                selectedCategory === null
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:bg-border'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition flex-shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground hover:bg-border'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gaming Subcategories */}
      {selectedCategory === 'gaming' && (
        <section className="bg-secondary/50 border-b border-border">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Gaming Platforms</h3>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
              <button
                onClick={() => setSelectedGamingSubcategory(null)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition flex-shrink-0 text-sm ${
                  selectedGamingSubcategory === null
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-foreground hover:bg-border'
                }`}
              >
                All Games
              </button>
              {GAMING_SUBCATEGORIES.map((subcat) => (
                <button
                  key={subcat.id}
                  onClick={() => setSelectedGamingSubcategory(subcat.id)}
                  className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition flex-shrink-0 text-sm ${
                    selectedGamingSubcategory === subcat.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-foreground hover:bg-border'
                  }`}
                >
                  {subcat.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Listings */}
      <section className="py-12 px-4 flex-1">
        <div className="max-w-6xl mx-auto h-full">
          <h2 className="text-2xl font-bold mb-8">
            {selectedCategory
              ? CATEGORIES.find((c) => c.id === selectedCategory)?.name
              : 'Featured Listings'}
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-muted-foreground text-center">
                <p className="text-lg font-medium">{t('common.loading')}</p>
              </div>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center max-w-sm">
                <p className="text-lg font-medium text-foreground mb-2">No Listings Found</p>
                <p className="text-muted-foreground mb-6">
                  {listings.length === 0 
                    ? 'Be the first to create a listing! Click "Create Listing" to get started.'
                    : 'Try adjusting your filters or search terms.'}
                </p>
                <Link
                  href="/create-listing"
                  className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
                >
                  Create Listing
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
              <div
                key={listing.id}
                className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                {/* Image Display */}
                <div className="h-48 w-full overflow-hidden bg-secondary">
                  {listing.images && listing.images.length > 0 ? (
                    <img 
                      src={listing.images[0].url} 
                      alt={listing.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <span className="text-4xl">📷</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-2">{listing.title}</h3>
                    <p className="text-sm text-muted-foreground">{listing.location}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-xl font-bold text-primary">{listing.price} π</span>
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition">
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 bg-secondary">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 Tunisia Pi Market. Built for the Pi Network community.</p>
        </div>
      </footer>
    </div>
  );
}
