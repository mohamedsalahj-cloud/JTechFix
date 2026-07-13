'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { usePiAuth } from '@/contexts/pi-auth-context';
import { PremiumAdButton } from '@/components/premium-ad-button';
import { saveListing, initializeListingsCache } from '@/lib/listings-storage';
import type { Language } from '@/lib/translations';

const LOCATIONS = [
  { value: 'us', label: 'form.location.us' },
  { value: 'uk', label: 'form.location.uk' },
  { value: 'ca', label: 'form.location.ca' },
  { value: 'au', label: 'form.location.au' },
  { value: 'de', label: 'form.location.de' },
  { value: 'fr', label: 'form.location.fr' },
  { value: 'it', label: 'form.location.it' },
  { value: 'es', label: 'form.location.es' },
  { value: 'nl', label: 'form.location.nl' },
  { value: 'be', label: 'form.location.be' },
  { value: 'ch', label: 'form.location.ch' },
  { value: 'se', label: 'form.location.se' },
  { value: 'no', label: 'form.location.no' },
  { value: 'dk', label: 'form.location.dk' },
  { value: 'fi', label: 'form.location.fi' },
  { value: 'jp', label: 'form.location.jp' },
  { value: 'kr', label: 'form.location.kr' },
  { value: 'cn', label: 'form.location.cn' },
  { value: 'in', label: 'form.location.in' },
  { value: 'sg', label: 'form.location.sg' },
  { value: 'my', label: 'form.location.my' },
  { value: 'th', label: 'form.location.th' },
  { value: 'ph', label: 'form.location.ph' },
  { value: 'id', label: 'form.location.id' },
  { value: 'vn', label: 'form.location.vn' },
  { value: 'br', label: 'form.location.br' },
  { value: 'mx', label: 'form.location.mx' },
  { value: 'ar', label: 'form.location.ar' },
  { value: 'cl', label: 'form.location.cl' },
  { value: 'co', label: 'form.location.co' },
  { value: 'ae', label: 'form.location.ae' },
  { value: 'sa', label: 'form.location.sa' },
  { value: 'eg', label: 'form.location.eg' },
  { value: 'ng', label: 'form.location.ng' },
  { value: 'za', label: 'form.location.za' },
  { value: 'tn', label: 'form.location.tn' },
  { value: 'dz', label: 'form.location.dz' },
  { value: 'ma', label: 'form.location.ma' },
  { value: 'tr', label: 'form.location.tr' },
  { value: 'ru', label: 'form.location.ru' },
  { value: 'ua', label: 'form.location.ua' },
  { value: 'pl', label: 'form.location.pl' },
  { value: 'cz', label: 'form.location.cz' },
  { value: 'gr', label: 'form.location.gr' },
  { value: 'nz', label: 'form.location.nz' },
];

const CATEGORIES = [
  { value: 'electronics', label: 'categories.electronics' },
  { value: 'computers-gaming', label: 'categories.computers-gaming' },
  { value: 'smart-tvs', label: 'categories.smart-tvs' },
  { value: 'fashion', label: 'categories.fashion' },
  { value: 'home', label: 'categories.home' },
  { value: 'services', label: 'categories.services' },
  { value: 'sports', label: 'categories.sports' },
  { value: 'books', label: 'categories.books' },
  { value: 'art', label: 'categories.art' },
  { value: 'other', label: 'categories.other' },
];

export default function CreateListingPage() {
  const { language, setLanguage, t, dir } = useLanguage();
  const { sdk, isSdkReady, waitForSdk } = usePiAuth();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isWaitingForSdk, setIsWaitingForSdk] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: 'us',
    category: 'electronics',
    description: '',
    whatsapp: '',
    buyerMessage: '',
    openPayWallet: '',
    piNetworkWallet: '',
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showPremiumOption, setShowPremiumOption] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxFiles = 5;
    const totalFiles = imageFiles.length + files.length;

    if (totalFiles > maxFiles) {
      alert(t('form.images.maxFiles') || `Maximum ${maxFiles} images allowed`);
      return;
    }

    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);

    // Create previews
    const newPreviews: string[] = [];
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === newFiles.length) {
          setImagePreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSaving(true);
    setSaveError(null);

    try {
      // Convert image previews to data URLs for storage
      const images = imagePreviews.map((preview, index) => ({
        url: preview,
        name: imageFiles[index]?.name || `image-${index}`,
      }));

      // Generate a user ID (works with or without SDK)
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      console.log('[v0] Saving listing instantly, userId:', userId);

      // Save listing SYNCHRONOUSLY to in-memory cache (instant, no timeout)
      saveListing(sdk, {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        location: formData.location,
        category: formData.category,
        whatsapp: formData.whatsapp,
        buyerMessage: formData.buyerMessage,
        openPayWallet: formData.openPayWallet,
        piNetworkWallet: formData.piNetworkWallet,
        images,
      }, userId);

      console.log('[v0] Listing saved successfully to local cache');
      setSubmitted(true);
      setShowPremiumOption(true);
    } catch (error) {
      console.error('[v0] Error saving listing:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to create listing. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetForm = () => {
    setSubmitted(false);
    setShowPremiumOption(false);
    setFormData({
      title: '',
      price: '',
      location: 'us',
      category: 'electronics',
      description: '',
      whatsapp: '',
      buyerMessage: '',
    });
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handlePremiumSuccess = () => {
    setTimeout(() => {
      handleResetForm();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('form.title')}</h1>
          </div>
          <div className="flex gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm font-medium"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
              <option value="fr">Français</option>
            </select>
            <Link
              href="/browse"
              className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition"
            >
              {t('form.cancel')}
            </Link>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-2 mb-8">
            <h2 className="text-4xl font-bold">{t('form.title')}</h2>
          </div>

          {/* Error Message */}
          {saveError && (
            <div className="p-4 bg-red-100 text-red-800 rounded-lg text-sm font-medium mb-6">
              {saveError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-lg border border-border">
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium">
                {t('form.itemTitle')}
              </label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder={t('form.itemTitle.placeholder')}
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium">
                {t('form.category')}
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {t(cat.label)}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium">
                {t('form.price')}
              </label>
              <div className="flex gap-2">
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g., 50.00"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <div className="px-4 py-2 rounded-lg border border-border bg-secondary flex items-center font-medium">
                  π
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label htmlFor="location" className="block text-sm font-medium">
                {t('form.location')}
              </label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc.value} value={loc.value}>
                    {t(loc.label)}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium">
                {t('form.description')}
              </label>
              <textarea
                id="description"
                name="description"
                placeholder={t('form.description.placeholder')}
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>

            {/* OpenPay Wallet Address */}
            <div className="space-y-2">
              <label htmlFor="openPayWallet" className="block text-sm font-medium">
                {t('form.openPayWallet')}
              </label>
              <input
                id="openPayWallet"
                name="openPayWallet"
                type="text"
                placeholder={t('form.openPayWallet.placeholder')}
                value={formData.openPayWallet}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Pi Network Wallet Address */}
            <div className="space-y-2">
              <label htmlFor="piNetworkWallet" className="block text-sm font-medium">
                {t('form.piNetworkWallet')}
              </label>
              <input
                id="piNetworkWallet"
                name="piNetworkWallet"
                type="text"
                placeholder={t('form.piNetworkWallet.placeholder')}
                value={formData.piNetworkWallet}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* WhatsApp Number */}
            <div className="space-y-2">
              <label htmlFor="whatsapp" className="block text-sm font-medium">
                {t('form.whatsapp')}
              </label>
              <input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                placeholder={t('form.whatsapp.placeholder')}
                value={formData.whatsapp}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Buyer Message */}
            <div className="space-y-2">
              <label htmlFor="buyerMessage" className="block text-sm font-medium">
                {t('form.buyerMessage')}
              </label>
              <textarea
                id="buyerMessage"
                name="buyerMessage"
                placeholder={t('form.buyerMessage.placeholder')}
                value={formData.buyerMessage}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label htmlFor="images" className="block text-sm font-medium">
                {t('form.images')}
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 bg-secondary/30 text-center cursor-pointer hover:border-primary/50 hover:bg-secondary/50 transition">
                <input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  aria-label={t('form.images')}
                />
                <label htmlFor="images" className="cursor-pointer block">
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      className="w-8 h-8 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <p className="text-sm text-muted-foreground">
                      {t('form.images.placeholder')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {imagePreviews.length}/5 {t('form.images') || 'images'}
                    </p>
                  </div>
                </label>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-border"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xs font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSaving || isWaitingForSdk}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isWaitingForSdk ? t('common.loading') : isSaving ? t('common.loading') : submitted ? t('form.success') : t('form.submit')}
              </button>
              <Link
                href="/browse"
                className="px-6 py-3 border border-border rounded-lg font-semibold hover:bg-secondary transition text-center"
              >
                {t('form.cancel')}
              </Link>
            </div>

            {/* Success Message */}
            {submitted && (
              <div className="p-4 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                {t('form.success')}
              </div>
            )}
          </form>

          {/* Premium Ad Placement Option - Shown after successful submission */}
          {submitted && showPremiumOption && (
            <div className="mt-8 space-y-4">
              <div className="border-t border-border pt-8">
                <h3 className="text-2xl font-bold mb-4">{t('dashboard.makePremium')}</h3>
                <PremiumAdButton 
                  onSuccess={handlePremiumSuccess}
                  onError={(error) => console.error('Premium ad error:', error)}
                />
              </div>
              <Link
                href="/browse"
                className="block w-full text-center px-6 py-3 border border-border rounded-lg font-semibold hover:bg-secondary transition"
              >
                {t('premium.skipNow')}
              </Link>
            </div>
          )}
        </div>
      </section>
<footer className="border-t border-border py-8 px-4 mt-12">
  <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
    <p>© 2024 Tunisia Pi Market. Built for the Pi Network community.</p>
  </div>
</footer>
