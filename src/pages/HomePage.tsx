import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Clock,
  Mail,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import { FEATURED_BRANDS } from '../data/brands';
import { ProductCard } from '../components/ProductCard';
import { SafeImage } from '../components/SafeImage';
import { useStore } from '../context/StoreContext';
import type { Product } from '../types/grocery';

interface AisleSectionProps {
  title: string;
  subtitle: string;
  viewAllTo: string;
  viewAllLabel: string;
  products: Product[];
  tintClass?: string;
}

const AisleSection: React.FC<AisleSectionProps> = ({
  title,
  subtitle,
  viewAllTo,
  viewAllLabel,
  products,
  tintClass = 'bg-white',
}) => {
  if (products.length === 0) return null;
  return (
    <section className={`py-8 sm:py-10 ${tintClass}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{subtitle}</p>
          </div>
          <Link
            to={viewAllTo}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-orange-600 transition-colors whitespace-nowrap shrink-0"
          >
            <span>{viewAllLabel}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export const HomePage: React.FC = () => {
  const {
    lang,
    t,
    categories,
    products,
    coupons,
    siteMedia,
    catalogLoading,
    recentlyViewed,
    applyCoupon,
    pushToast,
    formatPrice,
  } = useStore();
  const navigate = useNavigate();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'error' | 'subscribed'>('idle');

  const flashDeals = useMemo(() => {
    const curated = [
      products.find((p) => p.id === 'fr-01'),
      products.find((p) => p.id === 'vg-02'),
      products.find((p) => p.id === 'fm-01'),
      products.find((p) => p.id === 'os-02'),
      products.find((p) => p.id === 'de-02'),
      products.find((p) => p.id === 'sb-03'),
      products.find((p) => p.id === 'cc-02'),
      products.find((p) => p.id === 'hh-02'),
    ].filter((p): p is Product => Boolean(p));
    const extraFlash = products.filter(
      (p) => p.isFlashDeal && !curated.some((c) => c.id === p.id)
    );
    return [...extraFlash, ...curated].slice(0, 8);
  }, [products]);

  const bestSellers = useMemo(() => {
    const curated = [
      products.find((p) => p.id === 'rg-01'),
      products.find((p) => p.id === 'os-01'),
      products.find((p) => p.id === 'de-01'),
      products.find((p) => p.id === 'de-06'),
      products.find((p) => p.id === 'fm-06'),
      products.find((p) => p.id === 'bv-01'),
      products.find((p) => p.id === 'sp-02'),
      products.find((p) => p.id === 'cc-01'),
    ].filter((p): p is Product => Boolean(p));
    const extraBest = products.filter(
      (p) => p.isBestSeller && !curated.some((c) => c.id === p.id)
    );
    return [...extraBest, ...curated].slice(0, 8);
  }, [products]);

  const fruitsAndVeg = useMemo(
    () =>
      [
        products.find((p) => p.id === 'fr-01'),
        products.find((p) => p.id === 'fr-02'),
        products.find((p) => p.id === 'vg-01'),
        products.find((p) => p.id === 'vg-03'),
      ].filter((p): p is Product => Boolean(p)),
    [products]
  );

  const meatAndFish = useMemo(
    () =>
      [
        products.find((p) => p.id === 'fm-01'),
        products.find((p) => p.id === 'fm-02'),
        products.find((p) => p.id === 'fm-06'),
        products.find((p) => p.id === 'fm-08'),
      ].filter((p): p is Product => Boolean(p)),
    [products]
  );

  const dairyAndEggs = useMemo(
    () =>
      [
        products.find((p) => p.id === 'de-01'),
        products.find((p) => p.id === 'de-02'),
        products.find((p) => p.id === 'de-03'),
        products.find((p) => p.id === 'de-06'),
      ].filter((p): p is Product => Boolean(p)),
    [products]
  );

  const riceOilEssentials = useMemo(
    () =>
      [
        products.find((p) => p.id === 'rg-01'),
        products.find((p) => p.id === 'rg-05'),
        products.find((p) => p.id === 'os-01'),
        products.find((p) => p.id === 'os-02'),
      ].filter((p): p is Product => Boolean(p)),
    [products]
  );

  const snacksAndBeverages = useMemo(
    () =>
      [
        products.find((p) => p.id === 'sb-01'),
        products.find((p) => p.id === 'sb-03'),
        products.find((p) => p.id === 'bv-01'),
        products.find((p) => p.id === 'bv-03'),
      ].filter((p): p is Product => Boolean(p)),
    [products]
  );

  const saucesAndCandy = useMemo(
    () =>
      [
        products.find((p) => p.id === 'sp-01'),
        products.find((p) => p.id === 'sp-02'),
        products.find((p) => p.id === 'cc-01'),
        products.find((p) => p.id === 'cc-02'),
      ].filter((p): p is Product => Boolean(p)),
    [products]
  );

  const householdCare = useMemo(
    () => products.filter((p) => p.category === 'household').slice(0, 4),
    [products]
  );

  const recentProducts = useMemo(
    () =>
      recentlyViewed
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p))
        .slice(0, 4),
    [recentlyViewed, products]
  );

  const seasonalPromoCoupon = useMemo(
    () => coupons.find((c) => c.code === 'FRESH15') ?? coupons[0] ?? null,
    [coupons]
  );

  const handleApplySeasonalCode = async () => {
    if (!seasonalPromoCoupon) {
      navigate('/deals');
      return;
    }
    const res = await applyCoupon(seasonalPromoCoupon.code);
    if (!res.ok) {
      pushToast({
        title: t.home.couponReadyTitle,
        detail: res.message || t.home.couponReadyDetail,
        tone: 'info',
      });
    }
    navigate('/shop');
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = newsletterEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) {
      setNewsletterStatus('error');
      return;
    }
    setNewsletterStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleaned }),
      });
      if (!res.ok) {
        setNewsletterStatus('error');
        return;
      }
      setNewsletterStatus('subscribed');
      setNewsletterEmail('');
      pushToast({
        title: t.brandName,
        detail: t.home.newsletterSuccess,
        tone: 'success',
      });
    } catch {
      setNewsletterStatus('error');
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-emerald-50/60 to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-7 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch">
            {/* Hero Copy */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-xs sm:text-sm font-semibold text-emerald-800 tracking-wide mb-2.5">
                {t.hero.locationBadge}
              </p>
              <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 tracking-tight leading-[1.16] text-balance mb-3.5">
                {t.hero.headline}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mb-6">
                {t.hero.subcopy}
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Link
                  to="/shop"
                  className="px-5 sm:px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-300" aria-hidden="true" />
                  <span>{t.hero.ctaShop}</span>
                </Link>
                <Link
                  to="/deals"
                  className="px-5 sm:px-6 py-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-sm font-bold transition-colors whitespace-nowrap shrink-0"
                >
                  {t.hero.ctaDeals}
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-slate-600 pt-3 border-t border-slate-200/70">
                <span>
                  {t.hero.freeDeliveryNote}{' '}
                  <strong className="text-slate-900 tabular-nums">{formatPrice(1500)}</strong>
                </span>
                <span aria-hidden="true" className="text-slate-300">
                  ·
                </span>
                <span>
                  {t.hero.helplineLabel}{' '}
                  <a
                    href="tel:01722371905"
                    className="font-semibold text-emerald-800 hover:underline tabular-nums"
                  >
                    {lang === 'bn' ? '০১৭২২৩৭১৯০৫' : '01722371905'}
                  </a>
                </span>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="lg:col-span-6">
              <div className="relative h-60 sm:h-76 lg:h-full min-h-[300px] rounded-2xl overflow-hidden border border-slate-200 bg-emerald-100/60 shadow-sm">
                {siteMedia?.heroBannerUrl ? (
                  <SafeImage
                    src={siteMedia.heroBannerUrl}
                    alt={t.hero.headline}
                    priority
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-50 animate-pulse" />
                )}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 bg-gradient-to-t from-slate-950/80 via-slate-950/35 to-transparent text-white flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-amber-300">{t.hero.coldChainBadge}</p>
                    <p className="text-sm sm:text-base font-bold">{t.hero.expressBadge}</p>
                  </div>
                  <Link
                    to="/category/fruits"
                    className="px-3.5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold whitespace-nowrap shrink-0 transition-colors"
                  >
                    {t.hero.browseHarvest}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 4-Column Service Guarantee Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-7 pt-6 border-t border-slate-200/70">
            <div className="flex items-start gap-2.5">
              <Truck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  {t.hero.guarantees.deliveryTitle}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  {t.hero.guarantees.deliveryDesc}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  {t.hero.guarantees.freshTitle}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  {t.hero.guarantees.freshDesc}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Tag className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  {t.hero.guarantees.savingsTitle}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  {t.hero.guarantees.savingsDesc}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  {t.hero.guarantees.hoursTitle}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  {t.hero.guarantees.hoursDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chaldal-Style Borderless Pure-White Cutout Categories Section */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {t.home.categoryHeading}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{t.home.categorySubtitle}</p>
            </div>
            <Link
              to="/shop"
              className="text-sm font-semibold text-emerald-800 hover:text-orange-600 inline-flex items-center gap-1 whitespace-nowrap"
            >
              <span>{t.home.allItemsLink}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-7">
            {catalogLoading && categories.length === 0
              ? Array.from({ length: 12 }).map((_, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <div className="w-full aspect-[4/3] rounded-xl bg-slate-100 animate-pulse" />
                    <div className="w-20 h-3.5 rounded bg-slate-100 animate-pulse" />
                  </div>
                ))
              : categories.map((category) => (
                  <Link
                    key={category.slug}
                    to={`/category/${category.slug}`}
                    className="group flex flex-col items-center text-center bg-white"
                  >
                    <div className="w-full aspect-[4/3] bg-white flex items-center justify-center p-1 overflow-hidden">
                      <SafeImage
                        src={category.image}
                        alt={lang === 'bn' ? category.nameBn : category.name}
                        className="w-full h-full object-contain mix-blend-multiply brightness-[1.04] contrast-[1.05] transition-transform duration-300 group-hover:scale-108"
                      />
                    </div>
                    <span className="mt-2 text-xs sm:text-sm font-medium text-slate-800 group-hover:text-emerald-800 transition-colors leading-snug">
                      {lang === 'bn' ? category.nameBn : category.shortName}
                    </span>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* Flash Sales (Chaldal Pure White Cutout Grid) */}
      <AisleSection
        title={t.home.flashTitle}
        subtitle={t.home.flashSubtitle}
        viewAllTo="/deals"
        viewAllLabel={t.home.viewAll}
        products={flashDeals}
        tintClass="bg-white border-t border-slate-100"
      />

      {/* Best Selling Products */}
      <AisleSection
        title={t.home.bestTitle}
        subtitle={t.home.bestSubtitle}
        viewAllTo="/shop?sort=popular"
        viewAllLabel={t.home.viewAll}
        products={bestSellers}
        tintClass="bg-slate-50/60 border-y border-slate-100"
      />

      {/* Fresh Fruits & Vegetables */}
      <AisleSection
        title={t.home.fruitsVegTitle}
        subtitle={t.home.fruitsVegSubtitle}
        viewAllTo="/category/fruits"
        viewAllLabel={t.home.viewAll}
        products={fruitsAndVeg}
      />

      {/* Dairy & Eggs (4 completely distinct pure-white cutouts!) */}
      <AisleSection
        title={t.home.dairyEggsTitle}
        subtitle={t.home.dairyEggsSubtitle}
        viewAllTo="/category/dairy-eggs"
        viewAllLabel={t.home.viewAll}
        products={dairyAndEggs}
        tintClass="bg-emerald-50/35 border-y border-emerald-100/70"
      />

      {/* Meat, Fish & Seafood */}
      <AisleSection
        title={t.home.meatFishTitle}
        subtitle={t.home.meatFishSubtitle}
        viewAllTo="/category/fish-meat"
        viewAllLabel={t.home.viewAll}
        products={meatAndFish}
      />

      {/* Mid-Page Promotional Banner */}
      <section className="py-6 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="rounded-2xl overflow-hidden bg-emerald-900 text-white grid grid-cols-1 lg:grid-cols-12 border border-emerald-800">
            <div className="lg:col-span-6 p-7 sm:p-10 flex flex-col justify-center">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                {t.home.promoBadge}
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight text-balance mb-3">
                {t.home.promoHeadline}
              </h2>
              <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed mb-6 max-w-lg">
                {seasonalPromoCoupon ? (
                  <>
                    {t.home.promoBodyPrefix}{' '}
                    <strong className="text-amber-300">{seasonalPromoCoupon.code}</strong>{' '}
                    {t.home.promoBodyMid}{' '}
                    <span className="tabular-nums font-semibold">
                      {formatPrice(seasonalPromoCoupon.minSubtotal || 1800)}
                    </span>{' '}
                    {t.home.promoBodySuffix}
                  </>
                ) : (
                  t.home.flashSubtitle
                )}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => void handleApplySeasonalCode()}
                  className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
                >
                  {seasonalPromoCoupon
                    ? lang === 'bn'
                      ? `কোড ${seasonalPromoCoupon.code} ব্যবহার করুন`
                      : `Use Code ${seasonalPromoCoupon.code}`
                    : t.hero.ctaDeals}
                </button>
                <Link
                  to="/category/oil-spices"
                  className="px-5 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  {t.home.promoCtaBrowse}
                </Link>
              </div>
            </div>
            <div className="lg:col-span-6 h-56 sm:h-72 lg:h-auto bg-emerald-800">
              {siteMedia?.promoHarvestUrl ? (
                <SafeImage
                  src={siteMedia.promoHarvestUrl}
                  alt={t.home.promoHeadline}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-emerald-800/70 animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Rice, Oil & Essential Grocery */}
      <AisleSection
        title={t.home.riceOilTitle}
        subtitle={t.home.riceOilSubtitle}
        viewAllTo="/category/rice-grains"
        viewAllLabel={t.home.viewAll}
        products={riceOilEssentials}
      />

      {/* Sauces, Pickles & Chocolates */}
      <AisleSection
        title={t.home.saucesCandyTitle}
        subtitle={t.home.saucesCandySubtitle}
        viewAllTo="/category/sauces-pickles"
        viewAllLabel={t.home.viewAll}
        products={saucesAndCandy}
        tintClass="bg-amber-50/35 border-y border-amber-100/80"
      />

      {/* Snacks & Beverages */}
      <AisleSection
        title={t.home.snacksBevTitle}
        subtitle={t.home.snacksBevSubtitle}
        viewAllTo="/category/snacks-bakery"
        viewAllLabel={t.home.viewAll}
        products={snacksAndBeverages}
      />

      {/* Household & Personal Care */}
      <AisleSection
        title={t.home.householdTitle}
        subtitle={t.home.householdSubtitle}
        viewAllTo="/category/household"
        viewAllLabel={t.home.viewAll}
        products={householdCare}
        tintClass="bg-slate-50/70 border-t border-slate-100"
      />

      {/* Recently Viewed */}
      {recentProducts.length > 0 && (
        <AisleSection
          title={t.home.recentTitle}
          subtitle={t.home.recentSubtitle}
          viewAllTo="/shop"
          viewAllLabel={t.home.viewAll}
          products={recentProducts}
        />
      )}

      {/* Featured Brands Section */}
      <section className="py-10 sm:py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {t.home.brandsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">{t.home.brandsSubtitle}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {FEATURED_BRANDS.map((brand) => (
              <Link
                key={brand.name}
                to={`/shop?brand=${encodeURIComponent(brand.name)}`}
                className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-colors"
              >
                <p className="text-sm font-bold text-slate-900">
                  {lang === 'bn' ? brand.nameBn : brand.name}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {lang === 'bn' ? brand.specialtyBn : brand.specialty}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 bg-emerald-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            {t.home.newsletterTitle}
          </h2>
          <p className="text-sm sm:text-base text-emerald-100/90 max-w-xl mx-auto mb-6">
            {t.home.newsletterSubtitle}
          </p>

          {newsletterStatus === 'subscribed' ? (
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-800 border border-emerald-700 text-amber-300 text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
              <span>{t.home.newsletterSuccess}</span>
            </div>
          ) : (
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto"
              noValidate
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={newsletterEmail}
                onChange={(e) => {
                  setNewsletterEmail(e.target.value);
                  if (newsletterStatus === 'error') setNewsletterStatus('idle');
                }}
                placeholder={t.home.newsletterPlaceholder}
                className="flex-1 h-12 px-4 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
              <button
                type="submit"
                disabled={newsletterStatus === 'loading'}
                className="h-12 px-6 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {newsletterStatus === 'loading'
                  ? lang === 'bn'
                    ? 'সাবস্ক্রাইব হচ্ছে...'
                    : 'Subscribing...'
                  : t.home.newsletterBtn}
              </button>
            </form>
          )}
          {newsletterStatus === 'error' && (
            <p className="text-xs text-amber-300 mt-2">{t.home.newsletterError}</p>
          )}
        </div>
      </section>
    </div>
  );
};
