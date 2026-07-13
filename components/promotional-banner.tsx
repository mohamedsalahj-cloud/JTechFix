'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';

interface BannerSlide {
  id: number;
  titleKey: string;
  subtitleKey: string;
  gradient: string;
}

export function PromotionalBanner() {
  const { t, language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: BannerSlide[] = [
    {
      id: 1,
      titleKey: 'banner.slide1.title',
      subtitleKey: 'banner.slide1.subtitle',
      gradient: 'from-purple-900 via-purple-800 to-blue-900'
    },
    {
      id: 2,
      titleKey: 'banner.slide2.title',
      subtitleKey: 'banner.slide2.subtitle',
      gradient: 'from-blue-900 via-purple-900 to-purple-800'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Carousel Container */}
      <div className="relative h-64 md:h-72 lg:h-80">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Blockchain-themed gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`}>
              {/* Animated accent elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/20 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-400/20 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center justify-center px-4">
              <div className="max-w-4xl mx-auto text-center space-y-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-lg">
                  {t(slide.titleKey)}
                </h2>
                <p className="text-base md:text-lg text-gray-100 max-w-2xl mx-auto drop-shadow-md leading-relaxed">
                  {t(slide.subtitleKey)}
                </p>
                <div>
                  <Link
                    href="/browse"
                    className="inline-block px-8 py-3 bg-yellow-400 text-gray-900 font-bold rounded-xl hover:bg-yellow-300 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
                  >
                    {t('banner.cta')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-8 bg-yellow-400 shadow-lg'
                : 'w-2.5 bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => goToSlide((currentSlide - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all flex items-center justify-center group"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => goToSlide((currentSlide + 1) % slides.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all flex items-center justify-center group"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
}
