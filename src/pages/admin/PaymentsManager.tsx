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
          <h1 className="font-serif text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-400" />
            <span>Payments & Collections Register</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Realized revenue receipts via HDFC Bank, UPI, NEFT, and Cash settlement logs.
          </p>
        </div>

        <div className="bg-[#161922] px-5 py-3 rounded-2xl border border-neutral-800 flex items-center space-x-3 shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-[10px] text-neutral-400 uppercase font-semibold">Total Verified Collections</p>
            <p className="text-lg font-serif font-bold text-emerald-400">₹{totalCollected.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-[#161922] p-4 rounded-2xl border border-neutral-800">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search payment logs by client name, invoice number, or reference UTR..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0D1117] border border-neutral-700/80 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#0442A5]"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-[#161922] border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0D1117] text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
              <tr>
                <th className="py-3.5 px-4">Receipt Ref #</th>
                <th className="py-3.5 px-4">Payment Date</th>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Mode</th>
                <th className="py-3.5 px-4 text-right">Amount Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 text-neutral-200">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-[#1D2230] transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-[#CDEBFF]">{p.referenceNumber || p.id}</td>
                  <td className="py-4 px-4 text-neutral-400">
                    {new Date(p.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-4 px-4 font-mono font-semibold text-neutral-300">{p.invoiceNumber}</td>
                  <td className="py-4 px-4 font-bold text-white">{p.customerName}</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-[#0442A5]/20 text-[#CDEBFF] border border-[#0442A5]/30">
                      {p.paymentMode}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right font-bold text-emerald-400 text-sm">₹{p.amount.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="p-12 text-center text-neutral-500 text-xs">
            No payment records logged yet.
          </div>
        )}
      </div>
    </div>
  );
};
