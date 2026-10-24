import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dbService } from '../../services/db';
import { Invoice, Enquiry, Product, Customer, WorkOrder, RawMaterial, LogisticsShipment } from '../../types';
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
  ExternalLink,
  Hammer,
  Gem,
  Truck,
  Lock,
  ChevronRight
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
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [shipments, setShipments] = useState<LogisticsShipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [invData, enqData, prodData, custData, woData, matData, shipData] = await Promise.all([
        dbService.getInvoices(),
        dbService.getEnquiries(),
        dbService.getProducts(),
        dbService.getCustomers(),
        dbService.getWorkOrders(),
        dbService.getRawMaterials(),
        dbService.getShipments()
      ]);
      setInvoices(invData);
      setEnquiries(enqData);
      setProducts(prodData);
      setCustomers(custData);
      setWorkOrders(woData);
      setRawMaterials(matData);
      setShipments(shipData);
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

  // Atelier ERP Highlights
  const activeWipList = workOrders.filter(w => w.stage !== 'Completed');
  const activeWipCount = activeWipList.length;
  const totalWipValuation = workOrders.reduce((sum, w) => sum + (w.estimatedRetailValue || 0), 0);
  const lowStockCount = rawMaterials.filter(m => m.currentStock <= m.reorderLevel).length;
  const activeShipmentsCount = shipments.filter(s => s.currentStatus !== 'Delivered').length;

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-white via-slate-50/80 to-indigo-50/40 p-6 rounded-2xl border border-slate-200/90 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center space-x-2 text-xs text-amber-800 font-semibold tracking-wider uppercase mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/70 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> House of Seetah Commercial Operations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-wide">
            Executive Financial & CRM Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time overview of invoices, GST calculations, client enquiries, and payment collection.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/invoices/new"
            className="px-4 py-2.5 rounded-xl bg-[#0442A5] hover:bg-[#033585] text-white text-xs font-semibold shadow-xs flex items-center space-x-2 transition-all transform hover:scale-[1.01]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Invoice</span>
          </Link>
          <Link
            to="/admin/products"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-xs flex items-center space-x-2 transition-colors"
          >
            <Package className="w-4 h-4 text-amber-600" />
            <span>Catalog ({totalProductsCount})</span>
          </Link>
        </div>
      </div>

      {/* 9 KPI CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
        {/* Card 1: Total Billed */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all relative overflow-hidden group">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Billed Revenue</p>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mt-1">₹{totalBilled.toLocaleString('en-IN')}</h3>
            </div>
            <div className="p-3 bg-sky-50 text-sky-700 rounded-xl border border-sky-200/70">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-3 mt-2">
            <span>Across {totalInvoicesCount} tax invoices</span>
            <span className="text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200/60 text-[10px]">100% Verified</span>
          </div>
        </div>

        {/* Card 2: Total Paid */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all relative overflow-hidden group">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Collections (Paid)</p>
              <h3 className="text-2xl font-serif font-bold text-emerald-800 mt-1">₹{totalPaid.toLocaleString('en-IN')}</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200/70">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-3 mt-2">
            <span>Bank & UPI Received</span>
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 text-[10px]">{recoveryRate}% Settled</span>
          </div>
        </div>

        {/* Card 3: Pending Outstanding */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all relative overflow-hidden group">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pending Outstanding</p>
              <h3 className="text-2xl font-serif font-bold text-amber-900 mt-1">₹{totalOutstanding.toLocaleString('en-IN')}</h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-200/70">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-3 mt-2">
            <span>Balance due from clients</span>
            <Link to="/admin/invoices" className="text-amber-800 font-semibold hover:underline flex items-center gap-1 text-[11px]">
              View Receivables <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Card 4: Invoices Issued */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Invoices Issued</p>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mt-1">{totalInvoicesCount}</h3>
            </div>
            <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-200/70">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 mt-2">GST Compliant Tax Documentation</p>
        </div>

        {/* Card 5: Registered Customers */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Client Registry</p>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mt-1">{totalCustomersCount}</h3>
            </div>
            <div className="p-2.5 bg-purple-50 text-purple-700 rounded-xl border border-purple-200/70">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 mt-2">Verified HSN/GST billing profiles</p>
        </div>

        {/* Card 6: Catalog Products */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Art Collection Catalog</p>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mt-1">{totalProductsCount}</h3>
            </div>
            <div className="p-2.5 bg-rose-50 text-rose-700 rounded-xl border border-rose-200/70">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 mt-2">Authentic Indian Masterpiece Items</p>
        </div>

        {/* Card 7: New Enquiries */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">New Web Enquiries</p>
              <h3 className="text-2xl font-serif font-bold text-orange-800 mt-1">{pendingEnquiriesCount}</h3>
            </div>
            <div className="p-2.5 bg-orange-50 text-orange-700 rounded-xl border border-orange-200/70">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 mt-2">Awaiting Sales Manager Follow-up</p>
        </div>

        {/* Card 8: Average Order Value */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Average Order Value</p>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mt-1">₹{avgOrderValue.toLocaleString('en-IN')}</h3>
            </div>
            <div className="p-2.5 bg-yellow-50 text-yellow-800 rounded-xl border border-yellow-200/70">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 mt-2">Per Art Purchase Ticket</p>
        </div>

        {/* Card 9: Collection Recovery Rate */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Payment Recovery Rate</p>
              <h3 className="text-2xl font-serif font-bold text-teal-800 mt-1">{recoveryRate}%</h3>
            </div>
            <div className="p-2.5 bg-teal-50 text-teal-700 rounded-xl border border-teal-200/70">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 mt-2">Capital Liquidity Efficiency</p>
        </div>
      </div>

      {/* ATELIER ERP & STUDIO OPERATIONS QUICK HUB */}
      <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FAF8F5] to-[#F1F5F9] border border-amber-200/80 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-900 uppercase tracking-wider mb-1">
              <Hammer className="w-4 h-4 text-amber-700" />
              <span>Atelier Operations & Craftsmanship ERP</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] border border-amber-200/80 font-bold">
                ERP 2.0 Live
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
              Studio Workshop Pipeline & Vault Operations
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              Real-time oversight of master artisans, 24K gold foil allocation, active commissions across 8 craftsmanship stages, and insured logistics consignments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/erp"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0442A5] to-[#033585] hover:from-[#033585] hover:to-[#0442A5] text-white text-xs font-semibold shadow-xs flex items-center space-x-2 transition-all transform hover:scale-[1.01]"
            >
              <Hammer className="w-4 h-4" />
              <span>Launch Atelier ERP Console</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 4 Mini ERP Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-amber-200/60 relative z-10">
          <Link to="/admin/erp" className="bg-white/90 hover:bg-white border border-slate-200/80 p-3.5 rounded-xl transition-all shadow-xs group">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-medium uppercase tracking-wider">Active WIP Commissions</span>
              <Hammer className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl font-serif font-bold text-slate-900">{activeWipCount} Artworks</div>
            <span className="text-[10px] text-amber-800 font-semibold">₹{totalWipValuation.toLocaleString('en-IN')} Est. Valuation</span>
          </Link>

          <Link to="/admin/erp" className="bg-white/90 hover:bg-white border border-slate-200/80 p-3.5 rounded-xl transition-all shadow-xs group">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-medium uppercase tracking-wider">Precious Vault Stock</span>
              <Gem className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl font-serif font-bold text-slate-900">{rawMaterials.length} Vault SKUs</div>
            <span className={`text-[10px] font-semibold ${lowStockCount > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
              {lowStockCount > 0 ? `⚠️ ${lowStockCount} below reorder threshold` : 'All inventory levels optimal'}
            </span>
          </Link>

          <Link to="/admin/erp" className="bg-white/90 hover:bg-white border border-slate-200/80 p-3.5 rounded-xl transition-all shadow-xs group">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-medium uppercase tracking-wider">Transit Consignments</span>
              <Truck className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl font-serif font-bold text-slate-900">{activeShipmentsCount} In-Transit</div>
            <span className="text-[10px] text-sky-700 font-semibold">BVC & Sequel Armoured AWB</span>
          </Link>

          <Link to="/admin/erp" className="bg-white/90 hover:bg-white border border-slate-200/80 p-3.5 rounded-xl transition-all shadow-xs group">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-medium uppercase tracking-wider">Master Artisan Guild</span>
              <Users className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl font-serif font-bold text-slate-900">4 Master Guilds</div>
            <span className="text-[10px] text-purple-700 font-semibold">Tanjore, Pichwai & Nirmal</span>
          </Link>
        </div>
      </div>

      {/* GRAPH: REVENUE & COLLECTIONS TREND */}
      <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-serif font-bold text-slate-900">Billed Revenue vs. Payments Collected</h3>
            <p className="text-xs text-slate-500">Monthly breakdown of gross invoice volume and cash realization</p>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-[#0442A5]" />
              <span className="text-slate-600 font-medium">Billed Total</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-600 font-medium">Collected Total</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', color: '#0F172A', fontSize: '12px', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Amount']}
                />
                <Bar dataKey="billed" fill="#0442A5" radius={[6, 6, 0, 0]} name="Billed" />
                <Bar dataKey="paid" fill="#10B981" radius={[6, 6, 0, 0]} name="Paid" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              No revenue data available for graphical display.
            </div>
          )}
        </div>
      </div>

      {/* TWO COLUMN GRID: RECENT ENQUIRIES CRM & RECENT INVOICES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CRM Widget: Pending Customer Enquiries */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-orange-600" />
                <h3 className="font-serif text-lg font-bold text-slate-900">Recent Art Enquiries</h3>
              </div>
              <Link to="/admin/enquiries" className="text-xs text-indigo-700 hover:underline flex items-center gap-1 font-semibold">
                View All CRM ({enquiries.length}) <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {enquiries.slice(0, 4).map((enq) => (
                <div key={enq.id} className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm text-slate-900 truncate">{enq.customerName}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                        enq.status === 'New' ? 'bg-orange-50 text-orange-800 border border-orange-200' :
                        enq.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {enq.status}
                      </span>
                    </div>
                    <p className="text-xs text-amber-800 font-medium mt-0.5 truncate">{enq.productTitle || 'General Enquiry'}</p>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{enq.message}</p>
                  </div>

                  <div className="flex flex-col items-end space-y-2 shrink-0">
                    {enq.customerPhone && (
                      <a
                        href={`https://wa.me/${enq.customerPhone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(enq.customerName)},%20thank%20you%20for%20enquiring%20about%20${encodeURIComponent(enq.productTitle || 'House of Seetah Art')}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center space-x-1 border border-emerald-200 transition-colors"
                      >
                        <PhoneCall className="w-3 h-3 text-emerald-600" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                    <span className="text-[10px] text-slate-400">
                      {new Date(enq.createdAt || enq.date || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              ))}

              {enquiries.length === 0 && (
                <p className="text-center text-xs text-slate-400 py-6">No customer enquiries received yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Commercial Widget: Recent Invoices */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#0442A5]" />
                <h3 className="font-serif text-lg font-bold text-slate-900">Recent Commercial Invoices</h3>
              </div>
              <Link to="/admin/invoices" className="text-xs text-indigo-700 hover:underline flex items-center gap-1 font-semibold">
                View All Invoices ({invoices.length}) <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {invoices.slice(0, 4).map((inv) => (
                <div key={inv.id} className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-indigo-900">{inv.invoiceNumber}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                        inv.status === 'PAID' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        inv.status === 'PARTIAL' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-900 mt-1 truncate">{inv.customerName}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Total: ₹{inv.grandTotal.toLocaleString('en-IN')} | Due: ₹{inv.balanceDue.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedInvoice(inv)}
                    className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 shadow-xs transition-colors"
                    title="Inspect & Print Invoice"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {invoices.length === 0 && (
                <p className="text-center text-xs text-slate-400 py-6">No invoices created yet.</p>
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
