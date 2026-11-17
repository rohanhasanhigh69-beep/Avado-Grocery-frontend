import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  Heart,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getDiscountPercent } from '../utils/groceryLogic';
import { formatNum } from '../i18n/translations';
import { SafeImage } from '../components/SafeImage';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    lang,
    t,
    addToCart,
    toggleWishlist,
    isWishlisted,
    recordRecentlyViewed,
    recentlyViewed,
    formatPrice,
    products,
    categories,
  } = useStore();

  const product = useMemo(() => products.find((p) => p.id === id || p.slug === id), [products, id]);

  const [variantIdx, setVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeThumbIdx, setActiveThumbIdx] = useState(0);

  useEffect(() => {
    setVariantIdx(0);
    setQuantity(1);
    setActiveThumbIdx(0);
    if (product) {
      recordRecentlyViewed(product.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product, recordRecentlyViewed]);

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{t.product.notFoundTitle}</h1>
        <p className="text-sm text-slate-600 mb-6">{t.product.notFoundDesc}</p>
        <Link
          to="/shop"
          className="px-5 py-2.5 rounded-lg bg-emerald-700 text-white text-sm font-semibold"
        >
          {t.product.backToShop}
        </Link>
      </div>
    );
  }

  const category = categories.find((c) => c.slug === product.category);
  const variants = product.variants;
  const activeVariant = variants && variants[variantIdx] ? variants[variantIdx] : null;
  const activeLabel = activeVariant ? activeVariant.label : product.unit;
  const activeLabelDisplay =
    lang === 'bn'
      ? activeVariant?.labelBn ?? (activeVariant ? activeVariant.label : product.unitBn)
      : activeLabel;
  const activePrice = activeVariant ? activeVariant.price : product.price;
  const activeOriginal = activeVariant ? activeVariant.originalPrice : product.originalPrice;
  const discountPct = getDiscountPercent(activePrice, activeOriginal);
  const saved = isWishlisted(product.id);

  const displayName = lang === 'bn' ? product.nameBn : product.name;
  const displayBrand = lang === 'bn' ? product.brandBn : product.brand;
  const displayDesc = lang === 'bn' ? product.descriptionBn : product.description;
  const displayOrigin = lang === 'bn' ? product.originBn : product.origin;
  const displayShelf = lang === 'bn' ? product.shelfLifeBn : product.shelfLife;
  const categoryName = category ? (lang === 'bn' ? category.nameBn : category.name) : '';

  const galleryViews =
    product.secondaryImages && product.secondaryImages.length > 0
      ? [
          { label: t.product.productFocus, src: product.image, scale: 'scale-100' },
          ...product.secondaryImages.map((imgSrc, i) => ({
            label: `${lang === 'bn' ? 'অতিরিক্ত ছবি' : 'Gallery view'} ${i + 1}`,
            src: imgSrc,
            scale: 'scale-100',
          })),
        ]
      : [
          { label: t.product.productFocus, src: product.image, scale: 'scale-100' },
          { label: t.product.fullView, src: product.image, scale: 'scale-110' },
          { label: t.product.aisleContext, src: category?.image ?? product.image, scale: 'scale-100' },
        ];

  const activeView = galleryViews[activeThumbIdx] ?? galleryViews[0];

  const relatedProducts = products.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const recentProducts = recentlyViewed
    .filter((rid) => rid !== product.id)
    .map((rid) => products.find((p) => p.id === rid))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 4);

  const handleBuyNow = () => {
    addToCart(product, activeLabel, quantity);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-8">
      <nav
        className="text-xs text-slate-500 mb-6 flex flex-wrap items-center gap-1.5"
        aria-label="Breadcrumb"
      >
        <Link to="/" className="hover:text-emerald-800">
          {t.nav.home}
        </Link>
        <span>/</span>
        {category && (
          <>
            <Link to={`/category/${category.slug}`} className="hover:text-emerald-800">
              {categoryName}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-slate-900 font-medium truncate">{displayName}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Gallery */}
        <div className="lg:col-span-6 lg:sticky lg:top-20 space-y-3">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-slate-200 p-6 flex items-center justify-center">
            <SafeImage
              src={activeView.src}
              alt={displayName}
              priority
              className={`w-full h-full object-contain mix-blend-multiply transition-transform ${activeView.scale}`}
            />
            {discountPct > 0 && (
              <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-orange-600 text-white text-xs font-bold tabular-nums">
                {t.product.save} {formatNum(discountPct, lang)}%
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {galleryViews.map((view, idx) => (
              <button
                key={view.label}
                type="button"
                onClick={() => setActiveThumbIdx(idx)}
                className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 bg-white p-2 transition-all cursor-pointer ${
                  idx === activeThumbIdx
                    ? 'border-emerald-700 ring-2 ring-emerald-200'
                    : 'border-slate-200 opacity-80 hover:opacity-100'
                }`}
                aria-label={view.label}
              >
                <SafeImage
                  src={view.src}
                  alt={`${displayName} — ${view.label}`}
                  className={`w-full h-full object-contain mix-blend-multiply ${view.scale}`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Purchase Module */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
          <div>
            <div className="flex items-center justify-between gap-2 text-xs mb-2">
              <Link
                to={`/shop?brand=${encodeURIComponent(product.brand)}`}
                className="font-bold uppercase tracking-wider text-emerald-700 hover:underline"
              >
                {displayBrand}
              </Link>
              <span
                className={`font-semibold ${
                  product.inStock ? 'text-emerald-700' : 'text-orange-600'
                }`}
              >
                {product.inStock
                  ? `${t.product.inStock} (${formatNum(product.stockCount, lang)} ${t.product.inStockCount})`
                  : t.product.outOfStock}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug mb-2">
              {displayName}
            </h1>

            <div className="flex items-center gap-3 text-xs text-slate-600">
              <span className="flex items-center gap-1 font-bold text-slate-900 tabular-nums">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" aria-hidden="true" />
                {formatNum(product.rating.toFixed(1), lang)}
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                {formatNum(product.reviewCount, lang)} {t.product.verifiedRatings}
              </span>
              <span aria-hidden="true">·</span>
              <span>{categoryName}</span>
            </div>
          </div>

          <div className="py-4 border-y border-slate-100 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-emerald-900 tabular-nums">
              {formatPrice(activePrice)}
            </span>
            {activeOriginal && activeOriginal > activePrice && (
              <span className="text-base text-slate-400 line-through tabular-nums">
                {formatPrice(activeOriginal)}
              </span>
            )}
            <span className="text-sm text-slate-500">/ {activeLabelDisplay}</span>
          </div>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{displayDesc}</p>

          {variants && variants.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                {t.product.choosePack}
              </p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v, idx) => (
                  <button
                    key={v.label}
                    type="button"
                    onClick={() => setVariantIdx(idx)}
                    className={`px-3.5 py-2 rounded-xl border text-sm font-semibold transition-colors cursor-pointer ${
                      idx === variantIdx
                        ? 'bg-emerald-700 border-emerald-700 text-white'
                        : 'bg-white border-slate-300 text-slate-800 hover:border-emerald-500'
                    }`}
                  >
                    {lang === 'bn' ? v.labelBn ?? v.label : v.label} ·{' '}
                    <span className="tabular-nums">{formatPrice(v.price)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center border border-slate-300 rounded-xl h-12">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-11 h-full flex items-center justify-center text-slate-700 hover:bg-slate-50 rounded-l-xl cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold tabular-nums">
                  {formatNum(quantity, lang)}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="w-11 h-full flex items-center justify-center text-slate-700 hover:bg-slate-50 rounded-r-xl cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                disabled={!product.inStock}
                onClick={() => addToCart(product, activeLabel, quantity)}
                className="flex-1 min-w-[160px] h-12 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-amber-300" aria-hidden="true" />
                <span>{t.product.addToCart}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label={saved ? t.toasts.removedWishlist : t.toasts.savedWishlist}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                  saved
                    ? 'bg-orange-600 border-orange-600 text-white'
                    : 'border-slate-300 text-slate-700 hover:border-orange-500 hover:text-orange-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
              </button>
            </div>

            {product.inStock && (
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full h-11 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold transition-colors cursor-pointer"
              >
                {t.product.orderNow} · {formatPrice(activePrice * quantity)}
              </button>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold text-slate-900">{t.product.origin}</p>
                <p>{displayOrigin}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50">
              <Clock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold text-slate-900">{t.product.freshnessStorage}</p>
                <p>{displayShelf}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/60">
              <Truck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold text-slate-900">{t.product.dispatchTitle}</p>
                <p>{t.product.dispatchDesc}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/60">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold text-slate-900">{t.product.qualityTitle}</p>
                <p className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                  {t.product.qualityDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-14 pt-10 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t.product.relatedTitle}
            </h2>
            {category && (
              <Link
                to={`/category/${category.slug}`}
                className="text-sm font-semibold text-emerald-800 hover:underline"
              >
                {t.product.moreIn} {lang === 'bn' ? category.shortNameBn : category.shortName} →
              </Link>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}

      {recentProducts.length > 0 && (
        <section className="mt-12 pt-10 border-t border-slate-200">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
            {t.home.recentTitle}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {recentProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
