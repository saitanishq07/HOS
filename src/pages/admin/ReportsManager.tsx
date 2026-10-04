import React, { useState, useEffect } from 'react';
import { dbService } from '../../services/db';
import { Invoice } from '../../types';
import { BarChart3, Download, Calendar, DollarSign, PieChart, FileText, CheckCircle2 } from 'lucide-react';

export const ReportsManager: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const data = await dbService.getInvoices();
      setInvoices(data);
    } catch (error) {
      console.error('Error loading invoices for reports:', error);
    } finally {
      setLoading(false);
    }
  };

  // GST & Revenue Totals
  const totalBilled = invoices.reduce((sum, i) => sum + i.grandTotal, 0);
  const totalTaxable = invoices.reduce((sum, i) => sum + i.subtotal, 0);
  const totalGst = invoices.reduce((sum, i) => sum + (i.totalTax || i.totalGst || 0), 0);
  const totalPaid = invoices.reduce((sum, i) => sum + i.amountPaid, 0);
  const totalDue = invoices.reduce((sum, i) => sum + i.balanceDue, 0);

  // Split calculations
  let cgstTotal = 0;
  let sgstTotal = 0;
  let igstTotal = 0;

  invoices.forEach(inv => {
    inv.items.forEach(item => {
      cgstTotal += item.cgstAmount || 0;
      sgstTotal += item.sgstAmount || 0;
      igstTotal += item.igstAmount || 0;
    });
  });

  const exportGstReport = () => {
    const headers = ['Invoice No', 'Date', 'Customer Name', 'GSTIN', 'Place of Supply', 'Taxable Value', 'CGST', 'SGST', 'IGST', 'Total Tax', 'Invoice Total'];
    const rows = invoices.map(inv => {
      let cgst = 0, sgst = 0, igst = 0;
      inv.items.forEach(it => {
        cgst += it.cgstAmount || 0;
        sgst += it.sgstAmount || 0;
        igst += it.igstAmount || 0;
      });
      return [
        inv.invoiceNumber,
        inv.issueDate,
        `"${inv.customerName}"`,
        inv.customerGstin || 'URP',
        `"${inv.placeOfSupply || '36 - Telangana'}"`,
        inv.subtotal,
        cgst,
        sgst,
        igst,
        inv.totalTax,
        inv.grandTotal
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HouseOfSeetah_GSTR1_Audit_${new Date().toISOString().split('T')[0]}.csv`);
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
            <BarChart3 className="w-6 h-6 text-[#D4AF37]" />
            <span>GST Compliance & Financial Audits</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            GSTR-1 tax return preparation, intrastate vs interstate tax split, and commercial audit exports.
          </p>
        </div>

        <button
          onClick={exportGstReport}
          className="px-4 py-2.5 rounded-xl bg-[#0442A5] hover:bg-[#0553d1] text-white text-xs font-semibold shadow-lg shadow-[#0442A5]/30 flex items-center space-x-2 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export GSTR-1 Audit CSV</span>
        </button>
      </div>

      {/* Tax Breakdown Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#161922] border border-neutral-800 p-5 rounded-2xl shadow-lg">
          <p className="text-xs text-neutral-400 uppercase font-semibold">Total Taxable Value</p>
          <h3 className="text-2xl font-serif font-bold text-white mt-1">₹{totalTaxable.toLocaleString('en-IN')}</h3>
          <p className="text-[11px] text-neutral-500 mt-2">Net Sales Before GST</p>
        </div>

        <div className="bg-[#161922] border border-neutral-800 p-5 rounded-2xl shadow-lg">
          <p className="text-xs text-neutral-400 uppercase font-semibold">Central GST (CGST)</p>
          <h3 className="text-2xl font-serif font-bold text-[#CDEBFF] mt-1">₹{cgstTotal.toLocaleString('en-IN')}</h3>
          <p className="text-[11px] text-neutral-500 mt-2">Telangana Intrastate Share</p>
        </div>

        <div className="bg-[#161922] border border-neutral-800 p-5 rounded-2xl shadow-lg">
          <p className="text-xs text-neutral-400 uppercase font-semibold">State GST (SGST)</p>
          <h3 className="text-2xl font-serif font-bold text-[#CDEBFF] mt-1">₹{sgstTotal.toLocaleString('en-IN')}</h3>
          <p className="text-[11px] text-neutral-500 mt-2">State Treasury Share</p>
        </div>

        <div className="bg-[#161922] border border-neutral-800 p-5 rounded-2xl shadow-lg">
          <p className="text-xs text-neutral-400 uppercase font-semibold">Integrated GST (IGST)</p>
          <h3 className="text-2xl font-serif font-bold text-[#D4AF37] mt-1">₹{igstTotal.toLocaleString('en-IN')}</h3>
          <p className="text-[11px] text-neutral-500 mt-2">Interstate Supply Share</p>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-[#161922] border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-white">GSTR-1 Tax Filing Ledger</h3>
          <span className="text-xs text-neutral-400">GSTIN: 36AABCH9988K1Z5</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0D1117] text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Supply Type</th>
                <th className="py-3 px-4 text-right">Taxable (₹)</th>
                <th className="py-3 px-4 text-right">CGST (₹)</th>
                <th className="py-3 px-4 text-right">SGST (₹)</th>
                <th className="py-3 px-4 text-right">IGST (₹)</th>
                <th className="py-3 px-4 text-right">Invoice Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 text-neutral-200">
              {invoices.map((inv) => {
                let cgst = 0, sgst = 0, igst = 0;
                inv.items.forEach(it => {
                  cgst += it.cgstAmount || 0;
                  sgst += it.sgstAmount || 0;
                  igst += it.igstAmount || 0;
                });
                return (
                  <tr key={inv.id} className="hover:bg-[#1D2230] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#CDEBFF]">{inv.invoiceNumber}</td>
                    <td className="py-3.5 px-4 text-neutral-400">{inv.issueDate}</td>
                    <td className="py-3.5 px-4 font-semibold text-white">{inv.customerName}</td>
                    <td className="py-3.5 px-4 text-neutral-400">{inv.placeOfSupply || 'Intrastate'}</td>
                    <td className="py-3.5 px-4 text-right font-semibold">₹{inv.subtotal.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-right text-neutral-300">₹{cgst.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-right text-neutral-300">₹{sgst.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-right text-[#D4AF37]">₹{igst.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-white">₹{inv.grandTotal.toLocaleString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
