export interface BusinessSettings {
  companyName: string;
  tagline: string;
  gstin: string;
  email: string;
  phone: string;
  address: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  invoicePrefix: string;
  nextInvoiceNumber: number;
  terms: string;
  logoUrl: string;
  signatureUrl?: string;
  websiteTitle?: string;
  heroHeadline?: string;
  heroSubtext?: string;
  aboutText?: string;
  announcementText?: string;
}

export interface Product {
  id: string;
  productCode?: string;
  productName?: string;
  title?: string;
  category: string;
  categoryId?: string;
  categoryName?: string;
  hsnCode?: string;
  unit?: string;
  price: number;
  gstPercent?: number;
  description: string;
  imageUrl: string;
  galleryImages?: string[];
  isAvailable?: boolean;
  inStock?: boolean;
  isFeatured?: boolean;
  featured?: boolean;
  dimensions?: string;
  medium?: string;
  artworkEra?: string;
  badge?: 'NEW' | 'FEATURED' | 'BESTSELLER' | 'IN STOCK' | 'MADE TO ORDER';
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface Customer {
  id: string;
  name: string;
  companyName?: string;
  gstin?: string;
  mobile?: string;
  phone?: string;
  email: string;
  billingAddress?: string;
  address?: string;
  shippingAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
  notes?: string;
  totalInvoices?: number;
  totalSpent?: number;
  createdAt?: string;
}

export interface InvoiceItem {
  productId: string;
  productCode?: string;
  productName?: string;
  productTitle?: string;
  description?: string;
  hsnCode?: string;
  unit?: string;
  quantity: number;
  unitPrice: number;
  discountPercent?: number;
  taxRate?: number;
  gstPercent?: number;
  subtotal?: number;
  taxableAmount?: number;
  gstAmount?: number;
  cgstRate?: number;
  cgstAmount?: number;
  sgstRate?: number;
  sgstAmount?: number;
  igstRate?: number;
  igstAmount?: number;
  totalAmount?: number;
  total?: number;
}

export type PaymentStatus = 'Paid' | 'Pending' | 'Partially Paid' | 'Overdue' | 'PAID' | 'PARTIAL' | 'ISSUED' | 'DRAFT' | 'CANCELLED';
export type PaymentMethod = 'Bank Transfer' | 'UPI' | 'Cash' | 'Credit Card' | 'Cheque';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate?: string;
  issueDate?: string;
  dueDate?: string;
  customerId: string;
  customerName: string;
  customerCompany?: string;
  customerGstin?: string;
  customerEmail?: string;
  customerMobile?: string;
  customerPhone?: string;
  billingAddress?: string;
  shippingAddress?: string;
  placeOfSupply?: string;
  items: InvoiceItem[];
  subtotal: number;
  totalDiscount?: number;
  discountAmount?: number;
  totalGst?: number;
  totalTax?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  isInterstate?: boolean;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
  paymentStatus?: PaymentStatus;
  status?: string;
  paymentMethod?: PaymentMethod;
  remarks?: string;
  notes?: string;
  createdBy?: string;
  createdAt?: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  customerId?: string;
  customerName: string;
  paymentDate: string;
  amount: number;
  paymentMethod?: PaymentMethod;
  paymentMode?: string;
  referenceNumber?: string;
  notes?: string;
  recordedBy?: string;
  createdAt?: string;
}

export type EnquiryStatus = 'New' | 'Contacted' | 'Follow-up' | 'Quotation Sent' | 'Confirmed' | 'Completed' | 'Closed';

export interface Enquiry {
  id: string;
  customerName: string;
  phone?: string;
  customerPhone?: string;
  email?: string;
  customerEmail?: string;
  productName?: string;
  productTitle?: string;
  productCode?: string;
  message: string;
  date?: string;
  createdAt?: string;
  status: EnquiryStatus;
  internalNotes?: string;
}

export interface User {
  id: string;
  name: string;
  displayName?: string;
  email: string;
  role: 'Admin' | 'Staff';
  mobile: string;
  status: 'Active' | 'Inactive';
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
}

// House of Seetah 2.0 Types
export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStep = 'Confirmed' | 'Artisan Inspection' | 'Insured Packaging' | 'Dispatched' | 'Delivered';

export interface OrderStatusDetails {
  orderNumber: string;
  customerName: string;
  items: string[];
  currentStep: OrderStep;
  stepIndex: number;
  dispatchDate?: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  courierPartner?: string;
}
