import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  ClipboardList,
  FolderTree,
  ImagePlus,
  Loader2,
  Mail,
  MapPin,
  Megaphone,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Tag,
  Trash2,
  Upload,
  User,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import type {
  Category,
  CategorySlug,
  CouponRule,
  OrderStatus,
  Product,
  UnitType,
} from '../types/grocery';
import { SafeImage } from '../components/SafeImage';
import { formatNum, toBengaliDigits } from '../i18n/translations';

interface AdminStats {
  total_products: number;
  out_of_stock: number;
  total_orders: number;
  open_orders: number;
  total_revenue: number;
  contact_messages: number;
}

interface AdminOrderItem {
  productId: string;
  name: string;
  nameBn: string;
  variantLabel: string;
  imageUrl?: string;
  unitPrice: number;
  quantity: number;
}

interface AdminOrderRow {
  id: string;
  orderId: string;
  customerKey: string;
  status: OrderStatus;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  areaName: string;
  areaNameBn?: string;
  address: string;
  city: string;
  paymentMethod: string;
  walletNumber: string | null;
  notes: string | null;
  deliverySlot: string;
  subtotal: number;
  itemSavings: number;
  couponDiscount: number;
  deliveryFee: number;
  total: number;
  couponCode: string | null;
  customerOrderCount: number;
  customerTotalSpent: number;
  items: AdminOrderItem[];
}

interface AdminCouponRow extends CouponRule {
  usageCount: number;
  createdAt?: string;
}

interface ContactMessageRow {
  id: number;
  name: string;
  phone: string;
  email: string;
  message: string;
  createdAt: string;
}

interface ProductDraft {
  id?: string;
  name: string;
  nameBn: string;
  brand: string;
  brandBn: string;
  category: CategorySlug;
  price: string;
  originalPrice: string;
  unit: string;
  unitBn: string;
  unitType: UnitType;
  stockCount: string;
  image: string;
  secondaryImages: string[];
  description: string;
  descriptionBn: string;
  isFlashDeal: boolean;
  isBestSeller: boolean;
}

interface CategoryDraft {
  editingSlug?: string;
  slug: string;
  name: string;
  nameBn: string;
  shortName: string;
  shortNameBn: string;
  description: string;
  descriptionBn: string;
  image: string;
}

interface CouponDraft {
  code: string;
  type: 'percent' | 'flat' | 'free-delivery';
  value: string;
  minSubtotal: string;
  maxDiscount: string;
  description: string;
  descriptionBn: string;
  showInBanner: boolean;
}

const EMPTY_DRAFT: ProductDraft = {
  name: '',
  nameBn: '',
  brand: 'Avado Fresh',
  brandBn: 'অ্যাভাডো ফ্রেশ',
  category: 'fruits',
  price: '',
  originalPrice: '',
  unit: '1 kg',
  unitBn: '১ কেজি',
  unitType: 'kg',
  stockCount: '30',
  image: '',
  secondaryImages: [],
  description: '',
  descriptionBn: '',
  isFlashDeal: false,
  isBestSeller: false,
};

const EMPTY_CATEGORY: CategoryDraft = {
  slug: '',
  name: '',
  nameBn: '',
  shortName: '',
  shortNameBn: '',
  description: '',
  descriptionBn: '',
  image: '',
};

const EMPTY_COUPON: CouponDraft = {
  code: '',
  type: 'percent',
  value: '10',
  minSubtotal: '500',
  maxDiscount: '400',
  description: '',
  descriptionBn: '',
  showInBanner: true,
};

export const AdminPage: React.FC = () => {
  const {
    lang,
    authUser,
    authToken,
    authLoading,
    signIn,
    signUp,
    categories,
    products,
    refreshCatalog,
    pushToast,
    formatPrice,
  } = useStore();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [loginName, setLoginName] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginInfo, setLoginInfo] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<
    'products' | 'categories' | 'orders' | 'coupons' | 'messages'
  >('products');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);
  const [adminCoupons, setAdminCoupons] = useState<AdminCouponRow[]>([]);
  const [messages, setMessages] = useState<ContactMessageRow[]>([]);
  const [loadingAdminData, setLoadingAdminData] = useState(false);

  // Product state
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState<ProductDraft>(EMPTY_DRAFT);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingSecondary, setUploadingSecondary] = useState(false);
  const [secondaryUrlInput, setSecondaryUrlInput] = useState('');
  const [uploadStats, setUploadStats] = useState<{
    originalSizeKB: number;
    sizeKB: number;
    savedPercent: number;
  } | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Category state
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [catDraft, setCatDraft] = useState<CategoryDraft>(EMPTY_CATEGORY);
  const [uploadingCatImage, setUploadingCatImage] = useState(false);
  const [catUploadStats, setCatUploadStats] = useState<{
    originalSizeKB: number;
    sizeKB: number;
    savedPercent: number;
  } | null>(null);
  const [savingCategory, setSavingCategory] = useState(false);
  const [confirmDeleteCategory, setConfirmDeleteCategory] = useState<string | null>(null);

  // Promo code state
  const [couponDraft, setCouponDraft] = useState<CouponDraft>(EMPTY_COUPON);
  const [savingCoupon, setSavingCoupon] = useState(false);
  const [confirmDeleteCoupon, setConfirmDeleteCoupon] = useState<string | null>(null);

  // Order & Customer inspection modal
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderRow | null>(null);

  const loadAdminData = useCallback(async () => {
    if (!authToken || authUser?.role !== 'admin') return;
    setLoadingAdminData(true);
    try {
      const headers = { Authorization: `Bearer ${authToken}` };
      const [ovRes, ordRes, coupRes] = await Promise.all([
        fetch('/api/admin/overview', { headers }),
        fetch('/api/admin/orders', { headers }),
        fetch('/api/admin/coupons', { headers }),
      ]);
      if (ovRes.ok) {
        const ovData = await ovRes.json();
        setStats(ovData.stats ?? null);
      }
      if (ordRes.ok) {
        const ordData = await ordRes.json();
        const nextOrders = Array.isArray(ordData.orders) ? ordData.orders : [];
        setOrders(nextOrders);
        setSelectedOrder((prev) =>
          prev ? nextOrders.find((o: AdminOrderRow) => o.id === prev.id) ?? prev : null
        );
        setMessages(Array.isArray(ordData.messages) ? ordData.messages : []);
      }
      if (coupRes.ok) {
        const cData = await coupRes.json();
        setAdminCoupons(Array.isArray(cData.coupons) ? cData.coupons : []);
      }
    } finally {
      setLoadingAdminData(false);
    }
  }, [authToken, authUser?.role]);

  useEffect(() => {
    void loadAdminData();
  }, [loadAdminData]);

  useEffect(() => {
    if (!selectedOrder) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedOrder(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedOrder]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.nameBn.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  const productCountByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) {
      map.set(p.category, (map.get(p.category) ?? 0) + 1);
    }
    return map;
  }, [products]);

  const selectedCustomerOrders = useMemo(() => {
    if (!selectedOrder) return [];
    return orders.filter((o) => o.customerKey === selectedOrder.customerKey);
  }, [orders, selectedOrder]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginInfo(null);
    setLoggingIn(true);
    try {
      if (authMode === 'signin') {
        const res = await signIn(loginEmail.trim(), loginPassword);
        if (!res.ok) {
          setLoginError(res.error || 'Sign in failed');
        } else {
          setLoginPassword('');
        }
      } else {
        const res = await signUp(
          loginEmail.trim(),
          loginPassword,
          loginName.trim() || 'Store Admin'
        );
        if (!res.ok) {
          setLoginError(res.error || 'Registration failed');
        } else if (res.needsConfirmation) {
          setLoginInfo(
            lang === 'bn'
              ? 'আপনার ইমেইলে ভেরিফিকেশন লিংক পাঠানো হয়েছে। কনফার্ম করে সাইন ইন করুন।'
              : 'Verification link sent to your email. Please confirm and sign in.'
          );
          setAuthMode('signin');
        } else {
          setLoginPassword('');
        }
      }
    } finally {
      setLoggingIn(false);
    }
  };

  const uploadImageToCdn = async (file: File, target: 'product' | 'category') => {
    if (!authToken) throw new Error('Not signed in');
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch(`/api/admin/upload?target=${target}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
      body: fd,
    });
    const data = await res.json();
    if (!res.ok || !data.url) {
      throw new Error(data.error || 'Upload failed');
    }
    return {
      url: String(data.url),
      originalSizeKB: Number(data.originalSizeKB ?? data.sizeKB ?? 0),
      sizeKB: Number(data.sizeKB ?? 0),
      savedPercent: Number(data.savedPercent ?? 0),
    };
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const uploaded = await uploadImageToCdn(file, 'product');
      setDraft((prev) => ({ ...prev, image: uploaded.url }));
      setUploadStats({
        originalSizeKB: uploaded.originalSizeKB,
        sizeKB: uploaded.sizeKB,
        savedPercent: uploaded.savedPercent,
      });
      pushToast({
        title: lang === 'bn' ? 'প্রধান ছবি WebP-তে আপলোড হয়েছে' : 'Primary WebP Image Uploaded',
        detail: `${uploaded.originalSizeKB} KB → ${uploaded.sizeKB} KB (${uploaded.savedPercent}% smaller)`,
        tone: 'success',
      });
    } catch (err) {
      pushToast({ title: (err as Error).message || 'Upload error', tone: 'warning' });
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleUploadSecondaryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploadingSecondary(true);
    try {
      const urls: string[] = [];
      for (const file of files) {
        const uploaded = await uploadImageToCdn(file, 'product');
        urls.push(uploaded.url);
      }
      setDraft((prev) => ({
        ...prev,
        secondaryImages: [...prev.secondaryImages, ...urls],
      }));
      pushToast({
        title:
          lang === 'bn'
            ? `${urls.length}টি সেকেন্ডারি ছবি যুক্ত হয়েছে`
            : `${urls.length} secondary image(s) added`,
        tone: 'success',
      });
    } catch (err) {
      pushToast({ title: (err as Error).message || 'Upload error', tone: 'warning' });
    } finally {
      setUploadingSecondary(false);
      e.target.value = '';
    }
  };

  const handleUploadCategoryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCatImage(true);
    try {
      const uploaded = await uploadImageToCdn(file, 'category');
      setCatDraft((prev) => ({ ...prev, image: uploaded.url }));
      setCatUploadStats({
        originalSizeKB: uploaded.originalSizeKB,
        sizeKB: uploaded.sizeKB,
        savedPercent: uploaded.savedPercent,
      });
      pushToast({
        title: lang === 'bn' ? 'ক্যাটাগরি ছবি WebP-তে আপলোড হয়েছে' : 'Category WebP Image Uploaded',
        detail: `${uploaded.originalSizeKB} KB → ${uploaded.sizeKB} KB (${uploaded.savedPercent}% smaller)`,
        tone: 'success',
      });
    } catch (err) {
      pushToast({ title: (err as Error).message || 'Upload error', tone: 'warning' });
    } finally {
      setUploadingCatImage(false);
      e.target.value = '';
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;
    setSavingProduct(true);
    try {
      const payload = {
        name: draft.name.trim(),
        nameBn: draft.nameBn.trim() || draft.name.trim(),
        brand: draft.brand.trim() || 'Avado Fresh',
        brandBn: draft.brandBn.trim() || draft.brand.trim() || 'অ্যাভাডো ফ্রেশ',
        category: draft.category,
        price: Number(draft.price),
        originalPrice: draft.originalPrice ? Number(draft.originalPrice) : null,
        unit: draft.unit.trim() || '1 kg',
        unitBn: draft.unitBn.trim() || draft.unit.trim(),
        unitType: draft.unitType,
        stockCount: Math.max(0, Number(draft.stockCount || 0)),
        inStock: Number(draft.stockCount || 0) > 0,
        image: draft.image.trim() || undefined,
        secondaryImages: draft.secondaryImages.map((u) => u.trim()).filter(Boolean),
        description: draft.description.trim() || undefined,
        descriptionBn: draft.descriptionBn.trim() || undefined,
        isFlashDeal: draft.isFlashDeal,
        isBestSeller: draft.isBestSeller,
      };

      const isEdit = Boolean(draft.id);
      const res = await fetch(
        isEdit ? `/api/admin/products/${draft.id}` : '/api/admin/products',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save product');

      await Promise.all([refreshCatalog(), loadAdminData()]);
      setShowForm(false);
      setDraft(EMPTY_DRAFT);
      setUploadStats(null);
      setSecondaryUrlInput('');
      pushToast({
        title: isEdit
          ? lang === 'bn'
            ? 'পণ্য আপডেট হয়েছে'
            : 'Product updated'
          : lang === 'bn'
          ? 'নতুন পণ্য যোগ হয়েছে'
          : 'Product added',
        detail: payload.name,
        tone: 'success',
      });
    } catch (err) {
      pushToast({
        title: (err as Error).message || 'Save failed',
        tone: 'warning',
      });
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!authToken) return;
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) throw new Error('Delete failed');
      setConfirmDeleteId(null);
      await Promise.all([refreshCatalog(), loadAdminData()]);
      pushToast({
        title: lang === 'bn' ? 'পণ্য মুছে ফেলা হয়েছে' : 'Product deleted',
        tone: 'info',
      });
    } catch (err) {
      pushToast({ title: (err as Error).message, tone: 'warning' });
    }
  };

  const handleToggleProductFlag = async (
    product: Product,
    patch: Partial<Pick<Product, 'inStock' | 'stockCount' | 'isFlashDeal' | 'isBestSeller'>>
  ) => {
    if (!authToken) return;
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error('Update failed');
      await Promise.all([refreshCatalog(), loadAdminData()]);
    } catch (err) {
      pushToast({ title: (err as Error).message, tone: 'warning' });
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;
    setSavingCategory(true);
    try {
      const isEdit = Boolean(catDraft.editingSlug);
      const payload = {
        slug: catDraft.slug.trim() || undefined,
        name: catDraft.name.trim(),
        nameBn: catDraft.nameBn.trim() || catDraft.name.trim(),
        shortName: catDraft.shortName.trim() || catDraft.name.trim(),
        shortNameBn: catDraft.shortNameBn.trim() || catDraft.nameBn.trim() || catDraft.name.trim(),
        description: catDraft.description.trim() || undefined,
        descriptionBn: catDraft.descriptionBn.trim() || undefined,
        image: catDraft.image.trim() || undefined,
      };
      const res = await fetch(
        isEdit
          ? `/api/admin/categories/${encodeURIComponent(catDraft.editingSlug!)}`
          : '/api/admin/categories',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save category');

      await Promise.all([refreshCatalog(), loadAdminData()]);
      setShowCategoryForm(false);
      setCatDraft(EMPTY_CATEGORY);
      setCatUploadStats(null);
      pushToast({
        title: isEdit
          ? lang === 'bn'
            ? 'ক্যাটাগরি আপডেট হয়েছে'
            : 'Category updated'
          : lang === 'bn'
          ? 'নতুন ক্যাটাগরি যোগ হয়েছে'
          : 'Category added',
        detail: payload.name,
        tone: 'success',
      });
    } catch (err) {
      pushToast({ title: (err as Error).message || 'Save failed', tone: 'warning' });
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (slug: string) => {
    if (!authToken) return;
    try {
      const res = await fetch(`/api/admin/categories/${encodeURIComponent(slug)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      setConfirmDeleteCategory(null);
      await Promise.all([refreshCatalog(), loadAdminData()]);
      pushToast({
        title: lang === 'bn' ? 'ক্যাটাগরি মুছে ফেলা হয়েছে' : 'Category deleted',
        detail: slug,
        tone: 'info',
      });
    } catch (err) {
      pushToast({ title: (err as Error).message, tone: 'warning' });
      setConfirmDeleteCategory(null);
    }
  };

  const handleOrderStatusChange = async (orderId: string, nextStatus: OrderStatus) => {
    if (!authToken) return;
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not update status');
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
      );
      setSelectedOrder((prev) =>
        prev && prev.id === orderId ? { ...prev, status: nextStatus } : prev
      );
      void loadAdminData();
      pushToast({
        title: lang === 'bn' ? 'অর্ডার স্ট্যাটাস আপডেট হয়েছে' : 'Order status updated',
        detail: nextStatus,
        tone: 'success',
      });
    } catch (err) {
      pushToast({ title: (err as Error).message, tone: 'warning' });
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;
    setSavingCoupon(true);
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          code: couponDraft.code.trim().toUpperCase(),
          type: couponDraft.type,
          value: couponDraft.type === 'free-delivery' ? 0 : Number(couponDraft.value || 0),
          minSubtotal: Number(couponDraft.minSubtotal || 0),
          maxDiscount: couponDraft.maxDiscount ? Number(couponDraft.maxDiscount) : null,
          description: couponDraft.description.trim() || undefined,
          descriptionBn: couponDraft.descriptionBn.trim() || undefined,
          showInBanner: couponDraft.showInBanner,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save promo code');

      setCouponDraft(EMPTY_COUPON);
      await Promise.all([refreshCatalog(), loadAdminData()]);
      pushToast({
        title: lang === 'bn' ? 'নতুন প্রমো কোড যোগ হয়েছে' : 'Promo code saved',
        detail: `${data.coupon?.code ?? couponDraft.code.toUpperCase()}`,
        tone: 'success',
      });
    } catch (err) {
      pushToast({ title: (err as Error).message, tone: 'warning' });
    } finally {
      setSavingCoupon(false);
    }
  };

  const handlePatchCoupon = async (
    code: string,
    patch: { active?: boolean; showInBanner?: boolean }
  ) => {
    if (!authToken) return;
    try {
      const res = await fetch(`/api/admin/coupons/${encodeURIComponent(code)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      await Promise.all([refreshCatalog(), loadAdminData()]);
      pushToast({
        title: lang === 'bn' ? 'প্রমো কোড আপডেট হয়েছে' : 'Promo code updated',
        detail: code,
        tone: 'success',
      });
    } catch (err) {
      pushToast({ title: (err as Error).message, tone: 'warning' });
    }
  };

  const handleDeleteCoupon = async (code: string) => {
    if (!authToken) return;
    try {
      const res = await fetch(`/api/admin/coupons/${encodeURIComponent(code)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) throw new Error('Delete failed');
      setConfirmDeleteCoupon(null);
      await Promise.all([refreshCatalog(), loadAdminData()]);
      pushToast({
        title: lang === 'bn' ? 'প্রমো কোড মুছে ফেলা হয়েছে' : 'Promo code deleted',
        detail: code,
        tone: 'info',
      });
    } catch (err) {
      pushToast({ title: (err as Error).message, tone: 'warning' });
    }
  };

  const startEditProduct = (p: Product) => {
    setDraft({
      id: p.id,
      name: p.name,
      nameBn: p.nameBn,
      brand: p.brand,
      brandBn: p.brandBn,
      category: p.category,
      price: String(p.price),
      originalPrice: p.originalPrice ? String(p.originalPrice) : '',
      unit: p.unit,
      unitBn: p.unitBn,
      unitType: p.unitType,
      stockCount: String(p.stockCount),
      image: p.image,
      secondaryImages: p.secondaryImages ? [...p.secondaryImages] : [],
      description: p.description,
      descriptionBn: p.descriptionBn,
      isFlashDeal: Boolean(p.isFlashDeal),
      isBestSeller: Boolean(p.isBestSeller),
    });
    setUploadStats(null);
    setSecondaryUrlInput('');
    setShowForm(true);
    setActiveTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startEditCategory = (cat: Category) => {
    setCatDraft({
      editingSlug: cat.slug,
      slug: cat.slug,
      name: cat.name,
      nameBn: cat.nameBn,
      shortName: cat.shortName,
      shortNameBn: cat.shortNameBn,
      description: cat.description,
      descriptionBn: cat.descriptionBn,
      image: cat.image,
    });
    setCatUploadStats(null);
    setShowCategoryForm(true);
    setActiveTab('categories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (authLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-slate-600">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-700 mb-3" />
        <p className="text-sm font-medium">
          {lang === 'bn' ? 'অ্যাডমিন সেশন যাচাই হচ্ছে...' : 'Checking admin session...'}
        </p>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-14">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">
                {lang === 'bn' ? 'অ্যাভাডো অ্যাডমিন প্যানেল' : 'Avado Admin Panel'}
              </h1>
              <p className="text-xs text-slate-500">
                {lang === 'bn'
                  ? 'স্টোর অ্যাডমিন অ্যাকাউন্ট দিয়ে সাইন ইন বা প্রথমবার রেজিস্টার করুন'
                  : 'Sign in or register your admin email (avadotech69@gmail.com)'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setLoginError(null);
              }}
              className={`py-2 rounded-lg cursor-pointer transition-colors ${
                authMode === 'signin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              {lang === 'bn' ? 'সাইন ইন' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setLoginError(null);
              }}
              className={`py-2 rounded-lg cursor-pointer transition-colors ${
                authMode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              {lang === 'bn' ? 'নতুন অ্যাকাউন্ট তৈরি' : 'Create Admin Account'}
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-3.5">
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'পূর্ণ নাম' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  placeholder="Avado Store Admin"
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'bn' ? 'অ্যাডমিন ইমেইল' : 'Admin Email'}
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="avadotech69@gmail.com"
                className="w-full h-11 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'bn' ? 'পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)' : 'Password (min 6 characters)'}
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            {loginError && <p className="text-xs text-orange-700">{loginError}</p>}
            {loginInfo && <p className="text-xs text-emerald-700">{loginInfo}</p>}
            <button
              type="submit"
              disabled={loggingIn}
              className="w-full h-11 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white text-sm font-bold cursor-pointer"
            >
              {loggingIn
                ? lang === 'bn'
                  ? 'অপেক্ষা করুন...'
                  : 'Please wait...'
                : authMode === 'signup'
                ? lang === 'bn'
                  ? 'অ্যাডমিন অ্যাকাউন্ট তৈরি করুন'
                  : 'Create Admin Account'
                : lang === 'bn'
                ? 'অ্যাডমিন প্যানেলে প্রবেশ করুন'
                : 'Sign In to Admin'}
            </button>
          </form>

          <p className="text-xs text-slate-500 text-center leading-relaxed">
            {lang === 'bn'
              ? 'কোনো পূর্ব-নির্ধারিত পাসওয়ার্ড নেই। প্রথমবার "নতুন অ্যাকাউন্ট তৈরি" ট্যাবে গিয়ে avadotech69@gmail.com ও নিজের পছন্দের পাসওয়ার্ড সেট করুন।'
              : 'No fixed password is stored. On your first visit, switch to "Create Admin Account" with avadotech69@gmail.com to set your own password.'}
          </p>
        </div>
      </div>
    );
  }

  if (authUser.role !== 'admin') {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl border border-orange-200 p-8 space-y-4">
          <AlertTriangle className="w-10 h-10 text-orange-600 mx-auto" />
          <h1 className="text-xl font-extrabold text-slate-900">
            {lang === 'bn' ? 'অ্যাডমিন অনুমতি নেই' : 'Admin Access Required'}
          </h1>
          <p className="text-sm text-slate-600">
            {lang === 'bn'
              ? `আপনি (${authUser.email}) সাধারণ ক্রেতা হিসেবে সাইন ইন আছেন।`
              : `You are signed in as ${authUser.email}, which does not have store admin permissions.`}
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-sm font-bold"
          >
            {lang === 'bn' ? 'স্টোরে ফিরে যান' : 'Return to Storefront'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{authUser.email}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {lang === 'bn' ? 'অ্যাভাডো স্টোর অ্যাডমিন ড্যাশবোর্ড' : 'Avado Store Admin Dashboard'}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => void Promise.all([refreshCatalog(), loadAdminData()])}
            className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loadingAdminData ? 'animate-spin' : ''}`} />
            <span>{lang === 'bn' ? 'রিফ্রেশ' : 'Refresh'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setCatDraft(EMPTY_CATEGORY);
              setCatUploadStats(null);
              setShowCategoryForm((prev) => !prev);
              setActiveTab('categories');
            }}
            className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl border border-emerald-700 text-emerald-800 hover:bg-emerald-50 text-sm font-bold cursor-pointer"
          >
            <FolderTree className="w-4 h-4" />
            <span>{lang === 'bn' ? 'নতুন ক্যাটাগরি' : 'Add Category'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setDraft({
                ...EMPTY_DRAFT,
                category: categories[0]?.slug ?? 'fruits',
              });
              setUploadStats(null);
              setSecondaryUrlInput('');
              setShowForm((prev) => !prev);
              setActiveTab('products');
            }}
            className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'bn' ? 'নতুন পণ্য যোগ করুন' : 'Add Product'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs font-semibold text-slate-500">
            {lang === 'bn' ? 'মোট পণ্য' : 'Total Products'}
          </p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
            {formatNum(stats?.total_products ?? products.length, lang)}
          </p>
          <p className="text-xs text-orange-600 mt-1 tabular-nums">
            {formatNum(stats?.out_of_stock ?? 0, lang)}{' '}
            {lang === 'bn' ? 'টি স্টক শেষ' : 'out of stock'}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs font-semibold text-slate-500">
            {lang === 'bn' ? 'মোট অর্ডার' : 'Total Orders'}
          </p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
            {formatNum(stats?.total_orders ?? orders.length, lang)}
          </p>
          <p className="text-xs text-emerald-700 mt-1 tabular-nums">
            {formatNum(stats?.open_orders ?? 0, lang)}{' '}
            {lang === 'bn' ? 'টি চলমান অর্ডার' : 'active orders'}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs font-semibold text-slate-500">
            {lang === 'bn' ? 'মোট বিক্রি' : 'Gross Sales'}
          </p>
          <p className="text-2xl font-extrabold text-emerald-800 mt-1 tabular-nums">
            {formatPrice(stats?.total_revenue ?? 0)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'bn' ? 'বাতিল বাদে সকল অর্ডার' : 'Non-cancelled orders'}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs font-semibold text-slate-500">
            {lang === 'bn' ? 'ক্রেতা মেসেজ' : 'Contact Messages'}
          </p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
            {formatNum(stats?.contact_messages ?? messages.length, lang)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'bn' ? 'কন্টাক্ট ফর্ম ইনবক্স' : 'From /contact form'}
          </p>
        </div>
      </div>

      {/* Add / Edit Category Form */}
      {showCategoryForm && (
        <form
          onSubmit={handleSaveCategory}
          className="bg-white rounded-2xl border border-emerald-200 p-5 sm:p-6 space-y-4 shadow-xs"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">
              {catDraft.editingSlug
                ? lang === 'bn'
                  ? 'ক্যাটাগরি সম্পাদনা করুন'
                  : `Edit Category (${catDraft.editingSlug})`
                : lang === 'bn'
                ? 'নতুন ক্যাটাগরি যোগ করুন'
                : 'Create New Category'}
            </h2>
            <button
              type="button"
              onClick={() => {
                setShowCategoryForm(false);
                setCatDraft(EMPTY_CATEGORY);
                setCatUploadStats(null);
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category Name (English) *
              </label>
              <input
                type="text"
                required
                value={catDraft.name}
                onChange={(e) => setCatDraft({ ...catDraft, name: e.target.value })}
                placeholder="e.g. Organic Honey & Dates"
                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ক্যাটাগরির নাম (বাংলা)
              </label>
              <input
                type="text"
                value={catDraft.nameBn}
                onChange={(e) => setCatDraft({ ...catDraft, nameBn: e.target.value })}
                placeholder="যেমন: খাঁটি মধু ও খেজুর"
                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                URL Slug (optional)
              </label>
              <input
                type="text"
                value={catDraft.slug}
                onChange={(e) => setCatDraft({ ...catDraft, slug: e.target.value })}
                placeholder="e.g. honey-dates"
                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Short Label (EN)
              </label>
              <input
                type="text"
                value={catDraft.shortName}
                onChange={(e) => setCatDraft({ ...catDraft, shortName: e.target.value })}
                placeholder="Honey & Dates"
                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description (EN)
              </label>
              <input
                type="text"
                value={catDraft.description}
                onChange={(e) => setCatDraft({ ...catDraft, description: e.target.value })}
                placeholder="Sundarbans raw honey, Medjool dates & natural sweeteners"
                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-20 h-20 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
              {catDraft.image ? (
                <SafeImage
                  src={catDraft.image}
                  alt={catDraft.name || 'Category preview'}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              ) : (
                <Upload className="w-6 h-6 text-slate-400" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer">
                  {uploadingCatImage ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>
                    {uploadingCatImage
                      ? lang === 'bn'
                        ? 'WebP হচ্ছে...'
                        : 'Compressing...'
                      : lang === 'bn'
                      ? 'ক্যাটাগরি ছবি আপলোড (Auto WebP)'
                      : 'Upload Category Image (Auto WebP)'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadCategoryImage}
                    disabled={uploadingCatImage}
                    className="sr-only"
                  />
                </label>
                {catUploadStats && (
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md tabular-nums">
                    {catUploadStats.originalSizeKB} KB → {catUploadStats.sizeKB} KB WebP (
                    {catUploadStats.savedPercent}% smaller)
                  </span>
                )}
              </div>
              <input
                type="url"
                value={catDraft.image}
                onChange={(e) => setCatDraft({ ...catDraft, image: e.target.value })}
                placeholder="https://... (or upload image above)"
                className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setShowCategoryForm(false);
                setCatDraft(EMPTY_CATEGORY);
                setCatUploadStats(null);
              }}
              className="px-4 h-10 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 cursor-pointer"
            >
              {lang === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={savingCategory}
              className="px-6 h-10 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white text-sm font-bold cursor-pointer"
            >
              {savingCategory
                ? lang === 'bn'
                  ? 'সংরক্ষণ হচ্ছে...'
                  : 'Saving...'
                : catDraft.editingSlug
                ? lang === 'bn'
                  ? 'ক্যাটাগরি আপডেট করুন'
                  : 'Save Category'
                : lang === 'bn'
                ? 'ক্যাটাগরি তৈরি করুন'
                : 'Create Category'}
            </button>
          </div>
        </form>
      )}

      {/* Add / Edit Product Form */}
      {showForm && (
        <form
          onSubmit={handleSaveProduct}
          className="bg-white rounded-2xl border border-emerald-200 p-5 sm:p-6 space-y-4 shadow-xs"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">
              {draft.id
                ? lang === 'bn'
                  ? 'পণ্য সম্পাদনা করুন'
                  : 'Edit Product'
                : lang === 'bn'
                ? 'নতুন পণ্য যোগ করুন'
                : 'Create New Product'}
            </h2>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setDraft(EMPTY_DRAFT);
                setUploadStats(null);
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Product Name (English) *
              </label>
              <input
                type="text"
                required
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="e.g. Fresh Rajshahi Mango"
                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                পণ্যের নাম (বাংলা)
              </label>
              <input
                type="text"
                value={draft.nameBn}
                onChange={(e) => setDraft({ ...draft, nameBn: e.target.value })}
                placeholder="যেমন: রাজশাহীর তাজা আম"
                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
              <select
                value={draft.category}
                onChange={(e) =>
                  setDraft({ ...draft, category: e.target.value as CategorySlug })
                }
                className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {lang === 'bn' ? c.nameBn : c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Brand</label>
              <input
                type="text"
                value={draft.brand}
                onChange={(e) => setDraft({ ...draft, brand: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sale Price (৳ BDT) *
              </label>
              <input
                type="number"
                required
                min={1}
                value={draft.price}
                onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Original Price (৳, optional)
              </label>
              <input
                type="number"
                min={1}
                value={draft.originalPrice}
                onChange={(e) => setDraft({ ...draft, originalPrice: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Unit (EN)</label>
              <input
                type="text"
                value={draft.unit}
                onChange={(e) => setDraft({ ...draft, unit: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ইউনিট (বাংলা)</label>
              <input
                type="text"
                value={draft.unitBn}
                onChange={(e) => setDraft({ ...draft, unitBn: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Stock Count</label>
              <input
                type="number"
                min={0}
                value={draft.stockCount}
                onChange={(e) => setDraft({ ...draft, stockCount: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description (English)
                </label>
                <input
                  type="text"
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  placeholder="Fresh quality grocery item from Avado..."
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  বিবরণ (বাংলা)
                </label>
                <input
                  type="text"
                  value={draft.descriptionBn}
                  onChange={(e) => setDraft({ ...draft, descriptionBn: e.target.value })}
                  placeholder="অ্যাভাডো গ্রোসারির বাছাইকৃত তাজা পণ্য..."
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Primary Image Upload (Sharp -> WebP -> Supabase avado-media) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-20 h-20 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
              {draft.image ? (
                <SafeImage
                  src={draft.image}
                  alt={draft.name || 'Preview'}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              ) : (
                <Upload className="w-6 h-6 text-slate-400" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer">
                  {uploadingImage ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>
                    {uploadingImage
                      ? lang === 'bn'
                        ? 'WebP অপ্টিমাইজ হচ্ছে...'
                        : 'Compressing to WebP...'
                      : lang === 'bn'
                      ? 'প্রধান ছবি আপলোড (Auto WebP)'
                      : 'Upload Primary Image (Auto WebP)'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadImage}
                    disabled={uploadingImage}
                    className="sr-only"
                  />
                </label>
                {uploadStats ? (
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md tabular-nums">
                    {uploadStats.originalSizeKB} KB → {uploadStats.sizeKB} KB WebP (
                    {uploadStats.savedPercent}% {lang === 'bn' ? 'সাশ্রয়' : 'smaller'})
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">
                    {lang === 'bn'
                      ? 'যেকোনো ফরম্যাটের ছবি স্বয়ংক্রিয়ভাবে ৫২০px WebP হয়ে Supabase CDN-এ সেভ হবে'
                      : 'Any JPG/PNG/AVIF is auto-compressed to 520px WebP on Supabase CDN'}
                  </span>
                )}
              </div>
              <input
                type="url"
                value={draft.image}
                onChange={(e) => setDraft({ ...draft, image: e.target.value })}
                placeholder="https://... (or upload primary image above)"
                className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Secondary / Gallery Images */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-bold text-slate-800">
                  {lang === 'bn'
                    ? 'সেকেন্ডারি / গ্যালারি ছবি (ঐচ্ছিক)'
                    : 'Secondary / Gallery Images (Optional)'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {lang === 'bn'
                    ? 'প্রোডাক্ট পেজে একসাথে একাধিক ছবি দেখাতে সেকেন্ডারি ছবি যোগ করুন'
                    : 'Shown as interactive gallery thumbnails on the product detail page'}
                </p>
              </div>
              <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold cursor-pointer">
                {uploadingSecondary ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ImagePlus className="w-3.5 h-3.5" />
                )}
                <span>
                  {uploadingSecondary
                    ? lang === 'bn'
                      ? 'আপলোড হচ্ছে...'
                      : 'Uploading...'
                    : lang === 'bn'
                    ? 'সেকেন্ডারি ছবি আপলোড'
                    : 'Upload Secondary Image(s)'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleUploadSecondaryImage}
                  disabled={uploadingSecondary}
                  className="sr-only"
                />
              </label>
            </div>

            {draft.secondaryImages.length > 0 && (
              <div className="flex flex-wrap gap-2.5">
                {draft.secondaryImages.map((imgUrl, idx) => (
                  <div
                    key={`${imgUrl}-${idx}`}
                    className="relative w-16 h-16 rounded-lg bg-white border border-slate-200 p-1"
                  >
                    <SafeImage
                      src={imgUrl}
                      alt={`Secondary ${idx + 1}`}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((prev) => ({
                          ...prev,
                          secondaryImages: prev.secondaryImages.filter((_, i) => i !== idx),
                        }))
                      }
                      aria-label="Remove secondary image"
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-xs cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="url"
                value={secondaryUrlInput}
                onChange={(e) => setSecondaryUrlInput(e.target.value)}
                placeholder="https://... (paste secondary image URL)"
                className="flex-1 h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <button
                type="button"
                onClick={() => {
                  const cleaned = secondaryUrlInput.trim();
                  if (!cleaned) return;
                  setDraft((prev) => ({
                    ...prev,
                    secondaryImages: [...prev.secondaryImages, cleaned],
                  }));
                  setSecondaryUrlInput('');
                }}
                className="px-3.5 h-9 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer"
              >
                {lang === 'bn' ? 'যোগ করুন' : 'Add URL'}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={draft.isFlashDeal}
                onChange={(e) => setDraft({ ...draft, isFlashDeal: e.target.checked })}
                className="rounded text-emerald-700 focus:ring-emerald-600"
              />
              <span className="font-medium text-slate-800">
                {lang === 'bn' ? 'ফ্ল্যাশ ডিলে দেখান' : 'Feature in Flash Deals'}
              </span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={draft.isBestSeller}
                onChange={(e) => setDraft({ ...draft, isBestSeller: e.target.checked })}
                className="rounded text-emerald-700 focus:ring-emerald-600"
              />
              <span className="font-medium text-slate-800">
                {lang === 'bn' ? 'বেস্ট সেলার হিসেবে মার্ক করুন' : 'Mark as Best Seller'}
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setDraft(EMPTY_DRAFT);
                setUploadStats(null);
              }}
              className="px-4 h-10 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 cursor-pointer"
            >
              {lang === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={savingProduct}
              className="px-6 h-10 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white text-sm font-bold cursor-pointer"
            >
              {savingProduct
                ? lang === 'bn'
                  ? 'সংরক্ষণ হচ্ছে...'
                  : 'Saving...'
                : draft.id
                ? lang === 'bn'
                  ? 'আপডেট সেভ করুন'
                  : 'Save Changes'
                : lang === 'bn'
                ? 'পণ্য তৈরি করুন'
                : 'Create Product'}
            </button>
          </div>
        </form>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-colors ${
            activeTab === 'products'
              ? 'bg-emerald-700 text-white'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>
            {lang === 'bn' ? 'পণ্য সমূহ' : 'Products'} ({formatNum(products.length, lang)})
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-colors ${
            activeTab === 'categories'
              ? 'bg-emerald-700 text-white'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>
            {lang === 'bn' ? 'ক্যাটাগরি' : 'Categories'} ({formatNum(categories.length, lang)})
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-colors ${
            activeTab === 'orders'
              ? 'bg-emerald-700 text-white'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>
            {lang === 'bn' ? 'অর্ডার ও কাস্টমার' : 'Orders'} ({formatNum(orders.length, lang)})
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('coupons')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-colors ${
            activeTab === 'coupons'
              ? 'bg-emerald-700 text-white'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>
            {lang === 'bn' ? 'প্রমো কোড' : 'Promo Codes'} ({formatNum(adminCoupons.length, lang)})
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('messages')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-colors ${
            activeTab === 'messages'
              ? 'bg-emerald-700 text-white'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>
            {lang === 'bn' ? 'মেসেজ' : 'Messages'} ({formatNum(messages.length, lang)})
          </span>
        </button>
      </div>

      {/* Tab 1: Products Table */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  lang === 'bn' ? 'পণ্য বা ব্র্যান্ড খুঁজুন...' : 'Filter by product, brand, category...'
                }
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <p className="text-xs text-slate-500 tabular-nums">
              {formatNum(filteredProducts.length, lang)}{' '}
              {lang === 'bn' ? 'টি পণ্য দেখানো হচ্ছে' : 'items shown'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-3 px-4">{lang === 'bn' ? 'পণ্য' : 'Product'}</th>
                  <th className="py-3 px-4">{lang === 'bn' ? 'ক্যাটাগরি' : 'Category'}</th>
                  <th className="py-3 px-4">{lang === 'bn' ? 'দাম' : 'Price'}</th>
                  <th className="py-3 px-4">{lang === 'bn' ? 'স্টক' : 'Stock'}</th>
                  <th className="py-3 px-4">{lang === 'bn' ? 'স্ট্যাটাস' : 'Flags'}</th>
                  <th className="py-3 px-4 text-right">{lang === 'bn' ? 'অ্যাকশন' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg bg-white border border-slate-200 p-1 shrink-0">
                          <SafeImage
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-contain mix-blend-multiply"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate max-w-[220px]">
                            {lang === 'bn' ? p.nameBn : p.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {lang === 'bn' ? p.brandBn : p.brand} ·{' '}
                            {lang === 'bn' ? p.unitBn : p.unit}
                            {p.secondaryImages && p.secondaryImages.length > 0
                              ? ` · +${p.secondaryImages.length} img`
                              : ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-slate-600">{p.category}</td>
                    <td className="py-3 px-4 tabular-nums">
                      <span className="font-bold text-emerald-900">{formatPrice(p.price)}</span>
                      {p.originalPrice && (
                        <span className="block text-xs text-slate-400 line-through">
                          {formatPrice(p.originalPrice)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 tabular-nums">
                      <button
                        type="button"
                        onClick={() =>
                          void handleToggleProductFlag(p, {
                            inStock: !p.inStock,
                            stockCount: !p.inStock ? Math.max(10, p.stockCount || 10) : 0,
                          })
                        }
                        className={`px-2.5 py-1 rounded-md text-xs font-bold cursor-pointer ${
                          p.inStock
                            ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                            : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                        }`}
                      >
                        {p.inStock
                          ? `${formatNum(p.stockCount, lang)} ${lang === 'bn' ? 'মজুদ' : 'in stock'}`
                          : lang === 'bn'
                          ? 'স্টক শেষ'
                          : 'Out of stock'}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() =>
                          void handleToggleProductFlag(p, { isFlashDeal: !p.isFlashDeal })
                        }
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                          p.isFlashDeal
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {p.isFlashDeal ? 'Flash Deal' : 'Standard'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => startEditProduct(p)}
                          aria-label={`Edit ${p.name}`}
                          className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-800 hover:border-emerald-300 cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        {confirmDeleteId === p.id ? (
                          <button
                            type="button"
                            onClick={() => void handleDeleteProduct(p.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-orange-600 text-white text-xs font-bold cursor-pointer"
                          >
                            {lang === 'bn' ? 'নিশ্চিত?' : 'Confirm'}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(p.id)}
                            aria-label={`Delete ${p.name}`}
                            className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-orange-600 hover:border-orange-300 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Categories Manager */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">
              {lang === 'bn'
                ? 'ক্যাটাগরি সমূহ (এডিট, ছবি পরিবর্তন ও নতুন যোগ)'
                : 'Store Categories (Create, Edit Image & Manage)'}
            </h2>
            <button
              type="button"
              onClick={() => {
                setCatDraft(EMPTY_CATEGORY);
                setCatUploadStats(null);
                setShowCategoryForm(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'নতুন ক্যাটাগরি' : 'Add Category'}</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {categories.map((cat) => {
              const count = productCountByCategory.get(cat.slug) ?? 0;
              return (
                <div
                  key={cat.slug}
                  className="p-4 rounded-xl border border-slate-200 flex items-center gap-3.5 bg-white hover:border-emerald-300 transition-colors"
                >
                  <div className="w-16 h-16 rounded-xl bg-white border border-slate-100 p-1 shrink-0">
                    <SafeImage
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">
                      {lang === 'bn' ? cat.nameBn : cat.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">/{cat.slug}</p>
                    <p className="text-xs font-semibold text-emerald-700 mt-0.5 tabular-nums">
                      {formatNum(count, lang)} {lang === 'bn' ? 'টি পণ্য' : 'products'}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEditCategory(cat)}
                      aria-label={`Edit category ${cat.name}`}
                      className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-800 hover:border-emerald-300 cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    {confirmDeleteCategory === cat.slug ? (
                      <button
                        type="button"
                        onClick={() => void handleDeleteCategory(cat.slug)}
                        className="px-2 py-1 rounded-lg bg-orange-600 text-white text-[11px] font-bold cursor-pointer"
                      >
                        {lang === 'bn' ? 'নিশ্চিত' : 'Yes'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteCategory(cat.slug)}
                        aria-label={`Delete category ${cat.name}`}
                        className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-orange-600 hover:border-orange-300 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Clickable Orders + Customer Analytics */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-sm text-slate-500">
              {lang === 'bn' ? 'এখনো কোনো অর্ডার আসেনি।' : 'No orders placed yet.'}
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedOrder(order);
                  }
                }}
                className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-sm p-5 space-y-3 transition-all cursor-pointer"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-slate-900">#{order.orderId}</span>
                      <span className="text-xs text-slate-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-bold tabular-nums">
                        {formatNum(order.customerOrderCount, lang)}{' '}
                        {lang === 'bn'
                          ? 'টি অর্ডার'
                          : order.customerOrderCount > 1
                          ? 'orders'
                          : 'order'}
                      </span>
                      {order.couponCode && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[11px] font-bold">
                          <Tag className="w-3 h-3" />
                          {order.couponCode}
                          {order.couponDiscount > 0 ? ` (-${formatPrice(order.couponDiscount)})` : ''}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      <strong className="text-slate-900">{order.customerName}</strong> ·{' '}
                      <span className="tabular-nums">{order.customerPhone}</span>
                      {order.customerEmail ? ` · ${order.customerEmail}` : ''} · {order.areaName}
                    </p>
                  </div>
                  <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    <span className="text-base font-extrabold text-emerald-900 tabular-nums">
                      {formatPrice(order.total)}
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        void handleOrderStatusChange(order.id, e.target.value as OrderStatus)
                      }
                      aria-label={`Order ${order.orderId} status`}
                      className="h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="out_for_delivery">Out for delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <span>
                      {lang === 'bn' ? 'ঠিকানা:' : 'Destination:'} {order.address}, {order.city}
                    </span>
                    <span>
                      {lang === 'bn' ? 'সময়:' : 'Slot:'} {order.deliverySlot}
                    </span>
                    <span>
                      {lang === 'bn' ? 'পেমেন্ট:' : 'Payment:'} {order.paymentMethod.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-emerald-800 font-bold hover:underline">
                    {lang === 'bn' ? 'কাস্টমার ও অর্ডার ডিটেইলস দেখুন →' : 'View customer & order details →'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {order.items.map((it, idx) => (
                    <span
                      key={`${order.id}-${idx}`}
                      className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700"
                    >
                      {lang === 'bn' ? it.nameBn : it.name} ({it.variantLabel}) × {it.quantity}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 4: Promo Codes Manager */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <form
            onSubmit={handleCreateCoupon}
            className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {lang === 'bn' ? 'নতুন প্রমো কোড তৈরি করুন' : 'Create Promo Code'}
                </h2>
                <p className="text-xs text-slate-500">
                  {lang === 'bn'
                    ? 'এক অ্যাকাউন্ট থেকে প্রতিটি কোড একবারই ব্যবহার করা যাবে। ব্যানারে দেখালে হোম পেজের উপরে স্বয়ংক্রিয়ভাবে শো করবে।'
                    : 'Each promo code is strictly limited to 1 use per customer account and syncs live to the top banner.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'প্রমো কোড *' : 'Promo Code *'}
                </label>
                <input
                  type="text"
                  required
                  value={couponDraft.code}
                  onChange={(e) =>
                    setCouponDraft({ ...couponDraft, code: e.target.value.toUpperCase() })
                  }
                  placeholder="ABADU10"
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 text-sm font-bold uppercase focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'ডিসকাউন্ট ধরন *' : 'Discount Type *'}
                </label>
                <select
                  value={couponDraft.type}
                  onChange={(e) =>
                    setCouponDraft({
                      ...couponDraft,
                      type: e.target.value as CouponDraft['type'],
                    })
                  }
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="percent">{lang === 'bn' ? 'শতাংশ (% ছাড়)' : 'Percentage (% off)'}</option>
                  <option value="flat">{lang === 'bn' ? 'নির্দিষ্ট টাকা (৳ ছাড়)' : 'Flat Amount (৳ off)'}</option>
                  <option value="free-delivery">
                    {lang === 'bn' ? 'ফ্রি ডেলিভারি' : 'Free Delivery'}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {couponDraft.type === 'percent'
                    ? lang === 'bn'
                      ? 'ডিসকাউন্ট (%) *'
                      : 'Discount (%) *'
                    : couponDraft.type === 'flat'
                    ? lang === 'bn'
                      ? 'ডিসকাউন্ট (৳) *'
                      : 'Discount (৳) *'
                    : lang === 'bn'
                    ? 'ভ্যালু'
                    : 'Value'}
                </label>
                <input
                  type="number"
                  min={couponDraft.type === 'free-delivery' ? 0 : 1}
                  disabled={couponDraft.type === 'free-delivery'}
                  required={couponDraft.type !== 'free-delivery'}
                  value={couponDraft.type === 'free-delivery' ? '0' : couponDraft.value}
                  onChange={(e) => setCouponDraft({ ...couponDraft, value: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 text-sm tabular-nums disabled:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'সর্বনিম্ন অর্ডার (৳)' : 'Min Subtotal (৳)'}
                </label>
                <input
                  type="number"
                  min={0}
                  value={couponDraft.minSubtotal}
                  onChange={(e) => setCouponDraft({ ...couponDraft, minSubtotal: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {couponDraft.type === 'percent' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'সর্বোচ্চ ছাড় (৳, ঐচ্ছিক)' : 'Max Discount Cap (৳, optional)'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={couponDraft.maxDiscount}
                    onChange={(e) => setCouponDraft({ ...couponDraft, maxDiscount: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'bn'
                    ? 'বিবরণ (ঐচ্ছিক - খালি রাখলে অটো তৈরি হবে)'
                    : 'Description (optional)'}
                </label>
                <input
                  type="text"
                  value={couponDraft.description}
                  onChange={(e) => setCouponDraft({ ...couponDraft, description: e.target.value })}
                  placeholder="e.g. 10% off orders ৳500+"
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={couponDraft.showInBanner}
                  onChange={(e) =>
                    setCouponDraft({ ...couponDraft, showInBanner: e.target.checked })
                  }
                  className="rounded text-emerald-700 focus:ring-emerald-600"
                />
                <span className="font-semibold text-slate-800">
                  {lang === 'bn'
                    ? 'ওয়েবসাইটের উপরের ব্যানারে দেখান ("Use code CODE for ...")'
                    : 'Feature in top announcement bar ("Use code CODE for ...")'}
                </span>
              </label>

              <button
                type="submit"
                disabled={savingCoupon}
                className="inline-flex items-center gap-1.5 px-5 h-10 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white text-sm font-bold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {savingCoupon
                    ? lang === 'bn'
                      ? 'সেভ হচ্ছে...'
                      : 'Saving...'
                    : lang === 'bn'
                    ? 'প্রমো কোড সেভ করুন'
                    : 'Save Promo Code'}
                </span>
              </button>
            </div>
          </form>

          {/* Existing Promo Codes Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="py-3 px-4">{lang === 'bn' ? 'কোড' : 'Code'}</th>
                    <th className="py-3 px-4">{lang === 'bn' ? 'অফার' : 'Discount Rule'}</th>
                    <th className="py-3 px-4">{lang === 'bn' ? 'ব্যবহার' : 'Used'}</th>
                    <th className="py-3 px-4">{lang === 'bn' ? 'টপ ব্যানার' : 'Top Banner'}</th>
                    <th className="py-3 px-4">{lang === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                    <th className="py-3 px-4 text-right">{lang === 'bn' ? 'ডিলিট' : 'Delete'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {adminCoupons.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-sm text-slate-500">
                        {lang === 'bn' ? 'কোনো প্রমো কোড নেই।' : 'No promo codes configured.'}
                      </td>
                    </tr>
                  ) : (
                    adminCoupons.map((c) => (
                      <tr key={c.code} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 font-extrabold text-emerald-900">
                            <Tag className="w-3.5 h-3.5" />
                            {c.code}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-900">
                            {c.type === 'percent'
                              ? lang === 'bn'
                                ? `${toBengaliDigits(c.value)}% ছাড়`
                                : `${c.value}% off`
                              : c.type === 'flat'
                              ? lang === 'bn'
                                ? `${formatPrice(c.value)} ছাড়`
                                : `${formatPrice(c.value)} flat off`
                              : lang === 'bn'
                              ? 'ফ্রি ডেলিভারি'
                              : 'Free delivery'}
                          </p>
                          <p className="text-xs text-slate-500">
                            {lang === 'bn' ? c.descriptionBn : c.description}
                          </p>
                        </td>
                        <td className="py-3 px-4 tabular-nums font-bold text-slate-700">
                          {formatNum(c.usageCount ?? 0, lang)}{' '}
                          {lang === 'bn' ? 'বার' : c.usageCount === 1 ? 'use' : 'uses'}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() =>
                              void handlePatchCoupon(c.code, { showInBanner: !c.showInBanner })
                            }
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                              c.showInBanner
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <Megaphone className="w-3.5 h-3.5" />
                            <span>
                              {c.showInBanner
                                ? lang === 'bn'
                                  ? 'ব্যানারে সক্রিয়'
                                  : 'In Top Banner'
                                : lang === 'bn'
                                ? 'ব্যানারে দেখান'
                                : 'Set Banner'}
                            </span>
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() =>
                              void handlePatchCoupon(c.code, { active: c.active === false })
                            }
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                              c.active !== false
                                ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {c.active !== false
                              ? lang === 'bn'
                                ? 'সচল'
                                : 'Active'
                              : lang === 'bn'
                              ? 'বিরতি'
                              : 'Paused'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          {confirmDeleteCoupon === c.code ? (
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => void handleDeleteCoupon(c.code)}
                                className="px-2.5 py-1.5 rounded-lg bg-orange-600 text-white text-xs font-bold cursor-pointer"
                              >
                                {lang === 'bn' ? 'নিশ্চিত ডিলিট' : 'Confirm Delete'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteCoupon(null)}
                                className="px-2 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 cursor-pointer"
                              >
                                {lang === 'bn' ? 'না' : 'Cancel'}
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteCoupon(c.code)}
                              aria-label={`Delete promo code ${c.code}`}
                              className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-orange-600 hover:border-orange-300 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Contact Messages */}
      {activeTab === 'messages' && (
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-sm text-slate-500">
              {lang === 'bn' ? 'কোনো ক্রেতা মেসেজ নেই।' : 'No contact messages yet.'}
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span className="font-bold text-slate-900">{msg.name}</span>
                    <span className="text-xs text-slate-500 tabular-nums">{msg.phone}</span>
                    {msg.email && <span className="text-xs text-slate-500">{msg.email}</span>}
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{msg.message}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Order & Customer Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label={`Order ${selectedOrder.orderId} Details`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedOrder(null);
          }}
        >
          <div className="bg-white w-full max-w-3xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-emerald-950 text-white flex items-center justify-between gap-4 shrink-0">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  {lang === 'bn' ? 'অর্ডার ও কাস্টমার ডিটেইলস' : 'Order & Customer Details'}
                </p>
                <h2 className="text-xl font-extrabold flex items-center gap-2">
                  <span>#{selectedOrder.orderId}</span>
                  <span className="text-xs font-medium text-emerald-200">
                    · {new Date(selectedOrder.createdAt).toLocaleString()}
                  </span>
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close order details"
                className="p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                  <p className="text-[11px] font-semibold text-emerald-800 uppercase">
                    {lang === 'bn' ? 'মোট অর্ডার দিয়েছে' : 'Total Orders Placed'}
                  </p>
                  <p className="text-xl font-extrabold text-emerald-950 mt-0.5 tabular-nums">
                    {formatNum(selectedOrder.customerOrderCount, lang)}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-100">
                  <p className="text-[11px] font-semibold text-amber-900 uppercase">
                    {lang === 'bn' ? 'কাস্টমারের মোট খরচ' : 'Customer Lifetime Spend'}
                  </p>
                  <p className="text-xl font-extrabold text-slate-900 mt-0.5 tabular-nums">
                    {formatPrice(selectedOrder.customerTotalSpent)}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] font-semibold text-slate-600 uppercase">
                    {lang === 'bn' ? 'এই অর্ডারের বিল' : 'This Order Total'}
                  </p>
                  <p className="text-xl font-extrabold text-emerald-900 mt-0.5 tabular-nums">
                    {formatPrice(selectedOrder.total)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 text-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{lang === 'bn' ? 'কাস্টমারের তথ্য' : 'Customer Profile'}</span>
                  </h3>
                  <p className="font-bold text-slate-900 text-base">{selectedOrder.customerName}</p>
                  <p className="text-xs text-slate-700 flex items-center gap-1.5 tabular-nums">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`tel:${selectedOrder.customerPhone}`} className="hover:underline">
                      {selectedOrder.customerPhone}
                    </a>
                  </p>
                  {selectedOrder.customerEmail && (
                    <p className="text-xs text-slate-700 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <a href={`mailto:${selectedOrder.customerEmail}`} className="hover:underline">
                        {selectedOrder.customerEmail}
                      </a>
                    </p>
                  )}
                  <p className="text-xs text-slate-600 pt-1">
                    <strong>{lang === 'bn' ? 'পেমেন্ট:' : 'Payment:'}</strong>{' '}
                    {selectedOrder.paymentMethod.toUpperCase()}
                    {selectedOrder.walletNumber ? ` (${selectedOrder.walletNumber})` : ''}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 text-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{lang === 'bn' ? 'ডেলিভারি ঠিকানা' : 'Delivery Destination'}</span>
                  </h3>
                  <p className="font-bold text-slate-900">{selectedOrder.address}</p>
                  <p className="text-xs text-slate-700">
                    {lang === 'bn'
                      ? selectedOrder.areaNameBn ?? selectedOrder.areaName
                      : selectedOrder.areaName}
                    , {selectedOrder.city}
                  </p>
                  <p className="text-xs text-slate-600">
                    <strong>{lang === 'bn' ? 'ডেলিভারি স্লট:' : 'Time Slot:'}</strong>{' '}
                    {selectedOrder.deliverySlot}
                  </p>
                  {selectedOrder.notes && (
                    <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-lg">
                      <strong>{lang === 'bn' ? 'নোট:' : 'Note:'}</strong> {selectedOrder.notes}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-sm font-bold text-slate-900">
                    {lang === 'bn' ? 'অর্ডারকৃত পণ্য সমূহ' : 'Ordered Items'} (
                    {formatNum(selectedOrder.items.length, lang)})
                  </h3>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) =>
                      void handleOrderStatusChange(selectedOrder.id, e.target.value as OrderStatus)
                    }
                    className="h-8 px-2.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-800"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="out_for_delivery">Out for delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {selectedOrder.items.map((it, idx) => (
                    <div
                      key={`${selectedOrder.id}-item-${idx}`}
                      className="flex items-center justify-between gap-3 px-4 py-2.5 bg-white"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {it.imageUrl && (
                          <div className="w-10 h-10 rounded-lg border border-slate-100 p-0.5 shrink-0 bg-white">
                            <SafeImage
                              src={it.imageUrl}
                              alt={it.name}
                              className="w-full h-full object-contain mix-blend-multiply"
                            />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {lang === 'bn' ? it.nameBn : it.name}
                          </p>
                          <p className="text-xs text-slate-500 tabular-nums">
                            {it.variantLabel} × {formatNum(it.quantity, lang)} (
                            {formatPrice(it.unitPrice)})
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-slate-900 tabular-nums shrink-0">
                        {formatPrice(it.unitPrice * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>{lang === 'bn' ? 'সাবটোটাল' : 'Subtotal'}</span>
                  <span className="font-semibold tabular-nums">
                    {formatPrice(selectedOrder.subtotal)}
                  </span>
                </div>
                {selectedOrder.couponCode && (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      <span>
                        {lang === 'bn' ? 'প্রমো কোড ব্যবহৃত:' : 'Promo Code Used:'}{' '}
                        <strong>{selectedOrder.couponCode}</strong>
                      </span>
                    </span>
                    <span className="tabular-nums">-{formatPrice(selectedOrder.couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>{lang === 'bn' ? 'ডেলিভারি চার্জ' : 'Delivery Charge'}</span>
                  <span className="font-semibold tabular-nums">
                    {selectedOrder.deliveryFee === 0
                      ? lang === 'bn'
                        ? 'ফ্রি'
                        : 'Free'
                      : formatPrice(selectedOrder.deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-emerald-950 pt-2 border-t border-slate-200">
                  <span>{lang === 'bn' ? 'সর্বমোট' : 'Grand Total'}</span>
                  <span className="tabular-nums">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>

              {selectedCustomerOrders.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">
                    {lang === 'bn'
                      ? `এই কাস্টমারের সকল অর্ডার (${formatNum(selectedCustomerOrders.length, lang)}টি)`
                      : `All Orders by This Customer (${selectedCustomerOrders.length})`}
                  </h3>
                  <div className="space-y-2">
                    {selectedCustomerOrders.map((hist) => {
                      const isCurrent = hist.id === selectedOrder.id;
                      return (
                        <button
                          key={hist.id}
                          type="button"
                          onClick={() => setSelectedOrder(hist)}
                          className={`w-full text-left px-4 py-2.5 rounded-xl border text-xs flex flex-wrap items-center justify-between gap-2 cursor-pointer transition-colors ${
                            isCurrent
                              ? 'border-emerald-600 bg-emerald-50/70'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">#{hist.orderId}</span>
                            <span className="text-slate-500">
                              {new Date(hist.createdAt).toLocaleDateString()}
                            </span>
                            <span className="text-slate-600">→ {hist.areaName}</span>
                            {hist.couponCode && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
                                {hist.couponCode}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold uppercase">
                              {hist.status}
                            </span>
                            <span className="font-extrabold text-emerald-900 tabular-nums">
                              {formatPrice(hist.total)}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
