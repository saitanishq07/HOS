import { BusinessSettings, Product, Category, Customer, Invoice, Payment, Enquiry, GalleryItem, WorkOrder, RawMaterial, Artisan, LogisticsShipment } from '../types';

// Helper function to resolve image URLs reliably across relative subpaths (e.g. GitHub Pages /HOS/)
export const getImageUrl = (url?: string): string => {
  const base = import.meta.env.BASE_URL || '/';
  const prefix = base.endsWith('/') ? base : `${base}/`;
  if (!url) return `${prefix}logo.png`;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const clean = url.replace(/^(\.\/|\/)+/, '');
  return `${prefix}${clean}`;
};

// Initial verified business settings
export const initialSettings: BusinessSettings = {
  companyName: "House of Seetah",
  tagline: "Home Decor & Artifacts",
  gstin: "36AABCH9988K1Z5",
  email: "billing@houseofseetah.com",
  phone: "+91 98765 43210",
  address: "Suite 402, Heritage Crafts Plaza, Jubilee Hills, Hyderabad, Telangana - 500033",
  bankName: "HDFC Bank Ltd",
  accountName: "House of Seetah Private Limited",
  accountNumber: "50200088991122",
  ifscCode: "HDFC0001234",
  upiId: "houseofseetah@hdfcbank",
  invoicePrefix: "HOS-INV-",
  nextInvoiceNumber: 1007,
  terms: "1. All disputes subject to Hyderabad jurisdiction.\n2. Goods once sold cannot be returned after 7 days.\n3. Handcrafted artwork features authentic artisanal character.",
  logoUrl: "logo.png",
  signatureUrl: "",
  websiteTitle: "House of Seetah | Premium Indian Art & Handcrafted Decor",
  heroHeadline: "Indian Art & Heritage Crafted for Fine Spaces",
  heroSubtext: "Curated Pichwai medallions, Radha Krishna miniature paintings, framed brass reliefs, and traditional masks from master Indian artisans.",
  aboutText: "House of Seetah is a Hyderabad-based Indian art atelier located in Jubilee Hills. We curate traditional Indian wall art, handcrafted brassware, Pichwai medallions, and folk-inspired decor for fine homes, heritage villas, and luxury spaces."
};

export const initialCategories: Category[] = [
  { id: "pichwai", name: "Pichwai & Traditional Art", description: "Hand-painted sacred Pichwai art medallions with gold foil borders.", imageUrl: "/images/art_product_01.jpeg" },
  { id: "brassware", name: "Brassware & Relief Frames", description: "Hand-carved brass Nandi reliefs, Kamadhenu cows, and solid brass statues on silk brocade.", imageUrl: "/images/art_product_07.jpeg" },
  { id: "masks", name: "Traditional Masks & Sculptures", description: "Tribal and folk-inspired cultural masks, ritual wall hangings, and decorative animal motifs.", imageUrl: "/images/art_product_14.jpeg" },
  { id: "miniatures", name: "Miniature Paintings & Wall Art", description: "Hand-painted Radha Krishna court miniatures, Mughal floral canvases, and framed artwork.", imageUrl: "/images/art_product_21.jpeg" },
  { id: "decor", name: "Cultural Home Decor", description: "Handcrafted decorative vessels, urns, and heritage accent pieces.", imageUrl: "/images/art_product_28.jpeg" },
];

export const initialProducts: Product[] = [
  {
    id: "art-01",
    productCode: "HOS-PIC-001",
    productName: "Srinathji Pichwai Art Circular Medallion",
    title: "Srinathji Pichwai Art Circular Medallion",
    category: "Pichwai & Traditional Art",
    categoryId: "pichwai",
    categoryName: "Pichwai & Traditional Art",
    hsnCode: "97011010",
    unit: "Pcs",
    price: 18500,
    gstPercent: 12,
    description: "Hand-painted circular Pichwai art medallion depicting Lord Srinathji with gold leaf border and fine dot detail work.",
    imageUrl: "/images/art_product_01.jpeg",
    galleryImages: ["/images/art_product_01.jpeg", "/images/art_product_02.jpeg"],
    isAvailable: true,
    inStock: true,
    isFeatured: true,
    featured: true,
    dimensions: "24 x 24 Inches",
    medium: "Natural Pigments & Gold Leaf on Fabric",
    artworkEra: "Traditional Mewar School"
  },
  {
    id: "art-02",
    productCode: "HOS-PIC-002",
    productName: "Sacred Lotus Peacock Pichwai Panel",
    title: "Sacred Lotus Peacock Pichwai Panel",
    category: "Pichwai & Traditional Art",
    categoryId: "pichwai",
    categoryName: "Pichwai & Traditional Art",
    hsnCode: "97011010",
    unit: "Pcs",
    price: 22000,
    gstPercent: 12,
    description: "Traditional Rajasthan Pichwai painting featuring sacred dancing peacocks amongst lotus blooms.",
    imageUrl: "/images/art_product_02.jpeg",
    galleryImages: ["/images/art_product_02.jpeg"],
    isAvailable: true,
    inStock: true,
    isFeatured: true,
    featured: true,
    dimensions: "30 x 40 Inches",
    medium: "Stone Colors on Cotton Cloth"
  },
  {
    id: "art-03",
    productCode: "HOS-PIC-003",
    productName: "Hand-Painted Gopi Vrindavan Art Medallion",
    title: "Hand-Painted Gopi Vrindavan Art Medallion",
    category: "Pichwai & Traditional Art",
    categoryId: "pichwai",
    categoryName: "Pichwai & Traditional Art",
    hsnCode: "97011010",
    price: 19800,
    description: "Circular hand-painted artwork representing Vrindavan devotion in rich organic mineral pigments.",
    imageUrl: "/images/art_product_03.jpeg",
    inStock: true,
    featured: false,
    dimensions: "20 x 20 Inches",
    medium: "Mineral Pigments on Wood Board"
  },
  {
    id: "art-04",
    productCode: "HOS-PIC-004",
    productName: "Golden Tree of Life Handcrafted Art Plate",
    title: "Golden Tree of Life Handcrafted Art Plate",
    category: "Pichwai & Traditional Art",
    categoryId: "pichwai",
    categoryName: "Pichwai & Traditional Art",
    hsnCode: "97011010",
    price: 16500,
    description: "Decorative art plate featuring the traditional Indian Kalpavriksha tree of life motif.",
    imageUrl: "/images/art_product_04.jpeg",
    inStock: true,
    featured: true,
    dimensions: "18 x 18 Inches",
    medium: "24K Gold Foil Accent on Lacquer Board"
  },
  {
    id: "art-05",
    productCode: "HOS-MIN-005",
    productName: "Radha Krishna Eternal Devotion Medallion",
    title: "Radha Krishna Eternal Devotion Medallion",
    category: "Miniature Paintings & Wall Art",
    categoryId: "miniatures",
    categoryName: "Miniature Paintings & Wall Art",
    hsnCode: "97011010",
    price: 24500,
    description: "Hand-painted Indian miniature artwork depicting Radha and Krishna with gold halo framing.",
    imageUrl: "/images/art_product_05.jpeg",
    inStock: true,
    featured: true,
    dimensions: "24 x 36 Inches",
    medium: "Fine Squirrel Hair Brush on Handmade Paper"
  },
  {
    id: "art-06",
    productCode: "HOS-BRS-006",
    productName: "Framed Brass Nandi Relief on Golden Silk Brocade",
    title: "Framed Brass Nandi Relief on Golden Silk Brocade",
    category: "Brassware & Relief Frames",
    categoryId: "brassware",
    categoryName: "Brassware & Relief Frames",
    hsnCode: "83062990",
    price: 28500,
    description: "Solid hand-engraved brass Nandi bull relief mounted on royal golden brocade silk inside a round teak frame.",
    imageUrl: "/images/art_product_06.jpeg",
    inStock: true,
    featured: true,
    dimensions: "22 x 22 Inches",
    medium: "Hand-cast Solid Brass & Kanjeevaram Brocade Silk"
  },
  {
    id: "art-07",
    productCode: "HOS-BRS-007",
    productName: "Kamadhenu Sacred Cow Brass Wall Frame",
    title: "Kamadhenu Sacred Cow Brass Wall Frame",
    category: "Brassware & Relief Frames",
    categoryId: "brassware",
    categoryName: "Brassware & Relief Frames",
    hsnCode: "83062990",
    price: 26000,
    description: "Handcrafted brass Kamadhenu wish-fulfilling cow motif on patterned silk textile backdrop.",
    imageUrl: "/images/art_product_07.jpeg",
    inStock: true,
    featured: true,
    dimensions: "20 x 20 Inches",
    medium: "Etched Brass & Raw Silk Backdrop"
  },
  {
    id: "art-08",
    productCode: "HOS-MSK-008",
    productName: "Traditional Folk Art Ritual Mask Wall Hanging",
    title: "Traditional Folk Art Ritual Mask Wall Hanging",
    category: "Traditional Masks & Sculptures",
    categoryId: "masks",
    categoryName: "Traditional Masks & Sculptures",
    hsnCode: "44201000",
    price: 14500,
    description: "Authentic Indian tribal/folk-inspired carved & hand-painted ritual mask for heritage interiors.",
    imageUrl: "/images/art_product_08.jpeg",
    inStock: true,
    featured: true,
    dimensions: "14 x 24 Inches",
    medium: "Carved Teak Wood & Natural Vegetable Dyes"
  },
  {
    id: "art-09",
    productCode: "HOS-MSK-009",
    productName: "Terracotta & Wood Cultural Art Mask",
    title: "Terracotta & Wood Cultural Art Mask",
    category: "Traditional Masks & Sculptures",
    categoryId: "masks",
    categoryName: "Traditional Masks & Sculptures",
    hsnCode: "44201000",
    price: 12800,
    description: "Handcrafted decorative cultural mask featuring traditional facial embellishments.",
    imageUrl: "/images/art_product_09.jpeg",
    inStock: true,
    featured: false,
    dimensions: "12 x 18 Inches",
    medium: "Baked Clay & Hand-carved Hardwood"
  },
  {
    id: "art-10",
    productCode: "HOS-DEC-010",
    productName: "Hand-Painted Floral Heritage Decorative Plate",
    title: "Hand-Painted Floral Heritage Decorative Plate",
    category: "Cultural Home Decor",
    categoryId: "decor",
    categoryName: "Cultural Home Decor",
    hsnCode: "69139000",
    price: 9500,
    description: "Artisanal hand-painted decorative wooden vessel with traditional Mughal botanical vines.",
    imageUrl: "/images/art_product_10.jpeg",
    inStock: true,
    featured: false,
    dimensions: "16 Inches Diameter",
    medium: "Enamel Hand Paint on Sheesham Wood"
  },
  {
    id: "art-11",
    productCode: "HOS-PIC-011",
    productName: "Hand-Painted Royal Elephant Motif Canvas",
    title: "Hand-Painted Royal Elephant Motif Canvas",
    category: "Pichwai & Traditional Art",
    categoryId: "pichwai",
    categoryName: "Pichwai & Traditional Art",
    hsnCode: "97011010",
    price: 21000,
    description: "Ceremonial royal elephant with traditional jhool embroidery detail painted on wood panel.",
    imageUrl: "/images/art_product_11.jpeg",
    inStock: true,
    featured: true,
    dimensions: "24 x 30 Inches",
    medium: "Temper-on-Canvas with Gold Detailing"
  },
  {
    id: "art-12",
    productCode: "HOS-BRS-012",
    productName: "Hand-Casting Antique Brass Seetah Figurine",
    title: "Hand-Casting Antique Brass Seetah Figurine",
    category: "Brassware & Relief Frames",
    categoryId: "brassware",
    categoryName: "Brassware & Relief Frames",
    hsnCode: "83062990",
    price: 24500,
    description: "Solid brass cheetah statue with hand-chiseled spot motifs and antique dark patina finish.",
    imageUrl: "/images/art_product_12.jpeg",
    inStock: true,
    featured: true,
    dimensions: "18 x 8 Inches",
    medium: "Lost-Wax Cast Solid Brass"
  }
];

// Add remaining client images as catalog products up to 45
for (let i = 13; i <= 45; i++) {
  const numStr = i < 10 ? `0${i}` : `${i}`;
  const catNames = [
    "Pichwai & Traditional Art",
    "Brassware & Relief Frames",
    "Traditional Masks & Sculptures",
    "Miniature Paintings & Wall Art",
    "Cultural Home Decor"
  ];
  const catIds = ["pichwai", "brassware", "masks", "miniatures", "decor"];
  const catIndex = (i - 1) % 5;

  initialProducts.push({
    id: `art-${numStr}`,
    productCode: `HOS-ART-${numStr}`,
    productName: `Masterpiece Heritage Art Collection #${numStr}`,
    title: `Masterpiece Heritage Art Collection #${numStr}`,
    category: catNames[catIndex],
    categoryId: catIds[catIndex],
    categoryName: catNames[catIndex],
    hsnCode: "97011010",
    unit: "Pcs",
    price: 12000 + (i * 350),
    gstPercent: 12,
    description: `Exquisite Indian traditional artwork crafted by heritage master artisans. Piece #${numStr} from the House of Seetah archival collection.`,
    imageUrl: `/images/art_product_${numStr}.jpeg`,
    galleryImages: [`/images/art_product_${numStr}.jpeg`],
    isAvailable: true,
    inStock: true,
    isFeatured: i % 4 === 0,
    featured: i % 4 === 0,
    dimensions: "24 x 36 Inches",
    medium: "Handcrafted Mixed Media & Natural Pigments"
  });
}

export const initialCustomers: Customer[] = [
  {
    id: "cust-1",
    name: "Rajeshwar Rao",
    companyName: "Royal Heritage Villas",
    gstin: "36ABCDE1234F1Z8",
    mobile: "+91 99887 76655",
    phone: "+91 99887 76655",
    email: "rajeshwar@heritagevillas.in",
    billingAddress: "Plot 88, Road No. 12, Banjara Hills, Hyderabad - 500034",
    address: "Plot 88, Road No. 12, Banjara Hills, Hyderabad - 500034",
    shippingAddress: "Plot 88, Road No. 12, Banjara Hills, Hyderabad - 500034",
    city: "Hyderabad",
    state: "36 - Telangana",
    totalInvoices: 3,
    totalSpent: 125000,
    notes: "VIP Art Collector - Interested in Pichwai medallions and brass Nandi frames.",
    createdAt: "2026-06-15T10:00:00.000Z"
  },
  {
    id: "cust-2",
    name: "Sunita Agarwal",
    companyName: "Agarwal Design Studio",
    gstin: "27AAACA9876A1Z3",
    mobile: "+91 98200 11223",
    phone: "+91 98200 11223",
    email: "sunita@agarwalstudio.com",
    billingAddress: "45 Worli Sea Face, Mumbai, Maharashtra - 400030",
    address: "45 Worli Sea Face, Mumbai, Maharashtra - 400030",
    shippingAddress: "45 Worli Sea Face, Mumbai, Maharashtra - 400030",
    city: "Mumbai",
    state: "27 - Maharashtra",
    totalInvoices: 2,
    totalSpent: 98000,
    notes: "Interior Architect - Regular purchaser of traditional art pieces.",
    createdAt: "2026-07-01T11:30:00.000Z"
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: "inv-1001",
    invoiceNumber: "HOS-2026-001",
    invoiceDate: "2026-07-15",
    issueDate: "2026-07-15",
    dueDate: "2026-07-30",
    customerId: "cust-1",
    customerName: "Rajeshwar Rao",
    customerCompany: "Royal Heritage Villas",
    customerGstin: "36ABCDE1234F1Z8",
    customerEmail: "rajeshwar@heritagevillas.in",
    customerMobile: "+91 99887 76655",
    customerPhone: "+91 99887 76655",
    billingAddress: "Plot 88, Road No. 12, Banjara Hills, Hyderabad - 500034",
    shippingAddress: "Plot 88, Road No. 12, Banjara Hills, Hyderabad - 500034",
    placeOfSupply: "36 - Telangana",
    items: [
      {
        productId: "art-01",
        productCode: "HOS-PIC-001",
        productName: "Srinathji Pichwai Art Circular Medallion",
        productTitle: "Srinathji Pichwai Art Circular Medallion",
        description: "Hand-painted circular Pichwai art medallion",
        hsnCode: "97011010",
        unit: "Pcs",
        quantity: 1,
        unitPrice: 18500,
        discountPercent: 0,
        taxRate: 12,
        gstPercent: 12,
        subtotal: 18500,
        taxableAmount: 18500,
        gstAmount: 2220,
        cgstRate: 6,
        cgstAmount: 1110,
        sgstRate: 6,
        sgstAmount: 1110,
        igstRate: 0,
        igstAmount: 0,
        totalAmount: 20720,
        total: 20720
      },
      {
        productId: "art-06",
        productCode: "HOS-BRS-006",
        productName: "Framed Brass Nandi Relief on Golden Silk Brocade",
        productTitle: "Framed Brass Nandi Relief on Golden Silk Brocade",
        description: "Solid hand-engraved brass Nandi bull relief",
        hsnCode: "83062990",
        unit: "Pcs",
        quantity: 1,
        unitPrice: 28500,
        discountPercent: 0,
        taxRate: 12,
        gstPercent: 12,
        subtotal: 28500,
        taxableAmount: 28500,
        gstAmount: 3420,
        cgstRate: 6,
        cgstAmount: 1710,
        sgstRate: 6,
        sgstAmount: 1710,
        igstRate: 0,
        igstAmount: 0,
        totalAmount: 31920,
        total: 31920
      }
    ],
    subtotal: 47000,
    totalDiscount: 0,
    discountAmount: 0,
    totalGst: 5640,
    totalTax: 5640,
    cgstAmount: 2820,
    sgstAmount: 2820,
    igstAmount: 0,
    isInterstate: false,
    grandTotal: 52640,
    amountPaid: 52640,
    balanceDue: 0,
    paymentStatus: "PAID",
    status: "PAID",
    paymentMethod: "Bank Transfer",
    remarks: "Received payment via HDFC NEFT Ref #HDFC889021.",
    notes: "Received payment via HDFC NEFT Ref #HDFC889021.",
    createdBy: "admin@houseofseetah.com",
    createdAt: "2026-07-15T10:30:00.000Z"
  }
];

export const initialEnquiries: Enquiry[] = [
  {
    id: "enq-1",
    customerName: "Vikramaditya Verma",
    phone: "+91 94140 99887",
    customerPhone: "+91 94140 99887",
    email: "vikram@palaceinteriors.co.in",
    customerEmail: "vikram@palaceinteriors.co.in",
    productName: "Srinathji Pichwai Art Circular Medallion",
    productTitle: "Srinathji Pichwai Art Circular Medallion",
    productCode: "HOS-PIC-001",
    message: "Interested in 2 pieces for a heritage hotel lobby project in Jaipur. Please share dimensions & bulk price.",
    date: "2026-08-01T09:15:00.000Z",
    createdAt: "2026-08-01T09:15:00.000Z",
    status: "New",
    internalNotes: "Prefers WhatsApp consultation.",
  },
  {
    id: "enq-2",
    customerName: "Sunita Agarwal",
    phone: "+91 98200 11223",
    customerPhone: "+91 98200 11223",
    email: "sunita@agarwalstudio.com",
    customerEmail: "sunita@agarwalstudio.com",
    productName: "Framed Brass Nandi Relief on Golden Silk Brocade",
    productTitle: "Framed Brass Nandi Relief on Golden Silk Brocade",
    productCode: "HOS-BRS-006",
    message: "Client needs custom size of 30 inches diameter. Is custom silk fabric background available?",
    date: "2026-08-02T11:45:00.000Z",
    createdAt: "2026-08-02T11:45:00.000Z",
    status: "Contacted",
    internalNotes: "Sent initial dimensions over WhatsApp.",
  }
];

export const initialPayments: Payment[] = [
  {
    id: "pay-1",
    invoiceId: "inv-1001",
    invoiceNumber: "HOS-2026-001",
    customerName: "Rajeshwar Rao",
    paymentDate: "2026-07-15",
    amount: 52640,
    paymentMethod: "Bank Transfer",
    paymentMode: "Bank Transfer",
    referenceNumber: "HDFC889021",
    notes: "Settled in full upon receipt of invoice.",
    recordedBy: "admin@houseofseetah.com",
    createdAt: "2026-07-15T11:00:00.000Z"
  }
];

export const initialWorkOrders: WorkOrder[] = [
  {
    id: "wo-101",
    orderNumber: "HOS-WIP-101",
    invoiceNumber: "HOS-2026-001",
    clientName: "Shri Vikramaditya Rao",
    artworkTitle: "Imperial Shrinathji Lotus Medallion (Pure 24K Gold)",
    artform: "Pichwai & Traditional Art",
    artisanId: "art-1",
    artisanName: "Master Ustaad Ramprasad",
    stage: "24K Gold Guilding",
    progressPercent: 65,
    startDate: "2026-03-10",
    targetCompletionDate: "2026-04-05",
    goldLeavesAllocated: 160,
    materialsCost: 38500,
    artisanFee: 45000,
    estimatedRetailValue: 185000,
    priority: "VVIP Commission",
    dimensions: "60 x 40 Inches",
    notes: "Client requested 24K gold foil with antique patina border.",
    status: "Active"
  },
  {
    id: "wo-102",
    orderNumber: "HOS-WIP-102",
    invoiceNumber: "HOS-2026-002",
    clientName: "Rajeshwar Rao",
    artworkTitle: "Heritage 24K Gold Tanjore Lakshmi Ganesha Relief",
    artform: "Brassware & Relief Frames",
    artisanId: "art-2",
    artisanName: "Shri Devesh Sharma",
    stage: "Inspection & Framing",
    progressPercent: 90,
    startDate: "2026-03-01",
    targetCompletionDate: "2026-03-28",
    goldLeavesAllocated: 90,
    materialsCost: 22000,
    artisanFee: 28000,
    estimatedRetailValue: 95000,
    priority: "Standard",
    dimensions: "24 x 30 Inches",
    notes: "Precious stones set into gilded relief. Framing in Burma Teak.",
    status: "Active"
  },
  {
    id: "wo-103",
    orderNumber: "HOS-WIP-103",
    clientName: "Birla Heritage Residence",
    artworkTitle: "Solid Brass Kamadhenu & Kalpavriksha High-Relief",
    artform: "Brassware & Relief Frames",
    artisanId: "art-3",
    artisanName: "Master K. Raghavendra",
    stage: "Relief & Muckwork",
    progressPercent: 40,
    startDate: "2026-03-15",
    targetCompletionDate: "2026-04-20",
    goldLeavesAllocated: 40,
    materialsCost: 48000,
    artisanFee: 52000,
    estimatedRetailValue: 220000,
    priority: "Urgent",
    dimensions: "48 x 48 Inches",
    notes: "Lost-wax cast brass medallion with deep hand chasing.",
    status: "Active"
  },
  {
    id: "wo-104",
    orderNumber: "HOS-WIP-104",
    clientName: "Maharani Palace Suites, Jaipur",
    artworkTitle: "Radha Krishna Vrindavan Bower Miniature with Real Pearl Inlays",
    artform: "Miniature Paintings & Wall Art",
    artisanId: "art-4",
    artisanName: "Smt. Ananya Chitrakar",
    stage: "Mineral Pigment Art",
    progressPercent: 75,
    startDate: "2026-03-05",
    targetCompletionDate: "2026-04-10",
    goldLeavesAllocated: 50,
    materialsCost: 19500,
    artisanFee: 32000,
    estimatedRetailValue: 145000,
    priority: "VVIP Commission",
    dimensions: "36 x 28 Inches",
    notes: "Single squirrel-hair brush rendering with real Lapis Lazuli background.",
    status: "Active"
  }
];

export const initialRawMaterials: RawMaterial[] = [
  {
    id: "mat-1",
    sku: "MAT-GLD-01",
    name: "Pure 24K Gold Leaf Foil (Karat Certified 99.9%)",
    category: "Precious Metals",
    currentStock: 52,
    unit: "Booklets (25 leaves)",
    reorderLevel: 15,
    unitCost: 4500,
    totalValue: 234000,
    supplier: "Jaipur Gold Guilders Trust",
    vaultLocation: "Jubilee Hills High-Security Vault #1",
    lastRestocked: "2026-03-20"
  },
  {
    id: "mat-2",
    sku: "MAT-GEM-02",
    name: "Natural Untreated Jaipur Emerald Cabochons (Tanjore Inlay)",
    category: "Gemstones",
    currentStock: 145,
    unit: "Carats",
    reorderLevel: 40,
    unitCost: 1200,
    totalValue: 174000,
    supplier: "Johari Bazaar Gems, Jaipur",
    vaultLocation: "Jubilee Hills Safe Deposit B",
    lastRestocked: "2026-03-12"
  },
  {
    id: "mat-3",
    sku: "MAT-PIG-03",
    name: "Natural Lapis Lazuli Pigment Powder (Badakhshan Grade)",
    category: "Pigments",
    currentStock: 850,
    unit: "Grams",
    reorderLevel: 250,
    unitCost: 180,
    totalValue: 153000,
    supplier: "Himalayan Mineral Co.",
    vaultLocation: "Studio Climate-Controlled Cabinet",
    lastRestocked: "2026-02-28"
  },
  {
    id: "mat-4",
    sku: "MAT-PIG-04",
    name: "Natural Malachite Mineral Green Powder",
    category: "Pigments",
    currentStock: 620,
    unit: "Grams",
    reorderLevel: 200,
    unitCost: 140,
    totalValue: 86800,
    supplier: "Himalayan Mineral Co.",
    vaultLocation: "Studio Climate-Controlled Cabinet",
    lastRestocked: "2026-02-28"
  },
  {
    id: "mat-5",
    sku: "MAT-WOD-05",
    name: "Aged Burma Teakwood Beams (Moisture-Seasoned)",
    category: "Timber & Framing",
    currentStock: 125,
    unit: "Running Ft",
    reorderLevel: 40,
    unitCost: 950,
    totalValue: 118750,
    supplier: "Timber Heritage Crafts, Kerala",
    vaultLocation: "Atelier Woodworking Annex",
    lastRestocked: "2026-03-05"
  },
  {
    id: "mat-6",
    sku: "MAT-TXT-06",
    name: "Handspun Pure Mulberry Silk Brocade (Zari Border)",
    category: "Textiles",
    currentStock: 35,
    unit: "Meters",
    reorderLevel: 10,
    unitCost: 3200,
    totalValue: 112000,
    supplier: "Varanasi Master Weavers",
    vaultLocation: "Silk Storage Chest #2",
    lastRestocked: "2026-03-15"
  }
];

export const initialArtisans: Artisan[] = [
  {
    id: "art-1",
    name: "Master Ustaad Ramprasad",
    guild: "Nathdwara & Mewar Pichwai Guild",
    specialty: "24K Gold Guilding & Shrinathji Iconography",
    experienceYears: 34,
    phone: "+91 94141 88772",
    city: "Udaipur & Hyderabad",
    activeWorkOrdersCount: 1,
    rating: 4.95,
    monthlyCapacity: 3,
    status: "Active"
  },
  {
    id: "art-2",
    name: "Shri Devesh Sharma",
    guild: "Thanjavur Royal Guild",
    specialty: "24K Gold Leaf Tanjore Relief & Gem Setting",
    experienceYears: 28,
    phone: "+91 98402 33441",
    city: "Hyderabad Atelier",
    activeWorkOrdersCount: 1,
    rating: 4.9,
    monthlyCapacity: 4,
    status: "Active"
  },
  {
    id: "art-3",
    name: "Master K. Raghavendra",
    guild: "Swamimalai Bronze & Brass Guild",
    specialty: "Lost-wax Casting & Chased Brass Reliefs",
    experienceYears: 22,
    phone: "+91 94441 55663",
    city: "Swamimalai / Hyderabad",
    activeWorkOrdersCount: 1,
    rating: 4.85,
    monthlyCapacity: 2,
    status: "Active"
  },
  {
    id: "art-4",
    name: "Smt. Ananya Chitrakar",
    guild: "Kishangarh Miniature School",
    specialty: "Single-Hair Brush Radha Krishna Detailing",
    experienceYears: 19,
    phone: "+91 97831 22990",
    city: "Jaipur / Hyderabad",
    activeWorkOrdersCount: 1,
    rating: 4.9,
    monthlyCapacity: 3,
    status: "Active"
  }
];

export const initialShipments: LogisticsShipment[] = [
  {
    id: "ship-1",
    shipmentNumber: "HOS-LOG-8821",
    invoiceNumber: "HOS-2026-001",
    clientName: "Shri Vikramaditya Rao",
    clientPhone: "+91 98765 43210",
    destinationCity: "Mumbai",
    destinationAddress: "Altamount Road, South Mumbai - 400026",
    courierPartner: "Sequel Logistics",
    trackingAwb: "SQL-HOS-998823",
    declaredValue: 185000,
    insurancePolicyNumber: "AIG-ART-7729104",
    insuranceProvider: "Tata AIG Fine Art Insurance",
    crateType: "Reinforced Weatherproof Teak Crate",
    currentStatus: "Dispatched",
    dispatchDate: "2026-04-02",
    estimatedDelivery: "2026-04-06",
    notes: "Fragile 24K gold leaf relief. Dedicated climate-controlled high-value art van."
  },
  {
    id: "ship-2",
    shipmentNumber: "HOS-LOG-8822",
    invoiceNumber: "HOS-2026-002",
    clientName: "Rajeshwar Rao",
    clientPhone: "+91 98200 44556",
    destinationCity: "Hyderabad",
    destinationAddress: "Road No. 36, Jubilee Hills, Hyderabad - 500033",
    courierPartner: "Hand Carry Concierge",
    trackingAwb: "HOS-CONC-042",
    declaredValue: 52640,
    insurancePolicyNumber: "AIG-ART-7729105",
    insuranceProvider: "Tata AIG Fine Art Insurance",
    crateType: "Velvet Padded Aluminium Vault Case",
    currentStatus: "Delivered",
    dispatchDate: "2026-03-29",
    estimatedDelivery: "2026-03-30",
    actualDeliveryDate: "2026-03-30",
    deliveryOtpVerified: true,
    notes: "Direct hand-delivery by House of Seetah Senior Curator."
  }
];

// LocalStorage Helper
const getStorageItem = <T>(key: string, defaultVal: T): T => {
  try {
    const item = localStorage.getItem(`hos_${key}`);
    if (!item) return defaultVal;
    const parsed = JSON.parse(item);
    if (parsed === null || parsed === undefined) return defaultVal;
    if (Array.isArray(defaultVal) && !Array.isArray(parsed)) return defaultVal;
    if (typeof defaultVal === 'object' && defaultVal !== null && !Array.isArray(defaultVal)) {
      return { ...defaultVal, ...parsed };
    }
    return parsed as T;
  } catch {
    return defaultVal;
  }
};

const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(`hos_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key}`, e);
  }
};

export const DataService = {
  // Settings
  getSettings: async (): Promise<BusinessSettings> => {
    return getStorageItem<BusinessSettings>('settings', initialSettings);
  },
  updateSettings: async (settings: BusinessSettings): Promise<BusinessSettings> => {
    setStorageItem('settings', settings);
    return settings;
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    return getStorageItem<Category[]>('categories', initialCategories);
  },
  saveCategory: async (category: Category): Promise<Category[]> => {
    const current = await DataService.getCategories();
    const idx = current.findIndex(c => c.id === category.id);
    let updated: Category[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = category;
    } else {
      updated = [category, ...current];
    }
    setStorageItem('categories', updated);
    return updated;
  },
  deleteCategory: async (id: string): Promise<Category[]> => {
    const current = await DataService.getCategories();
    const updated = current.filter(c => c.id !== id);
    setStorageItem('categories', updated);
    return updated;
  },

  // Products
  getProducts: async (): Promise<Product[]> => {
    return getStorageItem<Product[]>('products', initialProducts);
  },
  getProductById: async (id: string): Promise<Product | undefined> => {
    const products = await DataService.getProducts();
    return products.find(p => p.id === id || p.productCode === id);
  },
  saveProduct: async (product: Product): Promise<Product[]> => {
    const current = await DataService.getProducts();
    const idx = current.findIndex(p => p.id === product.id);
    let updated: Product[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = product;
    } else {
      updated = [product, ...current];
    }
    setStorageItem('products', updated);
    return updated;
  },
  deleteProduct: async (id: string): Promise<Product[]> => {
    const current = await DataService.getProducts();
    const updated = current.filter(p => p.id !== id);
    setStorageItem('products', updated);
    return updated;
  },

  // Customers
  getCustomers: async (): Promise<Customer[]> => {
    return getStorageItem<Customer[]>('customers', initialCustomers);
  },
  saveCustomer: async (customer: Customer): Promise<Customer[]> => {
    const current = await DataService.getCustomers();
    const idx = current.findIndex(c => c.id === customer.id);
    let updated: Customer[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = customer;
    } else {
      updated = [customer, ...current];
    }
    setStorageItem('customers', updated);
    return updated;
  },
  deleteCustomer: async (id: string): Promise<Customer[]> => {
    const current = await DataService.getCustomers();
    const updated = current.filter(c => c.id !== id);
    setStorageItem('customers', updated);
    return updated;
  },

  // Invoices
  getInvoices: async (): Promise<Invoice[]> => {
    return getStorageItem<Invoice[]>('invoices', initialInvoices);
  },
  saveInvoice: async (invoice: Invoice): Promise<Invoice[]> => {
    const current = await DataService.getInvoices();
    const idx = current.findIndex(i => i.id === invoice.id);
    let updated: Invoice[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = invoice;
    } else {
      updated = [invoice, ...current];
      const settings = await DataService.getSettings();
      settings.nextInvoiceNumber += 1;
      await DataService.updateSettings(settings);
    }
    setStorageItem('invoices', updated);
    return updated;
  },
  createInvoice: async (invoiceData: Partial<Invoice>): Promise<Invoice> => {
    const current = await DataService.getInvoices();
    const newInv: Invoice = {
      id: invoiceData.id || `inv-${Date.now()}`,
      invoiceNumber: invoiceData.invoiceNumber || `HOS-2026-${Math.floor(100 + Math.random() * 900)}`,
      issueDate: invoiceData.issueDate || invoiceData.invoiceDate || new Date().toISOString().split('T')[0],
      invoiceDate: invoiceData.issueDate || invoiceData.invoiceDate || new Date().toISOString().split('T')[0],
      dueDate: invoiceData.dueDate || new Date().toISOString().split('T')[0],
      customerId: invoiceData.customerId || 'cust-generic',
      customerName: invoiceData.customerName || 'Walk-in Client',
      customerEmail: invoiceData.customerEmail || '',
      customerMobile: invoiceData.customerMobile || invoiceData.customerPhone || '',
      customerPhone: invoiceData.customerPhone || invoiceData.customerMobile || '',
      customerGstin: invoiceData.customerGstin || '',
      billingAddress: invoiceData.billingAddress || '',
      shippingAddress: invoiceData.shippingAddress || invoiceData.billingAddress || '',
      placeOfSupply: invoiceData.placeOfSupply || '36 - Telangana',
      items: invoiceData.items || [],
      subtotal: invoiceData.subtotal || 0,
      totalTax: invoiceData.totalTax || 0,
      discountAmount: invoiceData.discountAmount || 0,
      grandTotal: invoiceData.grandTotal || 0,
      amountPaid: invoiceData.amountPaid || 0,
      balanceDue: invoiceData.balanceDue || 0,
      status: invoiceData.status || 'ISSUED',
      paymentStatus: (invoiceData.status as any) || 'ISSUED',
      notes: invoiceData.notes || '',
      createdAt: new Date().toISOString()
    };
    await DataService.saveInvoice(newInv);
    return newInv;
  },

  // Enquiries
  getEnquiries: async (): Promise<Enquiry[]> => {
    return getStorageItem<Enquiry[]>('enquiries', initialEnquiries);
  },
  createEnquiry: async (enquiryData: Partial<Enquiry>): Promise<Enquiry> => {
    const current = await DataService.getEnquiries();
    const newEnq: Enquiry = {
      id: `enq-${Date.now()}`,
      customerName: enquiryData.customerName || 'Anonymous Collector',
      phone: enquiryData.phone || enquiryData.customerPhone || '',
      customerPhone: enquiryData.customerPhone || enquiryData.phone || '',
      email: enquiryData.email || enquiryData.customerEmail || '',
      customerEmail: enquiryData.customerEmail || enquiryData.email || '',
      productName: enquiryData.productName || enquiryData.productTitle || 'General Enquiry',
      productTitle: enquiryData.productTitle || enquiryData.productName || 'General Enquiry',
      message: enquiryData.message || '',
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: 'New'
    };
    const updated = [newEnq, ...current];
    setStorageItem('enquiries', updated);
    return newEnq;
  },
  saveEnquiry: async (enquiryData: Partial<Enquiry>): Promise<Enquiry> => {
    return DataService.createEnquiry(enquiryData);
  },
  updateEnquiryStatus: async (id: string, status: Enquiry['status'], internalNotes?: string): Promise<Enquiry[]> => {
    const current = await DataService.getEnquiries();
    const updated = current.map(e => {
      if (e.id === id) {
        return {
          ...e,
          status,
          internalNotes: internalNotes !== undefined ? internalNotes : e.internalNotes,
        };
      }
      return e;
    });
    setStorageItem('enquiries', updated);
    return updated;
  },

  // Payments
  getPayments: async (): Promise<Payment[]> => {
    return getStorageItem<Payment[]>('payments', initialPayments);
  },
  recordPayment: async (payData: Partial<Payment>): Promise<Payment> => {
    const newPay: Payment = {
      id: `pay-${Date.now()}`,
      invoiceId: payData.invoiceId || '',
      invoiceNumber: payData.invoiceNumber || '',
      customerName: payData.customerName || '',
      paymentDate: payData.paymentDate || new Date().toISOString().split('T')[0],
      amount: payData.amount || 0,
      paymentMode: payData.paymentMode || payData.paymentMethod || 'Bank Transfer',
      paymentMethod: (payData.paymentMode as any) || 'Bank Transfer',
      referenceNumber: payData.referenceNumber || '',
      notes: payData.notes || '',
      recordedBy: 'admin@houseofseetah.com',
      createdAt: new Date().toISOString()
    };

    const current = await DataService.getPayments();
    setStorageItem('payments', [newPay, ...current]);

    // Update invoice payment balance
    if (newPay.invoiceId) {
      const invoices = await DataService.getInvoices();
      const invIdx = invoices.findIndex(i => i.id === newPay.invoiceId);
      if (invIdx >= 0) {
        const inv = invoices[invIdx];
        const newAmountPaid = (inv.amountPaid || 0) + newPay.amount;
        const newBalance = Math.max(0, inv.grandTotal - newAmountPaid);
        const newStatus = newBalance === 0 ? 'PAID' : newAmountPaid > 0 ? 'PARTIAL' : inv.status;
        await DataService.saveInvoice({
          ...inv,
          amountPaid: newAmountPaid,
          balanceDue: newBalance,
          status: newStatus as any,
          paymentStatus: newStatus as any,
        });
      }
    }

    return newPay;
  },

  // Atelier ERP: Work Orders (WIP)
  getWorkOrders: async (): Promise<WorkOrder[]> => {
    return getStorageItem<WorkOrder[]>('work_orders', initialWorkOrders);
  },
  saveWorkOrder: async (wo: WorkOrder): Promise<WorkOrder[]> => {
    const current = await DataService.getWorkOrders();
    const idx = current.findIndex(w => w.id === wo.id || w.orderNumber === wo.orderNumber);
    let updated: WorkOrder[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = wo;
    } else {
      updated = [wo, ...current];
    }
    setStorageItem('work_orders', updated);
    return updated;
  },
  updateWorkOrderStage: async (id: string, stage: WorkOrder['stage'], progressPercent: number, notes?: string): Promise<WorkOrder[]> => {
    const current = await DataService.getWorkOrders();
    const updated = current.map(w => {
      if (w.id === id) {
        return {
          ...w,
          stage,
          progressPercent,
          status: stage === 'Completed' ? ('Completed' as const) : ('Active' as const),
          notes: notes !== undefined ? notes : w.notes
        };
      }
      return w;
    });
    setStorageItem('work_orders', updated);
    return updated;
  },

  // Atelier ERP: Precious Raw Materials & Inventory
  getRawMaterials: async (): Promise<RawMaterial[]> => {
    return getStorageItem<RawMaterial[]>('raw_materials', initialRawMaterials);
  },
  saveRawMaterial: async (mat: RawMaterial): Promise<RawMaterial[]> => {
    const current = await DataService.getRawMaterials();
    const idx = current.findIndex(m => m.id === mat.id || m.sku === mat.sku);
    let updated: RawMaterial[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = mat;
    } else {
      updated = [mat, ...current];
    }
    setStorageItem('raw_materials', updated);
    return updated;
  },
  adjustMaterialStock: async (id: string, deltaQty: number): Promise<RawMaterial[]> => {
    const current = await DataService.getRawMaterials();
    const updated = current.map(m => {
      if (m.id === id) {
        const newQty = Math.max(0, m.currentStock + deltaQty);
        return {
          ...m,
          currentStock: newQty,
          totalValue: newQty * m.unitCost,
          lastRestocked: deltaQty > 0 ? new Date().toISOString().split('T')[0] : m.lastRestocked
        };
      }
      return m;
    });
    setStorageItem('raw_materials', updated);
    return updated;
  },

  // Atelier ERP: Artisans & Guild
  getArtisans: async (): Promise<Artisan[]> => {
    return getStorageItem<Artisan[]>('artisans', initialArtisans);
  },
  saveArtisan: async (artisan: Artisan): Promise<Artisan[]> => {
    const current = await DataService.getArtisans();
    const idx = current.findIndex(a => a.id === artisan.id);
    let updated: Artisan[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = artisan;
    } else {
      updated = [artisan, ...current];
    }
    setStorageItem('artisans', updated);
    return updated;
  },

  // Atelier ERP: High-Value Logistics & Shipments
  getShipments: async (): Promise<LogisticsShipment[]> => {
    return getStorageItem<LogisticsShipment[]>('shipments', initialShipments);
  },
  saveShipment: async (shipment: LogisticsShipment): Promise<LogisticsShipment[]> => {
    const current = await DataService.getShipments();
    const idx = current.findIndex(s => s.id === shipment.id || s.shipmentNumber === shipment.shipmentNumber);
    let updated: LogisticsShipment[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = shipment;
    } else {
      updated = [shipment, ...current];
    }
    setStorageItem('shipments', updated);
    return updated;
  },
  updateShipmentStatus: async (id: string, newStatus: LogisticsShipment['currentStatus']): Promise<LogisticsShipment[]> => {
    const current = await DataService.getShipments();
    const updated = current.map(s => {
      if (s.id === id) {
        return {
          ...s,
          currentStatus: newStatus,
          actualDeliveryDate: newStatus === 'Delivered' ? new Date().toISOString().split('T')[0] : s.actualDeliveryDate,
          deliveryOtpVerified: newStatus === 'Delivered' ? true : s.deliveryOtpVerified
        };
      }
      return s;
    });
    setStorageItem('shipments', updated);
    return updated;
  }
};

export const dbService = DataService;
