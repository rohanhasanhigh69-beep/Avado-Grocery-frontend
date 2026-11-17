import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { toBengaliDigits } from '../i18n/translations';

export const AnnouncementBar: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const { coupons, lang, pushToast, t, formatPrice } = useStore();

  if (dismissed) return null;

  const bannerCoupon = coupons.find((c) => c.showInBanner) ?? coupons[0] ?? null;

  const offerSuffix = bannerCoupon
    ? bannerCoupon.type === 'percent'
      ? lang === 'bn'
        ? `দিয়ে ${toBengaliDigits(bannerCoupon.value)}% ছাড় নিন`
        : `for ${bannerCoupon.value}% off`
      : bannerCoupon.type === 'flat'
      ? lang === 'bn'
        ? `দিয়ে ${formatPrice(bannerCoupon.value)} ছাড় নিন`
        : `for ${formatPrice(bannerCoupon.value)} off`
      : lang === 'bn'
      ? 'দিয়ে ফ্রি ডেলিভারি নিন'
      : 'for free delivery'
    : '';

  const handleCopyCode = () => {
    if (!bannerCoupon) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(bannerCoupon.code).catch(() => {});
    }
    pushToast({
      title: t.announcement.copiedTitle,
      detail: `${bannerCoupon.code} — ${lang === 'bn' ? bannerCoupon.descriptionBn : bannerCoupon.description}`,
      tone: 'success',
    });
  };

  return (
    <div className="bg-emerald-900 text-white text-xs sm:text-[13px] border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-9 flex items-center justify-between gap-2">
        <p className="truncate font-medium tracking-wide flex items-center gap-1.5 sm:gap-2">
          <span className="text-amber-300 font-semibold">{t.announcement.expressTag}</span>
          <span>
            {t.announcement.freeDeliveryPrefix}{' '}
            <span className="tabular-nums font-semibold">{formatPrice(1500)}</span>{' '}
            {t.announcement.freeDeliverySuffix}
          </span>
          {bannerCoupon && (
            <>
              <span aria-hidden="true" className="hidden sm:inline text-emerald-500">
                ·
              </span>
              <span className="hidden sm:inline">
                {t.announcement.useCodePrefix}{' '}
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="underline decoration-amber-300 underline-offset-2 text-amber-300 font-semibold hover:text-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 rounded px-0.5 cursor-pointer"
                  aria-label={t.announcement.copyAria}
                >
                  {bannerCoupon.code}
                </button>{' '}
                {offerSuffix}
              </span>
            </>
          )}
        </p>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href="tel:01722371905"
            className="hidden md:inline-block text-emerald-100 hover:text-white transition-colors tabular-nums whitespace-nowrap"
          >
            {t.announcement.orderByPhone}
          </a>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label={t.announcement.dismissAria}
            className="p-1 text-emerald-200 hover:text-white rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};
