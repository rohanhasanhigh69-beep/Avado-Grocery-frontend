import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Heart, Minus, Plus, ShoppingCart, Star, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getDiscountPercent } from '../utils/groceryLogic';
import { formatNum } from '../i18n/translations';
import { SafeImage } from './SafeImage';

export const QuickViewModal: React.FC = () => {
  const {
    lang,
    t,
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isWishlisted,
    formatPrice,
  } = useStore();

  const [variantIdx, setVariantIdx] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setVariantIdx(0);
    setQty(1);
  }, [quickViewProduct]);

  useEffect(() => {
    if (!quickViewProduct) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setQuickViewProduct(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [quickViewProduct, setQuickViewProduct]);

  if (!quickViewProduct) return null;

  const variants = quickViewProduct.variants;
  const activeVariant = variants && variants[variantIdx] ? variants[variantIdx] : null;
  const activeLabel = activeVariant ? activeVariant.label : quickViewProduct.unit;
  const activeLabelDisplay =
    lang === 'bn'
      ? activeVariant?.labelBn ?? (activeVariant ? activeVariant.label : quickViewProduct.unitBn)
      : activeLabel;
  const activePrice = activeVariant ? activeVariant.price : quickViewProduct.price;
  const activeOriginal = activeVariant
    ? activeVariant.originalPrice
    : quickViewProduct.originalPrice;
  const discountPct = getDiscountPercent(activePrice, activeOriginal);
  const saved = isWishlisted(quickViewProduct.id);

  const displayName = lang === 'bn' ? quickViewProduct.nameBn : quickViewProduct.name;
  const displayBrand = lang === 'bn' ? quickViewProduct.brandBn : quickViewProduct.brand;
  const displayDesc = lang === 'bn' ? quickViewProduct.descriptionBn : quickViewProduct.description;
  const displayOrigin = lang === 'bn' ? quickViewProduct.originBn : quickViewProduct.origin;

  const handleAdd = () => {
    addToCart(quickViewProduct, activeLabel, qty);
    setQuickViewProduct(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) setQuickViewProduct(null);
      }}
    >
      <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2">
        <div className="relative aspect-[4/3] sm:aspect-auto bg-white p-6 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-100">
          <SafeImage
            src={quickViewProduct.image}
            alt={displayName}
            fallbackLabel={displayName}
            className="w-full h-full max-h-72 object-contain mix-blend-multiply"
          />
          {discountPct > 0 && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-orange-600 text-white text-xs font-bold tabular-nums">
              {t.product.save} {formatNum(discountPct, lang)}%
            </span>
          )}
        </div>

        <div className="p-6 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              {displayBrand}
            </span>
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              aria-label="Close quick view"
              className="p-1.5 -mr-1.5 -mt-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 id="quick-view-title" className="text-xl font-bold text-slate-900 leading-snug mb-2">
            {displayName}
          </h2>

          <div className="flex items-center gap-3 text-xs text-slate-600 mb-4">
            <span className="flex items-center gap-1 font-semibold text-slate-800 tabular-nums">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" aria-hidden="true" />
              {formatNum(quickViewProduct.rating.toFixed(1), lang)}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {formatNum(quickViewProduct.reviewCount, lang)} {t.product.reviews}
            </span>
            <span aria-hidden="true">·</span>
            <span
              className={`font-semibold ${
                quickViewProduct.inStock ? 'text-emerald-700' : 'text-orange-600'
              }`}
            >
              {quickViewProduct.inStock ? t.product.inStock : t.product.outOfStock}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold text-emerald-900 tabular-nums">
              {formatPrice(activePrice)}
            </span>
            {activeOriginal && activeOriginal > activePrice && (
              <span className="text-sm text-slate-400 line-through tabular-nums">
                {formatPrice(activeOriginal)}
              </span>
            )}
            <span className="text-xs text-slate-500">/ {activeLabelDisplay}</span>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed mb-4">{displayDesc}</p>

          {variants && variants.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-700 mb-1.5">{t.product.selectPack}</p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v, idx) => (
                  <button
                    key={v.label}
                    type="button"
                    onClick={() => setVariantIdx(idx)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      idx === variantIdx
                        ? 'bg-emerald-700 border-emerald-700 text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-400'
                    }`}
                  >
                    {lang === 'bn' ? v.labelBn ?? v.label : v.label} · {formatPrice(v.price)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
            <span>
              {t.product.origin}: {displayOrigin}
            </span>
          </div>

          <div className="mt-auto space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-slate-300 rounded-lg h-11 shrink-0">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-9 h-full flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm font-bold tabular-nums">
                  {formatNum(qty, lang)}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="w-9 h-full flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                disabled={!quickViewProduct.inStock}
                onClick={handleAdd}
                className="flex-1 h-11 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <ShoppingCart className="w-4 h-4 text-amber-300 shrink-0" aria-hidden="true" />
                <span>{t.product.addToCart}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(quickViewProduct)}
                aria-label={saved ? t.toasts.removedWishlist : t.toasts.savedWishlist}
                className={`w-11 h-11 rounded-lg border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                  saved
                    ? 'bg-orange-600 border-orange-600 text-white'
                    : 'border-slate-300 text-slate-700 hover:border-orange-500 hover:text-orange-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
              </button>
            </div>

            <Link
              to={`/product/${quickViewProduct.id}`}
              onClick={() => setQuickViewProduct(null)}
              className="block text-center text-xs font-semibold text-emerald-800 hover:underline py-1"
            >
              {t.product.viewFullDetails}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
