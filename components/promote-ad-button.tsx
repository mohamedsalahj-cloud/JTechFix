'use client';

import { useState } from 'react';
import { usePiAuth } from '@/contexts/pi-auth-context';
import { useLanguage } from '@/contexts/language-context';
import { PRODUCT_CONFIG } from '@/lib/product-config';

export function PromoteAdButton() {
  const { sdk, products, restoredPurchases } = usePiAuth();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const product = products?.find(
    (p) => p.id === PRODUCT_CONFIG.PRODUCT_6a510faa7325daf989c74621
  );

  const quantity = restoredPurchases?.find(
    (p) => p.productId === product?.slug
  )?.quantity ?? 0;

  const handlePromoteClick = async () => {
    if (!product || !sdk) {
      setMessage({
        type: 'error',
        text: t('promote.error.product_not_found') || 'Product not found. Please try again.',
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      console.log("[v0] Initiating purchase for product:", product.slug, "Price:", product.price_in_pi, "π");
      const result = await sdk.makePurchase(product.slug);

      if (result.ok) {
        setMessage({
          type: 'success',
          text: `${t('promote.success') || 'Success!'} Your ad will be promoted shortly.`,
        });
      } else {
        setMessage({
          type: 'error',
          text: t('promote.error.purchase_failed') || 'Purchase failed. Please try again.',
        });
      }
    } catch (error: any) {
      const errorCode = error?.code;
      let errorMessage = t('promote.error.purchase_error') || 'An error occurred during purchase.';

      if (errorCode === 'product_not_found') {
        errorMessage = t('promote.error.product_not_found') || 'Product not found.';
      } else if (errorCode === 'purchase_cancelled') {
        errorMessage = t('promote.error.purchase_cancelled') || 'Purchase cancelled.';
      }

      setMessage({
        type: 'error',
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">
              {product.name || t('promote.title') || 'Promote Your Ad'}
            </h3>
            <p className="text-sm opacity-90 mb-3">
              {product.description || t('promote.description') || 'Get more visibility by promoting your ad to the top of the marketplace.'}
            </p>
            {quantity > 0 && (
              <p className="text-xs opacity-75">
                {t('promote.available') || 'Available:'} {quantity} promotion{quantity !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          <button
            onClick={handlePromoteClick}
            disabled={isLoading}
            className="px-6 py-2 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg whitespace-nowrap"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></span>
                {t('promote.loading') || 'Processing...'}
              </span>
            ) : (
              `${t('promote.button') || 'Promote Now'} - ${product.price_in_pi?.toFixed(2) || '0.50'} π`
            )}
          </button>
        </div>

        {message && (
          <div
            className={`mt-4 p-3 rounded-lg text-sm font-medium ${
              message.type === 'success'
                ? 'bg-green-900/30 text-green-100 border border-green-500/50'
                : 'bg-red-900/30 text-red-100 border border-red-500/50'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
