import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Users, 
  Building2, 
  Briefcase, 
  ChevronRight, 
  XCircle, 
  CheckCircle2,
  Clock,
  MapPin,
  Filter,
  Search,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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

interface RecruitmentPlan {
  id: string;
  branch: string;
  designation: string;
  count: number;
  targetDate: string;
  trainingDate: string;
  status: 'Draft' | 'Approved' | 'In Progress' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
}

interface RecruitmentPlanningProps {
  branches: string[];
}

const DESIGNATIONS = [
  'Security Guard',
  'Supervisor',
  'Operations Manager',
  'Branch Manager',
  'Accountant',
  'HR Executive',
  'IT Support',
  'Receptionist',
  'Driver'
];

const INITIAL_PLANS: RecruitmentPlan[] = [
  {
    id: 'RP-001',
    branch: 'Kolkata Branch',
    designation: 'Security Guard',
    count: 15,
    targetDate: '2026-04-10',
    trainingDate: '2026-04-15',
    status: 'Approved',
    priority: 'High'
  },
  {
    id: 'RP-002',
    branch: 'Mumbai Branch',
    designation: 'Supervisor',
    count: 3,
    targetDate: '2026-04-20',
    trainingDate: '2026-04-25',
    status: 'In Progress',
    priority: 'Medium'
  }
];

const RecruitmentPlanning: React.FC<RecruitmentPlanningProps> = ({ branches }) => {
  const [plans, setPlans] = useState<RecruitmentPlan[]>(() => {
    const saved = localStorage.getItem('fortia_recruitment_plans');
    return saved ? JSON.parse(saved) : INITIAL_PLANS;
  });
  const [isAdding, setIsAdding] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
  const [selectedPlan, setSelectedPlan] = useState<RecruitmentPlan | null>(null);
  const [selectedDesignation, setSelectedDesignation] = useState<string>('');
  const [customDesignation, setCustomDesignation] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('fortia_recruitment_plans', JSON.stringify(plans));
  }, [plans]);

  const handleAddPlan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const designation = selectedDesignation === 'Other' ? customDesignation : selectedDesignation;
    
    const newPlan: RecruitmentPlan = {
      id: `RP-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      branch: formData.get('branch') as string,
      designation: designation,
      count: parseInt(formData.get('count') as string),
      targetDate: formData.get('targetDate') as string,
      trainingDate: formData.get('trainingDate') as string,
      status: 'Draft',
      priority: formData.get('priority') as any,
    };
    setPlans([...plans, newPlan]);
    setIsAdding(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Low': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Recruitment Planning</h2>
          <p className="text-sm text-slate-500 font-medium">Plan manpower requirements and map training schedules</p>
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
            New Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {viewMode === 'calendar' ? (
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
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  >
                    {Array.from({ length: 12 }).map((_, i) => (
                      <option key={i} value={i}>{format(new Date(2026, i, 1), 'MMMM')}</option>
                    ))}
                  </select>
                  <select 
                    value={getYear(currentDate)}
                    onChange={(e) => setCurrentDate(setYear(currentDate, parseInt(e.target.value)))}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
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
                      const recruitmentDates = plans.filter(p => isSameDay(new Date(p.targetDate), day));
                      const trainingDates = plans.filter(p => isSameDay(new Date(p.trainingDate), day));
                      const isCurrentMonth = isSameMonth(day, monthStart);
                      const isToday = isSameDay(day, new Date());

                      return (
                        <div 
                          key={i} 
                          className={`min-h-[120px] bg-white p-2 transition-colors ${!isCurrentMonth ? 'bg-slate-50/50' : ''}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs font-bold ${
                              isToday ? 'w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center' : 
                              isCurrentMonth ? 'text-slate-700' : 'text-slate-300'
                            }`}>
                              {format(day, 'd')}
                            </span>
                          </div>
                          <div className="space-y-1">
                            {recruitmentDates.map(p => (
                              <div 
                                key={`rec-${p.id}`}
                                onClick={() => setSelectedPlan(p)}
                                className="px-2 py-1 rounded text-[10px] font-bold truncate cursor-pointer bg-brand-primary/10 text-brand-primary border border-brand-primary/20 hover:bg-brand-primary/20 transition-colors"
                              >
                                <Users size={10} className="inline mr-1" />
                                {p.count} {p.designation}
                              </div>
                            ))}
                            {trainingDates.map(p => (
                              <div 
                                key={`tr-${p.id}`}
                                onClick={() => setSelectedPlan(p)}
                                className="px-2 py-1 rounded text-[10px] font-bold truncate cursor-pointer bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 transition-colors"
                              >
                                <BookOpen size={10} className="inline mr-1" />
                                Training: {p.designation}
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
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-y border-slate-100">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plan ID</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Requirement</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Branch</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dates</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priority</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {plans.map((plan) => (
                      <tr 
                        key={plan.id} 
                        onClick={() => setSelectedPlan(plan)}
                        className={`hover:bg-slate-50/50 cursor-pointer transition-colors ${selectedPlan?.id === plan.id ? 'bg-brand-primary/10' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <span className="text-xs font-mono font-bold text-slate-500">{plan.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800">{plan.designation}</span>
                            <span className="text-xs text-slate-500">{plan.count} positions</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                            <Building2 size={14} className="text-slate-400" />
                            {plan.branch}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-brand-primary flex items-center gap-1">
                              <Users size={10} /> Target: {plan.targetDate}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                              <BookOpen size={10} /> Training: {plan.trainingDate}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider border ${getPriorityColor(plan.priority)}`}>
                            {plan.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              plan.status === 'Completed' ? 'bg-emerald-500' :
                              plan.status === 'In Progress' ? 'bg-brand-primary' : 'bg-amber-500'
                            }`} />
                            <span className="text-xs font-medium text-slate-600">{plan.status}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Details */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {selectedPlan ? (
              <motion.div 
                key={selectedPlan.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm sticky top-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Plan Details</h3>
                  <button onClick={() => setSelectedPlan(null)} className="text-slate-400 hover:text-slate-600">
                    <XCircle size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <h4 className="text-lg font-bold text-slate-900 mb-1">{selectedPlan.designation}</h4>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                      <Building2 size={14} /> {selectedPlan.branch}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Positions</p>
                      <p className="text-sm font-bold text-slate-800">{selectedPlan.count}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Priority</p>
                      <p className={`text-sm font-bold ${selectedPlan.priority === 'High' ? 'text-rose-600' : 'text-slate-800'}`}>{selectedPlan.priority}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-brand-primary/10 border border-brand-primary/20">
                      <div className="flex items-center gap-3">
                        <Users size={16} className="text-brand-primary" />
                        <div>
                          <p className="text-[10px] font-bold text-brand-primary/60 uppercase tracking-widest">Recruitment Target</p>
                          <p className="text-xs font-bold text-brand-primary">{selectedPlan.targetDate}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
                      <div className="flex items-center gap-3">
                        <BookOpen size={16} className="text-emerald-600" />
                        <div>
                          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Training Start</p>
                          <p className="text-xs font-bold text-emerald-900">{selectedPlan.trainingDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex gap-3">
                    <button className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all">
                      Update Status
                    </button>
                    <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all">
                      <Search size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-slate-50 rounded-3xl border border-dashed border-slate-300 p-8 text-center">
                <CalendarIcon className="mx-auto text-slate-300 mb-4" size={48} />
                <p className="text-xs text-slate-500 font-medium">Select a plan on the calendar or list to view details and training mapping.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Plan Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">New Recruitment Plan</h3>
                <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600 p-2">
                  <XCircle size={24} />
                </button>
              </div>
              <form onSubmit={handleAddPlan} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Branch</label>
                    <select name="branch" required defaultValue="" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all">
                      <option value="" disabled>Select Branch</option>
                      {branches.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Designation</label>
                    <select 
                      name="designation" 
                      value={selectedDesignation}
                      onChange={(e) => setSelectedDesignation(e.target.value)}
                      required 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                    >
                      <option value="" disabled>Select Designation</option>
                      {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {selectedDesignation === 'Other' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Specify Designation</label>
                      <input 
                        value={customDesignation}
                        onChange={(e) => setCustomDesignation(e.target.value)}
                        required 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" 
                        placeholder="Enter designation" 
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Positions Count</label>
                    <input name="count" type="number" required min="1" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" placeholder="e.g. 10" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priority</label>
                    <select name="priority" required defaultValue="Medium" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all">
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recruitment Target Date</label>
                    <input name="targetDate" type="date" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Training Start Date</label>
                    <input name="trainingDate" type="date" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">Create Plan</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecruitmentPlanning;
