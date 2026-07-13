'use client';

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { usePiAuth } from '@/contexts/pi-auth-context';
import { getListings, initializeListingsCache } from '@/lib/listings-storage';
import type { Listing } from '@/lib/listings-storage';

export default function ListingDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const listingId = params.id as string;
  
  const { t, dir } = useLanguage();
  const { sdk } = usePiAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

  // Load listing details
  useEffect(() => {
    const loadListing = async () => {
      try {
        await initializeListingsCache(sdk);
        const allListings = await getListings(sdk);
        const foundListing = allListings.find((item) => item.id === listingId);
        
        if (foundListing) {
          setListing(foundListing);
          console.log('[v0] Loaded listing:', foundListing.id);
        } else {
          console.warn('[v0] Listing not found:', listingId);
        }
      } catch (error) {
        console.error('[v0] Error loading listing:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadListing();
  }, [sdk, listingId]);

  const handleCopyWhatsApp = () => {
    if (listing?.whatsapp) {
      navigator.clipboard.writeText(listing.whatsapp);
      setCopiedWhatsApp(true);
      setTimeout(() => setCopiedWhatsApp(false), 2000);
    }
  };

  const handleContactViaWhatsApp = () => {
    if (listing?.whatsapp) {
      const message = encodeURIComponent(listing.buyerMessage || `I'm interested in: ${listing.title}`);
      const whatsappUrl = `https://wa.me/${listing.whatsapp}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col" dir={dir}>
        <div className="flex items-center justify-center py-20">
          <div className="text-muted-foreground text-center">
            <p className="text-lg font-medium">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background flex flex-col" dir={dir}>
        <div className="sticky top-0 z-10 bg-background border-b border-border">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <button 
              onClick={() => router.back()}
              className="text-foreground hover:text-primary transition flex items-center gap-2"
            >
              {dir === 'rtl' ? '→' : '←'} {t('form.cancel')}
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground mb-4">Listing Not Found</p>
            <p className="text-muted-foreground mb-6">The listing you&apos;re looking for doesn&apos;t exist.</p>
            <Link
              href="/browse"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
            >
              Back to Browse
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col" dir={dir}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <button 
            onClick={() => router.back()}
            className="text-foreground hover:text-primary transition flex items-center gap-2 font-semibold"
          >
            {dir === 'rtl' ? '→' : '←'} {t('form.cancel')}
          </button>
          <Link
            href="/browse"
            className="text-foreground hover:text-primary transition font-semibold"
          >
            {t('browse.title')}
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative bg-secondary rounded-lg overflow-hidden h-96 md:h-full min-h-96 flex items-center justify-center">
                {listing.images && listing.images.length > 0 ? (
                  <>
                    <img
                      src={listing.images[currentImageIndex].url}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Crect width=%22400%22 height=%22400%22 fill=%22%23e5e5e5%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2224%22%3E📷%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    
                    {/* Navigation Arrows */}
                    {listing.images.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setCurrentImageIndex(
                              currentImageIndex === 0
                                ? listing.images.length - 1
                                : currentImageIndex - 1
                            )
                          }
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition z-10"
                          aria-label="Previous image"
                        >
                          ❮
                        </button>
                        <button
                          onClick={() =>
                            setCurrentImageIndex((currentImageIndex + 1) % listing.images.length)
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition z-10"
                          aria-label="Next image"
                        >
                          ❯
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <span className="text-6xl">📷</span>
                )}
              </div>

              {/* Thumbnail Navigation */}
              {listing.images && listing.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {listing.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                        index === currentImageIndex
                          ? 'border-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              {/* Title and Location */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{listing.title}</h1>
                <p className="text-lg text-muted-foreground flex items-center gap-2">
                  📍 {listing.location}
                </p>
              </div>

              {/* Price */}
              <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                <p className="text-sm text-muted-foreground mb-1">Price</p>
                <p className="text-4xl font-bold text-primary">{listing.price} π</p>
              </div>

              {/* Category and Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Category</p>
                  <p className="font-semibold text-foreground capitalize">{listing.category}</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Posted</p>
                  <p className="font-semibold text-foreground">
                    {new Date(listing.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Description</h2>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {listing.description}
                </p>
              </div>

              {/* Contact Section */}
              <div className="bg-primary/10 border border-primary rounded-lg p-6 space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Contact Seller</h2>
                
                {listing.whatsapp && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">WhatsApp Number</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={listing.whatsapp}
                        readOnly
                        className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground"
                      />
                      <button
                        onClick={handleCopyWhatsApp}
                        className="px-4 py-2 bg-secondary text-foreground rounded-lg font-medium hover:opacity-90 transition"
                      >
                        {copiedWhatsApp ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                )}

                {listing.buyerMessage && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Message from Seller</p>
                    <p className="text-foreground italic">"{listing.buyerMessage}"</p>
                  </div>
                )}

                {listing.openPayWallet && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">OpenPay Wallet Address</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={listing.openPayWallet}
                        readOnly
                        className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground text-sm font-mono"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(listing.openPayWallet);
                        }}
                        className="px-4 py-2 bg-secondary text-foreground rounded-lg font-medium hover:opacity-90 transition"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}

                {listing.piNetworkWallet && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Pi Network Wallet (Public Key)</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={listing.piNetworkWallet}
                        readOnly
                        className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground text-sm font-mono"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(listing.piNetworkWallet);
                        }}
                        className="px-4 py-2 bg-secondary text-foreground rounded-lg font-medium hover:opacity-90 transition"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}

                {listing.whatsapp && (
                  <button
                    onClick={handleContactViaWhatsApp}
                    className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                  >
                    💬 Contact via WhatsApp
                  </button>
                )}
              </div>

              {/* Back Button */}
              <Link
                href="/browse"
                className="block text-center px-6 py-3 bg-secondary text-foreground rounded-lg font-semibold hover:opacity-90 transition border border-border"
              >
                ← Back to Browse
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
