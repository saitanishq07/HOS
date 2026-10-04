import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, Truck, Package, CheckCircle2, Clock, PhoneCall, AlertCircle, Sparkles } from 'lucide-react';
import { DataService } from '../../services/db';
import { Invoice, OrderStep } from '../../types';

export const OrderTracking: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default demo lookup on initial view
  useEffect(() => {
    handleSearch('HOS-2026-001');
  }, []);

  const handleSearch = async (queryToSearch?: string) => {
    const term = (queryToSearch || searchQuery).trim().toUpperCase();
    if (!term) return;

    setLoading(true);
    setError(null);

    try {
      const allInvoices = await DataService.getInvoices();
      const match = allInvoices.find(
        (inv) => inv.invoiceNumber.toUpperCase() === term || inv.id.toUpperCase() === term
      );

      if (match) {
        setInvoice(match);
      } else if (term === 'HOS-2026-001' || term === 'DEMO') {
        // Fallback realistic demo invoice if not found in db
        const demoInvoice: Invoice = {
          id: 'demo-1',
          invoiceNumber: 'HOS-2026-001',
          customerName: 'Shri Vikramaditya Rao',
          issueDate: '2026-03-28',
          subtotal: 185000,
          grandTotal: 185000,
          amountPaid: 185000,
          balanceDue: 0,
          customerId: 'cust-1',
          paymentStatus: 'PAID',
          items: [
            {
              productId: 'p1',
              productName: 'Royal Tanjore Lakshmi Ganesha 24K Gold Leaf Artwork',
              quantity: 1,
              unitPrice: 185000,
              totalAmount: 185000,
            },
          ],
        };
        setInvoice(demoInvoice);
      } else {
        setInvoice(null);
        setError(`No order record found for invoice code "${term}". Please verify your invoice receipt or contact concierge.`);
      }
    } catch (err) {
      console.error(err);
      setError('Unable to fetch order status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps: { name: OrderStep; desc: string }[] = [
    { name: 'Confirmed', desc: 'Order & Authenticity Recorded' },
    { name: 'Artisan Inspection', desc: 'Master Guild Quality Audit' },
    { name: 'Insured Packaging', desc: 'Wooden Crate & Velvet Lined' },
    { name: 'Dispatched', desc: 'In Transit via Sequel Logistics' },
    { name: 'Delivered', desc: 'Doorstep White-Glove Handover' },
  ];

  // Derive step index based on invoice payment status or mock progress
  const getActiveStepIndex = (inv: Invoice): number => {
    const status = (inv.paymentStatus || inv.status || '').toUpperCase();
    if (status === 'PAID' || status === 'COMPLETED') return 3; // Dispatched
    if (status === 'PARTIAL' || status === 'ISSUED') return 2; // Insured Packaging
    return 1; // Confirmed / Artisan Inspection
  };

  const activeStep = invoice ? getActiveStepIndex(invoice) : 0;

  return (
    <div className="bg-[#FAF8F5] text-[#01173C] min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50/80 text-[#01173C] border border-[#D4AF37]/30 text-xs font-semibold tracking-[0.2em] uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Client Order Tracking Portal</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif text-[#01173C]">
            Track Your <span className="italic text-[#D4AF37]">Masterpiece Journey</span>
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto font-light leading-relaxed">
            Enter your House of Seetah Invoice Number (e.g. <span className="font-semibold text-[#01173C]">HOS-2026-001</span>) to inspect live studio craftsmanship status and white-glove transit details.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 sm:p-6 border border-[#D4AF37]/30 shadow-xl max-w-2xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Invoice Number (e.g. HOS-2026-001)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-[#FAF8F5] border border-slate-300 focus:border-[#D4AF37] focus:outline-none text-sm uppercase tracking-wider text-[#01173C] font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-[#01173C] hover:bg-[#032254] text-white font-semibold text-xs uppercase tracking-widest transition duration-300 shadow-md border border-[#D4AF37]/40 flex items-center justify-center gap-2"
            >
              {loading ? 'Searching...' : 'Track Status'}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 text-sm flex items-center gap-3 max-w-2xl mx-auto">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Order Progress Card */}
        {invoice && (
          <div className="bg-white border border-[#D4AF37]/30 shadow-2xl overflow-hidden space-y-8 p-6 sm:p-10">
            
            {/* Top Details Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-200 gap-4">
              <div>
                <span className="text-[11px] font-semibold tracking-widest text-[#D4AF37] uppercase">
                  INVOICE / ORDER RECORD
                </span>
                <h2 className="text-2xl font-serif text-[#01173C] font-bold">
                  {invoice.invoiceNumber}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Collector: <span className="font-medium text-slate-800">{invoice.customerName}</span>
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className={`inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider border ${
                  invoice.paymentStatus?.toUpperCase() === 'PAID' || invoice.status?.toUpperCase() === 'PAID'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}>
                  {invoice.paymentStatus || invoice.status || 'Confirmed'}
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Valuation: <span className="font-semibold text-[#01173C]">₹{invoice.grandTotal?.toLocaleString('en-IN')}</span>
                </p>
              </div>
            </div>

            {/* 5-Step Progress Stepper */}
            <div className="py-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#01173C] mb-6">
                Craftsmanship & Logistics Timeline
              </h3>

              <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
                
                {/* Connecting Line behind steps */}
                <div className="hidden md:block absolute left-0 right-0 top-5 h-0.5 bg-slate-200 -z-0" />
                <div
                  className="hidden md:block absolute left-0 top-5 h-0.5 bg-[#01173C] transition-all duration-700"
                  style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, idx) => {
                  const isCompleted = idx <= activeStep;
                  const isCurrent = idx === activeStep;

                  return (
                    <div key={idx} className="relative z-10 flex md:flex-col items-center gap-4 md:gap-2 text-left md:text-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 border-2 ${
                          isCurrent
                            ? 'bg-[#01173C] text-white border-[#D4AF37] ring-4 ring-[#01173C]/20 scale-110'
                            : isCompleted
                            ? 'bg-[#01173C] text-white border-[#01173C]'
                            : 'bg-slate-100 text-slate-400 border-slate-300'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" /> : idx + 1}
                      </div>

                      <div>
                        <p className={`text-xs font-bold uppercase tracking-wider ${isCompleted ? 'text-[#01173C]' : 'text-slate-400'}`}>
                          {step.name}
                        </p>
                        <p className="text-[11px] text-slate-500 max-w-[140px] leading-tight">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Logistics Summary Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-200 text-xs">
              <div className="bg-[#FAF8F5] p-4 border border-[#D4AF37]/30">
                <div className="flex items-center gap-2 text-[#01173C] font-semibold uppercase tracking-wider mb-1">
                  <Truck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Courier Logistics</span>
                </div>
                <p className="text-slate-700 font-medium">Sequel Logistics High-Value Art Transport</p>
                <p className="text-slate-500 text-[11px] mt-0.5">AWB: SQL-HOS-998823</p>
              </div>

              <div className="bg-[#FAF8F5] p-4 border border-[#D4AF37]/30">
                <div className="flex items-center gap-2 text-[#01173C] font-semibold uppercase tracking-wider mb-1">
                  <Clock className="w-4 h-4 text-[#D4AF37]" />
                  <span>Estimated Delivery</span>
                </div>
                <p className="text-slate-700 font-medium">Within 3-5 Business Days</p>
                <p className="text-slate-500 text-[11px] mt-0.5">Insured pan-India white-glove delivery</p>
              </div>

              <div className="bg-[#FAF8F5] p-4 border border-[#D4AF37]/30">
                <div className="flex items-center gap-2 text-[#01173C] font-semibold uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Artisan Guarantee</span>
                </div>
                <p className="text-slate-700 font-medium">Certified 24K Gold Leaf Work</p>
                <p className="text-slate-500 text-[11px] mt-0.5">Includes signed provenance certificate</p>
              </div>
            </div>

            {/* Itemized Order List */}
            <div className="pt-4">
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#01173C] mb-3">
                Items in This Commission
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-200">
                {invoice.items.map((item, i) => (
                  <div key={i} className="p-4 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-semibold text-slate-900">{item.productName || item.productTitle || 'Custom Art Creation'}</p>
                      <p className="text-slate-500 text-[11px]">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-[#01173C]">
                      ₹{(item.totalAmount || item.unitPrice * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Concierge Help */}
            <div className="bg-[#01173C] text-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-serif font-bold text-[#D4AF37]">Need Assistance with Your Order?</p>
                <p className="text-xs text-[#CDEBFF]/80">Our gallery curator is available for direct status calls & custom framing queries.</p>
              </div>
              <a
                href="tel:+919876543210"
                className="px-6 py-3 bg-[#D4AF37] hover:bg-[#b5932b] text-[#01173C] text-xs uppercase tracking-widest font-bold flex items-center gap-2 shrink-0 shadow-lg"
              >
                <PhoneCall className="w-4 h-4 text-[#01173C]" />
                <span>Call Curator</span>
              </a>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
