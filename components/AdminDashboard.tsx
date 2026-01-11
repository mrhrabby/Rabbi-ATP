
import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, List, LayoutGrid, Database, Download, Upload, 
  Plus, Edit3, Trash2, X, Save, LogOut, ExternalLink, RefreshCcw, Search, BarChart3, Settings2,
  Menu, Image as ImageIcon, Camera, AlertTriangle, Github, CheckCircle2, Loader2
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
      token: '',
      owner: '',
      repo: '',
      path: 'data.json',
      branch: 'main'
    };
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageUploadRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('aminpur_github_config', JSON.stringify(githubConfig));
  }, [githubConfig]);

  // Trap back button
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
      if (file.size > 1024 * 500) { 
        alert('ছবিটি অনেক বড় (৫০০কিবির বেশি)।');
        return;
      }
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

  const stats = [
    { label: 'মোট ক্যাটাগরি', value: categories.length, icon: LayoutGrid, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'মোট তথ্য', value: infoData.length, icon: Database, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'সিঙ্ক স্ট্যাটাস', value: isSyncing ? 'সিঙ্ক হচ্ছে...' : 'আপ-টু-ডেট', icon: RefreshCcw, color: 'text-amber-600', bg: 'bg-amber-50' }
  ];

  const NavItem = ({ section, icon: Icon, label }: { section: AdminSection, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveSection(section)}
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${activeSection === section ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'hover:bg-slate-800 text-slate-400'}`}
    >
      <Icon className="w-5 h-5" /> {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-[#F1F5F9] font-['Hind_Siliguri'] overflow-hidden relative">
      {/* GitHub Sync Toast */}
      {isSyncing && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] bg-slate-900 text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl animate-in fade-in slide-in-from-top-4">
          <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
          <span className="text-sm font-bold">গিটহাবে সিঙ্ক হচ্ছে...</span>
        </div>
      )}
      {syncStatus === 'success' && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] bg-emerald-600 text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-sm font-bold">সফলভাবে সিঙ্ক হয়েছে!</span>
        </div>
      )}

      {/* Admin Exit Confirmation Overlay */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-10 text-center">
              <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <LogOut className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">আপনি কি বের হতে চান?</h3>
              <p className="text-slate-500 font-medium">অ্যাডমিন প্যানেল থেকে বের হয়ে পাবলিক অ্যাপে ফিরে যাবেন?</p>
            </div>
            <div className="flex p-6 gap-3 bg-slate-50">
              <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black">না</button>
              <button onClick={() => { setShowExitConfirm(false); onExit(); }} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-200">হ্যাঁ, বের হবো</button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#0F172A] text-slate-300 flex flex-col shadow-2xl transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/20"><Settings2 className="w-6 h-6" /></div>
            <h2 className="text-lg font-black text-white">এডমিন</h2>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-500"><X className="w-6 h-6" /></button>
        </div>
        <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto custom-scrollbar">
          <NavItem section="overview" icon={LayoutDashboard} label="ওভারভিউ" />
          <NavItem section="manage_info" icon={List} label="তথ্য ব্যবস্থাপনা" />
          <NavItem section="manage_cats" icon={LayoutGrid} label="ক্যাটাগরি" />
          <NavItem section="backups" icon={Database} label="ব্যাকআপ" />
          <NavItem section="settings" icon={Github} label="গিটহাব সেটিংস" />
        </nav>
        <div className="p-6 border-t border-slate-800 space-y-3">
          <button onClick={() => setShowExitConfirm(true)} className="w-full flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all"><ExternalLink className="w-4 h-4" /> পাবলিক অ্যাপ</button>
          <button onClick={() => { if(window.confirm('লগআউট করতে চান?')) onLogout(); }} className="w-full flex items-center gap-3 px-5 py-3 rounded-xl text-red-400 hover:bg-red-400/10 font-bold transition-all"><LogOut className="w-4 h-4" /> লগআউট</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-slate-100 rounded-xl"><Menu className="w-6 h-6 text-slate-600" /></button>
            <h3 className="text-lg lg:text-xl font-black text-slate-800 uppercase">
              {activeSection === 'overview' && 'ড্যাশবোর্ড'}
              {activeSection === 'manage_info' && 'তথ্য ব্যবস্থাপনা'}
              {activeSection === 'manage_cats' && 'ক্যাটাগরি'}
              {activeSection === 'backups' && 'ব্যাকআপ'}
              {activeSection === 'settings' && 'গিটহাব সেটিংস'}
            </h3>
          </div>
        </header>

        <div className="p-4 lg:p-10 max-w-7xl mx-auto w-full">
          {activeSection === 'overview' && (
            <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                {stats.map((s, idx) => (
                  <div key={idx} className="bg-white p-6 lg:p-8 rounded-[24px] lg:rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4 lg:gap-6">
                    <div className={`w-12 h-12 lg:w-16 lg:h-16 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center`}><s.icon className="w-6 h-6 lg:w-8 lg:h-8" /></div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                      <h4 className="text-xl lg:text-3xl font-black text-slate-800 mt-1">{s.value}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="max-w-2xl bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg"><Github className="w-8 h-8" /></div>
                <div>
                  <h4 className="text-xl font-black text-slate-800">গিটহাব অটো-সিঙ্ক সেটিংস</h4>
                  <p className="text-sm font-medium text-slate-400">আপনার গিটহাব রিপোজিটরির তথ্য দিন</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">GitHub Personal Access Token</label>
                  <input type="password" value={githubConfig.token} onChange={e => setGithubConfig({...githubConfig, token: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" placeholder="ghp_xxxxxxxxxxxx" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Username (Owner)</label>
                    <input value={githubConfig.owner} onChange={e => setGithubConfig({...githubConfig, owner: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" placeholder="mirrabbi" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Repository Name</label>
                    <input value={githubConfig.repo} onChange={e => setGithubConfig({...githubConfig, repo: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" placeholder="aminpur-app" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">File Path (e.g. data.json)</label>
                    <input value={githubConfig.path} onChange={e => setGithubConfig({...githubConfig, path: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Branch</label>
                    <input value={githubConfig.branch} onChange={e => setGithubConfig({...githubConfig, branch: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" />
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3 mt-4">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <p className="text-xs font-bold text-blue-700 leading-relaxed">
                    সতর্কতা: আপনার টোকেনটি শুধুমাত্র ব্রাউজারের লোকাল স্টোরেজে সেভ থাকবে। নিরাপত্তার জন্য আপনার টোকেনটি কাউকে শেয়ার করবেন না।
                  </p>
                </div>

                <button onClick={() => syncWithGitHub(categories, infoData)} disabled={isSyncing} className="w-full mt-4 py-5 bg-slate-900 text-white rounded-2xl font-black shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                  {isSyncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCcw className="w-5 h-5" />}
                  এখনই টেস্ট সিঙ্ক করুন
                </button>
              </div>
            </div>
          )}

          {activeSection === 'manage_info' && (
            <div className="space-y-4 lg:space-y-6 animate-in fade-in">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 lg:p-6 rounded-[24px] lg:rounded-[32px] shadow-sm">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input type="text" placeholder="নাম বা ঠিকানা..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm" />
                </div>
                <button onClick={() => { setEditItem(null); setFormData({}); setIsEditing(true); }} className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl font-black flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-500/20"><Plus className="w-5 h-5" /> নতুন তথ্য যোগ</button>
              </div>

              <div className="lg:hidden space-y-4">
                {infoData.filter(i => i.title.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                  <div key={item.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-200">
                        {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-slate-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-black text-slate-800 text-sm truncate">{item.title}</h5>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{categories.find(c => c.id === item.categoryId)?.name}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-slate-50">
                      <button onClick={() => { setEditItem(item); setFormData(item); setIsEditing(true); }} className="flex-1 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-black text-xs flex items-center justify-center gap-2"><Edit3 className="w-3.5 h-3.5" /> সম্পাদনা</button>
                      <button onClick={() => handleDelete(item.id, 'info')} className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-black text-xs flex items-center justify-center"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden lg:block bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-widest border-b border-slate-100">
                    <tr><th className="px-8 py-5">प्रतिষ্ঠান</th><th className="px-8 py-5">ক্যাটাগরি</th><th className="px-8 py-5 text-right">অ্যাকশন</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                    {infoData.filter(i => i.title.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                              {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <ImageIcon className="w-5 h-5 text-slate-300 m-auto" />}
                            </div>
                            <div>
                              <div className="text-sm font-black text-slate-800">{item.title}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">{item.address}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5"><span className="text-[10px] bg-slate-100 px-3 py-1 rounded-lg">{categories.find(c => c.id === item.categoryId)?.name}</span></td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => { setEditItem(item); setFormData(item); setIsEditing(true); }} className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(item.id, 'info')} className="p-2 bg-red-50 text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'manage_cats' && (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 animate-in fade-in">
                {categories.map(cat => (
                  <div key={cat.id} className="bg-white p-6 rounded-[24px] lg:rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center text-white mb-4 overflow-hidden shadow-lg`}>
                        {cat.image ? <img src={cat.image} className="w-full h-full object-cover" /> : <ImageIcon className="w-7 h-7" />}
                      </div>
                      <h4 className="text-lg font-black text-slate-800">{cat.name}</h4>
                    </div>
                    <div className="mt-8 flex gap-2">
                      <button onClick={() => { setEditItem(cat); setFormData(cat); setIsEditing(true); }} className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold flex items-center justify-center gap-2 text-xs"><Edit3 className="w-4 h-4" /> এডিট</button>
                      <button onClick={() => handleDelete(cat.id, 'cat')} className="p-3 bg-red-50 text-red-600 rounded-xl font-bold"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
                <button onClick={() => { setEditItem(null); setFormData({}); setIsEditing(true); }} className="bg-white p-8 rounded-[24px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all group">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-50"><Plus className="w-6 h-6" /></div>
                  <span className="font-bold text-sm">নতুন ক্যাটাগরি</span>
                </button>
             </div>
          )}

          {activeSection === 'backups' && (
            <div className="max-w-2xl mx-auto text-center py-10 lg:py-20">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[32px] flex items-center justify-center mx-auto mb-8"><Database className="w-10 h-10" /></div>
              <h3 className="text-2xl lg:text-3xl font-black text-slate-800 mb-4">ডেটা ব্যাকআপ ও রিস্টোর</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6">
                <button onClick={() => {
                  const data = { categories, infoData, version: "2.5", date: new Date().toISOString() };
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                  const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `backup.json`; link.click();
                }} className="p-6 bg-blue-600 text-white rounded-[24px] font-black flex flex-col items-center gap-3">
                  <Download className="w-6 h-6" /> ডাউনলোড
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="p-6 bg-emerald-600 text-white rounded-[24px] font-black flex flex-col items-center gap-3">
                  <Upload className="w-6 h-6" /> আপলোড
                  <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={(e) => {
                     const reader = new FileReader(); reader.onload = (ev) => {
                       const data = JSON.parse(ev.target?.result as string);
                       if(data.categories && data.infoData) { setCategories(data.categories); setInfoData(data.infoData); }
                     };
                     if(e.target.files?.[0]) reader.readAsText(e.target.files[0]);
                  }} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 lg:p-6 overflow-y-auto">
          <div className="bg-white rounded-[32px] w-full max-w-xl my-auto overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-6 lg:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg lg:text-xl font-black text-slate-800">{editItem ? 'তথ্য সম্পাদনা' : 'নতুন তথ্য যোগ'}</h3>
              <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-200 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 lg:p-8 space-y-4 lg:space-y-5">
              <div className="flex flex-col items-center gap-4 py-4 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <div className="w-24 h-24 bg-white rounded-2xl overflow-hidden shadow-md flex items-center justify-center relative group">
                  {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <div className="text-slate-300 flex flex-col items-center gap-2"><ImageIcon className="w-10 h-10" /><span className="text-[10px] font-black uppercase">No Photo</span></div>}
                  <button type="button" onClick={() => imageUploadRef.current?.click()} className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Camera className="w-8 h-8" /></button>
                </div>
                <input type="file" ref={imageUploadRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                <button type="button" onClick={() => imageUploadRef.current?.click()} className="text-blue-600 font-black text-xs">ছবি আপলোড করুন</button>
              </div>

              <div className="max-h-[40vh] overflow-y-auto space-y-4 px-1 custom-scrollbar">
                {activeSection === 'manage_info' ? (
                  <>
                    <input required value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="প্রতিষ্ঠানের নাম" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" />
                    <select required value={formData.categoryId || ''} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm">
                      <option value="">ক্যাটাগরি নির্বাচন করুন</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <input value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="ঠিকানা" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" />
                    <input value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="ফোন নাম্বার" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" />
                  </>
                ) : (
                  <>
                    <input required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="ক্যাটাগরি নাম" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" />
                    <input value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="সংক্ষিপ্ত বর্ণনা" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" />
                  </>
                )}
              </div>
              <button type="submit" disabled={isSyncing} className="w-full py-4 lg:py-5 bg-blue-600 text-white rounded-[24px] font-black shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                {isSyncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                ডেটা সেভ ও সিঙ্ক করুন
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
