import type { Lang } from '../types/grocery';

export interface TranslationStrings {
  brandName: string;
  brandTagline: string;
  announcement: {
    expressTag: string;
    freeDeliveryPrefix: string;
    freeDeliverySuffix: string;
    useCodePrefix: string;
    useCodeSuffix: string;
    orderByPhone: string;
    copyAria: string;
    copiedTitle: string;
    copiedDetail: string;
    dismissAria: string;
  };
  nav: {
    home: string;
    shop: string;
    categories: string;
    deals: string;
    contact: string;
    faq: string;
    searchPlaceholder: string;
    searchPlaceholderMobile: string;
    searchBtn: string;
    accountAria: string;
    wishlistAria: string;
    cartAria: string;
    allCategoriesBtn: string;
    sidebarTitle: string;
    quickLinksTitle: string;
    allProducts: string;
    todaysDeals: string;
    contactFaq: string;
    shopByCategory: string;
  };
  hero: {
    locationBadge: string;
    headline: string;
    subcopy: string;
    ctaShop: string;
    ctaDeals: string;
    freeDeliveryNote: string;
    helplineLabel: string;
    coldChainBadge: string;
    expressBadge: string;
    browseHarvest: string;
    guarantees: {
      deliveryTitle: string;
      deliveryDesc: string;
      freshTitle: string;
      freshDesc: string;
      savingsTitle: string;
      savingsDesc: string;
      hoursTitle: string;
      hoursDesc: string;
    };
  };
  home: {
    categoryHeading: string;
    categorySubtitle: string;
    allItemsLink: string;
    viewAll: string;
    flashTitle: string;
    flashSubtitle: string;
    bestTitle: string;
    bestSubtitle: string;
    fruitsVegTitle: string;
    fruitsVegSubtitle: string;
    meatFishTitle: string;
    meatFishSubtitle: string;
    dairyEggsTitle: string;
    dairyEggsSubtitle: string;
    riceOilTitle: string;
    riceOilSubtitle: string;
    snacksBevTitle: string;
    snacksBevSubtitle: string;
    saucesCandyTitle: string;
    saucesCandySubtitle: string;
    householdTitle: string;
    householdSubtitle: string;
    recentTitle: string;
    recentSubtitle: string;
    promoBadge: string;
    promoHeadline: string;
    promoBodyPrefix: string;
    promoBodyMid: string;
    promoBodySuffix: string;
    promoCtaApply: string;
    promoCtaBrowse: string;
    brandsTitle: string;
    brandsSubtitle: string;
    newsletterTitle: string;
    newsletterSubtitle: string;
    newsletterPlaceholder: string;
    newsletterBtn: string;
    newsletterSuccess: string;
    newsletterError: string;
    couponReadyTitle: string;
    couponReadyDetail: string;
  };
  product: {
    addToBag: string;
    addToCart: string;
    soldOut: string;
    outOfStock: string;
    inStock: string;
    inStockCount: string;
    save: string;
    quickView: string;
    oneHr: string;
    reviews: string;
    verifiedRatings: string;
    selectPack: string;
    choosePack: string;
    origin: string;
    freshnessStorage: string;
    dispatchTitle: string;
    dispatchDesc: string;
    qualityTitle: string;
    qualityDesc: string;
    orderNow: string;
    viewFullDetails: string;
    relatedTitle: string;
    moreIn: string;
    notFoundTitle: string;
    notFoundDesc: string;
    backToShop: string;
    productFocus: string;
    fullView: string;
    aisleContext: string;
  };
  shop: {
    allGroceries: string;
    allSubtitle: string;
    dealsTitle: string;
    dealsSubtitle: string;
    allCategories: string;
    filterCatalog: string;
    filterProducts: string;
    filtersBtn: string;
    foundLabel: string;
    categoriesLabel: string;
    priceRangeLabel: string;
    minLabel: string;
    maxLabel: string;
    under150: string;
    midRange: string;
    above400: string;
    availabilityRating: string;
    inStockOnly: string;
    minRating: string;
    allRatings: string;
    rating45: string;
    rating48: string;
    weightUnit: string;
    brandsLabel: string;
    resetFilters: string;
    filterSearchPlaceholder: string;
    sortPopular: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
    sortDiscount: string;
    sortNewest: string;
    showingOf: string;
    productsWord: string;
    forWord: string;
    clearFilters: string;
    emptyTitle: string;
    emptyDesc: string;
    showAllBtn: string;
  };
  cart: {
    yourBasket: string;
    clearAll: string;
    closeCart: string;
    unlockedFree: string;
    addMorePrefix: string;
    addMoreSuffix: string;
    emptyTitle: string;
    emptyDesc: string;
    browseGroceries: string;
    deliveryAreaLabel: string;
    freeOver: string;
    promoPlaceholder: string;
    apply: string;
    remove: string;
    appliedLabel: string;
    subtotal: string;
    productDiscounts: string;
    couponLabel: string;
    deliveryFee: string;
    free: string;
    total: string;
    proceedCheckout: string;
    floatingItems: string;
    floatingItemSingular: string;
    openCartAria: string;
  };
  account: {
    title: string;
    subtitle: string;
    storeHubTitle: string;
    address: string;
    wishlistItems: string;
    savedWishlist: string;
    currentBasket: string;
    recentOrders: string;
    noOrders: string;
    startShopping: string;
    orderNumber: string;
    demoConfirmed: string;
    itemsWord: string;
  };
  checkout: {
    demoTitle: string;
    demoDesc: string;
    pageTitle: string;
    section1Title: string;
    fullName: string;
    fullNamePlaceholder: string;
    phoneLabel: string;
    emailLabel: string;
    cityLabel: string;
    cityDefault: string;
    areaLabel: string;
    slotLabel: string;
    addressLabel: string;
    addressPlaceholder: string;
    notesLabel: string;
    notesPlaceholder: string;
    section2Title: string;
    walletLabelSuffix: string;
    placeOrderBtn: string;
    orderSummary: string;
    itemsCount: string;
    promoPlaceholder: string;
    clear: string;
    deliveryCharge: string;
    grandTotal: string;
    emptyTitle: string;
    emptyDesc: string;
    confirmedBadge: string;
    confirmedTitlePrefix: string;
    confirmedTitleSuffix: string;
    confirmedThankYou: string;
    deliveryDestination: string;
    phonePrefix: string;
    schedulePayment: string;
    methodPrefix: string;
    simulatedTag: string;
    dispatchHubNote: string;
    receiptSummary: string;
    eachWord: string;
    promoDiscount: string;
    totalPaidDemo: string;
    continueShopping: string;
    backHome: string;
    slots: string[];
    payments: {
      cod: { label: string; subtitle: string };
      bkash: { label: string; subtitle: string };
      nagad: { label: string; subtitle: string };
      card: { label: string; subtitle: string };
    };
  };
  wishlist: {
    title: string;
    subtitle: string;
    addAll: string;
    emptyTitle: string;
    emptyDesc: string;
    exploreBtn: string;
    addedAllToast: string;
  };
  contact: {
    badge: string;
    title: string;
    subtitle: string;
    hubHeading: string;
    locationLabel: string;
    address: string;
    helplineLabel: string;
    emailLabel: string;
    hoursLabel: string;
    hoursValue: string;
    callBtn: string;
    faqBtn: string;
    coverageTitle: string;
    coverageDesc: string;
    formTitle: string;
    formNote: string;
    successTitle: string;
    successDescPrefix: string;
    sendAnother: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    emailOptLabel: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitBtn: string;
    formError: string;
    toastTitle: string;
    toastDetail: string;
  };
  faq: {
    title: string;
    subtitle: string;
    zonesTitle: string;
    colArea: string;
    colEta: string;
    colFee: string;
    colFree: string;
    faqHeading: string;
    helpTitle: string;
    helpDescPrefix: string;
    helpDescMid: string;
    shopNow: string;
    items: { q: string; a: string }[];
  };
  notFound: {
    title: string;
    desc: string;
    backHome: string;
  };
  footer: {
    about: string;
    address: string;
    hours: string;
    popularAisles: string;
    customerService: string;
    catalogLink: string;
    dealsLink: string;
    wishlistLink: string;
    checkoutLink: string;
    faqLink: string;
    contactLink: string;
    deliveryTitle: string;
    deliveryDesc: string;
    acceptedPaymentsTitle: string;
    acceptedPaymentsList: string;
    pricesNote: string;
    callNow: string;
    copyright: string;
    showcaseNote: string;
  };
  toasts: {
    addedToCart: string;
    removedFromCart: string;
    outOfStock: string;
    restockSoon: string;
    savedWishlist: string;
    removedWishlist: string;
    couponApplied: string;
    demoOrderPlaced: string;
    demoReceiptNote: string;
  };
  units: Record<string, string>;
}

const EN: TranslationStrings = {
  brandName: 'Avado Grocery',
  brandTagline: 'Fresh Bangladeshi Market',
  announcement: {
    expressTag: 'Uttara Express:',
    freeDeliveryPrefix: 'Free delivery over',
    freeDeliverySuffix: 'in Uttara',
    useCodePrefix: 'Use code',
    useCodeSuffix: 'for 10% off',
    orderByPhone: 'Order by phone: 01722371905',
    copyAria: 'Copy promo code AVADO10',
    copiedTitle: 'Promo code AVADO10 copied',
    copiedDetail: 'Apply at cart or checkout for 10% off orders ৳500+.',
    dismissAria: 'Dismiss announcement',
  },
  nav: {
    home: 'Home',
    shop: 'Shop',
    categories: 'Categories',
    deals: 'Deals',
    contact: 'Contact',
    faq: 'Delivery FAQ',
    searchPlaceholder: 'Search for products (e.g. eggs, milk, rice)...',
    searchPlaceholderMobile: 'Search Miniket rice, mango, eggs...',
    searchBtn: 'Search',
    accountAria: 'Open saved account & demo orders',
    wishlistAria: 'Saved wishlist',
    cartAria: 'Open shopping cart',
    allCategoriesBtn: 'Categories',
    sidebarTitle: 'Browse Categories',
    quickLinksTitle: 'Quick Links',
    allProducts: 'All Products',
    todaysDeals: "Today's Deals",
    contactFaq: 'Contact & FAQ',
    shopByCategory: 'Shop by Category',
  },
  hero: {
    locationBadge: 'Uttara, Sector 11, Dhaka · Daily 1-Hour Express',
    headline: 'Fresh Bangladeshi Groceries Delivered in 1 Hour',
    subcopy:
      'Shop 70+ authentic kitchen essentials—Rajshahi mangoes, Padma Hilsa, Miniket rice, mustard oil & chilled dairy in transparent ৳ BDT prices.',
    ctaShop: 'Shop Fresh Groceries',
    ctaDeals: 'Flash Sales & Offers',
    freeDeliveryNote: 'Free delivery in Uttara over',
    helplineLabel: 'Helpline:',
    coldChainBadge: 'Chilled Cold-Chain',
    expressBadge: '45–60 Min Express Delivery in Uttara',
    browseHarvest: 'Shop Fresh Harvest',
    guarantees: {
      deliveryTitle: '1-Hour Dhaka Delivery',
      deliveryDesc: 'From ৳40 · Free in Uttara ৳1,500+',
      freshTitle: '100% Freshness Check',
      freshDesc: 'Hand-sorted produce & sealed packs',
      savingsTitle: 'Daily BDT Savings',
      savingsDesc: 'Code AVADO10 for 10% off ৳500+',
      hoursTitle: 'Open 7 AM – 11 PM',
      hoursDesc: 'COD, bKash & Nagad supported',
    },
  },
  home: {
    categoryHeading: 'Popular Categories',
    categorySubtitle: 'Freshly stocked aisles delivered to your doorstep in ৳ BDT.',
    allItemsLink: 'View All Products',
    viewAll: 'View All',
    flashTitle: 'Flash Sales',
    flashSubtitle: 'Limited-time price drops on everyday Dhaka favorites.',
    bestTitle: 'Best Selling Products',
    bestSubtitle: 'Most reordered groceries across Uttara and Dhaka.',
    fruitsVegTitle: 'Fresh Fruits & Vegetables',
    fruitsVegSubtitle: 'Rajshahi mangoes, Munshiganj potatoes, onions, and greens.',
    meatFishTitle: 'Fish, Meat & Seafood',
    meatFishSubtitle: 'Chandpur Padma Hilsa, river Rui, Deshi beef, and broiler chicken.',
    dairyEggsTitle: 'Dairy & Eggs',
    dairyEggsSubtitle: 'Aarong liquid milk, Mishti Doi, butter, cow ghee, and farm brown eggs.',
    riceOilTitle: 'Rice, Oil & Cooking Essentials',
    riceOilSubtitle: 'Miniket, Najirshail, Chinigura rice, soybean oil, and mustard oil.',
    snacksBevTitle: 'Snacks & Beverages',
    snacksBevSubtitle: 'Sylhet black tea, Olympic biscuits, noodles, coffee, and mango drinks.',
    saucesCandyTitle: 'Sauces, Pickles & Chocolates',
    saucesCandySubtitle: 'Mango achar, tomato ketchup, soy sauce, and premium chocolates.',
    householdTitle: 'Household & Personal Care',
    householdSubtitle: 'Wheel detergent, Vim dishwash, Bashundhara tissue, and Savlon soap.',
    recentTitle: 'Recently Viewed',
    recentSubtitle: 'Pick up right where you left off.',
    promoBadge: 'Monthly Pantry Offer',
    promoHeadline: 'Stock Your Rice, Oil & Spice Rack — Save 15%',
    promoBodyPrefix: 'Apply code',
    promoBodyMid: 'on orders of',
    promoBodySuffix: 'or more to save up to ৳500 on Miniket rice, mustard oil & spices.',
    promoCtaApply: 'Apply Code FRESH15 & Shop',
    promoCtaBrowse: 'Browse Oil & Spices',
    brandsTitle: 'Trusted Bangladeshi Brands',
    brandsSubtitle: 'Click any brand to explore authentic, sealed packs in our catalog.',
    newsletterTitle: 'Weekly Bazaar Price Drops in Your Inbox',
    newsletterSubtitle:
      'Get Rajshahi mango alerts, Friday fish market specials, and subscriber promo codes.',
    newsletterPlaceholder: 'you@example.com',
    newsletterBtn: 'Subscribe',
    newsletterSuccess: "You're subscribed! Watch for weekly ৳ BDT deals from Avado Grocery.",
    newsletterError: 'Please enter a valid email address to subscribe.',
    couponReadyTitle: 'Promo code FRESH15 ready',
    couponReadyDetail: 'Add ৳1,800+ to your basket to unlock 15% off.',
  },
  product: {
    addToBag: 'Add to Bag',
    addToCart: 'Add to Cart',
    soldOut: 'Sold Out',
    outOfStock: 'Out of Stock',
    inStock: 'In Stock',
    inStockCount: 'available',
    save: 'Save',
    quickView: 'Quick view',
    oneHr: '1 hr',
    reviews: 'reviews',
    verifiedRatings: 'verified buyer ratings',
    selectPack: 'Select Pack Size',
    choosePack: 'Choose Pack / Weight',
    origin: 'Origin',
    freshnessStorage: 'Freshness & Storage',
    dispatchTitle: 'Uttara Sector 11 Dispatch',
    dispatchDesc: '45–60 mins express · ৳40 fee (Free ৳1,500+)',
    qualityTitle: 'Quality Guarantee',
    qualityDesc: 'Easy doorstep return if unsatisfied',
    orderNow: 'Order Now',
    viewFullDetails: 'View full product details →',
    relatedTitle: 'Related & Similar Products',
    moreIn: 'More in',
    notFoundTitle: 'Product Not Found',
    notFoundDesc: 'This item may have been moved or is no longer listed in our catalog.',
    backToShop: 'Back to Shop',
    productFocus: 'Product Focus',
    fullView: 'Full Studio View',
    aisleContext: 'Category View',
  },
  shop: {
    allGroceries: 'All Fresh Groceries',
    allSubtitle: 'Browse Bangladeshi groceries, farm produce, fish, meat, dairy, and daily essentials.',
    dealsTitle: "Flash Sales & Today's Offers",
    dealsSubtitle: 'Curated Bangladeshi staples on limited-time ৳ BDT markdowns.',
    allCategories: 'All Categories',
    filterCatalog: 'Filter Catalog',
    filterProducts: 'Filter Products',
    filtersBtn: 'Filters',
    foundLabel: 'found',
    categoriesLabel: 'Categories',
    priceRangeLabel: 'Price Range (৳ BDT)',
    minLabel: 'Min ৳',
    maxLabel: 'Max ৳',
    under150: 'Under ৳150',
    midRange: '৳150–৳400',
    above400: '৳400+',
    availabilityRating: 'Availability & Rating',
    inStockOnly: 'In Stock Only',
    minRating: 'Minimum Customer Rating',
    allRatings: 'All Ratings',
    rating45: '4.5★ & above',
    rating48: '4.8★ & above',
    weightUnit: 'Weight / Unit',
    brandsLabel: 'Brands',
    resetFilters: 'Reset All Filters',
    filterSearchPlaceholder: 'Filter by name or brand...',
    sortPopular: 'Sort: Best Selling',
    sortPriceAsc: 'Price: Low to High (৳)',
    sortPriceDesc: 'Price: High to Low (৳)',
    sortDiscount: 'Biggest Discount',
    sortNewest: 'Newest Arrivals',
    showingOf: 'Showing',
    productsWord: 'products',
    forWord: 'for',
    clearFilters: 'Clear filters',
    emptyTitle: 'No matching groceries found',
    emptyDesc:
      'Try adjusting your price range in ৳, clearing brand filters, or searching for Miniket, Mango, Hilsa, or Milk.',
    showAllBtn: 'Show All Groceries',
  },
  cart: {
    yourBasket: 'Your Shopping Bag',
    clearAll: 'Clear all',
    closeCart: 'Close shopping cart',
    unlockedFree: 'Unlocked free delivery for your selected Dhaka zone.',
    addMorePrefix: 'Add',
    addMoreSuffix: 'more for free delivery',
    emptyTitle: 'Your shopping bag is empty',
    emptyDesc:
      'Fill your bag with fresh Bangladeshi fruits, Miniket rice, Padma Hilsa, milk, and daily essentials.',
    browseGroceries: 'Browse Fresh Groceries',
    deliveryAreaLabel: 'Dhaka Delivery Area',
    freeOver: 'Free',
    promoPlaceholder: 'Promo code (e.g. AVADO10)',
    apply: 'Apply',
    remove: 'Remove',
    appliedLabel: 'Applied',
    subtotal: 'Subtotal',
    productDiscounts: 'Product Discounts',
    couponLabel: 'Coupon',
    deliveryFee: 'Delivery Fee',
    free: 'Free',
    total: 'Total',
    proceedCheckout: 'Proceed to Checkout',
    floatingItems: 'ITEMS',
    floatingItemSingular: 'ITEM',
    openCartAria: 'Open shopping bag',
  },
  account: {
    title: 'Guest Shopper Hub',
    subtitle: 'Saved locally in your browser',
    storeHubTitle: 'Avado Grocery Store Hub',
    address: 'Uttara, Sector 11, Dhaka, Bangladesh',
    wishlistItems: 'Items',
    savedWishlist: 'Saved Wishlist',
    currentBasket: 'Current Bag',
    recentOrders: 'Recent Demo Orders',
    noOrders:
      'No demo orders placed yet. Complete a simulated checkout to see your receipt history here.',
    startShopping: 'Start Shopping →',
    orderNumber: 'Order #',
    demoConfirmed: 'Demo Confirmed',
    itemsWord: 'items',
  },
  checkout: {
    demoTitle: 'Frontend Checkout Demo',
    demoDesc:
      'This is an interactive frontend showcase for Avado Grocery. Orders are simulated locally in your browser and do not submit real payments or personal data to a server.',
    pageTitle: 'Checkout & Delivery Details',
    section1Title: '1. Customer & Delivery Address',
    fullName: 'Full Name *',
    fullNamePlaceholder: 'e.g. Nusrat Jahan',
    phoneLabel: 'Mobile Number (BD) *',
    emailLabel: 'Email Address *',
    cityLabel: 'City',
    cityDefault: 'Dhaka',
    areaLabel: 'Delivery Area (Dhaka Zone) *',
    slotLabel: 'Preferred Delivery Slot',
    addressLabel: 'Full Street Address (House, Road, Sector / Flat) *',
    addressPlaceholder: 'e.g. House 24, Road 9, Sector 11, Uttara',
    notesLabel: 'Delivery Notes (Optional)',
    notesPlaceholder: 'e.g. Call upon arrival at main gate, or pack fish separately.',
    section2Title: '2. Payment Method (Simulated Demo)',
    walletLabelSuffix: 'Account Number (Demo Simulation)',
    placeOrderBtn: 'Place Demo Order',
    orderSummary: 'Order Summary',
    itemsCount: 'items',
    promoPlaceholder: 'Enter promo code',
    clear: 'Clear',
    deliveryCharge: 'Delivery Charge',
    grandTotal: 'Grand Total',
    emptyTitle: 'Your Shopping Bag is Empty',
    emptyDesc: 'Add fresh groceries from Avado Grocery before proceeding to the demo checkout.',
    confirmedBadge: 'Frontend Demo Order Confirmed',
    confirmedTitlePrefix: 'Order #',
    confirmedTitleSuffix: 'Confirmed',
    confirmedThankYou:
      'Thank you, {name}. This is a simulated frontend demonstration — no real payment was charged or submitted to a server.',
    deliveryDestination: 'Delivery Destination',
    phonePrefix: 'Phone:',
    schedulePayment: 'Schedule & Payment',
    methodPrefix: 'Method:',
    simulatedTag: '(Simulated)',
    dispatchHubNote: 'Dispatched from Uttara, Sector 11 Hub',
    receiptSummary: 'Order Receipt Summary',
    eachWord: 'each',
    promoDiscount: 'Promo Discount',
    totalPaidDemo: 'Total Paid (Demo)',
    continueShopping: 'Continue Shopping',
    backHome: 'Back to Home',
    slots: [
      'Express (45–60 mins)',
      'Morning (8:00 AM – 11:00 AM)',
      'Afternoon (12:00 PM – 4:00 PM)',
      'Evening (5:00 PM – 9:00 PM)',
    ],
    payments: {
      cod: { label: 'Cash on Delivery (COD)', subtitle: 'Pay cash at your doorstep' },
      bkash: { label: 'bKash (Demo)', subtitle: 'Simulated bKash mobile wallet' },
      nagad: { label: 'Nagad (Demo)', subtitle: 'Simulated Nagad mobile wallet' },
      card: {
        label: 'Debit / Credit Card (Demo)',
        subtitle: 'Visa, Mastercard, NexusPay simulation',
      },
    },
  },
  wishlist: {
    title: 'Saved Wishlist',
    subtitle: 'Your favorite Bangladeshi groceries saved locally in your browser.',
    addAll: 'Add All to Bag',
    emptyTitle: 'No saved items yet',
    emptyDesc:
      'Tap the heart icon on any fruit, fish, rice, dairy, or pantry item to keep it handy for your next Dhaka grocery order.',
    exploreBtn: 'Explore Groceries',
    addedAllToast: 'Added {count} saved items to bag',
  },
  contact: {
    badge: 'Customer Support & Store Hub',
    title: 'Contact Avado Grocery',
    subtitle:
      'Have a question about family orders, 1-hour delivery in Uttara, or fresh Hilsa availability? Reach our team directly by phone or message.',
    hubHeading: 'Avado Grocery — Dhaka',
    locationLabel: 'Store & Dispatch Location',
    address: 'Uttara, Sector 11, Dhaka, Bangladesh',
    helplineLabel: 'Customer Helpline',
    emailLabel: 'Email Support',
    hoursLabel: 'Operating Hours',
    hoursValue: 'Every day, 7:00 AM – 11:00 PM',
    callBtn: 'Call 01722371905',
    faqBtn: 'Delivery Zones & FAQ',
    coverageTitle: 'Uttara Express Coverage',
    coverageDesc:
      'Dispatched directly from our temperature-controlled hub in Uttara, Sector 11, Dhaka, Bangladesh. Express deliveries reach Sectors 1–14 within 45–60 minutes, and free delivery applies on orders above ৳1,500.',
    formTitle: 'Send Us a Message',
    formNote: 'Frontend demo inquiry form — no data is transmitted to a remote server.',
    successTitle: 'Thank you for contacting Avado Grocery',
    successDescPrefix: 'Your demo inquiry has been recorded locally. For urgent orders in Uttara, call',
    sendAnother: 'Send Another Inquiry',
    nameLabel: 'Your Name *',
    namePlaceholder: 'Tanvir Ahmed',
    phoneLabel: 'Phone Number *',
    emailOptLabel: 'Email (Optional)',
    messageLabel: 'How can we help? *',
    messagePlaceholder: 'Ask about delivery times in Uttara, monthly pantry packs, or fresh produce...',
    submitBtn: 'Submit Inquiry',
    formError: 'Please fill in your name, phone number, and message.',
    toastTitle: 'Message received (Demo)',
    toastDetail: 'Our Uttara Sector 11 team will follow up shortly.',
  },
  faq: {
    title: 'Delivery Information & FAQ',
    subtitle: 'Transparent delivery charges in ৳ BDT from our Uttara, Sector 11 hub across Dhaka.',
    zonesTitle: 'Dhaka Delivery Zones & Fees',
    colArea: 'Delivery Area',
    colEta: 'Estimated Time',
    colFee: 'Standard Fee',
    colFree: 'Free Delivery Over',
    faqHeading: 'Frequently Asked Questions',
    helpTitle: 'Need help with an order?',
    helpDescPrefix: 'Call Avado Grocery at',
    helpDescMid: 'or visit us in Uttara, Sector 11.',
    shopNow: 'Shop Now',
    items: [
      {
        q: 'How fast is delivery in Uttara Sector 11 and nearby sectors?',
        a: 'Orders placed within Uttara Sectors 1 through 14 are dispatched from our Uttara Sector 11 hub and typically arrive within 45 to 60 minutes.',
      },
      {
        q: 'What is the minimum order for free delivery?',
        a: 'Delivery is free in Uttara Sectors 1–14 on orders of ৳1,500 or more. Other Dhaka zones qualify for free delivery between ৳1,800 and ৳2,500, or you can apply code FREEDEL on orders ৳600+.',
      },
      {
        q: 'How are fresh fish, meat, and dairy kept chilled during delivery?',
        a: 'Padma Hilsa, Rui, Deshi beef, Aarong milk, and frozen snacks travel in food-grade insulated cold boxes with chilled gel packs.',
      },
      {
        q: 'Which payment methods are supported on Avado Grocery?',
        a: 'In this frontend demo, you can simulate Cash on Delivery (COD), bKash, Nagad, and Card payments. No real charges are processed.',
      },
      {
        q: 'Can I return damaged produce or mismatched items at my doorstep?',
        a: 'Yes. If any fruit, vegetable, or sealed pack arrives bruised or below quality expectations, let our rider know at the doorstep or call 01722371905 for an immediate replacement.',
      },
    ],
  },
  notFound: {
    title: 'Aisle Not Found',
    desc: "The page you requested isn't available. Return to the Avado Grocery storefront to browse fresh Bangladeshi produce and staples.",
    backHome: 'Back to Home',
  },
  footer: {
    about:
      'Your trusted neighborhood online supermarket delivering fresh fruits, vegetables, Padma fish, rice, oil, dairy, and daily essentials across Uttara & Dhaka.',
    address: 'Uttara, Sector 11, Dhaka, Bangladesh',
    hours: 'Daily 7:00 AM – 11:00 PM',
    popularAisles: 'Popular Categories',
    customerService: 'Customer Service',
    catalogLink: 'All Products Catalog',
    dealsLink: 'Flash Sales & Offers',
    wishlistLink: 'Saved Wishlist',
    checkoutLink: 'Checkout & Payment Demo',
    faqLink: 'Delivery Info & FAQ',
    contactLink: 'Contact & Store Location',
    deliveryTitle: 'Dhaka Delivery & Payment',
    deliveryDesc:
      '45–60 minute express delivery in Uttara Sector 1–14. Same-day chilled delivery across Gulshan, Banani, Mirpur, Bashundhara & Dhanmondi.',
    acceptedPaymentsTitle: 'Accepted Payment Methods (Demo)',
    acceptedPaymentsList: 'Cash on Delivery · bKash · Nagad · Debit/Credit Card',
    pricesNote: 'All prices displayed in Bangladeshi Taka (৳ BDT).',
    callNow: 'Call Now',
    copyright: 'Avado Grocery · Uttara, Sector 11, Dhaka, Bangladesh. All rights reserved.',
    showcaseNote: 'Frontend E-Commerce Showcase · Prices in ৳ BDT',
  },
  toasts: {
    addedToCart: 'Added to bag',
    removedFromCart: 'Removed from bag',
    outOfStock: 'Currently out of stock',
    restockSoon: 'will be restocked soon.',
    savedWishlist: 'Saved to wishlist',
    removedWishlist: 'Removed from wishlist',
    couponApplied: 'Coupon {code} applied',
    demoOrderPlaced: 'Demo Order #{id} Placed',
    demoReceiptNote: 'Frontend demo receipt generated.',
  },
  units: {
    kg: 'kg',
    gram: 'g',
    litre: 'L',
    ml: 'ml',
    packet: 'pack',
    piece: 'pc',
    dozen: 'dozen',
  },
};

const BN: TranslationStrings = {
  brandName: 'অ্যাভাডো গ্রোসারি',
  brandTagline: 'টাটকা বাংলাদেশি সুপারশপ',
  announcement: {
    expressTag: 'উত্তরা এক্সপ্রেস:',
    freeDeliveryPrefix: 'উত্তরায়',
    freeDeliverySuffix: '+ অর্ডারে ফ্রি ডেলিভারি',
    useCodePrefix: 'কোড',
    useCodeSuffix: 'ব্যবহার করে ১০% ছাড় পান',
    orderByPhone: 'ফোনে অর্ডার: ০১৭২২৩৭১৯০৫',
    copyAria: 'প্রোমো কোড AVADO10 কপি করুন',
    copiedTitle: 'প্রোমো কোড AVADO10 কপি হয়েছে',
    copiedDetail: '৳৫০০+ অর্ডারে ১০% ছাড়ের জন্য ব্যাগ বা চেকআউটে ব্যবহার করুন।',
    dismissAria: 'ঘোষণা বন্ধ করুন',
  },
  nav: {
    home: 'হোম',
    shop: 'সকল পণ্য',
    categories: 'ক্যাটাগরি',
    deals: 'ফ্ল্যাশ সেল',
    contact: 'যোগাযোগ',
    faq: 'ডেলিভারি তথ্য',
    searchPlaceholder: 'পণ্য খুঁজুন (যেমন: ডিম, দুধ, মিনিকেট চাল)...',
    searchPlaceholderMobile: 'চাল, আম, ডিম বা তেল খুঁজুন...',
    searchBtn: 'খুঁজুন',
    accountAria: 'অ্যাকাউন্ট ও অর্ডার ইতিহাস দেখুন',
    wishlistAria: 'পছন্দের তালিকা',
    cartAria: 'শপিং ব্যাগ খুলুন',
    allCategoriesBtn: 'ক্যাটাগরি',
    sidebarTitle: 'সকল ক্যাটাগরি',
    quickLinksTitle: 'দ্রুত লিংক',
    allProducts: 'সকল পণ্য দেখুন',
    todaysDeals: 'আজকের ফ্ল্যাশ সেল',
    contactFaq: 'যোগাযোগ ও প্রশ্নোত্তর',
    shopByCategory: 'ক্যাটাগরি অনুযায়ী কিনুন',
  },
  hero: {
    locationBadge: 'উত্তরা, সেক্টর ১১, ঢাকা · ১ ঘন্টায় এক্সপ্রেস ডেলিভারি',
    headline: 'টাটকা বাংলাদেশি বাজার সদাই আপনার দরজায় ১ ঘন্টায়',
    subcopy:
      'রাজশাহীর আম, পদ্মার ইলিশ, মিনিকেট চাল, খাঁটি সরিষার তেল ও দুগ্ধজাত পণ্যসহ ৭০+ নিত্যপ্রয়োজনীয় পণ্য কিনুন সাশ্রয়ী ৳ টাকা দামে।',
    ctaShop: 'বাজার শুরু করুন',
    ctaDeals: 'ফ্ল্যাশ সেলস ও অফার',
    freeDeliveryNote: 'উত্তরায় ফ্রি ডেলিভারি',
    helplineLabel: 'হেল্পলাইন:',
    coldChainBadge: 'ঠান্ডা ও সুরক্ষিত ডেলিভারি',
    expressBadge: 'উত্তরায় ৪৫–৬০ মিনিটে এক্সপ্রেস ডেলিভারি',
    browseHarvest: 'টাটকা ফল ও সবজি দেখুন',
    guarantees: {
      deliveryTitle: '১ ঘন্টায় ঢাকা ডেলিভারি',
      deliveryDesc: '৳৪০ থেকে শুরু · উত্তরায় ৳১,৫০০+ এ ফ্রি',
      freshTitle: '১০০% সতেজতার নিশ্চয়তা',
      freshDesc: 'বাছাইকৃত তাজা ফল, মাছ ও সিলড প্যাক',
      savingsTitle: 'প্রতিদিন ৳ সাশ্রয়',
      savingsDesc: 'AVADO10 কোডে ৳৫০০+ এ ১০% ছাড়',
      hoursTitle: 'সকাল ৭টা – রাত ১১টা খোলা',
      hoursDesc: 'ক্যাশ অন ডেলিভারি, বিকাশ ও নগদ',
    },
  },
  home: {
    categoryHeading: 'জনপ্রিয় ক্যাটাগরি',
    categorySubtitle: 'প্রতিদিন সকালের তাজা পণ্য ও নিত্যপ্রয়োজনীয় সামগ্রী ৳ টাকা মূল্যে।',
    allItemsLink: 'সকল পণ্য দেখুন',
    viewAll: 'সব দেখুন',
    flashTitle: 'ফ্ল্যাশ সেলস',
    flashSubtitle: 'দৈনন্দিন বাজার সদাইয়ে সীমিত সময়ের বিশেষ মূল্যছাড়।',
    bestTitle: 'সবচেয়ে বেশি বিক্রিত পণ্য',
    bestSubtitle: 'উত্তরা ও ঢাকার পরিবারগুলোর নিয়মিত পছন্দের পণ্যসমূহ।',
    fruitsVegTitle: 'ফল এবং সবজি',
    fruitsVegSubtitle: 'রাজশাহীর আম, মুন্সিগঞ্জের আলু, দেশি পেঁয়াজ ও টাটকা শাকসবজি।',
    meatFishTitle: 'মাছ এবং মাংস',
    meatFishSubtitle: 'চাঁদপুরের পদ্মার ইলিশ, রুই মাছ, দেশি গরুর মাংস ও ব্রয়লার মুরগি।',
    dairyEggsTitle: 'দুগ্ধজাত দ্রব্য এবং ডিম',
    dairyEggsSubtitle: 'আড়ং তরল দুধ, মিষ্টি দই, মাখন, খাঁটি ঘি ও ফার্মের লাল ডিম।',
    riceOilTitle: 'রান্নাবান্না (চাল, তেল ও মসলা)',
    riceOilSubtitle: 'মিনিকেট, নাজিরশাইল, চিনিগুঁড়া পোলাও চাল, সয়াবিন ও সরিষার তেল।',
    snacksBevTitle: 'নাশতা ও পানীয়',
    snacksBevSubtitle: 'সিলেটের চা, অলিম্পিক বিস্কুট, নুডলস, কফি ও আমের জুস।',
    saucesCandyTitle: 'সস, আচার ও চকলেট',
    saucesCandySubtitle: 'আমের আচার, টমেটো কেচাপ, সয়া সস ও জনপ্রিয় চকলেট বার।',
    householdTitle: 'গৃহস্থালি ও ব্যক্তিগত যত্ন',
    householdSubtitle: 'হুইল ডিটারজেন্ট, ভিম লিকুইড, বসুন্ধরা টিস্যু ও স্যাভলন সাবান।',
    recentTitle: 'সম্প্রতি দেখা পণ্য',
    recentSubtitle: 'যেখান থেকে শেষ করেছিলেন সেখান থেকে আবার দেখুন।',
    promoBadge: 'মাসিক বাজার অফার',
    promoHeadline: 'মাসিক চাল, তেল ও মসলার বাজারে পান ১৫% বিশেষ ছাড়',
    promoBodyPrefix: 'কোড',
    promoBodyMid: 'ব্যবহার করুন',
    promoBodySuffix: 'বা তার বেশি অর্ডারে এবং মিনিকেট চাল, সরিষার তেল ও মসলায় পান ৳৫০০ পর্যন্ত ছাড়।',
    promoCtaApply: 'FRESH15 কোড প্রয়োগ ও কেনাকাটা',
    promoCtaBrowse: 'তেল ও মসলা দেখুন',
    brandsTitle: 'বিশ্বস্ত বাংলাদেশি ব্র্যান্ডসমূহ',
    brandsSubtitle: 'যেকোনো ব্র্যান্ডে ক্লিক করে আসল ও সিল করা পণ্য দেখুন।',
    newsletterTitle: 'সাপ্তাহিক বাজারের মূল্যছাড় জানুন সবার আগে',
    newsletterSubtitle:
      'মৌসুমি আমের অফার, শুক্রবারের মাছের বিশেষ মূল্য ও প্রোমো কোড সরাসরি ইমেইলে পান।',
    newsletterPlaceholder: 'apnar-email@example.com',
    newsletterBtn: 'সাবস্ক্রাইব',
    newsletterSuccess: 'সাবস্ক্রিপশন সম্পন্ন হয়েছে! প্রতি সপ্তাহে অ্যাভাডো গ্রোসারির ৳ অফার পাবেন।',
    newsletterError: 'অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা লিখুন।',
    couponReadyTitle: 'প্রোমো কোড FRESH15 প্রস্তুত',
    couponReadyDetail: '১৫% ছাড় পেতে ব্যাগে ৳১,৮০০+ টাকার পণ্য যোগ করুন।',
  },
  product: {
    addToBag: 'ব্যাগে যোগ করুন',
    addToCart: 'কার্টে যোগ করুন',
    soldOut: 'স্টক শেষ',
    outOfStock: 'স্টক নেই',
    inStock: 'স্টকে আছে',
    inStockCount: 'টি মজুদ',
    save: 'ছাড়',
    quickView: 'দ্রুত দেখুন',
    oneHr: '১ ঘন্টা',
    reviews: 'রিভিউ',
    verifiedRatings: 'জন ক্রেতার রিভিউ',
    selectPack: 'প্যাক সাইজ বাছাই করুন',
    choosePack: 'ওজন / প্যাক বেছে নিন',
    origin: 'উৎপত্তিস্থল',
    freshnessStorage: 'সতেজতা ও সংরক্ষণ',
    dispatchTitle: 'উত্তরা সেক্টর ১১ হাব থেকে ডেলিভারি',
    dispatchDesc: '৪৫–৬০ মিনিটে ডেলিভারি · ফি ৳৪০ (৳১,৫০০+ এ ফ্রি)',
    qualityTitle: 'মানের নিশ্চয়তা',
    qualityDesc: 'পণ্য পছন্দ না হলে দরজায় সহজ ফেরত সুবিধা',
    orderNow: 'এখনই অর্ডার করুন',
    viewFullDetails: 'পণ্যের বিস্তারিত দেখুন →',
    relatedTitle: 'সম্পর্কিত ও একই ধরনের পণ্য',
    moreIn: 'আরও দেখুন:',
    notFoundTitle: 'পণ্যটি পাওয়া যায়নি',
    notFoundDesc: 'এই পণ্যটি সরানো হয়েছে অথবা বর্তমানে ক্যাটালগে নেই।',
    backToShop: 'দোকানে ফিরে যান',
    productFocus: 'মূল ছবি',
    fullView: 'সম্পূর্ণ ছবি',
    aisleContext: 'ক্যাটাগরি ছবি',
  },
  shop: {
    allGroceries: 'সকল তাজা বাজার সদাই',
    allSubtitle: 'টাটকা ফল, সবজি, মাছ, মাংস, চাল, তেল, দুগ্ধজাত পণ্য ও নিত্যপ্রয়োজনীয় সামগ্রী।',
    dealsTitle: 'ফ্ল্যাশ সেলস ও আজকের অফার',
    dealsSubtitle: 'দৈনন্দিন বাংলাদেশি পণ্যে সীমিত সময়ের বিশেষ ৳ ছাড়।',
    allCategories: 'সকল ক্যাটাগরি',
    filterCatalog: 'পণ্য ফিল্টার',
    filterProducts: 'পণ্য বাছাই করুন',
    filtersBtn: 'ফিল্টার',
    foundLabel: 'টি পণ্য',
    categoriesLabel: 'ক্যাটাগরি',
    priceRangeLabel: 'মূল্য সীমা (৳ টাকা)',
    minLabel: 'সর্বনিম্ন ৳',
    maxLabel: 'সর্বোচ্চ ৳',
    under150: '৳১৫০ এর নিচে',
    midRange: '৳১৫০–৳৪০০',
    above400: '৳৪০০+',
    availabilityRating: 'স্টক ও রেটিং',
    inStockOnly: 'শুধু স্টকে থাকা পণ্য',
    minRating: 'ন্যূনতম ক্রেতা রেটিং',
    allRatings: 'সকল রেটিং',
    rating45: '৪.৫★ এবং তার বেশি',
    rating48: '৪.৮★ এবং তার বেশি',
    weightUnit: 'ওজন / একক',
    brandsLabel: 'ব্র্যান্ডসমূহ',
    resetFilters: 'ফিল্টার রিসেট করুন',
    filterSearchPlaceholder: 'নাম বা ব্র্যান্ড দিয়ে খুঁজুন...',
    sortPopular: 'সাজান: জনপ্রিয় পণ্য',
    sortPriceAsc: 'দাম: কম থেকে বেশি (৳)',
    sortPriceDesc: 'দাম: বেশি থেকে কম (৳)',
    sortDiscount: 'সর্বোচ্চ ছাড়',
    sortNewest: 'নতুন পণ্য',
    showingOf: 'মোট',
    productsWord: 'টি পণ্যের মধ্যে প্রদর্শিত',
    forWord: 'খোঁজা হচ্ছে:',
    clearFilters: 'ফিল্টার মুছুন',
    emptyTitle: 'কোনো পণ্য খুঁজে পাওয়া যায়নি',
    emptyDesc:
      '৳ মূল্য সীমা পরিবর্তন করুন, ব্র্যান্ড ফিল্টার মুছুন অথবা মিনিকেট চাল, আম, ইলিশ বা দুধ লিখে খুঁজুন।',
    showAllBtn: 'সকল পণ্য দেখুন',
  },
  cart: {
    yourBasket: 'আপনার শপিং ব্যাগ',
    clearAll: 'সব মুছুন',
    closeCart: 'ব্যাগ বন্ধ করুন',
    unlockedFree: 'আপনার নির্বাচিত এলাকায় ফ্রি ডেলিভারি চালু হয়েছে।',
    addMorePrefix: 'ফ্রি ডেলিভারির জন্য আরও',
    addMoreSuffix: 'টাকার পণ্য যোগ করুন',
    emptyTitle: 'আপনার শপিং ব্যাগ খালি',
    emptyDesc:
      'টাটকা ফল, মিনিকেট চাল, পদ্মার ইলিশ, দুধ এবং দৈনন্দিন বাজার সদাই দিয়ে আপনার ব্যাগ ভরুন।',
    browseGroceries: 'তাজা বাজার দেখুন',
    deliveryAreaLabel: 'ঢাকা ডেলিভারি এলাকা',
    freeOver: 'ফ্রি',
    promoPlaceholder: 'প্রোমো কোড (যেমন: AVADO10)',
    apply: 'প্রয়োগ',
    remove: 'মুছুন',
    appliedLabel: 'প্রয়োগ হয়েছে',
    subtotal: 'মোট মূল্য',
    productDiscounts: 'পণ্য ছাড়',
    couponLabel: 'কুপন',
    deliveryFee: 'ডেলিভারি চার্জ',
    free: 'ফ্রি',
    total: 'সর্বমোট',
    proceedCheckout: 'চেকআউট করুন',
    floatingItems: 'টি পণ্য',
    floatingItemSingular: 'টি পণ্য',
    openCartAria: 'শপিং ব্যাগ খুলুন',
  },
  account: {
    title: 'ক্রেতা প্রোফাইল হাব',
    subtitle: 'আপনার ব্রাউজারে সংরক্ষিত',
    storeHubTitle: 'অ্যাভাডো গ্রোসারি স্টোর হাব',
    address: 'উত্তরা, সেক্টর ১১, ঢাকা, বাংলাদেশ',
    wishlistItems: 'টি পণ্য',
    savedWishlist: 'পছন্দের তালিকা',
    currentBasket: 'বর্তমান ব্যাগ',
    recentOrders: 'সাম্প্রতিক ডেমো অর্ডার',
    noOrders: 'এখনো কোনো ডেমো অর্ডার করা হয়নি। চেকআউট সম্পন্ন করলে এখানে রসিদ দেখতে পাবেন।',
    startShopping: 'কেনাকাটা শুরু করুন →',
    orderNumber: 'অর্ডার #',
    demoConfirmed: 'ডেমো নিশ্চিত',
    itemsWord: 'টি পণ্য',
  },
  checkout: {
    demoTitle: 'ফ্রন্টএন্ড চেকআউট ডেমো',
    demoDesc:
      'এটি অ্যাভাডো গ্রোসারির একটি ফ্রন্টএন্ড প্রদর্শনী। অর্ডারগুলো ব্রাউজারে লোকালভাবে দেখানো হয় এবং কোনো বাস্তব পেমেন্ট বা সার্ভার ডেটা পাঠানো হয় না।',
    pageTitle: 'চেকআউট ও ডেলিভারি তথ্য',
    section1Title: '১. ক্রেতা ও ডেলিভারি ঠিকানা',
    fullName: 'পূর্ণ নাম *',
    fullNamePlaceholder: 'যেমন: নুসরাত জাহান',
    phoneLabel: 'মোবাইল নম্বর (বাংলাদেশ) *',
    emailLabel: 'ইমেইল ঠিকানা *',
    cityLabel: 'শহর',
    cityDefault: 'ঢাকা',
    areaLabel: 'ডেলিভারি এলাকা (ঢাকা জোন) *',
    slotLabel: 'পছন্দের ডেলিভারি সময়',
    addressLabel: 'বিস্তারিত ঠিকানা (বাসা, রোড, সেক্টর / ফ্ল্যাট) *',
    addressPlaceholder: 'যেমন: বাসা ২৪, রোড ৯, সেক্টর ১১, উত্তরা',
    notesLabel: 'ডেলিভারি নির্দেশনা (ঐচ্ছিক)',
    notesPlaceholder: 'যেমন: মেইন গেটে পৌঁছে কল দেবেন বা মাছ আলাদা প্যাকে দেবেন।',
    section2Title: '২. পেমেন্ট মাধ্যম (ডেমো সিমুলেশন)',
    walletLabelSuffix: 'অ্যাকাউন্ট নম্বর (শুধু ডেমো)',
    placeOrderBtn: 'ডেমো অর্ডার নিশ্চিত করুন',
    orderSummary: 'অর্ডার সারাংশ',
    itemsCount: 'টি পণ্য',
    promoPlaceholder: 'প্রোমো কোড লিখুন',
    clear: 'মুছুন',
    deliveryCharge: 'ডেলিভারি চার্জ',
    grandTotal: 'সর্বমোট বিল',
    emptyTitle: 'আপনার শপিং ব্যাগ খালি',
    emptyDesc: 'চেকআউট করার আগে অ্যাভাডো গ্রোসারি থেকে তাজা পণ্য ব্যাগে যোগ করুন।',
    confirmedBadge: 'ফ্রন্টএন্ড ডেমো অর্ডার নিশ্চিত হয়েছে',
    confirmedTitlePrefix: 'অর্ডার #',
    confirmedTitleSuffix: 'নিশ্চিত',
    confirmedThankYou:
      'ধন্যবাদ, {name}। এটি একটি ফ্রন্টএন্ড ডেমো — কোনো বাস্তব টাকা কাটা হয়নি বা সার্ভারে পাঠানো হয়নি।',
    deliveryDestination: 'ডেলিভারি গন্তব্য',
    phonePrefix: 'ফোন:',
    schedulePayment: 'সময়সূচি ও পেমেন্ট',
    methodPrefix: 'মাধ্যম:',
    simulatedTag: '(ডেমো)',
    dispatchHubNote: 'উত্তরা, সেক্টর ১১ হাব থেকে প্রেরিত',
    receiptSummary: 'অর্ডার রসিদ বিবরণ',
    eachWord: 'প্রতিটি',
    promoDiscount: 'প্রোমো ছাড়',
    totalPaidDemo: 'সর্বমোট পরিশোধিত (ডেমো)',
    continueShopping: 'আরও কেনাকাটা করুন',
    backHome: 'হোমে ফিরে যান',
    slots: [
      'এক্সপ্রেস (৪৫–৬০ মিনিট)',
      'সকাল (৮:০০ – ১১:০০)',
      'দুপুর (১২:০০ – ৪:০০)',
      'বিকাল/রাত (৫:০০ – ৯:০০)',
    ],
    payments: {
      cod: { label: 'ক্যাশ অন ডেলিভারি (COD)', subtitle: 'পণ্য হাতে পেয়ে নগদ টাকা দিন' },
      bkash: { label: 'বিকাশ (ডেমো)', subtitle: 'সিমুলেটেড বিকাশ মোবাইল ওয়ালেট' },
      nagad: { label: 'নগদ (ডেমো)', subtitle: 'সিমুলেটেড নগদ মোবাইল ওয়ালেট' },
      card: {
        label: 'ডেবিট / ক্রেডিট কার্ড (ডেমো)',
        subtitle: 'ভিসা, মাস্টারকার্ড ও নেক্সাসপে ডেমো',
      },
    },
  },
  wishlist: {
    title: 'সংরক্ষিত পছন্দের তালিকা',
    subtitle: 'আপনার পছন্দের বাংলাদেশি বাজার সদাই ব্রাউজারে সংরক্ষিত আছে।',
    addAll: 'সবগুলো ব্যাগে যোগ করুন',
    emptyTitle: 'এখনো কোনো পছন্দের পণ্য নেই',
    emptyDesc:
      'যেকোনো ফল, মাছ, চাল, দুধ বা মসলার হার্ট আইকনে ট্যাপ করে পরবর্তী ঢাকা বাজারের জন্য সংরক্ষণ করুন।',
    exploreBtn: 'পণ্য দেখুন',
    addedAllToast: '{count} টি পছন্দের পণ্য ব্যাগে যোগ হয়েছে',
  },
  contact: {
    badge: 'গ্রাহক সেবা ও স্টোর হাব',
    title: 'অ্যাভাডো গ্রোসারির সাথে যোগাযোগ',
    subtitle:
      'উত্তরায় ১ ঘন্টায় ডেলিভারি, পারিবারিক মাসিক অর্ডার বা টাটকা ইলিশ সম্পর্কে জানতে কল করুন অথবা বার্তা পাঠান।',
    hubHeading: 'অ্যাভাডো গ্রোসারি — ঢাকা',
    locationLabel: 'স্টোর ও ডেলিভারি কেন্দ্র',
    address: 'উত্তরা, সেক্টর ১১, ঢাকা, বাংলাদেশ',
    helplineLabel: 'কাস্টমার হেল্পলাইন',
    emailLabel: 'ইমেইল সাপোর্ট',
    hoursLabel: 'খোলা থাকার সময়',
    hoursValue: 'প্রতিদিন সকাল ৭:০০ – রাত ১১:০০',
    callBtn: 'কল করুন ০১৭২২৩৭১৯০৫',
    faqBtn: 'ডেলিভারি এলাকা ও প্রশ্নোত্তর',
    coverageTitle: 'উত্তরা এক্সপ্রেস কভারেজ',
    coverageDesc:
      'উত্তরা, সেক্টর ১১, ঢাকা, বাংলাদেশ হাব থেকে সরাসরি পাঠানো হয়। সেক্টর ১–১৪ এ ৪৫–৬০ মিনিটে ডেলিভারি এবং ৳১,৫০০+ অর্ডারে ফ্রি ডেলিভারি।',
    formTitle: 'আমাদের বার্তা পাঠান',
    formNote: 'ফ্রন্টএন্ড ডেমো ফর্ম — কোনো সার্ভারে ডেটা পাঠানো হয় না।',
    successTitle: 'অ্যাভাডো গ্রোসারিতে যোগাযোগের জন্য ধন্যবাদ',
    successDescPrefix: 'আপনার ডেমো বার্তা সংরক্ষিত হয়েছে। উত্তরায় জরুরি অর্ডারের জন্য কল করুন:',
    sendAnother: 'আরেকটি বার্তা পাঠান',
    nameLabel: 'আপনার নাম *',
    namePlaceholder: 'তানভীর আহমেদ',
    phoneLabel: 'ফোন নম্বর *',
    emailOptLabel: 'ইমেইল (ঐচ্ছিক)',
    messageLabel: 'কীভাবে সাহায্য করতে পারি? *',
    messagePlaceholder: 'উত্তরা ডেলিভারি সময়, মাসিক বাজার বা তাজা পণ্য সম্পর্কে লিখুন...',
    submitBtn: 'বার্তা পাঠান',
    formError: 'অনুগ্রহ করে আপনার নাম, ফোন নম্বর এবং বার্তা লিখুন।',
    toastTitle: 'বার্তা গৃহীত হয়েছে (ডেমো)',
    toastDetail: 'আমাদের উত্তরা সেক্টর ১১ টিম শীঘ্রই যোগাযোগ করবে।',
  },
  faq: {
    title: 'ডেলিভারি তথ্য ও সাধারণ প্রশ্নোত্তর',
    subtitle: 'উত্তরা সেক্টর ১১ হাব থেকে ঢাকার বিভিন্ন এলাকায় ডেলিভারি চার্জ ও সময়সূচি।',
    zonesTitle: 'ঢাকা ডেলিভারি এলাকা ও ফি',
    colArea: 'ডেলিভারি এলাকা',
    colEta: 'আনুমানিক সময়',
    colFee: 'ডেলিভারি ফি',
    colFree: 'ফ্রি ডেলিভারি সীমা',
    faqHeading: 'সচরাচর জিজ্ঞাসিত প্রশ্ন',
    helpTitle: 'অর্ডার সংক্রান্ত সাহায্য প্রয়োজন?',
    helpDescPrefix: 'কল করুন',
    helpDescMid: 'অথবা সরাসরি আসুন উত্তরা, সেক্টর ১১ শাখায়।',
    shopNow: 'কেনাকাটা করুন',
    items: [
      {
        q: 'উত্তরা সেক্টর ১১ ও আশেপাশের সেক্টরে কত দ্রুত ডেলিভারি হয়?',
        a: 'উত্তরা সেক্টর ১ থেকে ১৪ এর অর্ডারগুলো আমাদের উত্তরা সেক্টর ১১ হাব থেকে পাঠানো হয় এবং সাধারণত ৪৫ থেকে ৬০ মিনিটের মধ্যে পৌঁছে যায়।',
      },
      {
        q: 'ফ্রি ডেলিভারির জন্য সর্বনিম্ন কত টাকার অর্ডার করতে হবে?',
        a: 'উত্তরা সেক্টর ১–১৪ এ ৳১,৫০০ বা তার বেশি অর্ডারে ডেলিভারি সম্পূর্ণ ফ্রি। এছাড়া FREEDEL কোড ব্যবহার করে ৳৬০০+ অর্ডারে ফ্রি ডেলিভারি পেতে পারেন।',
      },
      {
        q: 'ডেলিভারির সময় মাছ, মাংস ও দুধ কীভাবে ঠান্ডা রাখা হয়?',
        a: 'পদ্মার ইলিশ, রুই, দেশি গরুর মাংস, আড়ং দুধ এবং হিমায়িত খাবার ফুড-গ্রেড ইনসুলেটেড বক্স ও আইস জেল প্যাকে পাঠানো হয়।',
      },
      {
        q: 'অ্যাভাডো গ্রোসারিতে কোন কোন পেমেন্ট মাধ্যম রয়েছে?',
        a: 'এই ফ্রন্টএন্ড ডেমোতে আপনি ক্যাশ অন ডেলিভারি (COD), বিকাশ, নগদ ও কার্ড পেমেন্ট সিমুলেট করতে পারবেন।',
      },
      {
        q: 'পণ্য নষ্ট বা পছন্দ না হলে কি দরজায় ফেরত দেওয়া যায়?',
        a: 'হ্যাঁ। কোনো ফল, সবজি বা প্যাক ক্ষতিগ্রস্ত হলে ডেলিভারির সময় রাইডারকে জানান অথবা ০১৭২২৩৭১৯০৫ নম্বরে কল করুন।',
      },
    ],
  },
  notFound: {
    title: 'পৃষ্ঠাটি পাওয়া যায়নি',
    desc: 'আপনি যে পৃষ্ঠাটি খুঁজছেন তা পাওয়া যায়নি। তাজা বাংলাদেশি বাজার সদাই কিনতে হোমপেজে ফিরে যান।',
    backHome: 'হোমে ফিরে যান',
  },
  footer: {
    about:
      'উত্তরা ও ঢাকার বিশ্বস্ত অনলাইন সুপারশপ—তাজা ফল, সবজি, পদ্মার মাছ, চাল, তেল, দুগ্ধজাত পণ্য ও নিত্যপ্রয়োজনীয় সামগ্রী পৌঁছে দিচ্ছি আপনার ঘরে।',
    address: 'উত্তরা, সেক্টর ১১, ঢাকা, বাংলাদেশ',
    hours: 'প্রতিদিন সকাল ৭:০০ – রাত ১১:০০',
    popularAisles: 'জনপ্রিয় ক্যাটাগরি',
    customerService: 'গ্রাহক সেবা',
    catalogLink: 'সকল পণ্যের তালিকা',
    dealsLink: 'ফ্ল্যাশ সেলস ও অফার',
    wishlistLink: 'পছন্দের তালিকা',
    checkoutLink: 'চেকআউট ও পেমেন্ট ডেমো',
    faqLink: 'ডেলিভারি তথ্য ও প্রশ্নোত্তর',
    contactLink: 'যোগাযোগ ও স্টোর লোকেশন',
    deliveryTitle: 'ঢাকা ডেলিভারি ও পেমেন্ট',
    deliveryDesc:
      'উত্তরা সেক্টর ১–১৪ এ ৪৫–৬০ মিনিটে এক্সপ্রেস ডেলিভারি। গুলশান, বনানী, মিরপুর, বসুন্ধরা ও ধানমন্ডিতে একই দিনে ডেলিভারি।',
    acceptedPaymentsTitle: 'গ্রহণযোগ্য পেমেন্ট মাধ্যম (ডেমো)',
    acceptedPaymentsList: 'ক্যাশ অন ডেলিভারি · বিকাশ · নগদ · ডেবিট/ক্রেডিট কার্ড',
    pricesNote: 'সকল পণ্যের দাম বাংলাদেশি টাকায় (৳ BDT) প্রদর্শিত।',
    callNow: 'কল করুন',
    copyright: 'অ্যাভাডো গ্রোসারি · উত্তরা, সেক্টর ১১, ঢাকা, বাংলাদেশ। সর্বস্বত্ব সংরক্ষিত।',
    showcaseNote: 'ফ্রন্টএন্ড ই-কমার্স শোকেস · সকল মূল্য ৳ টাকায়',
  },
  toasts: {
    addedToCart: 'ব্যাগে যোগ হয়েছে',
    removedFromCart: 'ব্যাগ থেকে সরানো হয়েছে',
    outOfStock: 'বর্তমানে স্টক নেই',
    restockSoon: 'শীঘ্রই পুনরায় স্টকে আসবে।',
    savedWishlist: 'পছন্দের তালিকায় যুক্ত হয়েছে',
    removedWishlist: 'পছন্দের তালিকা থেকে সরানো হয়েছে',
    couponApplied: 'কুপন {code} প্রয়োগ হয়েছে',
    demoOrderPlaced: 'ডেমো অর্ডার #{id} নিশ্চিত',
    demoReceiptNote: 'ফ্রন্টএন্ড ডেমো রসিদ তৈরি হয়েছে।',
  },
  units: {
    kg: 'কেজি',
    gram: 'গ্রাম',
    litre: 'লিটার',
    ml: 'মিলি',
    packet: 'প্যাক',
    piece: 'টি',
    dozen: 'ডজন',
  },
};

export const TRANSLATIONS: Record<Lang, TranslationStrings> = {
  en: EN,
  bn: BN,
};

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
}

export function formatNum(value: number | string, lang: Lang): string {
  return lang === 'bn' ? toBengaliDigits(value) : String(value);
}
