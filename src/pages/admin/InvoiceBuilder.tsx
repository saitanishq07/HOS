import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dbService } from '../../services/db';
import { Product, Customer, InvoiceItem } from '../../types';
import { FileText, Plus, Trash2, Save, ArrowLeft, UserPlus, Sparkles, Building2, Calculator } from 'lucide-react';

export const InvoiceBuilder: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [invoiceNumber, setInvoiceNumber] = useState(`HOS-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  
  // Customer Details
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerGstin, setCustomerGstin] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [placeOfSupply, setPlaceOfSupply] = useState('36 - Telangana');
  
  // Line Items
  const [items, setItems] = useState<Partial<InvoiceItem>[]>([
    { productId: '', productTitle: '', hsnCode: '9701', quantity: 1, unitPrice: 0, taxRate: 12, taxableAmount: 0, cgstRate: 6, cgstAmount: 0, sgstRate: 6, sgstAmount: 0, igstRate: 0, igstAmount: 0, totalAmount: 0 }
  ]);

  const [discountAmount, setDiscountAmount] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [notes, setNotes] = useState('Thank you for acquiring authentic Indian heritage art from House of Seetah.');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, custs] = await Promise.all([
        dbService.getProducts(),
        dbService.getCustomers()
      ]);
      setProducts(prods);
      setCustomers(custs);
    } catch (error) {
      console.error('Error loading builder data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerSelect = (id: string) => {
    setSelectedCustomerId(id);
    const cust = customers.find(c => c.id === id);
    if (cust) {
      setCustomerName(cust.name);
      setCustomerEmail(cust.email);
      setCustomerPhone(cust.phone || cust.mobile || '');
      setCustomerGstin(cust.gstin || '');
      setBillingAddress(cust.address || '');
      setPlaceOfSupply(cust.state ? `${cust.state}` : '36 - Telangana');
    }
  };

  const handleProductSelect = (index: number, productId: string) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    const newItems = [...items];
    const isInterstate = !placeOfSupply.includes('Telangana') && !placeOfSupply.startsWith('36');
    const taxRate = 12; // 12% standard GST on handicrafts & paintings
    const qty = newItems[index].quantity || 1;
    const price = prod.price;
    const taxable = price * qty;

    let cgstRate = 0, cgstAmount = 0, sgstRate = 0, sgstAmount = 0, igstRate = 0, igstAmount = 0;

    if (isInterstate) {
      igstRate = taxRate;
      igstAmount = Math.round(taxable * (taxRate / 100));
    } else {
      cgstRate = taxRate / 2;
      cgstAmount = Math.round(taxable * (cgstRate / 100));
      sgstRate = taxRate / 2;
      sgstAmount = Math.round(taxable * (sgstRate / 100));
    }

    const total = taxable + cgstAmount + sgstAmount + igstAmount;

    newItems[index] = {
      ...newItems[index],
      productId: prod.id,
      productTitle: prod.title,
      hsnCode: prod.hsnCode || '9701',
      unitPrice: price,
      taxableAmount: taxable,
      taxRate,
      cgstRate,
      cgstAmount,
      sgstRate,
      sgstAmount,
      igstRate,
      igstAmount,
      totalAmount: total
    };

    setItems(newItems);
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    const item = { ...newItems[index], [field]: value };

    const qty = Number(item.quantity) || 1;
    const price = Number(item.unitPrice) || 0;
    const taxable = qty * price;
    const isInterstate = !placeOfSupply.includes('Telangana') && !placeOfSupply.startsWith('36');
    const taxRate = Number(item.taxRate) || 12;

    let cgstRate = 0, cgstAmount = 0, sgstRate = 0, sgstAmount = 0, igstRate = 0, igstAmount = 0;

    if (isInterstate) {
      igstRate = taxRate;
      igstAmount = Math.round(taxable * (taxRate / 100));
    } else {
      cgstRate = taxRate / 2;
      cgstAmount = Math.round(taxable * (cgstRate / 100));
      sgstRate = taxRate / 2;
      sgstAmount = Math.round(taxable * (sgstRate / 100));
    }

    item.taxableAmount = taxable;
    item.cgstRate = cgstRate;
    item.cgstAmount = cgstAmount;
    item.sgstRate = sgstRate;
    item.sgstAmount = sgstAmount;
    item.igstRate = igstRate;
    item.igstAmount = igstAmount;
    item.totalAmount = taxable + cgstAmount + sgstAmount + igstAmount;

    newItems[index] = item;
    setItems(newItems);
  };

  const addItemRow = () => {
    setItems([
      ...items,
      { productId: '', productTitle: '', hsnCode: '9701', quantity: 1, unitPrice: 0, taxRate: 12, taxableAmount: 0, cgstRate: 6, cgstAmount: 0, sgstRate: 6, sgstAmount: 0, igstRate: 0, igstAmount: 0, totalAmount: 0 }
    ]);
  };

  const removeItemRow = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.taxableAmount || 0), 0);
  const totalCgst = items.reduce((sum, item) => sum + (item.cgstAmount || 0), 0);
  const totalSgst = items.reduce((sum, item) => sum + (item.sgstAmount || 0), 0);
  const totalIgst = items.reduce((sum, item) => sum + (item.igstAmount || 0), 0);
  const totalTax = totalCgst + totalSgst + totalIgst;
  const rawGrandTotal = subtotal + totalTax - discountAmount;
  const grandTotal = Math.max(0, rawGrandTotal);
  const balanceDue = Math.max(0, grandTotal - amountPaid);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName) {
      alert('Please enter a customer name.');
      return;
    }
    if (items.some(i => !i.productTitle || (i.unitPrice || 0) <= 0)) {
      alert('Please complete all line items with title and valid unit price.');
      return;
    }

    try {
      const formattedItems: InvoiceItem[] = items.map(item => ({
        productId: item.productId || 'custom',
        productTitle: item.productTitle || 'Custom Handicraft Art',
        hsnCode: item.hsnCode || '9701',
        quantity: Number(item.quantity) || 1,
        unitPrice: Number(item.unitPrice) || 0,
        taxableAmount: Number(item.taxableAmount) || 0,
        taxRate: Number(item.taxRate) || 12,
        cgstRate: Number(item.cgstRate) || 0,
        cgstAmount: Number(item.cgstAmount) || 0,
        sgstRate: Number(item.sgstRate) || 0,
        sgstAmount: Number(item.sgstAmount) || 0,
        igstRate: Number(item.igstRate) || 0,
        igstAmount: Number(item.igstAmount) || 0,
        totalAmount: Number(item.totalAmount) || 0,
      }));

      const status = balanceDue === 0 ? 'PAID' : amountPaid > 0 ? 'PARTIAL' : 'ISSUED';

      await dbService.createInvoice({
        invoiceNumber,
        issueDate,
        dueDate,
        customerId: selectedCustomerId || `cust-${Date.now()}`,
        customerName,
        customerEmail,
        customerPhone,
        customerGstin,
        billingAddress,
        shippingAddress: billingAddress,
        placeOfSupply,
        items: formattedItems,
        subtotal,
        totalTax,
        discountAmount,
        grandTotal,
        amountPaid,
        balanceDue,
        status,
        notes
      });

      navigate('/admin/invoices');
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Error creating tax invoice.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-[#0442A5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 font-sans max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141822] p-6 rounded-2xl border border-neutral-800 shadow-xl">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => navigate('/admin/invoices')}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
              Create Commercial Tax Invoice
            </h1>
            <p className="text-xs text-neutral-400">
              Draft official GST invoice for House of Seetah art transactions.
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-[#0442A5] hover:bg-[#0553d1] text-white text-xs font-semibold shadow-lg shadow-[#0442A5]/30 flex items-center space-x-2 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save & Issue Tax Invoice</span>
        </button>
      </div>

      {/* Invoice Details & Client Selection */}
      <div className="bg-[#161922] border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-neutral-800 pb-6">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Invoice Number
            </label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0D1117] border border-neutral-700 rounded-xl text-xs font-mono font-bold text-[#CDEBFF]"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Issue Date
            </label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0D1117] border border-neutral-700 rounded-xl text-xs text-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Payment Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0D1117] border border-neutral-700 rounded-xl text-xs text-white"
            />
          </div>
        </div>

        {/* Customer Auto-Fill Dropdown */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              Client Billing Profile
            </label>
            <span className="text-[11px] text-[#CDEBFF]">Select existing or enter new details below</span>
          </div>
          <select
            value={selectedCustomerId}
            onChange={(e) => handleCustomerSelect(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#0D1117] border border-neutral-700 rounded-xl text-xs text-white mb-4"
          >
            <option value="">-- Choose Existing Customer --</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.phone}) - {c.gstin || 'URP'}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Customer Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Smt. Gayatri Devi"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D1117] border border-neutral-700 rounded-xl text-xs text-white"
              required
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Phone Number</label>
            <input
              type="text"
              placeholder="+91 98765 43210"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D1117] border border-neutral-700 rounded-xl text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="client@domain.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D1117] border border-neutral-700 rounded-xl text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 mb-1">GSTIN / UIN</label>
            <input
              type="text"
              placeholder="36AAAAA0000A1Z5 (Optional)"
              value={customerGstin}
              onChange={(e) => setCustomerGstin(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D1117] border border-neutral-700 rounded-xl text-xs text-white font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Billing & Shipping Address</label>
            <input
              type="text"
              placeholder="Full address details"
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D1117] border border-neutral-700 rounded-xl text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Place of Supply (GST Tax Split)</label>
            <select
              value={placeOfSupply}
              onChange={(e) => setPlaceOfSupply(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D1117] border border-neutral-700 rounded-xl text-xs text-white"
            >
              <option value="36 - Telangana">36 - Telangana (Intrastate: CGST + SGST)</option>
              <option value="27 - Maharashtra">27 - Maharashtra (Interstate: IGST)</option>
              <option value="07 - Delhi">07 - Delhi (Interstate: IGST)</option>
              <option value="29 - Karnataka">29 - Karnataka (Interstate: IGST)</option>
              <option value="33 - Tamil Nadu">33 - Tamil Nadu (Interstate: IGST)</option>
            </select>
          </div>
        </div>
      </div>

      {/* LINE ITEMS TABLE */}
      <div className="bg-[#161922] border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <h3 className="font-serif text-lg font-bold text-white">Art Line Items & HSN Tax Split</h3>
          <button
            type="button"
            onClick={addItemRow}
            className="px-3.5 py-1.5 rounded-lg bg-[#0442A5]/30 hover:bg-[#0442A5]/50 text-[#CDEBFF] border border-[#0442A5]/60 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item Row</span>
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="p-4 bg-[#0D1117] border border-neutral-800 rounded-xl grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-4">
                <label className="block text-[10px] text-neutral-400 font-semibold mb-1">Product / Custom Artwork</label>
                <select
                  value={item.productId || ''}
                  onChange={(e) => handleProductSelect(index, e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#141822] border border-neutral-700 rounded-lg text-xs text-white mb-1"
                >
                  <option value="">-- Choose From Catalog --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title} (₹{p.price.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Or enter title"
                  value={item.productTitle || ''}
                  onChange={(e) => updateItem(index, 'productTitle', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#141822] border border-neutral-700 rounded-lg text-xs text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] text-neutral-400 font-semibold mb-1">HSN/SAC Code</label>
                <input
                  type="text"
                  value={item.hsnCode || '9701'}
                  onChange={(e) => updateItem(index, 'hsnCode', e.target.value)}
                  className="w-full px-2 py-1.5 bg-[#141822] border border-neutral-700 rounded-lg text-xs text-white font-mono"
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-[10px] text-neutral-400 font-semibold mb-1">Qty</label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity || 1}
                  onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-[#141822] border border-neutral-700 rounded-lg text-xs text-white text-center"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] text-neutral-400 font-semibold mb-1">Unit Rate (₹)</label>
                <input
                  type="number"
                  value={item.unitPrice || 0}
                  onChange={(e) => updateItem(index, 'unitPrice', Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-[#141822] border border-neutral-700 rounded-lg text-xs text-white text-right"
                />
              </div>

              <div className="md:col-span-2 text-right">
                <label className="block text-[10px] text-neutral-400 font-semibold mb-1">Total (Incl. Tax)</label>
                <p className="text-sm font-bold text-white py-1">₹{(item.totalAmount || 0).toLocaleString('en-IN')}</p>
                <p className="text-[10px] text-neutral-500">
                  {item.igstAmount ? `IGST: ₹${item.igstAmount}` : `CGST+SGST: ₹${(item.cgstAmount || 0) * 2}`}
                </p>
              </div>

              <div className="md:col-span-1 text-right">
                <button
                  type="button"
                  onClick={() => removeItemRow(index)}
                  className="p-2 text-neutral-500 hover:text-red-400 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SUMMARY & PAYMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#161922] border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="font-serif text-lg font-bold text-white">Commercial Notes & Terms</h3>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 bg-[#0D1117] border border-neutral-700 rounded-xl text-xs text-white"
          />
        </div>

        <div className="bg-[#161922] border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-3 text-xs">
          <h3 className="font-serif text-lg font-bold text-white mb-4">Invoice Calculation Summary</h3>
          <div className="flex justify-between text-neutral-400">
            <span>Taxable Subtotal:</span>
            <span className="font-semibold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>Calculated GST Tax Split:</span>
            <span className="font-semibold text-white">₹{totalTax.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-neutral-400">Heritage Special Discount (₹):</span>
            <input
              type="number"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(Number(e.target.value))}
              className="w-32 px-2.5 py-1 bg-[#0D1117] border border-neutral-700 rounded-lg text-right text-emerald-400 font-semibold"
            />
          </div>

          <div className="flex justify-between text-base font-bold text-white border-t border-neutral-800 pt-3">
            <span>Grand Invoice Total:</span>
            <span className="text-[#CDEBFF]">₹{grandTotal.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-neutral-400">Initial Payment Collected (₹):</span>
            <input
              type="number"
              value={amountPaid}
              onChange={(e) => setAmountPaid(Number(e.target.value))}
              className="w-32 px-2.5 py-1 bg-[#0D1117] border border-neutral-700 rounded-lg text-right text-emerald-400 font-semibold"
            />
          </div>

          <div className="flex justify-between text-sm font-bold text-red-400 border-t border-neutral-800 pt-2">
            <span>Balance Due Remaining:</span>
            <span>₹{balanceDue.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </form>
  );
};
