import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCartTotals,
  filterAndSortProducts,
  formatBDT,
  getDiscountPercent,
  validateCheckoutForm,
  validateCoupon,
} from './groceryLogic';
import type { CartItem, Product } from '../types/grocery';

const sampleProducts: Product[] = [
  {
    id: 'p1',
    slug: 'aci-pure-miniket-rice',
    name: 'ACI Pure Miniket Rice',
    nameBn: 'এসিআই পিওর মিনিকেট চাল',
    brand: 'ACI Pure',
    brandBn: 'এসিআই পিওর',
    category: 'rice-grains',
    price: 395,
    originalPrice: 430,
    unit: '5 kg',
    unitBn: '৫ কেজি',
    unitType: 'kg',
    rating: 4.8,
    reviewCount: 240,
    inStock: true,
    stockCount: 30,
    description: 'Aged long-grain Miniket rice.',
    descriptionBn: 'বাছাইকৃত পুরনো মিনিকেট চাল।',
    origin: 'Dinajpur',
    originBn: 'দিনাজপুর',
    shelfLife: '12 months',
    shelfLifeBn: '১২ মাস',
    image: '/rice.jpg',
    isBestSeller: true,
    isFlashDeal: true,
  },
  {
    id: 'p2',
    slug: 'rajshahi-langra-mango',
    name: 'Rajshahi Langra Mango',
    nameBn: 'রাজশাহীর ল্যাংড়া আম',
    brand: 'Avado Farm Fresh',
    brandBn: 'অ্যাভাডো ফার্ম ফ্রেশ',
    category: 'fruits',
    price: 160,
    originalPrice: 200,
    unit: '1 kg',
    unitBn: '১ কেজি',
    unitType: 'kg',
    rating: 4.9,
    reviewCount: 310,
    inStock: true,
    stockCount: 50,
    description: 'Sweet seasonal Rajshahi mangoes.',
    descriptionBn: 'মিষ্টি মৌসুমি রাজশাহীর ল্যাংড়া আম।',
    origin: 'Rajshahi',
    originBn: 'রাজশাহী',
    shelfLife: '5 days',
    shelfLifeBn: '৫ দিন',
    image: '/mango.jpg',
    isNew: true,
  },
  {
    id: 'p3',
    slug: 'padma-hilsa-fish',
    name: 'Padma Fresh Hilsa (Ilish)',
    nameBn: 'পদ্মার তাজা ইলিশ মাছ',
    brand: 'Avado Fresh Catch',
    brandBn: 'অ্যাভাডো ফ্রেশ ক্যাচ',
    category: 'fish-meat',
    price: 1450,
    unit: '1 kg',
    unitBn: '১ কেজি',
    unitType: 'kg',
    rating: 4.7,
    reviewCount: 95,
    inStock: false,
    stockCount: 0,
    description: 'Fresh river Hilsa.',
    descriptionBn: 'চাঁদপুরের তাজা পদ্মার ইলিশ।',
    origin: 'Chandpur',
    originBn: 'চাঁদপুর',
    shelfLife: '2 days chilled',
    shelfLifeBn: '২ দিন',
    image: '/fish.jpg',
  },
];

test('formatBDT formats currency in English and Bengali Taka numerals', () => {
  assert.equal(formatBDT(1450), '৳1,450');
  assert.equal(formatBDT(395), '৳395');
  assert.equal(formatBDT(0), '৳0');
  assert.equal(formatBDT(1450, 'bn'), '৳১,৪৫০');
  assert.equal(formatBDT(165, 'bn'), '৳১৬৫');
});

test('getDiscountPercent computes rounded savings', () => {
  assert.equal(getDiscountPercent(160, 200), 20);
  assert.equal(getDiscountPercent(400, undefined), 0);
  assert.equal(getDiscountPercent(400, 350), 0);
});

test('validateCoupon validates thresholds and invalid codes in both EN and BN', () => {
  const valid = validateCoupon('avado10', 1000);
  assert.equal(valid.coupon?.code, 'AVADO10');
  assert.equal(valid.error, null);

  const tooLow = validateCoupon('FRESH15', 1000);
  assert.equal(tooLow.coupon, null);
  assert.match(tooLow.error ?? '', /1,800/);

  const tooLowBn = validateCoupon('FRESH15', 1000, 'bn');
  assert.equal(tooLowBn.coupon, null);
  assert.match(tooLowBn.error ?? '', /১,৮০০/);

  const unknown = validateCoupon('BADCODE', 1000);
  assert.equal(unknown.coupon, null);
  assert.match(unknown.error ?? '', /not valid/i);
});

test('calculateCartTotals computes subtotal, discount, and free delivery threshold', () => {
  const items: CartItem[] = [
    {
      productId: 'p1',
      variantLabel: '5 kg',
      variantLabelBn: '৫ কেজি',
      name: 'ACI Pure Miniket Rice',
      nameBn: 'এসিআই পিওর মিনিকেট চাল',
      brand: 'ACI Pure',
      brandBn: 'এসিআই পিওর',
      image: '/rice.jpg',
      unitPrice: 400,
      originalUnitPrice: 440,
      quantity: 2,
      category: 'rice-grains',
    },
  ];
  const underThreshold = calculateCartTotals(items, 'uttara-sector-11', 'AVADO10');
  assert.equal(underThreshold.subtotal, 800);
  assert.equal(underThreshold.itemSavings, 80);
  assert.equal(underThreshold.couponDiscount, 80);
  assert.equal(underThreshold.deliveryFee, 40);
  assert.equal(underThreshold.remainingForFreeDelivery, 700);
  assert.equal(underThreshold.total, 760);

  const overThreshold = calculateCartTotals(
    [{ ...items[0], quantity: 4 }],
    'uttara-sector-11',
    'AVADO10'
  );
  assert.equal(overThreshold.subtotal, 1600);
  assert.equal(overThreshold.deliveryFee, 0);
  assert.equal(overThreshold.remainingForFreeDelivery, 0);
  assert.equal(overThreshold.total, 1440);
});

test('filterAndSortProducts filters by English and Bengali query, stock, and price', () => {
  const riceOnly = filterAndSortProducts(sampleProducts, { query: 'miniket' });
  assert.equal(riceOnly.length, 1);
  assert.equal(riceOnly[0].id, 'p1');

  const mangoBangla = filterAndSortProducts(sampleProducts, { query: 'আম' });
  assert.equal(mangoBangla.length, 1);
  assert.equal(mangoBangla[0].id, 'p2');

  const inStockAsc = filterAndSortProducts(sampleProducts, {
    inStockOnly: true,
    sort: 'price-asc',
  });
  assert.deepEqual(
    inStockAsc.map((p) => p.id),
    ['p2', 'p1']
  );
});

test('validateCheckoutForm rejects invalid Bangladeshi phone and empty address in EN and BN', () => {
  const bad = validateCheckoutForm({
    fullName: 'Tariq',
    phone: '12345',
    email: 'tariq@example.com',
    areaId: 'uttara-sector-11',
    address: 'Short',
    city: 'Dhaka',
    deliverySlot: 'Morning',
    paymentMethod: 'bkash',
    walletNumber: '999',
  });
  assert.ok(bad.phone);
  assert.ok(bad.address);
  assert.ok(bad.walletNumber);

  const badBn = validateCheckoutForm(
    {
      fullName: 'ত',
      phone: '12345',
      email: 'bad',
      areaId: 'uttara-sector-11',
      address: 'ছোট',
      city: 'ঢাকা',
      deliverySlot: 'সকাল',
      paymentMethod: 'nagad',
      walletNumber: '111',
    },
    'bn'
  );
  assert.match(badBn.phone ?? '', /১১ সংখ্যার/);
  assert.match(badBn.walletNumber ?? '', /নগদ/);

  const good = validateCheckoutForm({
    fullName: 'Nusrat Jahan',
    phone: '01722371905',
    email: 'nusrat@example.com',
    areaId: 'uttara-sector-11',
    address: 'House 18, Road 12, Sector 11, Uttara',
    city: 'Dhaka',
    deliverySlot: 'Morning (9 AM - 12 PM)',
    paymentMethod: 'cod',
  });
  assert.deepEqual(good, {});
});
