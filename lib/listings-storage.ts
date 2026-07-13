export interface ListingImage {
  url: string;
  name: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  whatsapp: string;
  buyerMessage: string;
  openPayWallet: string;
  piNetworkWallet: string;
  images: ListingImage[];
  createdAt: number;
  userId: string;
}

export interface ListingsData {
  items: Listing[];
}

const LISTINGS_KEY = 'marketplace.listings';
const LISTINGS_LOCALSTORAGE_KEY = 'marketplace.listings.local';
const MAX_LISTINGS = 200;

// In-memory cache for listings (primary store)
let listingsCache: Listing[] = [];
let cacheInitialized = false;

// Load listings from localStorage (safe, synchronous)
function loadFromLocalStorage(): Listing[] {
  try {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(LISTINGS_LOCALSTORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('[v0] Loaded', parsed.length, 'listings from localStorage');
      return parsed;
    }
  } catch (error) {
    console.error('[v0] Failed to load from localStorage:', error);
  }
  return [];
}

// Save listings to localStorage (safe, synchronous, non-blocking)
function saveToLocalStorage(listings: Listing[]): void {
  try {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(LISTINGS_LOCALSTORAGE_KEY, JSON.stringify(listings));
    console.log('[v0] Listings saved to localStorage');
  } catch (error) {
    console.warn('[v0] Failed to save to localStorage:', error);
    // Silently fail - data is still in memory cache
  }
}

// Initialize cache from SDK or localStorage on first load
export async function initializeListingsCache(sdk: any): Promise<void> {
  if (cacheInitialized) return;
  
  try {
    // First, try to load from SDK state
    if (sdk?.state?.get) {
      try {
        const data = await sdk.state.get(LISTINGS_KEY);
        if (data?.blob) {
          const parsed = JSON.parse(data.blob);
          listingsCache = parsed.items || [];
          console.log('[v0] Loaded', listingsCache.length, 'listings from SDK state');
          cacheInitialized = true;
          return;
        }
      } catch (e) {
        console.warn('[v0] Failed to load from SDK state, falling back to localStorage');
      }
    }

    // Fallback to localStorage
    listingsCache = loadFromLocalStorage();
  } catch (error) {
    console.error('[v0] Failed to initialize listings cache:', error);
    listingsCache = [];
  }
  
  cacheInitialized = true;
}

// Save listing immediately to in-memory cache, localStorage, and sync with SDK asynchronously
export function saveListing(sdk: any, listing: Omit<Listing, 'id' | 'createdAt'>, userId: string): Listing {
  // Create new listing
  const newListing: Listing = {
    ...listing,
    id: `listing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
    userId,
  };

  // Add to in-memory cache IMMEDIATELY
  listingsCache.unshift(newListing);

  // Keep only recent listings
  if (listingsCache.length > MAX_LISTINGS) {
    listingsCache = listingsCache.slice(0, MAX_LISTINGS);
  }

  console.log('[v0] Listing saved instantly to cache:', newListing.id);

  // Save to localStorage IMMEDIATELY (synchronous, non-blocking)
  saveToLocalStorage(listingsCache);

  // Sync with SDK state in background (non-blocking)
  if (sdk?.state?.set) {
    syncListingsWithSdk(sdk).catch((error) => {
      console.warn('[v0] Failed to sync listings with SDK (but listing is saved locally):', error);
    });
  }

  return newListing;
}

// Sync listings cache with SDK state asynchronously (non-blocking)
async function syncListingsWithSdk(sdk: any): Promise<void> {
  try {
    await sdk.state.set(LISTINGS_KEY, {
      items: listingsCache,
    });
    console.log('[v0] Listings synced with SDK state');
  } catch (error) {
    console.warn('[v0] Failed to sync listings with SDK:', error);
    // Listing is still in memory cache, so user won't lose data
  }
}

export async function getListings(sdk: any): Promise<Listing[]> {
  // Initialize cache if needed
  await initializeListingsCache(sdk);

  // Return from in-memory cache (instant)
  console.log('[v0] Returning', listingsCache.length, 'listings from cache');
  return [...listingsCache]; // Return a copy to prevent external mutations
}

export async function deleteListingImage(url: string): Promise<void> {
  // If images are stored as blob URLs, they'll be cleaned up automatically
  // If they're external URLs, no action needed
  if (url.startsWith('blob:')) {
    try {
      const blob = await fetch(url).then((res) => res.blob());
      URL.revokeObjectURL(url);
    } catch (e) {
      // Already revoked
    }
  }
}

export function generateListingId(): string {
  return `listing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
