import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { formatNum } from '../i18n/translations';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, addToCart, pushToast, lang, t } = useStore();
  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleAddAllToCart = () => {
    const inStockItems = savedProducts.filter((p) => p.inStock);
    inStockItems.forEach((p) => addToCart(p, undefined, 1));
    if (inStockItems.length > 0) {
      pushToast({
        title: t.wishlist.addedAllToast.replace('{count}', formatNum(inStockItems.length, lang)),
        tone: 'success',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            {t.wishlist.title}
          </h1>
          <p className="text-sm text-slate-600 mt-1">{t.wishlist.subtitle}</p>
        </div>
        {savedProducts.length > 0 && (
          <button
            type="button"
            onClick={handleAddAllToCart}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold transition-colors self-start sm:self-auto cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-amber-300" />
            {t.wishlist.addAll} ({formatNum(savedProducts.length, lang)})
          </button>
        )}
      </div>

      {savedProducts.length === 0 ? (
        <div className="py-16 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-7 h-7" />
          </div>
          <h2 className="font-display text-xl font-bold text-slate-900">{t.wishlist.emptyTitle}</h2>
          <p className="text-sm text-slate-600 mt-2">{t.wishlist.emptyDesc}</p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center mt-6 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold"
          >
            {t.wishlist.exploreBtn}
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {savedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
