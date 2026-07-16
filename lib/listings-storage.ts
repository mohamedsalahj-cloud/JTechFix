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
  images: ListingImage[];
  createdAt: number;
  userId: string;
}

export interface ListingsData {
  items: Listing[];
}

const LISTINGS_KEY = 'marketplace.listings';
const MAX_LISTINGS = 200;

export async function saveListing(sdk: any, listing: Omit<Listing, 'id' | 'createdAt'>, userId: string): Promise<Listing> {
  if (!sdk) throw new Error('SDK not available');

  try {
    // Get existing listings
    const data = await sdk.state.get(LISTINGS_KEY);
    let listings: Listing[] = [];

    if (data?.blob) {
      try {
        const parsed = JSON.parse(data.blob);
        listings = parsed.items || [];
      } catch (e) {
        listings = [];
      }
    }

    // Create new listing
    const newListing: Listing = {
      ...listing,
      id: `listing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      userId,
    };

    // Add to listings
    listings.unshift(newListing);

    // Keep only recent listings
    if (listings.length > MAX_LISTINGS) {
      listings = listings.slice(0, MAX_LISTINGS);
    }

    // Save back
    await sdk.state.set(LISTINGS_KEY, {
      items: listings,
    });

    return newListing;
  } catch (error) {
    console.error('[v0] Error saving listing:', error);
    throw error;
  }
}

export async function getListings(sdk: any): Promise<Listing[]> {
  if (!sdk) {
    console.log('[v0] SDK not available for getListings');
    return [];
  }

  try {
    const data = await sdk.state.get(LISTINGS_KEY);
    if (!data || !data.blob) {
      console.log('[v0] No listings found in storage');
      return [];
    }

    const parsed = JSON.parse(data.blob);
    const items = parsed.items || [];
    console.log('[v0] Successfully fetched listings:', items.length);
    return items;
  } catch (error) {
    console.error('[v0] Error fetching listings:', error);
    return [];
  }
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
