import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  Search, 
  Filter, 
  Plus, 
  X,
  FileCheck,
  ShieldCheck,
  ClipboardList,
  MoreVertical,
  Calendar,
  HardDrive
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db, auth } from '../firebase';

interface HRFile {
  id: string;
  name: string;
  category: 'HR Policy' | 'Recruitment Requisition' | 'Insurance Policy';
  uploadDate: string;
  size: string;
  type: string;
  uploadedBy: string;
  uid: string;
}

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

const CATEGORIES = [
  { name: 'HR Policy', icon: <FileCheck size={18} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { name: 'Recruitment Requisition', icon: <ClipboardList size={18} />, color: 'text-sky-600', bg: 'bg-sky-50' },
  { name: 'Insurance Policy', icon: <ShieldCheck size={18} />, color: 'text-violet-600', bg: 'bg-violet-50' }
] as const;

const HRRepository: React.FC = () => {
  const [files, setFiles] = useState<HRFile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isUploading, setIsUploading] = useState(false);
  const [newFile, setNewFile] = useState({
    name: '',
    category: 'HR Policy' as HRFile['category']
  });

  useEffect(() => {
    const q = query(collection(db, 'hr_files'), orderBy('uploadDate', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const filesData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as HRFile[];
      setFiles(filesData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'hr_files');
    });

    return () => unsubscribe();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    const fileData = {
      name: newFile.name,
      category: newFile.category,
      uploadDate: new Date().toISOString().split('T')[0],
      size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
      type: 'application/pdf',
      uploadedBy: auth.currentUser.displayName || auth.currentUser.email || 'Unknown',
      uid: auth.currentUser.uid
    };

    try {
      await addDoc(collection(db, 'hr_files'), fileData);
      setIsUploading(false);
      setNewFile({ name: '', category: 'HR Policy' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'hr_files');
    }
  };

  const deleteFile = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'hr_files', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `hr_files/${id}`);
    }
  };

  const filteredFiles = files.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: files.length,
    policies: files.filter(f => f.category === 'HR Policy').length,
    requisitions: files.filter(f => f.category === 'Recruitment Requisition').length,
    insurance: files.filter(f => f.category === 'Insurance Policy').length
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">HR Document Repository</h2>
          <p className="text-sm text-slate-500 font-medium">Centralized storage for policies, requisitions, and insurance documents</p>
        </div>
        <button 
          onClick={() => setIsUploading(true)}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
        >
          <Upload size={18} />
          Upload Document
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-slate-50 text-slate-600 rounded-2xl">
              <HardDrive size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Files</p>
              <h4 className="text-xl font-black text-slate-800">{stats.total}</h4>
            </div>
          </div>
        </div>
        {CATEGORIES.map(cat => (
          <div key={cat.name} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 ${cat.bg} ${cat.color} rounded-2xl`}>
                {cat.icon}
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cat.name}</p>
                <h4 className="text-xl font-black text-slate-800">
                  {cat.name === 'HR Policy' ? stats.policies : 
                   cat.name === 'Recruitment Requisition' ? stats.requisitions : stats.insurance}
                </h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search documents by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <Filter size={18} className="text-slate-400" />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 outline-none"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* File List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-y border-slate-100">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Document Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Size</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFiles.map((file) => (
                <tr key={file.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 text-slate-500 rounded-lg group-hover:bg-white transition-colors">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{file.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{file.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider ${
                      file.category === 'HR Policy' ? 'bg-emerald-50 text-emerald-600' :
                      file.category === 'Recruitment Requisition' ? 'bg-sky-50 text-sky-600' :
                      'bg-violet-50 text-violet-600'
                    }`}>
                      {file.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                      <Calendar size={14} className="text-slate-400" />
                      {file.uploadDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                    {file.size}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-xl transition-all" title="Download">
                        <Download size={18} />
                      </button>
                      <button 
                        onClick={() => deleteFile(file.id)}
                        className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all" 
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredFiles.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Folder size={48} className="mb-4 opacity-20" />
                      <p className="text-sm font-medium">No documents found matching your criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">Upload Document</h3>
                <button onClick={() => setIsUploading(false)} className="text-slate-400 hover:text-slate-600 p-2">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleUpload} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Document Name</label>
                  <input 
                    required 
                    value={newFile.name}
                    onChange={(e) => setNewFile({...newFile, name: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" 
                    placeholder="e.g. HR_Policy_2026.pdf" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</label>
                  <select 
                    value={newFile.category}
                    onChange={(e) => setNewFile({...newFile, category: e.target.value as HRFile['category']})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center hover:border-emerald-500/50 transition-colors cursor-pointer">
                  <Upload className="mx-auto text-slate-300 mb-2" size={32} />
                  <p className="text-xs text-slate-500 font-medium">Click or drag file to upload</p>
                  <p className="text-[10px] text-slate-400 mt-1">PDF, DOCX, XLSX (Max 10MB)</p>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsUploading(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">Upload</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HRRepository;
