import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Flame, HelpCircle, Phone, ShieldCheck, ShoppingBag, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SafeImage } from './SafeImage';

export const CategorySidebar: React.FC = () => {
  const { lang, t, isSidebarOpen, setIsSidebarOpen, categories, authUser } = useStore();

  useEffect(() => {
    if (!isSidebarOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSidebarOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSidebarOpen, setIsSidebarOpen]);

  if (!isSidebarOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex bg-slate-900/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label={t.nav.sidebarTitle}
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsSidebarOpen(false);
      }}
    >
      <aside className="bg-white w-72 sm:w-80 h-full flex flex-col shadow-2xl border-r border-slate-200">
        <div className="px-4 py-3.5 border-b border-slate-200 flex items-center justify-between bg-emerald-900 text-white">
          <span className="font-bold text-sm tracking-wide">{t.nav.sidebarTitle}</span>
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
            className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-800 cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          <div className="px-3 pb-2 mb-2 border-b border-slate-100 space-y-1">
            <Link
              to="/deals"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-800 text-sm font-semibold transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <Flame className="w-4 h-4 text-orange-600" aria-hidden="true" />
                <span>{t.nav.todaysDeals}</span>
              </span>
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              to="/shop"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-emerald-50 text-slate-800 text-sm font-semibold transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                <span>{t.nav.allProducts}</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" aria-hidden="true" />
            </Link>
          </div>

          <ul className="px-2 space-y-0.5">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  to={`/category/${cat.slug}`}
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 transition-colors group"
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <span className="w-8 h-8 rounded bg-white flex items-center justify-center shrink-0 overflow-hidden">
                      <SafeImage
                        src={cat.image}
                        alt={lang === 'bn' ? cat.nameBn : cat.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </span>
                    <span className="text-sm font-medium truncate">
                      {lang === 'bn' ? cat.nameBn : cat.name}
                    </span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-700 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-1.5 text-xs">
          {authUser?.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-emerald-800 hover:bg-emerald-100 font-semibold"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>{lang === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Dashboard'}</span>
            </Link>
          )}
          <Link
            to="/faq"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-slate-700 hover:text-emerald-800 font-medium"
          >
            <HelpCircle className="w-4 h-4 text-emerald-700" />
            <span>{t.nav.faq}</span>
          </Link>
          <a
            href="tel:01722371905"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-emerald-900 font-bold tabular-nums"
          >
            <Phone className="w-4 h-4 text-orange-600" />
            <span>{lang === 'bn' ? '০১৭২২৩৭১৯০৫' : '01722371905'}</span>
          </a>
        </div>
      </aside>
    </div>
  );
};
