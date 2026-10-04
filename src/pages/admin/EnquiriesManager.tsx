import React, { useState, useEffect } from 'react';
import { dbService } from '../../services/db';
import { Enquiry } from '../../types';
import { MessageSquare, Search, Filter, Phone, Mail, Calendar, CheckCircle2, Clock, MessageCircle, FileText, UserPlus, AlertCircle } from 'lucide-react';

export const EnquiriesManager: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [activeEnquiry, setActiveEnquiry] = useState<Enquiry | null>(null);
  const [internalNote, setInternalNote] = useState('');

  useEffect(() => {
    loadEnquiries();
  }, []);

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const data = await dbService.getEnquiries();
      setEnquiries(data);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: Enquiry['status']) => {
    await dbService.updateEnquiryStatus(id, newStatus);
    if (activeEnquiry && activeEnquiry.id === id) {
      setActiveEnquiry({ ...activeEnquiry, status: newStatus });
    }
    loadEnquiries();
  };

  const handleSaveNotes = async () => {
    if (!activeEnquiry) return;
    const updatedNotes = activeEnquiry.internalNotes
      ? `${activeEnquiry.internalNotes}\n[${new Date().toLocaleDateString('en-IN')}]: ${internalNote}`
      : `[${new Date().toLocaleDateString('en-IN')}]: ${internalNote}`;

    await dbService.updateEnquiryStatus(activeEnquiry.id, activeEnquiry.status, updatedNotes);
    setActiveEnquiry({ ...activeEnquiry, internalNotes: updatedNotes });
    setInternalNote('');
    loadEnquiries();
  };

  const filteredEnquiries = enquiries.filter(enq => {
    const emailStr = (enq.customerEmail || enq.email || '').toLowerCase();
    const phoneStr = (enq.customerPhone || enq.phone || '');
    const matchesSearch =
      enq.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emailStr.includes(searchTerm.toLowerCase()) ||
      phoneStr.includes(searchTerm) ||
      (enq.productTitle && enq.productTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = selectedStatus === 'ALL' || enq.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const statuses: Enquiry['status'][] = [
    'New',
    'Contacted',
    'Follow-up',
    'Quotation Sent',
    'Confirmed',
    'Completed',
    'Closed'
  ];

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
            <MessageSquare className="w-6 h-6 text-[#C85A32]" />
            <span>Enquiry Management CRM</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage inbound customer product enquiries, assign sales stages, and respond via WhatsApp.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold">
          <span className="px-3 py-1.5 rounded-lg bg-[#C85A32]/20 border border-[#C85A32]/40 text-[#C85A32]">
            {enquiries.filter(e => e.status === 'New').length} New Enquiries
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300">
            {enquiries.length} Total Logs
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#161922] p-4 rounded-2xl border border-neutral-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by client name, phone, email, or artwork title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0D1117] border border-neutral-700/80 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#0442A5]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-neutral-400 shrink-0" />
          <button
            onClick={() => setSelectedStatus('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedStatus === 'ALL' ? 'bg-[#0442A5] text-white' : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            All Stages
          </button>
          {statuses.map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedStatus === st ? 'bg-[#0442A5] text-white' : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Layout: Enquiries List & Active Inspection Modal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredEnquiries.map((enq) => (
            <div
              key={enq.id}
              onClick={() => setActiveEnquiry(enq)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeEnquiry?.id === enq.id
                  ? 'bg-[#1D2230] border-[#0442A5] shadow-lg shadow-[#0442A5]/20'
                  : 'bg-[#161922] border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm text-white">{enq.customerName}</h3>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                      enq.status === 'New' ? 'bg-[#C85A32]/20 text-[#C85A32] border border-[#C85A32]/40 animate-pulse' :
                      enq.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      'bg-neutral-800 text-neutral-300'
                    }`}>
                      {enq.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#D4AF37] font-medium mt-1">
                    Item: {enq.productTitle || 'General Catalog Enquiry'}
                  </p>
                  <p className="text-xs text-neutral-300 mt-2 line-clamp-2 bg-[#0D1117] p-2.5 rounded-xl border border-neutral-800/80 italic">
                    "{enq.message}"
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-neutral-400 flex items-center gap-1 justify-end">
                    <Calendar className="w-3 h-3" />
                    {new Date(enq.createdAt || enq.date || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                  {enq.customerPhone && (
                    <a
                      href={`https://wa.me/${enq.customerPhone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(enq.customerName)},%20thank%20you%20for%20contacting%20House%20of%20Seetah.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-3 inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-600/30 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredEnquiries.length === 0 && (
            <div className="bg-[#161922] p-12 rounded-2xl border border-neutral-800 text-center">
              <MessageSquare className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-neutral-300">No enquiries found</p>
              <p className="text-xs text-neutral-500 mt-1">Try resetting your search query or stage filters.</p>
            </div>
          )}
        </div>

        {/* Right Column: Detailed Inspector */}
        <div className="lg:col-span-1">
          {activeEnquiry ? (
            <div className="bg-[#161922] border border-neutral-800 rounded-2xl p-6 sticky top-20 space-y-6">
              <div className="border-b border-neutral-800 pb-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4AF37]">Enquiry Inspector</span>
                <h2 className="text-lg font-bold text-white mt-1">{activeEnquiry.customerName}</h2>
                <p className="text-xs text-neutral-400 mt-0.5">{activeEnquiry.productTitle || 'General Enquiry'}</p>
              </div>

              {/* Contact Details */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0D1117] border border-neutral-800">
                  <span className="text-neutral-400 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#0442A5]" /> Phone</span>
                  <a href={`tel:${activeEnquiry.customerPhone}`} className="text-white font-semibold hover:underline">
                    {activeEnquiry.customerPhone}
                  </a>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0D1117] border border-neutral-800">
                  <span className="text-neutral-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#0442A5]" /> Email</span>
                  <a href={`mailto:${activeEnquiry.customerEmail}`} className="text-white font-semibold hover:underline truncate max-w-[160px]">
                    {activeEnquiry.customerEmail}
                  </a>
                </div>
              </div>

              {/* Status Update Selector */}
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Update CRM Sales Stage
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {statuses.map(st => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(activeEnquiry.id, st)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        activeEnquiry.status === st
                          ? 'bg-[#0442A5] text-white border border-[#0442A5] shadow-md'
                          : 'bg-[#0D1117] text-neutral-400 hover:text-white border border-neutral-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Message */}
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                  Customer Message
                </label>
                <div className="p-3 bg-[#0D1117] rounded-xl border border-neutral-800 text-xs text-neutral-200 leading-relaxed italic">
                  "{activeEnquiry.message}"
                </div>
              </div>

              {/* Internal Notes History & Logger */}
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                  Internal Sales Notes
                </label>
                {activeEnquiry.internalNotes && (
                  <div className="p-3 bg-[#0D1117] rounded-xl border border-neutral-800 text-xs text-neutral-300 font-mono whitespace-pre-wrap max-h-36 overflow-y-auto mb-2">
                    {activeEnquiry.internalNotes}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add internal follow-up note..."
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#0D1117] border border-neutral-700 rounded-xl text-xs text-white"
                  />
                  <button
                    onClick={handleSaveNotes}
                    className="px-3 py-2 bg-[#0442A5] hover:bg-[#0553d1] text-white text-xs font-semibold rounded-xl"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#161922] border border-neutral-800 rounded-2xl p-8 text-center text-neutral-500 text-xs">
              Select an enquiry from the list to inspect details, change sales stages, and log follow-up notes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
