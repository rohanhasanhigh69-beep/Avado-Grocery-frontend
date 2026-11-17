import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatNum } from '../i18n/translations';
import { SafeImage } from './SafeImage';

export const CartDrawer: React.FC = () => {
  const {
    lang,
    t,
    cart,
    cartSummary,
    deliveryAreas,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    selectedAreaId,
    setSelectedAreaId,
    appliedCouponCode,
    applyCoupon,
    clearCoupon,
    formatPrice,
  } = useStore();

  const [couponInput, setCouponInput] = useState(appliedCouponCode);
  const [couponFeedback, setCouponFeedback] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setCouponInput(appliedCouponCode);
  }, [appliedCouponCode]);

  useEffect(() => {
    if (!isCartOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const progressPct = Math.min(
    100,
    Math.round((cartSummary.subtotal / cartSummary.freeDeliveryThreshold) * 100)
  );

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await applyCoupon(couponInput);
    setCouponFeedback(res.ok ? null : res.message);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label={t.cart.yourBasket}
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsCartOpen(false);
      }}
    >
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl border-l border-slate-200">
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-emerald-700" aria-hidden="true" />
            <h2 className="text-lg font-bold text-slate-900">
              {t.cart.yourBasket}{' '}
              <span className="text-sm font-medium text-slate-500 tabular-nums">
                ({formatNum(cartSummary.totalQuantity, lang)})
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-xs font-medium text-slate-500 hover:text-orange-600 px-2 py-1 rounded cursor-pointer"
              >
                {t.cart.clearAll}
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              aria-label={t.cart.closeCart}
              className="p-2 text-slate-500 hover:text-slate-900 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Delivery Progress */}
        {cart.length > 0 && (
          <div className="px-5 py-3 bg-emerald-50/70 border-b border-emerald-100">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-900 mb-1.5">
              <Truck className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
              {cartSummary.remainingForFreeDelivery === 0 ? (
                <span>{t.cart.unlockedFree}</span>
              ) : (
                <span>
                  {t.cart.addMorePrefix}{' '}
                  <strong className="tabular-nums font-bold">
                    {formatPrice(cartSummary.remainingForFreeDelivery)}
                  </strong>{' '}
                  {t.cart.addMoreSuffix}
                </span>
              )}
            </div>
            <div className="h-1.5 w-full rounded-full bg-emerald-200/70 overflow-hidden">
              <div
                className="h-full bg-emerald-700 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items or Empty State */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{t.cart.emptyTitle}</h3>
              <p className="text-sm text-slate-500 max-w-xs mb-6">{t.cart.emptyDesc}</p>
              <Link
                to="/shop"
                onClick={() => setIsCartOpen(false)}
                className="px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold transition-colors"
              >
                {t.cart.browseGroceries}
              </Link>
            </div>
          ) : (
            cart.map((item) => {
              const itemName = lang === 'bn' ? item.nameBn : item.name;
              const itemBrand = lang === 'bn' ? item.brandBn : item.brand;
              const itemVariant = lang === 'bn' ? item.variantLabelBn ?? item.variantLabel : item.variantLabel;
              return (
                <div
                  key={`${item.productId}-${item.variantLabel}`}
                  className="flex gap-3 p-3 rounded-xl border border-slate-200 bg-white"
                >
                  <div className="w-20 h-20 rounded-lg bg-white border border-slate-100 p-1 overflow-hidden shrink-0">
                    <SafeImage
                      src={item.image}
                      alt={itemName}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/product/${item.productId}`}
                        onClick={() => setIsCartOpen(false)}
                        className="text-sm font-semibold text-slate-900 hover:text-emerald-800 line-clamp-1"
                      >
                        {itemName}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId, item.variantLabel)}
                        aria-label={`Remove ${itemName} from cart`}
                        className="text-slate-400 hover:text-orange-600 p-0.5 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {itemBrand} · {itemVariant}
                    </p>
                    <div className="mt-auto pt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center border border-slate-200 rounded-lg h-8">
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(item.productId, item.variantLabel, item.quantity - 1)
                          }
                          aria-label={`Decrease quantity of ${itemName}`}
                          className="w-7 h-full flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold tabular-nums">
                          {formatNum(item.quantity, lang)}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(item.productId, item.variantLabel, item.quantity + 1)
                          }
                          aria-label={`Increase quantity of ${itemName}`}
                          className="w-7 h-full flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-emerald-900 tabular-nums">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Summary & Checkout Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            {/* Delivery Area Selector */}
            <div>
              <label htmlFor="drawer-area" className="block text-xs font-semibold text-slate-700 mb-1">
                {t.cart.deliveryAreaLabel}
              </label>
              <select
                id="drawer-area"
                value={selectedAreaId}
                onChange={(e) => setSelectedAreaId(e.target.value)}
                className="w-full h-9 px-2.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                {deliveryAreas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {lang === 'bn' ? area.nameBn : area.name} ({formatPrice(area.fee)} /{' '}
                    {t.cart.freeOver} {formatPrice(area.freeThreshold)}+)
                  </option>
                ))}
              </select>
            </div>

            {/* Coupon Form */}
            <form onSubmit={handleApplyCoupon} className="space-y-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <label htmlFor="drawer-coupon" className="sr-only">
                    {t.cart.couponLabel}
                  </label>
                  <input
                    id="drawer-coupon"
                    type="text"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value);
                      setCouponFeedback(null);
                    }}
                    placeholder={t.cart.promoPlaceholder}
                    className="w-full h-9 pl-8 pr-2.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                {appliedCouponCode ? (
                  <button
                    type="button"
                    onClick={() => {
                      clearCoupon();
                      setCouponInput('');
                      setCouponFeedback(null);
                    }}
                    className="px-3 h-9 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    {t.cart.remove}
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-3.5 h-9 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold transition-colors cursor-pointer"
                  >
                    {t.cart.apply}
                  </button>
                )}
              </div>
              {couponFeedback && <p className="text-xs text-orange-600">{couponFeedback}</p>}
              {cartSummary.appliedCoupon && (
                <p className="text-xs text-emerald-700 font-medium">
                  {t.cart.appliedLabel} {cartSummary.appliedCoupon.code}:{' '}
                  {lang === 'bn'
                    ? cartSummary.appliedCoupon.descriptionBn
                    : cartSummary.appliedCoupon.description}
                </p>
              )}
            </form>

            {/* Totals Breakdown */}
            <div className="space-y-1.5 text-xs pt-1 border-t border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>{t.cart.subtotal}</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {formatPrice(cartSummary.subtotal)}
                </span>
              </div>
              {cartSummary.itemSavings > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>{t.cart.productDiscounts}</span>
                  <span className="font-semibold tabular-nums">
                    -{formatPrice(cartSummary.itemSavings)}
                  </span>
                </div>
              )}
              {cartSummary.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>
                    {t.cart.couponLabel} ({cartSummary.appliedCoupon?.code})
                  </span>
                  <span className="font-semibold tabular-nums">
                    -{formatPrice(cartSummary.couponDiscount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>{t.cart.deliveryFee}</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {cartSummary.deliveryFee === 0 ? t.cart.free : formatPrice(cartSummary.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>{t.cart.total}</span>
                <span className="text-emerald-900 tabular-nums">{formatPrice(cartSummary.total)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="w-full h-11 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>{t.cart.proceedCheckout}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
