import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Filter, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import type { CategorySlug, SortOption, UnitType } from '../types/grocery';
import { filterAndSortProducts } from '../utils/groceryLogic';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { formatNum } from '../i18n/translations';

interface ShopPageProps {
  dealsMode?: boolean;
}

const UNIT_VALUES: UnitType[] = ['kg', 'gram', 'litre', 'ml', 'packet', 'piece', 'dozen'];

export const ShopPage: React.FC<ShopPageProps> = ({ dealsMode = false }) => {
  const { lang, t, formatPrice, products, categories } = useStore();
  const { slug } = useParams<{ slug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get('q') ?? '';
  const initialBrand = searchParams.get('brand') ?? '';
  const initialSort =
    (searchParams.get('sort') as SortOption | null) ?? (dealsMode ? 'discount' : 'popular');

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | 'all'>(
    (slug as CategorySlug) ?? 'all'
  );
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    initialBrand ? [initialBrand] : []
  );
  const [selectedUnits, setSelectedUnits] = useState<UnitType[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<SortOption>(initialSort);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setSelectedCategory((slug as CategorySlug) ?? 'all');
  }, [slug]);

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '');
    const b = searchParams.get('brand');
    setSelectedBrands(b ? [b] : []);
    const s = searchParams.get('sort') as SortOption | null;
    if (s) setSort(s);
  }, [searchParams]);

  const allBrands = useMemo(
    () =>
      Array.from(new Set(products.map((p) => p.brand)))
        .sort()
        .map((brand) => ({
          value: brand,
          label: products.find((p) => p.brand === brand)?.brandBn ?? brand,
        })),
    [products]
  );

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);

  const filteredProducts = useMemo(
    () =>
      filterAndSortProducts(products, {
        query,
        category: selectedCategory,
        minPrice: minPrice ? Number(minPrice) : null,
        maxPrice: maxPrice ? Number(maxPrice) : null,
        brands: selectedBrands,
        unitTypes: selectedUnits,
        inStockOnly,
        minRating,
        dealsOnly: dealsMode,
        sort,
      }),
    [
      products,
      query,
      selectedCategory,
      minPrice,
      maxPrice,
      selectedBrands,
      selectedUnits,
      inStockOnly,
      minRating,
      dealsMode,
      sort,
    ]
  );

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleUnit = (unit: UnitType) => {
    setSelectedUnits((prev) =>
      prev.includes(unit) ? prev.filter((u) => u !== unit) : [...prev, unit]
    );
  };

  const resetFilters = () => {
    setQuery('');
    if (!slug) setSelectedCategory('all');
    setMinPrice('');
    setMaxPrice('');
    setSelectedBrands([]);
    setSelectedUnits([]);
    setInStockOnly(false);
    setMinRating(0);
    setSort(dealsMode ? 'discount' : 'popular');
    setSearchParams({});
  };

  const pageTitle = dealsMode
    ? t.shop.dealsTitle
    : activeCategoryObj
    ? lang === 'bn'
      ? activeCategoryObj.nameBn
      : activeCategoryObj.name
    : t.shop.allGroceries;

  const pageSubtitle = dealsMode
    ? t.shop.dealsSubtitle
    : activeCategoryObj
    ? lang === 'bn'
      ? activeCategoryObj.descriptionBn
      : activeCategoryObj.description
    : t.shop.allSubtitle;

  const filterSidebarContent = (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          {t.shop.categoriesLabel}
        </h3>
        <div className="space-y-1">
          <Link
            to={dealsMode ? '/deals' : '/shop'}
            onClick={() => {
              setSelectedCategory('all');
              setMobileFiltersOpen(false);
            }}
            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-emerald-700 text-white font-semibold'
                : 'text-slate-700 hover:bg-emerald-50'
            }`}
          >
            {t.shop.allCategories}
          </Link>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.slug);
                setMobileFiltersOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between cursor-pointer ${
                selectedCategory === cat.slug
                  ? 'bg-emerald-700 text-white font-semibold'
                  : 'text-slate-700 hover:bg-emerald-50'
              }`}
            >
              <span>{lang === 'bn' ? cat.nameBn : cat.name}</span>
              <span className="text-xs opacity-75 tabular-nums">
                {formatNum(products.filter((p) => p.category === cat.slug).length, lang)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="pt-4 border-t border-slate-200">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          {t.shop.priceRangeLabel}
        </h3>
        <div className="grid grid-cols-2 gap-2 mb-2.5">
          <div>
            <label htmlFor="filter-min-price" className="text-[11px] text-slate-500 block mb-1">
              {t.shop.minLabel}
            </label>
            <input
              id="filter-min-price"
              type="number"
              min={0}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              className="w-full h-9 px-2.5 rounded-lg border border-slate-300 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
          <div>
            <label htmlFor="filter-max-price" className="text-[11px] text-slate-500 block mb-1">
              {t.shop.maxLabel}
            </label>
            <input
              id="filter-max-price"
              type="number"
              min={0}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="2000"
              className="w-full h-9 px-2.5 rounded-lg border border-slate-300 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: t.shop.under150, min: '', max: '150' },
            { label: t.shop.midRange, min: '150', max: '400' },
            { label: t.shop.above400, min: '400', max: '' },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setMinPrice(preset.min);
                setMaxPrice(preset.max);
              }}
              className="px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 hover:border-emerald-500 text-xs font-medium text-slate-700 cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Availability & Rating */}
      <div className="pt-4 border-t border-slate-200 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {t.shop.availabilityRating}
        </h3>
        <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
          />
          <span>{t.shop.inStockOnly}</span>
        </label>

        <div>
          <label htmlFor="filter-rating" className="block text-xs text-slate-600 mb-1">
            {t.shop.minRating}
          </label>
          <select
            id="filter-rating"
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="w-full h-9 px-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value={0}>{t.shop.allRatings}</option>
            <option value={4.5}>{t.shop.rating45}</option>
            <option value={4.8}>{t.shop.rating48}</option>
          </select>
        </div>
      </div>

      {/* Weight / Unit */}
      <div className="pt-4 border-t border-slate-200">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          {t.shop.weightUnit}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {UNIT_VALUES.map((u) => {
            const active = selectedUnits.includes(u);
            return (
              <button
                key={u}
                type="button"
                onClick={() => toggleUnit(u)}
                className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-emerald-700 border-emerald-700 text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-400'
                }`}
              >
                {t.units[u] ?? u}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brands */}
      <div className="pt-4 border-t border-slate-200">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          {t.shop.brandsLabel}
        </h3>
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {allBrands.map((b) => (
            <label key={b.value} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedBrands.includes(b.value)}
                onChange={() => toggleBrand(b.value)}
                className="w-4 h-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
              />
              <span className="truncate">{lang === 'bn' ? b.label : b.value}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={resetFilters}
        className="w-full h-10 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
        <span>{t.shop.resetFilters}</span>
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-8">
      <div className="mb-6 pb-6 border-b border-slate-200 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <nav className="text-xs text-slate-500 mb-2 flex items-center gap-1.5" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-emerald-800">
              {t.nav.home}
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">{pageTitle}</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">{pageSubtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen((prev) => !prev)}
            className="lg:hidden h-10 px-3.5 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-800 flex items-center gap-2 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
            <span>{t.shop.filtersBtn}</span>
          </button>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <label htmlFor="shop-search-input" className="sr-only">
              {t.nav.searchBtn}
            </label>
            <input
              id="shop-search-input"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.shop.filterSearchPlaceholder}
              className="h-10 pl-9 pr-3 w-52 sm:w-64 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label htmlFor="shop-sort-select" className="sr-only">
              Sort
            </label>
            <select
              id="shop-sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="h-10 px-3 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="popular">{t.shop.sortPopular}</option>
              <option value="price-asc">{t.shop.sortPriceAsc}</option>
              <option value="price-desc">{t.shop.sortPriceDesc}</option>
              <option value="discount">{t.shop.sortDiscount}</option>
              <option value="newest">{t.shop.sortNewest}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <aside className="hidden lg:block lg:col-span-3 bg-white p-5 rounded-xl border border-slate-200 sticky top-20">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-700" aria-hidden="true" />
              <span>{t.shop.filterCatalog}</span>
            </span>
            <span className="text-xs text-slate-500 tabular-nums">
              {formatNum(filteredProducts.length, lang)} {t.shop.foundLabel}
            </span>
          </div>
          {filterSidebarContent}
        </aside>

        {mobileFiltersOpen && (
          <div className="lg:hidden bg-white p-5 rounded-xl border border-slate-200 mb-4">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-900">{t.shop.filterProducts}</span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="p-1 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterSidebarContent}
          </div>
        )}

        <div className="lg:col-span-9">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 text-xs text-slate-600">
            <p className="tabular-nums">
              {t.shop.showingOf}{' '}
              <strong className="text-slate-900">{formatNum(filteredProducts.length, lang)}</strong> /{' '}
              {formatNum(products.length, lang)} {t.shop.productsWord}
              {query && (
                <span>
                  {' '}
                  {t.shop.forWord} &ldquo;<strong className="text-emerald-800">{query}</strong>&rdquo;
                </span>
              )}
              {(minPrice || maxPrice) && (
                <span>
                  {' '}
                  · {minPrice ? formatPrice(Number(minPrice)) : formatPrice(0)} –{' '}
                  {maxPrice ? formatPrice(Number(maxPrice)) : '∞'}
                </span>
              )}
            </p>
            {(query ||
              selectedCategory !== 'all' ||
              minPrice ||
              maxPrice ||
              selectedBrands.length > 0 ||
              selectedUnits.length > 0 ||
              inStockOnly ||
              minRating > 0) && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-emerald-800 font-semibold hover:underline cursor-pointer"
              >
                {t.shop.clearFilters}
              </button>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
              <p className="text-lg font-bold text-slate-900 mb-1">{t.shop.emptyTitle}</p>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">{t.shop.emptyDesc}</p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold cursor-pointer"
              >
                {t.shop.showAllBtn}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
