import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  LogIn,
  LogOut,
  MapPin,
  PackageCheck,
  Phone,
  ShieldCheck,
  ShoppingBag,
  User,
  UserPlus,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatNum } from '../i18n/translations';
import type { OrderStatus } from '../types/grocery';

function formatOrderStatusLabel(status: OrderStatus | undefined, lang: 'en' | 'bn'): string {
  const s = status ?? 'pending';
  if (lang === 'bn') {
    switch (s) {
      case 'confirmed':
        return 'নিশ্চিত';
      case 'out_for_delivery':
        return 'ডেলিভারির পথে';
      case 'delivered':
        return 'ডেলিভারি সম্পন্ন';
      case 'cancelled':
        return 'বাতিল';
      default:
        return 'অপেক্ষমাণ';
    }
  }
  switch (s) {
    case 'confirmed':
      return 'Confirmed';
    case 'out_for_delivery':
      return 'Out for delivery';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Pending';
  }
}

function statusPillClass(status: OrderStatus | undefined): string {
  switch (status) {
    case 'delivered':
      return 'bg-emerald-100 text-emerald-800';
    case 'confirmed':
    case 'out_for_delivery':
      return 'bg-amber-100 text-amber-800';
    case 'cancelled':
      return 'bg-slate-200 text-slate-600';
    default:
      return 'bg-emerald-50 text-emerald-700';
  }
}

export const AccountDrawer: React.FC = () => {
  const {
    lang,
    t,
    authUser,
    authLoading,
    signIn,
    signUp,
    signOut,
    isAccountOpen,
    setIsAccountOpen,
    wishlist,
    demoOrders,
    cartSummary,
    formatPrice,
  } = useStore();

  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authMessage, setAuthMessage] = useState<{ type: 'error' | 'info'; text: string } | null>(
    null
  );

  useEffect(() => {
    if (!isAccountOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsAccountOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isAccountOpen, setIsAccountOpen]);

  if (!isAccountOpen) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage(null);
    if (!email.trim() || password.length < 6) {
      setAuthMessage({
        type: 'error',
        text:
          lang === 'bn'
            ? 'সঠিক ইমেইল ও কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন।'
            : 'Enter a valid email and at least 6 characters password.',
      });
      return;
    }

    setAuthSubmitting(true);
    try {
      if (authTab === 'signin') {
        const res = await signIn(email.trim(), password);
        if (!res.ok) {
          setAuthMessage({ type: 'error', text: res.error || 'Sign in failed' });
        } else {
          setPassword('');
        }
      } else {
        const res = await signUp(email.trim(), password, fullName.trim() || 'Customer');
        if (!res.ok) {
          setAuthMessage({ type: 'error', text: res.error || 'Registration failed' });
        } else if (res.needsConfirmation) {
          setAuthMessage({
            type: 'info',
            text:
              lang === 'bn'
                ? 'অ্যাকাউন্ট ভেরিফাই করতে আপনার ইমেইলের ইনবক্স চেক করুন।'
                : 'Check your email inbox to confirm your account, then sign in.',
          });
        } else {
          setPassword('');
        }
      }
    } finally {
      setAuthSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label={t.account.title}
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsAccountOpen(false);
      }}
    >
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl border-l border-slate-200">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <User className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {authUser?.fullName || t.account.title}
              </h2>
              <p className="text-xs text-slate-500">
                {authUser?.email || t.account.subtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsAccountOpen(false)}
            aria-label="Close account panel"
            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Supabase Auth Card */}
          {!authLoading && (
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
              {authUser ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                        {authUser.role === 'admin'
                          ? lang === 'bn'
                            ? 'স্টোর অ্যাডমিন'
                            : 'Store Admin'
                          : lang === 'bn'
                          ? 'যাচাইকৃত ক্রেতা'
                          : 'Signed In Customer'}
                      </p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">
                        {authUser.fullName || authUser.email}
                      </p>
                      <p className="text-xs text-slate-500">{authUser.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void signOut()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{lang === 'bn' ? 'সাইন আউট' : 'Sign out'}</span>
                    </button>
                  </div>

                  {authUser.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setIsAccountOpen(false)}
                      className="w-full h-10 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-300" aria-hidden="true" />
                      <span>
                        {lang === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড খুলুন' : 'Open Admin Dashboard'}
                      </span>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-1.5 p-1 rounded-lg bg-slate-200/70">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab('signin');
                        setAuthMessage(null);
                      }}
                      className={`py-1.5 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                        authTab === 'signin'
                          ? 'bg-white text-emerald-800 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{lang === 'bn' ? 'সাইন ইন' : 'Sign In'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab('signup');
                        setAuthMessage(null);
                      }}
                      className={`py-1.5 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                        authTab === 'signup'
                          ? 'bg-white text-emerald-800 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{lang === 'bn' ? 'নতুন অ্যাকাউন্ট' : 'Create Account'}</span>
                    </button>
                  </div>

                  <form onSubmit={handleAuthSubmit} className="space-y-2.5">
                    {authTab === 'signup' && (
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={lang === 'bn' ? 'আপনার পুরো নাম' : 'Full name'}
                        className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    )}
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={lang === 'bn' ? 'ইমেইল ঠিকানা' : 'Email address'}
                      required
                      className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={lang === 'bn' ? 'পাসওয়ার্ড (৬+ অক্ষর)' : 'Password (6+ chars)'}
                      required
                      className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                    {authMessage && (
                      <p
                        className={`text-[11px] ${
                          authMessage.type === 'error' ? 'text-orange-700' : 'text-emerald-700'
                        }`}
                      >
                        {authMessage.text}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={authSubmitting}
                      className="w-full h-9 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white text-xs font-bold cursor-pointer"
                    >
                      {authSubmitting
                        ? lang === 'bn'
                          ? 'অপেক্ষা করুন...'
                          : 'Please wait...'
                        : authTab === 'signin'
                        ? lang === 'bn'
                          ? 'সাইন ইন করুন'
                          : 'Sign In'
                        : lang === 'bn'
                        ? 'অ্যাকাউন্ট তৈরি করুন'
                        : 'Create Account'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-2">
            <p className="font-bold text-sm">{t.account.storeHubTitle}</p>
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{t.account.address}</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
              <a href="tel:01722371905" className="font-semibold underline tabular-nums">
                {lang === 'bn' ? '০১৭২২৩৭১৯০৫' : '01722371905'}
              </a>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/wishlist"
              onClick={() => setIsAccountOpen(false)}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors"
            >
              <Heart className="w-5 h-5 text-orange-600 mb-2" aria-hidden="true" />
              <p className="text-sm font-bold text-slate-900 tabular-nums">
                {formatNum(wishlist.length, lang)} {t.account.wishlistItems}
              </p>
              <p className="text-xs text-slate-500">{t.account.savedWishlist}</p>
            </Link>
            <Link
              to="/checkout"
              onClick={() => setIsAccountOpen(false)}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-emerald-700 mb-2" aria-hidden="true" />
              <p className="text-sm font-bold text-slate-900 tabular-nums">
                {formatPrice(cartSummary.subtotal)}
              </p>
              <p className="text-xs text-slate-500">{t.account.currentBasket}</p>
            </Link>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-emerald-700" aria-hidden="true" />
              <span>{t.account.recentOrders}</span>
            </h3>
            {demoOrders.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center">
                <p className="text-xs text-slate-500 mb-3">{t.account.noOrders}</p>
                <Link
                  to="/shop"
                  onClick={() => setIsAccountOpen(false)}
                  className="inline-block text-xs font-semibold text-emerald-800 hover:underline"
                >
                  {t.account.startShopping}
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {demoOrders.map((order) => (
                  <div
                    key={order.orderId}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">
                        {t.account.orderNumber}
                        {order.orderId}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-semibold ${statusPillClass(
                          order.status
                        )}`}
                      >
                        {formatOrderStatusLabel(order.status, lang)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {lang === 'bn' ? order.areaNameBn ?? order.areaName : order.areaName}
                    </p>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                      <span className="text-slate-500 tabular-nums">
                        {formatNum(
                          order.items.reduce((s, i) => s + i.quantity, 0),
                          lang
                        )}{' '}
                        {t.account.itemsWord} · {order.customer.paymentMethod.toUpperCase()}
                      </span>
                      <span className="font-bold text-emerald-900 tabular-nums">
                        {formatPrice(order.summary.total)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
