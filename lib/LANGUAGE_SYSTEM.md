# Multi-Language System Documentation

## Overview

Tunisia Pi Market implements a comprehensive multi-language system supporting Arabic, English, and French with full RTL (Right-to-Left) and LTR (Left-to-Right) support.

## Supported Languages

- **English (en)** - LTR
- **Arabic (ar)** - RTL
- **French (fr)** - LTR

## Architecture

### Core Components

#### 1. Translation System (`lib/translations.ts`)
- Centralized translation object with key-value pairs for all UI text
- Supports all three languages
- Fallback to English if translation key is missing
- Organized by feature/section using dot notation (e.g., `form.title`, `dashboard.myListings`)

#### 2. Language Context (`contexts/language-context.tsx`)
- React Context API for global language state management
- Persists language preference to localStorage
- Detects browser language on first load
- Provides `useLanguage()` hook for components
- Automatically applies `lang` and `dir` attributes to HTML element

#### 3. Language Settings Component (`components/language-settings.tsx`)
- Applied globally through AppWrapper
- Ensures RTL/LTR direction is applied consistently
- Updates HTML attributes and classes
- Manages page title translation

#### 4. Global Styles (`app/globals.css`)
- RTL/LTR specific CSS rules
- Direction-aware styling
- Smooth transitions between directions

## Usage

### Basic Translation

\`\`\`tsx
import { useLanguage } from '@/contexts/language-context';

export function MyComponent() {
  const { t, language, setLanguage, dir } = useLanguage();

  return (
    <div dir={dir}>
      <h1>{t('dashboard.title')}</h1>
      <button onClick={() => setLanguage('ar')}>العربية</button>
    </div>
  );
}
\`\`\`

### Adding New Translations

1. **Add to translations.ts:**

\`\`\`tsx
export const translations: Record<Language, Record<string, string>> = {
  en: {
    // ... existing translations
    'my.feature': 'My Feature',
  },
  ar: {
    // ... existing translations
    'my.feature': 'ميزتي',
  },
  fr: {
    // ... existing translations
    'my.feature': 'Ma Fonctionnalité',
  },
};
\`\`\`

2. **Use in component:**

\`\`\`tsx
<h2>{t('my.feature')}</h2>
\`\`\`

## Language Selection

### Language Selector Component

Present in all main pages:
- Homepage
- Browse page
- Create Listing page
- Dashboard

\`\`\`tsx
<select
  value={language}
  onChange={(e) => setLanguage(e.target.value as Language)}
  className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm font-medium"
>
  <option value="en">English</option>
  <option value="ar">العربية</option>
  <option value="fr">Français</option>
</select>
\`\`\`

## RTL/LTR Features

### Automatic Direction Handling

The `dir` attribute is automatically applied to all main containers:

\`\`\`tsx
<main className="min-h-screen bg-background" dir={dir}>
  {/* Content automatically adapts to RTL/LTR */}
</main>
\`\`\`

### Direction-Aware Icons

Navigation arrows automatically flip for RTL:

\`\`\`tsx
<Link href="/">
  {dir === 'rtl' ? '→' : '←'} {t('form.cancel')}
</Link>
\`\`\`

### CSS Support

RTL-specific styling is handled through:
- CSS `dir` pseudo-selector: `html[dir="rtl"]`
- RTL class: `html.rtl`
- Logical CSS properties (when applicable)

## Data Persistence

- Language preference is saved to localStorage with key `tayara-language`
- On return visits, the saved language is restored
- If no saved preference, browser language is detected
- Default fallback is English

## Translation Keys by Section

### Navigation & Common
- `nav.browse`, `nav.sell`, `nav.about`, `nav.signin`
- `common.pi`, `common.price`, `common.location`, `common.category`

### Home Page
- `hero.title`, `hero.subtitle`, `hero.browse`, `hero.create`
- `features.title`, `features.pay`, `features.local`, `features.escrow`
- `categories.title`, `categories.*` (all category names)
- `cta.title`, `cta.subtitle`, `cta.launch`

### Browse Page
- `browse.title`, `browse.posts`, `browse.view`, `browse.price`, `browse.location`
- `browse.empty`, `browse.filterByCategory`, `browse.allCategories`, `browse.myDashboard`

### Create Listing
- `form.title`, `form.itemTitle`, `form.itemTitle.placeholder`
- `form.category`, `form.price`, `form.location`, `form.description`
- `form.submit`, `form.cancel`, `form.success`
- `form.selectLocation`, `form.selectCategory`

### Dashboard
- `dashboard.title`, `dashboard.myListings`, `dashboard.totalListings`
- `dashboard.premiumListings`, `dashboard.totalValue`
- `dashboard.upgradeToPlus`, `dashboard.makePremium`
- `dashboard.premium.title`, `dashboard.premium.description`, `dashboard.premium.price`
- `dashboard.premium.purchase`, `dashboard.premium.success`, `dashboard.premium.error`

### Premium Features
- `premium.standOut`, `premium.skipNow`

### Errors & Messages
- `error.productNotFound`, `error.purchaseCancelled`, `error.purchaseError`
- `success.purchaseComplete`

## Browser Support

- Modern browsers with RTL support (Chrome, Firefox, Safari, Edge)
- localStorage support required for language persistence
- CSS Grid and Flexbox work correctly with RTL in all modern browsers

## Best Practices

1. **Always use translation keys** - Never hardcode UI text
2. **Use dot notation** - Organize keys hierarchically (e.g., `dashboard.stats.total`)
3. **Apply `dir` to containers** - Ensure direction prop is passed to main layout containers
4. **Test both directions** - Always test UI changes in both LTR and RTL modes
5. **Use semantic HTML** - Proper HTML structure ensures better RTL support
6. **Avoid absolute positioning** - Use flexbox/grid for layout to support RTL naturally

## Performance Considerations

- Translation lookups are O(1) operations
- Language switching doesn't require page reload
- Minimal JavaScript overhead for direction switching
- CSS is optimized for both directions

## Accessibility

- `lang` attribute is set on HTML element for screen readers
- `dir` attribute is set for proper text directionality
- Direction-aware arrow navigation for users
- Form labels and inputs respect language direction

## Future Enhancements

- Add more languages if needed
- Implement pluralization rules
- Add date/time formatting based on language
- Support for number formatting based on locale
- Currency formatting (currently shows π symbol)
