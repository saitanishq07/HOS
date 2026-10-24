import React, { useState, useEffect } from 'react';
import { dbService } from '../../services/db';
import { WorkOrder, RawMaterial, Artisan, LogisticsShipment, CraftsmanshipStage, OrderStep } from '../../types';
import {
  Hammer,
  Gem,
  Truck,
  Users,
  BarChart3,
  PlusCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Package,
  Layers,
  ChevronRight,
  TrendingUp,
  Search,
  Filter,
  DollarSign,
  ArrowUpRight,
  Calendar,
  Lock,
  Compass
} from 'lucide-react';

const STAGES: CraftsmanshipStage[] = [
  'Brief & Design',
  'Base & Woodwork',
  'Relief & Muckwork',
  '24K Gold Guilding',
  'Mineral Pigment Art',
  'Inspection & Framing',
  'Ready for Dispatch',
  'Completed'
];

export const ERPManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'workshop' | 'vault' | 'logistics' | 'artisans' | 'analytics'>('workshop');
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [shipments, setShipments] = useState<LogisticsShipment[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('All');
  const [materialCategoryFilter, setMaterialCategoryFilter] = useState<string>('All');

  // Modals
  const [isWorkOrderModalOpen, setIsWorkOrderModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [isStockAdjustModalOpen, setIsStockAdjustModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<RawMaterial | null>(null);
  const [stockDelta, setStockDelta] = useState<number>(0);
  const [isShipmentModalOpen, setIsShipmentModalOpen] = useState(false);
  const [isArtisanModalOpen, setIsArtisanModalOpen] = useState(false);

  // Form states
  const [newWorkOrder, setNewWorkOrder] = useState<Partial<WorkOrder>>({
    orderNumber: `HOS-WIP-${Math.floor(100 + Math.random() * 900)}`,
    artworkTitle: '',
    artform: 'Pichwai & Traditional Art',
    clientName: '',
    artisanId: '',
    artisanName: '',
    stage: 'Brief & Design',
    progressPercent: 10,
    startDate: new Date().toISOString().split('T')[0],
    targetCompletionDate: '',
    goldLeavesAllocated: 40,
    materialsCost: 15000,
    artisanFee: 25000,
    estimatedRetailValue: 95000,
    priority: 'Standard',
    dimensions: '30 x 40 Inches',
    notes: '',
    status: 'Active'
  });

  const [newMaterial, setNewMaterial] = useState<Partial<RawMaterial>>({
    sku: `MAT-${Math.floor(100 + Math.random() * 900)}`,
    name: '',
    category: 'Precious Metals',
    currentStock: 10,
    unit: 'Booklets (25 leaves)',
    reorderLevel: 5,
    unitCost: 1000,
    totalValue: 10000,
    supplier: '',
    vaultLocation: 'Jubilee Hills Safe Deposit Vault',
    lastRestocked: new Date().toISOString().split('T')[0]
  });

  const [newShipment, setNewShipment] = useState<Partial<LogisticsShipment>>({
    shipmentNumber: `HOS-LOG-${Math.floor(1000 + Math.random() * 9000)}`,
    invoiceNumber: 'HOS-2026-001',
    clientName: '',
    clientPhone: '',
    destinationCity: '',
    destinationAddress: '',
    courierPartner: 'Sequel Logistics',
    trackingAwb: `SQL-HOS-${Math.floor(100000 + Math.random() * 900000)}`,
    declaredValue: 100000,
    insurancePolicyNumber: `AIG-ART-${Math.floor(1000000 + Math.random() * 9000000)}`,
    insuranceProvider: 'Tata AIG Fine Art Insurance',
    crateType: 'Reinforced Weatherproof Teak Crate',
    currentStatus: 'Insured Packaging',
    dispatchDate: new Date().toISOString().split('T')[0],
    estimatedDelivery: '',
    notes: 'High-value museum-grade art consignment'
  });

  const [newArtisan, setNewArtisan] = useState<Partial<Artisan>>({
    name: '',
    guild: 'Nathdwara & Mewar Pichwai Guild',
    specialty: '',
    experienceYears: 15,
    phone: '',
    city: 'Hyderabad',
    activeWorkOrdersCount: 0,
    rating: 4.9,
    monthlyCapacity: 3,
    status: 'Active'
  });

  useEffect(() => {
    loadAllERPData();
  }, []);

  const loadAllERPData = async () => {
    setLoading(true);
    try {
      const [wo, rm, art, shp] = await Promise.all([
        dbService.getWorkOrders(),
        dbService.getRawMaterials(),
        dbService.getArtisans(),
        dbService.getShipments()
      ]);
      setWorkOrders(wo);
      setRawMaterials(rm);
      setArtisans(art);
      setShipments(shp);
    } catch (err) {
      console.error('Failed to load ERP data:', err);
    } finally {
      setLoading(false);
    }
  };

  // KPI Calculations
  const activeWIPCount = workOrders.filter(w => w.status === 'Active').length;
  const totalWIPRetailVal = workOrders
    .filter(w => w.status === 'Active')
    .reduce((sum, w) => sum + (w.estimatedRetailValue || 0), 0);
  const totalVaultMaterialVal = rawMaterials.reduce((sum, m) => sum + (m.totalValue || 0), 0);
  const totalGoldStock = rawMaterials
    .filter(m => m.category === 'Precious Metals')
    .reduce((sum, m) => sum + m.currentStock, 0);
  const activeShipmentsCount = shipments.filter(s => s.currentStatus !== 'Delivered').length;
  const lowStockAlertsCount = rawMaterials.filter(m => m.currentStock <= m.reorderLevel).length;

  // Actions: Advance WIP Stage
  const handleAdvanceStage = async (order: WorkOrder) => {
    const currentIndex = STAGES.indexOf(order.stage);
    if (currentIndex < STAGES.length - 1) {
      const nextStage = STAGES[currentIndex + 1];
      const newProgress = Math.min(100, Math.round(((currentIndex + 2) / STAGES.length) * 100));
      const updated = await dbService.updateWorkOrderStage(order.id, nextStage, newProgress);
      setWorkOrders(updated);
    }
  };

  // Actions: Add Work Order
  const handleCreateWorkOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkOrder.artworkTitle || !newWorkOrder.clientName) return;

    const assignedArtisan = artisans.find(a => a.id === newWorkOrder.artisanId);
    const orderToSave: WorkOrder = {
      id: `wo-${Date.now()}`,
      orderNumber: newWorkOrder.orderNumber || `HOS-WIP-${Date.now().toString().slice(-4)}`,
      invoiceNumber: newWorkOrder.invoiceNumber || '',
      clientName: newWorkOrder.clientName,
      artworkTitle: newWorkOrder.artworkTitle,
      artform: newWorkOrder.artform || 'Pichwai & Traditional Art',
      artisanId: newWorkOrder.artisanId || (artisans[0]?.id ?? 'art-1'),
      artisanName: assignedArtisan ? assignedArtisan.name : newWorkOrder.artisanName || 'Guild Artisan',
      stage: newWorkOrder.stage || 'Brief & Design',
      progressPercent: newWorkOrder.progressPercent || 15,
      startDate: newWorkOrder.startDate || new Date().toISOString().split('T')[0],
      targetCompletionDate: newWorkOrder.targetCompletionDate || '',
      goldLeavesAllocated: Number(newWorkOrder.goldLeavesAllocated) || 40,
      materialsCost: Number(newWorkOrder.materialsCost) || 15000,
      artisanFee: Number(newWorkOrder.artisanFee) || 25000,
      estimatedRetailValue: Number(newWorkOrder.estimatedRetailValue) || 95000,
      priority: (newWorkOrder.priority as any) || 'Standard',
      dimensions: newWorkOrder.dimensions || '30 x 40 Inches',
      notes: newWorkOrder.notes || '',
      status: 'Active'
    };

    const updated = await dbService.saveWorkOrder(orderToSave);
    setWorkOrders(updated);
    setIsWorkOrderModalOpen(false);
  };

  // Actions: Stock Adjust
  const handleSaveStockAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterial || stockDelta === 0) return;
    const updated = await dbService.adjustMaterialStock(selectedMaterial.id, stockDelta);
    setRawMaterials(updated);
    setIsStockAdjustModalOpen(false);
    setSelectedMaterial(null);
    setStockDelta(0);
  };

  // Actions: Add Raw Material
  const handleCreateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterial.name) return;
    const stock = Number(newMaterial.currentStock) || 0;
    const cost = Number(newMaterial.unitCost) || 0;
    const matToSave: RawMaterial = {
      id: `mat-${Date.now()}`,
      sku: newMaterial.sku || `MAT-${Date.now().toString().slice(-4)}`,
      name: newMaterial.name,
      category: (newMaterial.category as any) || 'Precious Metals',
      currentStock: stock,
      unit: newMaterial.unit || 'Units',
      reorderLevel: Number(newMaterial.reorderLevel) || 5,
      unitCost: cost,
      totalValue: stock * cost,
      supplier: newMaterial.supplier || 'Heritage Supply Partner',
      vaultLocation: newMaterial.vaultLocation || 'Jubilee Hills Vault',
      lastRestocked: new Date().toISOString().split('T')[0]
    };
    const updated = await dbService.saveRawMaterial(matToSave);
    setRawMaterials(updated);
    setIsMaterialModalOpen(false);
  };

  // Actions: Advance Shipment Milestone
  const handleAdvanceShipment = async (shipment: LogisticsShipment) => {
    const steps: OrderStep[] = ['Confirmed', 'Artisan Inspection', 'Insured Packaging', 'Dispatched', 'Delivered'];
    const curIdx = steps.indexOf(shipment.currentStatus);
    if (curIdx < steps.length - 1) {
      const nextStep = steps[curIdx + 1];
      const updated = await dbService.updateShipmentStatus(shipment.id, nextStep);
      setShipments(updated);
    }
  };

  // Actions: Create Shipment
  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShipment.clientName || !newShipment.destinationCity) return;
    const shipToSave: LogisticsShipment = {
      id: `ship-${Date.now()}`,
      shipmentNumber: newShipment.shipmentNumber || `HOS-LOG-${Date.now().toString().slice(-4)}`,
      invoiceNumber: newShipment.invoiceNumber || 'HOS-2026-001',
      clientName: newShipment.clientName,
      clientPhone: newShipment.clientPhone || '+91 98765 43210',
      destinationCity: newShipment.destinationCity,
      destinationAddress: newShipment.destinationAddress || 'Private Residence',
      courierPartner: (newShipment.courierPartner as any) || 'Sequel Logistics',
      trackingAwb: newShipment.trackingAwb || `AWB-${Date.now().toString().slice(-6)}`,
      declaredValue: Number(newShipment.declaredValue) || 100000,
      insurancePolicyNumber: newShipment.insurancePolicyNumber || 'AIG-ART-POLICY',
      insuranceProvider: newShipment.insuranceProvider || 'Tata AIG Fine Art Insurance',
      crateType: (newShipment.crateType as any) || 'Reinforced Weatherproof Teak Crate',
      currentStatus: 'Insured Packaging',
      dispatchDate: newShipment.dispatchDate || new Date().toISOString().split('T')[0],
      estimatedDelivery: newShipment.estimatedDelivery || '',
      notes: newShipment.notes || ''
    };
    const updated = await dbService.saveShipment(shipToSave);
    setShipments(updated);
    setIsShipmentModalOpen(false);
  };

  // Actions: Create Artisan
  const handleCreateArtisan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArtisan.name) return;
    const artToSave: Artisan = {
      id: `art-${Date.now()}`,
      name: newArtisan.name,
      guild: newArtisan.guild || 'Traditional Art Guild',
      specialty: newArtisan.specialty || 'Master Detailing',
      experienceYears: Number(newArtisan.experienceYears) || 10,
      phone: newArtisan.phone || '',
      city: newArtisan.city || 'Hyderabad',
      activeWorkOrdersCount: 0,
      rating: Number(newArtisan.rating) || 4.9,
      monthlyCapacity: Number(newArtisan.monthlyCapacity) || 3,
      status: 'Active'
    };
    const updated = await dbService.saveArtisan(artToSave);
    setArtisans(updated);
    setIsArtisanModalOpen(false);
  };

  // Filtered lists
  const filteredWorkOrders = workOrders.filter(w => {
    const matchesSearch =
      w.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.artworkTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.artisanName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'All' || w.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const filteredMaterials = rawMaterials.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.vaultLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = materialCategoryFilter === 'All' || m.category === materialCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 font-sans">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/70 text-amber-900 text-xs font-semibold uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Atelier Enterprise Resource Planning</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-wide">
            Atelier Operations & Production ERP
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            End-to-end studio craftsmanship, precious vault inventory, artisan guild commissions & insured white-glove logistics.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsWorkOrderModalOpen(true)}
            className="px-4 py-2.5 bg-[#0442A5] hover:bg-[#033585] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition shadow-xs flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span>New Work Order</span>
          </button>
          <button
            onClick={() => setIsMaterialModalOpen(true)}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold uppercase tracking-wider transition border border-slate-200 shadow-xs flex items-center gap-2"
          >
            <Gem className="w-4 h-4 text-emerald-600" />
            <span>Add Vault Item</span>
          </button>
          <button
            onClick={() => setIsShipmentModalOpen(true)}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold uppercase tracking-wider transition border border-slate-200 shadow-xs flex items-center gap-2"
          >
            <Truck className="w-4 h-4 text-sky-600" />
            <span>Dispatch Consignment</span>
          </button>
        </div>
      </div>

      {/* 2. Top Executive Metrics Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Active WIP Orders</span>
            <div className="p-2 bg-amber-50 text-amber-800 rounded-lg border border-amber-200/70">
              <Hammer className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-slate-900">{activeWIPCount} Pieces</div>
          <div className="text-[11px] text-amber-800 mt-1 font-semibold">₹{totalWIPRetailVal.toLocaleString('en-IN')} Est. Valuation</div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Precious Vault Stock</span>
            <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200/70">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-slate-900">₹{totalVaultMaterialVal.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-emerald-700 mt-1 font-medium">Secured in Jubilee Hills</div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">24K Gold Leaf Reserve</span>
            <div className="p-2 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200/70">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-slate-900">{totalGoldStock} Booklets</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">{(totalGoldStock * 25).toLocaleString('en-IN')} Certified Leaves</div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">In-Transit High Value</span>
            <div className="p-2 bg-sky-50 text-sky-800 rounded-lg border border-sky-200/70">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-slate-900">{activeShipmentsCount} Consignments</div>
          <div className="text-[11px] text-sky-700 mt-1 font-medium">100% Insured Transit</div>
        </div>

        {/* KPI 5 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Artisan Guild Network</span>
            <div className="p-2 bg-purple-50 text-purple-800 rounded-lg border border-purple-200/70">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-slate-900">{artisans.length} Masters</div>
          <div className="text-[11px] text-purple-700 mt-1 font-medium">Average 4.9★ Provenance</div>
        </div>

      </div>

      {/* 3. ERP Tab Navigation */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto custom-scrollbar pb-1">
        <button
          onClick={() => setActiveTab('workshop')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-t-xl text-xs font-semibold uppercase tracking-widest transition-all ${
            activeTab === 'workshop'
              ? 'bg-white text-indigo-950 border-b-2 border-indigo-600 shadow-xs font-bold'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <Hammer className={`w-4 h-4 ${activeTab === 'workshop' ? 'text-indigo-600' : 'text-slate-400'}`} />
          <span>Craftsmanship WIP ({workOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('vault')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-t-xl text-xs font-semibold uppercase tracking-widest transition-all ${
            activeTab === 'vault'
              ? 'bg-white text-indigo-950 border-b-2 border-indigo-600 shadow-xs font-bold'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <Gem className={`w-4 h-4 ${activeTab === 'vault' ? 'text-indigo-600' : 'text-slate-400'}`} />
          <span>Precious Vault Stock ({rawMaterials.length})</span>
          {lowStockAlertsCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-bold">
              {lowStockAlertsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('logistics')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-t-xl text-xs font-semibold uppercase tracking-widest transition-all ${
            activeTab === 'logistics'
              ? 'bg-white text-indigo-950 border-b-2 border-indigo-600 shadow-xs font-bold'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <Truck className={`w-4 h-4 ${activeTab === 'logistics' ? 'text-indigo-600' : 'text-slate-400'}`} />
          <span>White-Glove Logistics ({shipments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('artisans')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-t-xl text-xs font-semibold uppercase tracking-widest transition-all ${
            activeTab === 'artisans'
              ? 'bg-white text-indigo-950 border-b-2 border-indigo-600 shadow-xs font-bold'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <Users className={`w-4 h-4 ${activeTab === 'artisans' ? 'text-indigo-600' : 'text-slate-400'}`} />
          <span>Artisan Guild ({artisans.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-t-xl text-xs font-semibold uppercase tracking-widest transition-all ${
            activeTab === 'analytics'
              ? 'bg-white text-indigo-950 border-b-2 border-indigo-600 shadow-xs font-bold'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <BarChart3 className={`w-4 h-4 ${activeTab === 'analytics' ? 'text-indigo-600' : 'text-slate-400'}`} />
          <span>Studio Analytics</span>
        </button>
      </div>

      {/* 4. Tab Contents */}

      {/* TAB 1: WORKSHOP ORDERS / PRODUCTION WIP */}
      {activeTab === 'workshop' && (
        <div className="space-y-6">
          
          {/* Filter Bar */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by order #, artwork, client, or artisan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-xs text-slate-500 shrink-0 font-medium">Stage Filter:</span>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 px-3 py-2 focus:bg-white focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="All">All Craftsmanship Stages</option>
                {STAGES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Work Orders List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredWorkOrders.map((wo) => {
              const stageIdx = STAGES.indexOf(wo.stage);
              const isLastStage = stageIdx === STAGES.length - 1;

              return (
                <div
                  key={wo.id}
                  className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-6 transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-4"
                >
                  {/* Top line: Order # + Title + Priority */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-xs font-bold text-indigo-900 px-2.5 py-1 bg-indigo-50 rounded-lg border border-indigo-200/70">
                          {wo.orderNumber}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          Patron: <strong className="text-slate-900 font-semibold">{wo.clientName}</strong>
                        </span>
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                          wo.priority === 'VVIP Commission'
                            ? 'bg-amber-50 text-amber-900 border-amber-200'
                            : wo.priority === 'Urgent'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-sky-50 text-sky-800 border-sky-200'
                        }`}>
                          {wo.priority}
                        </span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-slate-900 mt-1.5">{wo.artworkTitle}</h3>
                      <p className="text-xs text-slate-500">
                        {wo.artform} • Dimensions: <strong className="text-slate-800">{wo.dimensions}</strong>
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-slate-400">Estimated Valuation</span>
                      <div className="text-xl font-serif font-bold text-amber-900">
                        ₹{wo.estimatedRetailValue.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[11px] text-slate-500">
                        Target: <strong className="text-slate-800">{wo.targetCompletionDate || 'On Schedule'}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Mid line: Artisan + Material Allocation + Costs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Assigned Master</span>
                      <strong className="text-slate-900 flex items-center gap-1.5 mt-0.5">
                        <Users className="w-3.5 h-3.5 text-indigo-600" />
                        {wo.artisanName}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">24K Gold Allocated</span>
                      <strong className="text-amber-800 flex items-center gap-1.5 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        {wo.goldLeavesAllocated} Leaves
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">Materials Cost</span>
                      <strong className="text-slate-900 mt-0.5 block">₹{wo.materialsCost.toLocaleString('en-IN')}</strong>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">Artisan Honorarium</span>
                      <strong className="text-slate-900 mt-0.5 block">₹{wo.artisanFee.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  {/* Craftsmanship Progress Bar & Current Stage */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Current Atelier Stage:</span>
                        <span className="font-semibold text-indigo-900 px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200/70 text-xs">
                          {wo.stage}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-amber-900">{wo.progressPercent}% Complete</span>
                    </div>

                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 via-indigo-600 to-emerald-500 transition-all duration-500"
                        style={{ width: `${wo.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Bottom Line: Stage advancing button */}
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-[11px] text-slate-500 italic truncate max-w-md">
                      {wo.notes || 'Master craftsman inspecting gold leaf bonding and organic lacquer coats.'}
                    </p>

                    {!isLastStage ? (
                      <button
                        onClick={() => handleAdvanceStage(wo)}
                        className="px-4 py-2 bg-slate-100 hover:bg-[#0442A5] hover:text-white text-slate-700 font-semibold text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-2 border border-slate-200 shadow-xs"
                      >
                        <span>Advance to Next Stage</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Ready for Client Delivery</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: PRECIOUS MATERIALS & INVENTORY VAULT */}
      {activeTab === 'vault' && (
        <div className="space-y-6">
          
          {/* Controls Bar */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search materials, SKU, or vault safe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-xs text-slate-500 shrink-0 font-medium">Category:</span>
              <select
                value={materialCategoryFilter}
                onChange={(e) => setMaterialCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 px-3 py-2 focus:bg-white focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="All">All Precious Vault Categories</option>
                <option value="Precious Metals">Precious Metals (24K Gold)</option>
                <option value="Gemstones">Gemstones & Jewels</option>
                <option value="Pigments">Mineral & Stone Pigments</option>
                <option value="Timber & Framing">Burma Teak & Rosewood</option>
                <option value="Textiles">Mulberry Silk & Linen</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-600 uppercase tracking-widest border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="p-4">SKU & Item Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Stock on Hand</th>
                    <th className="p-4">Unit Cost</th>
                    <th className="p-4">Vault Asset Value</th>
                    <th className="p-4">Secure Storage Location</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMaterials.map((mat) => {
                    const isLowStock = mat.currentStock <= mat.reorderLevel;

                    return (
                      <tr key={mat.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4">
                          <span className="font-mono text-indigo-900 font-semibold text-[11px] block">{mat.sku}</span>
                          <span className="font-bold text-slate-900 text-sm">{mat.name}</span>
                          <span className="text-slate-500 block text-[11px]">Supplier: {mat.supplier}</span>
                        </td>

                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200/60 text-[11px]">
                            {mat.category}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base text-slate-900">{mat.currentStock}</span>
                            <span className="text-slate-500 text-[11px]">{mat.unit}</span>
                          </div>
                          {isLowStock ? (
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-flex items-center gap-1 mt-0.5">
                              <AlertTriangle className="w-3 h-3" />
                              Reorder Threshold ({mat.reorderLevel})
                            </span>
                          ) : (
                            <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-flex items-center gap-1 mt-0.5">
                              Stock Optimal
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-slate-700">₹{mat.unitCost.toLocaleString('en-IN')}</td>

                        <td className="p-4 font-serif font-bold text-sm text-slate-900">
                          ₹{mat.totalValue.toLocaleString('en-IN')}
                        </td>

                        <td className="p-4 text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-amber-600" />
                            <span>{mat.vaultLocation}</span>
                          </div>
                        </td>

                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedMaterial(mat);
                              setStockDelta(0);
                              setIsStockAdjustModalOpen(true);
                            }}
                            className="px-3 py-1.5 bg-[#0442A5] hover:bg-[#033585] text-white rounded-xl font-semibold text-[11px] uppercase tracking-wider transition shadow-xs"
                          >
                            Adjust Stock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: WHITE-GLOVE LOGISTICS & TRANSIT */}
      {activeTab === 'logistics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shipments.map((shp) => (
              <div
                key={shp.id}
                className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-6 transition shadow-xs space-y-4"
              >
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div>
                    <span className="font-mono text-xs font-bold text-indigo-900 px-2.5 py-1 bg-indigo-50 rounded-lg border border-indigo-200/70">
                      {shp.shipmentNumber}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-slate-900 mt-2">{shp.clientName}</h3>
                    <p className="text-xs text-slate-500">
                      Invoice Ref: <strong className="text-slate-800">{shp.invoiceNumber}</strong> • Phone: {shp.clientPhone}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 text-xs font-bold uppercase rounded-full border ${
                      shp.currentStatus === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-sky-50 text-sky-800 border-sky-200'
                    }`}>
                      {shp.currentStatus}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">Valuation: ₹{shp.declaredValue.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Courier Partner</span>
                    <strong className="text-slate-900 flex items-center gap-1.5 mt-0.5">
                      <Truck className="w-3.5 h-3.5 text-sky-600" />
                      {shp.courierPartner}
                    </strong>
                    <span className="text-[10px] text-slate-500 font-mono">AWB: {shp.trackingAwb}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Insurance Policy</span>
                    <strong className="text-emerald-700 flex items-center gap-1.5 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {shp.insuranceProvider}
                    </strong>
                    <span className="text-[10px] text-slate-500 font-mono">{shp.insurancePolicyNumber}</span>
                  </div>

                  <div className="col-span-2 pt-2 border-t border-slate-200/60">
                    <span className="text-slate-500 block text-[11px]">Crate & Packaging</span>
                    <strong className="text-slate-800">{shp.crateType}</strong>
                    <p className="text-slate-500 text-[11px] mt-0.5">Dest: {shp.destinationAddress}, {shp.destinationCity}</p>
                  </div>
                </div>

                {/* Milestone button */}
                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs text-slate-500">
                    Est. Handover: <strong className="text-slate-800">{shp.estimatedDelivery || 'In Transit'}</strong>
                  </span>

                  {shp.currentStatus !== 'Delivered' ? (
                    <button
                      onClick={() => handleAdvanceShipment(shp)}
                      className="px-4 py-2 bg-[#0442A5] hover:bg-[#033585] text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition shadow-xs flex items-center gap-1.5"
                    >
                      <span>Update Next Milestone</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      OTP Handover Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ARTISAN GUILD DIRECTORY */}
      {activeTab === 'artisans' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div>
              <h2 className="font-serif text-xl font-bold text-slate-900">Master Craftsmen & Guild Masters</h2>
              <p className="text-xs text-slate-500">Hereditary Indian artisans preserving sacred temple art, gold guilding, and court miniatures.</p>
            </div>
            <button
              onClick={() => setIsArtisanModalOpen(true)}
              className="px-4 py-2 bg-[#0442A5] hover:bg-[#033585] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition shadow-xs flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>Enroll Artisan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {artisans.map((art) => (
              <div
                key={art.id}
                className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-6 transition shadow-xs space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-900 font-serif text-lg font-bold">
                      {art.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-slate-900">{art.name}</h3>
                      <p className="text-xs text-amber-800 font-semibold">{art.guild}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
                    {art.rating} ★
                  </span>
                </div>

                <div className="space-y-2 text-xs bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Core Specialty:</span>
                    <strong className="text-slate-900 text-right">{art.specialty}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mastery Experience:</span>
                    <strong className="text-slate-900">{art.experienceYears} Years</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Active Studio Commissions:</span>
                    <strong className="text-amber-800 font-semibold">{art.activeWorkOrdersCount} Pieces</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Workshop Location:</span>
                    <strong className="text-slate-900">{art.city}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                  <span>Phone: <strong className="text-slate-800">{art.phone}</strong></span>
                  <span>Monthly Capacity: <strong className="text-slate-800">{art.monthlyCapacity} Pieces</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: STUDIO OPERATIONS & PROFITABILITY ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Box 1 */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-xs">
              <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <span>Atelier Margin Analysis</span>
              </h3>
              <p className="text-xs text-slate-500">Estimated revenue vs direct material & artisan costs on active commissions.</p>
              
              <div className="space-y-3 pt-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Active Retail Value:</span>
                  <strong className="text-slate-900 font-serif text-sm">₹{totalWIPRetailVal.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Materials Allocation:</span>
                  <strong className="text-rose-700 font-semibold">
                    ₹{workOrders.reduce((sum, w) => sum + w.materialsCost, 0).toLocaleString('en-IN')}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Artisan Honorarium:</span>
                  <strong className="text-amber-800 font-semibold">
                    ₹{workOrders.reduce((sum, w) => sum + w.artisanFee, 0).toLocaleString('en-IN')}
                  </strong>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2">
                  <span className="text-emerald-700 font-bold">Estimated Studio Gross Margin:</span>
                  <strong className="text-emerald-700 font-serif text-base font-bold">~68.4%</strong>
                </div>
              </div>
            </div>

            {/* Box 2 */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-xs">
              <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Gold Foil Utilization</span>
              </h3>
              <p className="text-xs text-slate-500">24K gold foil burn-rate across current Tanjore and Pichwai master commissions.</p>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Gold Allocated:</span>
                  <strong className="text-amber-800 font-semibold">
                    {workOrders.reduce((sum, w) => sum + w.goldLeavesAllocated, 0)} Leaves
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Vault Reserve Remaining:</span>
                  <strong className="text-slate-900">{totalGoldStock * 25} Leaves</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Runway at Current Pace:</span>
                  <strong className="text-emerald-700 font-semibold">~4.5 Months</strong>
                </div>
              </div>
            </div>

            {/* Box 3 */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-xs">
              <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Transit Security Coverage</span>
              </h3>
              <p className="text-xs text-slate-500">High-value museum art floater policy coverage and claim history.</p>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Active Floater Policy Limit:</span>
                  <strong className="text-slate-900">₹5.00 Crores</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Currently Utilized Exposure:</span>
                  <strong className="text-amber-800 font-semibold">₹23.75 Lakhs</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Claims in 2026:</span>
                  <strong className="text-emerald-700 font-semibold">0 (Zero Incidents)</strong>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 1: ADD WORK ORDER */}
      {isWorkOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl max-w-2xl w-full p-6 text-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-2xl font-bold text-slate-900 mb-1">Create Atelier Work Order (WIP)</h3>
            <p className="text-xs text-slate-500 mb-6">Assign a master artisan, allocate precious materials, and initialize studio tracking.</p>

            <form onSubmit={handleCreateWorkOrder} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Work Order #</label>
                  <input
                    type="text"
                    required
                    value={newWorkOrder.orderNumber}
                    onChange={(e) => setNewWorkOrder({ ...newWorkOrder, orderNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Priority Commission</label>
                  <select
                    value={newWorkOrder.priority}
                    onChange={(e) => setNewWorkOrder({ ...newWorkOrder, priority: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                  >
                    <option value="Standard">Standard Studio Order</option>
                    <option value="Urgent">Urgent Delivery</option>
                    <option value="VVIP Commission">VVIP Bespoke Commission</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Artwork Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Tanjore Lakshmi Ganesha with 24K Gold Foil"
                  value={newWorkOrder.artworkTitle}
                  onChange={(e) => setNewWorkOrder({ ...newWorkOrder, artworkTitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Collector / Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shri Vikramaditya Rao"
                    value={newWorkOrder.clientName}
                    onChange={(e) => setNewWorkOrder({ ...newWorkOrder, clientName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Artform Category</label>
                  <select
                    value={newWorkOrder.artform}
                    onChange={(e) => setNewWorkOrder({ ...newWorkOrder, artform: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                  >
                    <option value="Pichwai & Traditional Art">Pichwai & Traditional Art</option>
                    <option value="Brassware & Relief Frames">Brassware & Relief Frames</option>
                    <option value="Traditional Masks & Sculptures">Traditional Masks & Sculptures</option>
                    <option value="Miniature Paintings & Wall Art">Miniature Paintings & Wall Art</option>
                    <option value="Cultural Home Decor">Cultural Home Decor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Assigned Master Artisan</label>
                  <select
                    value={newWorkOrder.artisanId}
                    onChange={(e) => setNewWorkOrder({ ...newWorkOrder, artisanId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                  >
                    {artisans.map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({a.guild})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Target Completion Date</label>
                  <input
                    type="date"
                    value={newWorkOrder.targetCompletionDate}
                    onChange={(e) => setNewWorkOrder({ ...newWorkOrder, targetCompletionDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">24K Gold Leaves</label>
                  <input
                    type="number"
                    value={newWorkOrder.goldLeavesAllocated}
                    onChange={(e) => setNewWorkOrder({ ...newWorkOrder, goldLeavesAllocated: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Materials Cost (₹)</label>
                  <input
                    type="number"
                    value={newWorkOrder.materialsCost}
                    onChange={(e) => setNewWorkOrder({ ...newWorkOrder, materialsCost: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Estimated Retail (₹)</label>
                  <input
                    type="number"
                    value={newWorkOrder.estimatedRetailValue}
                    onChange={(e) => setNewWorkOrder({ ...newWorkOrder, estimatedRetailValue: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsWorkOrderModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#0442A5] hover:bg-[#033585] text-white font-medium shadow-sm transition-all"
                >
                  Create Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: STOCK ADJUST */}
      {isStockAdjustModalOpen && selectedMaterial && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl max-w-md w-full p-6 text-slate-800 shadow-2xl space-y-4">
            <h3 className="font-serif text-xl font-bold text-slate-900">Adjust Vault Stock</h3>
            <p className="text-xs text-slate-500">
              {selectedMaterial.name} ({selectedMaterial.sku})
            </p>
            <div className="text-xs text-amber-900 bg-amber-50/80 border border-amber-200/70 p-3 rounded-xl flex items-center justify-between">
              <span>Current Vault Balance:</span>
              <strong className="text-amber-950 text-sm font-semibold">{selectedMaterial.currentStock} {selectedMaterial.unit}</strong>
            </div>

            <form onSubmit={handleSaveStockAdjust} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Quantity Delta (Positive to Add Restock, Negative to Log Studio Usage)
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. +10 or -5"
                  value={stockDelta || ''}
                  onChange={(e) => setStockDelta(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsStockAdjustModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#0442A5] hover:bg-[#033585] text-white font-medium shadow-sm transition-all"
                >
                  Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD RAW MATERIAL */}
      {isMaterialModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl max-w-lg w-full p-6 text-slate-800 shadow-2xl space-y-4">
            <h3 className="font-serif text-2xl font-bold text-slate-900">Add Vault Raw Material</h3>
            <p className="text-xs text-slate-500">Register precious gold leaf, gemstones, mineral pigments, or teakwood.</p>

            <form onSubmit={handleCreateMaterial} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={newMaterial.sku}
                    onChange={(e) => setNewMaterial({ ...newMaterial, sku: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Category</label>
                  <select
                    value={newMaterial.category}
                    onChange={(e) => setNewMaterial({ ...newMaterial, category: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                  >
                    <option value="Precious Metals">Precious Metals</option>
                    <option value="Gemstones">Gemstones</option>
                    <option value="Pigments">Pigments</option>
                    <option value="Timber & Framing">Timber & Framing</option>
                    <option value="Textiles">Textiles</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Material Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 24K Gold Leaf Foil (99.9% Purity)"
                  value={newMaterial.name}
                  onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={newMaterial.currentStock}
                    onChange={(e) => setNewMaterial({ ...newMaterial, currentStock: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Unit</label>
                  <input
                    type="text"
                    placeholder="Booklets / Grams"
                    value={newMaterial.unit}
                    onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Unit Cost (₹)</label>
                  <input
                    type="number"
                    value={newMaterial.unitCost}
                    onChange={(e) => setNewMaterial({ ...newMaterial, unitCost: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Vault Storage Location</label>
                  <input
                    type="text"
                    value={newMaterial.vaultLocation}
                    onChange={(e) => setNewMaterial({ ...newMaterial, vaultLocation: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Supplier Trust</label>
                  <input
                    type="text"
                    placeholder="Supplier name"
                    value={newMaterial.supplier}
                    onChange={(e) => setNewMaterial({ ...newMaterial, supplier: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsMaterialModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#0442A5] hover:bg-[#033585] text-white font-medium shadow-sm transition-all"
                >
                  Save Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: DISPATCH SHIPMENT */}
      {isShipmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl max-w-lg w-full p-6 text-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-2xl font-bold text-slate-900">Dispatch Consignment</h3>
            <p className="text-xs text-slate-500">Generate insured logistics consignment and update client order tracking.</p>

            <form onSubmit={handleCreateShipment} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Consignment #</label>
                  <input
                    type="text"
                    required
                    value={newShipment.shipmentNumber}
                    onChange={(e) => setNewShipment({ ...newShipment, shipmentNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Invoice Number</label>
                  <input
                    type="text"
                    required
                    value={newShipment.invoiceNumber}
                    onChange={(e) => setNewShipment({ ...newShipment, invoiceNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Collector Name"
                    value={newShipment.clientName}
                    onChange={(e) => setNewShipment({ ...newShipment, clientName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Client Phone</label>
                  <input
                    type="text"
                    value={newShipment.clientPhone}
                    onChange={(e) => setNewShipment({ ...newShipment, clientPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Destination City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai, Delhi, Bengaluru"
                    value={newShipment.destinationCity}
                    onChange={(e) => setNewShipment({ ...newShipment, destinationCity: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Courier Partner</label>
                  <select
                    value={newShipment.courierPartner}
                    onChange={(e) => setNewShipment({ ...newShipment, courierPartner: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                  >
                    <option value="Sequel Logistics">Sequel Secure Art Transport</option>
                    <option value="BVC Secure Art">BVC High-Value Logistics</option>
                    <option value="Blue Dart Apex">Blue Dart Apex Security</option>
                    <option value="Hand Carry Concierge">Curator Hand-Carry Concierge</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Air Waybill (AWB) / Tracking #</label>
                <input
                  type="text"
                  required
                  value={newShipment.trackingAwb}
                  onChange={(e) => setNewShipment({ ...newShipment, trackingAwb: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Declared Value (₹)</label>
                  <input
                    type="number"
                    value={newShipment.declaredValue}
                    onChange={(e) => setNewShipment({ ...newShipment, declaredValue: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Estimated Delivery Date</label>
                  <input
                    type="date"
                    value={newShipment.estimatedDelivery}
                    onChange={(e) => setNewShipment({ ...newShipment, estimatedDelivery: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsShipmentModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#0442A5] hover:bg-[#033585] text-white font-medium shadow-sm transition-all"
                >
                  Confirm Consignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: ENROLL ARTISAN */}
      {isArtisanModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl max-w-md w-full p-6 text-slate-800 shadow-2xl space-y-4">
            <h3 className="font-serif text-2xl font-bold text-slate-900">Enroll Master Artisan</h3>
            <p className="text-xs text-slate-500">Register heritage master craftsman in House of Seetah Guild Network.</p>

            <form onSubmit={handleCreateArtisan} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Artisan Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Ustaad Govind Dev"
                  value={newArtisan.name}
                  onChange={(e) => setNewArtisan({ ...newArtisan, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Guild Association</label>
                <input
                  type="text"
                  placeholder="e.g. Udaipur Mewar Pichwai Guild"
                  value={newArtisan.guild}
                  onChange={(e) => setNewArtisan({ ...newArtisan, guild: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Artisan Specialty</label>
                <input
                  type="text"
                  placeholder="e.g. 24K Gold Guilding & Natural Stone Pigments"
                  value={newArtisan.specialty}
                  onChange={(e) => setNewArtisan({ ...newArtisan, specialty: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Years of Mastery</label>
                  <input
                    type="number"
                    value={newArtisan.experienceYears}
                    onChange={(e) => setNewArtisan({ ...newArtisan, experienceYears: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+91 94140 12345"
                    value={newArtisan.phone}
                    onChange={(e) => setNewArtisan({ ...newArtisan, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsArtisanModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#0442A5] hover:bg-[#033585] text-white font-medium shadow-sm transition-all"
                >
                  Enroll Artisan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
