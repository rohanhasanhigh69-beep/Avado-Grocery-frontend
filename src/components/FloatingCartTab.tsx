import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatNum } from '../i18n/translations';

export const FloatingCartTab: React.FC = () => {
  const { lang, t, cartSummary, setIsCartOpen, formatPrice } = useStore();
  const count = cartSummary.totalQuantity;

  return (
    <button
      type="button"
      onClick={() => setIsCartOpen(true)}
      aria-label={t.cart.openCartAria}
      data-testid="floating-cart-tab"
      className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-30 flex-col items-center rounded-l-xl overflow-hidden shadow-lg border border-r-0 border-emerald-700/20 bg-white hover:scale-[1.02] transition-transform cursor-pointer group"
    >
      <div className="bg-emerald-800 group-hover:bg-emerald-900 text-white px-3 py-2.5 flex flex-col items-center min-w-[74px] transition-colors">
        <ShoppingBag className="w-5 h-5 text-amber-300 mb-1" aria-hidden="true" />
        <span className="text-[11px] font-bold tracking-wide tabular-nums whitespace-nowrap">
          {formatNum(count, lang)} {count === 1 ? t.cart.floatingItemSingular : t.cart.floatingItems}
        </span>
      </div>
      <div className="bg-amber-300 text-slate-900 w-full py-1 px-2 text-center text-xs font-extrabold tabular-nums">
        {formatPrice(cartSummary.subtotal)}
      </div>
    </button>
  );
};
