import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Public Layout & Shared Components
import { AnnouncementBar } from './components/public/AnnouncementBar';
import { Navbar } from './components/public/Navbar';
import { Footer } from './components/public/Footer';
import { CartDrawer } from './components/public/CartDrawer';
import { Toast } from './components/public/Toast';

// Public Pages
import { Home } from './pages/public/Home';
import { Collections } from './pages/public/Collections';
import { Products } from './pages/public/Products';
import { ProductDetail } from './pages/public/ProductDetail';
import { Gallery } from './pages/public/Gallery';
import { About } from './pages/public/About';
import { Contact } from './pages/public/Contact';
import { OrderTracking } from './pages/public/OrderTracking';

// Admin Pages
import { Login } from './pages/admin/Login';
import { AdminLayout } from './components/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { EnquiriesManager } from './pages/admin/EnquiriesManager';
import { ProductsManager } from './pages/admin/ProductsManager';
import { InvoicesList } from './pages/admin/InvoicesList';
import { InvoiceBuilder } from './pages/admin/InvoiceBuilder';
import { CustomersManager } from './pages/admin/CustomersManager';
import { PaymentsManager } from './pages/admin/PaymentsManager';
import { ReportsManager } from './pages/admin/ReportsManager';
import { ContentManager } from './pages/admin/ContentManager';
import { SettingsManager } from './pages/admin/SettingsManager';

// Protected Route Wrapper for Admin System
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141212] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

// Public Website Layout Wrapper
const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F2]">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <CartDrawer />
      <Toast />
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Customer Website Routes wrapped in PublicLayout */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="collections" element={<Collections />} />
              <Route path="products" element={<Products />} />
              <Route path="products/:id" element={<ProductDetail />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="track-order" element={<OrderTracking />} />
            </Route>

            {/* Admin Login Route */}
            <Route path="/admin/login" element={<Login />} />

            {/* Private Billing & Admin System Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="enquiries" element={<EnquiriesManager />} />
              <Route path="products" element={<ProductsManager />} />
              <Route path="invoices" element={<InvoicesList />} />
              <Route path="invoices/new" element={<InvoiceBuilder />} />
              <Route path="customers" element={<CustomersManager />} />
              <Route path="payments" element={<PaymentsManager />} />
              <Route path="reports" element={<ReportsManager />} />
              <Route path="content" element={<ContentManager />} />
              <Route path="settings" element={<SettingsManager />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
