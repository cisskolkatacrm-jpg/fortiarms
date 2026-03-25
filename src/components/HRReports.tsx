import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { 
  FileText, 
  Download, 
  Filter, 
  TrendingUp, 
  Users, 
  UserCheck, 
  UserMinus,
  Calendar,
  ChevronDown,
  Search,
  Printer,
  Share2
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db, auth } from '../firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const HRReports: React.FC = () => {
  const [timeRange, setTimeRange] = useState('Last 6 Months');
  const [employees, setEmployees] = useState<any[]>([]);
  const [recruitmentPlans, setRecruitmentPlans] = useState<any[]>([]);
  const [trainings, setTrainings] = useState<any[]>([]);

  useEffect(() => {
    const unsubEmployees = onSnapshot(collection(db, 'employees'), (snapshot) => {
      setEmployees(snapshot.docs.map(doc => doc.data()));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'employees'));

    const unsubRecruitment = onSnapshot(collection(db, 'recruitment_plans'), (snapshot) => {
      setRecruitmentPlans(snapshot.docs.map(doc => doc.data()));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'recruitment_plans'));

    const unsubTrainings = onSnapshot(collection(db, 'training_sessions'), (snapshot) => {
      setTrainings(snapshot.docs.map(doc => doc.data()));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'training_sessions'));

    return () => {
      unsubEmployees();
      unsubRecruitment();
      unsubTrainings();
    };
  }, []);

  // Derived Data
  const totalHeadcount = employees.length;
  const newHiresCount = employees.filter(e => {
    const joiningDate = new Date(e.joiningDate);
    const now = new Date();
    return joiningDate.getMonth() >= now.getMonth() - 3;
  }).length;

  const departmentHeadcount = Array.from(new Set(employees.map(e => e.department || e.branch))).map(dept => ({
    dept: dept || 'Unknown',
    count: employees.filter(e => (e.department || e.branch) === dept).length,
    growth: '+0%' // Mock growth for now
  })).sort((a, b) => b.count - a.count);

  const trainingStatus = [
    { name: 'Completed', value: trainings.filter(t => t.status === 'Completed').length, color: '#10B981' },
    { name: 'Planned', value: trainings.filter(t => t.status === 'Planned').length, color: '#F59E0B' },
    { name: 'Cancelled', value: trainings.filter(t => t.status === 'Cancelled').length, color: '#EF4444' },
  ];

  const recruitmentSources = [
    { name: 'Referrals', value: 40, color: '#10B981' },
    { name: 'LinkedIn', value: 25, color: '#0EA5E9' },
    { name: 'Job Portals', value: 20, color: '#F59E0B' },
    { name: 'Direct', value: 15, color: '#8B5CF6' },
  ];

  const turnoverData = [
    { month: 'Oct', rate: 2.1, hires: 45, exits: 12 },
    { month: 'Nov', rate: 1.8, hires: 38, exits: 10 },
    { month: 'Dec', rate: 2.5, hires: 52, exits: 15 },
    { month: 'Jan', rate: 1.5, hires: 30, exits: 8 },
    { month: 'Feb', rate: 1.9, hires: 42, exits: 11 },
    { month: 'Mar', rate: 2.2, hires: 48, exits: 14 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">HR Analytics & Reports</h2>
          <p className="text-sm text-slate-500 font-medium">Comprehensive insights into workforce metrics and performance</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">
            <Printer size={16} />
            Print
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Users size={20} />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">+12% YoY</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Headcount</p>
          <h4 className="text-2xl font-black text-slate-800">{totalHeadcount}</h4>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl">
              <UserCheck size={20} />
            </div>
            <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded-lg">94% Target</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">New Hires (Q1)</p>
          <h4 className="text-2xl font-black text-slate-800">{newHiresCount}</h4>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <UserMinus size={20} />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">-2% vs LY</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Turnover Rate</p>
          <h4 className="text-2xl font-black text-slate-800">1.9%</h4>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-violet-50 text-violet-600 rounded-2xl">
              <Calendar size={20} />
            </div>
            <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded-lg">88% Avg</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Attendance Rate</p>
          <h4 className="text-2xl font-black text-slate-800">92.4%</h4>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Turnover Trends */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Turnover & Hiring Trends</h3>
              <p className="text-xs text-slate-400 font-medium">Monthly comparison of onboarding vs exits</p>
            </div>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 outline-none"
            >
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={turnoverData}>
                <defs>
                  <linearGradient id="colorHires" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                <Area type="monotone" dataKey="hires" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorHires)" />
                <Area type="monotone" dataKey="exits" stroke="#EF4444" strokeWidth={3} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recruitment Sources */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Recruitment Sources</h3>
          <p className="text-xs text-slate-400 font-medium mb-8">Efficiency of different hiring channels</p>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={recruitmentSources}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {recruitmentSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-800">100%</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase">Total Hires</span>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {recruitmentSources.map((source, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: source.color }} />
                  <span className="text-xs font-bold text-slate-600">{source.name}</span>
                </div>
                <span className="text-xs font-black text-slate-800">{source.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Department Headcount */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Department Headcount</h3>
          <div className="space-y-6">
            {departmentHeadcount.map((dept, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">{dept.dept}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-800">{dept.count}</span>
                    <span className="text-[10px] font-bold text-emerald-600">{dept.growth}</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(dept.count / (totalHeadcount || 1)) * 100}%` }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Training Status */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Training Compliance</h3>
              <p className="text-xs text-slate-400 font-medium">Status of mandatory training programs</p>
            </div>
            <button className="text-[10px] font-bold text-sky-600 uppercase tracking-widest hover:underline">View Details</button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trainingStatus} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}} width={100} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                  {trainingStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Completed</p>
              <p className="text-xl font-black text-emerald-700">{trainings.length > 0 ? Math.round((trainings.filter(t => t.status === 'Completed').length / trainings.length) * 100) : 0}%</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-center">
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Planned</p>
              <p className="text-xl font-black text-amber-700">{trainings.length > 0 ? Math.round((trainings.filter(t => t.status === 'Planned').length / trainings.length) * 100) : 0}%</p>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-center">
              <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-1">Cancelled</p>
              <p className="text-xl font-black text-rose-700">{trainings.length > 0 ? Math.round((trainings.filter(t => t.status === 'Cancelled').length / trainings.length) * 100) : 0}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRReports;
