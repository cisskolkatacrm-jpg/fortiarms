/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import TaskManagement from './components/TaskManagement';
import SecurityPersonnelRecruitment from './components/SecurityPersonnelRecruitment';
import { 
  Users, 
  Package, 
  TrendingUp, 
  Settings, 
  CreditCard, 
  Lock, 
  User, 
  ChevronRight,
  Clock,
  Calendar,
  Phone,
  Globe,
  MapPin,
  Mail,
  Sunrise,
  Sunset,
  Sun,
  Moon,
  Power,
  LogOut,
  UserCircle,
  UserCheck,
  LayoutDashboard,
  Activity,
  Target,
  Download,
  Map,
  Plus,
  Menu,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Key,
  Shield,
  Building2,
  Briefcase,
  BookOpen,
  UserPlus,
  ClipboardList,
  AlertCircle,
  Receipt,
  Wallet,
  Banknote,
  DollarSign,
  BarChart3,
  FileText,
  Folder,
  FileSpreadsheet,
  Shirt,
  Calculator,
  Navigation,
  CheckCircle,
  AlertTriangle,
  Bell,
  ChevronLeft,
  Check,
  X,
  GraduationCap,
  CalendarCheck,
  FileUp,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  BarChart,
  Bar,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar
} from 'recharts';
import { APIProvider, Map as GoogleMap, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  setDoc,
  updateDoc,
  deleteDoc, 
  doc, 
  query, 
  where,
  orderBy,
  getDoc
} from 'firebase/firestore';
import { auth, db, signInWithGoogle, onAuthStateChanged } from './firebase';
import TrainingPlanner from './components/TrainingPlanner';
import EmployeeOnboarding from './components/EmployeeOnboarding';
import RecruitmentPlanning from './components/RecruitmentPlanning';
import HRReports from './components/HRReports';
import HRRepository from './components/HRRepository';
import { FSMDashboard, DownloadCenter, RealTimePatrolling, FSMUserManagement, BeatAssignment, IncidentLogs, PatrolReports, PersonnelRegistration, AreaConfiguration } from './components/FSMModules';
import ErrorBoundary from './components/ErrorBoundary';
import { getDocFromServer } from 'firebase/firestore';

const MAPS_API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidMapsKey = Boolean(MAPS_API_KEY) && MAPS_API_KEY !== 'YOUR_API_KEY';

const exportToPDF = (title: string, columns: string[], data: any[][], filename: string) => {
  const doc = new jsPDF();
  doc.text(title, 14, 15);
  autoTable(doc, {
    head: [columns],
    body: data,
    startY: 20,
  });
  doc.save(`${filename}.pdf`);
};

const exportToExcel = (data: any[], filename: string) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

const GlobalOperationsMap = () => {
  const locations = [
    { name: 'Kolkata HQ', position: { lat: 22.5726, lng: 88.3639 } },
    { name: 'London Office', position: { lat: 51.5074, lng: -0.1278 } },
    { name: 'New York Office', position: { lat: 40.7128, lng: -74.0060 } },
    { name: 'Singapore Hub', position: { lat: 1.3521, lng: 103.8198 } },
    { name: 'Dubai Branch', position: { lat: 25.2048, lng: 55.2708 } },
  ];

  if (!hasValidMapsKey) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50 rounded-3xl border border-dashed border-slate-300 p-8 text-center">
        <Globe className="text-slate-300 mb-4" size={48} />
        <h4 className="text-sm font-bold text-slate-800 mb-2">Global Operations Map</h4>
        <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
          Google Maps API Key is required to view global operations. Please add <code>GOOGLE_MAPS_PLATFORM_KEY</code> to your secrets.
        </p>
        <a 
          href="https://console.cloud.google.com/google/maps-apis/credentials" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:underline"
        >
          Get API Key
        </a>
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
      <APIProvider apiKey={MAPS_API_KEY} version="weekly">
        <Map
          defaultCenter={{ lat: 20, lng: 0 }}
          defaultZoom={2}
          mapId="TOP_MGMT_MAP"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          {locations.map((loc, idx) => (
            <AdvancedMarker key={idx} position={loc.position} title={loc.name}>
              <Pin background={'#0EA5E9'} glyphColor={'#fff'} borderColor={'#0369a1'} />
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
    </div>
  );
};

const ServiceBlock = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 flex items-center gap-4 shadow-sm"
  >
    <div className="bg-sky-900/50 p-2.5 rounded-lg text-[#BAC8B1]">
      <Icon size={20} />
    </div>
    <div>
      <h3 className="font-semibold text-white text-sm">{title}</h3>
      <p className="text-[10px] text-sky-200/60 font-medium">{description}</p>
    </div>
  </motion.div>
);

const GreetingIcon = () => {
  const hour = new Date().getHours();
  let Icon = Sun;
  let color = "text-amber-500";
  let bg = "bg-amber-50";

  if (hour >= 5 && hour < 12) {
    Icon = Sunrise;
    color = "text-orange-500";
    bg = "bg-orange-50";
  } else if (hour >= 12 && hour < 17) {
    Icon = Sun;
    color = "text-amber-500";
    bg = "bg-amber-50";
  } else if (hour >= 17 && hour < 20) {
    Icon = Sunset;
    color = "text-rose-500";
    bg = "bg-rose-50";
  } else {
    Icon = Moon;
    color = "text-emerald-600";
    bg = "bg-emerald-500/10";
  }

  return (
    <motion.div 
      animate={{ 
        scale: [1, 1.05, 1],
        y: [0, -4, 0]
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={`w-16 h-16 ${bg} ${color} rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-white`}
    >
      <Icon size={32} />
    </motion.div>
  );
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 20) return "Good Evening";
  return "Good Night";
};

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. ");
    }
    // Skip logging for other errors, as this is simply a connection test.
  }
}
testConnection();

const BranchDashboard = ({ 
  users, 
  userBranch, 
  userName, 
  userRole,
  leads, 
  deals,
  assets,
  invoiceData,
  payments,
  budgets,
  stockData,
  setActiveModule,
  tasks,
  setTasks
}: { 
  users: any[], 
  userBranch?: string, 
  userName?: string,
  userRole?: string,
  leads: any[],
  deals: any[],
  assets: any[],
  invoiceData: any[],
  payments: any[],
  budgets: any[],
  stockData: any[],
  setActiveModule?: (module: string) => void,
  tasks: any[],
  setTasks: React.Dispatch<React.SetStateAction<any[]>>
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tracking' | 'tasks'>('overview');
  const branchUsers = users.filter(u => u.branch === userBranch && u.reportingManager === userName);
  const operationsUsers = branchUsers.filter(u => u.role === 'Operations');
  const branchLeads = leads.filter(l => l.branch === userBranch);
  const branchDeals = deals.filter(d => d.branch === userBranch);
  const branchAssets = assets.filter(a => a.branch === userBranch);
  const branchInvoices = invoiceData.filter(i => i.branch === userBranch);
  const branchPayments = payments.filter(p => p.branch === userBranch);
  const branchBudgets = budgets.filter(b => b.branch === userBranch);
  const branchStock = stockData.filter(s => s.branch === userBranch);

  const branchLocations: Record<string, { lat: number, lng: number }> = {
    'Delhi Branch': { lat: 28.6139, lng: 77.2090 },
    'Mumbai Branch': { lat: 19.0760, lng: 72.8777 },
    'Kolkata Branch': { lat: 22.5726, lng: 88.3639 },
    'Bangalore Branch': { lat: 12.9716, lng: 77.5946 },
    'Chennai Branch': { lat: 13.0827, lng: 80.2707 },
    'Hyderabad Branch': { lat: 17.3850, lng: 78.4867 },
    'Head Office': { lat: 28.6139, lng: 77.2090 },
  };

  const defaultCenter = userBranch && branchLocations[userBranch] ? branchLocations[userBranch] : { lat: 20.5937, lng: 78.9629 };

  const parseCurrency = (val: any) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      const cleaned = val.replace(/[₹, ]/g, '');
      return parseInt(cleaned) || 0;
    }
    return 0;
  };

  return (
    <div className="space-y-8">
      {/* Tab Switcher */}
      <div className="flex items-center gap-4 border-b border-slate-200 pb-1">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-sm font-bold transition-all relative ${
            activeTab === 'overview' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Overview
          {activeTab === 'overview' && <motion.div layoutId="branchTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />}
        </button>
        <button 
          onClick={() => setActiveTab('tracking')}
          className={`px-4 py-2 text-sm font-bold transition-all relative flex items-center gap-2 ${
            activeTab === 'tracking' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Navigation size={16} />
          Field Force Tracking
          {activeTab === 'tracking' && <motion.div layoutId="branchTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />}
        </button>
        <button 
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 text-sm font-bold transition-all relative flex items-center gap-2 ${
            activeTab === 'tasks' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
          } ${userRole === 'Branch' ? 'hidden' : ''}`}
        >
          <ClipboardList size={16} />
          Task Assignment
          {activeTab === 'tasks' && <motion.div layoutId="branchTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />}
        </button>
      </div>

      {activeTab === 'overview' ? (
        <>
          {/* Branch KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          icon={Users}
          title="Team Strength"
          value={branchUsers.length.toString()}
          subtext={`${branchUsers.filter(u => u.status === 'Active').length} Active Members`}
          colorClass="text-emerald-600"
          bgClass="bg-emerald-500/5"
        />
        <StatCard 
          icon={Target}
          title="Branch Leads"
          value={branchLeads.length.toString()}
          subtext={`${branchLeads.filter(l => l.status === 'Qualified').length} Qualified`}
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50/50"
        />
        <StatCard 
          icon={Package}
          title="Branch Assets"
          value={branchAssets.length.toString()}
          subtext={`Valuation: ₹ ${branchAssets.reduce((acc, a) => acc + parseCurrency(a.valuation), 0).toLocaleString()}`}
          colorClass="text-amber-600"
          bgClass="bg-amber-50/50"
        />
        <StatCard 
          icon={TrendingUp}
          title="Sales Pipeline"
          value={branchDeals.length.toString()}
          subtext={`Total: ₹ ${branchDeals.reduce((acc, d) => acc + parseCurrency(d.value), 0).toLocaleString()} L`}
          colorClass="text-emerald-600"
          bgClass="bg-emerald-500/5"
        />
      </div>

      {/* Financial & Operational KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          icon={Receipt}
          title="Branch Billing"
          value={`₹ ${(branchInvoices.reduce((acc, i) => acc + parseCurrency(i.amount), 0) / 100000).toFixed(1)} L`}
          subtext={`${branchInvoices.length} Invoices Generated`}
          colorClass="text-rose-600"
          bgClass="bg-rose-50/50"
        />
        <StatCard 
          icon={Banknote}
          title="Payment Collection"
          value={`₹ ${(branchPayments.reduce((acc, p) => acc + parseCurrency(p.amount), 0) / 100000).toFixed(1)} L`}
          subtext="Total Collected"
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50/50"
        />
        <StatCard 
          icon={Calculator}
          title="Budget Status"
          value={`${((branchBudgets.reduce((acc, b) => acc + b.utilized, 0) / branchBudgets.reduce((acc, b) => acc + b.allocated, 0)) * 100 || 0).toFixed(0)}%`}
          subtext="Budget Utilized"
          colorClass="text-amber-600"
          bgClass="bg-amber-50/50"
        />
        <StatCard 
          icon={Shirt}
          title="Uniform Stock"
          value={branchStock.reduce((acc, s) => acc + s.qty, 0).toString()}
          subtext="Items in Stock"
          colorClass="text-emerald-600"
          bgClass="bg-emerald-500/5"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Branch Team Summary */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800">My Team</h3>
              <p className="text-xs text-slate-400 font-medium">Users reporting to you in {userBranch}</p>
            </div>
            <button 
              onClick={() => setActiveModule?.('User Management')}
              className="p-2 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
            >
              <ArrowRight size={20} />
            </button>
          </div>
          <div className="space-y-4">
            {branchUsers.slice(0, 5).map((u, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-xs font-bold text-emerald-600">
                    {u.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{u.name}</p>
                    <p className="text-[10px] text-slate-500">{u.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    u.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {u.status}
                  </span>
                </div>
              </div>
            ))}
            {branchUsers.length === 0 && (
              <p className="text-xs text-slate-400 italic text-center py-4">No team members found for this branch.</p>
            )}
          </div>
        </div>

        {/* Branch Sales Summary */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Sales Overview</h3>
              <p className="text-xs text-slate-400 font-medium">Recent leads and deals in {userBranch}</p>
            </div>
            <button 
              onClick={() => setActiveModule?.('Sales Pipeline')}
              className="p-2 bg-amber-50 rounded-xl text-amber-600 hover:bg-amber-100 transition-colors"
            >
              <ArrowRight size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Total Leads</p>
                <p className="text-2xl font-bold text-emerald-700">{branchLeads.length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Active Deals</p>
                <p className="text-2xl font-bold text-amber-700">{branchDeals.length}</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
              <h4 className="text-[10px] font-bold text-zinc-800 mb-3 uppercase tracking-widest">Recent Activity</h4>
              <div className="space-y-3">
                {branchLeads.slice(0, 3).map((l, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-zinc-600 font-medium">{l.company}</span>
                    <span className="text-zinc-400">{l.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Branch Assets Summary */}
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Branch Assets</h3>
              <p className="text-xs text-slate-400 font-medium">Physical and digital assets in {userBranch}</p>
            </div>
            <button 
              onClick={() => setActiveModule?.('Asset Management')}
              className="p-2 bg-emerald-50 rounded-xl text-emerald-600 hover:bg-emerald-100 transition-colors"
            >
              <ArrowRight size={20} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {branchAssets.slice(0, 3).map((a, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-white rounded-lg border border-slate-100 text-emerald-600">
                      <Package size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{a.category}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1">{a.name}</h4>
                  <p className="text-xs text-slate-500">ID: {a.id}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600">₹ {a.valuation}</span>
                  <span className="text-[10px] font-medium text-slate-400">{a.issuedTo}</span>
                </div>
              </div>
            ))}
            {branchAssets.length === 0 && (
              <p className="text-xs text-slate-400 italic text-center py-4 col-span-3">No assets found for this branch.</p>
            )}
          </div>
        </div>
      </div>
    </>
    ) : (
      <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Field Force Live Tracking</h3>
                <p className="text-sm text-slate-500 font-medium">Real-time location of Operations users in {userBranch}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold border border-emerald-100">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {operationsUsers.filter(u => u.isOnline).length} Online
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-400 rounded-lg text-xs font-bold border border-slate-100">
                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                  {operationsUsers.filter(u => !u.isOnline).length} Offline
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* User List Sidebar */}
              <div className="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto pr-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Operations Team</h4>
                {operationsUsers.map((u, i) => (
                  <div 
                    key={i} 
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      u.isOnline ? 'bg-white border-slate-200 hover:border-emerald-500/40 hover:shadow-md' : 'bg-slate-50 border-slate-100 opacity-75'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        u.isOnline ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {u.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{u.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">{u.vertical}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} className={u.isOnline ? 'text-emerald-600' : 'text-slate-400'} />
                        <span className="text-[10px] font-medium text-slate-500">
                          {u.lat ? `${u.lat.toFixed(2)}, ${u.lng.toFixed(2)}` : 'Location Unavailable'}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        u.isOnline ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {u.isOnline ? 'Live' : 'Offline'}
                      </span>
                    </div>
                  </div>
                ))}
                {operationsUsers.length === 0 && (
                  <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <Users size={32} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-xs text-slate-400 font-medium">No Operations users found reporting to you.</p>
                  </div>
                )}
              </div>

              {/* Map View */}
              <div className="lg:col-span-3 h-[600px] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 relative group">
                {hasValidMapsKey ? (
                  <APIProvider apiKey={MAPS_API_KEY}>
                    <Map
                      defaultCenter={defaultCenter}
                      defaultZoom={13}
                      mapId="branch_tracking_map"
                      disableDefaultUI={true}
                    >
                      {operationsUsers.filter(u => u.lat && u.lng).map((u, i) => (
                        <AdvancedMarker
                          key={i}
                          position={{ lat: u.lat, lng: u.lng }}
                          title={u.name}
                        >
                          <div className="relative group">
                            <div className={`w-10 h-10 rounded-2xl shadow-xl flex items-center justify-center border-2 transition-transform group-hover:scale-110 ${
                              u.isOnline ? 'bg-white border-emerald-500 text-emerald-600' : 'bg-slate-100 border-slate-300 text-slate-400'
                            }`}>
                              <User size={20} />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-emerald-500 z-10" />
                            
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-slate-900 text-white p-2 rounded-lg text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                              <p className="font-bold mb-1">{u.name}</p>
                              <p className="text-slate-400">{u.vertical}</p>
                              <p className="text-emerald-400 mt-1">Status: {u.isOnline ? 'Online' : 'Offline'}</p>
                            </div>
                          </div>
                        </AdvancedMarker>
                      ))}
                    </Map>
                  </APIProvider>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-slate-50">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                      <Navigation size={32} />
                    </div>
                    <h4 className="text-lg font-bold text-slate-800 mb-2">Interactive Map Preview</h4>
                    <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                      The live tracking map requires a valid Google Maps API Key. Please configure it in the system settings to enable real-time plotting.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                      {operationsUsers.filter(u => u.lat && u.lng).slice(0, 3).map((u, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-bold text-slate-700">{u.name}</span>
                          <span className="text-[10px] text-slate-400">({u.lat.toFixed(2)}, {u.lng.toFixed(2)})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && userRole !== 'Branch' && (
        <TaskManagement 
          tasks={tasks}
          setTasks={setTasks}
          userBranch={userBranch}
          userName={userName}
          users={users}
          role="Branch"
        />
      )}
    </div>
  );
};

const HRDashboard = ({ users }: { users: any[] }) => {
  const totalEmployees = users.length;
  const activeEmployees = users.filter(u => u.status === 'Active').length;
  const onlineEmployees = users.filter(u => u.isOnline).length;
  
  const attendanceData = [
    { name: 'Present', value: 88, color: '#10B981' },
    { name: 'Absent', value: 8, color: '#EF4444' },
    { name: 'On Leave', value: 4, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-8">
      {/* HR KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Users}
          title="Total Employees"
          value={totalEmployees.toString()}
          subtext="Across all branches"
          colorClass="text-emerald-600"
          bgClass="bg-emerald-500/5"
        />
        <StatCard 
          icon={UserCheck}
          title="Active Staff"
          value={activeEmployees.toString()}
          subtext="Verified profiles"
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50/50"
        />
        <StatCard 
          icon={Activity}
          title="Currently Online"
          value={onlineEmployees.toString()}
          subtext="System active"
          colorClass="text-emerald-600"
          bgClass="bg-emerald-500/5"
        />
        <StatCard 
          icon={Calendar}
          title="Pending Leaves"
          value="5"
          subtext="Approval required"
          colorClass="text-amber-600"
          bgClass="bg-amber-50/50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Attendance Overview */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Attendance Overview</h3>
              <p className="text-xs text-slate-400 font-medium">Daily workforce status</p>
            </div>
            <div className="p-2 bg-sky-50 rounded-xl text-sky-600">
              <Users size={20} />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            {attendanceData.map((item) => (
              <div key={item.name} className="flex flex-col items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-2 h-2 rounded-full mb-2" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.name}</span>
                <span className="text-sm font-bold text-slate-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Hires */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Recent Onboarding</h3>
              <p className="text-xs text-slate-400 font-medium">Newly joined members</p>
            </div>
            <button className="text-[10px] font-bold text-sky-600 uppercase tracking-widest hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {users.slice(-3).reverse().map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-emerald-500/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 font-bold text-xs">
                    {user.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{user.name}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user.role} • {user.branches?.join(', ') || user.branch}</div>
                  </div>
                </div>
                <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-widest">Joined</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ITDashboard = ({ users }: { users: any[] }) => {
  const activeUsers = users.filter(u => u.isOnline).length;
  const offlineUsers = users.filter(u => !u.isOnline).length;

  const systemHealthData = [
    { name: 'Healthy', value: 85, color: '#10B981' },
    { name: 'Warning', value: 10, color: '#F59E0B' },
    { name: 'Critical', value: 5, color: '#EF4444' },
  ];

  return (
    <div className="space-y-8">
      {/* IT KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          icon={UserCircle}
          title="Active Users"
          value={activeUsers.toString()}
          subtext="Currently online"
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50/50"
        />
        <StatCard 
          icon={UserCircle}
          title="Offline Users"
          value={offlineUsers.toString()}
          subtext="Currently offline"
          colorClass="text-slate-600"
          bgClass="bg-slate-50/50"
        />
        <StatCard 
          icon={Shield}
          title="System Security"
          value="98%"
          subtext="Threat level: Low"
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50/50"
        />
        <StatCard 
          icon={Activity}
          title="Server Uptime"
          value="99.9%"
          subtext="Last 30 days"
          colorClass="text-emerald-600"
          bgClass="bg-emerald-500/5"
        />
        <StatCard 
          icon={Key}
          title="Pending Access"
          value="12"
          subtext="Approval required"
          colorClass="text-amber-600"
          bgClass="bg-amber-50/50"
        />
        <StatCard 
          icon={Settings}
          title="System Updates"
          value="4"
          subtext="Scheduled tonight"
          colorClass="text-emerald-600"
          bgClass="bg-emerald-500/5"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Health */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800">System Health Overview</h3>
              <p className="text-xs text-slate-400 font-medium">Infrastructure status</p>
            </div>
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
              <Activity size={20} />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={systemHealthData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {systemHealthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            {systemHealthData.map((item) => (
              <div key={item.name} className="flex flex-col items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-2 h-2 rounded-full mb-2" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.name}</span>
                <span className="text-sm font-bold text-slate-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* IT Support Tickets */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Active IT Support</h3>
              <p className="text-xs text-slate-400 font-medium">Recent helpdesk tickets</p>
            </div>
            <div className="p-2 bg-sky-50 rounded-xl text-sky-600">
              <Users size={20} />
            </div>
          </div>
          <div className="space-y-4">
            {[
              { user: 'Amit Patel', issue: 'VPN Connection', status: 'In Progress', time: '15m ago' },
              { user: 'Priya Singh', issue: 'Software Install', status: 'Pending', time: '45m ago' },
              { user: 'Rahul Verma', issue: 'Password Reset', status: 'Resolved', time: '1h ago' },
              { user: 'Neha Gupta', issue: 'Email Sync', status: 'Pending', time: '2h ago' },
            ].map((ticket, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-xs font-bold text-emerald-600">
                    {ticket.user.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{ticket.user}</p>
                    <p className="text-[10px] text-slate-500">{ticket.issue}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    ticket.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 
                    ticket.status === 'In Progress' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {ticket.status}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">{ticket.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Infrastructure Alerts */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-800">System Alerts</h3>
            <p className="text-xs text-slate-400 font-medium">Critical infrastructure notifications</p>
          </div>
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-widest">View All Logs</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Backup Success', desc: 'Nightly cloud backup completed successfully.', type: 'Success', icon: <Shield size={16} /> },
            { title: 'Storage Warning', desc: 'Main file server reaching 90% capacity.', type: 'Warning', icon: <Package size={16} /> },
            { title: 'Unauthorized Login', desc: 'Blocked attempt from unrecognized IP.', type: 'Alert', icon: <Lock size={16} /> },
          ].map((alert, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400">
                  {alert.icon}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  alert.type === 'Alert' ? 'bg-rose-50 text-rose-600' : 
                  alert.type === 'Warning' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {alert.type}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">{alert.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{alert.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


const SalesPredictiveAnalysisCard = () => {
  const [growthFactor, setGrowthFactor] = useState(1.1);
  const [isPredicting, setIsPredicting] = useState(false);

  const data = [
    { month: 'Jan', actual: 45000, predicted: 45000 },
    { month: 'Feb', actual: 52000, predicted: 52000 },
    { month: 'Mar', actual: 48000, predicted: 48000 },
    { month: 'Apr', actual: 61000, predicted: 61000 },
    { month: 'May', actual: 55000, predicted: 55000 },
    { month: 'Jun', actual: 67000, predicted: 67000 },
    { month: 'Jul', predicted: Math.round(67000 * growthFactor) },
    { month: 'Aug', predicted: Math.round(67000 * growthFactor * growthFactor) },
    { month: 'Sep', predicted: Math.round(67000 * growthFactor * growthFactor * growthFactor) },
  ];

  useEffect(() => {
    if (isPredicting) {
      const timer = setTimeout(() => setIsPredicting(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [growthFactor]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Activity className="text-emerald-600" size={20} />
            Sales Predictive Analysis
          </h3>
          <p className="text-xs text-slate-400 font-medium">AI-driven revenue forecasting based on market trends</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Growth Factor</span>
            <div className="flex items-center gap-3">
              <input 
                type="range" 
                min="0.8" 
                max="1.5" 
                step="0.05" 
                value={growthFactor} 
                onChange={(e) => {
                  setGrowthFactor(parseFloat(e.target.value));
                  setIsPredicting(true);
                }}
                className="w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-sm font-bold text-emerald-600">{(growthFactor * 100 - 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-72 relative">
        {isPredicting && (
          <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
            <div className="flex items-center gap-2 px-4 py-2 bg-white shadow-lg rounded-full border border-slate-100">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Recalculating Forecast...</span>
            </div>
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
              tickFormatter={(value) => `₹${value/1000}k`}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
            />
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle"
              wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', paddingBottom: '20px' }}
            />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#1a3a3a" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#1a3a3a', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              name="Actual Sales"
            />
            <Line 
              type="monotone" 
              dataKey="predicted" 
              stroke="#94a3b8" 
              strokeWidth={2} 
              strokeDasharray="5 5"
              dot={false}
              name="Predicted Forecast"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Q3 Forecast</p>
          <p className="text-xl font-bold text-slate-800">₹ {(data[data.length-1].predicted / 1000).toFixed(1)}k</p>
          <p className="text-[10px] text-emerald-600 font-medium mt-1">Based on current trajectory</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Confidence Score</p>
          <p className="text-xl font-bold text-slate-800">92%</p>
          <p className="text-[10px] text-slate-500 font-medium mt-1">High data reliability</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Market Sentiment</p>
          <p className="text-xl font-bold text-slate-800">Bullish</p>
          <p className="text-[10px] text-slate-500 font-medium mt-1">Positive trend indicators</p>
        </div>
      </div>
    </div>
  );
};

const SalesDashboard = ({ userRegion, leads, deals, expenses }: { userRegion?: string, leads: any[], deals: any[], expenses: any[] }) => {
  const salesPerformanceData = [
    { month: 'Jan', sales: 45000, leads: 120 },
    { month: 'Feb', sales: 52000, leads: 150 },
    { month: 'Mar', sales: 48000, leads: 140 },
    { month: 'Apr', sales: 61000, leads: 180 },
    { month: 'May', sales: 55000, leads: 160 },
    { month: 'Jun', sales: 67000, leads: 210 },
  ];

  const leadSourceData = [
    { name: 'Direct', value: 400, color: '#1a3a3a' },
    { name: 'Referral', value: 300, color: '#10B981' },
    { name: 'Social', value: 200, color: '#F59E0B' },
    { name: 'Email', value: 100, color: '#8B5CF6' },
  ];

  const totalSalesValue = deals.reduce((acc, deal) => acc + deal.value, 0);
  const conversionRate = leads.length > 0 ? ((deals.length / leads.length) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-8">
      {/* Sales KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          icon={TrendingUp}
          title="Pipeline Value"
          value={`₹ ${totalSalesValue.toFixed(1)} L`}
          subtext={`${deals.length} active deals`}
          colorClass="text-emerald-600"
          bgClass="bg-emerald-500/5"
        />
        <StatCard 
          icon={Target}
          title="Conversion Rate"
          value={`${conversionRate}%`}
          subtext="Lead to Deal"
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50/50"
        />
        <StatCard 
          icon={CalendarCheck}
          title="My Attendance"
          value="98%"
          subtext="Current month average"
          colorClass="text-indigo-600"
          bgClass="bg-indigo-50/50"
        />
        <StatCard 
          icon={Calendar}
          title="Leave Balance"
          value="27"
          subtext="12 CL + 15 PL"
          colorClass="text-amber-600"
          bgClass="bg-amber-50/50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leave Accounting Detail */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Leave Accounting</h3>
            <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
              <Calendar size={20} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Casual Leave (CL)</p>
              <p className="text-2xl font-bold text-slate-800">12 Days</p>
              <p className="text-[10px] text-slate-500 mt-1">Annual entitlement</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Privileged Leave (PL)</p>
              <p className="text-2xl font-bold text-slate-800">15 Days</p>
              <p className="text-[10px] text-slate-500 mt-1">Annual entitlement</p>
            </div>
          </div>
          <div className="mt-6 p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-amber-900">Total Annual Leave</span>
              <span className="text-xl font-black text-amber-600">27 Days</span>
            </div>
          </div>
        </div>

        {/* Lead Volume by Stage */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Lead Volume by Stage</h3>
              <p className="text-xs text-slate-400 font-medium">Business volume across different pipeline stages</p>
            </div>
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
              <BarChart3 size={20} />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deals.map(d => ({ name: d.name, value: d.value, stage: d.stage }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  hide 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                  tickFormatter={(value) => `₹${value}L`}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  labelStyle={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[6, 6, 0, 0]}
                  barSize={30}
                >
                  {deals.map((entry, index) => {
                    const stageColors: { [key: string]: string } = {
                      'Prospecting': '#94a3b8',
                      'Qualification': '#1a3a3a',
                      'Proposal': '#8b5cf6',
                      'Negotiation': '#f59e0b',
                      'Closed Won': '#10b981',
                      'Closed Lost': '#ef4444'
                    };
                    return <Cell key={`cell-${index}`} fill={stageColors[entry.stage] || '#cbd5e1'} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            {['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won'].map((stage) => {
              const stageColors: { [key: string]: string } = {
                'Prospecting': '#94a3b8',
                'Qualification': '#0ea5e9',
                'Proposal': '#8b5cf6',
                'Negotiation': '#f59e0b',
                'Closed Won': '#10b981'
              };
              return (
                <div key={stage} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stageColors[stage] }} />
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{stage}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Predictive Analysis Section */}
      <SalesPredictiveAnalysisCard />

      {/* Recent Deals & Targets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Expense Status */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Expense Status</h3>
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-600">
              <Wallet size={20} />
            </div>
          </div>
          <div className="space-y-4">
            {expenses.slice(0, 4).map((exp) => (
              <div key={exp.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-800 capitalize">{exp.type}</p>
                  <p className="text-[10px] text-slate-500">{exp.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-800">₹ {exp.amount}</p>
                  <span className={`text-[8px] font-bold uppercase tracking-widest ${
                    exp.status === 'Pending' ? 'text-amber-600' :
                    exp.status === 'Approved' ? 'text-emerald-600' :
                    'text-rose-600'
                  }`}>
                    {exp.status}
                  </span>
                </div>
              </div>
            ))}
            {expenses.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4 italic">No expense requests.</p>
            )}
          </div>
          {expenses.length > 0 && (
            <button className="w-full mt-4 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-500/10 rounded-xl transition-colors">
              View All Expenses
            </button>
          )}
        </div>

        {/* Recent Deals */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Recent Deals</h3>
              <p className="text-xs text-slate-400 font-medium">Latest closed and pending deals</p>
            </div>
            <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-widest">View All Deals</button>
          </div>
          <div className="space-y-4">
            {[
              { client: 'Tech Solutions Ltd', value: '₹ 1.2 L', status: 'Closed', time: '2h ago' },
              { client: 'Global Retail Corp', value: '₹ 4.5 L', status: 'Negotiation', time: '5h ago' },
              { client: 'Sunrise Enterprises', value: '₹ 85 K', status: 'Closed', time: 'Yesterday' },
              { client: 'Modern Systems', value: '₹ 2.1 L', status: 'Proposal', time: 'Yesterday' },
            ].map((deal, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-emerald-600 font-bold">
                    {deal.client[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{deal.client}</p>
                    <p className="text-xs text-slate-500">{deal.value}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    deal.status === 'Closed' ? 'bg-emerald-50 text-emerald-600' : 
                    deal.status === 'Negotiation' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'
                  }`}>
                    {deal.status}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">{deal.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Targets */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-8">Monthly Targets</h3>
          <div className="space-y-8">
            {[
              { label: 'Revenue Goal', current: 670000, target: 1000000, color: 'bg-emerald-500' },
              { label: 'New Clients', current: 12, target: 20, color: 'bg-emerald-500' },
              { label: 'Lead Generation', current: 142, target: 200, color: 'bg-amber-500' },
            ].map((target, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between items-end">
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">{target.label}</p>
                  <p className="text-xs font-bold text-slate-800">{Math.round((target.current / target.target) * 100)}%</p>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${target.color} transition-all duration-1000`} 
                    style={{ width: `${(target.current / target.target) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-medium">
                  {target.current.toLocaleString()} / {target.target.toLocaleString()} achieved
                </p>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-3 rounded-2xl bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
            Update Targets
          </button>
        </div>
      </div>
    </div>
  );
};

const OperationsDashboard = ({ 
  tasks, 
  setTasks, 
  userName,
  users
}: { 
  tasks: any[], 
  setTasks: React.Dispatch<React.SetStateAction<any[]>>,
  userName?: string,
  users: any[]
}) => {
  const attendanceData = [
    { name: 'Mon', status: 'Present', hours: 8.5 },
    { name: 'Tue', status: 'Present', hours: 9.0 },
    { name: 'Wed', status: 'Present', hours: 8.2 },
    { name: 'Thu', status: 'Present', hours: 8.8 },
    { name: 'Fri', status: 'Present', hours: 8.5 },
    { name: 'Sat', status: 'Off', hours: 0 },
    { name: 'Sun', status: 'Off', hours: 0 },
  ];

  return (
    <div className="space-y-8">
      {/* Operations KPIs - Personal View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <StatCard 
          icon={CalendarCheck}
          title="My Attendance"
          value="95%"
          subtext="Current month average"
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50/50"
        />
        <StatCard 
          icon={Navigation}
          title="Field Visits"
          value="12"
          subtext="Total this month"
          colorClass="text-emerald-600"
          bgClass="bg-emerald-500/5"
          breakup={[
            { label: 'Done', value: 8, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Pend', value: 2, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Sched', value: 2, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
          ]}
        />
        <StatCard 
          icon={Calendar}
          title="Leave Balance"
          value="27"
          subtext="12 CL + 15 PL"
          colorClass="text-amber-600"
          bgClass="bg-amber-50/50"
        />
      </div>

      {/* Leave Accounting Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Leave Accounting</h3>
            <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
              <Calendar size={20} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Casual Leave (CL)</p>
              <p className="text-2xl font-bold text-slate-800">12 Days</p>
              <p className="text-[10px] text-slate-500 mt-1">Annual entitlement</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Privileged Leave (PL)</p>
              <p className="text-2xl font-bold text-slate-800">15 Days</p>
              <p className="text-[10px] text-slate-500 mt-1">Annual entitlement</p>
            </div>
          </div>
          <div className="mt-6 p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-amber-900">Total Annual Leave</span>
              <span className="text-xl font-black text-amber-600">27 Days</span>
            </div>
          </div>
        </div>

        {/* Analytics Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Attendance & Work Hours</h3>
              <p className="text-xs text-slate-400 font-medium">Weekly performance overview</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sky-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Work Hours</span>
              </div>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fill: '#94a3b8'}} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fill: '#94a3b8'}} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#1a3a3a" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#1a3a3a', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <TaskManagement 
          tasks={tasks}
          setTasks={setTasks}
          userName={userName}
          users={users}
          role="Operations"
        />
      </div>

        {/* Upcoming Field Visits */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Upcoming Field Visits</h3>
          <div className="space-y-4">
            {[
              { site: 'Corporate Plaza', date: 'Mar 22, 2026', time: '10:00 AM', status: 'Confirmed' },
              { site: 'Retail Hub', date: 'Mar 24, 2026', time: '02:30 PM', status: 'Pending' },
              { site: 'Airport Terminal', date: 'Mar 27, 2026', time: '09:15 AM', status: 'Scheduled' },
            ].map((visit, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <Navigation size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{visit.site}</p>
                    <p className="text-xs text-slate-500 font-medium">{visit.date} · {visit.time}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  visit.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' : 
                  visit.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-sky-50 text-sky-600'
                }`}>
                  {visit.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

const Invoices = ({ invoiceData, setInvoiceData }: { invoiceData: any[], setInvoiceData: React.Dispatch<React.SetStateAction<any[]>> }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showNewInvoice, setShowNewInvoice] = useState(false);

  const [newInvoice, setNewInvoice] = useState({
    vertical: 'MG',
    id: '',
    date: new Date().toISOString().split('T')[0],
    client: '',
    amount: '',
    dueDate: '',
    status: 'Pending'
  });

  const handleAddInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedAmount = `₹ ${Number(newInvoice.amount).toLocaleString()}`;
    setInvoiceData([{ ...newInvoice, amount: formattedAmount }, ...invoiceData]);
    setShowNewInvoice(false);
    setNewInvoice({
      vertical: 'MG',
      id: '',
      date: new Date().toISOString().split('T')[0],
      client: '',
      amount: '',
      dueDate: '',
      status: 'Pending'
    });
  };

  const handleExportPDF = () => {
    const columns = ["Invoice ID", "Client", "Amount", "Due Date", "Status"];
    const data = invoiceData.map(i => [i.id, i.client, i.amount, i.date, i.status]);
    exportToPDF("Invoices Report", columns, data, 'Invoices_Report');
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    const data = invoiceData.map(i => ({
      "Invoice ID": i.id,
      "Client": i.client,
      "Amount": i.amount,
      "Due Date": i.date,
      "Status": i.status
    }));
    exportToExcel(data, 'Invoices_Report');
    setShowExportMenu(false);
  };

  return (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-slate-800">Invoice Management</h2>
      <div className="flex items-center gap-3">
        <div className="relative">
          <button 
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all bg-white"
          >
            <Download size={16} />
            <span>Export</span>
          </button>
          <AnimatePresence>
            {showExportMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50"
              >
                <button 
                  onClick={handleExportPDF}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <FileText size={16} className="text-rose-500" />
                  Export as PDF
                </button>
                <button 
                  onClick={handleExportExcel}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <FileSpreadsheet size={16} className="text-emerald-500" />
                  Export as Excel
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button 
          onClick={() => setShowNewInvoice(true)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 shadow-md shadow-emerald-100 transition-all"
        >
          <Plus size={16} />
          <span>Create New Invoice</span>
        </button>
      </div>
    </div>

    {showNewInvoice && (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl my-8 border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Create New Invoice</h3>
            <button onClick={() => setShowNewInvoice(false)} className="text-slate-400 hover:text-slate-600">
              <Plus size={24} className="rotate-45" />
            </button>
          </div>
          <form onSubmit={handleAddInvoice} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1 uppercase tracking-widest">Business Vertical</label>
              <select 
                value={newInvoice.vertical}
                onChange={e => setNewInvoice({...newInvoice, vertical: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm font-medium bg-slate-50/50"
              >
                <option value="MG">MG</option>
                <option value="ESS">ESS</option>
                <option value="FMS">FMS</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1 uppercase tracking-widest">Invoice ID</label>
              <input 
                type="text" required value={newInvoice.id}
                onChange={e => setNewInvoice({...newInvoice, id: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm font-medium bg-slate-50/50"
                placeholder="e.g. INV-2026-004"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1 uppercase tracking-widest">Invoice Date</label>
              <input 
                type="date" required value={newInvoice.date}
                onChange={e => setNewInvoice({...newInvoice, date: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm font-medium bg-slate-50/50"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1 uppercase tracking-widest">Client</label>
              <input 
                type="text" required value={newInvoice.client}
                onChange={e => setNewInvoice({...newInvoice, client: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm font-medium bg-slate-50/50"
                placeholder="Client Name"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1 uppercase tracking-widest">Amount without GST</label>
              <input 
                type="number" required value={newInvoice.amount}
                onChange={e => setNewInvoice({...newInvoice, amount: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm font-medium bg-slate-50/50"
                placeholder="Amount"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1 uppercase tracking-widest">Payment Due Date</label>
              <input 
                type="date" required value={newInvoice.dueDate}
                onChange={e => setNewInvoice({...newInvoice, dueDate: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm font-medium bg-slate-50/50"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1 uppercase tracking-widest">Payment Status</label>
              <select 
                value={newInvoice.status}
                onChange={e => setNewInvoice({...newInvoice, status: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm font-medium bg-slate-50/50"
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
            <div className="flex gap-4 mt-6">
              <button type="button" onClick={() => setShowNewInvoice(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-[10px] font-bold hover:bg-slate-50 transition-colors uppercase tracking-widest">
                Cancel
              </button>
              <button type="submit"
                className="flex-1 px-4 py-2 rounded-xl bg-emerald-500 text-white text-[10px] font-bold hover:bg-emerald-600 transition-colors uppercase tracking-widest">
                Save Invoice
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Invoiced</p>
        <p className="text-3xl font-bold text-slate-800">₹ 85.4 L</p>
      </div>
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Paid Invoices</p>
        <p className="text-3xl font-bold text-emerald-600">₹ 62.1 L</p>
      </div>
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Outstanding</p>
        <p className="text-3xl font-bold text-rose-600">₹ 23.3 L</p>
      </div>
    </div>
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Invoice ID</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Client</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Amount</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Due Date</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {invoiceData.map((inv) => (
            <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 text-sm font-bold text-slate-800">{inv.id}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{inv.client}</td>
              <td className="px-6 py-4 text-sm font-bold text-slate-800">{inv.amount}</td>
              <td className="px-6 py-4 text-sm text-slate-500">{inv.date}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 
                  inv.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {inv.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
};

const Payroll = () => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const payrollData = [
    { month: 'February 2026', date: '28 Feb 2026', amount: '₹ 1.38 Cr', status: 'Completed', staff: '1,242' },
    { month: 'January 2026', date: '31 Jan 2026', amount: '₹ 1.35 Cr', status: 'Completed', staff: '1,235' },
  ];

  const handleExportPDF = () => {
    const columns = ["Month", "Date", "Amount", "Status", "Staff"];
    const data = payrollData.map(p => [p.month, p.date, p.amount, p.status, p.staff]);
    exportToPDF("Payroll Report", columns, data, 'Payroll_Report');
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    const data = payrollData.map(p => ({
      "Month": p.month,
      "Staff": p.staff,
      "Date": p.date,
      "Amount": p.amount,
      "Status": p.status
    }));
    exportToExcel(data, 'Payroll_Report');
    setShowExportMenu(false);
  };

  return (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-slate-800">Payroll Management</h2>
      <div className="flex items-center gap-3">
        <div className="relative">
          <button 
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all bg-white"
          >
            <Download size={16} />
            <span>Export</span>
          </button>
          <AnimatePresence>
            {showExportMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50"
              >
                <button 
                  onClick={handleExportPDF}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <FileText size={16} className="text-rose-500" />
                  Export as PDF
                </button>
                <button 
                  onClick={handleExportExcel}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <FileSpreadsheet size={16} className="text-emerald-500" />
                  Export as Excel
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button className="flex items-center gap-2 px-6 py-2 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 shadow-md shadow-emerald-500/20 transition-all rounded-xl">
          <Calculator size={16} />
          <span>Run Payroll Cycle</span>
        </button>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center gap-6">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600">
          <Users size={32} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Employees</p>
          <p className="text-3xl font-bold text-slate-800">1,248</p>
        </div>
      </div>
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center gap-6">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
          <Banknote size={32} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Monthly Payroll</p>
          <p className="text-3xl font-bold text-slate-800">₹ 1.42 Cr</p>
        </div>
      </div>
    </div>
    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Payroll Batches</h3>
      <div className="space-y-4">
        {payrollData.map((batch, i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{batch.month}</p>
                <p className="text-xs text-slate-500">{batch.staff} Employees · {batch.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-800">{batch.amount}</p>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{batch.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

const Budgeting = ({ budgets, setBudgets }: { budgets: any[], setBudgets: React.Dispatch<React.SetStateAction<any[]>> }) => {
  const [showAllocationForm, setShowAllocationForm] = useState(false);

  const [newAllocation, setNewAllocation] = useState({
    businessPromotion: '',
    stationary: '',
    hr: '',
    asset: ''
  });

  const handleAllocate = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we'd update the budgets state here
    alert('Budget allocated successfully!');
    setShowAllocationForm(false);
  };

  return (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-slate-800">Budgeting & Forecasting</h2>
      <button 
        onClick={() => setShowAllocationForm(true)}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 shadow-md shadow-rose-100 transition-all"
      >
        <Plus size={16} />
        <span>Budget Allocation</span>
      </button>
    </div>

    {showAllocationForm && (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl my-8 border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Budget Allocation</h3>
            <button onClick={() => setShowAllocationForm(false)} className="text-slate-400 hover:text-slate-600">
              <Plus size={24} className="rotate-45" />
            </button>
          </div>
          <form onSubmit={handleAllocate} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1 uppercase tracking-widest">Business Promotion Amount</label>
              <input 
                type="number" required value={newAllocation.businessPromotion}
                onChange={e => setNewAllocation({...newAllocation, businessPromotion: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none text-sm font-medium bg-slate-50/50"
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1 uppercase tracking-widest">Stationary Amount</label>
              <input 
                type="number" required value={newAllocation.stationary}
                onChange={e => setNewAllocation({...newAllocation, stationary: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none text-sm font-medium bg-slate-50/50"
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1 uppercase tracking-widest">HR Amount</label>
              <input 
                type="number" required value={newAllocation.hr}
                onChange={e => setNewAllocation({...newAllocation, hr: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none text-sm font-medium bg-slate-50/50"
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1 uppercase tracking-widest">Asset Amount</label>
              <input 
                type="number" required value={newAllocation.asset}
                onChange={e => setNewAllocation({...newAllocation, asset: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none text-sm font-medium bg-slate-50/50"
                placeholder="Enter amount"
              />
            </div>
            <div className="flex gap-4 mt-6">
              <button type="button" onClick={() => setShowAllocationForm(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-[10px] font-bold hover:bg-slate-50 transition-colors uppercase tracking-widest">
                Cancel
              </button>
              <button type="submit"
                className="flex-1 px-4 py-2 rounded-xl bg-emerald-500 text-white text-[10px] font-bold hover:bg-emerald-600 transition-colors uppercase tracking-widest">
                Allocate Budget
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Budget vs Actual (Q1 2026)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[
              { name: 'Jan', budget: 400000, actual: 380000 },
              { name: 'Feb', budget: 400000, actual: 420000 },
              { name: 'Mar', budget: 450000, actual: 410000 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="budget" stroke="#94a3b8" fill="#f1f5f9" />
              <Area type="monotone" dataKey="actual" stroke="#1a3a3a" fill="#1a3a3a20" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="space-y-6">
        <div className="p-6 rounded-3xl bg-emerald-900 text-white shadow-xl">
          <p className="text-[10px] font-bold text-emerald-200/60 uppercase tracking-widest mb-2">Budget Utilization</p>
          <p className="text-4xl font-bold mb-4">92.4%</p>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400" style={{ width: '92.4%' }} />
          </div>
        </div>
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <h4 className="text-xs font-bold text-slate-800 mb-4 uppercase tracking-widest">Alerts</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600">
              <AlertCircle size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Operations Over Budget</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
              <TrendingUp size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Marketing Under Budget</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

const UniformManagement = ({ 
  stockData, 
  setStockData, 
  issueData, 
  setIssueData 
}: { 
  stockData: any[], 
  setStockData: React.Dispatch<React.SetStateAction<any[]>>,
  issueData: any[],
  setIssueData: React.Dispatch<React.SetStateAction<any[]>>
}) => {
  const [activeSubModule, setActiveSubModule] = useState('Stock Taking');
  const [showStockForm, setShowStockForm] = useState(false);
  const [showIssueForm, setShowIssueForm] = useState(false);

  const items = ['Shirt', 'Trouser', 'Shoes', 'Cap', 'Gum Boot', 'Raincoat'];
  const sizes = ['S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', '38', '6', '7', '8', '9', '10', 'NA'];

  const [newStockEntry, setNewStockEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    items: items.reduce((acc, item) => ({
      ...acc,
      [item]: { isApplicable: true, size: '', qty: '', rate: '', amount: 0 }
    }), {})
  });

  const [newIssueEntry, setNewIssueEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    empId: '',
    empName: '',
    unit: '',
    items: items.reduce((acc, item) => ({
      ...acc,
      [item]: { qty: 0, isNA: true }
    }), {})
  });

  const handleStockItemChange = (item: string, field: string, value: any) => {
    setNewStockEntry(prev => {
      const updatedItem = { ...prev.items[item], [field]: value };
      if (field === 'qty' || field === 'rate') {
        updatedItem.amount = (Number(updatedItem.qty) || 0) * (Number(updatedItem.rate) || 0);
      }
      return {
        ...prev,
        items: { ...prev.items, [item]: updatedItem }
      };
    });
  };

  const handleStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntries = Object.entries(newStockEntry.items)
      .filter(([_, data]: [string, any]) => data.isApplicable && (data.qty !== '' && Number(data.qty) > 0))
      .map(([item, data]: [string, any]) => ({
        date: newStockEntry.date,
        item,
        size: data.size || 'NA',
        qty: data.qty,
        rate: data.rate,
        amount: data.amount
      }));
    
    // Also record NA entries if needed, but usually we just skip them in the table or mark them.
    // The user said "all data need to be recorded". 
    // Let's include NA entries too.
    const naEntries = Object.entries(newStockEntry.items)
      .filter(([_, data]: [string, any]) => !data.isApplicable)
      .map(([item, _]) => ({
        date: newStockEntry.date,
        item,
        size: 'NA',
        qty: 0,
        rate: 0,
        amount: 0
      }));

    setStockData([...stockData, ...newEntries, ...naEntries]);
    setShowStockForm(false);
    // Reset form
    setNewStockEntry({
      date: new Date().toISOString().split('T')[0],
      items: items.reduce((acc, item) => ({
        ...acc,
        [item]: { isApplicable: true, size: '', qty: '', rate: '', amount: 0 }
      }), {})
    });
  };

  const handleIssueItemChange = (item: string, field: string, value: any) => {
    setNewIssueEntry(prev => ({
      ...prev,
      items: {
        ...prev.items,
        [item]: { ...prev.items[item], [field]: value }
      }
    }));
  };

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntries = Object.entries(newIssueEntry.items)
      .filter(([_, data]: [string, any]) => !data.isNA && data.qty > 0)
      .map(([item, data]: [string, any]) => ({
        date: newIssueEntry.date,
        empId: newIssueEntry.empId,
        empName: newIssueEntry.empName,
        unit: newIssueEntry.unit,
        item,
        qty: data.qty
      }));

    setIssueData([...issueData, ...newEntries]);
    setShowIssueForm(false);
    // Reset form
    setNewIssueEntry({
      date: new Date().toISOString().split('T')[0],
      empId: '',
      empName: '',
      unit: '',
      items: items.reduce((acc, item) => ({
        ...acc,
        [item]: { qty: 0, isNA: true }
      }), {})
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Uniform Management</h2>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveSubModule('Stock Taking')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeSubModule === 'Stock Taking' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Stock Taking
          </button>
          <button 
            onClick={() => setActiveSubModule('Uniform Issue')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeSubModule === 'Uniform Issue' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Uniform Issue Register
          </button>
        </div>
      </div>

      {activeSubModule === 'Stock Taking' ? (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button 
              onClick={() => setShowStockForm(true)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-bold hover:bg-sky-700 shadow-md shadow-sky-100 transition-all"
            >
              <Plus size={16} />
              <span>Record Stock Taking</span>
            </button>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Item</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Size</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Qty</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Rate</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {stockData.map((stock, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600">{stock.date}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">{stock.item}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{stock.size}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{stock.qty}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">₹ {stock.rate}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">₹ {stock.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button 
              onClick={() => setShowIssueForm(true)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 shadow-md shadow-emerald-100 transition-all"
            >
              <Plus size={16} />
              <span>Issue Uniform</span>
            </button>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Employee ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Unit</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Item</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Qty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {issueData.map((issue, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600">{issue.date}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">{issue.empId}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{issue.empName}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{issue.unit}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{issue.item}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">{issue.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showStockForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full shadow-2xl my-8 border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">New Stock Taking Entry</h3>
              <button onClick={() => setShowStockForm(false)} className="text-slate-400 hover:text-slate-600">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleStockSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <label className="text-[10px] font-bold text-slate-700 block mb-1 uppercase tracking-widest">Stock Taking Date</label>
                  <input 
                    type="date" 
                    value={newStockEntry.date}
                    onChange={e => setNewStockEntry({...newStockEntry, date: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm font-medium bg-slate-50/50" 
                  />
                </div>
                {items.map(item => (
                  <div key={item} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/30 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">{item}</h4>
                      <div className="flex gap-3">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input 
                            type="radio" 
                            name={`stock-app-${item}`}
                            checked={newStockEntry.items[item].isApplicable}
                            onChange={() => handleStockItemChange(item, 'isApplicable', true)}
                            className="w-3 h-3 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-[9px] font-bold text-slate-600 uppercase">Applicable</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input 
                            type="radio" 
                            name={`stock-app-${item}`}
                            checked={!newStockEntry.items[item].isApplicable}
                            onChange={() => handleStockItemChange(item, 'isApplicable', false)}
                            className="w-3 h-3 text-rose-600 focus:ring-rose-500"
                          />
                          <span className="text-[9px] font-bold text-slate-600 uppercase">Not Applicable</span>
                        </label>
                      </div>
                    </div>
                    
                    {newStockEntry.items[item].isApplicable ? (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[8px] font-bold text-slate-400 uppercase">Size</label>
                          <input 
                            type="text"
                            placeholder="Enter Size"
                            value={newStockEntry.items[item].size}
                            onChange={e => handleStockItemChange(item, 'size', e.target.value)}
                            className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] font-bold text-slate-400 uppercase">Qty</label>
                          <input 
                            type="number" 
                            value={newStockEntry.items[item].qty}
                            onChange={e => handleStockItemChange(item, 'qty', e.target.value)}
                            className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs" 
                          />
                        </div>
                        <div>
                          <label className="text-[8px] font-bold text-slate-400 uppercase">Rate</label>
                          <input 
                            type="number" 
                            value={newStockEntry.items[item].rate}
                            onChange={e => handleStockItemChange(item, 'rate', e.target.value)}
                            className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs" 
                          />
                        </div>
                        <div>
                          <label className="text-[8px] font-bold text-slate-400 uppercase">Amount</label>
                          <input 
                            type="number" 
                            readOnly 
                            value={newStockEntry.items[item].amount}
                            className="w-full px-2 py-1 rounded-lg border border-slate-100 bg-slate-100 text-xs font-bold" 
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="py-4 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase italic">Item Not Applicable</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowStockForm(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors uppercase tracking-widest">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 rounded-xl bg-emerald-500 text-white text-[10px] font-bold hover:bg-emerald-600 transition-colors uppercase tracking-widest">Save Stock Data</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showIssueForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full shadow-2xl my-8 border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Issue Uniform</h3>
              <button onClick={() => setShowIssueForm(false)} className="text-slate-400 hover:text-slate-600">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleIssueSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1 uppercase tracking-widest">Issue Date</label>
                  <input 
                    type="date" 
                    value={newIssueEntry.date}
                    onChange={e => setNewIssueEntry({...newIssueEntry, date: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50/50" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1 uppercase tracking-widest">Employee ID</label>
                  <input 
                    type="text" 
                    value={newIssueEntry.empId}
                    onChange={e => setNewIssueEntry({...newIssueEntry, empId: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50/50" 
                    placeholder="EMP000" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1 uppercase tracking-widest">Employee Name</label>
                  <input 
                    type="text" 
                    value={newIssueEntry.empName}
                    onChange={e => setNewIssueEntry({...newIssueEntry, empName: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50/50" 
                    placeholder="Full Name" 
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="text-[10px] font-bold text-slate-700 block mb-1 uppercase tracking-widest">Unit Name</label>
                  <input 
                    type="text" 
                    value={newIssueEntry.unit}
                    onChange={e => setNewIssueEntry({...newIssueEntry, unit: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50/50" 
                    placeholder="Branch/Unit" 
                  />
                </div>
                {items.map(item => (
                  <div key={item} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/30 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">{item}</h4>
                      <div className="flex gap-3">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input 
                            type="radio" 
                            name={`issue-app-${item}`}
                            checked={!newIssueEntry.items[item].isNA}
                            onChange={() => handleIssueItemChange(item, 'isNA', false)}
                            className="w-3 h-3 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-[9px] font-bold text-slate-600 uppercase">Issue</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input 
                            type="radio" 
                            name={`issue-app-${item}`}
                            checked={newIssueEntry.items[item].isNA}
                            onChange={() => handleIssueItemChange(item, 'isNA', true)}
                            className="w-3 h-3 text-rose-600 focus:ring-rose-500"
                          />
                          <span className="text-[9px] font-bold text-slate-600 uppercase">NA</span>
                        </label>
                      </div>
                    </div>
                    
                    {!newIssueEntry.items[item].isNA ? (
                      <div>
                        <label className="text-[8px] font-bold text-slate-400 uppercase">Qty to Issue</label>
                        <input 
                          type="number" 
                          value={newIssueEntry.items[item].qty}
                          onChange={e => handleIssueItemChange(item, 'qty', e.target.value)}
                          className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs" 
                        />
                      </div>
                    ) : (
                      <div className="py-2 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase italic">Not Issued</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowIssueForm(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors uppercase tracking-widest">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 rounded-xl bg-emerald-500 text-white text-[10px] font-bold hover:bg-emerald-600 transition-colors uppercase tracking-widest">Issue Uniforms</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const FinancialReports = () => {
  const reportsData = [
    { title: 'Profit & Loss Statement', type: 'Monthly', date: 'Feb 2026', icon: <BarChart3 size={24} /> },
    { title: 'Balance Sheet', type: 'Quarterly', date: 'Q1 2026', icon: <FileText size={24} /> },
    { title: 'Cash Flow Statement', type: 'Monthly', date: 'Feb 2026', icon: <TrendingUp size={24} /> },
    { title: 'Tax Compliance Report', type: 'Annual', date: 'FY 2025-26', icon: <Shield size={24} /> },
    { title: 'Audit Summary', type: 'Internal', date: 'Mar 2026', icon: <ClipboardList size={24} /> },
    { title: 'Revenue Projection', type: 'Forecast', date: '2026-27', icon: <Target size={24} /> },
  ];

  const handleExportPDF = (report: any) => {
    const columns = ["Title", "Type", "Date"];
    const data = [[report.title, report.type, report.date]];
    exportToPDF(report.title, columns, data, `${report.title.replace(/ /g, '_')}`);
  };

  const handleExportExcel = (report: any) => {
    const data = [{
      "Report Title": report.title,
      "Type": report.type,
      "Date": report.date
    }];
    exportToExcel(data, `${report.title.replace(/ /g, '_')}`);
  };

  return (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-slate-800">Financial Reports</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reportsData.map((report, i) => (
        <div key={i} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-emerald-500 transition-all group cursor-pointer relative">
          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-600 transition-all mb-4">
            {report.icon}
          </div>
          <h3 className="text-sm font-bold text-slate-800 mb-1">{report.title}</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{report.type} · {report.date}</p>
          <div className="mt-4 flex items-center gap-4">
            <button 
              onClick={() => handleExportPDF(report)}
              className="flex items-center gap-2 text-[10px] font-bold text-rose-600 uppercase tracking-widest hover:underline"
            >
              <FileText size={14} />
              <span>PDF</span>
            </button>
            <button 
              onClick={() => handleExportExcel(report)}
              className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:underline"
            >
              <FileSpreadsheet size={14} />
              <span>Excel</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
};

const AccountsDashboard = ({ setActiveModule }: { setActiveModule: (module: string) => void }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const financialData = [
    { month: 'Jan', revenue: 450000, expenses: 320000 },
    { month: 'Feb', revenue: 520000, expenses: 380000 },
    { month: 'Mar', revenue: 480000, expenses: 350000 },
    { month: 'Apr', revenue: 610000, expenses: 420000 },
    { month: 'May', revenue: 550000, expenses: 400000 },
    { month: 'Jun', revenue: 680000, expenses: 450000 },
  ];

  const expenseBreakdown = [
    { name: 'Payroll', value: 45, color: '#1a3a3a' },
    { name: 'Operations', value: 25, color: '#8B5CF6' },
    { name: 'Marketing', value: 15, color: '#10B981' },
    { name: 'Infrastructure', value: 15, color: '#F59E0B' },
  ];

  const recentTransactions = [
    { id: 'TXN-8821', type: 'Client Payment', entity: 'Global Tech Solutions', amount: '+ ₹ 4,50,000', time: '1 hour ago', status: 'Cleared' },
    { id: 'TXN-8820', type: 'Vendor Payment', entity: 'Cloud Infra Services', amount: '- ₹ 85,000', time: '3 hours ago', status: 'Pending' },
    { id: 'TXN-8819', type: 'Payroll Disbursement', entity: 'Employee Salaries', amount: '- ₹ 12,40,000', time: '5 hours ago', status: 'Cleared' },
    { id: 'TXN-8818', type: 'Tax Filing', entity: 'GST Authority', amount: '- ₹ 2,10,000', time: '1 day ago', status: 'Cleared' },
  ];

  const handleExportPDF = () => {
    const columns = ["Transaction ID", "Type", "Entity", "Amount", "Time", "Status"];
    const data = recentTransactions.map(t => [t.id, t.type, t.entity, t.amount, t.time, t.status]);
    exportToPDF("Recent Transactions", columns, data, 'Recent_Transactions');
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    const data = recentTransactions.map(t => ({
      "Transaction ID": t.id,
      "Type": t.type,
      "Entity": t.entity,
      "Amount": t.amount,
      "Time": t.time,
      "Status": t.status
    }));
    exportToExcel(data, 'Recent_Transactions');
    setShowExportMenu(false);
  };

  return (
    <div className="space-y-8">
      {/* Quick Access Modules */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: <Receipt size={20} />, label: 'Invoices', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
          { icon: <FileText size={20} />, label: 'Taxation', color: 'bg-amber-50 text-amber-600 border-amber-100' },
          { icon: <Calculator size={20} />, label: 'Budgeting', color: 'bg-rose-50 text-rose-600 border-rose-100' },
          { icon: <Shirt size={20} />, label: 'Uniform Management', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
        ].map((module, i) => (
          <button key={i} onClick={() => setActiveModule(module.label)} className={`p-4 rounded-2xl border flex flex-col items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] ${module.color}`}>
            {module.icon}
            <span className="text-[10px] font-bold uppercase tracking-widest">{module.label}</span>
          </button>
        ))}
      </div>

      {/* Performance & Attendance KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <StatCard 
          icon={Wallet}
          title="Accounts Receivable"
          value="₹ 42.5 L"
          subtext="Pending collections"
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50/50"
        />
        <StatCard 
          icon={Receipt}
          title="Accounts Payable"
          value="₹ 18.2 L"
          subtext="Upcoming payments"
          colorClass="text-rose-600"
          bgClass="bg-rose-50/50"
        />
        <StatCard 
          icon={BarChart3}
          title="Monthly Burn Rate"
          value="₹ 8.4 L"
          subtext="Operational expenses"
          colorClass="text-amber-600"
          bgClass="bg-amber-50/50"
        />
        <StatCard 
          icon={TrendingUp}
          title="Cash on Hand"
          value="₹ 1.12 Cr"
          subtext="Liquid assets"
          colorClass="text-emerald-600"
          bgClass="bg-emerald-500/5"
        />
        <StatCard 
          icon={CalendarCheck}
          title="My Attendance"
          value="98%"
          subtext="Current month average"
          colorClass="text-indigo-600"
          bgClass="bg-indigo-50/50"
        />
        <StatCard 
          icon={Calendar}
          title="Leave Balance"
          value="27"
          subtext="12 CL + 15 PL"
          colorClass="text-amber-600"
          bgClass="bg-amber-50/50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leave Accounting Detail */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Leave Accounting</h3>
            <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
              <Calendar size={20} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Casual Leave (CL)</p>
              <p className="text-2xl font-bold text-slate-800">12 Days</p>
              <p className="text-[10px] text-slate-500 mt-1">Annual entitlement</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Privileged Leave (PL)</p>
              <p className="text-2xl font-bold text-slate-800">15 Days</p>
              <p className="text-[10px] text-slate-500 mt-1">Annual entitlement</p>
            </div>
          </div>
          <div className="mt-6 p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-amber-900">Total Annual Leave</span>
              <span className="text-xl font-black text-amber-600">27 Days</span>
            </div>
          </div>
        </div>

        {/* Revenue vs Expenses Chart */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Financial Performance</h3>
              <p className="text-xs text-slate-400 font-medium">Monthly Revenue vs Expenses</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expenses</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="expenses" stroke="#F43F5E" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Expense Allocation</h3>
              <p className="text-xs text-slate-400 font-medium">Distribution of operational costs</p>
            </div>
            <div className="p-2 bg-rose-50 rounded-xl text-rose-600">
              <BarChart3 size={20} />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-6">
            {expenseBreakdown.map((item) => (
              <div key={item.name} className="flex flex-col items-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-2 h-2 rounded-full mb-1" style={{ backgroundColor: item.color }} />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.name}</span>
                <span className="text-xs font-bold text-slate-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Financial Transactions */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-slate-800">Recent Transactions</h3>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all bg-white"
              >
                <Download size={14} />
                <span>Export</span>
              </button>
              <AnimatePresence>
                {showExportMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50"
                  >
                    <button 
                      onClick={handleExportPDF}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <FileText size={16} className="text-rose-500" />
                      Export as PDF
                    </button>
                    <button 
                      onClick={handleExportExcel}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <FileSpreadsheet size={16} className="text-emerald-500" />
                      Export as Excel
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button className="text-xs font-bold text-emerald-600 uppercase tracking-widest hover:underline">View Ledger</button>
          </div>
        </div>
        <div className="space-y-4">
          {recentTransactions.map((txn, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  txn.amount.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {txn.amount.startsWith('+') ? <TrendingUp size={20} /> : <Receipt size={20} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-800">{txn.id} · {txn.type}</p>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{txn.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{txn.entity} · {txn.amount}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  txn.status === 'Cleared' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {txn.status}
                </span>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BranchAnalyticalCard = ({ branchName, regionName, users }: { branchName?: string, regionName?: string, users: any[] }) => {
  const [activeMetric, setActiveMetric] = useState<'Sales' | 'Operations' | 'Accounts' | 'Branch'>('Operations');

  const branchUsers = users.filter(u => u.branch === branchName);
  
  const analyticsData = [
    { subject: 'Sales Growth', A: 85, fullMark: 100, role: 'Sales' },
    { subject: 'Ops Efficiency', A: 92, fullMark: 100, role: 'Operations' },
    { subject: 'Financial Health', A: 78, fullMark: 100, role: 'Accounts' },
    { subject: 'Compliance', A: 95, fullMark: 100, role: 'Branch' },
    { subject: 'Retention', A: 88, fullMark: 100, role: 'Branch' },
    { subject: 'Asset Utilization', A: 82, fullMark: 100, role: 'Operations' },
  ];

  const metricDetails = {
    Sales: {
      title: 'Sales & Business Development',
      icon: <TrendingUp size={18} />,
      color: 'text-emerald-600',
      bg: 'bg-emerald-500/10',
      stats: [
        { label: 'New Leads', value: '24', trend: '+12%' },
        { label: 'Conversion Rate', value: '18%', trend: '+2%' },
        { label: 'Pipeline Value', value: '₹ 12.5 L', trend: '+5%' }
      ]
    },
    Operations: {
      title: 'Operational Excellence',
      icon: <Activity size={18} />,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      stats: [
        { label: 'Site Audits', value: '42/45', trend: 'On Track' },
        { label: 'Avg Attendance', value: '94%', trend: '+1.5%' },
        { label: 'Incident Rate', value: '0.2%', trend: '-5%' }
      ]
    },
    Accounts: {
      title: 'Financial & Accounts',
      icon: <CreditCard size={18} />,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      stats: [
        { label: 'Billing Efficiency', value: '98%', trend: 'Stable' },
        { label: 'Outstanding (Days)', value: '32', trend: '-4 days' },
        { label: 'Collection %', value: '91%', trend: '+3%' }
      ]
    },
    Branch: {
      title: 'Branch Administration',
      icon: <Building2 size={18} />,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      stats: [
        { label: 'Staff Retention', value: '88%', trend: '+2%' },
        { label: 'Compliance Score', value: '95/100', trend: 'Excellent' },
        { label: 'Asset Health', value: '91%', trend: 'Stable' }
      ]
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Branch Performance Analytics</h3>
          <p className="text-sm text-slate-400 font-medium">Consolidated inputs for {branchName}</p>
        </div>
        <div className="flex gap-1 p-1 bg-slate-50 rounded-xl border border-slate-100">
          {(['Operations', 'Sales', 'Accounts', 'Branch'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setActiveMetric(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeMetric === m 
                  ? 'bg-white text-emerald-600 shadow-sm border border-slate-200' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-center">
        <div className="h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analyticsData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
              <Radar
                name="Performance"
                dataKey="A"
                stroke="#0ea5e9"
                fill="#0ea5e9"
                fillOpacity={0.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-6">
          <div className={`flex items-center gap-3 p-4 rounded-2xl ${metricDetails[activeMetric].bg} border border-slate-100`}>
            <div className={`p-2.5 rounded-xl bg-white shadow-sm ${metricDetails[activeMetric].color}`}>
              {metricDetails[activeMetric].icon}
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-800">{metricDetails[activeMetric].title}</h4>
              <p className="text-xs text-slate-500 font-medium">Real-time input analysis</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {metricDetails[activeMetric].stats.map((stat, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                  <p className="text-base font-bold text-slate-800">{stat.value}</p>
                </div>
                <div className={`px-2 py-0.5 rounded text-xs font-bold ${
                  stat.trend.startsWith('+') || stat.trend.includes('Track') || stat.trend.includes('Excellent')
                    ? 'bg-emerald-50 text-emerald-600' 
                    : stat.trend.startsWith('-') && stat.label.includes('Incident')
                      ? 'bg-emerald-50 text-emerald-600'
                      : stat.trend.includes('Stable')
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : 'bg-amber-50 text-amber-600'
                }`}>
                  {stat.trend}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const BusinessVerticalsCard = ({ userBranch, userRegion }: { userBranch?: string, userRegion?: string }) => {
  const verticalData = [
    { name: 'Man Guarding', value: 45, color: '#1a3a3a', icon: <Shield size={16} /> },
    { name: 'Electronic Security', value: 25, color: '#8B5CF6', icon: <Activity size={16} /> },
    { name: 'Facility Management', value: 20, color: '#10B981', icon: <Building2 size={16} /> },
    { name: 'Others', value: 10, color: '#F59E0B', icon: <MoreVertical size={16} /> },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Business Verticals</h3>
          <p className="text-sm text-slate-400 font-medium">Revenue distribution for {userBranch} ({userRegion})</p>
        </div>
        <div className="p-2 bg-sky-50 rounded-xl text-sky-600">
          <Briefcase size={20} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={verticalData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {verticalData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-3">
          {verticalData.map((item) => (
            <div key={item.name} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{item.name}</p>
                  <p className="text-base font-bold text-slate-800">{item.value}% Contribution</p>
                </div>
              </div>
              <div className="w-2 h-10 rounded-full" style={{ backgroundColor: item.color }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};



const UserManagementCard = ({ users }: { users: any[] }) => {
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedBranch, setSelectedBranch] = useState('All');

  const branchesByRegion: Record<string, string[]> = {
    North: ['Delhi Branch', 'Chandigarh Branch', 'Jaipur Branch'],
    South: ['Chennai Branch', 'Bangalore Branch', 'Hyderabad Branch'],
    East: ['Kolkata Branch', 'Bhubaneswar Branch', 'Patna Branch'],
    West: ['Mumbai Branch', 'Pune Branch', 'Ahmedabad Branch']
  };

  const regions = ['All', ...Object.keys(branchesByRegion)];
  const branches = selectedRegion === 'All' 
    ? ['All', ...Object.values(branchesByRegion).flat()] 
    : ['All', ...branchesByRegion[selectedRegion]];

  const filteredUsers = users.filter(u => {
    const regionMatch = selectedRegion === 'All' || u.region === selectedRegion;
    const branchMatch = selectedBranch === 'All' || u.branch === selectedBranch;
    return regionMatch && branchMatch;
  });

  const handleDownloadExcel = () => {
    const data = filteredUsers.map(u => ({
      ID: u.id,
      Name: u.name,
      Role: u.role,
      Email: u.email,
      Region: u.region,
      Branch: u.branch,
      Status: u.status
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, `Users_Report_${selectedRegion}_${selectedBranch}.xlsx`);
  };

  const handleDownloadPDF = () => {
    const columns = ["ID", "Name", "Role", "Email", "Region", "Branch", "Status"];
    const data = filteredUsers.map(u => [u.id, u.name, u.role, u.email, u.region, u.branch, u.status]);
    exportToPDF(`User Management Report - ${selectedRegion} / ${selectedBranch}`, columns, data, `Users_Report_${selectedRegion}_${selectedBranch}.pdf`);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm lg:col-span-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">User Management</h3>
          <p className="text-xs text-slate-400 font-medium">Region & Branch wise oversight</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <Filter size={14} className="text-slate-400" />
            <select 
              value={selectedRegion}
              onChange={(e) => { setSelectedRegion(e.target.value); setSelectedBranch('All'); }}
              className="bg-transparent text-xs font-bold text-slate-600 outline-none"
            >
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <MapPin size={14} className="text-slate-400" />
            <select 
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-600 outline-none"
            >
              {branches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDownloadExcel}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-all border border-emerald-100"
            >
              <FileSpreadsheet size={14} />
              Excel
            </button>
            <button 
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 transition-all border border-rose-100"
            >
              <FileText size={14} />
              PDF
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User</th>
              <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</th>
              <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Region</th>
              <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Branch</th>
              <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">{u.name}</p>
                      <p className="text-[10px] text-slate-400">{u.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">{u.role}</span>
                </td>
                <td className="py-4 text-xs text-slate-500 font-medium">{u.region}</td>
                <td className="py-4 text-xs text-slate-500 font-medium">{u.branch}</td>
                <td className="py-4 text-right">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${u.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                    {u.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};



const ManagementDashboard = ({ 
  tasks, 
  setTasks, 
  userName,
  users,
  userBranch,
  payments
}: { 
  tasks: any[], 
  setTasks: React.Dispatch<React.SetStateAction<any[]>>,
  userName?: string,
  users: any[],
  userBranch?: string,
  payments: any[]
}) => {
  const branches = [
    { id: 'B001', name: 'Ahmedabad Branch', region: 'West' },
    { id: 'B002', name: 'Kolkata Branch', region: 'East' },
    { id: 'B003', name: 'Delhi Branch', region: 'North' },
    { id: 'B004', name: 'Mumbai Branch', region: 'West' },
  ];
  
  const currentBranch = branches.find(b => b.name === userBranch) || branches[0];
  const currentRegion = currentBranch.region;
  const regionBranches = branches.filter(b => b.region === currentRegion);

  // Workforce Bifurcation for current branch
  const branchUsers = users.filter(u => u.branch === userBranch);
  const roleBifurcation = branchUsers.reduce((acc: any, user: any) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const workforceBreakup = Object.entries(roleBifurcation).map(([role, count], index) => ({
    label: role,
    value: count as number,
    color: ['#0EA5E9', '#8B5CF6', '#10B981', '#F59E0B'][index % 4],
    bg: ['bg-sky-50', 'bg-violet-50', 'bg-emerald-50', 'bg-amber-50'][index % 4]
  }));

  const revenueData = [
    { name: currentRegion, value: 510000, color: '#F59E0B' },
  ];

  const assetData = [
    { name: `IT Assets (${currentRegion})`, value: 1200000, color: '#0EA5E9' },
    { name: `Fixed Assets (${currentRegion})`, value: 4500000, color: '#10B981' },
    { name: `Vehicles (${currentRegion})`, value: 2300000, color: '#F59E0B' },
  ];

  // Payment Collection logic
  const branchPayments = payments.filter(p => p.branch === userBranch);
  const totalBranchCollection = branchPayments.reduce((acc, p) => {
    const amount = parseInt(p.amount.replace(/[^0-9]/g, ''));
    return acc + amount;
  }, 0);

  const regionBranchNames = regionBranches.map(b => b.name);
  const regionPayments = payments.filter(p => regionBranchNames.includes(p.branch));
  const totalRegionCollection = regionPayments.reduce((acc, p) => {
    const amount = parseInt(p.amount.replace(/[^0-9]/g, ''));
    return acc + amount;
  }, 0);

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹ ${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹ ${(val / 100000).toFixed(2)} L`;
    return `₹ ${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-8">
      {/* Management KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          icon={TrendingUp}
          title="Annual Revenue"
          value="₹ 45.0 L"
          subtext={`${userBranch}`}
          colorClass="text-emerald-600"
          bgClass="bg-emerald-500/10"
          breakup={[
            { label: 'This Branch', value: 45, color: '#10B981', bg: 'bg-emerald-500/10' },
            { label: `${currentRegion} Region`, value: 100, color: '#64748b', bg: 'bg-slate-50' }
          ]}
        />
        <StatCard 
          icon={Package}
          title="Asset Valuation"
          value="₹ 12.5 L"
          subtext={`${userBranch}`}
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50/50"
          breakup={[
            { label: 'This Branch', value: 30, color: '#10B981', bg: 'bg-emerald-50' },
            { label: `${currentRegion} Region`, value: 100, color: '#64748b', bg: 'bg-slate-50' }
          ]}
        />
        <StatCard 
          icon={Building2}
          title="Regional Branches"
          value={regionBranches.length.toString()}
          subtext={`In ${currentRegion} Region`}
          colorClass="text-amber-600"
          bgClass="bg-amber-50/50"
          breakup={regionBranches.map((b, i) => ({
            label: b.name.split(' ')[0],
            value: 1,
            color: '#F59E0B',
            bg: 'bg-amber-50'
          }))}
        />
        <StatCard 
          icon={Users}
          title="Branch Workforce"
          value={branchUsers.length.toString()}
          subtext={`Role bifurcation for ${userBranch}`}
          colorClass="text-emerald-600"
          breakup={workforceBreakup}
        />
        <StatCard 
          icon={Wallet}
          title="Payment Collection"
          value={formatCurrency(totalBranchCollection)}
          subtext={`${userBranch} Collection`}
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50/50"
          breakup={[
            { label: 'Branch', value: totalBranchCollection, color: '#10B981', bg: 'bg-emerald-50' },
            { label: `${currentRegion} Region`, value: totalRegionCollection, color: '#64748b', bg: 'bg-slate-50' }
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Distribution */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Revenue: {currentRegion}</h3>
              <p className="text-xs text-slate-400 font-medium">Regional performance analysis</p>
            </div>
            <div className="p-2 bg-sky-50 rounded-xl text-sky-600">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 gap-4 mt-6">
            {revenueData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold text-slate-600">{item.name} Region</span>
                </div>
                <span className="text-xs font-bold text-slate-800">₹ {(item.value / 100000).toFixed(1)} L</span>
              </div>
            ))}
          </div>
        </div>

        {/* Asset Distribution */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Asset Valuation: {currentRegion}</h3>
              <p className="text-xs text-slate-400 font-medium">Regional resource value</p>
            </div>
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
              <Package size={20} />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {assetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 gap-3 mt-6">
            {assetData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold text-slate-600">{item.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Valuation</span>
                  <span className="text-xs font-bold text-slate-800">₹ {(item.value / 100000).toFixed(1)} L</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Business Verticals & Branch Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <BusinessVerticalsCard userBranch={userBranch} userRegion={currentRegion} />
        <BranchAnalyticalCard branchName={userBranch} regionName={currentRegion} users={users} />
      </div>

      <div className="grid grid-cols-1 gap-8">
        <TaskManagement 
          tasks={tasks}
          setTasks={setTasks}
          userName={userName}
          users={users}
          userBranch={userBranch}
          role="Management"
        />
      </div>
    </div>
  );
};

const RegionalView = ({ userRole, userRegion, allRegionalData, setAllRegionalData }: { userRole?: string, userRegion?: string, allRegionalData: any[], setAllRegionalData: React.Dispatch<React.SetStateAction<any[]>> }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRegion, setNewRegion] = useState({ Region: '', "Active Branches": 0, "Avg Efficiency": '0%', "Pending Audits": 0 });

  const filteredData = userRole === 'Management' && userRegion 
    ? allRegionalData.filter(d => d.Region.toLowerCase() === userRegion.toLowerCase())
    : allRegionalData;

  const handleExportPDF = () => {
    const columns = ["Region", "Active Branches", "Avg Efficiency", "Pending Audits"];
    const data = filteredData.map(d => [d.Region, d["Active Branches"].toString(), d["Avg Efficiency"], d["Pending Audits"].toString()]);
    exportToPDF("Regional Data Report", columns, data, "regional_data");
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    exportToExcel(filteredData, "regional_data");
    setShowExportMenu(false);
  };

  const handleAddRegion = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRegion.Region) {
      setAllRegionalData(prev => [...prev, { ...newRegion, "Avg Efficiency": newRegion["Avg Efficiency"] + '%' }]);
      setNewRegion({ Region: '', "Active Branches": 0, "Avg Efficiency": '0%', "Pending Audits": 0 });
      setShowAddModal(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Regional Overview</h2>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-widest">Global Node Distribution & Regional Performance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <Download size={16} />
              Export Regional Data
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-10">
                <button onClick={handleExportPDF} className="w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-emerald-50 hover:text-emerald-600">Export as PDF</button>
                <button onClick={handleExportExcel} className="w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-emerald-50 hover:text-emerald-600">Export as Excel</button>
              </div>
            )}
          </div>
          {userRole !== 'Management' && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 shadow-md shadow-emerald-500/20 transition-all rounded-xl"
            >
              Add New Region
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RegionalPresenceCard userRole={userRole} userRegion={userRegion} regionalData={allRegionalData} />
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Regional KPIs</h3>
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Active Branches</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {filteredData.reduce((acc, curr) => acc + curr["Active Branches"], 0)}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Avg. Efficiency</p>
                <p className="text-2xl font-bold text-emerald-700">
                  {filteredData.length > 0 
                    ? (filteredData.reduce((acc, curr) => acc + parseFloat(curr["Avg Efficiency"]), 0) / filteredData.length).toFixed(1) + '%'
                    : '0%'}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Pending Audits</p>
                <p className="text-2xl font-bold text-amber-700">
                  {filteredData.reduce((acc, curr) => acc + curr["Pending Audits"], 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Regional Leads</h3>
            <div className="space-y-4">
              {[
                { name: 'Amit Sharma', region: 'East', role: 'Regional Director' },
                { name: 'Priya Patel', region: 'West', role: 'Regional Manager' },
                { name: 'Rahul Verma', region: 'North', role: 'Regional Head' },
              ].filter(lead => userRole !== 'Management' || !userRegion || lead.region.toLowerCase() === userRegion.toLowerCase()).map((lead, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 font-bold">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{lead.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">{lead.region} · {lead.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Region Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800">Add New Region</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white rounded-xl text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddRegion} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Region Name</label>
                <input 
                  type="text" 
                  required
                  value={newRegion.Region}
                  onChange={(e) => setNewRegion({...newRegion, Region: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-semibold text-slate-700"
                  placeholder="e.g. South Region"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Active Branches</label>
                  <input 
                    type="number" 
                    required
                    value={newRegion["Active Branches"]}
                    onChange={(e) => setNewRegion({...newRegion, "Active Branches": parseInt(e.target.value)})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Efficiency (%)</label>
                  <input 
                    type="number" 
                    required
                    value={newRegion["Avg Efficiency"].replace('%', '')}
                    onChange={(e) => setNewRegion({...newRegion, "Avg Efficiency": e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-semibold text-slate-700"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Pending Audits</label>
                <input 
                  type="number" 
                  required
                  value={newRegion["Pending Audits"]}
                  onChange={(e) => setNewRegion({...newRegion, "Pending Audits": parseInt(e.target.value)})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-semibold text-slate-700"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-xl bg-emerald-500 text-white text-[10px] font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/10 transition-all uppercase tracking-widest"
                >
                  Create Region
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const RegionalPresenceCard = ({ userRole, userRegion, regionalData }: { userRole?: string, userRegion?: string, regionalData: any[] }) => {
  const allData = regionalData.map((d, i) => ({
    name: d.Region + ' Region',
    value: d["Active Branches"],
    color: i === 0 ? '#10B981' : i === 1 ? '#F59E0B' : i === 2 ? '#10B981' : `hsl(${i * 137.5}, 70%, 50%)`
  }));

  const data = userRole === 'Management' && userRegion
    ? allData.filter(d => d.name.toLowerCase().includes(userRegion.toLowerCase()))
    : allData;

  const totalNodes = regionalData.reduce((acc, curr) => acc + curr["Active Branches"], 0);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm relative overflow-hidden">
      <div className="flex items-start gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
          <Globe size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            Regional Presence
          </h3>
          <p className="text-xs text-slate-400 font-medium">Zone-wise Distribution & Node Identity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left: Donut Chart */}
        <div className="relative h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={15}
                dataKey="value"
                startAngle={180}
                endAngle={-180}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-4xl font-bold text-slate-800">{totalNodes}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Nodes</span>
          </div>
        </div>

        {/* Right: Regional Ledger */}
        <div className="space-y-6 max-h-64 overflow-y-auto pr-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 sticky top-0 bg-white z-10">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Regional Ledger</h4>
          </div>

          <div className="space-y-6">
            {regionalData.map((region, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: allData[idx]?.color }} />
                    <span className="text-sm font-bold text-slate-700">{region.Region} Region</span>
                  </div>
                  <span className="text-[10px] font-bold bg-sky-50 text-sky-600 px-2 py-0.5 rounded uppercase">{region["Active Branches"]} Nodes</span>
                </div>
                <div className="pl-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <ChevronRight size={12} className="text-slate-300" />
                    <span>{region.Region} ESS</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <ChevronRight size={12} className="text-slate-300" />
                    <span>{region.Region} Regional Office</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const UserManagement = ({ 
  userRole, 
  userBranches, 
  userName,
  users,
  setUsers
}: { 
  userRole?: string; 
  userBranches?: string[]; 
  userName?: string;
  users: any[];
  setUsers: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    email: '',
    role: '',
    status: 'Active',
    password: '',
    securityKey: '',
    vertical: 'Security Services',
    branches: ['Head Office'] as string[],
    region: 'North',
    reportingManager: ''
  });

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setIsEditing(true);
    setFormData({
      name: user.name,
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      password: '',
      securityKey: '',
      vertical: user.vertical || 'Security Services',
      branches: user.branches || ['Head Office'],
      region: user.region || 'North',
      reportingManager: user.reportingManager || ''
    });
    setShowAddModal(true);
  };

  const handleDeleteUser = (id: string) => {
    setUserToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      setUsers(users.filter(u => u.id !== userToDelete));
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
    } else {
      const newUser = {
        ...formData,
        lastLogin: 'Never'
      };
      setUsers([...users, newUser]);
    }
    setShowAddModal(false);
    setIsEditing(false);
    setEditingUser(null);
    setFormData({
      name: '',
      id: '',
      email: '',
      role: '',
      status: 'Active',
      password: '',
      securityKey: '',
      vertical: 'Security Services',
      branches: ['Head Office'],
      region: 'North',
      reportingManager: ''
    });
  };

  const handleExportPDF = () => {
    const columns = ["ID", "Name", "Role", "Email", "Status", "Last Login"];
    const data = users.map(u => [u.id, u.name, u.role, u.email, u.status, u.lastLogin]);
    exportToPDF("User Management Report", columns, data, "user_report");
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    const data = users.map(u => ({
      "ID": u.id,
      "Name": u.name,
      "Role": u.role,
      "Email": u.email,
      "Status": u.status,
      "Last Login": u.lastLogin
    }));
    exportToExcel(data, "user_report");
    setShowExportMenu(false);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (userRole === 'Branch' || userRole === 'Management') {
      // Branch and Management roles only see users who report to them
      return matchesSearch && user.reportingManager === userName;
    }
    
    return matchesSearch;
  });

  const availableBranches = ['Head Office', 'Mumbai Branch', 'Delhi Branch', 'Kolkata Branch', 'Hyderabad Branch', 'Bangalore Branch', 'Chennai Branch', 'Pune Branch'];

  const toggleBranch = (branch: string) => {
    setFormData(prev => {
      const branches = prev.branches.includes(branch)
        ? prev.branches.filter(b => b !== branch)
        : [...prev.branches, branch];
      return { ...prev, branches };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-800">User Management</h2>
          <p className="text-sm text-zinc-500 font-medium">Manage system access and user profiles</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-bold text-zinc-600 hover:bg-zinc-50 transition-all uppercase tracking-widest"
            >
              <Download size={16} />
              <span>Export Report</span>
              <ChevronRight size={14} className={`text-zinc-400 transition-transform ${showExportMenu ? 'rotate-90' : ''}`} />
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-zinc-100 py-2 z-10">
                <button onClick={handleExportPDF} className="w-full text-left px-4 py-2 text-[10px] font-bold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 uppercase tracking-widest">Export as PDF</button>
                <button onClick={handleExportExcel} className="w-full text-left px-4 py-2 text-[10px] font-bold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 uppercase tracking-widest">Export as Excel</button>
              </div>
            )}
          </div>
          {(userRole !== 'Branch' && userRole !== 'Management') && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white text-[10px] font-bold hover:bg-emerald-600 shadow-md shadow-emerald-500/10 transition-all uppercase tracking-widest"
            >
              <Plus size={16} />
              <span>{userRole === 'IT' ? 'Assign Credentials' : 'Register User'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, ID or email..." 
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-100 bg-zinc-50/50 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-100 text-[10px] font-bold text-zinc-600 hover:bg-zinc-50 uppercase tracking-widest">
            <Filter size={16} />
            <span>Role: All</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-100 text-[10px] font-bold text-zinc-600 hover:bg-zinc-50 uppercase tracking-widest">
            <span>Status: All</span>
          </button>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100">
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">User Details</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Last Login</th>
                {(userRole !== 'Branch' && userRole !== 'Management') && <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 font-bold text-xs border border-zinc-200">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-zinc-800">{user.name}</div>
                        <div className="text-xs text-zinc-500 font-medium">{user.id} • {user.email}</div>
                        <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">
                          Branches: {user.branches?.join(', ') || user.branch}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-lg bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                      <span className={`text-xs font-bold uppercase tracking-widest ${user.status === 'Active' ? 'text-emerald-600' : 'text-zinc-500'}`}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                    {user.lastLogin}
                  </td>
                  {(userRole !== 'Branch' && userRole !== 'Management') && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {(userRole === 'Master' || userRole === 'IT') && (
                          <button 
                            onClick={() => handleEditUser(user)}
                            className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-zinc-400 hover:text-zinc-900 transition-all border border-transparent hover:border-zinc-100"
                            title={userRole === 'IT' ? "Assign Mail & Password" : "Edit User"}
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        {userRole === 'Master' && (
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-zinc-400 hover:text-rose-600 transition-all border border-transparent hover:border-zinc-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-zinc-50/30 border-t border-zinc-100 flex justify-between items-center">
          <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Showing {filteredUsers.length} of {users.length} users</span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-zinc-200 text-[10px] font-bold text-zinc-400 cursor-not-allowed uppercase tracking-widest">Prev</button>
            <button className="px-3 py-1.5 rounded-lg border border-zinc-200 text-[10px] font-bold text-zinc-600 hover:bg-white uppercase tracking-widest">Next</button>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 overflow-y-auto bg-zinc-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 my-4 md:my-auto"
            >
              <div className="p-5 md:p-8">
                <div className="flex justify-between items-center mb-6 md:mb-8">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-zinc-800">
                      {userRole === 'IT' ? 'Mail & Password Allocation' : (isEditing ? 'Edit User' : 'Register New User')}
                    </h3>
                    <p className="text-xs md:text-sm text-zinc-500 font-medium">
                      {userRole === 'IT' ? 'Assign official mail ID and system credentials' : (isEditing ? 'Update user profile and access' : 'Create a new system access profile')}
                    </p>
                  </div>
                  <button 
                    onClick={() => { setShowAddModal(false); setIsEditing(false); setEditingUser(null); }}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-zinc-600 transition-all border border-zinc-100"
                  >
                    <Plus size={20} className="rotate-45" />
                  </button>
                </div>

                <form className="space-y-4 md:space-y-6" onSubmit={handleSaveUser}>
                  {/* Row 1: Mail & Password */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 ml-1">
                        <Mail size={16} className="text-zinc-400" />
                        <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Official Mail ID</label>
                      </div>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium transition-all" 
                        placeholder="email@ciss-services.com" 
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 ml-1">
                        <Lock size={16} className="text-zinc-400" />
                        <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Email Password</label>
                      </div>
                      <input 
                        type="password" 
                        required={!isEditing}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium transition-all" 
                        placeholder={isEditing ? "Leave blank to keep current" : "••••••"} 
                      />
                    </div>
                  </div>

                  {/* Row 2: Security Key */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 ml-1">
                      <Key size={16} className="text-zinc-400" />
                      <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Security Key (CISS RMS Portal Access)</label>
                    </div>
                    <input 
                      type="password" 
                      required={!isEditing && userRole !== 'IT'}
                      disabled={userRole === 'IT'}
                      value={formData.securityKey}
                      onChange={(e) => setFormData({...formData, securityKey: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium transition-all ${userRole === 'IT' ? 'bg-zinc-100 cursor-not-allowed' : 'bg-zinc-50/50'}`} 
                      placeholder={isEditing ? "Leave blank to keep current" : "••••••"} 
                    />
                  </div>

                  {/* Row 3: Name & ID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 ml-1">
                        <User size={16} className="text-zinc-400" />
                        <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">User Name</label>
                      </div>
                      {userRole === 'IT' ? (
                        <div className="relative">
                          <select 
                            required
                            value={formData.id}
                            onChange={(e) => {
                              const selectedUser = users.find(u => u.id === e.target.value);
                              if (selectedUser) {
                                setEditingUser(selectedUser);
                                setIsEditing(true);
                                setFormData({
                                  ...formData,
                                  name: selectedUser.name,
                                  id: selectedUser.id,
                                  email: selectedUser.email || '',
                                  role: selectedUser.role,
                                  vertical: selectedUser.vertical || 'Security Services',
                                  branch: selectedUser.branch || 'Head Office',
                                  region: selectedUser.region || 'North',
                                  reportingManager: selectedUser.reportingManager || ''
                                });
                              }
                            }}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium appearance-none transition-all"
                          >
                            <option value="" disabled>Select User</option>
                            {users.map(u => (
                              <option key={u.id} value={u.id}>{u.name} ({u.id})</option>
                            ))}
                          </select>
                          <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 rotate-90 pointer-events-none" />
                        </div>
                      ) : (
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 focus:border-zinc-500 text-sm font-medium transition-all" 
                          placeholder="John Doe" 
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 ml-1">
                        <UserCircle size={16} className="text-zinc-400" />
                        <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">User ID</label>
                      </div>
                      <input 
                        type="text" 
                        required
                        disabled={isEditing || userRole === 'IT'}
                        value={formData.id}
                        onChange={(e) => setFormData({...formData, id: e.target.value})}
                        className={`w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 focus:border-zinc-500 text-sm font-medium transition-all ${(isEditing || userRole === 'IT') ? 'bg-zinc-100 cursor-not-allowed' : 'bg-zinc-50/50'}`} 
                        placeholder="EMP001" 
                      />
                    </div>
                  </div>

                  {/* Row 4: Role & Vertical */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 ml-1">
                        <Shield size={16} className="text-zinc-400" />
                        <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">User Role</label>
                      </div>
                      <div className="relative">
                        <select 
                          required
                          disabled={userRole === 'IT'}
                          value={formData.role}
                          onChange={(e) => setFormData({...formData, role: e.target.value})}
                          className={`w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium appearance-none transition-all ${userRole === 'IT' ? 'bg-zinc-100 cursor-not-allowed' : 'bg-zinc-50/50'}`}
                        >
                          <option value="" disabled>Select Role</option>
                          <option value="Master">Master</option>
                          <option value="HR">HR</option>
                          <option value="Accounts">Accounts</option>
                          <option value="Operations">Operations</option>
                          <option value="Sales">Sales</option>
                          <option value="Branch">Branch</option>
                          <option value="IT">IT</option>
                        </select>
                        <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 rotate-90 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 ml-1">
                        <Briefcase size={16} className="text-zinc-400" />
                        <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Business Vertical</label>
                      </div>
                      <div className="relative">
                        <select 
                          required
                          disabled={userRole === 'IT'}
                          value={formData.vertical}
                          onChange={(e) => setFormData({...formData, vertical: e.target.value})}
                          className={`w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium appearance-none transition-all ${userRole === 'IT' ? 'bg-zinc-100 cursor-not-allowed' : 'bg-zinc-50/50'}`}
                        >
                          <option value="" disabled>Select Vertical</option>
                          <option value="Security Services">Security Services</option>
                          <option value="Facility Management">Facility Management</option>
                          <option value="Cash Logistics">Cash Logistics</option>
                        </select>
                        <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 rotate-90 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Row 5: Date & Branch */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 ml-1">
                        <Calendar size={16} className="text-zinc-400" />
                        <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Registration Date</label>
                      </div>
                      <div className="relative">
                        <input 
                          type="text" 
                          disabled
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-500 text-sm font-medium transition-all cursor-not-allowed" 
                          value={isEditing ? (editingUser.registrationDate || "March 19th, 2026") : "March 19th, 2026"}
                        />
                        <Calendar size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 ml-1">
                        <Building2 size={16} className="text-zinc-400" />
                        <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Branch Selection (Multi-select)</label>
                      </div>
                      <div className="grid grid-cols-2 gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-200 max-h-40 overflow-y-auto">
                        {availableBranches.map(branch => (
                          <label key={branch} className="flex items-center gap-2 cursor-pointer group">
                            <input 
                              type="checkbox"
                              checked={formData.branches.includes(branch)}
                              onChange={() => toggleBranch(branch)}
                              className="w-4 h-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500/20"
                            />
                            <span className="text-xs font-medium text-zinc-600 group-hover:text-zinc-900 transition-colors">{branch}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Row 6: Region & Manager */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 ml-1">
                        <MapPin size={16} className="text-zinc-400" />
                        <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Region</label>
                      </div>
                      <div className="relative">
                        <select 
                          required
                          value={formData.region}
                          onChange={(e) => setFormData({...formData, region: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 focus:border-zinc-500 text-sm font-medium appearance-none transition-all"
                        >
                          <option value="" disabled>Select Region</option>
                          <option value="North">North</option>
                          <option value="South">South</option>
                          <option value="East">East</option>
                          <option value="West">West</option>
                        </select>
                        <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 rotate-90 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 ml-1">
                        <User size={16} className="text-zinc-400" />
                        <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Reporting Manager</label>
                      </div>
                      <div className="relative">
                        <select 
                          required
                          value={formData.reportingManager}
                          onChange={(e) => setFormData({...formData, reportingManager: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 focus:border-zinc-500 text-sm font-medium appearance-none transition-all"
                        >
                          <option value="">N/A (Not Applicable)</option>
                          <option value="Amit Sharma">Amit Sharma</option>
                          <option value="Priya Patel">Priya Patel</option>
                        </select>
                        <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 rotate-90 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Row 7: Status */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 ml-1">
                      <Activity size={16} className="text-zinc-400" />
                      <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Account Status</label>
                    </div>
                    <div className="flex items-center gap-4 p-1 bg-zinc-50 rounded-xl w-fit border border-zinc-100">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, status: 'Active'})}
                        className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${formData.status === 'Active' ? 'bg-white text-emerald-600 shadow-sm border border-zinc-100' : 'text-zinc-400 hover:text-zinc-600'}`}
                      >
                        Active
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, status: 'Inactive'})}
                        className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${formData.status === 'Inactive' ? 'bg-white text-rose-600 shadow-sm border border-zinc-100' : 'text-zinc-400 hover:text-zinc-600'}`}
                      >
                        Inactive
                      </button>
                    </div>
                  </div>

                  <div className="pt-6 md:pt-8 border-t border-zinc-100 flex flex-col sm:flex-row justify-end gap-3 md:gap-4">
                    <button 
                      type="button"
                      onClick={() => { setShowAddModal(false); setIsEditing(false); setEditingUser(null); }}
                      className="w-full sm:w-auto px-8 py-3 rounded-xl border border-zinc-200 text-[10px] font-bold text-zinc-600 hover:bg-zinc-50 transition-all uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2 rounded-xl bg-emerald-500 text-white text-[10px] font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/10 transition-all active:scale-[0.98] uppercase tracking-widest"
                    >
                      {isEditing ? 'Update Profile' : 'Register User'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-8 text-center border border-zinc-200"
            >
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-6">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-zinc-800 mb-2">Delete User?</h3>
              <p className="text-sm text-zinc-500 font-medium mb-8">This action cannot be undone. The user will lose all system access immediately.</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 rounded-xl border border-zinc-200 text-[10px] font-bold text-zinc-600 hover:bg-zinc-50 transition-all uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDeleteUser}
                  className="flex-1 py-3 rounded-xl bg-rose-600 text-white text-[10px] font-bold hover:bg-rose-700 shadow-lg shadow-rose-100 transition-all active:scale-[0.98] uppercase tracking-widest"
                >
                  Delete User
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AssetManagement = ({ 
  assets, 
  setAssets, 
  userRole, 
  userName, 
  users 
}: { 
  assets: any[], 
  setAssets: React.Dispatch<React.SetStateAction<any[]>>,
  userRole?: string,
  userName?: string,
  users: any[]
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  
  const reportees = users.filter(u => u.reportingManager === userName);
  const selectedAsset = assets.find(a => a.id === selectedAssetId);

  const filteredAssets = userRole === 'IT' 
    ? assets.filter(a => a.category === 'IT' && (searchTerm === '' || a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.id.toLowerCase().includes(searchTerm.toLowerCase())))
    : userRole === 'Management'
      ? assets.filter(a => a.category !== 'IT' && (searchTerm === '' || a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.id.toLowerCase().includes(searchTerm.toLowerCase())))
      : assets.filter(a => searchTerm === '' || a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.id.toLowerCase().includes(searchTerm.toLowerCase()));
  
  const handleExportPDF = () => {
    const columns = ["Asset ID", "Asset Name", "Category", "Issued To", "Valuation (Rs.)"];
    const data = assets.map(asset => [asset.id, asset.name, asset.category, asset.issuedTo, asset.valuation]);
    exportToPDF("Asset Inventory Report", columns, data, "asset_inventory");
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    const data = assets.map(asset => ({
      "Asset ID": asset.id,
      "Asset Name": asset.name,
      "Category": asset.category,
      "Issued To": asset.issuedTo,
      "Valuation (Rs.)": asset.valuation
    }));
    exportToExcel(data, "asset_inventory");
    setShowExportMenu(false);
  };

  if (isRegistering) {
    if (userRole === 'IT') {
      return (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Asset Allocation Form</h2>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-widest">Register asset issue form</p>
            </div>
            <button 
              onClick={() => {
                setIsRegistering(false);
                setSelectedAssetId('');
              }}
              className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
          </div>

          <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 p-5 md:p-8 shadow-sm max-w-2xl">
            <form className="space-y-4 md:space-y-6" onSubmit={(e) => { 
              e.preventDefault(); 
              const formData = new FormData(e.currentTarget);
              const assetId = formData.get('assetId') as string;
              const userId = formData.get('issuedTo') as string;
              const user = users.find(u => u.id === userId);
              const issuedTo = user ? user.name : '';
              
              setAssets(assets.map(a => a.id === assetId ? { ...a, issuedTo } : a));
              setIsRegistering(false); 
              setSelectedAssetId('');
              setSelectedUserId('');
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Asset Name</label>
                  <select 
                    name="assetName" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm bg-white" 
                    required
                    onChange={(e) => {
                      const asset = assets.find(a => a.name === e.target.value && a.category === 'IT');
                      if (asset) setSelectedAssetId(asset.id);
                      else setSelectedAssetId('');
                    }}
                  >
                    <option value="">Select Asset</option>
                    {assets.filter(a => a.category === 'IT').map(asset => (
                      <option key={asset.id} value={asset.name}>{asset.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Asset ID</label>
                  <input 
                    type="text" 
                    name="assetId"
                    value={selectedAssetId} 
                    readOnly 
                    placeholder="Auto-selected"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm focus:outline-none" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Issued To</label>
                  <select 
                    name="issuedTo" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm bg-white" 
                    required
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                  >
                    <option value="">Select User</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.name} ({user.id})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Branch Name</label>
                  <input 
                    type="text" 
                    name="branchName"
                    value={users.find(u => u.id === selectedUserId)?.branch || ''} 
                    readOnly 
                    placeholder="Auto-selected"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm focus:outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Quantity</label>
                  <input type="number" name="qty" defaultValue="1" min="1" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Date of Issue</label>
                  <input type="date" name="dateOfIssue" defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm" required />
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <button type="submit" className="px-6 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 shadow-md shadow-emerald-500/10 transition-all flex items-center justify-center gap-2">
                  <Package size={16} />
                  <span>Issue Asset</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{userRole === 'Branch' ? 'Assign asset' : 'Register New Asset'}</h2>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-widest">{userRole === 'Branch' ? 'Assign an asset to a reportee' : 'Onboard a new physical or digital asset'}</p>
          </div>
          <button 
            onClick={() => setIsRegistering(false)}
            className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
        </div>

        <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 p-5 md:p-8 shadow-sm max-w-2xl">
          <form className="space-y-4 md:space-y-6" onSubmit={(e) => { 
            e.preventDefault(); 
            const formData = new FormData(e.currentTarget);
            const name = formData.get('assetName') as string;
            const category = formData.get('category') as string;
            const id = formData.get('assetId') as string;
            const valuation = formData.get('valuation') as string;
            const issuedTo = formData.get('issuedTo') as string || 'Unassigned';
            
            const newAsset = {
              id,
              name,
              category,
              issuedTo,
              valuation: parseInt(valuation).toLocaleString(),
              branch: users.find(u => u.name === userName)?.branch || 'Head Office'
            };
            
            setAssets([...assets, newAsset]);
            setIsRegistering(false); 
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Asset Name</label>
                <input type="text" name="assetName" placeholder="e.g. MacBook Pro 14\" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm" required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
                <select name="category" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm bg-white" required>
                  <option value="">Select Category</option>
                  {userRole !== 'Branch' && <option value="IT">IT Equipment</option>}
                  <option value="FIXED">Fixed Asset</option>
                  <option value="VEHICLE">Vehicle</option>
                  <option value="FURNITURE">Furniture</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Asset ID / Serial</label>
                <input type="text" name="assetId" placeholder="e.g. SN-123456" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm" required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Valuation (INR)</label>
                <input type="number" name="valuation" placeholder="e.g. 50000" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm" required />
              </div>
              {userRole === 'Branch' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Assign To (Reportees)</label>
                  <select name="issuedTo" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm bg-white">
                    <option value="">Select User (Optional)</option>
                    {reportees.map(user => (
                      <option key={user.id} value={user.name}>{user.name} ({user.role})</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Description & Specifications</label>
              <textarea placeholder="Enter technical specs or asset description..." rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm" required></textarea>
            </div>
            <div className="pt-4">
              <button type="submit" className={`${userRole === 'Branch' ? 'px-6 py-2 rounded-xl w-auto ml-auto' : 'w-full py-2.5 rounded-xl'} bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/10 transition-all flex items-center justify-center gap-2`}>
                <Package size={userRole === 'Branch' ? 16 : 18} />
                <span>{userRole === 'Branch' ? 'Issue asset' : 'Register Asset in System'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (isAssigning) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Assign Asset</h2>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-widest">Assign an existing asset to a reportee</p>
          </div>
          <button 
            onClick={() => {
              setSelectedAssetId('');
              setIsAssigning(false);
            }}
            className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
        </div>

        <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 p-5 md:p-8 shadow-sm max-w-2xl">
          <form className="space-y-4 md:space-y-6" onSubmit={(e) => { 
            e.preventDefault(); 
            const formData = new FormData(e.currentTarget);
            const assetId = formData.get('assetId') as string;
            const issuedTo = formData.get('issuedTo') as string;
            
            setAssets(assets.map(a => a.id === assetId ? { ...a, issuedTo } : a));
            setSelectedAssetId('');
            setIsAssigning(false); 
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Select Asset</label>
                <select 
                  name="assetId" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm bg-white" 
                  required
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                >
                  <option value="">Select Asset</option>
                  {assets.filter(a => userRole === 'Management' ? a.category !== 'IT' : true).map(asset => (
                    <option key={asset.id} value={asset.id}>{asset.name} ({asset.id})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Asset ID</label>
                <input 
                  type="text" 
                  value={selectedAssetId} 
                  readOnly 
                  placeholder="Asset ID"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm focus:outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Asset Type</label>
                <input 
                  type="text" 
                  value={selectedAsset?.category || ''} 
                  readOnly 
                  placeholder="Asset Type"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm focus:outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Quantity</label>
                <input 
                  type="number" 
                  name="quantity"
                  defaultValue="1"
                  min="1"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Date of Issue</label>
                <input 
                  type="date" 
                  name="issueDate"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Assign To (Reportees)</label>
                <select name="issuedTo" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm bg-white" required>
                  <option value="">Select User</option>
                  {reportees.map(user => (
                    <option key={user.id} value={user.name}>{user.name} ({user.role})</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <button type="submit" className="px-6 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 shadow-md shadow-emerald-500/10 transition-all flex items-center justify-center gap-2">
                <UserPlus size={18} />
                <span>Assign Asset</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, ID, type, or user..." 
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
            >
              <Download size={16} />
              <span>Export Assets</span>
              <ChevronRight size={14} className={`text-slate-400 transition-transform ${showExportMenu ? 'rotate-90' : ''}`} />
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-10">
                <button onClick={handleExportPDF} className="w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-emerald-50 hover:text-emerald-600">Export as PDF</button>
                <button onClick={handleExportExcel} className="w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-emerald-50 hover:text-emerald-600">Export as Excel</button>
              </div>
            )}
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
            <Filter size={16} />
            <span>Category</span>
          </button>
          {userRole === 'Management' ? (
            <button 
              onClick={() => {
                setSelectedAssetId('');
                setIsAssigning(true);
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 shadow-md shadow-emerald-100 transition-all"
            >
              <UserPlus size={16} />
              <span>Assign Asset</span>
            </button>
          ) : userRole === 'IT' ? (
            <button 
              onClick={() => {
                setSelectedAssetId('');
                setIsRegistering(true);
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-bold hover:bg-sky-700 shadow-md shadow-sky-100 transition-all"
            >
              <Package size={16} />
              <span>Asset Allocation Form</span>
            </button>
          ) : (
            <button 
              onClick={() => setIsRegistering(true)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-bold hover:bg-sky-700 shadow-md shadow-sky-100 transition-all"
            >
              <Package size={16} />
              <span>{userRole === 'Branch' ? 'Assign asset' : 'Register New Asset'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Asset Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500">Asset ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500">Asset Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500">Issued To</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500">Valuation (Rs.)</th>
                {userRole !== 'Management' && userRole !== 'Branch' && <th className="px-6 py-4 text-xs font-bold text-slate-500 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-6 py-5">
                    <span className="text-xs font-medium text-slate-500">{asset.id}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                        <Package size={20} />
                      </div>
                      <span className="text-sm font-bold text-slate-800">{asset.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">
                      <CreditCard size={10} />
                      {asset.category}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <User size={14} className="text-emerald-500" />
                      <span className="font-semibold text-slate-700">{asset.issuedTo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-slate-800">₹ {asset.valuation}</span>
                  </td>
                  {userRole !== 'Management' && userRole !== 'Branch' && (
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-emerald-600 transition-all">
                          <Edit size={18} />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-rose-600 transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const BranchManagement = ({ userRole, setActiveModule }: { userRole?: string, setActiveModule?: (module: string) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  const [branches, setBranches] = useState([
    { id: 'B001', name: 'Ahmedabad Regional Office', region: 'WEST', contact: '11245585201', address: 'Ahmedabad' },
    { id: 'B002', name: 'Kolkata ESS', region: 'EAST', contact: '1234567801', address: 'Mirania Gardens, Kolkata' },
    { id: 'B003', name: 'Kolkata Regional Office', region: 'EAST', contact: '1234567890', address: 'Salt Lake Kolkata' },
    { id: 'B004', name: 'Mumbai Head Office', region: 'WEST', contact: '1245878962', address: 'Andheri East, Mumbai' },
  ]);

  const handleUpdateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    setBranches(branches.map(b => b.id === editingBranch.id ? editingBranch : b));
    setIsEditing(false);
    setEditingBranch(null);
  };

  const handleExportPDF = () => {
    const columns = ["Branch Name", "Region", "Contact", "Address"];
    const data = branches.map(b => [b.name, b.region, b.contact, b.address]);
    exportToPDF("Branch List", columns, data, 'Branch_List');
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    const data = branches.map(b => ({
      "Branch ID": b.id,
      "Branch Name": b.name,
      "Region": b.region,
      "Contact": b.contact,
      "Address": b.address
    }));
    exportToExcel(data, 'Branch_List');
    setShowExportMenu(false);
  };

  if (isProvisioning || isEditing) {
    const isEditMode = isEditing;
    const title = isEditMode ? "Update Branch Information" : "Provision New Branch";
    const subtitle = isEditMode ? `Modifying details for ${editingBranch?.name}` : "Setup a new regional node in the network";
    const buttonText = isEditMode ? "Save Changes" : "Initialize Branch Provisioning";

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-zinc-800">{title}</h2>
            <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest">{subtitle}</p>
          </div>
          <button 
            onClick={() => { setIsProvisioning(false); setIsEditing(false); setEditingBranch(null); }}
            className="px-6 py-2.5 rounded-xl border border-zinc-200 text-sm font-bold text-zinc-600 hover:bg-zinc-50 transition-all"
          >
            Cancel
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 p-5 md:p-8 shadow-sm max-w-2xl">
          <form className="space-y-4 md:space-y-6" onSubmit={isEditMode ? handleUpdateBranch : (e) => { e.preventDefault(); setIsProvisioning(false); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Branch Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Delhi Regional Office" 
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm bg-zinc-50/50" 
                  required 
                  value={isEditMode ? editingBranch.name : ''}
                  onChange={(e) => isEditMode && setEditingBranch({...editingBranch, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Region</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm bg-zinc-50/50" 
                  required
                  value={isEditMode ? editingBranch.region : ''}
                  onChange={(e) => isEditMode && setEditingBranch({...editingBranch, region: e.target.value})}
                >
                  <option value="">Select Region</option>
                  <option value="NORTH">NORTH</option>
                  <option value="SOUTH">SOUTH</option>
                  <option value="EAST">EAST</option>
                  <option value="WEST">WEST</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Primary Contact</label>
                <input 
                  type="tel" 
                  placeholder="+91 00000 00000" 
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm bg-zinc-50/50" 
                  required 
                  value={isEditMode ? editingBranch.contact : ''}
                  onChange={(e) => isEditMode && setEditingBranch({...editingBranch, contact: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Branch Code</label>
                <input 
                  type="text" 
                  placeholder="e.g. B005" 
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm bg-zinc-50/50" 
                  required 
                  disabled={isEditMode}
                  value={isEditMode ? editingBranch.id : ''}
                  onChange={(e) => !isEditMode && setEditingBranch({...editingBranch, id: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Full Address</label>
              <textarea 
                placeholder="Enter complete branch address..." 
                rows={3} 
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm bg-zinc-50/50" 
                required
                value={isEditMode ? editingBranch.address : ''}
                onChange={(e) => isEditMode && setEditingBranch({...editingBranch, address: e.target.value})}
              ></textarea>
            </div>
            <div className={`pt-4 ${userRole === 'Branch' ? 'flex justify-end' : ''}`}>
              <button 
                type="submit" 
                className={`${userRole === 'Branch' ? 'w-auto px-6 py-2' : 'w-full py-2'} rounded-xl bg-emerald-500 text-white text-[10px] font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/10 transition-all flex items-center justify-center gap-2 uppercase tracking-widest`}
              >
                {isEditMode ? <Edit size={16} /> : <Plus size={16} />}
                <span>{buttonText}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (userRole === 'Branch') {
    const myBranch = branches.find(b => b.id === 'B002') || branches[1]; // Assume Kolkata ESS for demo
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-2xl border border-zinc-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-600 border border-zinc-100">
                <Building2 size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-zinc-800">{myBranch.name}</h2>
                <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest">{myBranch.region} Region · {myBranch.id}</p>
              </div>
            </div>
            <button 
              onClick={() => { setEditingBranch(myBranch); setIsEditing(true); }}
              className="px-6 py-2 rounded-xl bg-emerald-500 text-white text-[10px] font-bold hover:bg-emerald-600 shadow-md shadow-emerald-500/10 transition-all uppercase tracking-widest"
            >
              Update Branch Info
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Contact Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-zinc-400 border border-zinc-100">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Primary Contact</p>
                    <p className="text-sm font-bold text-zinc-800">{myBranch.contact}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-zinc-400 border border-zinc-100">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Branch Address</p>
                    <p className="text-sm font-bold text-zinc-800">{myBranch.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Branch Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Efficiency</p>
                  <p className="text-2xl font-bold text-emerald-700">94.2%</p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Compliance</p>
                  <p className="text-2xl font-bold text-zinc-700">100%</p>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
                <h4 className="text-[10px] font-bold text-zinc-800 mb-4 uppercase tracking-widest">Quick Branch Actions</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setActiveModule?.('Asset Management')} className="p-3 rounded-xl bg-white border border-zinc-200 text-[10px] font-bold text-zinc-600 hover:border-emerald-500 hover:text-emerald-600 transition-all uppercase tracking-widest">Request Assets</button>
                  <button onClick={() => setActiveModule?.('User Management')} className="p-3 rounded-xl bg-white border border-zinc-200 text-[10px] font-bold text-zinc-600 hover:border-emerald-500 hover:text-emerald-600 transition-all uppercase tracking-widest">Staff Roster</button>
                  <button onClick={() => setActiveModule?.('Performance Reports')} className="p-3 rounded-xl bg-white border border-zinc-200 text-[10px] font-bold text-zinc-600 hover:border-emerald-500 hover:text-emerald-600 transition-all uppercase tracking-widest">Local Audit</button>
                  <button onClick={() => setActiveModule?.('Expense Management')} className="p-3 rounded-xl bg-white border border-zinc-200 text-[10px] font-bold text-zinc-600 hover:border-emerald-500 hover:text-emerald-600 transition-all uppercase tracking-widest">Expense Report</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by branch name or region..." 
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-zinc-200 text-sm font-bold text-zinc-600 hover:bg-emerald-500/5 hover:text-emerald-600 hover:border-emerald-500/20 transition-all bg-white uppercase tracking-widest"
            >
              <Download size={16} />
              <span>Export</span>
            </button>
            <AnimatePresence>
              {showExportMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-zinc-100 overflow-hidden z-50"
                >
                  <button 
                    onClick={handleExportPDF}
                    className="w-full text-left px-4 py-3 text-sm font-bold text-zinc-700 hover:bg-emerald-500/5 hover:text-emerald-600 flex items-center gap-2 uppercase tracking-widest text-[10px]"
                  >
                    <FileText size={16} className="text-rose-500" />
                    Export as PDF
                  </button>
                  <button 
                    onClick={handleExportExcel}
                    className="w-full text-left px-4 py-3 text-sm font-bold text-zinc-700 hover:bg-emerald-500/5 hover:text-emerald-600 flex items-center gap-2 uppercase tracking-widest text-[10px]"
                  >
                    <FileSpreadsheet size={16} className="text-emerald-500" />
                    Export as Excel
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button 
            onClick={() => setActiveModule?.('Regional View')}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-zinc-200 text-sm font-bold text-zinc-600 hover:bg-emerald-500/5 hover:text-emerald-600 hover:border-emerald-500/20 transition-all bg-white uppercase tracking-widest"
          >
            <Filter size={16} />
            <span>Regional View</span>
          </button>
          {userRole !== 'Management' && (
            <button 
              onClick={() => setIsProvisioning(true)}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-emerald-500 text-white text-[10px] font-bold hover:bg-emerald-600 shadow-md shadow-emerald-500/10 transition-all uppercase tracking-widest"
            >
              <Plus size={16} />
              <span>Provision New Branch</span>
            </button>
          )}
        </div>
      </div>

      {/* Branch Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100">
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Branch Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Region</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Contact Info</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Address</th>
                {userRole !== 'Management' && (
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {branches.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()) || b.region.toLowerCase().includes(searchTerm.toLowerCase())).map((branch) => (
                <tr key={branch.id} className="hover:bg-zinc-50/30 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-white transition-colors">
                        <Building2 size={20} />
                      </div>
                      <span className="text-sm font-bold text-zinc-800">{branch.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                      <Globe size={10} />
                      {branch.region}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-zinc-600 font-medium">
                      <Phone size={14} className="text-zinc-400" />
                      <span>{branch.contact}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-zinc-600 font-medium">
                      <MapPin size={14} className="text-zinc-400" />
                      <span>{branch.address}</span>
                    </div>
                  </td>
                  {userRole !== 'Management' && (
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => { setEditingBranch(branch); setIsEditing(true); }}
                          className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-all"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => setBranches(branches.filter(b => b.id !== branch.id))}
                          className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-rose-600 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, subtext, colorClass, bgClass = "bg-white", breakup }: { 
  icon: any, 
  title: string, 
  value: string, 
  subtext: string, 
  colorClass: string,
  bgClass?: string,
  breakup?: { label: string, value: number, color: string, bg: string }[]
}) => (
  <div className={`${bgClass} rounded-2xl p-6 flex flex-col gap-4 transition-all hover:shadow-md border border-slate-100`}>
    <div className="flex items-center justify-between">
      <div className="w-10 h-10 bg-white/80 rounded-xl flex items-center justify-center text-zinc-500 shadow-sm">
        <Icon size={20} />
      </div>
      <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest text-left flex-1 ml-4">
        {title}
      </h3>
    </div>
    
    <div className="flex items-end justify-between">
      <div className="space-y-0.5">
        <div className={`text-2xl font-bold tracking-tight ${colorClass}`}>
          {value}
        </div>
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          {subtext}
        </p>
      </div>
      {breakup && (
        <div className="flex gap-2">
          {breakup.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className={`text-xs font-bold ${item.color} ${item.bg} px-1.5 py-0.5 rounded`}>
                {item.value}
              </span>
              <span className="text-[10px] text-zinc-400 uppercase font-bold mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

const GoToField = ({ gtfLogs, setGtfLogs, deals, user }: { gtfLogs: any[], setGtfLogs: React.Dispatch<React.SetStateAction<any[]>>, deals: any[], user: any }) => {
  const [showLogForm, setShowLogForm] = useState(false);
  const [newLog, setNewLog] = useState({
    clientType: 'Existing',
    clientName: '',
    address: '',
    contactDetails: '',
    purpose: 'General Visit',
    otherPurpose: '',
    date: new Date().toISOString().split('T')[0],
    gps: '',
    checkIn: '',
    checkOut: '',
    remarks: ''
  });

  const branchClients = deals
    .filter(d => user.branches?.includes(d.branch))
    .map(d => d.client)
    .filter((v, i, a) => a.indexOf(v) === i); // Unique clients

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setNewLog({
          ...newLog,
          gps: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
        });
      }, (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location. Please ensure location services are enabled.");
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmitLog = (e: React.FormEvent) => {
    e.preventDefault();
    const finalLog = {
      ...newLog,
      purpose: newLog.purpose === 'Other' ? newLog.otherPurpose : newLog.purpose
    };
    setGtfLogs([{ id: Date.now(), ...finalLog }, ...gtfLogs]);
    setShowLogForm(false);
    setNewLog({
      clientType: 'Existing',
      clientName: '',
      address: '',
      contactDetails: '',
      purpose: 'General Visit',
      otherPurpose: '',
      date: new Date().toISOString().split('T')[0],
      gps: '',
      checkIn: '',
      checkOut: '',
      remarks: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-800">Go To Field (Site/Unit Visit Log)</h2>
        <button 
          onClick={() => setShowLogForm(true)}
          className="px-6 py-2 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 rounded-xl"
        >
          <Plus size={18} />
          Log New Visit
        </button>
      </div>

      {showLogForm && (
        <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm z-[100] flex items-start md:items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 w-full max-w-2xl shadow-2xl my-4 md:my-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-zinc-800">Log Site/Unit Visit</h3>
              <button 
                onClick={() => setShowLogForm(false)}
                className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmitLog} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Client Type</label>
                    <div className="flex gap-4 p-1 bg-zinc-50 rounded-xl border border-zinc-100">
                      <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${newLog.clientType === 'Existing' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400'}`}>
                        <input 
                          type="radio" 
                          name="clientType" 
                          value="Existing" 
                          checked={newLog.clientType === 'Existing'}
                          onChange={() => setNewLog({...newLog, clientType: 'Existing', clientName: ''})}
                          className="hidden"
                        />
                        <span className="text-sm font-bold">Existing</span>
                      </label>
                      <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${newLog.clientType === 'New' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400'}`}>
                        <input 
                          type="radio" 
                          name="clientType" 
                          value="New" 
                          checked={newLog.clientType === 'New'}
                          onChange={() => setNewLog({...newLog, clientType: 'New', clientName: ''})}
                          className="hidden"
                        />
                        <span className="text-sm font-bold">New</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Client/Unit Name</label>
                    {newLog.clientType === 'Existing' ? (
                      <select 
                        required 
                        value={newLog.clientName}
                        onChange={e => setNewLog({...newLog, clientName: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-zinc-50/50"
                      >
                        <option value="">Select Client</option>
                        {branchClients.map((client, idx) => (
                          <option key={idx} value={client}>{client}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="space-y-4">
                        <input 
                          type="text" 
                          required 
                          value={newLog.clientName}
                          onChange={e => setNewLog({...newLog, clientName: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-zinc-50/50"
                          placeholder="Enter new client name"
                        />
                        <div>
                          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Address</label>
                          <textarea 
                            required 
                            value={newLog.address}
                            onChange={e => setNewLog({...newLog, address: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none h-24 bg-zinc-50/50 resize-none"
                            placeholder="Enter client address"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Contact Details</label>
                          <input 
                            type="text" 
                            required 
                            value={newLog.contactDetails}
                            onChange={e => setNewLog({...newLog, contactDetails: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-zinc-50/50"
                            placeholder="Phone or Email"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Purpose of Visit</label>
                    <select 
                      required 
                      value={newLog.purpose}
                      onChange={e => setNewLog({...newLog, purpose: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-zinc-50/50"
                    >
                      <option value="General Visit">General Visit</option>
                      <option value="Training">Training</option>
                      <option value="Payment Collection">Payment Collection</option>
                      <option value="New deployment">New deployment</option>
                      <option value="Operational escalation">Operational escalation</option>
                      <option value="Site Survey">Site Survey</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {newLog.purpose === 'Other' && (
                    <div>
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Specify Purpose</label>
                      <input 
                        type="text" 
                        required 
                        value={newLog.otherPurpose}
                        onChange={e => setNewLog({...newLog, otherPurpose: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-zinc-50/50"
                        placeholder="Enter purpose details"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Date</label>
                      <input 
                        type="date" required value={newLog.date}
                        onChange={e => setNewLog({...newLog, date: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-zinc-50/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Location</label>
                      <div className="relative">
                        <input 
                          type="text" required value={newLog.gps}
                          readOnly
                          className="w-full pl-4 pr-10 py-3 rounded-xl border border-zinc-200 bg-zinc-100 outline-none text-xs font-mono"
                          placeholder="GPS Coords"
                        />
                        <button 
                          type="button"
                          onClick={handleGetLocation}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white text-zinc-600 rounded-lg hover:bg-zinc-50 border border-zinc-200 transition-colors"
                        >
                          <MapPin size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Check-in</label>
                      <input 
                        type="time" required value={newLog.checkIn}
                        onChange={e => setNewLog({...newLog, checkIn: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-zinc-50/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Check-out</label>
                      <input 
                        type="time" required value={newLog.checkOut}
                        onChange={e => setNewLog({...newLog, checkOut: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-zinc-50/50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Remarks & Observations</label>
                <textarea 
                  required value={newLog.remarks}
                  onChange={e => setNewLog({...newLog, remarks: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none h-24 bg-zinc-50/50 resize-none"
                  placeholder="Enter detailed visit notes..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button type="button" onClick={() => setShowLogForm(false)}
                  className="w-full sm:flex-1 px-6 py-3 rounded-xl border border-zinc-200 text-zinc-600 font-bold hover:bg-zinc-50 transition-all">
                  Discard
                </button>
                <button type="submit"
                  className="w-full sm:flex-1 px-4 py-2 rounded-xl bg-emerald-500 text-white text-[10px] font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/10 transition-all uppercase tracking-widest">
                  Save Visit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-zinc-200 p-8 shadow-sm">
        <h3 className="text-lg font-bold text-zinc-800 mb-6">Recent Visit Logs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200">
                <th className="py-4 px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Client/Unit</th>
                <th className="py-4 px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Purpose</th>
                <th className="py-4 px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date</th>
                <th className="py-4 px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">GPS</th>
                <th className="py-4 px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Check-in/Out</th>
                <th className="py-4 px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {gtfLogs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-zinc-800">{log.clientName}</span>
                      <span className="text-[10px] text-zinc-400 uppercase font-medium">{log.clientType}</span>
                      {log.clientType === 'New' && (
                        <div className="mt-1 text-[10px] text-zinc-500">
                          <p className="truncate max-w-[150px]">{log.address}</p>
                          <p>{log.contactDetails}</p>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs font-semibold px-2 py-1 bg-zinc-100 rounded-lg text-zinc-600">
                      {log.purpose}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-zinc-600">{log.date}</td>
                  <td className="py-4 px-4 text-xs text-zinc-500 font-mono">{log.gps}</td>
                  <td className="py-4 px-4 text-sm text-zinc-600">{log.checkIn} - {log.checkOut}</td>
                  <td className="py-4 px-4 text-sm text-zinc-600 max-w-xs truncate">{log.remarks}</td>
                </tr>
              ))}
              {gtfLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-400 italic">No visit logs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const GoToMarket = ({ 
  leads, 
  gtmLogs, 
  setGtmLogs,
  expenses,
  setExpenses,
  user,
  users
}: { 
  leads: any[], 
  gtmLogs: any[], 
  setGtmLogs: React.Dispatch<React.SetStateAction<any[]>>,
  expenses: any[],
  setExpenses: React.Dispatch<React.SetStateAction<any[]>>,
  user: any,
  users: any[]
}) => {
  const [showLogForm, setShowLogForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  
  const reportingManager = users.find(u => u.name === user.name)?.reportingManager || 'N/A';

  const [newLog, setNewLog] = useState({
    visitType: 'Existing',
    clientName: '',
    date: new Date().toISOString().split('T')[0],
    gps: '',
    checkIn: '',
    checkOut: '',
    remarks: ''
  });

  const [newBudget, setNewBudget] = useState({
    category: 'Travel',
    amount: '',
    description: '',
    clientName: '',
    purposeDetails: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setNewLog({
          ...newLog,
          gps: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
        });
      }, (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location. Please ensure location services are enabled.");
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmitLog = (e: React.FormEvent) => {
    e.preventDefault();
    setGtmLogs([{ id: Date.now(), ...newLog }, ...gtmLogs]);
    setShowLogForm(false);
    setNewLog({
      visitType: 'Existing',
      clientName: '',
      date: new Date().toISOString().split('T')[0],
      gps: '',
      checkIn: '',
      checkOut: '',
      remarks: ''
    });
  };

  const handleSubmitBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const budgetRequest = {
      id: `EXP-${Date.now()}`,
      ...newBudget,
      clientName: newBudget.clientName === 'General Marketing' ? newBudget.purposeDetails : newBudget.clientName,
      amount: `₹ ${newBudget.amount}`,
      status: 'Pending Approval',
      submittedBy: user.name,
      reportingManager,
      branch: user.branches?.[0] || 'Head Office',
      type: 'GTM Budget'
    };
    setExpenses([budgetRequest, ...expenses]);
    setShowBudgetForm(false);
    setNewBudget({
      category: 'Travel',
      amount: '',
      description: '',
      clientName: '',
      purposeDetails: '',
      date: new Date().toISOString().split('T')[0]
    });
    alert(`Budget approval request sent to ${reportingManager}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-800">Go To Market (Field Visit Log)</h2>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowBudgetForm(true)}
            className="px-6 py-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-600 text-sm font-bold hover:bg-zinc-50 shadow-sm transition-all flex items-center gap-2"
          >
            <span className="text-emerald-500 font-bold">Rs.</span>
            Request Budget
          </button>
          <button 
            onClick={() => setShowLogForm(true)}
            className="px-6 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-800 shadow-md transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Log New Visit
          </button>
        </div>
      </div>

      {showBudgetForm && (
        <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm z-50 flex items-start md:items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl my-4 md:my-auto">
            <h3 className="text-xl font-bold text-zinc-800 mb-6">Expenses Budget Request</h3>
            <form onSubmit={handleSubmitBudget} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-zinc-700 block mb-1">Category</label>
                <select 
                  required 
                  value={newBudget.category}
                  onChange={e => setNewBudget({...newBudget, category: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-primary outline-none"
                >
                  <option value="Travel">Travel</option>
                  <option value="Accommodation">Accommodation</option>
                  <option value="Client Entertainment">Client Entertainment</option>
                  <option value="Marketing Material">Marketing Material</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-zinc-700 block mb-1">Amount (₹)</label>
                <input 
                  type="number" 
                  required 
                  value={newBudget.amount}
                  onChange={e => setNewBudget({...newBudget, amount: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-zinc-700 block mb-1">Client/Purpose</label>
                <select 
                  required 
                  value={newBudget.clientName}
                  onChange={e => setNewBudget({...newBudget, clientName: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="">Select Client</option>
                  {leads.map(l => <option key={l.id} value={l.company}>{l.company}</option>)}
                  <option value="General Marketing">General Marketing</option>
                </select>
              </div>
              {newBudget.clientName === 'General Marketing' && (
                <div>
                  <label className="text-sm font-semibold text-zinc-700 block mb-1">Purpose Details</label>
                  <input 
                    type="text" 
                    required 
                    value={newBudget.purposeDetails}
                    onChange={e => setNewBudget({...newBudget, purposeDetails: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Enter marketing purpose..."
                  />
                </div>
              )}
              <div>
                <label className="text-sm font-semibold text-zinc-700 block mb-1">Reporting Manager</label>
                <input 
                  type="text" 
                  readOnly 
                  value={reportingManager}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-500 outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-zinc-700 block mb-1">Description</label>
                <textarea 
                  required 
                  value={newBudget.description}
                  onChange={e => setNewBudget({...newBudget, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none h-24 resize-none"
                  placeholder="Describe the expense..."
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button type="button" onClick={() => setShowBudgetForm(false)}
                  className="w-full sm:flex-1 px-4 py-2 rounded-xl border border-zinc-200 text-zinc-600 font-bold hover:bg-zinc-50 transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="w-full sm:flex-1 px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors text-xs uppercase tracking-widest">
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showLogForm && (
        <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm z-50 flex items-start md:items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl my-4 md:my-auto">
            <h3 className="text-xl font-bold text-zinc-800 mb-6">Log Field Visit</h3>
            <form onSubmit={handleSubmitLog} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-zinc-700 block mb-1">Visit Type</label>
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="visitType" 
                      value="New" 
                      checked={newLog.visitType === 'New'}
                      onChange={() => setNewLog({...newLog, visitType: 'New', clientName: ''})}
                      className="w-4 h-4 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="text-sm font-medium text-zinc-700">New Client</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="visitType" 
                      value="Existing" 
                      checked={newLog.visitType === 'Existing'}
                      onChange={() => setNewLog({...newLog, visitType: 'Existing', clientName: ''})}
                      className="w-4 h-4 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="text-sm font-medium text-zinc-700">Existing Client</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-zinc-700 block mb-1">Client Name</label>
                {newLog.visitType === 'Existing' ? (
                  <select 
                    required 
                    value={newLog.clientName}
                    onChange={e => setNewLog({...newLog, clientName: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="">Select Client</option>
                    {leads.map(l => <option key={l.id} value={l.company}>{l.company}</option>)}
                  </select>
                ) : (
                  <input 
                    type="text" 
                    required 
                    value={newLog.clientName}
                    onChange={e => setNewLog({...newLog, clientName: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Enter client name"
                  />
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-zinc-700 block mb-1">Date of Visit</label>
                <input 
                  type="date" required value={newLog.date}
                  onChange={e => setNewLog({...newLog, date: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-zinc-700 block mb-1">GPS Coordinates</label>
                <div className="flex gap-2">
                  <input 
                    type="text" required value={newLog.gps}
                    readOnly
                    className="flex-1 px-4 py-2 rounded-xl border border-zinc-200 bg-zinc-50 outline-none text-xs font-mono"
                    placeholder="Click to get location"
                  />
                  <button 
                    type="button"
                    onClick={handleGetLocation}
                    className="px-4 py-2 bg-zinc-100 text-zinc-600 rounded-xl hover:bg-zinc-200 transition-colors"
                  >
                    <MapPin size={18} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-zinc-700 block mb-1">Check-in Time</label>
                  <input 
                    type="time" required value={newLog.checkIn}
                    onChange={e => setNewLog({...newLog, checkIn: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-zinc-700 block mb-1">Check-out Time</label>
                  <input 
                    type="time" required value={newLog.checkOut}
                    onChange={e => setNewLog({...newLog, checkOut: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-zinc-700 block mb-1">Remarks</label>
                <textarea 
                  required value={newLog.remarks}
                  onChange={e => setNewLog({...newLog, remarks: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none h-24 resize-none"
                  placeholder="Enter visit details..."
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button type="button" onClick={() => setShowLogForm(false)}
                  className="w-full sm:flex-1 px-4 py-2 rounded-xl border border-zinc-200 text-zinc-600 font-bold hover:bg-zinc-50 transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="w-full sm:flex-1 px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors text-xs uppercase tracking-widest">
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-zinc-200 p-8 shadow-sm">
        <h3 className="text-lg font-bold text-zinc-800 mb-6">Recent Visit Logs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200">
                <th className="py-4 px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Client</th>
                <th className="py-4 px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date</th>
                <th className="py-4 px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">GPS</th>
                <th className="py-4 px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Check-in/Out</th>
                <th className="py-4 px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {gtmLogs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="py-4 px-4 font-bold text-zinc-800">{log.clientName}</td>
                  <td className="py-4 px-4 text-sm text-zinc-600">{log.date}</td>
                  <td className="py-4 px-4 text-xs text-zinc-500 font-mono">{log.gps}</td>
                  <td className="py-4 px-4 text-sm text-zinc-600">{log.checkIn} - {log.checkOut}</td>
                  <td className="py-4 px-4 text-sm text-zinc-600 max-w-xs truncate">{log.remarks}</td>
                </tr>
              ))}
              {gtmLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-400 italic">No visit logs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ExpenseManagement = ({ expenses, setExpenses }: { expenses: any[], setExpenses: React.Dispatch<React.SetStateAction<any[]>> }) => {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'bike kms',
    amount: '',
    remarks: '',
    documentName: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("File size exceeds 3MB limit. Please upload a smaller file.");
        e.target.value = '';
        return;
      }
      setNewExpense({ ...newExpense, documentName: file.name });
    }
  };

  const handleSubmitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    setExpenses([{ 
      id: Date.now(), 
      ...newExpense, 
      status: 'Pending',
      requestedAt: new Date().toISOString()
    }, ...expenses]);
    setShowExpenseForm(false);
    setNewExpense({
      date: new Date().toISOString().split('T')[0],
      type: 'bike kms',
      amount: '',
      remarks: '',
      documentName: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-zinc-800">Expense Management</h2>
        <button 
          onClick={() => setShowExpenseForm(true)}
          className="w-full sm:w-auto px-6 py-2 rounded-xl bg-emerald-500 text-white text-[10px] font-bold hover:bg-emerald-600 shadow-md transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
        >
          <Plus size={16} />
          Update Expenses
        </button>
      </div>

      {showExpenseForm && (
        <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm z-[100] flex items-start md:items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 w-full max-w-2xl shadow-2xl my-4 md:my-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-zinc-800">Request Reimbursement</h3>
              <button 
                onClick={() => setShowExpenseForm(false)}
                className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmitExpense} className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Date of Expense</label>
                    <input 
                      type="date" required value={newExpense.date}
                      onChange={e => setNewExpense({...newExpense, date: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-zinc-50/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Expense Type</label>
                    <select 
                      required value={newExpense.type}
                      onChange={e => setNewExpense({...newExpense, type: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-zinc-50/50"
                    >
                      <option value="bike kms">Bike KMs</option>
                      <option value="travelling">Travelling</option>
                      <option value="hotel">Hotel</option>
                      <option value="client entertainment">Client Entertainment</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Amount (₹)</label>
                    <input 
                      type="number" required value={newExpense.amount}
                      onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-zinc-50/50"
                      placeholder="Enter amount"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Supporting Document (Max 3MB)</label>
                    <div className="relative">
                      <input 
                        type="file" 
                        onChange={handleFileChange}
                        className="hidden"
                        id="expense-doc"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <label 
                        htmlFor="expense-doc"
                        className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 text-zinc-500 cursor-pointer hover:bg-zinc-100 transition-colors"
                      >
                        <FileUp size={18} />
                        <span className="truncate">{newExpense.documentName || 'Upload Document'}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Remarks</label>
                <textarea 
                  required value={newExpense.remarks}
                  onChange={e => setNewExpense({...newExpense, remarks: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none h-24 bg-zinc-50/50 resize-none"
                  placeholder="Enter expense details..."
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button type="button" onClick={() => setShowExpenseForm(false)}
                  className="w-full sm:flex-1 px-6 py-2 rounded-xl border border-zinc-200 text-zinc-600 font-bold hover:bg-zinc-50 transition-all text-xs uppercase tracking-widest">
                  Discard
                </button>
                <button type="submit"
                  className="w-full sm:flex-1 px-6 py-2 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/10 transition-all text-xs uppercase tracking-widest">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-zinc-200 p-4 md:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-zinc-800 mb-6">My Expense Requests</h3>
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-zinc-200">
                <th className="py-4 px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date</th>
                <th className="py-4 px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Type</th>
                <th className="py-4 px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Amount</th>
                <th className="py-4 px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Document</th>
                <th className="py-4 px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="py-4 px-4 text-sm text-zinc-600">{exp.date}</td>
                  <td className="py-4 px-4 text-sm text-zinc-800 font-bold capitalize">{exp.type || exp.category}</td>
                  <td className="py-4 px-4 text-sm font-bold text-zinc-800">{exp.amount.toString().startsWith('₹') ? exp.amount : `₹ ${exp.amount}`}</td>
                  <td className="py-4 px-4 text-xs text-zinc-600 font-medium truncate max-w-[120px]">{exp.documentName || exp.clientName || 'No doc'}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      (exp.status === 'Pending' || exp.status === 'Pending Approval') ? 'bg-amber-50 text-amber-600' :
                      exp.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                      'bg-rose-50 text-rose-600'
                    }`}>
                      {exp.status}
                    </span>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-400 italic">No expense requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const LeadManagement = ({ 
  userRegion, 
  leads, 
  setLeads, 
  onQualified 
}: { 
  userRegion: string, 
  leads: any[], 
  setLeads: React.Dispatch<React.SetStateAction<any[]>>,
  onQualified: (lead: any) => void
}) => {
  const [showAddLead, setShowAddLead] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [newLead, setNewLead] = useState({ name: '', company: '', location: '', designation: '', contact: '', email: '', status: 'New', creationDate: new Date().toISOString().split('T')[0], vertical: 'MG' });

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    const leadToAdd = { id: Date.now(), ...newLead };
    setLeads([leadToAdd, ...leads]);
    if (leadToAdd.status === 'Qualified') {
      onQualified(leadToAdd);
    }
    setShowAddLead(false);
    setNewLead({ name: '', company: '', location: '', designation: '', contact: '', email: '', status: 'New', creationDate: new Date().toISOString().split('T')[0], vertical: 'MG' });
  };

  const handleStatusChange = (leadId: number, newStatus: string) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        if (newStatus === 'Qualified' && l.status !== 'Qualified') {
          onQualified(l);
        }
        return { ...l, status: newStatus };
      }
      return l;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-800">Lead Management ({userRegion})</h2>
          <p className="text-sm text-zinc-500 font-medium">Track and qualify potential business opportunities</p>
        </div>
        <button 
          onClick={() => setShowAddLead(true)}
          className="px-6 py-2 rounded-xl bg-emerald-500 text-white text-[10px] font-bold hover:bg-emerald-600 shadow-md shadow-emerald-500/10 transition-all uppercase tracking-widest flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Add New Lead</span>
        </button>
      </div>

      {showAddLead && (
        <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm z-50 flex items-start md:items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-5 md:p-8 max-w-md w-full shadow-2xl my-4 md:my-auto border border-zinc-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-zinc-800">Add New Lead</h3>
              <button onClick={() => setShowAddLead(false)} className="text-zinc-400 hover:text-zinc-600">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleAddLead} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-zinc-700 block mb-1 uppercase tracking-widest">Client Name</label>
                <input 
                  type="text" required value={newLead.name}
                  onChange={e => setNewLead({...newLead, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm font-medium bg-zinc-50/50"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-700 block mb-1 uppercase tracking-widest">Company Name</label>
                <input 
                  type="text" required value={newLead.company}
                  onChange={e => setNewLead({...newLead, company: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm font-medium bg-zinc-50/50"
                  placeholder="Enter company"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-700 block mb-1 uppercase tracking-widest">Location</label>
                <input 
                  type="text" required value={newLead.location}
                  onChange={e => setNewLead({...newLead, location: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm font-medium bg-zinc-50/50"
                  placeholder="Enter location"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-700 block mb-1 uppercase tracking-widest">Designation</label>
                <input 
                  type="text" required value={newLead.designation}
                  onChange={e => setNewLead({...newLead, designation: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm font-medium bg-zinc-50/50"
                  placeholder="Enter designation"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-700 block mb-1 uppercase tracking-widest">Contact Number</label>
                <input 
                  type="tel" required value={newLead.contact}
                  onChange={e => setNewLead({...newLead, contact: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm font-medium bg-zinc-50/50"
                  placeholder="Enter contact number"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-700 block mb-1 uppercase tracking-widest">Mail ID</label>
                <input 
                  type="email" required value={newLead.email}
                  onChange={e => setNewLead({...newLead, email: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm font-medium bg-zinc-50/50"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-700 block mb-1 uppercase tracking-widest">Lead Creation Date</label>
                <input 
                  type="date" required value={newLead.creationDate}
                  onChange={e => setNewLead({...newLead, creationDate: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm font-medium bg-zinc-50/50"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-700 block mb-1 uppercase tracking-widest">Business Vertical</label>
                <select 
                  value={newLead.vertical}
                  onChange={e => setNewLead({...newLead, vertical: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm font-medium bg-zinc-50/50"
                >
                  <option value="MG">MG</option>
                  <option value="ESS">ESS</option>
                  <option value="FMS">FMS</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setShowAddLead(false)}
                  className="flex-1 px-4 py-2 rounded-xl border border-zinc-200 text-zinc-600 text-[10px] font-bold hover:bg-zinc-50 transition-colors uppercase tracking-widest">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 px-4 py-2 rounded-xl bg-emerald-500 text-white text-[10px] font-bold hover:bg-emerald-600 transition-colors uppercase tracking-widest">
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-zinc-200 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-zinc-800">Active Leads</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input type="text" placeholder="Search leads..." className="pl-10 pr-4 py-2 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none bg-zinc-50/50" />
            </div>
            <button className="px-4 py-2 border border-zinc-200 rounded-xl text-[10px] font-bold text-zinc-600 hover:bg-zinc-50 uppercase tracking-widest flex items-center gap-2">
              <Filter size={14} />
              <span>Filter</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                <th className="py-4 px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Client Name</th>
                <th className="py-4 px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Company</th>
                <th className="py-4 px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Vertical</th>
                <th className="py-4 px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Created</th>
                <th className="py-4 px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Designation</th>
                <th className="py-4 px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Contact</th>
                <th className="py-4 px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                <th className="py-4 px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="py-4 px-4">
                    <div className="font-bold text-zinc-800">{lead.name}</div>
                    <div className="text-[10px] text-zinc-400 font-medium">{lead.email}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-zinc-600 font-medium">{lead.company}</div>
                    <div className="text-[10px] text-zinc-400 font-medium">{lead.location}</div>
                  </td>
                  <td className="py-4 px-4 text-sm text-zinc-600 font-bold uppercase tracking-widest">{lead.vertical || 'MG'}</td>
                  <td className="py-4 px-4 text-sm text-zinc-600 font-medium">{lead.creationDate || '2026-03-20'}</td>
                  <td className="py-4 px-4 text-sm text-zinc-600 font-medium">{lead.designation}</td>
                  <td className="py-4 px-4 text-sm text-zinc-600 font-medium">{lead.contact}</td>
                  <td className="py-4 px-4">
                    <select 
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest outline-none border border-transparent focus:border-zinc-200 cursor-pointer transition-all ${
                        lead.status === 'New' ? 'bg-zinc-100 text-zinc-600' :
                        lead.status === 'Contacted' ? 'bg-amber-50 text-amber-600' :
                        'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                    </select>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button 
                      onClick={() => {
                        setSelectedLead(lead);
                        setShowDetails(true);
                      }}
                      className="text-zinc-400 hover:text-zinc-900 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showDetails && selectedLead && (
          <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl border border-zinc-200"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-zinc-800">{selectedLead.name}</h3>
                  <p className="text-sm text-zinc-500 font-medium">{selectedLead.designation} @ {selectedLead.company}</p>
                </div>
                <button 
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-400 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">Contact Information</label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-zinc-600">
                        <Mail size={16} className="text-zinc-400" />
                        {selectedLead.email}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-zinc-600">
                        <Phone size={16} className="text-zinc-400" />
                        {selectedLead.contact}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-zinc-600">
                        <MapPin size={16} className="text-zinc-400" />
                        {selectedLead.location}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">Lead Details</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Vertical</p>
                        <p className="text-sm font-bold text-zinc-800">{selectedLead.vertical || 'MG'}</p>
                      </div>
                      <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Created On</p>
                        <p className="text-sm font-bold text-zinc-800">{selectedLead.creationDate || '2026-03-20'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">Current Status</label>
                    <div className={`inline-flex px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest ${
                      selectedLead.status === 'New' ? 'bg-zinc-100 text-zinc-600' :
                      selectedLead.status === 'Contacted' ? 'bg-amber-50 text-amber-600' :
                      'bg-emerald-50 text-emerald-600'
                    }`}>
                      {selectedLead.status}
                    </div>
                  </div>

                  <div className="p-6 bg-zinc-900 rounded-2xl text-white">
                    <h4 className="text-sm font-bold mb-4">Quick Actions</h4>
                    <div className="space-y-2">
                      <button 
                        onClick={() => {
                          alert(`Meeting scheduled with ${selectedLead.name} for tomorrow at 10:00 AM.`);
                          setShowDetails(false);
                        }}
                        className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[10px] font-bold uppercase tracking-widest transition-all"
                      >
                        Schedule Meeting
                      </button>
                      <button 
                        onClick={() => {
                          alert(`Proposal sent to ${selectedLead.email}.`);
                          setShowDetails(false);
                        }}
                        className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[10px] font-bold uppercase tracking-widest transition-all"
                      >
                        Send Proposal
                      </button>
                      <button 
                        onClick={() => {
                          handleStatusChange(selectedLead.id, 'Qualified');
                          setShowDetails(false);
                        }}
                        className="w-full px-6 py-2 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all rounded-xl shadow-lg shadow-emerald-500/20"
                      >
                        Qualify Lead
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-zinc-100 flex justify-end">
                <button 
                  onClick={() => setShowDetails(false)}
                  className="px-8 py-2.5 rounded-xl bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ClientPortfolio = ({ userRegion }: { userRegion: string }) => {
  const [showAddClient, setShowAddClient] = useState(false);
  const [editingClientId, setEditingClientId] = useState<number | null>(null);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [clients, setClients] = useState([
    { 
      id: 1, 
      name: 'Tech Solutions Ltd', 
      industry: 'IT Services', 
      value: '₹ 12.5 L/yr', 
      status: 'Active', 
      type: 'Existing', 
      date: '2025-01-15',
      contact: 'Amit Verma',
      email: 'amit@techsolutions.in',
      phone: '+91 98765 43210',
      address: 'Sector 5, Salt Lake, Kolkata',
      branch: 'Kolkata HQ'
    },
    { 
      id: 2, 
      name: 'Global Retail Corp', 
      industry: 'Retail', 
      value: '₹ 8.2 L/yr', 
      status: 'Active', 
      type: 'Existing', 
      date: '2025-02-20',
      contact: 'Priya Das',
      email: 'p.das@globalretail.com',
      phone: '+91 98300 12345',
      address: 'Park Street, Kolkata',
      branch: 'South Kolkata'
    },
    { 
      id: 3, 
      name: 'Sunrise Enterprises', 
      industry: 'Manufacturing', 
      value: '₹ 15.0 L/yr', 
      status: 'Active', 
      type: 'New', 
      date: '2026-03-01',
      contact: 'Rajesh Singh',
      email: 'rajesh@sunrise.co.in',
      phone: '+91 90070 55667',
      address: 'Howrah Industrial Area, WB',
      branch: 'Howrah'
    },
    { 
      id: 4, 
      name: 'Modern Systems', 
      industry: 'Software', 
      value: '₹ 5.4 L/yr', 
      status: 'At Risk', 
      type: 'Existing', 
      date: '2025-11-10',
      contact: 'Sanjay Gupta',
      email: 's.gupta@modernsys.com',
      phone: '+91 98744 88990',
      address: 'New Town, Kolkata',
      branch: 'New Town'
    },
  ]);
  const [newClient, setNewClient] = useState({ 
    name: '', 
    industry: '', 
    value: '', 
    status: 'Active', 
    type: 'New', 
    date: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
    branch: ''
  });

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClientId) {
      setClients(clients.map(c => c.id === editingClientId ? { ...newClient, id: editingClientId } : c));
    } else {
      setClients([{ id: Date.now(), ...newClient }, ...clients]);
    }
    closeForm();
  };

  const openEditForm = (client: any) => {
    setEditingClientId(client.id);
    setNewClient({
      name: client.name,
      industry: client.industry,
      value: client.value,
      status: client.status,
      type: client.type,
      date: client.date,
      contact: client.contact || '',
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      branch: client.branch || ''
    });
    setShowAddClient(true);
    setSelectedClient(null);
  };

  const closeForm = () => {
    setShowAddClient(false);
    setEditingClientId(null);
    setNewClient({ 
      name: '', 
      industry: '', 
      value: '', 
      status: 'Active', 
      type: 'New', 
      date: '',
      contact: '',
      email: '',
      phone: '',
      address: '',
      branch: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Client Portfolio ({userRegion})</h2>
        <button 
          onClick={() => setShowAddClient(true)}
          className="px-6 py-2 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 shadow-md shadow-emerald-500/20 transition-all rounded-xl"
        >
          Add Client
        </button>
      </div>

      {showAddClient && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-start md:items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 max-w-2xl w-full shadow-2xl my-4 md:my-auto">
            <h3 className="text-xl font-bold text-slate-800 mb-6">{editingClientId ? 'Edit Client' : 'Add New Client'}</h3>
            <form onSubmit={handleSaveClient} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Client Name</label>
                  <input 
                    type="text" 
                    required
                    value={newClient.name}
                    onChange={e => setNewClient({...newClient, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Industry</label>
                  <input 
                    type="text" 
                    required
                    value={newClient.industry}
                    onChange={e => setNewClient({...newClient, industry: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
                    placeholder="Enter industry"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Contract Value</label>
                  <input 
                    type="text" 
                    required
                    value={newClient.value}
                    onChange={e => setNewClient({...newClient, value: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
                    placeholder="e.g. ₹ 10.0 L/yr"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Contact Person</label>
                  <input 
                    type="text" 
                    value={newClient.contact}
                    onChange={e => setNewClient({...newClient, contact: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Phone</label>
                  <input 
                    type="text" 
                    value={newClient.phone}
                    onChange={e => setNewClient({...newClient, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
                    placeholder="+91 00000 00000"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Email</label>
                  <input 
                    type="email" 
                    value={newClient.email}
                    onChange={e => setNewClient({...newClient, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
                    placeholder="client@example.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Address</label>
                  <input 
                    type="text" 
                    value={newClient.address}
                    onChange={e => setNewClient({...newClient, address: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
                    placeholder="Full address"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Client Type</label>
                  <select 
                    value={newClient.type}
                    onChange={e => setNewClient({...newClient, type: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
                  >
                    <option value="New">New Client</option>
                    <option value="Existing">Existing Client</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Joining Date</label>
                  <input 
                    type="date" 
                    required
                    value={newClient.date}
                    onChange={e => setNewClient({...newClient, date: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Status</label>
                  <select 
                    value={newClient.status}
                    onChange={e => setNewClient({...newClient, status: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
                  >
                    <option>Active</option>
                    <option>At Risk</option>
                    <option>Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Branch</label>
                  <input 
                    type="text" 
                    value={newClient.branch}
                    onChange={e => setNewClient({...newClient, branch: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
                    placeholder="Assigned Branch"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button 
                  type="button"
                  onClick={closeForm}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-xl bg-emerald-500 text-white text-[10px] font-bold hover:bg-emerald-600 transition-colors uppercase tracking-widest"
                >
                  {editingClientId ? 'Update Client' : 'Save Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div key={client.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xl mb-2">
                  {client.name[0]}
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest w-fit ${
                  client.type === 'New' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'
                }`}>
                  {client.type}
                </span>
              </div>
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                client.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
                client.status === 'At Risk' ? 'bg-rose-50 text-rose-600' :
                'bg-slate-100 text-slate-600'
              }`}>
                {client.status}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">{client.name}</h3>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
              <Calendar size={12} />
              <span>Joined: {client.date}</span>
            </div>
            <p className="text-sm text-slate-500 mb-4">{client.industry}</p>
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contract Value</p>
                <p className="text-sm font-bold text-slate-800">{client.value}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => openEditForm(client)}
                  className="p-2 text-slate-400 hover:text-sky-600 transition-colors"
                  title="Edit Client"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => setSelectedClient(client)}
                  className="text-sky-600 hover:text-sky-700 text-sm font-bold"
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Client Details Modal */}
      <AnimatePresence>
        {selectedClient && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-start md:items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 max-w-2xl w-full shadow-2xl relative my-4 md:my-auto"
            >
              <button 
                onClick={() => setSelectedClient(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-2xl md:text-3xl">
                  {selectedClient.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1 md:mb-2">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-800">{selectedClient.name}</h3>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      selectedClient.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
                      selectedClient.status === 'At Risk' ? 'bg-rose-50 text-rose-600' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {selectedClient.status}
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-slate-500 font-medium">{selectedClient.industry}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <User size={16} className="text-sky-500" />
                        <span className="font-bold">{selectedClient.contact || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Mail size={16} className="text-sky-500" />
                        <span>{selectedClient.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Phone size={16} className="text-sky-500" />
                        <span>{selectedClient.phone || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Location & Branch</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <MapPin size={16} className="text-sky-500" />
                        <span>{selectedClient.address || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Building2 size={16} className="text-sky-500" />
                        <span>Branch: <span className="font-bold">{selectedClient.branch || 'N/A'}</span></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Financial Overview</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Annual Contract Value</p>
                        <p className="text-xl font-bold text-emerald-600">{selectedClient.value}</p>
                      </div>
                      <div className="pt-4 border-t border-slate-200">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Relationship Type</p>
                        <p className="text-sm font-bold text-slate-800">{selectedClient.type} Client</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Onboarding Date</p>
                        <p className="text-sm font-bold text-slate-800">{selectedClient.date}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-end gap-4">
                <button 
                  onClick={() => openEditForm(selectedClient)}
                  className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Edit Details
                </button>
                <button 
                  onClick={() => setSelectedClient(null)}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 text-white text-sm font-bold hover:bg-slate-900 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LeaveApplication = () => {
  const [showApply, setShowApply] = useState(false);
  const [leaves, setLeaves] = useState([
    { id: 1, type: 'Casual Leave', from: '2026-03-25', to: '2026-03-26', reason: 'Personal work', status: 'Pending', manager: 'Sanjay Gupta' },
    { id: 2, type: 'Sick Leave', from: '2026-03-10', to: '2026-03-11', reason: 'Fever', status: 'Approved', manager: 'Sanjay Gupta' },
  ]);
  const [newLeave, setNewLeave] = useState({ type: 'Casual Leave', from: '', to: '', reason: '' });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setLeaves([{ id: Date.now(), ...newLeave, status: 'Pending', manager: 'Sanjay Gupta' }, ...leaves]);
    setShowApply(false);
    setNewLeave({ type: 'Casual Leave', from: '', to: '', reason: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Leave Application</h2>
        <button 
          onClick={() => setShowApply(true)}
          className="px-6 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-bold hover:bg-sky-700 shadow-md shadow-sky-100 transition-all"
        >
          Apply for Leave
        </button>
      </div>

      {showApply && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Apply for Leave</h3>
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">Leave Type</label>
                <select 
                  value={newLeave.type}
                  onChange={e => setNewLeave({...newLeave, type: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
                >
                  <option>Casual Leave</option>
                  <option>Sick Leave</option>
                  <option>Earned Leave</option>
                  <option>Maternity/Paternity Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">From Date</label>
                  <input 
                    type="date" required value={newLeave.from}
                    onChange={e => setNewLeave({...newLeave, from: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">To Date</label>
                  <input 
                    type="date" required value={newLeave.to}
                    onChange={e => setNewLeave({...newLeave, to: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">Reason</label>
                <textarea 
                  required value={newLeave.reason}
                  onChange={e => setNewLeave({...newLeave, reason: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
                  rows={3}
                  placeholder="Enter reason for leave"
                />
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setShowApply(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 px-4 py-2 rounded-xl bg-emerald-500 text-white text-[10px] font-bold hover:bg-emerald-600 transition-colors uppercase tracking-widest">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">My Leave Requests</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
                <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Duration</th>
                <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Reporting Manager</th>
                <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 text-sm font-bold text-slate-800">{leave.type}</td>
                  <td className="py-4 px-4 text-sm text-slate-600">{leave.from} to {leave.to}</td>
                  <td className="py-4 px-4 text-sm text-slate-600">{leave.manager}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      leave.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                      leave.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                      'bg-rose-50 text-rose-600'
                    }`}>
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};



const SalesPlanner = ({ leads }: { leads: any[] }) => {
  const [plans, setPlans] = useState([
    { id: 1, client: 'Reliance Industries', address: 'Mumbai, MH', date: '2026-03-22', task: 'Contract Renewal', status: 'Planned', reminder: true },
    { id: 2, client: 'Adani Group', address: 'Ahmedabad, GJ', date: '2026-03-24', task: 'Product Demo', status: 'Planned', reminder: true },
    { id: 3, client: 'Tata Motors', address: 'Pune, MH', date: '2026-03-20', task: 'Service Review', status: 'Completed', reminder: false },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newPlan, setNewPlan] = useState({
    client: '',
    address: '',
    date: '',
    time: '',
    task: '',
    reminder: true,
    isGTM: false
  });

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    setPlans([...plans, { ...newPlan, id: Date.now(), status: 'Planned' }]);
    setShowForm(false);
    setNewPlan({ client: '', address: '', date: '', time: '', task: '', reminder: true, isGTM: false });
  };

  const updateStatus = (id: number, status: string) => {
    setPlans(plans.map(p => p.id === id ? { ...p, status } : p));
  };

  const [viewDate, setViewDate] = useState(new Date());
  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();

  const prevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    setViewDate(new Date());
  };

  // Simple calendar logic
  const today = new Date();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getPlansForDate = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return plans.filter(p => p.date === dateStr);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-800">Sales Planner</h2>
          <p className="text-sm text-zinc-500 font-medium">Manage your tasks and client meetings</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-100"
        >
          <Plus size={18} />
          {showForm ? 'Close Form' : 'New Sales Plan'}
        </button>
      </div>

      {showForm && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-zinc-200 p-8 shadow-sm"
        >
          <form onSubmit={handleAddPlan} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-700 block mb-1 uppercase tracking-widest">Select Client (from Leads)</label>
              <select 
                required
                value={newPlan.client}
                onChange={e => {
                  const selectedLead = leads.find(l => l.company === e.target.value);
                  setNewPlan({
                    ...newPlan, 
                    client: e.target.value,
                    address: selectedLead ? selectedLead.location : newPlan.address
                  });
                }}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-medium"
              >
                <option value="">Select a client</option>
                {leads.map(lead => (
                  <option key={lead.id} value={lead.company}>{lead.company} ({lead.name})</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-700 block mb-1 uppercase tracking-widest">Task Date</label>
              <input 
                required
                type="date"
                value={newPlan.date}
                onChange={e => setNewPlan({...newPlan, date: e.target.value})}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-700 block mb-1 uppercase tracking-widest">Task Time</label>
              <input 
                required
                type="time"
                value={newPlan.time}
                onChange={e => setNewPlan({...newPlan, time: e.target.value})}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-medium"
              />
            </div>
            <div className="space-y-2 lg:col-span-1">
              <label className="text-[10px] font-bold text-zinc-700 block mb-1 uppercase tracking-widest">Address</label>
              <input 
                required
                type="text"
                value={newPlan.address}
                onChange={e => setNewPlan({...newPlan, address: e.target.value})}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-medium"
                placeholder="Full address of the task"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-700 block mb-1 uppercase tracking-widest">Task</label>
              <input 
                required
                type="text"
                value={newPlan.task}
                onChange={e => setNewPlan({...newPlan, task: e.target.value})}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-medium"
                placeholder="e.g. Product Demo, Negotiation"
              />
            </div>
            <div className="space-y-2 flex items-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer group w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 hover:bg-zinc-100 transition-all">
                <input 
                  type="checkbox"
                  checked={newPlan.isGTM}
                  onChange={e => setNewPlan({...newPlan, isGTM: e.target.checked})}
                  className="w-4 h-4 rounded border-zinc-300 text-brand-primary focus:ring-brand-primary"
                />
                <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Integrate with GTM</span>
              </label>
            </div>
            <div className="lg:col-span-3 flex justify-end gap-4 pt-4">
              <button 
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 rounded-xl border border-zinc-200 text-[10px] font-bold text-zinc-600 hover:bg-zinc-50 transition-all uppercase tracking-widest"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-2 rounded-xl bg-emerald-500 text-white text-[10px] font-bold hover:bg-emerald-600 transition-all uppercase tracking-widest"
              >
                Save Plan
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar View */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200 p-8 shadow-sm max-h-[800px] overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-zinc-800">Sales Calendar</h3>
            <div className="flex items-center gap-4">
              <button 
                onClick={goToToday}
                className="px-3 py-1 text-[10px] font-bold text-zinc-600 border border-zinc-100 rounded-lg hover:bg-zinc-50 transition-colors"
              >
                Today
              </button>
              <div className="flex items-center gap-2">
                <button 
                  onClick={prevMonth}
                  className="p-1 hover:bg-zinc-100 rounded-full transition-colors"
                >
                  <ChevronLeft size={20} className="text-zinc-600" />
                </button>
                <div className="flex items-center gap-2 text-sm font-bold text-zinc-500 min-w-[140px] justify-center">
                  <Calendar size={18} className="text-zinc-400" />
                  {viewDate.toLocaleString('default', { month: 'long' })} {currentYear}
                </div>
                <button 
                  onClick={nextMonth}
                  className="p-1 hover:bg-zinc-100 rounded-full transition-colors"
                >
                  <ChevronRight size={20} className="text-zinc-600" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto pb-2">
            <div className="grid grid-cols-7 gap-px bg-zinc-100 border border-zinc-100 rounded-2xl overflow-hidden min-w-[600px]">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="bg-zinc-50 py-3 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  {day}
                </div>
              ))}
              {blanks.map(i => (
                <div key={`blank-${i}`} className="bg-white h-32 p-2" />
              ))}
              {days.map(day => {
                const dayPlans = getPlansForDate(day);
                const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                return (
                  <div key={day} className={`bg-white h-32 p-2 border-t border-l border-zinc-50 transition-all hover:bg-zinc-50/50 ${isToday ? 'ring-2 ring-inset ring-zinc-900/20' : ''}`}>
                    <span className={`text-xs font-bold ${isToday ? 'text-zinc-900' : 'text-zinc-400'}`}>{day}</span>
                    <div className="mt-1 space-y-1">
                      {dayPlans.map(p => (
                        <div key={p.id} className={`text-[9px] p-1 rounded-md border truncate font-bold uppercase tracking-widest ${p.status === 'Completed' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-zinc-100 border-zinc-200 text-zinc-700'}`}>
                          {p.time && <span className="mr-1 opacity-60">{p.time}</span>}
                          {p.client}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Tasks & Reminders */}
        <div className="space-y-6 max-h-[800px] overflow-y-auto pr-2">
          <div className="bg-white rounded-2xl border border-zinc-200 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-zinc-800 mb-6">Upcoming Tasks</h3>
            <div className="space-y-4">
              {plans.filter(p => p.status === 'Planned').sort((a,b) => a.date.localeCompare(b.date)).map(p => (
                <div key={p.id} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-800 mt-1">{p.client}</h4>
                      {p.isGTM && (
                        <span className="text-[8px] font-black bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded uppercase tracking-tighter">GTM Integrated</span>
                      )}
                    </div>
                    {p.reminder && (
                      <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600 animate-pulse">
                        <Bell size={14} />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                      <Calendar size={12} />
                      {p.date} {p.time && <span className="ml-1 text-zinc-900">@ {p.time}</span>}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                      <MapPin size={12} />
                      {p.address}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                      <Briefcase size={12} />
                      {p.task}
                    </div>
                  </div>
                  <div className="pt-2 flex gap-2">
                    <button 
                      onClick={() => updateStatus(p.id, 'Completed')}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-700 transition-all uppercase tracking-widest"
                    >
                      Mark Completed
                    </button>
                    <button 
                      onClick={() => updateStatus(p.id, 'Cancelled')}
                      className="px-3 py-2 rounded-xl border border-zinc-200 text-[10px] font-bold text-zinc-400 hover:bg-zinc-100 transition-all uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg shadow-zinc-200">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <h3 className="text-lg font-bold mb-2 relative z-10">Planner Summary</h3>
            <div className="grid grid-cols-2 gap-4 relative z-10 mt-6">
              <div>
                <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Planned</p>
                <p className="text-2xl font-bold">{plans.filter(p => p.status === 'Planned').length}</p>
              </div>
              <div>
                <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Completed</p>
                <p className="text-2xl font-bold">{plans.filter(p => p.status === 'Completed').length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SalesPipeline = ({ 
  userRegion, 
  userBranch, 
  deals, 
  setDeals 
}: { 
  userRegion: string, 
  userBranch: string, 
  deals: any[], 
  setDeals: React.Dispatch<React.SetStateAction<any[]>> 
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingDealId, setEditingDealId] = useState<number | null>(null);
  const [newDeal, setNewDeal] = useState({
    name: '',
    client: '',
    value: '',
    stage: 'Prospecting',
    days: '1'
  });

  const stages = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won'];

  const handleSaveDeal = (e: React.FormEvent) => {
    e.preventDefault();
    const dealData = {
      name: newDeal.name,
      client: newDeal.client,
      value: parseFloat(newDeal.value) || 0,
      stage: newDeal.stage,
      days: parseInt(newDeal.days) || 1,
      branch: userBranch
    };

    if (editingDealId) {
      setDeals(deals.map(d => d.id === editingDealId ? { ...d, ...dealData } : d));
    } else {
      setDeals([...deals, { id: Date.now(), ...dealData }]);
    }
    
    setShowForm(false);
    setEditingDealId(null);
    setNewDeal({ name: '', client: '', value: '', stage: 'Prospecting', days: '1' });
  };

  const openEditForm = (deal: any) => {
    setEditingDealId(deal.id);
    setNewDeal({
      name: deal.name,
      client: deal.client,
      value: deal.value.toString(),
      stage: deal.stage,
      days: deal.days.toString()
    });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-800">Sales Pipeline ({userBranch})</h2>
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-zinc-800">{editingDealId ? 'Edit Deal' : 'Add New Deal'}</h3>
                <button onClick={() => { setShowForm(false); setEditingDealId(null); }} className="text-zinc-400 hover:text-zinc-600">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSaveDeal} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-zinc-700 block mb-2">Deal Name</label>
                  <input 
                    type="text" 
                    required
                    value={newDeal.name}
                    onChange={e => setNewDeal({...newDeal, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-primary outline-none"
                    placeholder="e.g. ERP Implementation"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-zinc-700 block mb-2">Client Name</label>
                  <input 
                    type="text" 
                    required
                    value={newDeal.client}
                    onChange={e => setNewDeal({...newDeal, client: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-primary outline-none"
                    placeholder="Enter client name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-zinc-700 block mb-2">Value (₹ L)</label>
                    <input 
                      type="number" 
                      required
                      value={newDeal.value}
                      onChange={e => setNewDeal({...newDeal, value: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-primary outline-none"
                      placeholder="e.g. 15"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-zinc-700 block mb-2">Days in Pipeline</label>
                    <input 
                      type="number" 
                      required
                      value={newDeal.days}
                      onChange={e => setNewDeal({...newDeal, days: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-primary outline-none"
                      placeholder="e.g. 5"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-zinc-700 block mb-2">Stage</label>
                  <select 
                    value={newDeal.stage}
                    onChange={e => setNewDeal({...newDeal, stage: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-primary outline-none"
                  >
                    {stages.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex gap-4 mt-8">
                  <button 
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-zinc-200 text-zinc-600 font-bold hover:bg-zinc-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-xl bg-emerald-500 text-white text-[10px] font-bold hover:bg-emerald-600 transition-colors uppercase tracking-widest"
                  >
                    {editingDealId ? 'Update Deal' : 'Save Deal'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex gap-6 overflow-x-auto pb-4">
        {stages.map((stage, i) => {
          const stageDeals = deals.filter(d => d.stage === stage);
          return (
            <div key={i} className="min-w-[300px] bg-zinc-50 rounded-2xl p-4 flex flex-col gap-4 border border-zinc-100">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{stage}</h3>
                <span className="bg-zinc-200 text-zinc-600 text-[10px] font-bold px-2 py-1 rounded-lg">{stageDeals.length}</span>
              </div>
              {stageDeals.map(deal => (
                <div key={deal.id} className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-200 cursor-pointer hover:border-zinc-400 transition-colors group relative">
                  <button 
                    onClick={(e) => { e.stopPropagation(); openEditForm(deal); }}
                    className="absolute top-2 right-2 p-1.5 bg-zinc-50 text-zinc-400 rounded-lg opacity-0 group-hover:opacity-100 hover:text-zinc-600 hover:bg-zinc-50 transition-all"
                  >
                    <Edit size={14} />
                  </button>
                  <h4 className="font-bold text-zinc-800 mb-1">{deal.name}</h4>
                  <p className="text-xs text-zinc-500 mb-3">{deal.client} • {deal.branch}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-emerald-600">₹ {deal.value} L</span>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{deal.days} Days</span>
                  </div>
                </div>
              ))}
              {stageDeals.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-zinc-400 border-2 border-dashed border-zinc-100 rounded-2xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest">Empty</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PerformanceReports = ({ userRegion }: { userRegion: string }) => {
  const branchData = [
    { name: `${userRegion} HQ`, value: 45, color: 'bg-sky-500' },
    { name: `${userRegion} Branch 1`, value: 30, color: 'bg-emerald-500' },
    { name: `${userRegion} Branch 2`, value: 15, color: 'bg-amber-500' },
    { name: `${userRegion} Satellite`, value: 10, color: 'bg-indigo-500' },
  ];

  const topPerformers = [
    { name: 'Arjun Mehta', deals: 12, revenue: '₹ 45 L', region: 'North' },
    { name: 'Neha Gupta', deals: 9, revenue: '₹ 38 L', region: 'South' },
    { name: 'Vikram Singh', deals: 7, revenue: '₹ 29 L', region: 'East' },
    { name: 'Priya Sharma', deals: 11, revenue: '₹ 42 L', region: 'West' },
    { name: 'Rahul Verma', deals: 8, revenue: '₹ 35 L', region: 'North' },
    { name: 'Kiran Patel', deals: 10, revenue: '₹ 40 L', region: 'South' },
    { name: 'Amit Kumar', deals: 6, revenue: '₹ 25 L', region: 'East' },
    { name: 'Sneha Reddy', deals: 9, revenue: '₹ 36 L', region: 'West' },
  ].filter(p => p.region === userRegion);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Performance Reports</h2>
        <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
          <Download size={16} />
          Export Reports
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue by Branch ({userRegion} Region)</h3>
          <div className="space-y-4">
            {branchData.map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm font-bold text-slate-700">
                  <span>{item.name}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Top Performers ({userRegion} Region)</h3>
          <div className="space-y-4">
            {topPerformers.map((person, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold">
                    {person.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{person.name}</p>
                    <p className="text-xs text-slate-500">{person.deals} Deals Closed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">{person.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface TrainingRecord {
  id: string;
  clientName: string;
  address: string;
  planDate: string; // ISO string
  module: 'Fire Training' | 'Duty SOP' | 'Emergency Management' | 'Other';
  reminder: boolean;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Pending';
  notes?: string;
}

const ClientDashboard = () => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Client Portal</h2>
        <p className="text-slate-500">Welcome to the Client Service Portal. Here you can monitor your service status, view reports, and raise requests.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={Activity} title="Service Status" value="Active" subtext="All systems normal" colorClass="text-emerald-600" bgClass="bg-emerald-50/50" />
        <StatCard icon={FileText} title="Reports" value="12" subtext="Available for download" colorClass="text-brand-primary" bgClass="bg-brand-primary/5" />
        <StatCard icon={AlertCircle} title="Open Tickets" value="0" subtext="No pending issues" colorClass="text-indigo-600" bgClass="bg-indigo-50/50" />
      </div>
    </div>
  );
};

const GuardPatrolDashboard = () => {
  const patrolStats = [
    { label: 'Active Patrols', value: '12', icon: <Activity size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Checkpoints', value: '145', icon: <MapPin size={20} />, color: 'text-brand-primary', bg: 'bg-brand-primary/5' },
    { label: 'Incidents', value: '2', icon: <AlertTriangle size={20} />, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Avg. Duration', value: '45m', icon: <Clock size={20} />, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-brand-primary rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-brand-primary/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/50 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Guard Patrol Management</h2>
          <p className="text-white/80 max-w-md">Real-time monitoring and management of security patrols across all sites.</p>
          <div className="mt-8 flex gap-4">
            <button className="px-6 py-2 bg-white text-emerald-600 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-50 transition-all">View Live Map</button>
            <button className="px-6 py-2 bg-emerald-500/20 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-500/30 transition-all">Generate Reports</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {patrolStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Patrol Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">G{i}</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Patrol Route {i === 1 ? 'A-North' : i === 2 ? 'B-South' : 'C-East'}</p>
                    <p className="text-[10px] text-slate-500 font-medium">Guard: Rajesh Kumar • Started 20m ago</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-bold rounded-full uppercase">On Track</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Incident Summary</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-4">
              <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                <AlertTriangle size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-rose-900">Unsecured Gate Detected</p>
                <p className="text-xs text-rose-700 opacity-80">Site: North Warehouse • Reported by: Sunil V.</p>
                <button className="mt-2 text-xs font-bold text-rose-600 hover:underline">View Details & Respond</button>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-4">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-900">Missed Checkpoint</p>
                <p className="text-xs text-amber-700 opacity-80">Site: Corporate HQ • Route: Perimeter B</p>
                <button className="mt-2 text-xs font-bold text-amber-600 hover:underline">Investigate</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GuardPatrolModule = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Guard Patrol Management</h2>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">History</button>
          <button className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-bold hover:bg-emerald-600 shadow-md shadow-emerald-500/10 transition-all uppercase tracking-widest">New Patrol Route</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-4 shadow-sm h-[600px] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-100 opacity-50 flex items-center justify-center">
             <div className="text-center">
               <MapPin size={48} className="text-slate-300 mx-auto mb-4" />
               <p className="text-slate-400 font-bold">Interactive Patrol Map</p>
               <p className="text-slate-300 text-xs mt-1">Map integration pending configuration</p>
             </div>
          </div>
          <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              <div>
                <p className="text-xs font-bold text-slate-800">Live Tracking Active</p>
                <p className="text-[10px] text-slate-500 font-medium">12 Guards currently on patrol</p>
              </div>
            </div>
            <button className="text-xs font-bold text-brand-primary hover:underline">Refresh Map</button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
            <h3 className="text-[10px] font-bold text-zinc-400 mb-4 uppercase tracking-widest">Active Checkpoints</h3>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                  <div className={`w-2 h-2 rounded-full ${i < 4 ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                  <span className="text-xs font-bold text-zinc-700">Checkpoint {i} - {i === 1 ? 'Main Gate' : i === 2 ? 'Rear Exit' : i === 3 ? 'Server Room' : 'Perimeter'}</span>
                  {i < 4 && <Check size={14} className="text-emerald-500 ml-auto" />}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
            <h3 className="text-[10px] font-bold text-zinc-400 mb-4 uppercase tracking-widest">Patrol Log</h3>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="relative pl-6 border-l-2 border-zinc-100 pb-4 last:pb-0">
                  <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-zinc-900" />
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">10:4{i} AM</p>
                  <p className="text-xs font-bold text-zinc-800">Checkpoint {i} Scanned</p>
                  <p className="text-[10px] text-zinc-500">By Guard: Rajesh K. • QR Code Verified</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



interface FieldVisitRecord {
  id: string;
  clientName: string;
  clientType: 'Existing' | 'New';
  address: string;
  planDate: string; // ISO string
  purpose: 'General Visit' | 'Training' | 'New Prospect' | 'New Deployment' | 'Other';
  reminder: boolean;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Pending';
  notes?: string;
}

const FieldVisitModule = ({ title = "Field Visit Management" }: { title?: string }) => {
  const [visits, setVisits] = useState<FieldVisitRecord[]>([
    {
      id: '1',
      clientName: 'Tata Steel',
      clientType: 'Existing',
      address: 'Jamshedpur, Jharkhand',
      planDate: new Date().toISOString(),
      purpose: 'General Visit',
      reminder: true,
      status: 'Scheduled',
    },
    {
      id: '2',
      clientName: 'New Horizon Bank',
      clientType: 'New',
      address: 'Salt Lake, Sector 5, Kolkata',
      planDate: new Date(Date.now() + 172800000).toISOString(),
      purpose: 'New Prospect',
      reminder: true,
      status: 'Pending',
    }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [formData, setFormData] = useState<Partial<FieldVisitRecord>>({
    clientType: 'Existing',
    purpose: 'General Visit',
    status: 'Scheduled',
    reminder: true,
  });

  const handleSaveVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setVisits(visits.map(v => v.id === editingId ? { ...v, ...formData as FieldVisitRecord } : v));
    } else {
      const newVisit: FieldVisitRecord = {
        id: Math.random().toString(36).substr(2, 9),
        clientName: formData.clientName || '',
        clientType: formData.clientType as any,
        address: formData.address || '',
        planDate: formData.planDate || new Date().toISOString(),
        purpose: formData.purpose as any,
        reminder: formData.reminder || false,
        status: formData.status as any,
        notes: formData.notes || '',
      };
      setVisits([...visits, newVisit]);
    }
    setShowForm(false);
    setEditingId(null);
    setFormData({ clientType: 'Existing', purpose: 'General Visit', status: 'Scheduled', reminder: true });
  };

  const handleEditVisit = (visit: FieldVisitRecord) => {
    setFormData(visit);
    setEditingId(visit.id);
    setShowForm(true);
  };

  const handleDeleteVisit = (id: string) => {
    if (window.confirm('Are you sure you want to delete this visit?')) {
      setVisits(visits.filter(v => v.id !== id));
    }
  };

  const updateVisitStatus = (id: string, status: FieldVisitRecord['status']) => {
    setVisits(visits.map(v => v.id === id ? { ...v, status } : v));
  };

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    const calendarDays = [];

    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="h-24 border border-zinc-100 bg-zinc-50/30" />);
    }

    for (let d = 1; d <= days; d++) {
      const dateStr = new Date(year, month, d).toISOString().split('T')[0];
      const dayVisits = visits.filter(v => v.planDate.startsWith(dateStr));
      const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();
      const isSelected = selectedDate?.toDateString() === new Date(year, month, d).toDateString();

      calendarDays.push(
        <div 
          key={d} 
          onClick={() => {
            setSelectedDate(new Date(year, month, d));
            setFormData({ ...formData, planDate: new Date(year, month, d).toISOString() });
          }}
          className={`h-24 border border-zinc-100 p-2 cursor-pointer hover:bg-zinc-50 transition-colors relative ${isToday ? 'bg-zinc-50/50' : ''} ${isSelected ? 'ring-2 ring-inset ring-brand-primary z-10' : ''}`}
        >
          <span className={`text-xs font-bold ${isToday ? 'text-brand-primary' : 'text-zinc-400'}`}>{d}</span>
          <div className="mt-1 space-y-1 overflow-y-auto max-h-16 scrollbar-hide">
            {dayVisits.map(v => (
              <div 
                key={v.id} 
                className={`text-[8px] px-1 py-0.5 rounded truncate font-medium ${
                  v.purpose === 'General Visit' ? 'bg-zinc-100 text-zinc-700' :
                  v.purpose === 'Training' ? 'bg-orange-100 text-orange-700' :
                  v.purpose === 'New Prospect' ? 'bg-emerald-100 text-emerald-700' :
                  v.purpose === 'New Deployment' ? 'bg-purple-100 text-purple-700' :
                  'bg-zinc-100 text-zinc-700'
                }`}
              >
                {v.clientName}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return calendarDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <Navigation size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-800">{title}</h2>
            <p className="text-sm text-zinc-500">Schedule and track operations field visits</p>
          </div>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold text-[10px] hover:bg-emerald-600 transition-all shadow-sm uppercase tracking-widest"
        >
          <Plus size={16} />
          <span>New Visit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-zinc-800 flex items-center gap-2">
              <Calendar size={18} className="text-zinc-400" />
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                className="p-2 hover:bg-zinc-50 rounded-lg text-zinc-400"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                className="p-2 hover:bg-zinc-50 rounded-lg text-zinc-400"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px bg-zinc-100 border border-zinc-100 rounded-xl overflow-hidden">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-zinc-50 py-2 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                {day}
              </div>
            ))}
            {renderCalendar()}
          </div>
        </div>

        {/* Selected Date Details & Reminders */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm min-h-[400px]">
            <h3 className="font-bold text-zinc-800 mb-4 flex items-center gap-2">
              <Clock size={18} className="text-zinc-400" />
              {selectedDate ? selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' }) : 'Select a date'}
            </h3>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {selectedDate ? (
                visits.filter(v => v.planDate.startsWith(selectedDate.toISOString().split('T')[0])).length > 0 ? (
                  visits.filter(v => v.planDate.startsWith(selectedDate.toISOString().split('T')[0])).map(v => (
                    <div key={v.id} className="p-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 hover:border-zinc-200 transition-all group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            v.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                            v.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
                            v.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                            'bg-zinc-100 text-zinc-700'
                          }`}>
                            {v.status}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            v.clientType === 'New' ? 'bg-purple-100 text-purple-700' : 'bg-zinc-100 text-zinc-700'
                          }`}>
                            {v.clientType}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {v.reminder && <Bell size={14} className="text-amber-500" />}
                          <button 
                            onClick={() => handleEditVisit(v)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white rounded text-zinc-400 transition-all"
                          >
                            <Edit size={12} />
                          </button>
                          <button 
                            onClick={() => handleDeleteVisit(v.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white rounded text-rose-400 transition-all"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-bold text-zinc-800 text-sm mb-1">{v.clientName}</h4>
                      <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                        <MapPin size={12} /> {v.address}
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                          v.purpose === 'General Visit' ? 'border-brand-primary/20 bg-brand-primary/5 text-brand-primary' :
                          v.purpose === 'Training' ? 'border-orange-100 bg-orange-50 text-orange-600' :
                          v.purpose === 'New Prospect' ? 'border-emerald-100 bg-emerald-50 text-emerald-600' :
                          v.purpose === 'New Deployment' ? 'border-purple-100 bg-purple-50 text-purple-600' :
                          'border-slate-100 bg-slate-50 text-slate-600'
                        }`}>
                          {v.purpose}
                        </span>
                        <select 
                          value={v.status}
                          onChange={(e) => updateVisitStatus(v.id, e.target.value as any)}
                          className="text-[10px] bg-white border border-slate-200 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                        >
                          <option value="Scheduled">Scheduled</option>
                          <option value="Completed">Completed</option>
                          <option value="Pending">Pending</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                      <Calendar size={20} />
                    </div>
                    <p className="text-xs text-slate-400">No visits scheduled for this day</p>
                  </div>
                )
              ) : (
                <div className="text-center py-12">
                  <p className="text-xs text-slate-400">Click on a date to see details</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-brand-primary rounded-3xl p-6 text-white shadow-lg shadow-brand-primary/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <h3 className="font-bold mb-4 flex items-center gap-2 relative z-10">
              <Activity size={18} />
              Monthly Overview
            </h3>
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div>
                <p className="text-white/80 text-[10px] uppercase font-bold mb-1">Total Visits</p>
                <p className="text-2xl font-bold">{visits.length}</p>
              </div>
              <div>
                <p className="text-white/80 text-[10px] uppercase font-bold mb-1">Completed</p>
                <p className="text-2xl font-bold">{visits.filter(v => v.status === 'Completed').length}</p>
              </div>
            </div>
          </div>

          {/* Upcoming Reminders */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Bell size={18} className="text-amber-500" />
              Upcoming Reminders
            </h3>
            <div className="space-y-3">
              {visits.filter(v => v.reminder && new Date(v.planDate) >= new Date()).length > 0 ? (
                visits
                  .filter(v => v.reminder && new Date(v.planDate) >= new Date())
                  .sort((a, b) => new Date(a.planDate).getTime() - new Date(b.planDate).getTime())
                  .slice(0, 3)
                  .map(v => (
                    <div key={v.id} className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50 border border-amber-100">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-amber-500 shadow-sm">
                        <Clock size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{v.clientName}</p>
                        <p className="text-[10px] text-slate-500">
                          {new Date(v.planDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">No upcoming reminders</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Visit Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    {editingId ? <Edit size={20} /> : <Plus size={20} />}
                  </div>
                  <h3 className="font-bold text-slate-800">{editingId ? 'Edit Field Visit' : 'Schedule New Field Visit'}</h3>
                </div>
                <button onClick={() => { setShowForm(false); setEditingId(null); }} className="p-2 hover:bg-white rounded-xl text-slate-400 transition-all">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSaveVisit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Client Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.clientName || ''}
                      onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-sm"
                      placeholder="Enter client name"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Client Type</label>
                    <select 
                      value={formData.clientType}
                      onChange={e => setFormData({ ...formData, clientType: e.target.value as any })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm bg-white"
                    >
                      <option value="Existing">Existing</option>
                      <option value="New">New</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Task</label>
                    <select 
                      value={formData.purpose}
                      onChange={e => setFormData({ ...formData, purpose: e.target.value as any })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm bg-white"
                    >
                      <option value="General Visit">General Task</option>
                      <option value="Training">Training</option>
                      <option value="New Prospect">New Prospect</option>
                      <option value="New Deployment">New Deployment</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Address</label>
                    <input 
                      type="text" 
                      required
                      value={formData.address || ''}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-sm"
                      placeholder="Visit location"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Planned Date</label>
                    <input 
                      type="date" 
                      required
                      value={formData.planDate ? formData.planDate.split('T')[0] : ''}
                      onChange={e => setFormData({ ...formData, planDate: new Date(e.target.value).toISOString() })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Status</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm bg-white"
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Pending">Pending</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <input 
                      type="checkbox" 
                      id="visit-reminder"
                      checked={formData.reminder}
                      onChange={e => setFormData({ ...formData, reminder: e.target.checked })}
                      className="w-4 h-4 text-brand-primary rounded border-slate-300 focus:ring-brand-primary"
                    />
                    <label htmlFor="visit-reminder" className="text-sm font-medium text-slate-600">Set Reminder</label>
                  </div>
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 text-sm hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-xl bg-emerald-500 text-white text-[10px] font-bold hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/10 uppercase tracking-widest"
                  >
                    {editingId ? 'Update Visit' : 'Schedule Visit'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DateTimeDisplay = ({ showDate = true }: { showDate?: boolean }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!showDate) {
    return <span>{time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>;
  }

  return (
    <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
      <div className="flex items-center gap-1.5">
        <Calendar size={16} className="text-brand-primary" />
        <span>{time.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Clock size={16} className="text-brand-primary" />
        <span>{time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
      </div>
    </div>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Auth and User Profile Sync
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, fetch profile from Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        const unsubscribeUser = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: userData.name || firebaseUser.displayName || 'User',
              role: userData.role || 'User',
              branch: userData.branch || 'Delhi Branch',
              region: userData.region || 'North',
              portal: userData.portal || 'RMS',
              ...userData
            });
            setIsLoggedIn(true);
          } else {
            // New user, create default profile
            const defaultProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || 'User',
              role: 'User',
              branch: 'Delhi Branch',
              region: 'North',
              portal: 'RMS',
              createdAt: new Date().toISOString()
            };
            setDoc(userRef, defaultProfile);
            setUser(defaultProfile);
            setIsLoggedIn(true);
          }
          setIsAuthReady(true);
          setLoading(false);
        });
        return () => unsubscribeUser();
      } else {
        // User is signed out
        setUser(null);
        setIsLoggedIn(false);
        setIsAuthReady(true);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Real-time Tasks Sync
  useEffect(() => {
    if (!isLoggedIn || !user) return;

    const tasksRef = collection(db, 'tasks');
    let q = query(tasksRef, orderBy('date', 'desc'));

    // Filter based on role
    if (user.role === 'Branch') {
      q = query(tasksRef, where('branch', '==', user.branch), orderBy('date', 'desc'));
    } else if (user.role !== 'Management' && user.role !== 'Master' && user.role !== 'admin') {
      q = query(tasksRef, where('assignedTo', '==', user.name), orderBy('date', 'desc'));
    }

    const unsubscribeTasks = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksData);
    });

    return () => unsubscribeTasks();
  }, [isLoggedIn, user]);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const [activeTab, setActiveTab] = useState<'rms' | 'fsm'>('rms');
  const [fsmUserType, setFsmUserType] = useState<'CISS' | 'Client User'>('CISS');
  const [role, setRole] = useState('');
  const [clientCode, setClientCode] = useState('');
  const [loginRegion, setLoginRegion] = useState('North');
  const [loginBranch, setLoginBranch] = useState('Delhi Branch');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isDutyOn, setIsDutyOn] = useState(false);
  const [activeModule, setActiveModule] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [allRegionalData, setAllRegionalData] = useState([
    { Region: "East", "Active Branches": 12, "Avg Efficiency": "94%", "Pending Audits": 5 },
    { Region: "West", "Active Branches": 8, "Avg Efficiency": "91%", "Pending Audits": 4 },
    { Region: "North", "Active Branches": 4, "Avg Efficiency": "89%", "Pending Audits": 3 }
  ]);

  const [gtmLogs, setGtmLogs] = useState<any[]>([]);
  const [gtfLogs, setGtfLogs] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);

  const [leads, setLeads] = useState([
    { id: 1, name: 'Rahul Sharma', company: 'Tech Innovators', location: 'Mumbai', designation: 'CTO', contact: '9876543210', email: 'rahul@tech.com', status: 'New', creationDate: '2026-03-20', vertical: 'MG' },
    { id: 2, name: 'Priya Patel', company: 'Global Logistics', location: 'Delhi', designation: 'Manager', contact: '9876543211', email: 'priya@global.com', status: 'Contacted', creationDate: '2026-03-20', vertical: 'ESS' },
    { id: 3, name: 'Amit Kumar', company: 'Sunrise Retail', location: 'Kolkata', designation: 'CEO', contact: '9876543212', email: 'amit@sunrise.com', status: 'Qualified', creationDate: '2026-03-20', vertical: 'FMS' },
  ]);

  const [deals, setDeals] = useState([
    { id: 1, name: 'Enterprise ERP', client: 'Tech Solutions Ltd', value: 25, stage: 'Prospecting', days: 12, branch: 'Delhi Branch' },
    { id: 2, name: 'Cloud Migration', client: 'Global Retail Corp', value: 15, stage: 'Qualification', days: 5, branch: 'Delhi Branch' },
    { id: 3, name: 'Security Audit', client: 'Sunrise Enterprises', value: 8, stage: 'Proposal', days: 3, branch: 'Delhi Branch' },
    { id: 4, name: 'Network Upgrade', client: 'Modern Systems', value: 12, stage: 'Negotiation', days: 8, branch: 'Delhi Branch' },
    { id: 5, name: 'Annual Support', client: 'Reliance Industries', value: 45, stage: 'Closed Won', days: 20, branch: 'Delhi Branch' },
  ]);

  const [users, setUsers] = useState([
    { id: 'U001', name: 'Amit Sharma', role: 'Master', email: 'amit@fortia.com', status: 'Active', isOnline: true, lastLogin: 'Just now', vertical: 'Security Services', branches: ['Head Office'], region: 'North', reportingManager: 'N/A' },
    { id: 'U003', name: 'Rahul Varma', role: 'Operations', email: 'rahul@fortia.com', status: 'Active', isOnline: true, lastLogin: 'Just now', vertical: 'Facility Management', branches: ['Delhi Branch'], region: 'North', reportingManager: 'Karan Malhotra', lat: 28.62, lng: 77.21 },
    { id: 'U004', name: 'Sanjay Gupta', role: 'Accounts', email: 'sanjay@fortia.com', status: 'Active', isOnline: true, lastLogin: '5 mins ago', vertical: 'Cash Logistics', branches: ['Delhi Branch'], region: 'North', reportingManager: 'Karan Malhotra' },
    { id: 'U005', name: 'Neha Singh', role: 'Sales', email: 'neha@fortia.com', status: 'Active', isOnline: true, lastLogin: '1 hour ago', vertical: 'Security Services', branches: ['Kolkata Branch'], region: 'East', reportingManager: 'Amit Sharma' },
    { id: 'U006', name: 'Vikram Rao', role: 'Operations', email: 'vikram@fortia.com', status: 'Active', isOnline: true, lastLogin: '10 mins ago', vertical: 'Security Services', branches: ['Delhi Branch'], region: 'North', reportingManager: 'Karan Malhotra', lat: 28.60, lng: 77.23 },
    { id: 'U007', name: 'Anjali Desai', role: 'Sales', email: 'anjali@fortia.com', status: 'Active', isOnline: false, lastLogin: '3 hours ago', vertical: 'Facility Management', branches: ['Mumbai Branch'], region: 'West', reportingManager: 'Amit Sharma' },
    { id: 'U008', name: 'Karan Malhotra', role: 'Branch', email: 'karan@fortia.com', status: 'Active', isOnline: true, lastLogin: 'Just now', vertical: 'Cash Logistics', branches: ['Delhi Branch'], region: 'North', reportingManager: 'Amit Sharma' },
    { id: 'U009', name: 'Sonal Mehra', role: 'Operations', email: 'sonal@fortia.com', status: 'Active', isOnline: true, lastLogin: '15 mins ago', vertical: 'Delhi Branch', region: 'North', reportingManager: 'Karan Malhotra', lat: 28.63, lng: 77.19 },
    { id: 'U010', name: 'Arjun Reddy', role: 'Sales', email: 'arjun@fortia.com', status: 'Active', isOnline: true, lastLogin: '5 mins ago', vertical: 'Security Services', branches: ['Hyderabad Branch'], region: 'South', reportingManager: 'Amit Sharma' },
    { id: 'U011', name: 'Priya Nair', role: 'HR', email: 'priya@fortia.com', status: 'Active', isOnline: true, lastLogin: 'Just now', vertical: 'Security Services', branches: ['Head Office'], region: 'North', reportingManager: 'Amit Sharma' },
  ]);

  const [assets, setAssets] = useState([
    { id: 'Laptop01', name: 'Dell Laptop', category: 'IT', issuedTo: 'Unassigned', valuation: '36,000', branch: 'Delhi Branch' },
    { id: 'AC_01', name: 'Career AC 2 Ton', category: 'FIXED', issuedTo: 'Unassigned', valuation: '48,000', branch: 'Delhi Branch' },
    { id: 'Laptop02', name: 'HP Laptop', category: 'IT', issuedTo: 'Neha Singh', valuation: '42,000', branch: 'Kolkata Branch' },
  ]);

  const [invoiceData, setInvoiceData] = useState([
    { id: 'INV-2026-001', client: 'Reliance Industries', amount: '₹ 12,50,000', date: '25 Mar 2026', status: 'Paid', vertical: 'MG', dueDate: '2026-04-10', branch: 'Delhi Branch' },
    { id: 'INV-2026-002', client: 'Tata Consultancy', amount: '₹ 8,20,000', date: '28 Mar 2026', status: 'Pending', vertical: 'ESS', dueDate: '2026-04-15', branch: 'Delhi Branch' },
    { id: 'INV-2026-003', client: 'HDFC Bank', amount: '₹ 15,00,000', date: '02 Apr 2026', status: 'Overdue', vertical: 'FMS', dueDate: '2026-04-20', branch: 'Kolkata Branch' },
  ]);

  const [payments, setPayments] = useState([
    { id: 'PAY-001', client: 'Reliance Industries', amount: '₹ 12,50,000', date: '26 Mar 2026', method: 'NEFT', branch: 'Delhi Branch' },
    { id: 'PAY-002', client: 'Modern Systems', amount: '₹ 5,00,000', date: '27 Mar 2026', method: 'Cheque', branch: 'Delhi Branch' },
  ]);

  const [budgets, setBudgets] = useState([
    { head: 'Business Promotion', allocated: 500000, utilized: 350000, branch: 'Delhi Branch' },
    { head: 'Stationary', allocated: 50000, utilized: 42000, branch: 'Delhi Branch' },
    { head: 'Assets', allocated: 5000000, utilized: 4200000, branch: 'Delhi Branch' },
    { head: 'Business Promotion', allocated: 300000, utilized: 150000, branch: 'Kolkata Branch' },
  ]);

  const [stockData, setStockData] = useState([
    { date: '2026-03-20', item: 'Shirt', size: 'L', qty: 100, rate: 450, amount: 45000, branch: 'Delhi Branch' },
    { date: '2026-03-20', item: 'Trouser', size: '34', qty: 80, rate: 600, amount: 48000, branch: 'Delhi Branch' },
    { date: '2026-03-20', item: 'Shoes', size: '9', qty: 50, rate: 800, amount: 40000, branch: 'Kolkata Branch' },
  ]);

  const [issueData, setIssueData] = useState([
    { date: '2026-03-21', empId: 'EMP001', empName: 'John Doe', unit: 'Delhi Branch', item: 'Shirt', qty: 2, branch: 'Delhi Branch' },
  ]);

  const handleLeadQualified = (lead: any) => {
    // Check if a deal already exists for this client to avoid duplicates
    if (deals.some(d => d.client === lead.company)) return;

    const newDeal = {
      id: Date.now(),
      name: `${lead.company} - New Deal`,
      client: lead.company,
      value: 0,
      stage: 'Prospecting',
      days: 1,
      branch: user?.branch || 'Delhi Branch'
    };
    setDeals(prev => [newDeal, ...prev]);
  };

  const generalRoles = [
    'Master', 'Management', 'Branch', 'HR', 'IT', 'Sales', 'Operations', 'Accounts'
  ];

  const cissFsmRoles = ['Master Admin', 'Supervisor', 'Security Personnel'];
  const clientFsmRoles = ['Admin', 'Security Officer', 'Unit In-charge Security Person'];

  const [fsmRole, setFsmRole] = useState('');

  const branchesByRegion: Record<string, string[]> = {
    North: ['Delhi Branch', 'Chandigarh Branch', 'Jaipur Branch'],
    South: ['Chennai Branch', 'Bangalore Branch', 'Hyderabad Branch'],
    East: ['Kolkata Branch', 'Bhubaneswar Branch', 'Patna Branch'],
    West: ['Mumbai Branch', 'Pune Branch', 'Ahmedabad Branch']
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRegion = e.target.value;
    setLoginRegion(newRegion);
    setLoginBranch(branchesByRegion[newRegion][0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return { text: 'Good Morning', icon: <Sunrise className="text-amber-500" size={24} /> };
    if (hour >= 12 && hour < 17) return { text: 'Good Afternoon', icon: <Sun className="text-orange-500" size={24} /> };
    if (hour >= 17 && hour < 21) return { text: 'Good Evening', icon: <Sunset className="text-rose-500" size={24} /> };
    return { text: 'Good Night', icon: <Moon className="text-indigo-400" size={24} /> };
  };

  const greeting = getGreeting();

  const getSidebarItems = (role: string, portal: string = 'RMS') => {
    if (portal === 'FSM') {
      const fsmBase = [
        { icon: <LayoutDashboard size={20} />, label: 'FSM Dashboard' },
        { icon: <Map size={20} />, label: 'Real-time Patrolling' },
        { icon: <ClipboardList size={20} />, label: 'Incident Logs' },
        { icon: <FileText size={20} />, label: 'Patrol Reports' },
      ];

      if (role === 'Master Admin' || role === 'Admin') {
        return [
          ...fsmBase,
          { icon: <Settings size={20} />, label: 'Area Configuration' },
          { icon: <Users size={20} />, label: 'FSM User Management' },
          { icon: <Download size={20} />, label: 'Download Center' },
        ];
      }

      if (role === 'Supervisor' || role === 'Security Officer') {
        return [
          ...fsmBase,
          { icon: <UserPlus size={20} />, label: 'Beat Assignment' },
          { icon: <UserPlus size={20} />, label: 'Personnel Registration' },
          { icon: <Download size={20} />, label: 'Download Center' },
        ];
      }

      return [
        ...fsmBase,
        { icon: <Download size={20} />, label: 'Download Center' },
      ];
    }

    const baseItems = [
      { icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    ];

    const leaveItem = { icon: <Calendar size={20} />, label: 'Leave Application' };

    if (role === 'Master') {
      return [
        ...baseItems,
        { icon: <Globe size={20} />, label: 'Regional View' },
        { icon: <MapPin size={20} />, label: 'Branch Management' },
        { icon: <Users size={20} />, label: 'User Management' },
        { icon: <Package size={20} />, label: 'Asset Management' },
        leaveItem
      ];
    }

    if (role === 'Management') {
      return [
        ...baseItems,
        { icon: <ClipboardList size={20} />, label: 'Task Management' },
        { icon: <Globe size={20} />, label: 'Regional View' },
        { icon: <MapPin size={20} />, label: 'Branch Management' },
        { icon: <Users size={20} />, label: 'User Management' },
        { icon: <Package size={20} />, label: 'Asset Management' },
        leaveItem
      ];
    }

    if (role === 'Accounts') {
      return [
        ...baseItems,
        { icon: <Receipt size={20} />, label: 'Invoices' },
        { icon: <Calculator size={20} />, label: 'Budgeting' },
        { icon: <Shirt size={20} />, label: 'Uniform Management' },
        { icon: <FileText size={20} />, label: 'Financial Reports' },
        leaveItem
      ];
    }

    if (role === 'Sales') {
      return [
        ...baseItems,
        { icon: <Users size={20} />, label: 'Lead Management' },
        { icon: <Target size={20} />, label: 'Sales Pipeline' },
        { icon: <Calendar size={20} />, label: 'Sales Planner' },
        { icon: <Navigation size={20} />, label: 'Go To Market' },
        { icon: <Wallet size={20} />, label: 'Expense Management' },
        leaveItem
      ];
    }

    if (role === 'Operations') {
      return [
        ...baseItems,
        { icon: <UserPlus size={20} />, label: 'Security Recruitment' },
        { icon: <BookOpen size={20} />, label: 'Training Planner' },
        { icon: <Navigation size={20} />, label: 'Field Visit Planner' },
        { icon: <MapPin size={20} />, label: 'Go To Field' },
        leaveItem
      ];
    }

    if (role === 'Field Service') {
      return [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { icon: <Shield size={20} />, label: 'Guard Patrol' },
        { icon: <Navigation size={20} />, label: 'Field Visit' },
        { icon: <Calendar size={20} />, label: 'Leave Application' }
      ];
    }

    if (role === 'Branch') {
      return [
        ...baseItems,
        { icon: <Users size={20} />, label: 'User Management' },
        { icon: <Package size={20} />, label: 'Asset Management' },
        { icon: <MapPin size={20} />, label: 'Branch Management' },
        leaveItem
      ];
    }

    if (role === 'HR') {
      return [
        ...baseItems,
        { icon: <UserPlus size={20} />, label: 'Employee Onboarding' },
        { icon: <Target size={20} />, label: 'Recruitment Planning' },
        { icon: <BookOpen size={20} />, label: 'Training Planner' },
        { icon: <FileText size={20} />, label: 'HR Reports' },
        { icon: <Folder size={20} />, label: 'HR Repository' },
        leaveItem
      ];
    }

    if (role === 'IT') {
      return [
        ...baseItems,
        { icon: <Users size={20} />, label: 'User Management' },
        { icon: <Package size={20} />, label: 'Asset Management' },
        leaveItem
      ];
    }

    return [
      ...baseItems,
      { icon: <Users size={20} />, label: 'User Management' },
      { icon: <Package size={20} />, label: 'Asset Management' },
      { icon: <MapPin size={20} />, label: 'Branch Management' },
      leaveItem
    ];
  };

  if (isLoggedIn && user) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-zinc-50/50 font-sans text-zinc-900">
        {/* Top Navigation Bar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-50">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
            {/* Left Section: Branding */}
            <div className="flex items-center gap-4 md:gap-8">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden p-2 hover:bg-zinc-100 rounded-lg text-zinc-600 transition-colors"
              >
                <Menu size={20} />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white font-bold">
                  {user.portal === 'FSM' ? 'F' : 'R'}
                </div>
                <h1 className="text-xl font-bold text-zinc-950 tracking-tight">
                  Fortia <span className="text-zinc-500">{user.portal}</span> <span className="text-[10px] font-medium bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded ml-1">V-01</span>
                </h1>
              </div>

              {user.clientLogo && (
                <>
                  <div className="h-8 w-px bg-zinc-200 hidden md:block" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 p-1 flex items-center justify-center overflow-hidden shadow-sm">
                      <img src={user.clientLogo} alt="Client Logo" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">Client Portal</p>
                      <p className="text-xs font-bold text-zinc-800">{user.clientCode}</p>
                    </div>
                  </div>
                </>
              )}

              <div className="h-8 w-px bg-zinc-200 hidden md:block" />

              {/* Greeting Section */}
              <div className="hidden md:flex items-center gap-3">
                {greeting.icon}
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">{greeting.text}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-zinc-800">{user.name}</span>
                    <span className="text-[10px] font-bold bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full uppercase tracking-wider">{user.role}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Section: Date & Time */}
            <div className="hidden lg:flex items-center gap-6 bg-zinc-50 px-6 py-2 rounded-full border border-zinc-200/50">
              <div className="flex items-center gap-2 text-zinc-500">
                <Calendar size={14} className="text-zinc-400" />
                <span className="text-xs font-semibold">
                  {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="w-px h-3 bg-zinc-200" />
              <div className="flex items-center gap-2 text-zinc-500">
                <Clock size={14} className="text-zinc-400" />
                <span className="text-xs font-bold tabular-nums">
                  <DateTimeDisplay showDate={false} />
                </span>
              </div>
            </div>

            {/* Right Section: Actions */}
            <div className="flex items-center gap-3">
              {/* Duty Toggle */}
              <button 
                onClick={() => setIsDutyOn(!isDutyOn)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                  isDutyOn 
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                    : 'bg-rose-50 text-rose-600 border border-rose-100'
                }`}
              >
                <Power size={14} className={isDutyOn ? 'animate-pulse' : ''} />
                <span>DUTY {isDutyOn ? 'ON' : 'OFF'}</span>
              </button>

              <div className="h-8 w-px bg-zinc-200 mx-1" />

              {/* Log Off */}
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 uppercase tracking-widest transition-all"
              >
                <LogOut size={14} />
                <span>LOG OFF</span>
              </button>

              <div className="w-10 h-10 rounded-full bg-zinc-100 border-2 border-white shadow-sm flex items-center justify-center text-zinc-600 overflow-hidden ml-2">
                <UserCircle size={28} />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-[1600px] mx-auto p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar Navigation */}
            <aside className={`
              lg:col-span-3 space-y-2 
              fixed inset-0 z-[60] lg:relative lg:inset-auto
              transition-transform duration-300 ease-in-out
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
              {/* Mobile Overlay */}
              {isSidebarOpen && (
                <div 
                  className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm lg:hidden"
                  onClick={() => setIsSidebarOpen(false)}
                />
              )}
              
              <div className="bg-white h-full lg:h-auto rounded-r-2xl lg:rounded-2xl border-r lg:border border-zinc-200 p-4 shadow-2xl lg:shadow-sm sticky top-0 lg:top-24 w-72 lg:w-full z-[70] overflow-y-auto">
                <div className="flex items-center justify-between mb-6 lg:mb-4">
                  <div className="flex items-center gap-2 lg:hidden">
                    <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white font-bold">F</div>
                    <span className="font-bold text-zinc-900">Fortia RMS</span>
                  </div>
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden p-2 hover:bg-zinc-100 rounded-xl text-zinc-400"
                  >
                    <X size={20} />
                  </button>
                </div>
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-4 px-2">Main Menu</p>
                <nav className="space-y-1">
                  {getSidebarItems(user.role, user.portal).map((item, i) => (
                    <button 
                      key={i}
                      onClick={() => {
                        if (!isDutyOn) return;
                        setActiveModule(item.label);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                        activeModule === item.label 
                          ? 'sidebar-item-active' 
                          : 'sidebar-item-inactive'
                      } ${!isDutyOn ? 'opacity-50 cursor-not-allowed grayscale pointer-events-none' : ''}`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Dashboard Content */}
            <div className="lg:col-span-9 space-y-8">
              {!isDutyOn ? (
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-12 md:p-20 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[600px]">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50/50 rounded-full blur-3xl -mr-32 -mt-32" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-50/50 rounded-full blur-3xl -ml-32 -mb-32" />
                  
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-24 h-24 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mb-8 border border-rose-100 shadow-xl shadow-rose-500/10 relative z-10"
                  >
                    <Power size={48} className="animate-pulse" />
                  </motion.div>
                  
                  <h2 className="text-3xl font-bold text-slate-900 mb-4 uppercase tracking-tight relative z-10">Duty Status: OFF</h2>
                  <p className="text-slate-500 max-w-md mx-auto mb-10 leading-relaxed text-lg relative z-10">
                    Access to dashboards and operational modules is restricted while you are off duty. 
                    Please toggle your status to <span className="font-bold text-emerald-600">DUTY ON</span> to continue.
                  </p>
                  
                  <button 
                    onClick={() => setIsDutyOn(true)}
                    className="px-10 py-5 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/20 flex items-center gap-3 group relative z-10"
                  >
                    <Power size={18} />
                    Toggle Duty ON
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ) : activeModule === 'Dashboard' ? (
                <>
                  {user.role === 'Management' ? (
                    <ManagementDashboard 
                      tasks={tasks} 
                      setTasks={setTasks} 
                      userName={user.name} 
                      users={users}
                      userBranch={user.branches?.[0] || 'Head Office'}
                      payments={payments}
                    />
                  ) : user.role === 'Operations' ? (
                    <OperationsDashboard 
                      tasks={tasks} 
                      setTasks={setTasks} 
                      userName={user.name} 
                      users={users}
                    />
                  ) : user.role === 'Field Service' ? (
                    <GuardPatrolDashboard />
                  ) : user.role === 'Client' ? (
                    <ClientDashboard />
                  ) : user.role === 'Branch' ? (
                    <BranchDashboard 
                      users={users} 
                      userBranch={user.branches?.[0] || 'Head Office'} 
                      userName={user.name} 
                      userRole={user.role}
                      leads={leads} 
                      deals={deals}
                      assets={assets}
                      invoiceData={invoiceData}
                      payments={payments}
                      budgets={budgets}
                      stockData={stockData}
                      setActiveModule={setActiveModule}
                      tasks={tasks}
                      setTasks={setTasks}
                    />
                  ) : user.role === 'IT' ? (
                    <ITDashboard users={users} />
                  ) : user.role === 'HR' ? (
                    <HRDashboard users={users} />
                  ) : user.role === 'Sales' ? (
                    <SalesDashboard userRegion={user.region} leads={leads} deals={deals} expenses={expenses} />
                  ) : user.role === 'Accounts' ? (
                    <AccountsDashboard setActiveModule={setActiveModule} />
                  ) : (
                    <>
                      {/* Stats Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <StatCard 
                          icon={Users}
                          title="Total Users Registered"
                          value="14"
                          subtext="In System Registry"
                          colorClass="text-emerald-500"
                          bgClass="bg-emerald-50/50"
                        />
                        <StatCard 
                          icon={Target}
                          title="System Active Users"
                          value="3"
                          subtext="Real-time Duty Status"
                          colorClass="text-slate-700"
                          bgClass="bg-slate-50/50"
                        />
                        <StatCard 
                          icon={Activity}
                          title="Global Duty Coverage"
                          value="21.4%"
                          subtext="Resource Utilization"
                          colorClass="text-sky-600"
                          bgClass="bg-sky-50/50"
                        />
                      </div>

                      {/* Regional Presence Section */}
                      <RegionalPresenceCard regionalData={allRegionalData} />
                    </>
                  )}
                </>
              ) : activeModule === 'Task Management' ? (
                <TaskManagement 
                  tasks={tasks}
                  setTasks={setTasks}
                  userBranch={user.branches?.[0] || 'Head Office'}
                  userName={user.name}
                  users={users}
                  role={user.role}
                />
              ) : activeModule === 'User Management' ? (
                <UserManagement 
                  userRole={user.role} 
                  userBranches={user.branches} 
                  userName={user.name} 
                  users={users}
                  setUsers={setUsers}
                />
              ) : activeModule === 'Asset Management' ? (
                <AssetManagement 
                  assets={assets} 
                  setAssets={setAssets} 
                  userRole={user.role}
                  userName={user.name}
                  users={users}
                />
              ) : activeModule === 'Regional View' ? (
                <RegionalView 
                  userRole={user.role} 
                  userRegion={user.region} 
                  allRegionalData={allRegionalData}
                  setAllRegionalData={setAllRegionalData}
                />
              ) : activeModule === 'Branch Management' ? (
                <BranchManagement userRole={user.role} setActiveModule={setActiveModule} />
              ) : activeModule === 'Invoices' ? (
                <Invoices invoiceData={invoiceData} setInvoiceData={setInvoiceData} />
              ) : activeModule === 'Budgeting' ? (
                <Budgeting budgets={budgets} setBudgets={setBudgets} />
              ) : activeModule === 'Uniform Management' ? (
                <UniformManagement 
                  stockData={stockData} 
                  setStockData={setStockData} 
                  issueData={issueData} 
                  setIssueData={setIssueData} 
                />
              ) : activeModule === 'Financial Reports' ? (
                <FinancialReports />
              ) : activeModule === 'Lead Management' ? (
                <LeadManagement 
                  userRegion={user.region} 
                  leads={leads} 
                  setLeads={setLeads} 
                  onQualified={handleLeadQualified}
                />
              ) : activeModule === 'Sales Pipeline' ? (
                <SalesPipeline 
                  userRegion={user.region} 
                  userBranch={user.branch} 
                  deals={deals} 
                  setDeals={setDeals}
                />
              ) : activeModule === 'Sales Planner' ? (
                <SalesPlanner leads={leads} />
              ) : activeModule === 'Go To Market' ? (
                <GoToMarket 
                  leads={leads} 
                  gtmLogs={gtmLogs} 
                  setGtmLogs={setGtmLogs} 
                  expenses={expenses}
                  setExpenses={setExpenses}
                  user={user}
                  users={users}
                />
              ) : activeModule === 'Go To Field' ? (
                <GoToField gtfLogs={gtfLogs} setGtfLogs={setGtfLogs} deals={deals} user={user} />
              ) : activeModule === 'Expense Management' ? (
                <ExpenseManagement expenses={expenses} setExpenses={setExpenses} />
              ) : activeModule === 'Leave Application' ? (
                <LeaveApplication />
              ) : activeModule === 'Guard Patrol' ? (
                <GuardPatrolModule />
              ) : activeModule === 'Field Visit' || activeModule === 'Field Visit Planner' ? (
                <FieldVisitModule title={activeModule === 'Field Visit Planner' ? 'Field Visit Planner' : 'Field Visit Management'} />
              ) : activeModule === 'Training Planner' ? (
                <TrainingPlanner />
              ) : activeModule === 'HR Reports' ? (
                <HRReports />
              ) : activeModule === 'HR Repository' ? (
                <HRRepository />
              ) : activeModule === 'Employee Onboarding' ? (
                <EmployeeOnboarding branches={Object.values(branchesByRegion).flat()} />
              ) : activeModule === 'Recruitment Planning' ? (
                <RecruitmentPlanning branches={Object.values(branchesByRegion).flat()} />
              ) : activeModule === 'Security Recruitment' ? (
                <SecurityPersonnelRecruitment userBranch={user.branches?.[0] || 'Head Office'} />
              ) : activeModule === 'FSM Dashboard' ? (
                <FSMDashboard role={user.role} />
              ) : activeModule === 'Real-time Patrolling' ? (
                <RealTimePatrolling apiKey={MAPS_API_KEY} />
              ) : activeModule === 'FSM User Management' ? (
                <FSMUserManagement />
              ) : activeModule === 'Beat Assignment' ? (
                <BeatAssignment />
              ) : activeModule === 'Personnel Registration' ? (
                <PersonnelRegistration />
              ) : activeModule === 'Incident Logs' ? (
                <IncidentLogs />
              ) : activeModule === 'Patrol Reports' ? (
                <PatrolReports />
              ) : activeModule === 'Area Configuration' ? (
                <AreaConfiguration />
              ) : activeModule === 'Download Center' ? (
                <DownloadCenter userType={user.portal} />
              ) : activeModule === 'Performance Reports' ? (
                <PerformanceReports userRegion={user.region} />
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200 p-20 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/50 rounded-full blur-3xl -mr-16 -mt-16" />
                  
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-6 border border-white shadow-sm"
                  >
                    <Settings size={32} />
                  </motion.div>
                  <h2 className="text-xl font-bold text-slate-800 mb-2">{activeModule} Module</h2>
                  <p className="text-slate-400 max-w-xs mx-auto text-sm">
                    This module is currently under development. Please check back later.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col lg:flex-row font-sans text-slate-900 bg-slate-50">
      {/* Left Panel - 30% */}
      <div className="w-full lg:w-[30%] xl:w-[25%] bg-[#0E2C49] p-6 md:p-10 lg:p-12 flex flex-col justify-center lg:justify-between relative overflow-hidden min-h-[350px] lg:min-h-screen">
        {/* Decorative background elements */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-sky-400/10 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" 
        />

        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 lg:mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
              FORTIA
            </h1>
            <div className="h-1.5 w-16 bg-sky-400 mt-4 rounded-full" />
            <p className="mt-4 lg:mt-6 text-sky-100 font-semibold text-lg opacity-90">
              Resource Management System
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-4">
            <ServiceBlock icon={Package} title="Asset Tracking" description="Inventory & resource allocation" />
            <ServiceBlock icon={TrendingUp} title="Sales Analytics" description="Revenue & lead tracking" />
            <ServiceBlock icon={Settings} title="Operations" description="Workflow & process control" />
            <ServiceBlock icon={MapPin} title="Field Service" description="On-site task management" />
            <ServiceBlock icon={CreditCard} title="Accounts" description="Financial reporting & billing" />
          </div>
        </div>

        <div className="mt-8 lg:mt-12 relative z-10 hidden lg:block">
          <p className="text-[10px] text-sky-100/40 font-bold uppercase tracking-widest leading-relaxed">
            © 2026 FORTIA. All rights reserved.<br/>Portal developed by CISS-ESS Team
          </p>
        </div>
      </div>

      {/* Right Panel - 70% */}
      <div className="w-full lg:w-[70%] xl:w-[75%] flex flex-col min-h-screen bg-slate-50/50">
        {/* Dynamic Header */}
        <header className="px-6 md:px-12 py-4 md:py-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-200/30 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Status: Online</span>
          </div>
          <DateTimeDisplay />
        </header>

        {/* Login Section */}
        <main className="flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-sm lg:max-w-md"
          >
            <div className="bg-[#9ECAE1] rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] border border-slate-200 overflow-hidden backdrop-blur-xl">
              <div className="p-3 md:p-6 text-center border-b border-slate-200 bg-white/30">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Enterprise Portal</h2>
                <p className="text-slate-600 text-[10px] mt-0.5 font-medium">Secure authentication for authorized personnel</p>
              </div>

              {/* Tab Switcher */}
              <div className="flex border-b border-slate-200 p-1.5 bg-white/20">
                <button 
                  onClick={() => { setActiveTab('rms'); setRole(''); }}
                  className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'rms' ? 'text-brand-primary bg-white shadow-sm ring-1 ring-slate-200' : 'text-slate-600 hover:text-slate-800'}`}
                >
                  RMS Access
                </button>
                <button 
                  onClick={() => { setActiveTab('fsm'); setRole('Field Service'); }}
                  className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'fsm' ? 'text-brand-primary bg-white shadow-sm ring-1 ring-slate-200' : 'text-slate-600 hover:text-slate-800'}`}
                >
                  FSM Access
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-3 md:space-y-4">
                {activeTab === 'rms' && (
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between ml-1">
                        <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">User Role</label>
                        {role === 'Management' && (
                          <motion.span 
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-[9px] font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full border border-brand-primary/20 uppercase tracking-wider"
                          >
                            Privileged Access
                          </motion.span>
                        )}
                      </div>
                      <div className="relative group">
                        <select 
                          required
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="w-full bg-white/50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-900 focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all outline-none appearance-none font-medium group-hover:bg-white/80"
                        >
                          <option value="" disabled className="bg-white">Select Authorization Level</option>
                          {generalRoles.map(r => (
                            <option key={r} value={r} className="bg-white">{r}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                          <ChevronRight size={18} className="rotate-90" />
                        </div>
                      </div>
                    </div>
                    
                    {role === 'Sales' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="grid grid-cols-2 gap-3"
                      >
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Region</label>
                          <div className="relative group">
                            <select 
                              required
                              value={loginRegion}
                              onChange={handleRegionChange}
                              className="w-full bg-white/50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-900 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all outline-none appearance-none font-medium group-hover:bg-white/80"
                            >
                              <option value="North" className="bg-white">North</option>
                              <option value="South" className="bg-white">South</option>
                              <option value="East" className="bg-white">East</option>
                              <option value="West" className="bg-white">West</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                              <ChevronRight size={18} className="rotate-90" />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Branch</label>
                          <div className="relative group">
                            <select 
                              required
                              value={loginBranch}
                              onChange={(e) => setLoginBranch(e.target.value)}
                              className="w-full bg-white/50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-900 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all outline-none appearance-none font-medium group-hover:bg-white/80"
                            >
                              {branchesByRegion[loginRegion].map(branch => (
                                <option key={branch} value={branch} className="bg-white">{branch.split(' ')[0]}</option>
                              ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                              <ChevronRight size={18} className="rotate-90" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {activeTab === 'fsm' && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">FSM User Type</label>
                      <div className="flex gap-3">
                        <button 
                          type="button"
                          onClick={() => { setFsmUserType('CISS'); setFsmRole(''); }}
                          className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${fsmUserType === 'CISS' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 shadow-sm' : 'bg-white/50 border-slate-300 text-slate-600 hover:bg-white/80'}`}
                        >
                          CISS
                        </button>
                        <button 
                          type="button"
                          onClick={() => { setFsmUserType('Client User'); setFsmRole(''); }}
                          className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${fsmUserType === 'Client User' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 shadow-sm' : 'bg-white/50 border-slate-300 text-slate-600 hover:bg-white/80'}`}
                        >
                          Client
                        </button>
                      </div>
                    </div>

                    {fsmUserType === 'Client User' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-1"
                      >
                        <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Client Code</label>
                        <div className="relative group">
                          <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                          <input 
                            type="text"
                            required
                            placeholder="Enter client code"
                            value={clientCode}
                            onChange={(e) => setClientCode(e.target.value)}
                            className="w-full bg-white/50 border border-slate-300 rounded-xl pl-11 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all outline-none font-medium group-hover:bg-white/80"
                          />
                        </div>
                      </motion.div>
                    )}

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">FSM Role</label>
                      <div className="relative group">
                        <select 
                          required
                          value={fsmRole}
                          onChange={(e) => setFsmRole(e.target.value)}
                          className="w-full bg-white/50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-900 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all outline-none appearance-none font-medium group-hover:bg-white/80"
                        >
                          <option value="" disabled className="bg-white">Select FSM Role</option>
                          {(fsmUserType === 'CISS' ? cissFsmRoles : clientFsmRoles).map(r => (
                            <option key={r} value={r} className="bg-white">{r}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                          <ChevronRight size={18} className="rotate-90" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">
                      {activeTab === 'fsm' ? `${fsmUserType} ID` : (role ? `${role} ID` : 'Login ID')}
                    </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                      <input 
                        type="text"
                        required
                        placeholder="Enter identification"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="w-full bg-white/50 border border-slate-300 rounded-xl pl-11 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all outline-none font-medium group-hover:bg-white/80"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Security Key</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                      <input 
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/50 border border-slate-300 rounded-xl pl-11 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all outline-none font-medium group-hover:bg-white/80"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-1">
                  <motion.button 
                    whileHover={{ scale: 1.02, translateY: -1 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full sm:w-auto px-8 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-3 group"
                  >
                    <Shield size={16} className="group-hover:animate-pulse" />
                    Secure Login
                  </motion.button>
                </div>

                <div className="flex flex-col items-center gap-2 pt-1">
                  <div className="h-px w-24 bg-slate-200" />
                  <div className="text-center space-y-0.5">
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                      System Support: <span className="text-emerald-600">1800-212-0628</span>
                    </p>
                    <p className="text-[9px] text-slate-500 italic">
                      Authorized access only. All activities are monitored.
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="px-8 py-8 border-t border-slate-200 bg-slate-200/30 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 text-slate-500">
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 p-2 rounded-full">
                <Globe size={18} className="text-emerald-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Official Website</span>
                <a href="https://www.fortia.co.in" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold hover:text-emerald-600 transition-colors">
                  www.fortia.co.in
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 p-2 rounded-full">
                <Mail size={18} className="text-emerald-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Email Support</span>
                <a href="mailto:customercare@fortia.co.in" className="text-sm font-semibold hover:text-emerald-600 transition-colors">
                  customercare@fortia.co.in
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  </ErrorBoundary>
  );
}
