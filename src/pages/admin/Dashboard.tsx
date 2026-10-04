import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dbService } from '../../services/db';
import { Invoice, Enquiry, Product, Customer } from '../../types';
import { InvoiceViewModal } from './InvoiceViewModal';
import {
  TrendingUp,
  CreditCard,
  AlertCircle,
  FileText,
  Users,
  Package,
  MessageSquare,
  PlusCircle,
  Clock,
  ArrowUpRight,
  Eye,
  CheckCircle2,
  DollarSign,
  Percent,
  Download,
  PhoneCall,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export const Dashboard: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [invData, enqData, prodData, custData] = await Promise.all([
        dbService.getInvoices(),
        dbService.getEnquiries(),
        dbService.getProducts(),
        dbService.getCustomers()
      ]);
      setInvoices(invData);
      setEnquiries(enqData);
      setProducts(prodData);
      setCustomers(custData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // KPI Calculations
  const totalBilled = invoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + (inv.amountPaid || 0), 0);
  const totalOutstanding = invoices.reduce((sum, inv) => sum + (inv.balanceDue || 0), 0);
  const totalInvoicesCount = invoices.length;
  const totalCustomersCount = customers.length;
  const totalProductsCount = products.length;
  const pendingEnquiriesCount = enquiries.filter(e => e.status === 'New').length;
  const avgOrderValue = totalInvoicesCount > 0 ? Math.round(totalBilled / totalInvoicesCount) : 0;
  const recoveryRate = totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 0;

  // Chart Data Processing
  const monthlyRevenueMap: Record<string, { month: string; billed: number; paid: number }> = {};
  
  invoices.forEach(inv => {
    const dateObj = new Date(inv.issueDate || inv.invoiceDate || inv.createdAt || Date.now());
    const monthKey = dateObj.toLocaleString('en-US', { month: 'short', year: '2-digit' });
    if (!monthlyRevenueMap[monthKey]) {
      monthlyRevenueMap[monthKey] = { month: monthKey, billed: 0, paid: 0 };
    }
    monthlyRevenueMap[monthKey].billed += inv.grandTotal || 0;
    monthlyRevenueMap[monthKey].paid += inv.amountPaid || 0;
  });

  const chartData = Object.values(monthlyRevenueMap).reverse();

  const handleEnquiryStatusChange = async (id: string, newStatus: Enquiry['status']) => {
    await dbService.updateEnquiryStatus(id, newStatus);
    loadDashboardData();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#0442A5] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-neutral-400 text-sm font-medium">Initializing House of Seetah Commercial Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#141822] via-[#1A202C] to-[#141822] p-6 rounded-2xl border border-neutral-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#D4AF37] font-semibold tracking-wider uppercase mb-1">
            <Sparkles className="w-4 h-4" /> House of Seetah Commercial Operations
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
            Executive Financial & CRM Dashboard
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time overview of invoices, GST calculations, client enquiries, and payment collection.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/invoices/new"
            className="px-4 py-2.5 rounded-xl bg-[#0442A5] hover:bg-[#0553d1] text-white text-xs font-semibold shadow-lg shadow-[#0442A5]/30 flex items-center space-x-2 transition-all transform hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Invoice</span>
          </Link>
          <Link
            to="/admin/products"
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700 flex items-center space-x-2 transition-colors"
          >
            <Package className="w-4 h-4 text-[#D4AF37]" />
            <span>Catalog ({totalProductsCount})</span>
          </Link>
        </div>
      </div>

      {/* 9 KPI CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
        {/* Card 1: Total Billed */}
        <div className="bg-[#161922] border border-neutral-800 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-[#0442A5]/50 transition-all">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Total Billed Revenue</p>
              <h3 className="text-2xl font-serif font-bold text-white mt-1">₹{totalBilled.toLocaleString('en-IN')}</h3>
            </div>
            <div className="p-3 bg-[#0442A5]/20 text-[#0442A5] rounded-xl border border-[#0442A5]/30">
              <TrendingUp className="w-5 h-5 text-[#CDEBFF]" />
            </div>
          </div>
          <div className="text-[11px] text-neutral-400 flex items-center justify-between border-t border-neutral-800/80 pt-3 mt-2">
            <span>Across {totalInvoicesCount} tax invoices</span>
            <span className="text-[#CDEBFF] font-semibold">100% Verified</span>
          </div>
        </div>

        {/* Card 2: Total Paid */}
        <div className="bg-[#161922] border border-neutral-800 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Total Collections (Paid)</p>
              <h3 className="text-2xl font-serif font-bold text-emerald-400 mt-1">₹{totalPaid.toLocaleString('en-IN')}</h3>
            </div>
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[11px] text-neutral-400 flex items-center justify-between border-t border-neutral-800/80 pt-3 mt-2">
            <span>Bank & UPI Received</span>
            <span className="text-emerald-400 font-semibold">{recoveryRate}% Settled</span>
          </div>
        </div>

        {/* Card 3: Pending Outstanding */}
        <div className="bg-[#161922] border border-neutral-800 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-amber-500/50 transition-all">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Pending Outstanding</p>
              <h3 className="text-2xl font-serif font-bold text-amber-400 mt-1">₹{totalOutstanding.toLocaleString('en-IN')}</h3>
            </div>
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[11px] text-neutral-400 flex items-center justify-between border-t border-neutral-800/80 pt-3 mt-2">
            <span>Balance due from clients</span>
            <Link to="/admin/invoices" className="text-amber-400 font-semibold hover:underline flex items-center gap-1">
              View Receivables <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Card 4: Invoices Issued */}
        <div className="bg-[#161922] border border-neutral-800 p-5 rounded-2xl shadow-lg">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Invoices Issued</p>
              <h3 className="text-2xl font-serif font-bold text-white mt-1">{totalInvoicesCount}</h3>
            </div>
            <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-neutral-400 pt-2 border-t border-neutral-800/80 mt-2">GST Compliant Tax Documentation</p>
        </div>

        {/* Card 5: Registered Customers */}
        <div className="bg-[#161922] border border-neutral-800 p-5 rounded-2xl shadow-lg">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Client Registry</p>
              <h3 className="text-2xl font-serif font-bold text-white mt-1">{totalCustomersCount}</h3>
            </div>
            <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-neutral-400 pt-2 border-t border-neutral-800/80 mt-2">Verified HSN/GST billing profiles</p>
        </div>

        {/* Card 6: Catalog Products */}
        <div className="bg-[#161922] border border-neutral-800 p-5 rounded-2xl shadow-lg">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Art Collection Catalog</p>
              <h3 className="text-2xl font-serif font-bold text-white mt-1">{totalProductsCount}</h3>
            </div>
            <div className="p-2.5 bg-purple-500/20 text-purple-400 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-neutral-400 pt-2 border-t border-neutral-800/80 mt-2">Authentic Indian Masterpiece Items</p>
        </div>

        {/* Card 7: New Enquiries */}
        <div className="bg-[#161922] border border-neutral-800 p-5 rounded-2xl shadow-lg">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">New Web Enquiries</p>
              <h3 className="text-2xl font-serif font-bold text-[#C85A32] mt-1">{pendingEnquiriesCount}</h3>
            </div>
            <div className="p-2.5 bg-[#C85A32]/20 text-[#C85A32] rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-neutral-400 pt-2 border-t border-neutral-800/80 mt-2">Awaiting Sales Manager Follow-up</p>
        </div>

        {/* Card 8: Average Order Value */}
        <div className="bg-[#161922] border border-neutral-800 p-5 rounded-2xl shadow-lg">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Average Order Value</p>
              <h3 className="text-2xl font-serif font-bold text-white mt-1">₹{avgOrderValue.toLocaleString('en-IN')}</h3>
            </div>
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-neutral-400 pt-2 border-t border-neutral-800/80 mt-2">Per Art Purchase Ticket</p>
        </div>

        {/* Card 9: Collection Recovery Rate */}
        <div className="bg-[#161922] border border-neutral-800 p-5 rounded-2xl shadow-lg">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Payment Recovery Rate</p>
              <h3 className="text-2xl font-serif font-bold text-emerald-400 mt-1">{recoveryRate}%</h3>
            </div>
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-neutral-400 pt-2 border-t border-neutral-800/80 mt-2">Capital Liquidity Efficiency</p>
        </div>
      </div>

      {/* GRAPH: REVENUE & COLLECTIONS TREND */}
      <div className="bg-[#161922] border border-neutral-800 p-6 rounded-2xl shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-serif font-bold text-white">Billed Revenue vs. Payments Collected</h3>
            <p className="text-xs text-neutral-400">Monthly breakdown of gross invoice volume and cash realization</p>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-[#0442A5]" />
              <span className="text-neutral-300">Billed Total</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-neutral-300">Collected Total</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262C3A" vertical={false} />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} tickLine={false} />
                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0D1117', borderColor: '#30363D', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Amount']}
                />
                <Bar dataKey="billed" fill="#0442A5" radius={[6, 6, 0, 0]} name="Billed" />
                <Bar dataKey="paid" fill="#10B981" radius={[6, 6, 0, 0]} name="Paid" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-neutral-500 text-sm">
              No revenue data available for graphical display.
            </div>
          )}
        </div>
      </div>

      {/* TWO COLUMN GRID: RECENT ENQUIRIES CRM & RECENT INVOICES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CRM Widget: Pending Customer Enquiries */}
        <div className="bg-[#161922] border border-neutral-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-[#C85A32]" />
                <h3 className="font-serif text-lg font-bold text-white">Recent Art Enquiries</h3>
              </div>
              <Link to="/admin/enquiries" className="text-xs text-[#CDEBFF] hover:underline flex items-center gap-1 font-semibold">
                View All CRM ({enquiries.length}) <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {enquiries.slice(0, 4).map((enq) => (
                <div key={enq.id} className="p-3.5 rounded-xl bg-[#0D1117] border border-neutral-800/80 hover:border-neutral-700 transition-all flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm text-white truncate">{enq.customerName}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                        enq.status === 'New' ? 'bg-[#C85A32]/20 text-[#C85A32] border border-[#C85A32]/40' :
                        enq.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-300'
                      }`}>
                        {enq.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#D4AF37] font-medium mt-0.5 truncate">{enq.productTitle || 'General Enquiry'}</p>
                    <p className="text-[11px] text-neutral-400 mt-1 line-clamp-1">{enq.message}</p>
                  </div>

                  <div className="flex flex-col items-end space-y-2 shrink-0">
                    {enq.customerPhone && (
                      <a
                        href={`https://wa.me/${enq.customerPhone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(enq.customerName)},%20thank%20you%20for%20enquiring%20about%20${encodeURIComponent(enq.productTitle || 'House of Seetah Art')}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-semibold flex items-center space-x-1 border border-emerald-500/30 transition-colors"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                    <span className="text-[10px] text-neutral-500">
                      {new Date(enq.createdAt || enq.date || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              ))}

              {enquiries.length === 0 && (
                <p className="text-center text-xs text-neutral-500 py-6">No customer enquiries received yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Commercial Widget: Recent Invoices */}
        <div className="bg-[#161922] border border-neutral-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#0442A5]" />
                <h3 className="font-serif text-lg font-bold text-white">Recent Commercial Invoices</h3>
              </div>
              <Link to="/admin/invoices" className="text-xs text-[#CDEBFF] hover:underline flex items-center gap-1 font-semibold">
                View All Invoices ({invoices.length}) <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {invoices.slice(0, 4).map((inv) => (
                <div key={inv.id} className="p-3.5 rounded-xl bg-[#0D1117] border border-neutral-800/80 hover:border-neutral-700 transition-all flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-[#CDEBFF]">{inv.invoiceNumber}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                        inv.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400' :
                        inv.status === 'PARTIAL' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-white mt-1 truncate">{inv.customerName}</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Total: ₹{inv.grandTotal.toLocaleString('en-IN')} | Due: ₹{inv.balanceDue.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedInvoice(inv)}
                    className="p-2 rounded-lg bg-neutral-800 hover:bg-[#0442A5] text-neutral-300 hover:text-white transition-colors"
                    title="Inspect & Print Invoice"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {invoices.length === 0 && (
                <p className="text-center text-xs text-neutral-500 py-6">No invoices created yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Invoice View & Print Modal */}
      {selectedInvoice && (
        <InvoiceViewModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onRefresh={loadDashboardData}
        />
      )}
    </div>
  );
};
