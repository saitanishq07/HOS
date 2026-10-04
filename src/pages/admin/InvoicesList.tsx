import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dbService } from '../../services/db';
import { Invoice } from '../../types';
import { InvoiceViewModal } from './InvoiceViewModal';
import { FileText, PlusCircle, Search, Filter, Eye, Download, Printer, CheckCircle2, Clock, AlertCircle, ArrowUpRight } from 'lucide-react';

export const InvoicesList: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const data = await dbService.getInvoices();
      setInvoices(data);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.customerGstin && inv.customerGstin.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = selectedStatus === 'ALL' || inv.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    const headers = ['Invoice Number', 'Issue Date', 'Customer', 'GSTIN', 'Grand Total', 'Amount Paid', 'Balance Due', 'Status'];
    const rows = filteredInvoices.map(inv => [
      inv.invoiceNumber,
      inv.issueDate,
      `"${inv.customerName}"`,
      inv.customerGstin || '',
      inv.grandTotal,
      inv.amountPaid,
      inv.balanceDue,
      inv.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HouseOfSeetah_Invoices_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            <FileText className="w-6 h-6 text-[#0442A5]" />
            <span>Commercial Tax Invoices</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Master billing register with GST tax compliance, A4 printing, and payment status tracking.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={exportCSV}
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700 flex items-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4 text-[#D4AF37]" />
            <span>Export CSV</span>
          </button>

          <Link
            to="/admin/invoices/new"
            className="px-4 py-2.5 rounded-xl bg-[#0442A5] hover:bg-[#0553d1] text-white text-xs font-semibold shadow-lg shadow-[#0442A5]/30 flex items-center space-x-2 transition-all transform hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Invoice</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#161922] p-4 rounded-2xl border border-neutral-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by invoice # (e.g. HOS-2026-001), client name, or GSTIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0D1117] border border-neutral-700/80 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#0442A5]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
          <Filter className="w-4 h-4 text-neutral-400 shrink-0" />
          {['ALL', 'PAID', 'PARTIAL', 'ISSUED', 'OVERDUE', 'DRAFT'].map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedStatus === status ? 'bg-[#0442A5] text-white' : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Master Table */}
      <div className="bg-[#161922] border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0D1117] text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Issue Date</th>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">GSTIN</th>
                <th className="py-3.5 px-4 text-right">Grand Total</th>
                <th className="py-3.5 px-4 text-right">Amount Paid</th>
                <th className="py-3.5 px-4 text-right">Balance Due</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 text-neutral-200">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#1D2230] transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-[#CDEBFF]">{inv.invoiceNumber}</td>
                  <td className="py-4 px-4 text-neutral-400">
                    {new Date(inv.issueDate || inv.invoiceDate || inv.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-4 px-4 font-semibold text-white">{inv.customerName}</td>
                  <td className="py-4 px-4 font-mono text-neutral-400">{inv.customerGstin || 'URP'}</td>
                  <td className="py-4 px-4 text-right font-bold text-white">₹{inv.grandTotal.toLocaleString('en-IN')}</td>
                  <td className="py-4 px-4 text-right font-semibold text-emerald-400">₹{inv.amountPaid.toLocaleString('en-IN')}</td>
                  <td className="py-4 px-4 text-right font-bold text-red-400">₹{inv.balanceDue.toLocaleString('en-IN')}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md ${
                      inv.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      inv.status === 'PARTIAL' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-[#0442A5] text-neutral-300 hover:text-white font-semibold transition-colors flex items-center space-x-1.5 mx-auto"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect & Print</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="p-12 text-center text-neutral-500 text-xs">
            No tax invoices match your current search or status filter.
          </div>
        )}
      </div>

      {/* View & Print Modal */}
      {selectedInvoice && (
        <InvoiceViewModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onRefresh={loadInvoices}
        />
      )}
    </div>
  );
};
