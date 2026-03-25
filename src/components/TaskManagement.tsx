import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ClipboardList, User, CheckCircle2, Clock, Calendar, Timer } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description: string;
  assignedTo: string;
  branch: string;
  status: string;
  remarks: string;
  date: string;
  assignmentDate?: string;
  tatDate?: string;
}

interface TaskManagementProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  userBranch?: string;
  userName?: string;
  users: any[];
  role: string;
}

const TaskManagement: React.FC<TaskManagementProps> = ({
  tasks,
  setTasks,
  userBranch,
  userName,
  users,
  role
}) => {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    assignedTo: '',
    assignmentDate: new Date().toISOString().split('T')[0],
    tatDate: ''
  });
  const [response, setResponse] = useState({ status: 'Completed', remarks: '' });

  const assignableUsers = role === 'Branch' 
    ? users.filter(u => u.branch === userBranch && u.role === 'Operations')
    : users.filter(u => u.reportingManager === userName);
  
  // Refined filteredTasks for Management: Tasks they assigned OR tasks assigned to them
  const displayTasks = role === 'Branch'
    ? tasks.filter(t => t.branch === userBranch)
    : role === 'Management'
      ? tasks.filter(t => t.assignedTo === userName || users.find(u => u.name === t.assignedTo)?.reportingManager === userName)
      : tasks.filter(t => t.assignedTo === userName);

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.assignedTo) return;
    const task: Task = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      assignedTo: newTask.assignedTo,
      branch: userBranch || '',
      status: 'Pending',
      remarks: '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      assignmentDate: newTask.assignmentDate,
      tatDate: newTask.tatDate
    };
    setTasks(prev => [task, ...prev]);
    setShowTaskModal(false);
    setNewTask({ 
      title: '', 
      description: '', 
      assignedTo: '',
      assignmentDate: new Date().toISOString().split('T')[0],
      tatDate: ''
    });
  };

  const handleSubmitResponse = () => {
    if (!selectedTask) return;
    setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, ...response } : t));
    setSelectedTask(null);
    setResponse({ status: 'Completed', remarks: '' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              {(role === 'Branch' || role === 'Management') ? 'Task Management' : 'My Assigned Tasks'}
            </h3>
            <p className="text-sm text-slate-500 font-medium">
              {(role === 'Branch' || role === 'Management')
                ? 'Assign and monitor tasks for your team' 
                : 'Tasks assigned to you by your manager'}
            </p>
          </div>
          {(role === 'Branch' || role === 'Management') && (
            <button 
              onClick={() => setShowTaskModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
            >
              <Plus size={18} />
              Assign New Task
            </button>
          )}
          {role !== 'Branch' && role !== 'Management' && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-primary/10 text-brand-primary rounded-lg text-xs font-bold border border-brand-primary/20">
              {displayTasks.filter(t => t.status === 'Pending').length} Pending
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTasks.map((task) => (
            <div key={task.id} className="p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-all relative group">
              <div className="flex items-center justify-between mb-4">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 ${
                  task.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {task.status === 'Completed' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                  {task.status}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">{task.date}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-2">{task.title}</h4>
              <p className="text-xs text-slate-500 mb-4 line-clamp-2">{task.description}</p>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                {task.assignmentDate && (
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <Calendar size={8} /> Assigned
                    </p>
                    <p className="text-[10px] font-bold text-slate-700">{task.assignmentDate}</p>
                  </div>
                )}
                {task.tatDate && (
                  <div className="p-2 rounded-xl bg-rose-50 border border-rose-100">
                    <p className="text-[8px] font-bold text-rose-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <Timer size={8} /> TAT Date
                    </p>
                    <p className="text-[10px] font-bold text-rose-700">{task.tatDate}</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center text-[10px] font-bold text-brand-primary">
                    {task.assignedTo.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <span className="text-[10px] font-bold text-slate-600">{task.assignedTo}</span>
                </div>
              </div>

              {task.assignedTo === userName && task.status === 'Pending' && (
                <button 
                  onClick={() => setSelectedTask(task)}
                  className="mt-4 w-full py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                >
                  Respond to Task
                </button>
              )}

              {task.remarks && (
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    {task.assignedTo === userName ? 'Your Remarks' : 'User Remarks'}
                  </p>
                  <p className="text-[10px] text-slate-600 italic">"{task.remarks}"</p>
                </div>
              )}
            </div>
          ))}
          {displayTasks.length === 0 && (
            <div className="col-span-full text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <ClipboardList size={32} className="mx-auto text-slate-300 mb-3" />
              <p className="text-xs text-slate-400 font-medium">No tasks found.</p>
            </div>
          )}
        </div>
      </div>

      {/* New Task Modal (Branch Role) */}
      <AnimatePresence>
        {showTaskModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Assign New Task</h3>
                <button onClick={() => setShowTaskModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Task Title</label>
                  <input 
                    type="text" 
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm"
                    placeholder="e.g., Site Inspection"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Description</label>
                  <textarea 
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm h-24 resize-none"
                    placeholder="Describe the task details..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Assign To</label>
                  <select 
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm"
                  >
                    <option value="">Select User</option>
                    {assignableUsers.map(u => (
                      <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Date of Assignment</label>
                    <input 
                      type="date" 
                      value={newTask.assignmentDate}
                      onChange={(e) => setNewTask({...newTask, assignmentDate: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">TAT Date</label>
                    <input 
                      type="date" 
                      value={newTask.tatDate}
                      onChange={(e) => setNewTask({...newTask, tatDate: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm"
                    />
                  </div>
                </div>
                <button 
                  onClick={handleCreateTask}
                  className="w-full py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 mt-4"
                >
                  Create Task
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Task Response Modal (Operations Role) */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Respond to Task</h3>
                <button onClick={() => setSelectedTask(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>
              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-700 mb-1">{selectedTask.title}</h4>
                <p className="text-xs text-slate-500">{selectedTask.description}</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Status</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Completed', 'Pending'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setResponse({...response, status: s})}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          response.status === s 
                            ? 'bg-brand-primary border-brand-primary text-white shadow-md' 
                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Remarks</label>
                  <textarea 
                    value={response.remarks}
                    onChange={(e) => setResponse({...response, remarks: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm h-24 resize-none"
                    placeholder="Add your remarks here..."
                  />
                </div>
                <button 
                  onClick={handleSubmitResponse}
                  className="w-full py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 mt-4"
                >
                  Submit Response
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskManagement;
