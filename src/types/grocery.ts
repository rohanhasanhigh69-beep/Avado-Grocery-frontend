export type Lang = 'en' | 'bn';

export type CategorySlug = string;

export interface Category {
  slug: CategorySlug;
  name: string;
  nameBn: string;
  shortName: string;
  shortNameBn: string;
  description: string;
  descriptionBn: string;
  image: string;
  accentTint: string;
  itemCountLabel: string;
  itemCountLabelBn: string;
}

export interface ProductVariant {
  label: string;
  labelBn?: string;
  price: number;
  originalPrice?: number;
}

export type UnitType = 'kg' | 'gram' | 'litre' | 'ml' | 'piece' | 'packet' | 'dozen';

export interface Product {
  id: string;
  slug: string;
  name: string;
  nameBn: string;
  brand: string;
  brandBn: string;
  category: CategorySlug;
  price: number;
  originalPrice?: number;
  unit: string;
  unitBn: string;
  unitType: UnitType;
  variants?: ProductVariant[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  description: string;
  descriptionBn: string;
  origin: string;
  originBn: string;
  shelfLife: string;
  shelfLifeBn: string;
  deliveryEta?: string;
  deliveryEtaBn?: string;
  image: string;
  imageFocus?: string;
  secondaryImages?: string[];
  isBestSeller?: boolean;
  isFlashDeal?: boolean;
  isNew?: boolean;
  tags?: string[];
}

export interface CartItem {
  productId: string;
  variantLabel: string;
  variantLabelBn?: string;
  name: string;
  nameBn: string;
  brand: string;
  brandBn: string;
  image: string;
  imageFocus?: string;
  unitPrice: number;
  originalUnitPrice?: number;
  quantity: number;
  category: CategorySlug;
}

export interface DeliveryArea {
  id: string;
  name: string;
  nameBn: string;
  fee: number;
  freeThreshold: number;
  eta: string;
  etaBn: string;
}

export interface CouponRule {
  code: string;
  description: string;
  descriptionBn: string;
  type: 'percent' | 'flat' | 'free-delivery';
  value: number;
  minSubtotal: number;
  maxDiscount?: number;
  active?: boolean;
  showInBanner?: boolean;
}

export interface SiteMedia {
  heroBannerUrl: string;
  promoHarvestUrl: string;
}

export type SortOption = 'popular' | 'price-asc' | 'price-desc' | 'discount' | 'newest';

export interface ProductFilters {
  query?: string;
  category?: CategorySlug | 'all';
  minPrice?: number | null;
  maxPrice?: number | null;
  brands?: string[];
  unitTypes?: UnitType[];
  inStockOnly?: boolean;
  minRating?: number;
  dealsOnly?: boolean;
  sort?: SortOption;
}

export interface CartSummary {
  subtotal: number;
  itemSavings: number;
  couponDiscount: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  remainingForFreeDelivery: number;
  total: number;
  totalQuantity: number;
  appliedCoupon: CouponRule | null;
  couponError: string | null;
}

export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'card';

export interface OrderFormValues {
  fullName: string;
  phone: string;
  email: string;
  areaId: string;
  address: string;
  city: string;
  deliverySlot: string;
  paymentMethod: PaymentMethod;
  walletNumber?: string;
  notes?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface OrderRecord {
  id?: string;
  orderId: string;
  createdAt: string;
  status?: OrderStatus;
  customer: OrderFormValues;
  areaName: string;
  areaNameBn?: string;
  items: CartItem[];
  summary: CartSummary;
  isDemo?: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'customer' | 'admin';
  fullName?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  detail?: string;
  tone: 'success' | 'info' | 'warning';
}
