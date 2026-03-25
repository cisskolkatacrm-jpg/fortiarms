import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { 
  Shield, 
  Map as MapIcon, 
  FileText, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Users, 
  ChevronRight,
  Search,
  Filter,
  MoreVertical,
  Activity,
  Smartphone,
  FileDown,
  Monitor,
  Building2,
  Plus,
  User,
  UserPlus,
  ClipboardList,
  Settings,
  Upload,
  Image as ImageIcon,
  MapPin,
  Trash2,
  Edit,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const patrolData = [
  { time: '08:00', completed: 12, missed: 1 },
  { time: '10:00', completed: 18, missed: 0 },
  { time: '12:00', completed: 15, missed: 2 },
  { time: '14:00', completed: 22, missed: 0 },
  { time: '16:00', completed: 20, missed: 1 },
  { time: '18:00', completed: 25, missed: 0 },
];

export const FSMDashboard = ({ role }: { role: string }) => {
  const isClient = ['Admin', 'Security Officer', 'Unit In-charge Security Person'].includes(role);
  const isMaster = role === 'Master Admin';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {isMaster ? 'Global FSM Command' : isClient ? 'Client Security Portal' : 'FSM Operations Hub'}
          </h2>
          <p className="text-slate-500 text-sm">Welcome back, {role}. Here's the current operational status.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20">
            <Filter size={16} />
            Filter Data
          </button>
          <button className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: isMaster ? 'Total Clients' : 'Total Areas', value: isMaster ? '12' : '42', icon: isMaster ? <Building2 size={24} /> : <MapIcon size={24} />, color: 'blue' },
          { label: 'Active Patrols', value: '18', icon: <Activity size={24} />, color: 'emerald' },
          { label: 'Reports Filed', value: '124', icon: <FileText size={24} />, color: 'amber' },
          { label: 'Alerts Raised', value: '3', icon: <AlertTriangle size={24} />, color: 'rose' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
          >
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 mb-4`}>
              {stat.icon}
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Patrol Completion Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={patrolData}>
                <defs>
                  <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip />
                <Area type="monotone" dataKey="completed" stroke="#10b981" fillOpacity={1} fill="url(#colorComp)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Incidents</h3>
          <div className="space-y-4">
            {[
              { area: 'Main Gate', time: '10 mins ago', type: 'Unsecured Door', status: 'Resolved' },
              { area: 'Warehouse B', time: '45 mins ago', type: 'Suspicious Activity', status: 'Pending' },
              { area: 'Parking Lot', time: '2 hours ago', type: 'Light Failure', status: 'Resolved' },
            ].map((incident, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${incident.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {incident.status === 'Pending' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{incident.type}</h4>
                    <p className="text-xs text-slate-500">{incident.area} • {incident.time}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${incident.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {incident.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const FSMUserManagement = () => {
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [newUserType, setNewUserType] = useState<'CISS' | 'Client'>('CISS');
  const [users, setUsers] = useState([
    { id: 'F001', name: 'Rajesh Kumar', role: 'Supervisor', type: 'CISS', status: 'Active' },
    { id: 'F002', name: 'Anita Singh', role: 'Admin', type: 'Client', client: 'Sunrise Corp', status: 'Active' },
    { id: 'F003', name: 'Suresh Pal', role: 'Security Personnel', type: 'CISS', status: 'Active' },
  ]);

  const [clients, setClients] = useState([
    { code: 'SUN01', name: 'Sunrise Corp', logo: 'https://picsum.photos/seed/SUN01/200/200' },
    { code: 'GLO02', name: 'Global Retail', logo: 'https://picsum.photos/seed/GLO02/200/200' },
  ]);

  const [clientForm, setClientForm] = useState({ name: '', code: '', logo: '', localLogo: '' });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isEditing) {
          setEditingClient({ ...editingClient, localLogo: base64String });
        } else {
          setClientForm({ ...clientForm, localLogo: base64String });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddClient = () => {
    if (clientForm.name && clientForm.code && (clientForm.logo || clientForm.localLogo)) {
      const finalLogo = clientForm.localLogo || clientForm.logo || `https://picsum.photos/seed/${clientForm.code}/200/200`;
      setClients([...clients, { 
        name: clientForm.name, 
        code: clientForm.code, 
        logo: finalLogo 
      }]);
      setClientForm({ name: '', code: '', logo: '', localLogo: '' });
      setShowAddClient(false);
    }
  };

  const handleUpdateClient = () => {
    if (editingClient && (editingClient.logo || editingClient.localLogo)) {
      const finalLogo = editingClient.localLogo || editingClient.logo;
      setClients(clients.map(c => c.code === editingClient.code ? { 
        ...editingClient, 
        logo: finalLogo 
      } : c));
      setEditingClient(null);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">FSM User & Client Management</h2>
          <p className="text-slate-500 text-sm">Master Admin: Manage CISS personnel and Client company credentials.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              setClientForm({ name: '', code: '', logo: '' });
              setShowAddClient(true);
            }}
            className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Building2 size={16} />
            Register Client
          </button>
          <button 
            onClick={() => setShowAddUser(true)}
            className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <UserPlus size={16} />
            Create User Account
          </button>
        </div>
      </div>

      {/* Mock Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900">Create New FSM User</h3>
              <button onClick={() => setShowAddUser(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <Plus size={20} className="rotate-45" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">User Type</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setNewUserType('CISS')}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${newUserType === 'CISS' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white border border-slate-200 text-slate-400'}`}
                  >
                    CISS Personnel
                  </button>
                  <button 
                    onClick={() => setNewUserType('Client')}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${newUserType === 'Client' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white border border-slate-200 text-slate-400'}`}
                  >
                    Client User
                  </button>
                </div>
              </div>

              {newUserType === 'Client' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Client Company</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/10">
                    {clients.map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                <input type="text" placeholder="Enter user's name" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/10" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Login ID</label>
                <input type="text" placeholder="e.g. user_123" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/10" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assign Role</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/10">
                  {newUserType === 'CISS' ? (
                    <>
                      <option>Supervisor</option>
                      <option>Security Personnel</option>
                    </>
                  ) : (
                    <>
                      <option>Admin</option>
                      <option>Security Officer</option>
                      <option>Unit In-charge Security Person</option>
                    </>
                  )}
                </select>
              </div>

              <button 
                onClick={() => setShowAddUser(false)}
                className="w-full px-6 py-2 bg-emerald-500 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-colors mt-4 shadow-lg shadow-emerald-500/20"
              >
                Generate Credentials & Save
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add/Edit Client Modal */}
      {(showAddClient || editingClient) && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900">{editingClient ? 'Edit Client Branding' : 'Register New Client'}</h3>
              <button 
                onClick={() => {
                  setShowAddClient(false);
                  setEditingClient(null);
                }} 
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <Plus size={20} className="rotate-45" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company Name</label>
                <input 
                  type="text" 
                  value={editingClient ? editingClient.name : clientForm.name}
                  onChange={(e) => editingClient ? setEditingClient({...editingClient, name: e.target.value}) : setClientForm({...clientForm, name: e.target.value})}
                  placeholder="e.g. Sunrise Corp" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/10" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client Code</label>
                <input 
                  type="text" 
                  disabled={!!editingClient}
                  value={editingClient ? editingClient.code : clientForm.code}
                  onChange={(e) => setClientForm({...clientForm, code: e.target.value})}
                  placeholder="e.g. SUN01" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/10 disabled:opacity-50" 
                />
              </div>
              
              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logo Option 1: URL</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                      type="text" 
                      value={editingClient ? editingClient.logo : clientForm.logo}
                      onChange={(e) => editingClient ? setEditingClient({...editingClient, logo: e.target.value}) : setClientForm({...clientForm, logo: e.target.value})}
                      placeholder="https://example.com/logo.png" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/10" 
                    />
                  </div>
                </div>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-slate-100"></div>
                  <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest">OR</span>
                  <div className="flex-grow border-t border-slate-100"></div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logo Option 2: Local Drive</label>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl cursor-pointer hover:bg-emerald-600 transition-all group shadow-lg shadow-emerald-500/20">
                      <Upload className="text-white" size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        {(editingClient?.localLogo || clientForm.localLogo) ? 'File Selected' : 'Choose File'}
                      </span>
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, !!editingClient)}
                      />
                    </label>
                    {(editingClient?.localLogo || clientForm.localLogo) && (
                      <div className="w-10 h-10 rounded-lg border border-slate-200 overflow-hidden bg-white flex items-center justify-center">
                        <img 
                          src={editingClient ? editingClient.localLogo : clientForm.localLogo} 
                          alt="Preview" 
                          className="max-w-full max-h-full object-contain" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-[9px] text-slate-400 italic">
                  * At least one logo option is mandatory.
                </p>
              </div>

              <button 
                onClick={editingClient ? handleUpdateClient : handleAddClient}
                disabled={!(editingClient ? (editingClient.name && (editingClient.logo || editingClient.localLogo)) : (clientForm.name && clientForm.code && (clientForm.logo || clientForm.localLogo)))}
                className="w-full px-6 py-2 bg-emerald-500 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-colors mt-4 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingClient ? 'Update Branding' : 'Register Client'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Platform Users</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search users..." 
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{user.name}</p>
                          <p className="text-[10px] text-slate-500">{user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-600">{user.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${user.type === 'CISS' ? 'text-emerald-600' : 'text-emerald-600'}`}>
                          {user.type}
                        </span>
                        {user.client && <span className="text-[9px] text-slate-400">{user.client}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Client Branding</h3>
          <div className="space-y-6">
            {clients.map((client) => (
              <div key={client.code} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center overflow-hidden shadow-sm">
                    <img src={client.logo} alt={client.name} className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{client.name}</h4>
                    <p className="text-xs text-slate-500">Code: {client.code}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setEditingClient(client)}
                    className="flex-1 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-bold hover:bg-emerald-600 transition-colors uppercase tracking-widest shadow-lg shadow-emerald-500/20"
                  >
                    Update Logo
                  </button>
                  <button 
                    onClick={() => setEditingClient(client)}
                    className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    <Settings size={16} />
                  </button>
                </div>
              </div>
            ))}
              <button 
                onClick={() => {
                  setClientForm({ name: '', code: '', logo: '' });
                  setShowAddClient(true);
                }}
                className="w-full py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 flex flex-col items-center gap-2"
              >
                <Plus size={24} />
                Add New Client Company
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DownloadCenter = ({ userType }: { userType: string }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Training Resources</h3>
          <div className="space-y-4">
            {[
              { title: 'FSM User Manual v2.1', size: '4.2 MB', type: 'PDF' },
              { title: 'Patrolling Best Practices', size: '1.8 MB', type: 'PDF' },
              { title: 'Incident Reporting Guide', size: '2.5 MB', type: 'PDF' },
            ].map((doc, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-emerald-100 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    <FileDown size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{doc.title}</h4>
                    <p className="text-xs text-slate-500">{doc.type} • {doc.size}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <Download size={18} className="text-slate-400" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Reports</h3>
          <div className="space-y-4">
            {[
              { title: 'Monthly Patrol Summary - Feb', date: 'Mar 01, 2026', type: 'XLSX' },
              { title: 'Incident Analysis Report', date: 'Feb 28, 2026', type: 'PDF' },
              { title: 'Area Coverage Audit', date: 'Feb 25, 2026', type: 'PDF' },
            ].map((report, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-emerald-100 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{report.title}</h4>
                    <p className="text-xs text-slate-500">{report.type} • {report.date}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <Download size={18} className="text-slate-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import { 
  APIProvider, 
  Map as GoogleMap, 
  AdvancedMarker, 
  Pin,
  InfoWindow
} from '@vis.gl/react-google-maps';

const INITIAL_PERSONNEL = [
  { id: 'P01', name: 'S. Kumar', area: 'Main Gate', lat: 28.6139, lng: 77.2090, status: 'Patrolling', lastUpdate: 'Just now' },
  { id: 'P02', name: 'R. Singh', area: 'Warehouse B', lat: 28.6145, lng: 77.2100, status: 'Online', lastUpdate: '2 mins ago' },
  { id: 'P03', name: 'A. Khan', area: 'Parking Lot', lat: 28.6130, lng: 77.2080, status: 'Patrolling', lastUpdate: 'Just now' },
  { id: 'P04', name: 'M. Verma', area: 'Zone C', lat: 28.6150, lng: 77.2110, status: 'Patrolling', lastUpdate: 'Just now' },
];

export const RealTimePatrolling = ({ apiKey }: { apiKey: string }) => {
  const [personnel, setPersonnel] = useState(INITIAL_PERSONNEL);
  const [selectedPersonnel, setSelectedPersonnel] = useState<any>(null);
  const [logs, setLogs] = useState([
    { id: 1, time: '10:45:12', user: 'S. Kumar', event: 'Checkpoint Reached', area: 'Main Gate', status: 'Success' },
    { id: 2, time: '10:44:05', user: 'A. Khan', event: 'Patrol Started', area: 'Parking Lot', status: 'Info' },
    { id: 3, time: '10:42:30', user: 'R. Singh', event: 'Incident Reported', area: 'Warehouse B', status: 'Warning' },
  ]);

  // Simulate movement
  useEffect(() => {
    const interval = setInterval(() => {
      setPersonnel(prev => prev.map(p => {
        if (p.status === 'Patrolling') {
          return {
            ...p,
            lat: p.lat + (Math.random() - 0.5) * 0.0002,
            lng: p.lng + (Math.random() - 0.5) * 0.0002,
            lastUpdate: 'Just now'
          };
        }
        return p;
      }));

      // Randomly add logs
      if (Math.random() > 0.7) {
        const randomP = personnel[Math.floor(Math.random() * personnel.length)];
        const events = ['Checkpoint Reached', 'Area Scanned', 'Patrol Continued', 'Observation Logged'];
        const newLog = {
          id: Date.now(),
          time: new Date().toLocaleTimeString('en-IN', { hour12: false }),
          user: randomP.name,
          event: events[Math.floor(Math.random() * events.length)],
          area: randomP.area,
          status: 'Success'
        };
        setLogs(prev => [newLog, ...prev].slice(0, 10));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [personnel]);

  const hasValidKey = Boolean(apiKey) && apiKey !== 'YOUR_API_KEY';

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Live Area Monitoring</h2>
          <p className="text-slate-500 text-sm">Real-time tracking of security personnel and area status across all zones.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System Live
          </div>
          <button className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20">
            <Filter size={16} />
            Filter Zones
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Map Container */}
        <div className="flex-[2] bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
          {hasValidKey ? (
            <APIProvider apiKey={apiKey}>
              <GoogleMap
                defaultCenter={{ lat: 28.6139, lng: 77.2090 }}
                defaultZoom={16}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                mapId="fsm_live_monitoring"
              >
                {personnel.map(p => (
                  <AdvancedMarker
                    key={p.id}
                    position={{ lat: p.lat, lng: p.lng }}
                    onClick={() => setSelectedPersonnel(p)}
                  >
                    <div className="relative group cursor-pointer">
                      <div className={`w-10 h-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-transform group-hover:scale-110 ${p.status === 'Patrolling' ? 'bg-emerald-500' : 'bg-slate-600'}`}>
                        <Users size={18} className="text-white" />
                      </div>
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <p className="text-[10px] font-bold text-slate-900">{p.name}</p>
                      </div>
                    </div>
                  </AdvancedMarker>
                ))}

                {selectedPersonnel && (
                  <InfoWindow
                    position={{ lat: selectedPersonnel.lat, lng: selectedPersonnel.lng }}
                    onCloseClick={() => setSelectedPersonnel(null)}
                  >
                    <div className="p-2 min-w-[150px]">
                      <h4 className="font-bold text-slate-900 text-sm">{selectedPersonnel.name}</h4>
                      <p className="text-xs text-slate-500 mb-2">{selectedPersonnel.area}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedPersonnel.status === 'Patrolling' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'}`}>
                          {selectedPersonnel.status}
                        </span>
                        <span className="text-[10px] text-slate-400">{selectedPersonnel.lastUpdate}</span>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </APIProvider>
          ) : (
            <div className="w-full h-full bg-slate-100 flex items-center justify-center relative">
              <div className="text-center z-10">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <MapIcon size={40} className="text-emerald-600 animate-pulse" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Live Map Simulation</h4>
                <p className="text-sm text-slate-500 max-w-xs mx-auto mt-2">Connecting to real-time GPS tracking system. Map API key required for full visual interface.</p>
              </div>
              
              {/* Simulated Map Elements */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-emerald-500/20 rounded-full animate-ping" />
                <div className="absolute bottom-1/3 right-1/4 w-48 h-48 border-2 border-emerald-500/10 rounded-full animate-pulse" />
              </div>

              {personnel.map(p => (
                <motion.div
                  key={p.id}
                  animate={{ 
                    x: (p.lng - 77.2090) * 100000, 
                    y: (p.lat - 28.6139) * 100000 
                  }}
                  className="absolute p-2 bg-white rounded-xl shadow-lg border border-slate-200 flex items-center gap-2 cursor-pointer hover:scale-110 transition-transform z-20"
                >
                  <div className={`w-3 h-3 rounded-full ${p.status === 'Patrolling' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                  <span className="text-xs font-bold text-slate-700">{p.name}</span>
                </motion.div>
              ))}
            </div>
          )}

          {/* Map Overlay Controls */}
          <div className="absolute bottom-6 left-6 flex flex-col gap-2">
            <div className="bg-white/90 backdrop-blur p-4 rounded-2xl border border-white shadow-xl">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Legend</h5>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs text-slate-600">Active Patrolling</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-400" />
                  <span className="text-xs text-slate-600">Stationary / Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="text-xs text-slate-600">Incident Reported</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Activity size={18} className="text-emerald-600" />
              Live Activity Feed
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {logs.map((log) => (
              <motion.div 
                key={log.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-primary/20 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-slate-400 tabular-nums">{log.time}</span>
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full ${
                    log.status === 'Warning' ? 'bg-rose-50 text-rose-600' : 
                    log.status === 'Info' ? 'bg-brand-primary/5 text-brand-primary' : 
                    'bg-emerald-50 text-emerald-600'
                  }`}>
                    {log.status}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900">{log.user}</p>
                <p className="text-xs text-slate-600 mt-0.5">{log.event} at <span className="font-medium text-brand-primary">{log.area}</span></p>
              </motion.div>
            ))}
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <button className="w-full py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20">
              View All Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BeatAssignment = () => {
  const [personnel] = useState([
    { id: 'P01', name: 'S. Kumar', role: 'Security Personnel' },
    { id: 'P02', name: 'R. Singh', role: 'Security Personnel' },
    { id: 'P03', name: 'A. Khan', role: 'Security Personnel' },
    { id: 'P04', name: 'M. Verma', role: 'Security Personnel' },
  ]);

  const [locations] = useState([
    { id: 'L01', name: 'Main Gate', zone: 'Zone A' },
    { id: 'L02', name: 'Warehouse B', zone: 'Zone B' },
    { id: 'L03', name: 'Parking Lot', zone: 'Zone A' },
    { id: 'L04', name: 'Zone C Entrance', zone: 'Zone C' },
  ]);

  const [assignments, setAssignments] = useState([
    { id: 1, personnel: 'S. Kumar', location: 'Main Gate', shift: 'Morning', status: 'Active' },
    { id: 2, personnel: 'A. Khan', location: 'Parking Lot', shift: 'Morning', status: 'Active' },
  ]);

  const [showAssignModal, setShowAssignModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Beat Assignment</h2>
          <p className="text-slate-500 text-sm">Assign security personnel to specific beats and locations.</p>
        </div>
        <button 
          onClick={() => setShowAssignModal(true)}
          className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          New Assignment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Current Assignments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Personnel</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Shift</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assignments.map((asgn) => (
                  <tr key={asgn.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{asgn.personnel}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">{asgn.location}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-600">{asgn.shift}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {asgn.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Available Personnel</h3>
            <div className="space-y-3">
              {personnel.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{p.name}</p>
                    <p className="text-[10px] text-slate-500">{p.role}</p>
                  </div>
                  <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showAssignModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900">Assign Beat</h3>
              <button onClick={() => setShowAssignModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <Plus size={20} className="rotate-45" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Personnel</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-primary/10">
                  {personnel.map(p => <option key={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-primary/10">
                  {locations.map(l => <option key={l.id}>{l.name} ({l.zone})</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Shift</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-primary/10">
                  <option>Morning (06:00 - 14:00)</option>
                  <option>Afternoon (14:00 - 22:00)</option>
                  <option>Night (22:00 - 06:00)</option>
                </select>
              </div>
              <button 
                onClick={() => setShowAssignModal(false)}
                className="w-full px-6 py-2 bg-emerald-500 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-colors mt-4 shadow-lg shadow-emerald-500/20"
              >
                Confirm Assignment
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export const IncidentLogs = () => {
  const [incidents] = useState([
    { id: 'INC-001', date: '2026-03-24', time: '10:42', location: 'Warehouse B', type: 'Unsecured Door', severity: 'Medium', reporter: 'R. Singh', status: 'Resolved' },
    { id: 'INC-002', date: '2026-03-24', time: '09:15', location: 'Main Gate', type: 'Unauthorized Entry Attempt', severity: 'High', reporter: 'S. Kumar', status: 'In Progress' },
    { id: 'INC-003', date: '2026-03-23', time: '23:30', location: 'Parking Lot', type: 'Vandalism', severity: 'Low', reporter: 'A. Khan', status: 'Pending' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Incident Logs</h2>
          <p className="text-slate-500 text-sm">Track and manage all security incidents reported across client sites.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Filter size={16} />
            Filter Logs
          </button>
          <button className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-colors flex items-center gap-2">
            <Plus size={16} />
            Report Incident
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Incident ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date & Time</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Severity</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {incidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-emerald-600">{inc.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-900">{inc.date}</p>
                    <p className="text-[10px] text-slate-500">{inc.time}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600 font-medium">{inc.location}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600">{inc.type}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                      inc.severity === 'High' ? 'bg-rose-50 text-rose-600' :
                      inc.severity === 'Medium' ? 'bg-amber-50 text-amber-600' :
                      'bg-emerald-50 text-emerald-600'
                    }`}>
                      {inc.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
                      inc.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' :
                      inc.status === 'In Progress' ? 'bg-emerald-50 text-emerald-600' :
                      'bg-slate-50 text-slate-500'
                    }`}>
                      {inc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-emerald-600 hover:text-emerald-700 text-[10px] font-bold uppercase tracking-widest">View Details</button>
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

export const PatrolReports = () => {
  const [reports] = useState([
    { id: 'REP-101', date: '2026-03-24', shift: 'Morning', personnel: 'S. Kumar', checkpoints: '12/12', status: 'Completed' },
    { id: 'REP-102', date: '2026-03-24', shift: 'Morning', personnel: 'A. Khan', checkpoints: '10/12', status: 'Incomplete' },
    { id: 'REP-103', date: '2026-03-23', shift: 'Night', personnel: 'R. Singh', checkpoints: '15/15', status: 'Completed' },
  ]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Patrol Reports', 14, 15);
    (doc as any).autoTable({
      startY: 20,
      head: [['Report ID', 'Date', 'Personnel', 'Shift', 'Checkpoints', 'Status']],
      body: reports.map(r => [r.id, r.date, r.personnel, r.shift, r.checkpoints, r.status]),
    });
    doc.save('patrol_reports.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(reports);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');
    XLSX.writeFile(workbook, 'patrol_reports.xlsx');
  };

  const downloadSingleReport = (report: any) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Patrol Report: ${report.id}`, 14, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${report.date}`, 14, 30);
    doc.text(`Personnel: ${report.personnel}`, 14, 40);
    doc.text(`Shift: ${report.shift}`, 14, 50);
    doc.text(`Checkpoints: ${report.checkpoints}`, 14, 60);
    doc.text(`Status: ${report.status}`, 14, 70);
    doc.save(`${report.id}_report.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Patrol Reports</h2>
          <p className="text-slate-500 text-sm">Analyze patrol performance and checkpoint compliance.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={exportToPDF}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <FileDown size={16} />
            PDF
          </button>
          <button 
            onClick={exportToExcel}
            className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-colors flex items-center gap-2"
          >
            <Download size={16} />
            Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Patrols', value: '42', icon: <Activity size={20} />, color: 'blue' },
          { label: 'Avg Compliance', value: '94.5%', icon: <CheckCircle size={20} />, color: 'emerald' },
          { label: 'Missed Points', value: '8', icon: <AlertTriangle size={20} />, color: 'rose' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 mb-4`}>
              {stat.icon}
            </div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Recent Patrol Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Report ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Personnel</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Shift</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Checkpoints</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((rep) => (
                <tr key={rep.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-900">{rep.id}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{rep.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{rep.personnel}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{rep.shift}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${rep.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                          style={{ width: `${(eval(rep.checkpoints) * 100).toFixed(0)}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">{rep.checkpoints}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
                      rep.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {rep.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => downloadSingleReport(rep)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-emerald-600"
                    >
                      <FileDown size={18} />
                    </button>
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

export const PersonnelRegistration = () => {
  const [personnelList, setPersonnelList] = useState([
    { id: 'SP001', name: 'Amit Sharma', mobile: '9876543210', regDate: '2026-03-24', status: 'Active' },
    { id: 'SP002', name: 'Vikram Singh', mobile: '9876543211', regDate: '2026-03-24', status: 'Active' },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    regDate: new Date().toISOString().split('T')[0]
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPersonnel = {
      id: `SP00${personnelList.length + 1}`,
      name: formData.name,
      mobile: formData.mobile,
      regDate: formData.regDate,
      status: 'Active'
    };
    setPersonnelList([newPersonnel, ...personnelList]);
    setFormData({
      name: '',
      mobile: '',
      regDate: new Date().toISOString().split('T')[0]
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Personnel Registration</h2>
          <p className="text-slate-500 text-sm">Register new security personnel to the field service team.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registration Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <UserPlus className="text-emerald-600" size={20} />
              New Registration
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registration Date</label>
                <input 
                  type="date" 
                  required
                  value={formData.regDate}
                  onChange={(e) => setFormData({...formData, regDate: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Security Personnel Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    required
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mobile Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="tel" 
                    required
                    pattern="[0-9]{10}"
                    placeholder="10-digit mobile number"
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all" 
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full px-6 py-2 bg-emerald-500 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
              >
                Register Personnel
              </button>
            </form>

            {showSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-emerald-600 text-xs font-bold"
              >
                <CheckCircle size={16} />
                Personnel registered successfully!
              </motion.div>
            )}
          </div>
        </div>

        {/* Registered List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Recently Registered Personnel</h3>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                {personnelList.length} Total
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Name</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mobile</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reg. Date</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {personnelList.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-emerald-600">{p.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900">{p.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600">{p.mobile}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {p.regDate}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-widest">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AreaConfiguration = () => {
  const [zones, setZones] = useState([
    { id: 'Z01', name: 'North Zone', sites: 4, checkpoints: 24 },
    { id: 'Z02', name: 'South Zone', sites: 3, checkpoints: 18 },
    { id: 'Z03', name: 'West Zone', sites: 5, checkpoints: 30 },
  ]);

  const [sites, setSites] = useState([
    { id: 'S01', name: 'Warehouse A', zone: 'North Zone', checkpoints: 6 },
    { id: 'S02', name: 'Main Office', zone: 'North Zone', checkpoints: 8 },
    { id: 'S03', name: 'Retail Hub', zone: 'South Zone', checkpoints: 10 },
  ]);

  const [checkpoints, setCheckpoints] = useState([
    { id: 'CP01', name: 'Main Entrance', site: 'Warehouse A', type: 'QR Scan' },
    { id: 'CP02', name: 'Loading Dock', site: 'Warehouse A', type: 'QR Scan' },
    { id: 'CP03', name: 'Server Room', site: 'Main Office', type: 'NFC Tag' },
  ]);

  const [activeTab, setActiveTab] = useState<'Zones' | 'Sites' | 'Checkpoints'>('Zones');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Area Configuration</h2>
          <p className="text-slate-500 text-sm">Configure zones, sites, and patrol checkpoints for client locations.</p>
        </div>
        <button className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20">
          <Plus size={16} />
          Add {activeTab.slice(0, -1)}
        </button>
      </div>

      <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl w-fit">
        {['Zones', 'Sites', 'Checkpoints'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab 
                ? 'bg-white text-brand-primary shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                {activeTab === 'Zones' && (
                  <>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Zone ID</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Zone Name</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Sites</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Checkpoints</th>
                  </>
                )}
                {activeTab === 'Sites' && (
                  <>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Site ID</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Site Name</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Zone</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Checkpoints</th>
                  </>
                )}
                {activeTab === 'Checkpoints' && (
                  <>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">CP ID</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">CP Name</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Site</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                  </>
                )}
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeTab === 'Zones' && zones.map((zone) => (
                <tr key={zone.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-emerald-600">{zone.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">{zone.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{zone.sites}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{zone.checkpoints}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-brand-primary transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-rose-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {activeTab === 'Sites' && sites.map((site) => (
                <tr key={site.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-emerald-600">{site.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">{site.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{site.zone}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{site.checkpoints}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-brand-primary transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-rose-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {activeTab === 'Checkpoints' && checkpoints.map((cp) => (
                <tr key={cp.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-emerald-600">{cp.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">{cp.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{cp.site}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-widest">
                      {cp.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-brand-primary transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-rose-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
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

