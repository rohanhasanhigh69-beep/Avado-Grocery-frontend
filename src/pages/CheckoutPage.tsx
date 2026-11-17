import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Info,
  Loader2,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Smartphone,
  Tag,
  Trash2,
  Truck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { validateCheckoutForm } from '../utils/groceryLogic';
import type { OrderFormValues, OrderRecord, PaymentMethod } from '../types/grocery';
import { formatNum } from '../i18n/translations';
import { SafeImage } from '../components/SafeImage';

export const CheckoutPage: React.FC = () => {
  const {
    lang,
    t,
    authUser,
    cart,
    cartSummary,
    coupons,
    deliveryAreas,
    selectedAreaId,
    setSelectedAreaId,
    appliedCouponCode,
    applyCoupon,
    clearCoupon,
    updateCartQuantity,
    removeFromCart,
    placeOrder,
    pushToast,
    formatPrice,
  } = useStore();

  const [form, setForm] = useState<OrderFormValues>({
    fullName: '',
    phone: '',
    email: '',
    areaId: selectedAreaId,
    address: '',
    city: t.checkout.cityDefault,
    deliverySlot: t.checkout.slots[0],
    paymentMethod: 'cod',
    walletNumber: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof OrderFormValues, string>>>({});
  const [couponInput, setCouponInput] = useState(appliedCouponCode);
  const [couponFeedback, setCouponFeedback] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!authUser) return;
    setForm((prev) => ({
      ...prev,
      fullName: prev.fullName || authUser.fullName || '',
      email: prev.email || authUser.email || '',
    }));
  }, [authUser]);

  const paymentOptions: { id: PaymentMethod; label: string; subtitle: string }[] = [
    { id: 'cod', ...t.checkout.payments.cod },
    { id: 'bkash', ...t.checkout.payments.bkash },
    { id: 'nagad', ...t.checkout.payments.nagad },
    { id: 'card', ...t.checkout.payments.card },
  ];

  const handleFieldChange = <K extends keyof OrderFormValues>(
    field: K,
    value: OrderFormValues[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === 'areaId' && typeof value === 'string') {
      setSelectedAreaId(value);
    }
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await applyCoupon(couponInput, { email: form.email, phone: form.phone });
    setCouponFeedback(res.ok ? null : res.message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const validationErrors = validateCheckoutForm(form, lang);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    try {
      const order = await placeOrder(form);
      setConfirmedOrder(order);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const msg = (err as Error).message || 'Could not place order. Please try again.';
      setSubmitError(msg);
      pushToast({
        title: lang === 'bn' ? 'অর্ডার সম্পন্ন হয়নি' : 'Order failed',
        detail: msg,
        tone: 'warning',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <motion.div
          initial={{ opacity: 0.92, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-2xl border border-emerald-200 shadow-lg overflow-hidden"
        >
          <div className="bg-emerald-800 text-white p-6 sm:p-8 text-center">
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.25 }}
              className="w-16 h-16 rounded-full bg-amber-400 text-emerald-950 flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle2 className="w-9 h-9" aria-hidden="true" />
            </motion.div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
              {t.checkout.confirmedBadge}
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
              {t.checkout.confirmedTitlePrefix}
              {confirmedOrder.orderId} {t.checkout.confirmedTitleSuffix}
            </h1>
            <p className="text-sm text-emerald-100 max-w-md mx-auto">
              {t.checkout.confirmedThankYou.replace('{name}', confirmedOrder.customer.fullName)}
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">
                  {t.checkout.deliveryDestination}
                </p>
                <p className="font-bold text-slate-900 mt-1">{confirmedOrder.customer.address}</p>
                <p className="text-xs text-slate-600">
                  {lang === 'bn'
                    ? confirmedOrder.areaNameBn ?? confirmedOrder.areaName
                    : confirmedOrder.areaName}
                  , {confirmedOrder.customer.city}
                </p>
                <p className="text-xs text-slate-600 mt-1 tabular-nums">
                  {t.checkout.phonePrefix} {confirmedOrder.customer.phone}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">
                  {t.checkout.schedulePayment}
                </p>
                <p className="font-bold text-slate-900 mt-1">
                  {confirmedOrder.customer.deliverySlot}
                </p>
                <p className="text-xs text-slate-600">
                  {t.checkout.methodPrefix} {confirmedOrder.customer.paymentMethod.toUpperCase()}{' '}
                  {t.checkout.simulatedTag}
                </p>
                <p className="text-xs text-emerald-700 font-semibold mt-1">
                  {t.checkout.dispatchHubNote}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900 mb-3">{t.checkout.receiptSummary}</h2>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {confirmedOrder.items.map((item) => {
                  const itemName = lang === 'bn' ? item.nameBn : item.name;
                  const itemVariant =
                    lang === 'bn' ? item.variantLabelBn ?? item.variantLabel : item.variantLabel;
                  return (
                    <div
                      key={`${item.productId}-${item.variantLabel}`}
                      className="flex items-center justify-between gap-3 px-4 py-3 text-sm bg-white"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">{itemName}</p>
                        <p className="text-xs text-slate-500 tabular-nums">
                          {itemVariant} × {formatNum(item.quantity, lang)} ({formatPrice(item.unitPrice)}{' '}
                          {t.checkout.eachWord})
                        </p>
                      </div>
                      <span className="font-bold text-slate-900 tabular-nums">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5 text-sm border-t border-slate-200 pt-4">
              <div className="flex justify-between text-slate-600">
                <span>{t.cart.subtotal}</span>
                <span className="tabular-nums font-medium">
                  {formatPrice(confirmedOrder.summary.subtotal)}
                </span>
              </div>
              {confirmedOrder.summary.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>
                    {t.checkout.promoDiscount} ({confirmedOrder.summary.appliedCoupon?.code})
                  </span>
                  <span className="tabular-nums font-semibold">
                    -{formatPrice(confirmedOrder.summary.couponDiscount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>{t.cart.deliveryFee}</span>
                <span className="tabular-nums font-medium">
                  {confirmedOrder.summary.deliveryFee === 0
                    ? t.cart.free
                    : formatPrice(confirmedOrder.summary.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-extrabold text-emerald-900 pt-2 border-t border-slate-200">
                <span>{t.checkout.totalPaidDemo}</span>
                <span className="tabular-nums">{formatPrice(confirmedOrder.summary.total)}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/shop"
                className="flex-1 min-w-[180px] h-11 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold flex items-center justify-center transition-colors"
              >
                {t.checkout.continueShopping}
              </Link>
              <Link
                to="/"
                className="px-6 h-11 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-sm font-semibold flex items-center justify-center transition-colors"
              >
                {t.checkout.backHome}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">{t.checkout.emptyTitle}</h1>
        <p className="text-sm text-slate-600 mb-6">{t.checkout.emptyDesc}</p>
        <Link
          to="/shop"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold transition-colors"
        >
          {t.cart.browseGroceries}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-8">
      <div
        className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-sm text-amber-950"
        role="note"
      >
        <Info className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <p className="font-bold">{t.checkout.demoTitle}</p>
          <p className="text-xs sm:text-sm text-amber-900 mt-0.5">{t.checkout.demoDesc}</p>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-6">
        {t.checkout.pageTitle}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <form
          id="checkout-form"
          onSubmit={handleSubmit}
          noValidate
          className="lg:col-span-7 space-y-6"
        >
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-700" aria-hidden="true" />
              <span>{t.checkout.section1Title}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="chk-name" className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.checkout.fullName}
                </label>
                <input
                  id="chk-name"
                  type="text"
                  value={form.fullName}
                  onChange={(e) => handleFieldChange('fullName', e.target.value)}
                  placeholder={t.checkout.fullNamePlaceholder}
                  className={`w-full h-11 px-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                    errors.fullName ? 'border-orange-500 bg-orange-50/40' : 'border-slate-300'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="chk-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.checkout.phoneLabel}
                </label>
                <input
                  id="chk-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  placeholder="01722371905"
                  className={`w-full h-11 px-3 rounded-xl border text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                    errors.phone ? 'border-orange-500 bg-orange-50/40' : 'border-slate-300'
                  }`}
                />
                {errors.phone && (
                  <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="chk-email" className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.checkout.emailLabel}
                </label>
                <input
                  id="chk-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full h-11 px-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                    errors.email ? 'border-orange-500 bg-orange-50/40' : 'border-slate-300'
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="chk-city" className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.checkout.cityLabel}
                </label>
                <input
                  id="chk-city"
                  type="text"
                  value={form.city}
                  onChange={(e) => handleFieldChange('city', e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="chk-area" className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.checkout.areaLabel}
                </label>
                <select
                  id="chk-area"
                  value={form.areaId}
                  onChange={(e) => handleFieldChange('areaId', e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  {deliveryAreas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {lang === 'bn' ? area.nameBn : area.name} — {formatPrice(area.fee)} (
                      {lang === 'bn' ? area.etaBn : area.eta})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="chk-slot" className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.checkout.slotLabel}
                </label>
                <select
                  id="chk-slot"
                  value={form.deliverySlot}
                  onChange={(e) => handleFieldChange('deliverySlot', e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  {t.checkout.slots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="chk-address" className="block text-xs font-semibold text-slate-700 mb-1">
                {t.checkout.addressLabel}
              </label>
              <input
                id="chk-address"
                type="text"
                value={form.address}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                placeholder={t.checkout.addressPlaceholder}
                className={`w-full h-11 px-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                  errors.address ? 'border-orange-500 bg-orange-50/40' : 'border-slate-300'
                }`}
              />
              {errors.address && (
                <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.address}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="chk-notes" className="block text-xs font-semibold text-slate-700 mb-1">
                {t.checkout.notesLabel}
              </label>
              <textarea
                id="chk-notes"
                rows={2}
                value={form.notes}
                onChange={(e) => handleFieldChange('notes', e.target.value)}
                placeholder={t.checkout.notesPlaceholder}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-700" aria-hidden="true" />
              <span>{t.checkout.section2Title}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {paymentOptions.map((opt) => {
                const selected = form.paymentMethod === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-colors flex items-start gap-3 ${
                      selected
                        ? 'border-emerald-700 bg-emerald-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.id}
                      checked={selected}
                      onChange={() => handleFieldChange('paymentMethod', opt.id)}
                      className="mt-1 text-emerald-700 focus:ring-emerald-600"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900">{opt.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{opt.subtitle}</p>
                    </div>
                  </label>
                );
              })}
            </div>

            {(form.paymentMethod === 'bkash' || form.paymentMethod === 'nagad') && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label
                  htmlFor="chk-wallet"
                  className="flex items-center gap-2 text-xs font-bold text-slate-800"
                >
                  <Smartphone className="w-4 h-4 text-orange-600" aria-hidden="true" />
                  <span>
                    {form.paymentMethod === 'bkash'
                      ? lang === 'bn'
                        ? 'বিকাশ'
                        : 'bKash'
                      : lang === 'bn'
                      ? 'নগদ'
                      : 'Nagad'}{' '}
                    {t.checkout.walletLabelSuffix}
                  </span>
                </label>
                <input
                  id="chk-wallet"
                  type="tel"
                  value={form.walletNumber ?? ''}
                  onChange={(e) => handleFieldChange('walletNumber', e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className={`w-full h-10 px-3 rounded-lg border bg-white text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                    errors.walletNumber ? 'border-orange-500' : 'border-slate-300'
                  }`}
                />
                {errors.walletNumber && (
                  <p className="text-xs text-orange-600">{errors.walletNumber}</p>
                )}
              </div>
            )}
          </div>

          {submitError && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-xs sm:text-sm text-orange-800 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{submitError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-12 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white text-base font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
            <span>
              {submitting
                ? lang === 'bn'
                  ? 'অর্ডার প্রসেস হচ্ছে...'
                  : 'Submitting order...'
                : `${t.checkout.placeOrderBtn} · ${formatPrice(cartSummary.total)}`}
            </span>
          </button>
        </form>

        {/* Right: Order Summary Sidebar */}
        <aside className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 space-y-5 lg:sticky lg:top-20">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">{t.checkout.orderSummary}</h2>
            <span className="text-xs font-semibold text-slate-500 tabular-nums">
              {formatNum(cartSummary.totalQuantity, lang)} {t.checkout.itemsCount}
            </span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {cart.map((item) => {
              const itemName = lang === 'bn' ? item.nameBn : item.name;
              const itemVariant =
                lang === 'bn' ? item.variantLabelBn ?? item.variantLabel : item.variantLabel;
              return (
                <div
                  key={`${item.productId}-${item.variantLabel}`}
                  className="flex items-center gap-3 pb-3 border-b border-slate-100 last:border-none last:pb-0"
                >
                  <div className="w-14 h-14 rounded-lg bg-white border border-slate-100 p-1 overflow-hidden shrink-0">
                    <SafeImage
                      src={item.image}
                      alt={itemName}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{itemName}</p>
                    <p className="text-xs text-slate-500">
                      {itemVariant} · {formatPrice(item.unitPrice)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(item.productId, item.variantLabel, item.quantity - 1)
                        }
                        aria-label={`Decrease ${itemName}`}
                        className="w-6 h-6 rounded border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold tabular-nums">
                        {formatNum(item.quantity, lang)}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(item.productId, item.variantLabel, item.quantity + 1)
                        }
                        aria-label={`Increase ${itemName}`}
                        className="w-6 h-6 rounded border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId, item.variantLabel)}
                        aria-label={`Remove ${itemName}`}
                        className="ml-1 text-slate-400 hover:text-orange-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-900 tabular-nums shrink-0">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Coupon Input */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <label htmlFor="checkout-coupon" className="sr-only">
                  {t.cart.couponLabel}
                </label>
                <input
                  id="checkout-coupon"
                  type="text"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value);
                    setCouponFeedback(null);
                  }}
                  placeholder={t.checkout.promoPlaceholder}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
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
                  className="px-3.5 h-10 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  {t.checkout.clear}
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 h-10 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold cursor-pointer"
                >
                  {t.cart.apply}
                </button>
              )}
            </form>
            {couponFeedback && <p className="text-xs text-orange-600">{couponFeedback}</p>}
            {cartSummary.appliedCoupon && (
              <p className="text-xs text-emerald-700 font-semibold">
                {cartSummary.appliedCoupon.code}:{' '}
                {lang === 'bn'
                  ? cartSummary.appliedCoupon.descriptionBn
                  : cartSummary.appliedCoupon.description}
              </p>
            )}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {coupons.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={async () => {
                    setCouponInput(c.code);
                    const res = await applyCoupon(c.code, {
                      email: form.email,
                      phone: form.phone,
                    });
                    setCouponFeedback(res.ok ? null : res.message);
                  }}
                  className="px-2 py-1 rounded border border-slate-200 bg-slate-50 hover:border-emerald-500 text-[11px] font-semibold text-slate-700 cursor-pointer"
                >
                  {c.code}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 text-sm pt-3 border-t border-slate-200">
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
                <span>{t.checkout.promoDiscount}</span>
                <span className="font-semibold tabular-nums">
                  -{formatPrice(cartSummary.couponDiscount)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                <span>{t.checkout.deliveryCharge}</span>
              </span>
              <span className="font-semibold text-slate-900 tabular-nums">
                {cartSummary.deliveryFee === 0 ? t.cart.free : formatPrice(cartSummary.deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-extrabold text-emerald-900 pt-3 border-t border-slate-200">
              <span>{t.checkout.grandTotal}</span>
              <span className="tabular-nums">{formatPrice(cartSummary.total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
