import type {
  CartItem,
  CartSummary,
  CouponRule,
  DeliveryArea,
  Lang,
  OrderFormValues,
  Product,
  ProductFilters,
} from '../types/grocery';
import { toBengaliDigits } from '../i18n/translations';

export const DELIVERY_AREAS: DeliveryArea[] = [
  {
    id: 'uttara-sector-11',
    name: 'Uttara (Sector 1–14, incl. Sector 11)',
    nameBn: 'উত্তরা (সেক্টর ১–১৪, সেক্টর ১১ সহ)',
    fee: 40,
    freeThreshold: 1500,
    eta: '45–60 mins Express',
    etaBn: '৪৫–৬০ মিনিট এক্সপ্রেস',
  },
  {
    id: 'uttara-extension',
    name: 'Uttara Diabari / Sector 15–18 & Airport',
    nameBn: 'উত্তরা দিয়াবাড়ি / সেক্টর ১৫–১৮ ও এয়ারপোর্ট',
    fee: 50,
    freeThreshold: 1800,
    eta: '60–90 mins',
    etaBn: '৬০–৯০ মিনিট',
  },
  {
    id: 'gulshan-banani',
    name: 'Gulshan, Banani, Baridhara & Nikunja',
    nameBn: 'গুলশান, বনানী, বারিধারা ও নিকুঞ্জ',
    fee: 60,
    freeThreshold: 2000,
    eta: '90–120 mins',
    etaBn: '৯০–১২০ মিনিট',
  },
  {
    id: 'mirpur-bashundhara',
    name: 'Mirpur, Bashundhara R/A & Pallabi',
    nameBn: 'মিরপুর, বসুন্ধরা আবাসিক ও পল্লবী',
    fee: 65,
    freeThreshold: 2000,
    eta: '90–120 mins',
    etaBn: '৯০–১২০ মিনিট',
  },
  {
    id: 'dhanmondi-mohammadpur',
    name: 'Dhanmondi, Mohammadpur & Motijheel',
    nameBn: 'ধানমন্ডি, মোহাম্মদপুর ও মতিঝিল',
    fee: 80,
    freeThreshold: 2500,
    eta: '2–3 hours',
    etaBn: '২–৩ ঘন্টা',
  },
];

export const COUPONS: CouponRule[] = [
  {
    code: 'AVADO10',
    description: '10% off orders ৳500+ (up to ৳400)',
    descriptionBn: '৳৫০০+ অর্ডারে ১০% ছাড় (সর্বোচ্চ ৳৪০০)',
    type: 'percent',
    value: 10,
    minSubtotal: 500,
    maxDiscount: 400,
  },
  {
    code: 'UTTARA50',
    description: '৳50 flat discount on orders ৳800+',
    descriptionBn: '৳৮০০+ অর্ডারে সরাসরি ৳৫০ ছাড়',
    type: 'flat',
    value: 50,
    minSubtotal: 800,
  },
  {
    code: 'FRESH15',
    description: '15% off pantry & fresh orders ৳1,800+ (up to ৳500)',
    descriptionBn: '৳১,৮০০+ অর্ডারে ১৫% ছাড় (সর্বোচ্চ ৳৫০০)',
    type: 'percent',
    value: 15,
    minSubtotal: 1800,
    maxDiscount: 500,
  },
  {
    code: 'FREEDEL',
    description: 'Free delivery on orders ৳600+',
    descriptionBn: '৳৬০০+ অর্ডারে ফ্রি ডেলিভারি',
    type: 'free-delivery',
    value: 100,
    minSubtotal: 600,
  },
];

export function formatBDT(amount: number, lang: Lang = 'en'): string {
  const safe = Number.isFinite(amount) ? Math.round(amount) : 0;
  const formatted = safe.toLocaleString('en-IN');
  return lang === 'bn' ? `৳${toBengaliDigits(formatted)}` : `৳${formatted}`;
}

export function getDiscountPercent(price: number, originalPrice?: number): number {
  if (!originalPrice || originalPrice <= price || originalPrice <= 0) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function validateCoupon(
  rawCode: string,
  subtotal: number,
  lang: Lang = 'en',
  couponsList: CouponRule[] = COUPONS
): { coupon: CouponRule | null; error: string | null } {
  const normalized = rawCode.trim().toUpperCase();
  if (!normalized) {
    return { coupon: null, error: null };
  }
  const found = couponsList.find((c) => c.code === normalized && c.active !== false);
  if (!found) {
    const sample = couponsList
      .filter((c) => c.active !== false)
      .slice(0, 3)
      .map((c) => c.code)
      .join(', ');
    return {
      coupon: null,
      error:
        lang === 'bn'
          ? `প্রমো কোড "${normalized}" সঠিক নয় অথবা বাতিল করা হয়েছে।${sample ? ` সচল কোড: ${sample}` : ''}`
          : `Promo code "${normalized}" is not valid or no longer active.${sample ? ` Try ${sample}.` : ''}`,
    };
  }
  if (subtotal < found.minSubtotal) {
    return {
      coupon: null,
      error:
        lang === 'bn'
          ? `${found.code} প্রয়োগ করতে আরও ${formatBDT(found.minSubtotal - subtotal, 'bn')} যোগ করুন (সর্বনিম্ন ${formatBDT(found.minSubtotal, 'bn')})।`
          : `Add ${formatBDT(found.minSubtotal - subtotal)} more to apply ${found.code} (min ${formatBDT(found.minSubtotal)}).`,
    };
  }
  return { coupon: found, error: null };
}

export function calculateCartTotals(
  items: CartItem[],
  areaId: string = 'uttara-sector-11',
  couponCode: string = '',
  lang: Lang = 'en',
  couponsList: CouponRule[] = COUPONS,
  areasList: DeliveryArea[] = DELIVERY_AREAS
): CartSummary {
  const area = areasList.find((a) => a.id === areaId) ?? areasList[0] ?? DELIVERY_AREAS[0];
  let subtotal = 0;
  let itemSavings = 0;
  let totalQuantity = 0;

  for (const item of items) {
    const qty = Math.max(0, item.quantity);
    subtotal += item.unitPrice * qty;
    totalQuantity += qty;
    if (item.originalUnitPrice && item.originalUnitPrice > item.unitPrice) {
      itemSavings += (item.originalUnitPrice - item.unitPrice) * qty;
    }
  }

  const { coupon, error } =
    items.length > 0
      ? validateCoupon(couponCode, subtotal, lang, couponsList)
      : { coupon: null, error: null };

  let couponDiscount = 0;
  if (coupon && subtotal > 0) {
    if (coupon.type === 'percent') {
      const rawDiscount = Math.round((subtotal * coupon.value) / 100);
      couponDiscount = coupon.maxDiscount ? Math.min(rawDiscount, coupon.maxDiscount) : rawDiscount;
    } else if (coupon.type === 'flat') {
      couponDiscount = Math.min(coupon.value, subtotal);
    }
  }

  let deliveryFee = 0;
  if (items.length > 0) {
    const qualifiesFreeThreshold = subtotal >= area.freeThreshold;
    const qualifiesFreeCoupon = coupon?.type === 'free-delivery';
    deliveryFee = qualifiesFreeThreshold || qualifiesFreeCoupon ? 0 : area.fee;
  }

  const remainingForFreeDelivery =
    items.length === 0 ? area.freeThreshold : Math.max(0, area.freeThreshold - subtotal);

  const total = Math.max(0, subtotal - couponDiscount + deliveryFee);

  return {
    subtotal,
    itemSavings,
    couponDiscount,
    deliveryFee,
    freeDeliveryThreshold: area.freeThreshold,
    remainingForFreeDelivery,
    total,
    totalQuantity,
    appliedCoupon: coupon,
    couponError: error,
  };
}

export function filterAndSortProducts(products: Product[], filters: ProductFilters): Product[] {
  const query = (filters.query ?? '').trim().toLowerCase();
  const minPrice = filters.minPrice ?? null;
  const maxPrice = filters.maxPrice ?? null;
  const brands = filters.brands ?? [];
  const unitTypes = filters.unitTypes ?? [];
  const minRating = filters.minRating ?? 0;

  const filtered = products.filter((p) => {
    if (filters.category && filters.category !== 'all' && p.category !== filters.category) {
      return false;
    }
    if (filters.dealsOnly && !p.isFlashDeal && getDiscountPercent(p.price, p.originalPrice) === 0) {
      return false;
    }
    if (filters.inStockOnly && !p.inStock) {
      return false;
    }
    if (minPrice !== null && p.price < minPrice) {
      return false;
    }
    if (maxPrice !== null && p.price > maxPrice) {
      return false;
    }
    if (brands.length > 0 && !brands.includes(p.brand)) {
      return false;
    }
    if (unitTypes.length > 0 && !unitTypes.includes(p.unitType)) {
      return false;
    }
    if (minRating > 0 && p.rating < minRating) {
      return false;
    }
    if (query) {
      const haystack = `${p.name} ${p.nameBn} ${p.brand} ${p.brandBn} ${p.category} ${p.unit} ${p.unitBn} ${(p.tags ?? []).join(' ')}`.toLowerCase();
      if (!haystack.includes(query)) {
        return false;
      }
    }
    return true;
  });

  const sort = filters.sort ?? 'popular';
  return [...filtered].sort((a, b) => {
    switch (sort) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'discount':
        return getDiscountPercent(b.price, b.originalPrice) - getDiscountPercent(a.price, a.originalPrice);
      case 'newest':
        return Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)) || b.reviewCount - a.reviewCount;
      case 'popular':
      default:
        return (
          Number(Boolean(b.isBestSeller)) - Number(Boolean(a.isBestSeller)) ||
          b.reviewCount - a.reviewCount
        );
    }
  });
}

export function validateCheckoutForm(
  values: OrderFormValues,
  lang: Lang = 'en'
): Partial<Record<keyof OrderFormValues, string>> {
  const errors: Partial<Record<keyof OrderFormValues, string>> = {};

  if (!values.fullName.trim() || values.fullName.trim().length < 2) {
    errors.fullName =
      lang === 'bn' ? 'অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন।' : 'Please enter your full name.';
  }

  const normalizedPhone = values.phone.replace(/[\s-]/g, '');
  if (!/^(\+?88)?01[3-9]\d{8}$/.test(normalizedPhone)) {
    errors.phone =
      lang === 'bn'
        ? 'সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 01722371905)।'
        : 'Enter a valid 11-digit Bangladeshi mobile number (e.g. 01722371905).';
  }

  if (!values.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email =
      lang === 'bn'
        ? 'ডেমো রসিদের জন্য সঠিক ইমেইল ঠিকানা লিখুন।'
        : 'Please enter a valid email address for your demo receipt.';
  }

  if (!values.areaId) {
    errors.areaId =
      lang === 'bn' ? 'অনুগ্রহ করে ঢাকার ডেলিভারি এলাকা নির্বাচন করুন।' : 'Please select your Dhaka delivery area.';
  }

  if (!values.address.trim() || values.address.trim().length < 8) {
    errors.address =
      lang === 'bn'
        ? 'অনুগ্রহ করে বাসা, রোড ও সেক্টর/ব্লকসহ পূর্ণ ঠিকানা লিখুন।'
        : 'Please enter your house, road, and sector/block address.';
  }

  if (
    (values.paymentMethod === 'bkash' || values.paymentMethod === 'nagad') &&
    (!values.walletNumber ||
      !/^(\+?88)?01[3-9]\d{8}$/.test(values.walletNumber.replace(/[\s-]/g, '')))
  ) {
    const provider =
      values.paymentMethod === 'bkash'
        ? lang === 'bn'
          ? 'বিকাশ'
          : 'bKash'
        : lang === 'bn'
        ? 'নগদ'
        : 'Nagad';
    errors.walletNumber =
      lang === 'bn'
        ? `সঠিক ${provider} মোবাইল নম্বর দিন (শুধু ডেমো)।`
        : `Enter a valid ${provider} mobile number (demo only).`;
  }

  return errors;
}
