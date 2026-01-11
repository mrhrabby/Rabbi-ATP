
import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, List, LayoutGrid, Database, Download, Upload, 
  Plus, Edit3, Trash2, X, Save, LogOut, ExternalLink, RefreshCcw, Search, BarChart3, Settings2,
  Menu, Image as ImageIcon, Camera, AlertTriangle, Github, CheckCircle2, Loader2, Navigation,
  Phone
} from 'lucide-react';
import { Category, InfoItem, AdminSection, GitHubConfig } from '../types';
import { pushToGitHub } from '../services/githubService';

interface AdminDashboardProps {
  categories: Category[];
  infoData: InfoItem[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setInfoData: React.Dispatch<React.SetStateAction<InfoItem[]>>;
  onExit: () => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  categories, infoData, setCategories, setInfoData, onExit, onLogout 
}) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const [githubConfig, setGithubConfig] = useState<GitHubConfig>(() => {
    const saved = localStorage.getItem('aminpur_github_config');
    return saved ? JSON.parse(saved) : {
      token: '', owner: '', repo: '', path: 'data.json', branch: 'main'
    };
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageUploadRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('aminpur_github_config', JSON.stringify(githubConfig));
  }, [githubConfig]);

  useEffect(() => {
    window.history.pushState({ section: 'admin' }, '');
    const handlePopState = () => {
      setShowExitConfirm(true);
      window.history.pushState({ section: 'admin' }, '');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => { setIsSidebarOpen(false); }, [activeSection]);

  const syncWithGitHub = async (updatedCats: Category[], updatedInfo: InfoItem[]) => {
    if (!githubConfig.token) return;
    setIsSyncing(true);
    setSyncStatus('idle');
    const success = await pushToGitHub(githubConfig, { categories: updatedCats, infoData: updatedInfo });
    setIsSyncing(false);
    setSyncStatus(success ? 'success' : 'error');
    setTimeout(() => setSyncStatus('idle'), 3000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 500) { alert('ছবিটি অনেক বড় (৫০০কিবির বেশি)।'); return; }
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id: string, type: 'info' | 'cat') => {
    if (window.confirm('আপনি কি নিশ্চিত?')) {
      let newCats = [...categories];
      let newInfo = [...infoData];
      if (type === 'info') {
        newInfo = infoData.filter(i => i.id !== id);
        setInfoData(newInfo);
      } else {
        newCats = categories.filter(c => c.id !== id);
        setCategories(newCats);
      }
      await syncWithGitHub(newCats, newInfo);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    let newCats = [...categories];
    let newInfo = [...infoData];
    if (activeSection === 'manage_info') {
      if (editItem) newInfo = infoData.map(i => i.id === editItem.id ? { ...i, ...formData } : i);
      else newInfo = [{ ...formData, id: Date.now().toString() }, ...infoData];
      setInfoData(newInfo);
    } else {
      if (editItem) newCats = categories.map(c => c.id === editItem.id ? { ...c, ...formData } : c);
      else newCats = [...categories, { ...formData, id: Date.now().toString(), color: 'bg-slate-500', icon: 'Home' }];
      setCategories(newCats);
    }
    setIsEditing(false);
    setEditItem(null);
    await syncWithGitHub(newCats, newInfo);
  };

  const NavItem = ({ section, icon: Icon, label }: { section: AdminSection, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveSection(section)}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-[20px] font-black transition-all ${activeSection === section ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' : 'hover:bg-slate-800 text-slate-400'}`}
    >
      <Icon className="w-5 h-5" /> {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-[#F1F5F9] font-['Hind_Siliguri'] overflow-hidden relative">
      {/* GitHub Sync Status Bar */}
      <div className={`fixed bottom-8 right-8 z-[300] flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-3xl shadow-2xl transition-all duration-500 ${isSyncing || syncStatus !== 'idle' ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        {isSyncing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
            <span className="text-sm font-black uppercase tracking-widest">গিটহাবে সিঙ্ক হচ্ছে...</span>
          </>
        ) : syncStatus === 'success' ? (
          <>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-black uppercase tracking-widest">সিঙ্ক সফল হয়েছে!</span>
          </>
        ) : (
          <>
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <span className="text-sm font-black uppercase tracking-widest">সিঙ্ক ব্যর্থ হয়েছে</span>
          </>
        )}
      </div>

      {/* Admin Exit Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[400] flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-10 text-center">
              <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <LogOut className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">প্যানেল ছাড়তে চান?</h3>
              <p className="text-slate-500 font-medium leading-relaxed">অ্যাডমিন প্যানেল থেকে বের হয়ে পাবলিক অ্যাপে ফিরে যাবেন?</p>
            </div>
            <div className="flex p-6 gap-3 bg-slate-50">
              <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black shadow-sm">না</button>
              <button onClick={() => { setShowExitConfirm(false); onExit(); }} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-900/20 active:scale-95 transition-all">হ্যাঁ</button>
            </div>
          </div>
        </div>
      )}

      {/* Sleek Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-80 bg-[#0F172A] text-slate-300 flex flex-col shadow-2xl transition-transform duration-500 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-2xl shadow-blue-500/40"><Settings2 className="w-7 h-7" /></div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tighter uppercase">অ্যাডমিন</h2>
              <p className="text-[10px] font-black text-blue-400 tracking-[0.2em] mt-1">কন্ট্রোল সেন্টার</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-500 hover:bg-white/5 rounded-full transition-colors"><X className="w-6 h-6" /></button>
        </div>
        
        <nav className="flex-1 px-6 py-4 space-y-3 overflow-y-auto custom-scrollbar">
          <NavItem section="overview" icon={LayoutDashboard} label="ওভারভিউ" />
          <NavItem section="manage_info" icon={List} label="তথ্য ব্যবস্থাপনা" />
          <NavItem section="manage_cats" icon={LayoutGrid} label="ক্যাটাগরি" />
          <NavItem section="backups" icon={Database} label="ব্যাকআপ" />
          <NavItem section="settings" icon={Github} label="গিটহাব সিঙ্ক" />
        </nav>

        <div className="p-8 border-t border-white/5 space-y-4">
          <button onClick={() => setShowExitConfirm(true)} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black transition-all">
            <ExternalLink className="w-5 h-5 text-blue-400" /> পাবলিক অ্যাপ
          </button>
          <button onClick={() => { if(window.confirm('লগআউট করতে চান?')) onLogout(); }} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-rose-400 hover:bg-rose-400/10 font-black transition-all">
            <LogOut className="w-5 h-5" /> লগআউট
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-8 lg:px-12 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-slate-100 rounded-2xl text-slate-600"><Menu className="w-6 h-6" /></button>
            <div className="hidden sm:block">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                {activeSection === 'overview' && 'ড্যাশবোর্ড'}
                {activeSection === 'manage_info' && 'তথ্য ব্যবস্থাপনা'}
                {activeSection === 'manage_cats' && 'ক্যাটাগরি হাব'}
                {activeSection === 'backups' && 'ব্যাকআপ'}
                {activeSection === 'settings' && 'গিটহাব সিঙ্ক'}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-black text-slate-800">মীর রাব্বি হোসেন</p>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">সুপার এডমিন</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center font-black text-white text-xl">M</div>
          </div>
        </header>

        <div className="p-6 lg:p-12 max-w-7xl mx-auto w-full">
          {activeSection === 'overview' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { label: 'মোট ক্যাটাগরি', value: categories.length, icon: LayoutGrid, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'মোট তথ্য', value: infoData.length, icon: Database, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'সিঙ্ক আপডেট', value: isSyncing ? 'সিঙ্ক হচ্ছে' : 'অ্যাক্টিভ', icon: RefreshCcw, color: 'text-amber-600', bg: 'bg-amber-50' }
                ].map((s, idx) => (
                  <div key={idx} className="bg-white p-10 rounded-[40px] border border-slate-50 shadow-sm flex items-center gap-8 group hover:shadow-2xl transition-all duration-500">
                    <div className={`w-20 h-20 ${s.bg} ${s.color} rounded-[28px] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                      <s.icon className="w-10 h-10" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{s.label}</p>
                      <h4 className="text-4xl font-black text-slate-800 tracking-tighter">{s.value}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="max-w-3xl bg-white p-12 rounded-[56px] border border-slate-50 shadow-sm animate-in fade-in slide-in-from-bottom-8 mx-auto">
              <div className="flex items-center gap-6 mb-12">
                <div className="w-20 h-20 bg-slate-900 text-white rounded-[28px] flex items-center justify-center shadow-2xl shadow-slate-900/40"><Github className="w-10 h-10" /></div>
                <div>
                  <h4 className="text-3xl font-black text-slate-800 tracking-tight">গিটহাব সিঙ্ক</h4>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">অটোমেটিক ডাটা আপডেট</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Personal Access Token</label>
                  <input type="password" value={githubConfig.token} onChange={e => setGithubConfig({...githubConfig, token: e.target.value})} className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[24px] outline-none font-bold text-slate-700 focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all" placeholder="ghp_xxxxxxxxxxxx" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Owner</label>
                    <input value={githubConfig.owner} onChange={e => setGithubConfig({...githubConfig, owner: e.target.value})} className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[24px] outline-none font-bold text-slate-700 focus:border-blue-600 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Repo Name</label>
                    <input value={githubConfig.repo} onChange={e => setGithubConfig({...githubConfig, repo: e.target.value})} className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[24px] outline-none font-bold text-slate-700 focus:border-blue-600 transition-all" />
                  </div>
                </div>
                
                <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-[32px] flex items-start gap-4 mt-6">
                  <AlertTriangle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <p className="text-xs font-bold text-blue-800 leading-relaxed">
                    আপনার গিটহাব টোকেনটি শুধুমাত্র আপনার ব্রাউজারে সংরক্ষিত থাকবে। কোনো পরিবর্তনের পর ডাটাগুলো সরাসরি গিটহাবে পুশ হবে যা আপনার গিটহাব একশনে অটোমেটিক ডেপ্লয়মেন্টে সাহায্য করবে।
                  </p>
                </div>

                <button onClick={() => syncWithGitHub(categories, infoData)} disabled={isSyncing} className="w-full mt-8 py-6 bg-slate-900 text-white rounded-[32px] font-black shadow-2xl shadow-slate-900/30 flex items-center justify-center gap-4 active:scale-95 transition-all text-lg">
                  {isSyncing ? <Loader2 className="w-6 h-6 animate-spin" /> : <RefreshCcw className="w-6 h-6" />}
                  টেস্ট সিঙ্ক করুন
                </button>
              </div>
            </div>
          )}

          {activeSection === 'manage_info' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white p-8 rounded-[40px] shadow-sm border border-slate-50">
                <div className="relative w-full md:w-96 group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
                  <input type="text" placeholder="নাম খুঁজুন..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none font-black text-slate-700 focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all" />
                </div>
                <button onClick={() => { setEditItem(null); setFormData({}); setIsEditing(true); }} className="w-full md:w-auto px-10 py-5 bg-blue-600 text-white rounded-[24px] font-black flex items-center justify-center gap-3 text-lg shadow-xl shadow-blue-500/30 active:scale-95 transition-all">
                  <Plus className="w-6 h-6" /> নতুন তথ্য যোগ
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {infoData.filter(i => i.title.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                  <div key={item.id} className="bg-white p-8 rounded-[40px] border border-slate-50 shadow-sm flex flex-col md:flex-row items-center gap-8 group hover:shadow-2xl transition-all duration-500">
                    <div className="w-32 h-32 bg-slate-100 rounded-[32px] flex-shrink-0 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl group-hover:scale-105 transition-transform">
                      {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <ImageIcon className="w-10 h-10 text-slate-300" />}
                    </div>
                    <div className="flex-1 text-center md:text-left min-w-0">
                      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                        <h5 className="font-black text-slate-800 text-xl truncate">{item.title}</h5>
                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest self-center">
                          {categories.find(c => c.id === item.categoryId)?.name}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-400 line-clamp-1 mb-4">{item.address}</p>
                      <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        {item.phone && <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black"><Phone className="w-3.5 h-3.5" /> {item.phone}</div>}
                        {item.mapLink && <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-black"><Navigation className="w-3.5 h-3.5" /> ম্যাপ</div>}
                      </div>
                    </div>
                    <div className="flex gap-3 md:flex-col lg:flex-row">
                      <button onClick={() => { setEditItem(item); setFormData(item); setIsEditing(true); }} className="px-6 py-4 bg-blue-50 text-blue-600 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-all"><Edit3 className="w-4 h-4" /> এডিট</button>
                      <button onClick={() => handleDelete(item.id, 'info')} className="p-4 bg-rose-50 text-rose-600 rounded-2xl font-black hover:bg-rose-600 hover:text-white transition-all"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'manage_cats' && (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
                {categories.map(cat => (
                  <div key={cat.id} className="bg-white p-10 rounded-[48px] border border-slate-50 shadow-sm flex flex-col justify-between group hover:shadow-2xl transition-all duration-500">
                    <div>
                      <div className={`w-20 h-20 ${cat.color} rounded-[28px] flex items-center justify-center text-white mb-8 overflow-hidden shadow-2xl group-hover:scale-110 transition-transform`}>
                        {cat.image ? <img src={cat.image} className="w-full h-full object-cover" /> : <ImageIcon className="w-10 h-10" />}
                      </div>
                      <h4 className="text-2xl font-black text-slate-800 tracking-tight mb-2">{cat.name}</h4>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{cat.description}</p>
                    </div>
                    <div className="mt-12 flex gap-3">
                      <button onClick={() => { setEditItem(cat); setFormData(cat); setIsEditing(true); }} className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black flex items-center justify-center gap-2 text-sm hover:bg-slate-900 hover:text-white transition-all"><Edit3 className="w-4 h-4" /> এডিট</button>
                      <button onClick={() => handleDelete(cat.id, 'cat')} className="p-4 bg-rose-50 text-rose-600 rounded-2xl font-black hover:bg-rose-600 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
                <button onClick={() => { setEditItem(null); setFormData({}); setIsEditing(true); }} className="bg-white p-10 rounded-[48px] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 hover:text-blue-600 hover:border-blue-600 transition-all group">
                  <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center mb-6 group-hover:bg-blue-50 group-hover:scale-110 transition-all"><Plus className="w-10 h-10" /></div>
                  <span className="font-black text-lg uppercase tracking-widest">নতুন ক্যাটাগরি</span>
                </button>
             </div>
          )}

          {activeSection === 'backups' && (
            <div className="max-w-2xl mx-auto text-center py-20">
              <div className="w-32 h-32 bg-emerald-50 text-emerald-600 rounded-[48px] flex items-center justify-center mx-auto mb-10 shadow-inner"><Database className="w-16 h-16" /></div>
              <h3 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">ডেটা ব্যাকআপ</h3>
              <p className="text-slate-400 font-bold mb-12 max-w-sm mx-auto">পুরো ডাটাবেসটি একটি JSON ফাইলে সেভ করে অফলাইনে ব্যাকআপ রাখতে পারেন।</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-6">
                <button onClick={() => {
                  const data = { categories, infoData, version: "3.0", date: new Date().toISOString() };
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                  const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `aminpur_backup_${new Date().toLocaleDateString()}.json`; link.click();
                }} className="p-10 bg-blue-600 text-white rounded-[40px] font-black flex flex-col items-center gap-4 shadow-2xl shadow-blue-500/30 active:scale-95 transition-all">
                  <Download className="w-10 h-10" /> এক্সপোর্ট
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="p-10 bg-emerald-600 text-white rounded-[40px] font-black flex flex-col items-center gap-4 shadow-2xl shadow-emerald-500/30 active:scale-95 transition-all">
                  <Upload className="w-10 h-10" /> ইম্পোর্ট
                  <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={(e) => {
                     const reader = new FileReader(); reader.onload = (ev) => {
                       const data = JSON.parse(ev.target?.result as string);
                       if(data.categories && data.infoData) { setCategories(data.categories); setInfoData(data.infoData); alert('ডেটা সফলভাবে ইম্পোর্ট হয়েছে!'); }
                     };
                     if(e.target.files?.[0]) reader.readAsText(e.target.files[0]);
                  }} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal - Full Screen Mobile / Centered Desktop */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[500] flex items-center justify-center p-0 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-none sm:rounded-[56px] w-full max-w-2xl min-h-screen sm:min-h-0 my-auto overflow-hidden shadow-2xl animate-in zoom-in slide-in-from-bottom-20 duration-500 flex flex-col">
            <div className="p-8 lg:p-12 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">{editItem ? 'সম্পাদনা' : 'নতুন তথ্য'}</h3>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">তথ্য আপডেট করুন</p>
              </div>
              <button onClick={() => setIsEditing(false)} className="p-4 bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded-3xl transition-all shadow-sm border border-slate-100"><X className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 lg:p-12 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col items-center gap-6 py-8 bg-slate-50 rounded-[40px] border-4 border-dashed border-slate-100">
                <div className="w-32 h-32 bg-white rounded-[32px] overflow-hidden shadow-2xl flex items-center justify-center relative group border-4 border-white">
                  {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <div className="text-slate-200 flex flex-col items-center gap-2"><ImageIcon className="w-12 h-12" /><span className="text-[10px] font-black uppercase tracking-widest">No Photo</span></div>}
                  <button type="button" onClick={() => imageUploadRef.current?.click()} className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-sm"><Camera className="w-10 h-10" /></button>
                </div>
                <input type="file" ref={imageUploadRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                <button type="button" onClick={() => imageUploadRef.current?.click()} className="px-6 py-3 bg-white text-blue-600 rounded-2xl font-black text-xs shadow-sm border border-slate-100 hover:shadow-md transition-all">ছবি পরিবর্তন করুন</button>
              </div>

              <div className="space-y-6">
                {activeSection === 'manage_info' ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-4">প্রতিষ্ঠানের নাম</label>
                      <input required value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[24px] outline-none font-black text-slate-700 focus:border-blue-600 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-4">ক্যাটাগরি</label>
                      <select required value={formData.categoryId || ''} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[24px] outline-none font-black text-slate-700 focus:border-blue-600 transition-all appearance-none">
                        <option value="">ক্যাটাগরি নির্বাচন করুন</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-4">ঠিকানা</label>
                      <input value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[24px] outline-none font-black text-slate-700 focus:border-blue-600 transition-all" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-4">ফোন নাম্বার</label>
                        <input value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[24px] outline-none font-black text-slate-700 focus:border-blue-600 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Google Map লিঙ্ক</label>
                        <input value={formData.mapLink || ''} onChange={e => setFormData({...formData, mapLink: e.target.value})} className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[24px] outline-none font-black text-slate-700 focus:border-blue-600 transition-all" placeholder="https://..." />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-4">ক্যাটাগরি নাম</label>
                      <input required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[24px] outline-none font-black text-slate-700 focus:border-blue-600 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-4">বর্ণনা</label>
                      <input value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[24px] outline-none font-black text-slate-700 focus:border-blue-600 transition-all" />
                    </div>
                  </>
                )}
              </div>
              
              <button type="submit" disabled={isSyncing} className="w-full py-6 bg-slate-900 text-white rounded-[32px] font-black shadow-2xl shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-center gap-4 text-xl mt-4">
                {isSyncing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                ডেটা সেভ করুন
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
