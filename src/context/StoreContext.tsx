import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type {
  AuthUser,
  CartItem,
  CartSummary,
  Category,
  CouponRule,
  DeliveryArea,
  Lang,
  OrderFormValues,
  OrderRecord,
  Product,
  SiteMedia,
  ToastMessage,
} from '../types/grocery';
import { calculateCartTotals, DELIVERY_AREAS, formatBDT } from '../utils/groceryLogic';
import { TRANSLATIONS, type TranslationStrings } from '../i18n/translations';
import { getSupabaseClient } from '../lib/supabase';

const CART_KEY = 'avado_grocery_cart_v1';
const WISHLIST_KEY = 'avado_grocery_wishlist_v1';
const RECENT_KEY = 'avado_grocery_recent_v1';
const ORDERS_KEY = 'avado_grocery_demo_orders_v1';
const AREA_KEY = 'avado_grocery_area_v1';
const COUPON_KEY = 'avado_grocery_coupon_v1';
const LANG_KEY = 'avado_grocery_lang_v1';

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage quota errors
  }
}

interface StoreContextValue {
  lang: Lang;
  t: TranslationStrings;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  categories: Category[];
  products: Product[];
  coupons: CouponRule[];
  deliveryAreas: DeliveryArea[];
  siteMedia: SiteMedia | null;
  catalogLoading: boolean;
  refreshCatalog: () => Promise<void>;
  authUser: AuthUser | null;
  authToken: string | null;
  authLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ ok: boolean; error?: string; needsConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  cart: CartItem[];
  wishlist: string[];
  recentlyViewed: string[];
  demoOrders: OrderRecord[];
  selectedAreaId: string;
  appliedCouponCode: string;
  cartSummary: CartSummary;
  isCartOpen: boolean;
  isAccountOpen: boolean;
  isSidebarOpen: boolean;
  quickViewProduct: Product | null;
  toasts: ToastMessage[];
  setIsCartOpen: (open: boolean) => void;
  setIsAccountOpen: (open: boolean) => void;
  setIsSidebarOpen: (open: boolean) => void;
  setQuickViewProduct: (product: Product | null) => void;
  setSelectedAreaId: (areaId: string) => void;
  applyCoupon: (
    code: string,
    extra?: { email?: string; phone?: string }
  ) => Promise<{ ok: boolean; message: string }>;
  clearCoupon: () => void;
  addToCart: (product: Product, variantLabel?: string, quantity?: number) => void;
  updateCartQuantity: (productId: string, variantLabel: string, quantity: number) => void;
  removeFromCart: (productId: string, variantLabel: string) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  getCartItemQuantity: (productId: string, variantLabel?: string) => number;
  recordRecentlyViewed: (productId: string) => void;
  placeOrder: (formValues: OrderFormValues) => Promise<OrderRecord>;
  dismissToast: (id: string) => void;
  pushToast: (toast: Omit<ToastMessage, 'id'>) => void;
  formatPrice: (amount: number) => string;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = readStorage<Lang>(LANG_KEY, 'en');
    return saved === 'bn' ? 'bn' : 'en';
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<CouponRule[]>([]);
  const [deliveryAreas, setDeliveryAreas] = useState<DeliveryArea[]>(DELIVERY_AREAS);
  const [siteMedia, setSiteMedia] = useState<SiteMedia | null>(null);
  const [catalogLoading, setCatalogLoading] = useState<boolean>(true);

  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const [cart, setCart] = useState<CartItem[]>(() => readStorage<CartItem[]>(CART_KEY, []));
  const [wishlist, setWishlist] = useState<string[]>(() => readStorage<string[]>(WISHLIST_KEY, []));
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() =>
    readStorage<string[]>(RECENT_KEY, [])
  );
  const [demoOrders, setDemoOrders] = useState<OrderRecord[]>(() =>
    readStorage<OrderRecord[]>(ORDERS_KEY, [])
  );
  const [selectedAreaId, setSelectedAreaIdState] = useState<string>(() =>
    readStorage<string>(AREA_KEY, DELIVERY_AREAS[0].id)
  );
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>(() =>
    readStorage<string>(COUPON_KEY, '')
  );

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const t = TRANSLATIONS[lang];

  const refreshCatalog = useCallback(async () => {
    try {
      const res = await fetch('/api/bootstrap');
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
      if (Array.isArray(data.products)) {
        setProducts(data.products);
      }
      if (Array.isArray(data.deliveryAreas) && data.deliveryAreas.length > 0) {
        setDeliveryAreas(data.deliveryAreas);
      }
      if (Array.isArray(data.coupons)) {
        setCoupons(data.coupons);
        setAppliedCouponCode((prev) =>
          prev && !data.coupons.some((c: CouponRule) => c.code === prev) ? '' : prev
        );
      }
      if (data.siteMedia) {
        setSiteMedia(data.siteMedia);
      }
    } catch {
      // ignore transient network errors
    } finally {
      setCatalogLoading(false);
    }
  }, []);

  const syncUserFromToken = useCallback(async (accessToken: string | null) => {
    setAuthToken(accessToken);
    if (!accessToken) {
      setAuthUser(null);
      setAuthLoading(false);
      return;
    }
    try {
      const [meRes, ordersRes] = await Promise.all([
        fetch('/api/auth/me', { headers: { Authorization: `Bearer ${accessToken}` } }),
        fetch('/api/orders/mine', { headers: { Authorization: `Bearer ${accessToken}` } }),
      ]);
      if (meRes.ok) {
        const meData = await meRes.json();
        setAuthUser(meData.user ?? null);
      }
      if (ordersRes.ok) {
        const ordData = await ordersRes.json();
        if (Array.isArray(ordData.orders)) {
          setDemoOrders((prev) => {
            const seen = new Set(ordData.orders.map((o: OrderRecord) => o.orderId));
            return [...ordData.orders, ...prev.filter((o) => !seen.has(o.orderId))].slice(0, 20);
          });
        }
      }
    } catch {
      // ignore transient auth check errors
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshCatalog();
  }, [refreshCatalog]);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    getSupabaseClient().then(async (client) => {
      if (!active || !client) {
        if (active) setAuthLoading(false);
        return;
      }
      const { data } = await client.auth.getSession();
      if (active) {
        await syncUserFromToken(data.session?.access_token ?? null);
      }
      const { data: sub } = client.auth.onAuthStateChange((_event, session) => {
        void syncUserFromToken(session?.access_token ?? null);
      });
      unsubscribe = () => sub.subscription.unsubscribe();
    });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [syncUserFromToken]);

  useEffect(() => {
    writeStorage(LANG_KEY, lang);
    document.documentElement.lang = lang === 'bn' ? 'bn' : 'en';
  }, [lang]);

  useEffect(() => {
    writeStorage(CART_KEY, cart);
  }, [cart]);

  useEffect(() => {
    writeStorage(WISHLIST_KEY, wishlist);
  }, [wishlist]);

  useEffect(() => {
    writeStorage(RECENT_KEY, recentlyViewed);
  }, [recentlyViewed]);

  useEffect(() => {
    writeStorage(ORDERS_KEY, demoOrders);
  }, [demoOrders]);

  useEffect(() => {
    writeStorage(AREA_KEY, selectedAreaId);
  }, [selectedAreaId]);

  useEffect(() => {
    writeStorage(COUPON_KEY, appliedCouponCode);
  }, [appliedCouponCode]);

  const setLang = useCallback((nextLang: Lang) => {
    setLangState(nextLang);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => (prev === 'en' ? 'bn' : 'en'));
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const pushToast = useCallback(
    (toast: Omit<ToastMessage, 'id'>) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-2), { ...toast, id }]);
      window.setTimeout(() => {
        dismissToast(id);
      }, 3200);
    },
    [dismissToast]
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      const client = await getSupabaseClient();
      if (!client) return { ok: false, error: 'Auth service unavailable' };
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) return { ok: false, error: error.message };
      await syncUserFromToken(data.session?.access_token ?? null);
      pushToast({
        title: lang === 'bn' ? 'সফলভাবে সাইন ইন হয়েছে' : 'Signed in successfully',
        detail: email,
        tone: 'success',
      });
      return { ok: true };
    },
    [lang, pushToast, syncUserFromToken]
  );

  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      const client = await getSupabaseClient();
      if (!client) return { ok: false, error: 'Auth service unavailable' };
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) return { ok: false, error: error.message };
      if (data.session?.access_token) {
        await syncUserFromToken(data.session.access_token);
        pushToast({
          title: lang === 'bn' ? 'অ্যাকাউন্ট তৈরি হয়েছে' : 'Account created',
          detail: email,
          tone: 'success',
        });
        return { ok: true, needsConfirmation: false };
      }
      return { ok: true, needsConfirmation: true };
    },
    [lang, pushToast, syncUserFromToken]
  );

  const signOut = useCallback(async () => {
    const client = await getSupabaseClient();
    if (client) await client.auth.signOut();
    setAuthUser(null);
    setAuthToken(null);
    pushToast({
      title: lang === 'bn' ? 'সাইন আউট সম্পন্ন' : 'Signed out',
      tone: 'info',
    });
  }, [lang, pushToast]);

  const cartSummary = useMemo(
    () =>
      calculateCartTotals(cart, selectedAreaId, appliedCouponCode, lang, coupons, deliveryAreas),
    [cart, selectedAreaId, appliedCouponCode, lang, coupons, deliveryAreas]
  );

  const setSelectedAreaId = useCallback((areaId: string) => {
    setSelectedAreaIdState(areaId);
  }, []);

  const applyCoupon = useCallback(
    async (code: string, extra?: { email?: string; phone?: string }) => {
      const trimmed = code.trim().toUpperCase();
      if (!trimmed) {
        setAppliedCouponCode('');
        return { ok: true, message: '' };
      }

      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (authToken) {
          headers.Authorization = `Bearer ${authToken}`;
        }
        const res = await fetch('/api/coupons/validate', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            code: trimmed,
            subtotal: cartSummary.subtotal,
            email: extra?.email ?? authUser?.email,
            phone: extra?.phone,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data?.valid || !data?.coupon) {
          const msg = data?.error || (lang === 'bn' ? 'প্রমো কোডটি কার্যকর নয়' : 'Invalid promo code');
          return { ok: false, message: msg };
        }

        const matched: CouponRule = data.coupon;
        setCoupons((prev) =>
          prev.some((c) => c.code === matched.code) ? prev : [matched, ...prev]
        );
        setAppliedCouponCode(matched.code);
        const desc = lang === 'bn' ? matched.descriptionBn : matched.description;
        pushToast({
          title: t.toasts.couponApplied.replace('{code}', matched.code),
          detail: desc,
          tone: 'success',
        });
        return { ok: true, message: matched.code };
      } catch {
        const nextSummary = calculateCartTotals(
          cart,
          selectedAreaId,
          trimmed,
          lang,
          coupons,
          deliveryAreas
        );
        if (nextSummary.appliedCoupon) {
          setAppliedCouponCode(nextSummary.appliedCoupon.code);
          return { ok: true, message: nextSummary.appliedCoupon.code };
        }
        return { ok: false, message: nextSummary.couponError ?? 'Invalid coupon' };
      }
    },
    [
      authToken,
      authUser?.email,
      cart,
      cartSummary.subtotal,
      selectedAreaId,
      lang,
      coupons,
      deliveryAreas,
      pushToast,
      t.toasts.couponApplied,
    ]
  );

  const clearCoupon = useCallback(() => {
    setAppliedCouponCode('');
  }, []);

  const addToCart = useCallback(
    (product: Product, variantLabel?: string, quantity: number = 1) => {
      const displayName = lang === 'bn' ? product.nameBn : product.name;
      if (!product.inStock) {
        pushToast({
          title: t.toasts.outOfStock,
          detail: `${displayName} ${t.toasts.restockSoon}`,
          tone: 'warning',
        });
        return;
      }

      const chosenVariant =
        product.variants?.find((v) => v.label === variantLabel) ??
        (product.variants && product.variants.length > 0 ? product.variants[0] : null);

      const finalLabel = chosenVariant ? chosenVariant.label : variantLabel ?? product.unit;
      const finalLabelBn = chosenVariant
        ? chosenVariant.labelBn ?? chosenVariant.label
        : product.unitBn;
      const unitPrice = chosenVariant ? chosenVariant.price : product.price;
      const originalUnitPrice = chosenVariant ? chosenVariant.originalPrice : product.originalPrice;

      setCart((prev) => {
        const idx = prev.findIndex(
          (i) => i.productId === product.id && i.variantLabel === finalLabel
        );
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = {
            ...updated[idx],
            quantity: updated[idx].quantity + Math.max(1, quantity),
          };
          return updated;
        }
        return [
          ...prev,
          {
            productId: product.id,
            variantLabel: finalLabel,
            variantLabelBn: finalLabelBn,
            name: product.name,
            nameBn: product.nameBn,
            brand: product.brand,
            brandBn: product.brandBn,
            image: product.image,
            imageFocus: product.imageFocus,
            unitPrice,
            originalUnitPrice,
            quantity: Math.max(1, quantity),
            category: product.category,
          },
        ];
      });

      const shownUnit = lang === 'bn' ? finalLabelBn : finalLabel;
      pushToast({
        title: t.toasts.addedToCart,
        detail: `${displayName} (${shownUnit})`,
        tone: 'success',
      });
    },
    [lang, pushToast, t.toasts]
  );

  const updateCartQuantity = useCallback((productId: string, variantLabel: string, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((i) => !(i.productId === productId && i.variantLabel === variantLabel));
      }
      return prev.map((i) =>
        i.productId === productId && i.variantLabel === variantLabel ? { ...i, quantity } : i
      );
    });
  }, []);

  const removeFromCart = useCallback(
    (productId: string, variantLabel: string) => {
      setCart((prev) =>
        prev.filter((i) => !(i.productId === productId && i.variantLabel === variantLabel))
      );
      pushToast({
        title: t.toasts.removedFromCart,
        tone: 'info',
      });
    },
    [pushToast, t.toasts.removedFromCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setAppliedCouponCode('');
  }, []);

  const toggleWishlist = useCallback(
    (product: Product) => {
      const displayName = lang === 'bn' ? product.nameBn : product.name;
      setWishlist((prev) => {
        const exists = prev.includes(product.id);
        if (exists) {
          pushToast({
            title: t.toasts.removedWishlist,
            detail: displayName,
            tone: 'info',
          });
          return prev.filter((id) => id !== product.id);
        }
        pushToast({
          title: t.toasts.savedWishlist,
          detail: displayName,
          tone: 'success',
        });
        return [product.id, ...prev];
      });
    },
    [lang, pushToast, t.toasts.removedWishlist, t.toasts.savedWishlist]
  );

  const isWishlisted = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  const getCartItemQuantity = useCallback(
    (productId: string, variantLabel?: string) => {
      if (variantLabel) {
        return (
          cart.find((i) => i.productId === productId && i.variantLabel === variantLabel)?.quantity ??
          0
        );
      }
      return cart.filter((i) => i.productId === productId).reduce((sum, item) => sum + item.quantity, 0);
    },
    [cart]
  );

  const recordRecentlyViewed = useCallback(
    (productId: string) => {
      if (!products.some((p) => p.id === productId)) return;
      setRecentlyViewed((prev) => [productId, ...prev.filter((id) => id !== productId)].slice(0, 8));
    },
    [products]
  );

  const placeOrder = useCallback(
    async (formValues: OrderFormValues): Promise<OrderRecord> => {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          customer: formValues,
          items: cart.map((item) => ({
            productId: item.productId,
            variantLabel: item.variantLabel,
            quantity: item.quantity,
          })),
          couponCode: appliedCouponCode,
        }),
      });

      const payload = await res.json();
      if (!res.ok || !payload?.order) {
        throw new Error(payload?.error || 'Could not submit order. Please try again.');
      }

      const record: OrderRecord = payload.order;
      setDemoOrders((prev) => [record, ...prev].slice(0, 20));
      setCart([]);
      setAppliedCouponCode('');
      void refreshCatalog();

      pushToast({
        title: t.toasts.demoOrderPlaced.replace('{id}', record.orderId),
        detail:
          lang === 'bn'
            ? 'Supabase ডাটাবেসে অর্ডার সংরক্ষিত হয়েছে।'
            : 'Order saved to Supabase PostgreSQL.',
        tone: 'success',
      });
      return record;
    },
    [
      authToken,
      cart,
      appliedCouponCode,
      refreshCatalog,
      pushToast,
      t.toasts.demoOrderPlaced,
      lang,
    ]
  );

  const formatPrice = useCallback((amount: number) => formatBDT(amount, lang), [lang]);

  const value: StoreContextValue = {
    lang,
    t,
    setLang,
    toggleLang,
    categories,
    products,
    coupons,
    deliveryAreas,
    siteMedia,
    catalogLoading,
    refreshCatalog,
    authUser,
    authToken,
    authLoading,
    signIn,
    signUp,
    signOut,
    cart,
    wishlist,
    recentlyViewed,
    demoOrders,
    selectedAreaId,
    appliedCouponCode,
    cartSummary,
    isCartOpen,
    isAccountOpen,
    isSidebarOpen,
    quickViewProduct,
    toasts,
    setIsCartOpen,
    setIsAccountOpen,
    setIsSidebarOpen,
    setQuickViewProduct,
    setSelectedAreaId,
    applyCoupon,
    clearCoupon,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    isWishlisted,
    getCartItemQuantity,
    recordRecentlyViewed,
    placeOrder,
    dismissToast,
    pushToast,
    formatPrice,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used inside StoreProvider');
  }
  return ctx;
}
