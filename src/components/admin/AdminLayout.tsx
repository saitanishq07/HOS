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
  ChevronRight
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [newEnquiryCount, setNewEnquiryCount] = useState(0);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const enquiries = await dbService.getEnquiries();
        const pending = enquiries.filter(e => e.status === 'New').length;
        setNewEnquiryCount(pending);
      } catch (error) {
        console.error('Error fetching pending enquiries:', error);
      }
    };
    fetchEnquiries();
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
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
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-gradient-to-b from-[#022A6B] via-[#0442A5] to-[#011B45] border-r border-[#0442A5]/40 text-white shrink-0 shadow-2xl">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/10 p-1 border border-[#D4AF37]/50 flex items-center justify-center shadow-inner">
              <img src={getImageUrl('/logo.png')} alt="House of Seetah" className="max-h-full max-w-full object-contain filter brightness-110" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold tracking-wide text-white">HOUSE OF SEETAH</h1>
              <p className="text-[10px] text-[#CDEBFF] tracking-widest uppercase font-semibold">Admin & Billing Console</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? 'bg-white text-[#0442A5] shadow-lg shadow-black/20 font-semibold translate-x-1'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#0442A5]' : 'text-[#CDEBFF]/80'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                    isActive ? 'bg-[#C85A32] text-white' : 'bg-[#C85A32] text-white shadow-sm animate-pulse'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Public Site Link & User Profile */}
        <div className="p-4 border-t border-white/10 space-y-3 bg-black/20">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/15 text-xs text-[#CDEBFF] border border-white/10 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-[#D4AF37]" />
              <span>View Live Website</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-3 truncate">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-bold text-xs">
                {user?.email ? user.email[0].toUpperCase() : 'A'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{user?.displayName || 'Administrator'}</p>
                <p className="text-[10px] text-white/60 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 text-white/60 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0F1117] text-neutral-100">
        {/* Top Header */}
        <header className="h-16 bg-[#161922] border-b border-neutral-800 px-6 flex items-center justify-between sticky top-0 z-30 shadow-md">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-400 hover:text-white rounded-lg focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="hidden sm:flex items-center space-x-2 text-xs text-neutral-400">
              <span className="px-2.5 py-1 rounded-md bg-[#0442A5]/30 text-[#CDEBFF] border border-[#0442A5]/50 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> House of Seetah Commercial Core v2.4
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {newEnquiryCount > 0 && (
              <Link
                to="/admin/enquiries"
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#C85A32]/20 border border-[#C85A32]/50 text-[#C85A32] text-xs font-medium hover:bg-[#C85A32]/30 transition-colors"
              >
                <Bell className="w-4 h-4 animate-bounce" />
                <span>{newEnquiryCount} New Customer {newEnquiryCount === 1 ? 'Enquiry' : 'Enquiries'}</span>
              </Link>
            )}

            <div className="h-4 w-px bg-neutral-800 hidden sm:block" />

            <Link
              to="/admin/invoices/new"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#0442A5] to-[#022A6B] hover:from-[#0553d1] hover:to-[#0442A5] text-white text-xs font-semibold shadow-md flex items-center space-x-2 transition-all transform hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">New Invoice</span>
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex">
            <div className="w-4/5 max-w-sm bg-[#0442A5] p-6 text-white flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
                  <div className="flex items-center space-x-3">
                    <img src={getImageUrl('/logo.png')} alt="Logo" className="w-8 h-8 object-contain" />
                    <span className="font-serif font-bold text-lg">House of Seetah</span>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white/80 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium ${
                          isActive ? 'bg-white text-[#0442A5]' : 'text-white/80 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#C85A32] text-white">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-6 border-t border-white/10 space-y-3">
                <Link
                  to="/"
                  target="_blank"
                  className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-lg bg-white/10 text-sm font-medium text-white"
                >
                  <Globe className="w-4 h-4" />
                  <span>View Public Site</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-lg bg-red-600/30 border border-red-500/40 text-sm font-medium text-red-200"
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
