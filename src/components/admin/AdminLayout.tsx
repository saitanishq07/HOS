import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dbService, getImageUrl } from '../../services/db';
import { Enquiry } from '../../types';
import {
  LayoutDashboard,
  MessageSquare,
  Package,
  FileText,
  Users,
  CreditCard,
  BarChart3,
  Sliders,
  Settings,
  LogOut,
  Globe,
  Menu,
  X,
  PlusCircle,
  Bell,
  Sparkles,
  ChevronRight,
  Hammer
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [newEnquiryCount, setNewEnquiryCount] = useState(0);
  const [activeWipCount, setActiveWipCount] = useState(0);

  useEffect(() => {
    const fetchCounters = async () => {
      try {
        const [enquiries, workOrders] = await Promise.all([
          dbService.getEnquiries(),
          dbService.getWorkOrders()
        ]);
        const pending = enquiries.filter(e => e.status === 'New').length;
        const wip = workOrders.filter(w => w.status === 'Active').length;
        setNewEnquiryCount(pending);
        setActiveWipCount(wip);
      } catch (error) {
        console.error('Error fetching admin counters:', error);
      }
    };
    fetchCounters();
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Atelier ERP & Ops', path: '/admin/erp', icon: Hammer, badge: activeWipCount },
    { label: 'Enquiries (CRM)', path: '/admin/enquiries', icon: MessageSquare, badge: newEnquiryCount },
    { label: 'Product Catalog', path: '/admin/products', icon: Package },
    { label: 'Invoices', path: '/admin/invoices', icon: FileText },
    { label: 'Create Invoice', path: '/admin/invoices/new', icon: PlusCircle },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Payments', path: '/admin/payments', icon: CreditCard },
    { label: 'Reports & GST', path: '/admin/reports', icon: BarChart3 },
    { label: 'Website Content', path: '/admin/content', icon: Sliders },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 flex font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200/80 text-slate-800 shrink-0 shadow-[2px_0_12px_rgba(0,0,0,0.02)] z-20">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center space-x-3">
            <img src={getImageUrl('/logo.png')} alt="House of Seetah" className="h-11 w-auto object-contain" />
            <div>
              <h1 className="font-serif text-lg font-bold tracking-wide text-slate-900">HOUSE OF SEETAH</h1>
              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] bg-amber-50 text-amber-800 border border-amber-200/60 font-semibold tracking-wider uppercase">
                Atelier ERP & Console
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-150 text-xs font-medium ${
                  isActive
                    ? 'bg-indigo-50/90 text-indigo-900 border border-indigo-200/70 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    item.label.includes('ERP')
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Public Site Link & User Profile */}
        <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50/50">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-xs text-slate-600 hover:text-slate-900 border border-slate-200/80 shadow-xs transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-amber-600" />
              <span className="font-medium">View Live Atelier</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300/60 flex items-center justify-center text-amber-800 font-bold text-xs shrink-0">
                {user?.email ? user.email[0].toUpperCase() : 'A'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-900 truncate">{user?.displayName || 'Administrator'}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F9FA] text-slate-800">
        {/* Top Header */}
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-900 rounded-lg focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="hidden sm:flex items-center space-x-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200/70 font-medium flex items-center gap-1.5 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> House of Seetah Commercial Core v2.4
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {newEnquiryCount > 0 && (
              <Link
                to="/admin/enquiries"
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200/80 text-orange-800 text-xs font-medium hover:bg-orange-100/80 transition-colors"
              >
                <Bell className="w-4 h-4 text-orange-600 animate-bounce" />
                <span>{newEnquiryCount} New Art {newEnquiryCount === 1 ? 'Enquiry' : 'Enquiries'}</span>
              </Link>
            )}

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            <Link
              to="/admin/invoices/new"
              className="px-4 py-2 rounded-xl bg-[#0442A5] hover:bg-[#033585] text-white text-xs font-semibold shadow-xs flex items-center space-x-2 transition-all transform hover:scale-[1.01]"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">New Tax Invoice</span>
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm flex">
            <div className="w-4/5 max-w-sm bg-white p-6 text-slate-800 flex flex-col justify-between shadow-2xl border-r border-slate-200">
              <div>
                <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-5">
                  <div className="flex items-center space-x-3">
                    <img src={getImageUrl('/logo.png')} alt="Logo" className="w-8 h-8 object-contain" />
                    <div>
                      <span className="font-serif font-bold text-base text-slate-900">House of Seetah</span>
                      <p className="text-[9px] text-amber-700 uppercase font-semibold">Atelier Admin</p>
                    </div>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-900">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium ${
                          isActive
                            ? 'bg-indigo-50 text-indigo-900 border border-indigo-200 font-semibold'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-5 border-t border-slate-100 space-y-2">
                <Link
                  to="/"
                  target="_blank"
                  className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl bg-slate-100 text-xs font-medium text-slate-700 hover:bg-slate-200 transition"
                >
                  <Globe className="w-4 h-4 text-amber-600" />
                  <span>View Public Atelier</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
          </div>
        )}

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
