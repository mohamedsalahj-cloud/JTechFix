'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
import { SuggestedApps } from '@/components/suggested-apps';
import { PromotionalBanner } from '@/components/promotional-banner';
import { PromoteAdButton } from '@/components/promote-ad-button';
import type { Language } from '@/lib/translations';

export default function HomePage() {
  const { language, setLanguage, t, dir } = useLanguage();

  return (
    <main className="min-h-screen bg-background" dir={dir}>
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
              π
            </div>
            <h1 className="text-2xl font-bold">Tunisia Pi Market</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/browse" className="text-sm font-medium text-foreground hover:text-primary transition">
              {t('nav.browse')}
            </Link>
            <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition">
              {t('nav.sell')}
            </a>
            <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition">
              {t('nav.about')}
            </a>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition">
              {t('nav.signin')}
            </button>
          </nav>
          
          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm font-medium hover:border-primary transition"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>
      </header>

      {/* Promotional Banner with Carousel */}
      <PromotionalBanner />

      {/* Promote Ad Button */}
      <section className="py-8 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <PromoteAdButton />
        </div>
      </section>

      {/* Features - Enhanced with spacing and shadows */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold">{t('features.title')}</h3>
            <div className="w-12 h-1 bg-primary rounded-full mx-auto mt-4"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: t('features.pay'),
                description: t('features.pay.desc')
              },
              {
                title: t('features.local'),
                description: t('features.local.desc')
              },
              {
                title: t('features.escrow'),
                description: t('features.escrow.desc')
              }
            ].map((feature, i) => (
              <div key={i} className="p-6 border border-border rounded-2xl hover:shadow-lg hover:border-primary transition-all bg-background">
                <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center mb-4">
                  <div className="w-7 h-7 rounded-lg bg-primary" />
                </div>
                <h4 className="font-bold text-lg mb-2">{feature.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories - Modern with shadows and bold typography */}
      <section className="py-24 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold">{t('categories.title')}</h3>
            <div className="w-12 h-1 bg-primary rounded-full mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              t('categories.electronics'),
              t('categories.fashion'),
              t('categories.home'),
              t('categories.services'),
              t('categories.sports'),
              t('categories.books'),
              t('categories.art'),
              t('categories.other')
            ].map((cat, i) => (
              <button
                key={i}
                className="p-6 bg-background border border-border rounded-2xl hover:border-primary hover:shadow-md hover:bg-primary/5 transition-all duration-200 text-center font-bold text-sm md:text-base"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Modern Premium Style */}
      <section className="py-24 px-4 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div>
            <h3 className="text-4xl md:text-5xl font-bold mb-4">{t('cta.title')}</h3>
            <p className="text-lg md:text-xl opacity-95 leading-relaxed">
              {t('cta.subtitle')}
            </p>
          </div>
          <button className="px-8 py-3 bg-primary-foreground text-primary rounded-xl font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-xl">
            {t('cta.launch')}
          </button>
        </div>
      </section>

      {/* Suggested Apps */}
      <SuggestedApps />

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 bg-background">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 Tunisia Pi Market. Built for the Pi Network community.</p>
        </div>
      </footer>
    </main>
  );
}
