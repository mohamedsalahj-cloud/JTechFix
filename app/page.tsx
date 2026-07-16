'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
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

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
            {t('hero.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/browse" className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition inline-block text-center">
              {t('hero.browse')}
            </Link>
            <Link href="/create-listing" className="px-8 py-3 border border-border rounded-lg font-semibold hover:bg-secondary transition inline-block text-center">
              {t('hero.create')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-secondary">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">{t('features.title')}</h3>
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
              <div key={i} className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <div className="w-6 h-6 rounded bg-primary" />
                </div>
                <h4 className="font-semibold text-lg">{feature.title}</h4>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">{t('categories.title')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                className="p-6 border border-border rounded-lg hover:border-primary hover:bg-secondary transition text-center font-medium"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h3 className="text-4xl font-bold">{t('cta.title')}</h3>
          <p className="text-lg opacity-90">
            {t('cta.subtitle')}
          </p>
          <button className="px-8 py-3 bg-primary-foreground text-primary rounded-lg font-semibold hover:opacity-90 transition">
            {t('cta.launch')}
          </button>
        </div>
      </section>
<">
  <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
    <p>© 2024 Tunisia Pi Market. Built for the Pi Network community.</p>
  </div>
</main>
     } 
