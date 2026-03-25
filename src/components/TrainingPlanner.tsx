import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  ClipboardList, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ChevronRight,
  ArrowRight,
  AlertCircle,
  FileText,
  Download,
  Trash2,
  Edit
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  setMonth,
  setYear,
  getYear,
  getMonth
} from 'date-fns';

interface TrainingSession {
  id: string;
  title: string;
  subject: string;
  type: 'Field Visit' | 'Classroom' | 'Virtual';
  date: string;
  location: string;
  trainer: string;
  attendees?: number;
  clientName?: string;
  status: 'Planned' | 'Completed' | 'Cancelled';
  description?: string;
  checkpoints?: string[];
}

const INITIAL_TRAININGS: TrainingSession[] = [
  {
    id: 'TR-001',
    title: 'Operations Field Visit - Site A',
    subject: 'Duty SOP',
    type: 'Field Visit',
    date: '2026-03-25',
    location: 'Kolkata Industrial Hub',
    trainer: 'Rajesh Kumar',
    clientName: 'Tata Steel Hub',
    status: 'Planned',
    description: 'Quarterly field visit to assess operational efficiency and safety compliance.',
    checkpoints: ['Equipment Check', 'Safety Protocol Review', 'Staff Interview', 'Efficiency Audit']
  },
  {
    id: 'TR-002',
    title: 'Advanced Safety Protocols',
    subject: 'Fire',
    type: 'Classroom',
    date: '2026-03-28',
    location: 'Main Conference Hall',
    trainer: 'Sarah Jones',
    attendees: 25,
    status: 'Planned',
    description: 'Mandatory safety training for all operations staff.'
  },
  {
    id: 'TR-003',
    title: 'Supply Chain Optimization',
    subject: 'Personal development',
    type: 'Classroom',
    date: '2026-03-20',
    location: 'Virtual Hub',
    trainer: 'Michael Chen',
    attendees: 18,
    status: 'Completed',
    description: 'Workshop on reducing lead times and optimizing inventory.'
  }
];

const TrainingPlanner = () => {
  const [trainings, setTrainings] = useState<TrainingSession[]>(() => {
    const saved = localStorage.getItem('fortia_trainings');
    return saved ? JSON.parse(saved) : INITIAL_TRAININGS;
  });
  const [isAdding, setIsAdding] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [formType, setFormType] = useState<'Field Visit' | 'Classroom' | 'Virtual'>('Field Visit');
  const [selectedSubject, setSelectedSubject] = useState<string>('Duty SOP');
  const [customSubject, setCustomSubject] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [selectedTraining, setSelectedTraining] = useState<TrainingSession | null>(null);

  useEffect(() => {
    localStorage.setItem('fortia_trainings', JSON.stringify(trainings));
  }, [trainings]);

  const filteredTrainings = trainings.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.trainer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const stats = [
    { label: 'Total Sessions', value: trainings.length, icon: ClipboardList, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
    { label: 'Upcoming', value: trainings.filter(t => t.status === 'Planned').length, icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Completed', value: trainings.filter(t => t.status === 'Completed').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Attendees', value: trainings.reduce((acc, t) => acc + (t.attendees || 0), 0), icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  const chartData = [
    { name: 'Field Visit', count: trainings.filter(t => t.type === 'Field Visit').length },
    { name: 'Classroom', count: trainings.filter(t => t.type === 'Classroom').length },
  ];

  const handleAddTraining = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const subject = selectedSubject === 'Other' ? customSubject : selectedSubject;
    const newTraining: TrainingSession = {
      id: `TR-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      title: formData.get('title') as string,
      subject: subject,
      type: formData.get('type') as any,
      date: formData.get('date') as string,
      location: formData.get('location') as string,
      trainer: formData.get('trainer') as string,
      attendees: formData.get('type') === 'Classroom' ? parseInt(formData.get('attendees') as string) || 0 : undefined,
      clientName: formData.get('type') === 'Field Visit' ? formData.get('clientName') as string : undefined,
      status: 'Planned',
      description: formData.get('description') as string,
    };
    setTrainings([...trainings, newTraining]);
    setIsAdding(false);
  };

  const deleteTraining = (id: string) => {
    if (confirm('Are you sure you want to delete this training session?')) {
      setTrainings(trainings.filter(t => t.id !== id));
      if (selectedTraining?.id === id) setSelectedTraining(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Training Planner</h2>
          <p className="text-sm text-slate-500 font-medium">Schedule and manage operational training modules</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl mr-2">
            <button 
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              List
            </button>
            <button 
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'calendar' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Calendar
            </button>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Plus size={18} />
            Schedule Session
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main List Area */}
        <div className="lg:col-span-2 space-y-6">
          {viewMode === 'list' ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-bottom border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search by title or trainer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-slate-400" />
                  <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="All">All Types</option>
                    <option value="Field Visit">Field Visit</option>
                    <option value="Classroom">Classroom</option>
                    <option value="Virtual">Virtual</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-y border-slate-100">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Training ID</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Session Details</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTrainings.map((training) => (
                      <tr 
                        key={training.id} 
                        onClick={() => setSelectedTraining(training)}
                        className={`hover:bg-slate-50/50 cursor-pointer transition-colors ${selectedTraining?.id === training.id ? 'bg-emerald-500/5' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <span className="text-xs font-mono font-bold text-slate-500">{training.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800">{training.title}</span>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="flex items-center gap-1 text-[10px] text-slate-500">
                                <Calendar size={12} /> {training.date}
                              </span>
                              {training.type === 'Classroom' ? (
                                <span className="flex items-center gap-1 text-[10px] text-slate-500">
                                  <Users size={12} /> {training.attendees}
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-[10px] text-slate-500">
                                  <MapPin size={12} /> {training.clientName}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider ${
                            training.type === 'Field Visit' ? 'bg-amber-50 text-amber-600' : 
                            training.type === 'Virtual' ? 'bg-indigo-50 text-indigo-600' :
                            'bg-emerald-500/10 text-emerald-600'
                          }`}>
                            {training.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              training.status === 'Completed' ? 'bg-emerald-500' :
                              training.status === 'Cancelled' ? 'bg-rose-500' : 'bg-amber-500'
                            }`} />
                            <span className="text-xs font-medium text-slate-600">{training.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTraining(training.id);
                            }}
                            className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-bold text-slate-800">{format(currentDate, 'MMMM yyyy')}</h3>
                  <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                    <button 
                      onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                      className="p-1.5 hover:bg-white rounded-lg transition-all text-slate-500"
                    >
                      <ChevronRight className="rotate-180" size={16} />
                    </button>
                    <button 
                      onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                      className="p-1.5 hover:bg-white rounded-lg transition-all text-slate-500"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <select 
                    value={getMonth(currentDate)}
                    onChange={(e) => setCurrentDate(setMonth(currentDate, parseInt(e.target.value)))}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {Array.from({ length: 12 }).map((_, i) => (
                      <option key={i} value={i}>{format(new Date(2026, i, 1), 'MMMM')}</option>
                    ))}
                  </select>
                  <select 
                    value={getYear(currentDate)}
                    onChange={(e) => setCurrentDate(setYear(currentDate, parseInt(e.target.value)))}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {Array.from({ length: 10 }).map((_, i) => (
                      <option key={i} value={2020 + i}>{2020 + i}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-7 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                  {(() => {
                    const monthStart = startOfMonth(currentDate);
                    const monthEnd = endOfMonth(monthStart);
                    const startDate = startOfWeek(monthStart);
                    const endDate = endOfWeek(monthEnd);
                    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

                    return calendarDays.map((day, i) => {
                      const dayTrainings = trainings.filter(t => isSameDay(new Date(t.date), day));
                      const isCurrentMonth = isSameMonth(day, monthStart);
                      const isToday = isSameDay(day, new Date());

                      return (
                        <div 
                          key={i} 
                          className={`min-h-[100px] bg-white p-2 transition-colors ${!isCurrentMonth ? 'bg-slate-50/50' : ''}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs font-bold ${
                              isToday ? 'w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center' : 
                              isCurrentMonth ? 'text-slate-700' : 'text-slate-300'
                            }`}>
                              {format(day, 'd')}
                            </span>
                          </div>
                          <div className="space-y-1">
                            {dayTrainings.map(t => (
                              <div 
                                key={t.id}
                                onClick={() => setSelectedTraining(t)}
                                className={`px-2 py-1 rounded text-[10px] font-bold truncate cursor-pointer hover:opacity-80 transition-opacity ${
                                  t.type === 'Field Visit' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                                  t.type === 'Virtual' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                                  'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                }`}
                              >
                                {t.title}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Details / Charts */}
        <div className="space-y-8">
          {/* Distribution Chart */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-widest">Session Distribution</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 8, fill: '#94a3b8', fontWeight: 600 }}
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6'][index % 4]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Selected Session Details */}
          <AnimatePresence mode="wait">
            {selectedTraining ? (
              <motion.div 
                key={selectedTraining.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Session Overview</h3>
                  <button onClick={() => setSelectedTraining(null)} className="text-slate-400 hover:text-slate-600">
                    <XCircle size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">{selectedTraining.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{selectedTraining.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Subject</p>
                      <p className="text-xs font-bold text-slate-800">{selectedTraining.subject}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Trainer</p>
                      <p className="text-xs font-bold text-slate-800">{selectedTraining.trainer}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        {selectedTraining.type === 'Field Visit' ? 'Client' : 'Attendees'}
                      </p>
                      <p className="text-xs font-bold text-slate-800">
                        {selectedTraining.type === 'Field Visit' ? selectedTraining.clientName : selectedTraining.attendees}
                      </p>
                    </div>
                  </div>

                  {selectedTraining.type === 'Field Visit' && selectedTraining.checkpoints && (
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Field Visit Checkpoints</p>
                      <div className="space-y-2">
                        {selectedTraining.checkpoints.map((cp, i) => (
                          <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-emerald-50/50 border border-emerald-100/50">
                            <CheckCircle size={14} className="text-emerald-500" />
                            <span className="text-xs text-slate-700 font-medium">{cp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-100 flex gap-3">
                    <button className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all">
                      Edit Details
                    </button>
                    <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all">
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-slate-50 rounded-3xl border border-dashed border-slate-300 p-8 text-center">
                <ClipboardList className="mx-auto text-slate-300 mb-4" size={48} />
                <p className="text-xs text-slate-500 font-medium">Select a training session to view detailed analytics and checkpoints.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Training Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-4 md:my-auto"
            >
              <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Schedule New Session</h3>
                <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600 p-2">
                  <XCircle size={24} />
                </button>
              </div>
              <form onSubmit={handleAddTraining} className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Session Title</label>
                    <input name="title" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" placeholder="e.g. Field Visit Site B" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Training Subject</label>
                    <select 
                      name="subject" 
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    >
                      <option value="Duty SOP">Duty SOP</option>
                      <option value="Personal development">Personal development</option>
                      <option value="Fire">Fire</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Physical fitness">Physical fitness</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {selectedSubject === 'Other' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Specify Subject</label>
                      <input 
                        value={customSubject}
                        onChange={(e) => setCustomSubject(e.target.value)}
                        required 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" 
                        placeholder="Enter training subject" 
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Training Type</label>
                    <select 
                      name="type" 
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as any)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    >
                      <option value="Field Visit">Field Visit</option>
                      <option value="Classroom">Classroom</option>
                      <option value="Virtual">Virtual</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</label>
                    <input name="date" type="date" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" />
                  </div>
                  {formType === 'Classroom' ? (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Attendees</label>
                      <input name="attendees" type="number" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" placeholder="0" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client Name</label>
                      <input name="clientName" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" placeholder="Enter client name" />
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trainer</label>
                    <input name="trainer" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" placeholder="Name of trainer" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</label>
                    <input name="location" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" placeholder="Venue or Link" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</label>
                  <textarea name="description" rows={3} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none" placeholder="Brief overview of the session..."></textarea>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button type="button" onClick={() => setIsAdding(false)} className="w-full sm:flex-1 py-2 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                  <button type="submit" className="w-full sm:flex-1 px-4 py-2 bg-emerald-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">Schedule Session</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrainingPlanner;
