'use client';

import { useLanguage } from '@/contexts/language-context';

interface SuggestedApp {
  id: string;
  name: string;
  translationKey: string;
  subtitleAr: string;
  subtitleEn: string;
  icon: React.ReactNode;
  url: string;
}

export function SuggestedApps() {
  const { t, language } = useLanguage();

  const apps: SuggestedApp[] = [
    {
      id: 'ami',
      name: 'Ami',
      translationKey: 'suggestedApps.ami',
      subtitleAr: 'منصة Ami للخدمات والترفيه والتواصل الاجتماعي',
      subtitleEn: 'Ami - Services, Entertainment & Social Platform',
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="48" rx="8" fill="currentColor" opacity="0.1"/>
          <circle cx="16" cy="16" r="4" fill="currentColor"/>
          <circle cx="32" cy="16" r="4" fill="currentColor"/>
          <path d="M12 28C12 24 15.5 22 24 22C32.5 22 36 24 36 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="24" cy="24" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
        </svg>
      ),
      url: 'https://ami.pinetwork',
    },
    {
      id: 'openpay',
      name: 'OpenPay',
      translationKey: 'suggestedApps.openpay',
      subtitleAr: 'بوابة الدفع الإلكتروني وحلول المحفظة الرقمية',
      subtitleEn: 'Electronic Payment & Digital Wallet Solutions',
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="12" width="32" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="2"/>
          <rect x="10" y="14" width="28" height="5" fill="currentColor" opacity="0.15"/>
          <circle cx="20" cy="28" r="2.5" fill="currentColor"/>
          <circle cx="28" cy="28" r="2.5" fill="currentColor"/>
          <path d="M14 28H17M31 28H34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M12 20L36 20" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
        </svg>
      ),
      url: 'https://openpay.pinetwork',
    },
    {
      id: 'cidi-games',
      name: 'Cidi Games',
      translationKey: 'suggestedApps.cidigames',
      subtitleAr: 'منصة الألعاب والترفيه التفاعلية',
      subtitleEn: 'Interactive Gaming & Entertainment Platform',
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="48" rx="8" fill="currentColor" opacity="0.1"/>
          <rect x="10" y="14" width="28" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="18" cy="24" r="2" fill="currentColor"/>
          <circle cx="30" cy="24" r="2" fill="currentColor"/>
          <path d="M24 20V28M20 24H28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      url: 'https://cidigames.pinetwork',
    },
    {
      id: 'memo',
      name: 'Memo',
      translationKey: 'suggestedApps.memo',
      subtitleAr: 'تطبيق الملاحظات والمذكرة الذكية',
      subtitleEn: 'Smart Notes & Memo Application',
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="12" width="28" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="2"/>
          <path d="M14 18H34M14 24H34M14 30H28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M36 14V12C36 10.9 35.1 10 34 10H14C12.9 10 12 10.9 12 12V14" fill="currentColor" opacity="0.2"/>
        </svg>
      ),
      url: 'https://memo.pinetwork',
    },
    {
      id: 'did',
      name: 'Did',
      translationKey: 'suggestedApps.did',
      subtitleAr: 'منصة التوثيق والهوية الرقمية اللامركزية',
      subtitleEn: 'Decentralized Digital Identity & Verification Platform',
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="16" r="6" fill="none" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 32C12 26.48 17.37 22 24 22C30.63 22 36 26.48 36 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="24" cy="24" r="14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
        </svg>
      ),
      url: 'https://did.pinetwork',
    },
  ];

  const getSubtitle = (app: SuggestedApp) => {
    return language === 'ar' ? app.subtitleAr : app.subtitleEn;
  };

  const handleAppClick = (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-24 px-4 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold">{t('suggestedApps.title')}</h3>
          <div className="w-12 h-1 bg-primary rounded-full mx-auto mt-4"></div>
        </div>
        
        {/* Horizontal scrolling container */}
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="flex gap-8 pb-4">
            {apps.map((app) => (
              <button
                key={app.id}
                onClick={(e) => handleAppClick(app.url, e)}
                className="flex-shrink-0 w-56 group"
              >
                <div className="p-8 border border-border rounded-2xl hover:border-primary hover:shadow-lg hover:bg-secondary transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center text-center space-y-4">
                  {/* App Icon */}
                  <div className="text-primary group-hover:scale-110 transition-transform duration-300">
                    {app.icon}
                  </div>
                  
                  {/* App Name */}
                  <span className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                    {app.name}
                  </span>

                  {/* App Subtitle */}
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors leading-snug">
                    {getSubtitle(app)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
