'use client';

import { useState } from 'react';
import { usePiAuth } from '@/contexts/pi-auth-context';
import { useLanguage } from '@/contexts/language-context';
import { PRODUCT_CONFIG } from '@/lib/product-config';

interface PremiumAdButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  variant?: 'default' | 'compact';
}

export function PremiumAdButton({ 
  onSuccess, 
  onError,
  variant = 'default'
}: PremiumAdButtonProps) {
  const { sdk, products } = usePiAuth();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Find the Premium Ad Placement product
  const product = products?.find(
    (p) => p.id === PRODUCT_CONFIG.PRODUCT_6a5040736e3592f36905b865
  );

  // Disable button if product not found or SDK not ready
  const isDisabled = !product || !sdk || isLoading;

  const handlePayment = async () => {
    if (!product || !sdk) {
      const error = t('common.error');
      setMessage({ type: 'error', text: error });
      onError?.(error);
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const result = await sdk.makePurchase(product.slug);

      if (result.ok) {
        const successMsg = `${t('success.purchaseComplete')} ${t('common.pi')} ID: ${result.txid}`;
        setMessage({ type: 'success', text: successMsg });
        onSuccess?.();
        
        // Clear message after 5 seconds
        setTimeout(() => setMessage(null), 5000);
      } else {
        const error = t('error.purchaseError');
        setMessage({ type: 'error', text: error });
        onError?.(error);
      }
    } catch (error: any) {
      let errorMsg = t('common.error');

      if (error?.code === 'product_not_found') {
        errorMsg = t('error.productNotFound');
      } else if (error?.code === 'purchase_cancelled') {
        errorMsg = t('error.purchaseCancelled');
      } else if (error?.code === 'purchase_error') {
        errorMsg = t('error.purchaseError');
      }

      setMessage({ type: 'error', text: errorMsg });
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'compact') {
    return (
      <div className="space-y-2">
        <button
          onClick={handlePayment}
          disabled={isDisabled}
          className={`w-full px-4 py-2 rounded-lg font-medium transition ${
            isDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-amber-500 text-white hover:bg-amber-600 active:scale-95'
          }`}
        >
          {isLoading ? t('common.loading') : product ? `${t('dashboard.premium.title')} - ${product.price_in_pi} π` : t('common.loading')}
        </button>
        {message && (
          <div
            className={`text-sm p-2 rounded ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border border-border rounded-lg p-6 bg-card space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{t('dashboard.premium.title')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.premium.description')}
            </p>
          </div>
          {product && (
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {product.price_in_pi} π
              </div>
              <p className="text-xs text-muted-foreground">{t('dashboard.premium.price')}</p>
            </div>
          )}
        </div>

        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">✓</span>
            <span>{t('dashboard.makePremium')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">✓</span>
            <span>{t('browse.filterByCategory')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">✓</span>
            <span>{t('dashboard.premium.success')}</span>
          </li>
        </ul>

        <button
          onClick={handlePayment}
          disabled={isDisabled}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            isDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:opacity-90 active:scale-95'
          }`}
        >
          {isLoading ? t('common.loading') : `${t('dashboard.premium.purchase')} - ${product?.price_in_pi || '1.0'} π`}
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg text-sm font-medium ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
