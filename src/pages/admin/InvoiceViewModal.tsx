import React, { useState } from 'react';
import { Invoice } from '../../types';
import { dbService, getImageUrl } from '../../services/db';
import { Printer, Download, Share2, X, CheckCircle, CreditCard, Sparkles, Building2, Phone, Mail } from 'lucide-react';

interface Props {
  invoice: Invoice;
  onClose: () => void;
  onRefresh: () => void;
}

export const InvoiceViewModal: React.FC<Props> = ({ invoice, onClose, onRefresh }) => {
  const [paymentAmount, setPaymentAmount] = useState<number>(invoice.balanceDue);
  const [paymentMode, setPaymentMode] = useState<string>('Bank Transfer');
  const [paymentRef, setPaymentRef] = useState<string>('');
  const [isLoggingPayment, setIsLoggingPayment] = useState(false);
  const [error, setError] = useState('');

  const handlePrint = () => {
    window.print();
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentAmount <= 0) {
      setError('Please enter a valid payment amount.');
      return;
    }
    try {
      await dbService.recordPayment({
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        customerId: invoice.customerId,
        customerName: invoice.customerName,
        amount: Number(paymentAmount),
        paymentMode,
        paymentDate: new Date().toISOString().split('T')[0],
        referenceNumber: paymentRef || `REC-${Date.now().toString().slice(-6)}`,
        notes: 'Recorded via Invoice Inspector'
      });
      setIsLoggingPayment(false);
      onRefresh();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error recording payment.');
    }
  };

  const whatsappMessage = `Hello ${invoice.customerName},\n\nHere is your Tax Invoice breakdown from *House of Seetah*:\n\n*Invoice No:* ${invoice.invoiceNumber}\n*Grand Total:* ₹${invoice.grandTotal.toLocaleString('en-IN')}\n*Amount Paid:* ₹${invoice.amountPaid.toLocaleString('en-IN')}\n*Balance Due:* ₹${invoice.balanceDue.toLocaleString('en-IN')}\n\nThank you for choosing House of Seetah!`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-[#141822] border border-neutral-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Modal Action Bar (Screen Only) */}
        <div className="bg-[#1D2230] px-6 py-4 border-b border-neutral-700 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-xs font-bold text-[#CDEBFF] bg-[#0442A5]/40 px-2.5 py-1 rounded-md border border-[#0442A5]/60">
              {invoice.invoiceNumber}
            </span>
            <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
              invoice.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400' :
              invoice.status === 'PARTIAL' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {invoice.status}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {invoice.balanceDue > 0 && (
              <button
                onClick={() => setIsLoggingPayment(!isLoggingPayment)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Record Payment</span>
              </button>
            )}

            <a
              href={`https://wa.me/${invoice.customerPhone?.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-700/40 hover:bg-emerald-700/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share WhatsApp</span>
            </a>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-[#0442A5] hover:bg-[#0553d1] text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print A4 Invoice</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Payment Form Dropdown */}
        {isLoggingPayment && (
          <form onSubmit={handleRecordPayment} className="p-4 bg-[#0D1117] border-b border-neutral-700 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs print:hidden">
            <div>
              <label className="block text-neutral-400 font-medium mb-1">Amount to Collect (₹)</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                max={invoice.balanceDue}
                className="w-full px-3 py-1.5 bg-[#141822] border border-neutral-700 rounded-lg text-white"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-400 font-medium mb-1">Payment Mode</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#141822] border border-neutral-700 rounded-lg text-white"
              >
                <option value="Bank Transfer">Bank Transfer / NEFT / RTGS</option>
                <option value="UPI">UPI / GPay / PhonePe</option>
                <option value="Cash">Cash Receipt</option>
                <option value="Cheque">Cheque</option>
                <option value="Credit Card">Credit Card</option>
              </select>
            </div>
            <div>
              <label className="block text-neutral-400 font-medium mb-1">Transaction Ref #</label>
              <input
                type="text"
                placeholder="e.g. UTR / Chq / Txn ID"
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#141822] border border-neutral-700 rounded-lg text-white"
              />
            </div>
            <div className="flex items-end space-x-2">
              <button
                type="submit"
                className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
              >
                Confirm Receipt
              </button>
              <button
                type="button"
                onClick={() => setIsLoggingPayment(false)}
                className="px-3 py-1.5 bg-neutral-800 text-neutral-300 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* PRINTABLE A4 INVOICE SHEET */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-white text-neutral-900 font-sans print:p-0 print:overflow-visible" id="printable-invoice">
          {/* Header Branding */}
          <div className="flex justify-between items-start border-b-2 border-[#0442A5] pb-6">
            <div className="flex items-start space-x-4">
              <img src={getImageUrl('/logo.png')} alt="House of Seetah" className="w-16 h-16 object-contain" />
              <div>
                <h1 className="font-serif text-2xl font-bold tracking-wide text-[#0442A5] uppercase">
                  HOUSE OF SEETAH
                </h1>
                <p className="text-xs font-semibold text-[#C85A32] tracking-wider uppercase">
                  Curators & Creators of Heritage Indian Art
                </p>
                <p className="text-[11px] text-neutral-600 mt-1 max-w-sm">
                  Suite 402, Heritage Crafts Plaza, Jubilee Hills, Hyderabad, Telangana - 500033
                </p>
                <p className="text-[11px] text-neutral-600">
                  <span className="font-bold text-neutral-800">GSTIN:</span> 36AABCH9988K1Z5 | <span className="font-bold text-neutral-800">Ph:</span> +91 98765 43210
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-[#0442A5] text-white font-serif font-bold text-sm rounded uppercase tracking-wider mb-2">
                TAX INVOICE
              </span>
              <p className="font-mono text-base font-bold text-[#0442A5]">{invoice.invoiceNumber}</p>
              <p className="text-xs text-neutral-600 mt-1">
                <span className="font-semibold">Date:</span> {new Date(invoice.issueDate || invoice.invoiceDate || invoice.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
              {invoice.dueDate && (
                <p className="text-xs text-neutral-600">
                  <span className="font-semibold">Due Date:</span> {new Date(invoice.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>

          {/* Billing & Shipping Details */}
          <div className="grid grid-cols-2 gap-6 my-6 p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">
            <div>
              <p className="font-bold uppercase tracking-wider text-[#0442A5] mb-1">BILLED TO (BUYER):</p>
              <p className="font-bold text-sm text-neutral-900">{invoice.customerName}</p>
              {invoice.customerGstin && (
                <p className="text-neutral-700 font-semibold"><span className="text-neutral-500">GSTIN / UIN:</span> {invoice.customerGstin}</p>
              )}
              <p className="text-neutral-600 mt-1">{invoice.billingAddress || 'Hyderabad, Telangana'}</p>
              <p className="text-neutral-600 mt-1"><span className="font-semibold">Phone:</span> {invoice.customerPhone || invoice.customerMobile || ''} | <span className="font-semibold">Email:</span> {invoice.customerEmail}</p>
            </div>

            <div>
              <p className="font-bold uppercase tracking-wider text-[#0442A5] mb-1">SHIPPED TO / PLACE OF SUPPLY:</p>
              <p className="font-bold text-sm text-neutral-900">{invoice.customerName}</p>
              <p className="text-neutral-600 mt-1">{invoice.shippingAddress || invoice.billingAddress || 'Hyderabad, Telangana'}</p>
              <p className="text-neutral-700 font-semibold mt-1">
                <span className="text-neutral-500">Place of Supply:</span> {invoice.placeOfSupply || '36 - Telangana'}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto my-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0442A5] text-white font-semibold">
                  <th className="p-2.5 border border-[#0442A5]">#</th>
                  <th className="p-2.5 border border-[#0442A5]">Item & Art Description</th>
                  <th className="p-2.5 border border-[#0442A5]">HSN/SAC</th>
                  <th className="p-2.5 border border-[#0442A5] text-center">Qty</th>
                  <th className="p-2.5 border border-[#0442A5] text-right">Rate (₹)</th>
                  <th className="p-2.5 border border-[#0442A5] text-right">Taxable (₹)</th>
                  <th className="p-2.5 border border-[#0442A5] text-right">CGST</th>
                  <th className="p-2.5 border border-[#0442A5] text-right">SGST</th>
                  <th className="p-2.5 border border-[#0442A5] text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 border border-neutral-300">
                {invoice.items.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'}>
                    <td className="p-2.5 border border-neutral-200 text-center font-semibold">{index + 1}</td>
                    <td className="p-2.5 border border-neutral-200 font-semibold text-neutral-900">{item.productTitle || item.productName || ''}</td>
                    <td className="p-2.5 border border-neutral-200 text-neutral-600 font-mono">{item.hsnCode || '9701'}</td>
                    <td className="p-2.5 border border-neutral-200 text-center font-bold">{item.quantity}</td>
                    <td className="p-2.5 border border-neutral-200 text-right">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                    <td className="p-2.5 border border-neutral-200 text-right font-semibold">₹{(item.taxableAmount || item.subtotal || 0).toLocaleString('en-IN')}</td>
                    <td className="p-2.5 border border-neutral-200 text-right text-neutral-600 font-mono">
                      {(item.cgstRate || 0) > 0 ? `₹${(item.cgstAmount || 0).toLocaleString('en-IN')} (${item.cgstRate}%)` : '-'}
                    </td>
                    <td className="p-2.5 border border-neutral-200 text-right text-neutral-600 font-mono">
                      {(item.sgstRate || 0) > 0 ? `₹${(item.sgstAmount || 0).toLocaleString('en-IN')} (${item.sgstRate}%)` : '-'}
                    </td>
                    <td className="p-2.5 border border-neutral-200 text-right font-bold text-neutral-900">₹{(item.totalAmount || item.total || 0).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Summary */}
          <div className="grid grid-cols-2 gap-6 my-6">
            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 text-xs space-y-2">
              <p className="font-bold text-[#0442A5] uppercase tracking-wider">BANK PAYMENT DETAILS:</p>
              <p><span className="font-semibold text-neutral-700">Bank Name:</span> HDFC Bank Ltd</p>
              <p><span className="font-semibold text-neutral-700">Account Name:</span> HOUSE OF SEETAH</p>
              <p><span className="font-semibold text-neutral-700">Account No:</span> 50200088991122</p>
              <p><span className="font-semibold text-neutral-700">IFSC Code:</span> HDFC0001234</p>
              <p><span className="font-semibold text-neutral-700">UPI ID:</span> houseofseetah@hdfcbank</p>
            </div>

            <div className="space-y-1.5 text-xs text-right border-t border-b border-neutral-300 py-3">
              <div className="flex justify-between text-neutral-600">
                <span>Taxable Amount:</span>
                <span className="font-semibold">₹{invoice.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Total Tax (CGST + SGST / IGST):</span>
                <span className="font-semibold">₹{(invoice.totalTax || invoice.totalGst || 0).toLocaleString('en-IN')}</span>
              </div>
              {(invoice.discountAmount || invoice.totalDiscount || 0) > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Special Heritage Discount:</span>
                  <span>-₹{(invoice.discountAmount || invoice.totalDiscount || 0).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-[#0442A5] border-t border-neutral-300 pt-2 mt-2">
                <span>GRAND TOTAL:</span>
                <span>₹{invoice.grandTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-neutral-700 font-semibold">
                <span>Amount Paid:</span>
                <span className="text-emerald-600">₹{invoice.amountPaid.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-red-600">
                <span>BALANCE DUE:</span>
                <span>₹{invoice.balanceDue.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Terms & Authorization */}
          <div className="border-t-2 border-neutral-300 pt-6 mt-8 grid grid-cols-2 gap-6 text-xs text-neutral-600">
            <div>
              <p className="font-bold text-neutral-800 uppercase tracking-wider mb-1">TERMS & CONDITIONS:</p>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                <li>All art pieces are handcrafted; natural variation in texture is proof of authenticity.</li>
                <li>Goods once sold can be exchanged within 7 days against valid store credit.</li>
                <li>Subject to Hyderabad Jurisdiction. E.&O.E.</li>
              </ul>
            </div>

            <div className="text-right flex flex-col justify-end items-end">
              <p className="font-serif font-bold text-neutral-900 text-sm">For HOUSE OF SEETAH</p>
              <div className="h-12 w-36 border-b border-dashed border-neutral-400 my-2 flex items-center justify-center text-[10px] text-neutral-400 italic">
                Authorized Signatory
              </div>
              <p className="text-[10px] text-neutral-500">This is a computer-generated tax invoice.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
