
import React, { useState, useEffect } from 'react';
import { 
  Building2, ArrowLeft, Phone, MapPin,
  Home, GraduationCap, Stethoscope, UserRound, Truck, Bus, Store, Info, PhoneCall
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

const App: React.FC = () => {
  const [appMode, setAppMode] = useState<AppMode>('public');
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
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

  // Check for admin flag in URL on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      if (isAuthenticated) {
        setAppMode('admin_dashboard');
      } else {
        setShowLogin(true);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('aminpur_categories', JSON.stringify(categories));
    localStorage.setItem('aminpur_info', JSON.stringify(infoData));
  }, [categories, infoData]);

  const currentCategory = categories.find(c => c.id === selectedCategoryId);
  const filteredInfo = infoData.filter(item => item.categoryId === selectedCategoryId);

  // Render Admin Dashboard separately
  if (appMode === 'admin_dashboard' && isAuthenticated) {
    return (
      <AdminDashboard 
        categories={categories}
        infoData={infoData}
        setCategories={setCategories}
        setInfoData={setInfoData}
        onExit={() => {
          setAppMode('public');
          window.history.replaceState({}, '', window.location.pathname);
        }}
        onLogout={() => { 
          setIsAuthenticated(false); 
          setAppMode('public');
          window.history.replaceState({}, '', window.location.pathname);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-['Hind_Siliguri']">
      {showLogin && (
        <Login 
          onLogin={() => { 
            setIsAuthenticated(true); 
            setShowLogin(false); 
            setAppMode('admin_dashboard'); 
          }} 
          onCancel={() => {
            setShowLogin(false);
            window.history.replaceState({}, '', window.location.pathname);
          }} 
        />
      )}

      {/* Pure Public Header - No Admin Buttons */}
      <header className="bg-white border-b border-slate-100 h-16 flex items-center px-6 sticky top-0 z-50">
        <div className="flex-1 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-black text-slate-800">আমিনপুর তথ্যসেবা</h1>
        </div>
      </header>

      <main className="flex-1 p-4 max-w-4xl mx-auto w-full pt-6">
        {currentView === 'dashboard' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-900">স্বাগতম!</h2>
              <p className="text-slate-500 font-medium">প্রয়োজনীয় ক্যাটাগরি নির্বাচন করুন</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => { setSelectedCategoryId(cat.id); setCurrentView('category-detail'); }}
                  className="bg-white p-6 rounded-[24px] border border-slate-100 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg`}>
                    <Icon name={cat.icon} className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">{cat.name}</h3>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => setCurrentView('dashboard')} className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-black text-slate-800">{currentCategory?.name}</h2>
            </div>

            <div className="space-y-4">
              {filteredInfo.length > 0 ? filteredInfo.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
                  <h4 className="text-lg font-black text-slate-800 mb-3">{item.title}</h4>
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2 font-bold"><MapPin className="w-4 h-4 text-blue-500" /> {item.address}</div>
                    {item.phone && <div className="flex items-center gap-2 font-bold"><Phone className="w-4 h-4 text-emerald-500" /> {item.phone}</div>}
                  </div>
                  {item.phone && (
                    <a href={`tel:${item.phone}`} className="mt-6 w-full py-4 bg-blue-600 text-white rounded-2xl flex items-center justify-center gap-2 font-black active:scale-95 transition-all">
                      <Phone className="w-4 h-4" /> কল করুন
                    </a>
                  )}
                </div>
              )) : (
                <div className="text-center py-20">
                  <p className="text-slate-400 font-bold">কোনো তথ্য পাওয়া যায়নি</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Hidden Admin Entry via Footer interaction */}
      <footer className="py-10 text-center border-t border-slate-100 mt-10">
        <p 
          className="text-slate-800 font-black cursor-default select-none"
          onDoubleClick={() => setShowLogin(true)}
        >
          মীর রাব্বি হোসেন
        </p>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">আমিনপুর থানা ডিজিটাল প্ল্যাটফর্ম</p>
      </footer>
    </div>
  );
};

export default App;
