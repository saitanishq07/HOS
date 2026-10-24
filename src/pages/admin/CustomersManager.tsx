import React, { useState, useEffect } from 'react';
import { dbService } from '../../services/db';
import { Customer } from '../../types';
import { Users, Plus, Search, Phone, Mail, MapPin, FileText, DollarSign, Edit3, X } from 'lucide-react';

export const CustomersManager: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Partial<Customer> | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await dbService.getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCustomer({
      name: '',
      email: '',
      phone: '',
      gstin: '',
      address: '',
      city: 'Hyderabad',
      state: '36 - Telangana',
      pincode: '500033'
    });
    setIsModalOpen(true);
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer || !editingCustomer.name) return;

    try {
      await dbService.saveCustomer({
        ...editingCustomer,
        id: editingCustomer.id || `cust-${Date.now()}`
      } as Customer);
      setIsModalOpen(false);
      loadCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.phone || c.mobile || '').includes(searchTerm) ||
    (c.gstin && c.gstin.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
            <Users className="w-6 h-6 text-[#0442A5]" />
            <span>Client & Buyer Profiles</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered corporate buyers, art collectors, and GST billing records.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-[#0442A5] hover:bg-[#033585] text-white text-xs font-semibold shadow-xs flex items-center space-x-2 transition-all transform hover:scale-[1.01]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search clients by name, phone number, or GSTIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCustomers.map((cust) => (
          <div key={cust.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{cust.name}</h3>
                  <p className="text-xs text-amber-800 font-mono font-semibold mt-0.5">
                    GSTIN: {cust.gstin || 'URP (Unregistered)'}
                  </p>
                </div>
                <div className="px-2.5 py-1 bg-indigo-50 text-indigo-900 border border-indigo-200/70 rounded-xl font-semibold text-xs">
                  {cust.totalInvoices || 0} Invoices
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-[#0442A5]" />
                  <span>{cust.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-[#0442A5]" />
                  <span>{cust.email || 'No email provided'}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-[#0442A5] shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{cust.address || `${cust.city}, ${cust.state}`}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Lifetime Billed</p>
                <p className="text-sm font-bold text-emerald-700">₹{(cust.totalSpent || 0).toLocaleString('en-IN')}</p>
              </div>

              <button
                onClick={() => {
                  setEditingCustomer(cust);
                  setIsModalOpen(true);
                }}
                className="p-2 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-900 border border-slate-200/60 rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && editingCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveCustomer} className="bg-white border border-slate-200/90 w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-serif text-lg font-bold text-slate-900">
                {editingCustomer.id ? 'Edit Client Profile' : 'Register New Client'}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Full Name / Corporate Title *</label>
                <input
                  type="text"
                  value={editingCustomer.name || ''}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={editingCustomer.phone || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={editingCustomer.email || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">GSTIN Number</label>
                <input
                  type="text"
                  value={editingCustomer.gstin || ''}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, gstin: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="36AAAAA0000A1Z5"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Street Address</label>
                <input
                  type="text"
                  value={editingCustomer.address || ''}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0442A5] hover:bg-[#033585] text-white rounded-xl text-xs font-medium shadow-xs transition-all"
              >
                Save Client
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
