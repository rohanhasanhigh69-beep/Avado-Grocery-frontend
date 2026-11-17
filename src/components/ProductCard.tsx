import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, Heart, Minus, Plus } from 'lucide-react';
import type { Product } from '../types/grocery';
import { useStore } from '../context/StoreContext';
import { getDiscountPercent } from '../utils/groceryLogic';
import { formatNum } from '../i18n/translations';
import { SafeImage } from './SafeImage';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    lang,
    t,
    addToCart,
    updateCartQuantity,
    getCartItemQuantity,
    toggleWishlist,
    isWishlisted,
    setQuickViewProduct,
    formatPrice,
  } = useStore();

  const defaultVariant =
    product.variants && product.variants.length > 0 ? product.variants[0] : null;
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);

  const activeVariant =
    product.variants && product.variants[selectedVariantIdx]
      ? product.variants[selectedVariantIdx]
      : defaultVariant;

  const activeLabel = activeVariant ? activeVariant.label : product.unit;
  const activeLabelDisplay =
    lang === 'bn'
      ? activeVariant?.labelBn ?? (activeVariant ? activeVariant.label : product.unitBn)
      : activeLabel;

  const activePrice = activeVariant ? activeVariant.price : product.price;
  const activeOriginal = activeVariant ? activeVariant.originalPrice : product.originalPrice;

  const discountPct = getDiscountPercent(activePrice, activeOriginal);
  const inCartQty = getCartItemQuantity(product.id, activeLabel);
  const wishlisted = isWishlisted(product.id);
  const displayName = lang === 'bn' ? product.nameBn : product.name;

  return (
    <article className="group bg-white rounded-xl border border-slate-100 hover:border-emerald-300/90 transition-all duration-200 hover:shadow-md flex flex-col p-3">
      {/* Pure White Cutout Packshot Stage (Chaldal-inspired) */}
      <div className="relative aspect-square bg-white rounded-lg overflow-hidden mb-2.5">
        <Link
          to={`/product/${product.id}`}
          className="block w-full h-full p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-600"
          aria-label={displayName}
        >
          <SafeImage
            src={product.image}
            alt={displayName}
            fallbackLabel={displayName}
            className="w-full h-full object-contain mix-blend-multiply brightness-[1.04] contrast-[1.05] transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Subtle status pill top-left only if discount or out of stock */}
        {!product.inStock ? (
          <span className="absolute top-1 left-1 px-2 py-0.5 rounded bg-slate-800/90 text-white text-[10px] font-semibold">
            {t.product.outOfStock}
          </span>
        ) : discountPct > 0 ? (
          <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-orange-600 text-white text-[10px] font-bold tabular-nums">
            -{formatNum(discountPct, lang)}%
          </span>
        ) : null}

        {/* Top-right Quick View & Wishlist icons */}
        <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            aria-label={`${wishlisted ? t.toasts.removedWishlist : t.toasts.savedWishlist}: ${displayName}`}
            className={`w-7 h-7 rounded-full flex items-center justify-center shadow-xs border transition-colors cursor-pointer ${
              wishlisted
                ? 'bg-orange-600 border-orange-600 text-white opacity-100'
                : 'bg-white/95 border-slate-200 text-slate-600 hover:text-orange-600 hover:border-orange-300'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-current' : ''}`} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setQuickViewProduct(product)}
            aria-label={`${t.product.quickView}: ${displayName}`}
            className="w-7 h-7 rounded-full bg-white/95 border border-slate-200 text-slate-600 hover:text-emerald-800 hover:border-emerald-400 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        {/* Chaldal-style Circular + Quick-Add Button at bottom-right of image */}
        {product.inStock && (
          <div className="absolute bottom-1.5 right-1.5">
            {inCartQty > 0 ? (
              <div className="flex items-center h-9 rounded-full bg-emerald-700 text-white shadow-md border border-emerald-800 overflow-hidden">
                <button
                  type="button"
                  onClick={() => updateCartQuantity(product.id, activeLabel, inCartQty - 1)}
                  aria-label={`Decrease quantity of ${displayName}`}
                  className="w-8 h-full flex items-center justify-center hover:bg-emerald-800 transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                <span className="px-1.5 text-xs font-bold tabular-nums min-w-[20px] text-center">
                  {formatNum(inCartQty, lang)}
                </span>
                <button
                  type="button"
                  onClick={() => updateCartQuantity(product.id, activeLabel, inCartQty + 1)}
                  aria-label={`Increase quantity of ${displayName}`}
                  className="w-8 h-full flex items-center justify-center hover:bg-emerald-800 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => addToCart(product, activeLabel, 1)}
                aria-label={`${t.product.addToBag}: ${displayName}`}
                className="w-10 h-10 rounded-full bg-white hover:bg-emerald-700 text-emerald-700 hover:text-white border border-emerald-700/35 hover:border-emerald-700 shadow-md flex items-center justify-center transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              >
                <Plus className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Price Row (Chaldal style: vivid orange/red sale price + strikethrough) */}
      <div className="flex items-baseline gap-2 mb-1">
        <span
          className={`text-base font-extrabold tabular-nums ${
            activeOriginal && activeOriginal > activePrice ? 'text-orange-600' : 'text-emerald-900'
          }`}
        >
          {formatPrice(activePrice)}
        </span>
        {activeOriginal && activeOriginal > activePrice && (
          <span className="text-xs text-slate-400 line-through tabular-nums">
            {formatPrice(activeOriginal)}
          </span>
        )}
      </div>

      {/* Product Title & Unit */}
      <Link
        to={`/product/${product.id}`}
        className="text-[13px] sm:text-sm font-medium text-slate-800 hover:text-emerald-800 transition-colors line-clamp-2 leading-snug mb-1.5"
      >
        {displayName}
      </Link>

      {/* Pack / Variant Pills or Unit Text */}
      <div className="mb-2">
        {product.variants && product.variants.length > 1 ? (
          <div className="flex flex-wrap gap-1" role="group" aria-label={t.product.selectPack}>
            {product.variants.map((variant, idx) => (
              <button
                key={variant.label}
                type="button"
                onClick={() => setSelectedVariantIdx(idx)}
                className={`px-1.5 py-0.5 text-[11px] font-medium rounded border transition-colors whitespace-nowrap cursor-pointer ${
                  idx === selectedVariantIdx
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-semibold'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                {lang === 'bn' ? variant.labelBn ?? variant.label : variant.label}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500">{activeLabelDisplay}</p>
        )}
      </div>

      {/* Bottom 1 hr delivery badge (Chaldal style) */}
      <div className="mt-auto pt-1 flex items-center justify-end">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-[11px] font-medium text-slate-600">
          <Clock className="w-3 h-3 text-emerald-700" aria-hidden="true" />
          <span>{t.product.oneHr}</span>
        </span>
      </div>
    </article>
  );
};
