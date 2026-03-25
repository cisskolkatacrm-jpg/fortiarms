import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Calendar, 
  Building2, 
  Briefcase, 
  Phone, 
  Mail, 
  MapPin, 
  GraduationCap, 
  User, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2,
  ArrowRight,
  FileText,
  Droplets,
  Hash,
  Upload,
  AlertCircle,
  Download,
  FileSpreadsheet,
  Check,
  X,
  Camera,
  Landmark,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { db, auth, storage } from '../firebase';

interface SecurityPersonnelRecruitmentProps {
  userBranch: string;
}

interface RecruitmentRecord {
  id: string;
  recruitmentDate: string;
  branch: string;
  unitName: string;
  ticketNumber: string;
  uniformStatus: string;
  fullName: string;
  fatherName: string;
  contactNumber: string;
  bloodGroup: string;
  education: string;
  address: string;
  personalDob: string;
  aadharNumber: string;
  aadharDob: string;
  panNumber: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  uid: string;
  createdAt: string;
  fileUrls?: {
    photo?: string;
    aadhar?: string;
    pan?: string;
    bank?: string;
  };
}

const SecurityPersonnelRecruitment: React.FC<SecurityPersonnelRecruitmentProps> = ({ userBranch }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dobError, setDobError] = useState<string | null>(null);
  const [recruitments, setRecruitments] = useState<RecruitmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  
  const [formData, setFormData] = useState({
    recruitmentDate: new Date().toISOString().split('T')[0],
    unitName: '',
    ticketNumber: '',
    uniformStatus: '',
    fullName: '',
    fatherName: '',
    contactNumber: '',
    bloodGroup: '',
    education: '',
    address: '',
    personalDob: '',
    aadharNumber: '',
    aadharDob: '',
    panNumber: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    selfDeclaration: false
  });

  const [files, setFiles] = useState<{
    photo?: File;
    aadhar?: File;
    pan?: File;
    bank?: File;
  }>({});

  useEffect(() => {
    const q = query(
      collection(db, 'securityRecruitments'),
      where('branch', '==', userBranch),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RecruitmentRecord[];
      setRecruitments(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userBranch]);

  const unitsByBranch: Record<string, string[]> = {
    'Delhi Branch': ['Corporate Plaza Unit A', 'Retail Hub Security', 'Airport Terminal 1'],
    'Chandigarh Branch': ['Industrial Estate West', 'Residential Complex North'],
    'Jaipur Branch': ['IT Park Security Unit', 'Logistics Center South'],
    'Chennai Branch': ['Port Trust Security', 'IT Corridor Unit'],
    'Bangalore Branch': ['Tech Park Alpha', 'Electronic City Unit'],
    'Hyderabad Branch': ['Pharma Hub Security', 'Cyber Towers Unit'],
    'Kolkata Branch': ['Metro Security Unit', 'Riverfront Industrial'],
    'Bhubaneswar Branch': ['Smart City Plaza', 'Mining Zone Security'],
    'Patna Branch': ['Government Complex Unit', 'Railway Security'],
    'Mumbai Branch': ['Financial District Unit', 'Port Authority Security'],
    'Pune Branch': ['Automobile Hub Unit', 'Education Campus Security'],
    'Ahmedabad Branch': ['Textile Zone Unit', 'Gift City Security']
  };

  const units = unitsByBranch[userBranch] || ['General Unit 1', 'General Unit 2'];

  const handleFileChange = (type: keyof typeof files, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 3 * 1024 * 1024; // 3MB
    if (file.size > maxSize) {
      setFileError(`${(type as string).toUpperCase()} file exceeds the 3MB limit.`);
      return;
    }

    setFileError(null);
    setFiles(prev => ({ ...prev, [type]: file }));
  };

  const uploadFile = async (file: File, path: string) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.personalDob !== formData.aadharDob) {
      setDobError("Date of Birth mismatch! Personal DOB must match Aadhar DOB.");
      return;
    }
    
    if (!formData.selfDeclaration) {
      alert("Please accept the self-declaration.");
      return;
    }

    if (!auth.currentUser) return;

    setDobError(null);
    setIsSubmitting(true);
    
    try {
      const fileUrls: Record<string, string> = {};
      const timestamp = Date.now();

      // Upload files if they exist
      if (files.photo) {
        fileUrls.photo = await uploadFile(files.photo, `recruitments/${timestamp}_photo_${files.photo.name}`);
      }
      if (files.aadhar) {
        fileUrls.aadhar = await uploadFile(files.aadhar, `recruitments/${timestamp}_aadhar_${files.aadhar.name}`);
      }
      if (files.pan) {
        fileUrls.pan = await uploadFile(files.pan, `recruitments/${timestamp}_pan_${files.pan.name}`);
      }
      if (files.bank) {
        fileUrls.bank = await uploadFile(files.bank, `recruitments/${timestamp}_bank_${files.bank.name}`);
      }

      const recruitmentData = {
        ...formData,
        branch: userBranch,
        uid: auth.currentUser.uid,
        createdAt: new Date().toISOString(),
        fileUrls,
        fileMetadata: {
          photo: files.photo?.name || null,
          aadhar: files.aadhar?.name || null,
          pan: files.pan?.name || null,
          bank: files.bank?.name || null
        }
      };

      await addDoc(collection(db, 'securityRecruitments'), recruitmentData);
      setIsSubmitted(true);
      
      // Reset form
      setFormData({
        recruitmentDate: new Date().toISOString().split('T')[0],
        unitName: '',
        ticketNumber: '',
        uniformStatus: '',
        fullName: '',
        fatherName: '',
        contactNumber: '',
        bloodGroup: '',
        education: '',
        address: '',
        personalDob: '',
        aadharNumber: '',
        aadharDob: '',
        panNumber: '',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        selfDeclaration: false
      });
      setFiles({});
      
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Error submitting recruitment:", error);
      alert("Failed to submit recruitment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadPDF = (record: RecruitmentRecord) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Security Personnel Recruitment Details', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    const data = [
      ['ID', record.id],
      ['Recruitment Date', record.recruitmentDate],
      ['Branch', record.branch],
      ['Unit Name', record.unitName],
      ['Ticket Number', record.ticketNumber],
      ['Full Name', record.fullName],
      ['Father\'s Name', record.fatherName],
      ['Contact Number', record.contactNumber],
      ['DOB (Personal)', record.personalDob],
      ['Aadhar Number', record.aadharNumber],
      ['Aadhar DOB', record.aadharDob],
      ['PAN Number', record.panNumber],
      ['Bank Name', record.bankName],
      ['Account Number', record.accountNumber],
      ['IFSC Code', record.ifscCode],
      ['Address', record.address]
    ];

    autoTable(doc, {
      startY: 30,
      body: data,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42] }
    });

    doc.save(`${record.fullName}_Recruitment.pdf`);
  };

  const downloadAllExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(recruitments);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Recruitments");
    XLSX.writeFile(workbook, "All_Recruitments.xlsx");
  };

  const downloadAllPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.text('All Recruitment Records', 14, 15);
    
    const tableData = recruitments.map(r => [
      r.id, r.fullName, r.contactNumber, r.branch, r.unitName, r.aadharNumber, r.status || 'Active'
    ]);

    autoTable(doc, {
      startY: 20,
      head: [['ID', 'Name', 'Contact', 'Branch', 'Unit', 'Aadhar', 'Status']],
      body: tableData,
    });

    doc.save('All_Recruitments.pdf');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Security Personnel Recruitment</h2>
          <p className="text-sm text-slate-500 font-medium">Register new security personnel joining details at branch level</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={downloadAllExcel}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 border border-emerald-100"
          >
            <FileSpreadsheet size={16} />
            Export Excel
          </button>
          <button 
            onClick={downloadAllPDF}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 border border-emerald-100"
          >
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 md:p-12">
          {isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Recruitment Successful</h3>
              <p className="text-slate-500 max-w-sm">
                The security personnel recruitment details have been submitted successfully.
              </p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="mt-8 px-8 py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
              >
                Recruit Another Personnel
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Section: Basic Recruitment Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 bg-brand-primary/10 text-brand-primary rounded-lg flex items-center justify-center">
                    <UserPlus size={18} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Recruitment Details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Recruitment Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="date" 
                        required 
                        value={formData.recruitmentDate}
                        onChange={e => setFormData({...formData, recruitmentDate: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Branch</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        readOnly 
                        value={userBranch}
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-600 outline-none cursor-not-allowed" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Unit Name</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <select 
                        required 
                        value={formData.unitName}
                        onChange={e => setFormData({...formData, unitName: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all appearance-none"
                      >
                        <option value="" disabled>Select Unit</option>
                        {units.map(unit => (
                          <option key={unit} value={unit}>{unit}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ticket Number</label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. TKT-12345" 
                        value={formData.ticketNumber}
                        onChange={e => setFormData({...formData, ticketNumber: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Uniform Issue Status</label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <select 
                        required 
                        value={formData.uniformStatus}
                        onChange={e => setFormData({...formData, uniformStatus: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all appearance-none"
                      >
                        <option value="" disabled>Select Status</option>
                        <option value="Issued">Issued</option>
                        <option value="Pending">Pending</option>
                        <option value="Partial">Partial</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Personal Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                    <User size={18} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Personal Details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        required 
                        placeholder="Enter full name" 
                        value={formData.fullName}
                        onChange={e => setFormData({...formData, fullName: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Father's Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        required 
                        placeholder="Enter father's name" 
                        value={formData.fatherName}
                        onChange={e => setFormData({...formData, fatherName: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="date" 
                        required 
                        value={formData.personalDob}
                        onChange={e => setFormData({...formData, personalDob: e.target.value})}
                        className={`w-full bg-slate-50 border rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all ${dobError ? 'border-rose-500' : 'border-slate-200'}`} 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Contact Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="tel" 
                        required 
                        placeholder="+91 XXXXX XXXXX" 
                        value={formData.contactNumber}
                        onChange={e => setFormData({...formData, contactNumber: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Blood Group</label>
                    <div className="relative">
                      <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <select 
                        required 
                        value={formData.bloodGroup}
                        onChange={e => setFormData({...formData, bloodGroup: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all appearance-none"
                      >
                        <option value="" disabled>Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Education Qualification</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. 10th Pass, Graduate" 
                        value={formData.education}
                        onChange={e => setFormData({...formData, education: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Personnel Photo</label>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*"
                        required
                        onChange={(e) => handleFileChange('photo', e)}
                        className="hidden" 
                        id="photo-upload"
                      />
                      <label 
                        htmlFor="photo-upload"
                        className="flex items-center gap-2 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-500 cursor-pointer hover:bg-slate-100 transition-all"
                      >
                        <Camera size={16} className="text-slate-400" />
                        {files.photo ? files.photo.name : 'Upload Photo'}
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-6 text-slate-400" size={16} />
                      <textarea 
                        required 
                        rows={2} 
                        placeholder="Full residential address" 
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Statutory & Verification Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                    <CreditCard size={18} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Statutory & Verification</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Aadhar Number</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        required 
                        placeholder="XXXX XXXX XXXX" 
                        value={formData.aadharNumber}
                        onChange={e => setFormData({...formData, aadharNumber: e.target.value})}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" 
                      />
                      <div className="relative">
                        <input type="file" required className="hidden" id="aadhar-upload" onChange={e => handleFileChange('aadhar', e)} />
                        <label htmlFor="aadhar-upload" className="flex items-center justify-center w-12 h-12 bg-slate-100 text-slate-500 rounded-xl cursor-pointer hover:bg-slate-200 transition-all">
                          <Upload size={18} />
                        </label>
                      </div>
                    </div>
                    {files.aadhar && <p className="text-[10px] text-emerald-600 font-bold ml-1 flex items-center gap-1"><Check size={10} /> {files.aadhar.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Date of Birth on Aadhar</label>
                    <input 
                      type="date" 
                      required 
                      value={formData.aadharDob}
                      onChange={e => setFormData({...formData, aadharDob: e.target.value})}
                      className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all ${dobError ? 'border-rose-500' : 'border-slate-200'}`} 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">PAN Number</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        required 
                        placeholder="ABCDE1234F" 
                        value={formData.panNumber}
                        onChange={e => setFormData({...formData, panNumber: e.target.value})}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" 
                      />
                      <div className="relative">
                        <input type="file" required className="hidden" id="pan-upload" onChange={e => handleFileChange('pan', e)} />
                        <label htmlFor="pan-upload" className="flex items-center justify-center w-12 h-12 bg-slate-100 text-slate-500 rounded-xl cursor-pointer hover:bg-slate-200 transition-all">
                          <Upload size={18} />
                        </label>
                      </div>
                    </div>
                    {files.pan && <p className="text-[10px] text-emerald-600 font-bold ml-1 flex items-center gap-1"><Check size={10} /> {files.pan.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Bank Name</label>
                    <div className="relative">
                      <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        required 
                        placeholder="Enter bank name" 
                        value={formData.bankName}
                        onChange={e => setFormData({...formData, bankName: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Account Number</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Enter account number" 
                      value={formData.accountNumber}
                      onChange={e => setFormData({...formData, accountNumber: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">IFSC Code</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        required 
                        placeholder="HDFC0001234" 
                        value={formData.ifscCode}
                        onChange={e => setFormData({...formData, ifscCode: e.target.value})}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" 
                      />
                      <div className="relative">
                        <input type="file" required className="hidden" id="bank-upload" onChange={e => handleFileChange('bank', e)} />
                        <label htmlFor="bank-upload" className="flex items-center justify-center w-12 h-12 bg-slate-100 text-slate-500 rounded-xl cursor-pointer hover:bg-slate-200 transition-all">
                          <Upload size={18} />
                        </label>
                      </div>
                    </div>
                    {files.bank && <p className="text-[10px] text-emerald-600 font-bold ml-1 flex items-center gap-1"><Check size={10} /> {files.bank.name}</p>}
                  </div>
                </div>
              </div>

              {/* Self Declaration */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <div className="relative flex items-center mt-1">
                    <input 
                      type="checkbox" 
                      required
                      checked={formData.selfDeclaration}
                      onChange={e => setFormData({...formData, selfDeclaration: e.target.checked})}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 bg-white transition-all checked:border-brand-primary checked:bg-brand-primary focus:outline-none" 
                    />
                    <Check className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity" size={14} />
                  </div>
                  <span className="text-sm text-slate-600 font-medium leading-relaxed group-hover:text-slate-900 transition-colors">
                    All details provided are correct and the provided Aadhar card is linked with the provided contact number.
                  </span>
                </label>
              </div>

              {dobError && (
                <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-4 rounded-xl border border-rose-100">
                  <AlertCircle size={18} />
                  <p className="text-sm font-bold">{dobError}</p>
                </div>
              )}

              {fileError && (
                <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-4 rounded-xl border border-rose-100">
                  <AlertCircle size={18} />
                  <p className="text-sm font-bold">{fileError}</p>
                </div>
              )}

              <div className="pt-6 flex justify-end">
                <button 
                  type="submit"
                  disabled={!!fileError}
                  className="px-10 py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Recruitment Details
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Recent Recruitments Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Recent Recruitments</h3>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Total: {recruitments.length}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID</th>
                <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Personnel Name</th>
                <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unit</th>
                <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact</th>
                <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aadhar</th>
                <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recruitments.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 text-xs font-bold text-slate-400">{rec.id}</td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">{rec.fullName}</span>
                      <span className="text-[10px] text-slate-500">{rec.recruitmentDate}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">{rec.unitName}</td>
                  <td className="py-4 px-6 text-sm text-slate-600">{rec.contactNumber}</td>
                  <td className="py-4 px-6 text-sm text-slate-600">{rec.aadharNumber}</td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => downloadPDF(rec)}
                      className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-all"
                      title="Download PDF"
                    >
                      <Download size={18} />
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

export default SecurityPersonnelRecruitment;
