
import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, List, LayoutGrid, Database, Download, Upload, 
  Plus, Edit3, Trash2, X, Save, LogOut, ExternalLink, RefreshCcw, Search, BarChart3, Settings2,
  Menu, Image as ImageIcon, Camera
} from 'lucide-react';
import { Category, InfoItem, AdminSection } from '../types';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageUploadRef = useRef<HTMLInputElement>(null);

  // Close sidebar on section change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [activeSection]);

  const stats = [
    { label: 'মোট ক্যাটাগরি', value: categories.length, icon: LayoutGrid, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'মোট তথ্য', value: infoData.length, icon: Database, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'সর্বশেষ আপডেট', value: 'আজ', icon: RefreshCcw, color: 'text-amber-600', bg: 'bg-amber-50' }
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 500) { // 500KB limit for localStorage safety
        alert('ছবিটি অনেক বড় (৫০০কিবির বেশি)। ছোট সাইজের ছবি ব্যবহার করুন।');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (id: string, type: 'info' | 'cat') => {
    if (window.confirm('আপনি কি নিশ্চিত?')) {
      if (type === 'info') setInfoData(prev => prev.filter(i => i.id !== id));
      else setCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeSection === 'manage_info') {
      if (editItem) setInfoData(prev => prev.map(i => i.id === editItem.id ? { ...i, ...formData } : i));
      else setInfoData(prev => [{ ...formData, id: Date.now().toString() }, ...prev]);
    } else {
      if (editItem) setCategories(prev => prev.map(c => c.id === editItem.id ? { ...c, ...formData } : c));
      else setCategories(prev => [...prev, { ...formData, id: Date.now().toString(), color: 'bg-slate-500', icon: 'Home' }]);
    }
    setIsEditing(false);
    setEditItem(null);
  };

  const filteredItems = infoData.filter(i => 
    i.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      {/* Sidebar - Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#0F172A] text-slate-300 flex flex-col shadow-2xl transition-transform duration-300 lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/20">
              <Settings2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">এডমিন</h2>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto custom-scrollbar">
          <NavItem section="overview" icon={LayoutDashboard} label="ওভারভিউ" />
          <NavItem section="manage_info" icon={List} label="তথ্য ব্যবস্থাপনা" />
          <NavItem section="manage_cats" icon={LayoutGrid} label="ক্যাটাগরি" />
          <NavItem section="backups" icon={Database} label="ব্যাকআপ" />
        </nav>

        <div className="p-6 border-t border-slate-800 space-y-3">
          <button onClick={onExit} className="w-full flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all">
            <ExternalLink className="w-4 h-4" /> পাবলিক অ্যাপ
          </button>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-5 py-3 rounded-xl text-red-400 hover:bg-red-400/10 font-bold transition-all">
            <LogOut className="w-4 h-4" /> লগআউট
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-slate-100 rounded-xl">
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
            <h3 className="text-lg lg:text-xl font-black text-slate-800 uppercase tracking-tight truncate">
              {activeSection === 'overview' && 'ড্যাশবোর্ড'}
              {activeSection === 'manage_info' && 'তথ্য ব্যবস্থাপনা'}
              {activeSection === 'manage_cats' && 'ক্যাটাগরি'}
              {activeSection === 'backups' && 'ব্যাকআপ'}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-black text-slate-800">এডমিন ইউজার</p>
              <p className="text-[10px] font-bold text-emerald-600 uppercase">অনলাইন</p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full border-2 border-white shadow-sm flex items-center justify-center font-bold text-white">A</div>
          </div>
        </header>

        <div className="p-4 lg:p-10 max-w-7xl mx-auto w-full">
          {activeSection === 'overview' && (
            <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                {stats.map((s, idx) => (
                  <div key={idx} className="bg-white p-6 lg:p-8 rounded-[24px] lg:rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4 lg:gap-6">
                    <div className={`w-12 h-12 lg:w-16 lg:h-16 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center`}>
                      <s.icon className="w-6 h-6 lg:w-8 lg:h-8" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                      <h4 className="text-xl lg:text-3xl font-black text-slate-800 mt-1">{s.value}</h4>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-white rounded-[24px] lg:rounded-[40px] p-6 lg:p-8 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-lg lg:text-xl font-black text-slate-800">ক্যাটাগরি ভিত্তিক তথ্য</h4>
                  <BarChart3 className="w-5 h-5 text-slate-300" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                  {categories.map(c => {
                    const count = infoData.filter(i => i.categoryId === c.id).length;
                    return (
                      <div key={c.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 ${c.color} rounded-lg flex items-center justify-center text-white overflow-hidden`}>
                            {c.image ? <img src={c.image} className="w-full h-full object-cover" /> : <ImageIcon className="w-4 h-4" />}
                          </div>
                          <span className="font-bold text-slate-700 text-sm">{c.name}</span>
                        </div>
                        <span className="bg-white px-3 py-1 rounded-full text-[10px] font-black text-blue-600 border border-slate-200">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'manage_info' && (
            <div className="space-y-4 lg:space-y-6 animate-in fade-in">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 lg:p-6 rounded-[24px] lg:rounded-[32px] shadow-sm">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="নাম বা ঠিকানা..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm"
                  />
                </div>
                <button 
                  onClick={() => { setEditItem(null); setFormData({}); setIsEditing(true); }}
                  className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl font-black flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-500/20"
                >
                  <Plus className="w-5 h-5" /> নতুন তথ্য যোগ
                </button>
              </div>

              {/* Mobile Card List for Info */}
              <div className="lg:hidden space-y-4">
                {filteredItems.map(item => (
                  <div key={item.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-200">
                        {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-slate-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-black text-slate-800 text-sm truncate">{item.title}</h5>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                          {categories.find(c => c.id === item.categoryId)?.name}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{item.address}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-slate-50">
                      <button onClick={() => { setEditItem(item); setFormData(item); setIsEditing(true); }} className="flex-1 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-black text-xs flex items-center justify-center gap-2"><Edit3 className="w-3.5 h-3.5" /> সম্পাদনা</button>
                      <button onClick={() => handleDelete(item.id, 'info')} className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-black text-xs flex items-center justify-center"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-widest border-b border-slate-100">
                    <tr>
                      <th className="px-8 py-5">প্রতিষ্ঠান</th>
                      <th className="px-8 py-5">ক্যাটাগরি</th>
                      <th className="px-8 py-5">ফোন</th>
                      <th className="px-8 py-5 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                    {filteredItems.map(item => (
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
                        <td className="px-8 py-5">
                          <span className="text-[10px] bg-slate-100 px-3 py-1 rounded-lg">
                            {categories.find(c => c.id === item.categoryId)?.name}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-sm">{item.phone}</td>
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
                      <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-tight">{cat.description}</p>
                    </div>
                    <div className="mt-8 flex gap-2">
                      <button onClick={() => { setEditItem(cat); setFormData(cat); setIsEditing(true); }} className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold flex items-center justify-center gap-2 text-xs"><Edit3 className="w-4 h-4" /> এডিট</button>
                      <button onClick={() => handleDelete(cat.id, 'cat')} className="p-3 bg-red-50 text-red-600 rounded-xl font-bold"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => { setEditItem(null); setFormData({}); setIsEditing(true); }}
                  className="bg-white p-8 rounded-[24px] lg:rounded-[32px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all group"
                >
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-50">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-sm">নতুন ক্যাটাগরি</span>
                </button>
             </div>
          )}

          {activeSection === 'backups' && (
            <div className="max-w-2xl mx-auto text-center py-10 lg:py-20 animate-in fade-in zoom-in">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-emerald-50 text-emerald-600 rounded-[32px] flex items-center justify-center mx-auto mb-8">
                <Database className="w-10 h-10 lg:w-12 lg:h-12" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-black text-slate-800 mb-4">ডেটা ব্যাকআপ ও রিস্টোর</h3>
              <p className="text-slate-500 font-medium mb-12 text-sm lg:text-base px-6">পুরো ডাটাবেসটি (ছবি সহ) একটি ফাইলে সেভ করে রাখতে পারেন। পরবর্তীতে প্রয়োজনে সেটি আবার আপলোড করা সম্ভব।</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6">
                <button onClick={() => {
                  const data = { categories, infoData, version: "2.5", date: new Date().toISOString() };
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `aminpur_admin_backup_${new Date().toLocaleDateString()}.json`;
                  link.click();
                }} className="p-6 lg:p-8 bg-blue-600 text-white rounded-[24px] lg:rounded-[32px] font-black flex flex-col items-center gap-3 shadow-xl shadow-blue-600/20 active:scale-95 transition-all">
                  <Download className="w-6 h-6 lg:w-8 lg:h-8" /> ডাউনলোড
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="p-6 lg:p-8 bg-emerald-600 text-white rounded-[24px] lg:rounded-[32px] font-black flex flex-col items-center gap-3 shadow-xl shadow-emerald-600/20 active:scale-95 transition-all">
                  <Upload className="w-6 h-6 lg:w-8 lg:h-8" /> আপলোড
                  <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={(e) => {
                     const reader = new FileReader();
                     reader.onload = (ev) => {
                       const data = JSON.parse(ev.target?.result as string);
                       if(data.categories && data.infoData) {
                         setCategories(data.categories);
                         setInfoData(data.infoData);
                         alert('ডেটা সফলভাবে রিস্টোর হয়েছে!');
                       }
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
          <div className="bg-white rounded-[32px] lg:rounded-[40px] w-full max-w-xl my-auto overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-6 lg:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg lg:text-xl font-black text-slate-800 tracking-tight">{editItem ? 'তথ্য সম্পাদনা' : 'নতুন তথ্য যোগ'}</h3>
              <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-200 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 lg:p-8 space-y-4 lg:space-y-5">
              
              {/* Image Upload Area */}
              <div className="flex flex-col items-center gap-4 py-4 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-white rounded-2xl overflow-hidden shadow-md flex items-center justify-center relative group">
                  {formData.image ? (
                    <img src={formData.image} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-slate-300 flex flex-col items-center gap-2">
                      <ImageIcon className="w-10 h-10" />
                      <span className="text-[10px] font-black uppercase">No Photo</span>
                    </div>
                  )}
                  <button 
                    type="button"
                    onClick={() => imageUploadRef.current?.click()}
                    className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    <Camera className="w-8 h-8" />
                  </button>
                </div>
                <input type="file" ref={imageUploadRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                <div className="text-center">
                  <button type="button" onClick={() => imageUploadRef.current?.click()} className="text-blue-600 font-black text-xs">ছবি আপলোড করুন</button>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">সর্বোচ্চ ৫০০ কি.বি.</p>
                </div>
              </div>

              <div className="max-h-[40vh] overflow-y-auto space-y-4 lg:space-y-5 px-1 custom-scrollbar">
                {activeSection === 'manage_info' ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">প্রতিষ্ঠানের নাম</label>
                      <input required value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-800 text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">ক্যাটাগরি</label>
                      <select required value={formData.categoryId || ''} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-800 text-sm">
                        <option value="">নির্বাচন করুন</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">ঠিকানা</label>
                      <input value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">ফোন নাম্বার</label>
                      <input value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">ক্যাটাগরি নাম</label>
                      <input required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">সংক্ষিপ্ত বর্ণনা</label>
                      <input value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" />
                    </div>
                  </>
                )}
              </div>
              
              <button type="submit" className="w-full py-4 lg:py-5 bg-blue-600 text-white rounded-[20px] lg:rounded-[24px] font-black shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2 text-sm">
                <Save className="w-5 h-5" /> ডেটা সেভ করুন
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
