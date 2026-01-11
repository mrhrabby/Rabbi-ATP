
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Building2, ArrowLeft, Phone, MapPin, Search,
  Home, GraduationCap, Stethoscope, UserRound, Truck, Bus, Store, Info, PhoneCall,
  Image as ImageIcon, AlertTriangle, LogOut, Navigation, Menu, X, Mail, Github
} from 'lucide-react';
import { CATEGORIES as INITIAL_CATEGORIES, INFO_DATA as INITIAL_INFO } from './constants';
import { Category, InfoItem, ViewType, AppMode } from './types';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';

const Icon = ({ name, className }: { name: string, className?: string }) => {
  const icons: Record<string, any> = {
    Home, GraduationCap, Stethoscope, UserRound, Truck, Bus, 
    MapPin, PhoneCall, Building2, Store, Info, Phone
  };
  const LucideIcon = icons[name] || Home;
  return <LucideIcon className={className} />;
};

const InfoCard: React.FC<{ item: InfoItem, category?: Category }> = ({ item, category }) => (
  <div className="bg-white overflow-hidden rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col sm:flex-row group">
    {item.image && (
      <div className="w-full sm:w-56 h-56 flex-shrink-0 relative overflow-hidden">
        <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
    )}
    <div className="p-8 flex-1 flex flex-col">
      <div className="mb-6">
        {category && (
          <span className={`inline-block px-3 py-1 rounded-lg ${category.color} text-white text-[10px] font-black uppercase mb-3 shadow-lg shadow-current/10`}>
            {category.name}
          </span>
        )}
        <h4 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-blue-700 transition-colors leading-tight">{item.title}</h4>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-1 p-1 bg-slate-100 text-slate-500 rounded-md">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <p className="text-sm font-bold text-slate-600 leading-relaxed">{item.address}</p>
          </div>
          {item.phone && (
            <div className="flex items-center gap-3">
              <div className="p-1 bg-emerald-50 text-emerald-600 rounded-md">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <p className="text-sm font-black text-slate-800">{item.phone}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex gap-3 mt-auto pt-4 border-t border-slate-50">
        {item.phone && (
          <a href={`tel:${item.phone}`} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl flex items-center justify-center gap-2 font-black active:scale-95 transition-all shadow-lg shadow-slate-200">
            <Phone className="w-4 h-4" /> কল করুন
          </a>
        )}
        {item.mapLink && (
          <a href={item.mapLink} target="_blank" className="p-4 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center active:scale-95 transition-all border border-slate-200">
            <Navigation className="w-5 h-5" />
          </a>
        )}
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [appMode, setAppMode] = useState<AppMode>('public');
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('aminpur_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });
  
  const [infoData, setInfoData] = useState<InfoItem[]>(() => {
    const saved = localStorage.getItem('aminpur_info');
    return saved ? JSON.parse(saved) : INITIAL_INFO;
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    window.history.replaceState({ view: 'dashboard' }, '');
    const handlePopState = (event: PopStateEvent) => {
      if (showLogin) { setShowLogin(false); return; }
      if (window.location.pathname === '/admin') {
        if (isAuthenticated) setAppMode('admin_dashboard');
        else setShowLogin(true);
        return;
      }
      if (appMode === 'public') {
        const state = event.state;
        if (!state || state.view === 'dashboard') {
          if (currentView === 'dashboard') {
            window.history.pushState({ view: 'dashboard' }, '');
            setShowExitDialog(true);
          } else {
            setCurrentView('dashboard');
            setSelectedCategoryId(null);
          }
        } else if (state.view === 'category-detail') {
          setCurrentView('category-detail');
          setSelectedCategoryId(state.categoryId);
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    if (window.location.pathname === '/admin') {
      if (isAuthenticated) setAppMode('admin_dashboard');
      else setShowLogin(true);
    }
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthenticated, appMode, currentView, showLogin]);

  useEffect(() => {
    localStorage.setItem('aminpur_categories', JSON.stringify(categories));
    localStorage.setItem('aminpur_info', JSON.stringify(infoData));
  }, [categories, infoData]);

  const navigateToCategory = useCallback((catId: string) => {
    setSelectedCategoryId(catId);
    setCurrentView('category-detail');
    setSearchQuery('');
    window.history.pushState({ view: 'category-detail', categoryId: catId }, '');
  }, []);

  const navigateBack = useCallback(() => {
    window.history.back();
  }, []);

  const currentCategory = categories.find(c => c.id === selectedCategoryId);
  
  const filteredInfo = useMemo(() => {
    if (selectedCategoryId) {
      return infoData.filter(item => item.categoryId === selectedCategoryId);
    }
    if (searchQuery.trim()) {
      return infoData.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return [];
  }, [selectedCategoryId, searchQuery, infoData]);

  if (appMode === 'admin_dashboard' && isAuthenticated) {
    return (
      <AdminDashboard 
        categories={categories}
        infoData={infoData}
        setCategories={setCategories}
        setInfoData={setInfoData}
        onExit={() => {
          setAppMode('public');
          window.history.pushState({ view: 'dashboard' }, '', '/');
        }}
        onLogout={() => { 
          setIsAuthenticated(false); 
          setAppMode('public');
          window.history.pushState({ view: 'dashboard' }, '', '/');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Hind_Siliguri'] overflow-x-hidden">
      {/* Sidebar Menu */}
      <div className={`fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)} />
      <aside className={`fixed inset-y-0 right-0 w-80 bg-white z-[110] shadow-2xl transition-transform duration-500 transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">মেনু</h3>
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-colors"><X className="w-7 h-7" /></button>
        </div>
        <div className="flex-1 p-8 space-y-10 overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">আমিনপুর থানা সম্পর্কে</h4>
            <p className="text-base font-bold text-slate-700 leading-relaxed">এটি আমিনপুর থানা এলাকার একটি সমন্বিত তথ্য সেবা প্ল্যাটফর্ম। জরুরি প্রয়োজনে যেকোনো তথ্যের জন্য এটি ব্যবহার করুন।</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">দ্রুত লিংক</h4>
            <div className="grid gap-3">
              <button onClick={() => { setCurrentView('dashboard'); setIsSidebarOpen(false); }} className="w-full flex items-center gap-4 p-5 bg-slate-50 rounded-2xl font-black text-slate-800 hover:bg-slate-100 transition-all shadow-sm">
                <Home className="w-5 h-5 text-blue-600" /> হোম পেজ
              </button>
              <a href="tel:999" className="w-full flex items-center gap-4 p-5 bg-rose-50 rounded-2xl font-black text-rose-700 shadow-sm shadow-rose-100">
                <PhoneCall className="w-5 h-5" /> জরুরি সেবা (৯৯৯)
              </a>
            </div>
          </div>
          <div className="pt-10 border-t border-slate-100">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">অ্যাপ ডেভেলপমেন্ট</h4>
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-slate-900 rounded-[20px] flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-slate-200">M</div>
              <div>
                <p className="text-lg font-black text-slate-900 leading-none">মীর রাব্বি হোসেন</p>
                <div className="flex gap-3 mt-2">
                   <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors"><Mail className="w-5 h-5" /></a>
                   <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors"><Github className="w-5 h-5" /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Exit Dialog */}
      {showExitDialog && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight">আপনি কি বের হতে চান?</h3>
              <p className="text-slate-500 font-bold">অ্যাপ্লিকেশনটি বন্ধ করতে 'হ্যাঁ' বাটনে ক্লিক করুন।</p>
            </div>
            <div className="flex p-6 gap-3 bg-slate-50/50">
              <button onClick={() => setShowExitDialog(false)} className="flex-1 py-4 bg-white border border-slate-200 text-slate-800 rounded-2xl font-black active:scale-95 transition-all">না</button>
              <button onClick={() => { window.close(); window.location.href = 'about:blank'; }} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black active:scale-95 transition-all">হ্যাঁ</button>
            </div>
          </div>
        </div>
      )}

      {showLogin && (
        <Login 
          onLogin={() => { 
            setIsAuthenticated(true); 
            setShowLogin(false); 
            setAppMode('admin_dashboard');
            window.history.pushState({ mode: 'admin' }, '', '/admin');
          }} 
          onCancel={() => {
            setShowLogin(false);
            if (window.location.pathname === '/admin') {
              window.history.pushState({ view: 'dashboard' }, '', '/');
            }
          }} 
        />
      )}

      {/* Header for Sub-pages ONLY */}
      {currentView !== 'dashboard' && (
        <header className="glass-header h-24 flex items-center px-6 sticky top-0 z-50">
          <div className="w-full max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-5">
              <button onClick={navigateBack} className="p-3 bg-slate-50 rounded-2xl text-slate-700 active:scale-90 transition-all border border-slate-100"><ArrowLeft className="w-6 h-6" /></button>
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">আমিনপুর থানা</h1>
            </div>
            <button onClick={() => setIsSidebarOpen(true)} className="p-4 bg-white rounded-[20px] shadow-sm border border-slate-100 text-slate-800 active:scale-90 transition-all">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>
      )}

      <main className={`flex-1 p-4 max-w-4xl mx-auto w-full ${currentView === 'dashboard' ? 'pt-16' : 'pt-10'}`}>
        {currentView === 'dashboard' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Dashboard Branding (No Header) */}
            <div className="mb-14 text-center px-4 relative">
              <div className="absolute top-0 right-2">
                <button onClick={() => setIsSidebarOpen(true)} className="p-4 bg-white rounded-[24px] shadow-sm border border-slate-100 text-slate-800 active:scale-90 transition-all">
                  <Menu className="w-6 h-6" />
                </button>
              </div>
              <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-tight mb-3">আমিনপুর থানা</h1>
              <p className="text-sm font-black text-blue-600 uppercase tracking-[0.4em] opacity-90 mb-12">সকল তথ্যের একটি সমাধান</p>
              
              <div className="mt-8">
                <h2 className="text-5xl font-black text-slate-900 mb-3 tracking-tighter leading-tight">
                  তথ্য খুঁজুন <span className="text-blue-700">ডিজিটালভাবে</span>
                </h2>
                <p className="text-lg font-bold text-slate-500">আপনার প্রয়োজনীয় সেবা এক ক্লিকেই</p>
              </div>
            </div>

            {/* Premium Search Bar */}
            <div className="relative mb-14 group px-2">
              <div className="absolute inset-0 bg-blue-600/5 blur-3xl group-focus-within:bg-blue-600/10 transition-all rounded-full"></div>
              <div className="relative flex items-center bg-white border-2 border-slate-100 p-2 rounded-[32px] shadow-2xl shadow-slate-200/50 focus-within:border-blue-500/30 transition-all">
                <div className="p-5 text-slate-400">
                  <Search className="w-7 h-7" />
                </div>
                <input 
                  type="text" 
                  placeholder="হাসপাতাল, ডাক্তার বা প্রতিষ্ঠানের নাম..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent py-5 outline-none font-black text-slate-800 text-xl placeholder:text-slate-300"
                />
              </div>
            </div>

            {searchQuery.trim() ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 px-2">
                <div className="flex items-center justify-between px-4 mb-2">
                  <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em]">অনুসন্ধান ফলাফল ({filteredInfo.length})</h3>
                  <button onClick={() => setSearchQuery('')} className="text-blue-700 font-black text-sm uppercase tracking-wider">Clear</button>
                </div>
                {filteredInfo.map(item => (
                  <InfoCard key={item.id} item={item} category={categories.find(c => c.id === item.categoryId)} />
                ))}
                {filteredInfo.length === 0 && (
                  <div className="text-center py-24 bg-white rounded-[56px] border-4 border-dashed border-slate-100">
                    <p className="text-slate-400 font-black text-lg">দুঃখিত, কোনো তথ্য পাওয়া যায়নি</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 px-2">
                {categories.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => navigateToCategory(cat.id)}
                    className="category-card bg-white p-10 rounded-[48px] border border-slate-100 flex flex-col items-center text-center shadow-sm hover:shadow-2xl hover:-translate-y-2 group"
                  >
                    <div className={`w-18 h-18 ${cat.color} rounded-[28px] flex items-center justify-center text-white mb-8 shadow-2xl shadow-current/20 group-hover:scale-110 transition-transform`}>
                      {cat.image ? (
                        <img src={cat.image} className="w-full h-full object-cover rounded-[28px]" />
                      ) : (
                        <Icon name={cat.icon} className="w-9 h-9" />
                      )}
                    </div>
                    <h3 className="font-black text-slate-900 text-base leading-tight group-hover:text-blue-700 transition-colors uppercase tracking-tight">{cat.name}</h3>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 px-2">
            <div className="mb-12">
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight mb-3">{currentCategory?.name}</h2>
              <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">{filteredInfo.length} টি তথ্য তালিকাভুক্ত আছে</p>
            </div>

            <div className="space-y-8">
              {filteredInfo.length > 0 ? filteredInfo.map(item => (
                <InfoCard key={item.id} item={item} />
              )) : (
                <div className="text-center py-24 bg-white rounded-[64px] border border-slate-100">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                  <p className="text-slate-400 font-black uppercase tracking-widest text-sm">এই ক্যাটাগরিতে কোনো তথ্য নেই</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="py-24 text-center mt-auto">
        <div className="w-24 h-2 bg-slate-200 rounded-full mx-auto mb-10 opacity-40"></div>
        <p className="text-slate-900 font-black text-3xl cursor-default select-none tracking-tighter">
          মীর রাব্বি হোসেন
        </p>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mt-3 opacity-60">Aminpur Thana Digital Hub</p>
      </footer>
    </div>
  );
};

export default App;
