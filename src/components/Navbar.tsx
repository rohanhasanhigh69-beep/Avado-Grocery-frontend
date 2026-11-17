import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
  Leaf,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatNum } from '../i18n/translations';

export const Navbar: React.FC = () => {
  const {
    lang,
    setLang,
    t,
    cartSummary,
    wishlist,
    setIsCartOpen,
    setIsAccountOpen,
    isSidebarOpen,
    setIsSidebarOpen,
    formatPrice,
    categories,
  } = useStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    navigate(trimmed ? `/shop?q=${encodeURIComponent(trimmed)}` : '/shop');
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 pb-0.5 border-b-2 ${
      isActive
        ? 'text-emerald-800 border-emerald-700'
        : 'text-slate-700 border-transparent hover:text-emerald-800 hover:border-emerald-300'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 h-16 flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Left: Category Sidebar Hamburger + Brand Logo */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0 min-w-0">
          {/* Desktop Category Sidebar Toggle */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={t.nav.sidebarTitle}
            aria-expanded={isSidebarOpen}
            className="hidden lg:flex w-9 h-9 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-1 text-slate-700 hover:text-emerald-800 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 w-8 h-8 flex items-center justify-center shrink-0"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm sm:text-xl font-bold tracking-tight text-emerald-900 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-md"
          >
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-700 text-amber-300 flex items-center justify-center shrink-0">
              <Leaf className="w-4 h-4" aria-hidden="true" />
            </span>
            <span className="font-display">{t.brandName}</span>
          </Link>
        </div>

        {/* Center-Left Nav Links (xl+ or lg) */}
        <nav className="hidden lg:flex items-center gap-5 shrink-0" aria-label="Primary navigation">
          <NavLink to="/" end className={navLinkClass}>
            {t.nav.home}
          </NavLink>
          <NavLink to="/shop" className={navLinkClass}>
            {t.nav.shop}
          </NavLink>
          <NavLink to="/deals" className={navLinkClass}>
            {t.nav.deals}
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            {t.nav.contact}
          </NavLink>
        </nav>

        {/* Center-Right Search Bar (Desktop) */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-sm items-center bg-slate-100 hover:bg-slate-100/80 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-600 rounded-lg px-3 h-10 transition-all border border-slate-200 focus-within:border-emerald-600"
        >
          <Search className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
          <label htmlFor="navbar-desktop-search" className="sr-only">
            {t.nav.searchBtn}
          </label>
          <input
            id="navbar-desktop-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.nav.searchPlaceholder}
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-500 pl-2 focus:outline-none"
          />
        </form>

        {/* Right Controls: ENG | বাং Switcher + Search(mobile) + Account + Wishlist + Cart */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* ENG | বাং Bilingual Language Toggle */}
          <div
            className="inline-flex items-center rounded-lg border border-emerald-700/30 bg-emerald-50 p-0.5 shrink-0"
            role="group"
            aria-label="Language switcher"
          >
            <button
              type="button"
              onClick={() => setLang('en')}
              aria-pressed={lang === 'en'}
              data-testid="lang-en"
              className={`px-1.5 sm:px-2.5 h-7 rounded-md text-[11px] sm:text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                lang === 'en'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-900 hover:bg-emerald-100'
              }`}
            >
              ENG
            </button>
            <button
              type="button"
              onClick={() => setLang('bn')}
              aria-pressed={lang === 'bn'}
              data-testid="lang-bn"
              className={`px-1.5 sm:px-2.5 h-7 rounded-md text-[11px] sm:text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                lang === 'bn'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-emerald-900 hover:bg-emerald-100'
              }`}
            >
              বাং
            </button>
          </div>

          <button
            type="button"
            onClick={() => setSearchOpen((prev) => !prev)}
            aria-label={t.nav.searchBtn}
            aria-expanded={searchOpen}
            className="md:hidden p-1 text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors w-8 h-8 flex items-center justify-center shrink-0"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setIsAccountOpen(true)}
            aria-label={t.nav.accountAria}
            className="hidden sm:flex p-1.5 text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors w-9 h-9 items-center justify-center cursor-pointer shrink-0"
          >
            <User className="w-4.5 h-4.5" aria-hidden="true" />
          </button>

          <Link
            to="/wishlist"
            aria-label={`${t.nav.wishlistAria} (${wishlist.length})`}
            className="relative p-1 sm:p-1.5 text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0"
          >
            <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5" aria-hidden="true" />
            {wishlist.length > 0 && (
              <span className="absolute top-0 right-0 min-w-[15px] h-[15px] px-0.5 rounded-full bg-orange-600 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                {formatNum(wishlist.length, lang)}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            aria-label={`${t.nav.cartAria} (${cartSummary.totalQuantity})`}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 h-8 sm:h-9 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" aria-hidden="true" />
            <span className="tabular-nums">{formatNum(cartSummary.totalQuantity, lang)}</span>
            <span className="hidden sm:inline text-emerald-200" aria-hidden="true">
              ·
            </span>
            <span className="hidden sm:inline tabular-nums">{formatPrice(cartSummary.subtotal)}</span>
          </button>
        </div>
      </div>

      {/* Expandable Mobile Search */}
      {searchOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-3 py-2.5">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <label htmlFor="navbar-mobile-search" className="sr-only">
              {t.nav.searchBtn}
            </label>
            <input
              id="navbar-mobile-search"
              type="search"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.nav.searchPlaceholderMobile}
              className="flex-1 h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <button
              type="submit"
              className="h-10 px-3.5 rounded-lg bg-emerald-700 text-white text-sm font-semibold shrink-0"
            >
              {t.nav.searchBtn}
            </button>
          </form>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg bg-slate-50 text-sm font-semibold text-slate-800 hover:bg-emerald-50"
            >
              {t.nav.home}
            </Link>
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg bg-slate-50 text-sm font-semibold text-slate-800 hover:bg-emerald-50"
            >
              {t.nav.allProducts}
            </Link>
            <Link
              to="/deals"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg bg-orange-50 text-sm font-semibold text-orange-800 hover:bg-orange-100"
            >
              {t.nav.todaysDeals}
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg bg-slate-50 text-sm font-semibold text-slate-800 hover:bg-emerald-50"
            >
              {t.nav.contactFaq}
            </Link>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              {t.nav.shopByCategory}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2.5 py-2 text-sm text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-md truncate"
                >
                  {lang === 'bn' ? cat.nameBn : cat.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAccountOpen(true);
              }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800"
            >
              <User className="w-4 h-4" />
              <span>{t.account.title}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
