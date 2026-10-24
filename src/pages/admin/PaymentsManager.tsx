import React, { useState, useEffect } from 'react';
import { dbService } from '../../services/db';
import { Payment } from '../../types';
import { CreditCard, Plus, Search, Filter, Calendar, CheckCircle2, DollarSign } from 'lucide-react';

export const PaymentsManager: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const data = await dbService.getPayments();
      setPayments(data);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(p =>
    p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.referenceNumber && p.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-[#0442A5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-slate-900 tracking-wide flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-600" />
            <span>Payments & Collections Register</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Realized revenue receipts via HDFC Bank, UPI, NEFT, and Cash settlement logs.
          </p>
        </div>

        <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200/80 flex items-center space-x-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Total Verified Collections</p>
            <p className="text-lg font-serif font-bold text-emerald-700">₹{totalCollected.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search payment logs by client name, invoice number, or reference UTR..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Receipt Ref #</th>
                <th className="py-3.5 px-4">Payment Date</th>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Mode</th>
                <th className="py-3.5 px-4 text-right">Amount Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-indigo-950">{p.referenceNumber || p.id}</td>
                  <td className="py-4 px-4 text-slate-500">
                    {new Date(p.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-4 px-4 font-mono font-medium text-slate-600">{p.invoiceNumber}</td>
                  <td className="py-4 px-4 font-semibold text-slate-900">{p.customerName}</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 text-[10px] font-semibold rounded-md bg-indigo-50 text-indigo-900 border border-indigo-200/70">
                      {p.paymentMode}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right font-bold text-emerald-700 text-sm">₹{p.amount.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="p-12 text-center text-slate-400 text-xs">
            No payment records logged yet.
          </div>
        )}
      </div>
    </div>
  );
};
