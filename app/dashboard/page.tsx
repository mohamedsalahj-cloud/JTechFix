'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { PremiumAdButton } from '@/components/premium-ad-button';
import type { Language } from '@/lib/translations';

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  category: string;
  isPremium?: boolean;
  createdAt: Date;
}

// Sample user listings - in a real app, these would come from your backend
const SAMPLE_USER_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'iPhone 14 Pro Max',
    price: 900,
    location: 'Tunis',
    category: 'electronics',
    isPremium: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    title: 'Vintage Leather Sofa',
    price: 350,
    location: 'Sfax',
    category: 'furniture',
    isPremium: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    title: 'Mountain Bike - Trek X-Caliber',
    price: 600,
    location: 'Sousse',
    category: 'sports',
    isPremium: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

export default function DashboardPage() {
  const { language, setLanguage, t, dir } = useLanguage();
  const [listings, setListings] = useState<Listing[]>(SAMPLE_USER_LISTINGS);
  const [selectedListingForPremium, setSelectedListingForPremium] = useState<string | null>(null);

  const handlePremiumSuccess = (listingId: string) => {
    setListings((prev) =>
      prev.map((listing) =>
        listing.id === listingId ? { ...listing, isPremium: true } : listing
      )
    );
    setSelectedListingForPremium(null);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-TN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      {/* Header */}
      <div className="border-b border-border sticky top-0 z-10 bg-background">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/browse" className="text-foreground hover:text-primary transition">
              {dir === 'rtl' ? '→' : '←'} {t('form.cancel')}
            </Link>
            <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/create-listing"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition"
            >
              + {t('hero.create')}
            </Link>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm font-medium"
            >
              <option value="en">EN</option>
              <option value="ar">AR</option>
              <option value="fr">FR</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-sm font-medium text-muted-foreground">{t('dashboard.totalListings')}</h3>
              <p className="text-4xl font-bold mt-2">{listings.length}</p>
            </div>
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-sm font-medium text-muted-foreground">{t('dashboard.premiumListings')}</h3>
              <p className="text-4xl font-bold mt-2 text-primary">
                {listings.filter((l) => l.isPremium).length}
              </p>
            </div>
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-sm font-medium text-muted-foreground">{t('dashboard.totalValue')}</h3>
              <p className="text-4xl font-bold mt-2">
                {listings.reduce((sum, l) => sum + l.price, 0)} π
              </p>
            </div>
          </div>

          {/* Listings Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">{t('dashboard.myListings')}</h2>
              {listings.length === 0 ? (
                <div className="border border-border rounded-lg p-12 text-center">
                  <p className="text-muted-foreground text-lg mb-4">{t('dashboard.noListings')}</p>
                  <Link
                    href="/create-listing"
                    className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
                  >
                    {t('hero.create')}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {listings.map((listing) => (
                    <div key={listing.id} className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6">
                        {/* Listing Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg truncate">{listing.title}</h3>
                            {listing.isPremium && (
                              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full whitespace-nowrap">
                                ⭐ {t('dashboard.premiumListings')}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {t('common.category')}: {listing.category} • {t('common.location')}: {listing.location}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {t('common.category')}: {formatDate(listing.createdAt)}
                          </p>
                        </div>

                        {/* Price and Actions */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
                          <div className="text-2xl font-bold text-primary">{listing.price} π</div>
                          
                          {!listing.isPremium ? (
                            <div className="flex-1 sm:flex-none">
                              {selectedListingForPremium === listing.id ? (
                                <button
                                  onClick={() => setSelectedListingForPremium(null)}
                                  className="px-4 py-2 text-sm bg-secondary text-foreground rounded-lg font-medium hover:opacity-90 transition w-full sm:w-auto"
                                >
                                  {t('form.cancel')}
                                </button>
                              ) : (
                                <button
                                  onClick={() => setSelectedListingForPremium(listing.id)}
                                  className="px-4 py-2 text-sm bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition w-full sm:w-auto"
                                >
                                  {t('dashboard.upgradeToPlus')}
                                </button>
                              )}
                            </div>
                          ) : (
                            <button
                              disabled
                              className="px-4 py-2 text-sm bg-green-100 text-green-800 rounded-lg font-medium w-full sm:w-auto"
                            >
                              ✓ {t('dashboard.premiumListings')}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Premium Upgrade Section - Expands for selected listing */}
                      {selectedListingForPremium === listing.id && !listing.isPremium && (
                        <div className="border-t border-border p-6 bg-secondary/50">
                          <h4 className="font-semibold mb-4">{t('dashboard.makePremium')} "{listing.title}"</h4>
                          <PremiumAdButton
                            variant="compact"
                            onSuccess={() => handlePremiumSuccess(listing.id)}
                            onError={(error) => console.error('Premium ad error:', error)}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 mt-12">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 Tunisia Pi Market. Built for the Pi Network community.</p>
        </div>
      </footer>
    </div>
  );
}
