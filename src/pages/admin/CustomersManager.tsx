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
          <h1 className="font-serif text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            <Users className="w-6 h-6 text-[#0442A5]" />
            <span>Client & Buyer Profiles</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Registered corporate buyers, art collectors, and GST billing records.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-[#0442A5] hover:bg-[#0553d1] text-white text-xs font-semibold shadow-lg flex items-center space-x-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-[#161922] p-4 rounded-2xl border border-neutral-800">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search clients by name, phone number, or GSTIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0D1117] border border-neutral-700/80 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#0442A5]"
          />
        </div>
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCustomers.map((cust) => (
          <div key={cust.id} className="bg-[#161922] border border-neutral-800 rounded-2xl p-5 shadow-lg space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-white">{cust.name}</h3>
                  <p className="text-xs text-[#D4AF37] font-mono font-semibold mt-0.5">
                    GSTIN: {cust.gstin || 'URP (Unregistered)'}
                  </p>
                </div>
                <div className="p-2.5 bg-[#0442A5]/20 text-[#CDEBFF] rounded-xl font-bold text-xs">
                  {cust.totalInvoices || 0} Invoices
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs text-neutral-300">
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

            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-400 uppercase font-semibold">Total Lifetime Billed</p>
                <p className="text-sm font-bold text-emerald-400">₹{(cust.totalSpent || 0).toLocaleString('en-IN')}</p>
              </div>

              <button
                onClick={() => {
                  setEditingCustomer(cust);
                  setIsModalOpen(true);
                }}
                className="p-2 bg-neutral-800 hover:bg-[#0442A5] text-neutral-300 hover:text-white rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && editingCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveCustomer} className="bg-[#141822] border border-neutral-700 w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h3 className="font-serif text-lg font-bold text-white">
                {editingCustomer.id ? 'Edit Client Profile' : 'Register New Client'}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Full Name / Corporate Title *</label>
                <input
                  type="text"
                  value={editingCustomer.name || ''}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-neutral-700 rounded-xl text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={editingCustomer.phone || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0D1117] border border-neutral-700 rounded-xl text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingCustomer.email || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0D1117] border border-neutral-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">GSTIN Number</label>
                <input
                  type="text"
                  value={editingCustomer.gstin || ''}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, gstin: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-neutral-700 rounded-xl text-white font-mono"
                  placeholder="36AAAAA0000A1Z5"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Street Address</label>
                <input
                  type="text"
                  value={editingCustomer.address || ''}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-neutral-700 rounded-xl text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0442A5] hover:bg-[#0553d1] text-white rounded-xl text-xs font-semibold"
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
