
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Building2, ArrowLeft, Phone, MapPin,
  Home, GraduationCap, Stethoscope, UserRound, Truck, Bus, Store, Info, PhoneCall,
  Image as ImageIcon, AlertTriangle, LogOut
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
  const [showExitDialog, setShowExitDialog] = useState(false);
  
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

  // Sync state with History API
  useEffect(() => {
    // Initial state setup
    window.history.replaceState({ view: 'dashboard' }, '');

    const handlePopState = (event: PopStateEvent) => {
      if (showLogin) {
        setShowLogin(false);
        return;
      }

      if (window.location.pathname === '/admin') {
        if (isAuthenticated) {
          setAppMode('admin_dashboard');
        } else {
          setShowLogin(true);
        }
        return;
      }

      if (appMode === 'public') {
        const state = event.state;
        
        if (!state || state.view === 'dashboard') {
          if (currentView === 'dashboard') {
            // Intercept exit from home
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
      if (isAuthenticated) {
        setAppMode('admin_dashboard');
      } else {
        setShowLogin(true);
      }
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
    window.history.pushState({ view: 'category-detail', categoryId: catId }, '');
  }, []);

  const navigateBack = useCallback(() => {
    window.history.back();
  }, []);

  const currentCategory = categories.find(c => c.id === selectedCategoryId);
  const filteredInfo = infoData.filter(item => item.categoryId === selectedCategoryId);

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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-['Hind_Siliguri'] overflow-x-hidden">
      {/* Custom Exit Dialog */}
      {showExitDialog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in duration-300">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">আপনি কি বের হতে চান?</h3>
              <p className="text-slate-500 font-medium leading-relaxed">অ্যাপ্লিকেশনটি বন্ধ করার আগে আপনার কাজগুলো নিশ্চিত করুন।</p>
            </div>
            <div className="flex p-5 gap-3 bg-slate-50 border-t border-slate-100">
              <button 
                onClick={() => setShowExitDialog(false)}
                className="flex-1 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black active:scale-95 transition-all shadow-sm"
              >
                না
              </button>
              <button 
                onClick={() => {
                  window.close();
                  window.location.href = 'about:blank';
                }}
                className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-200 active:scale-95 transition-all"
              >
                হ্যাঁ, বের হবো
              </button>
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
                  onClick={() => navigateToCategory(cat.id)}
                  className="bg-white p-5 lg:p-6 rounded-[24px] border border-slate-100 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg overflow-hidden`}>
                    {cat.image ? (
                      <img src={cat.image} className="w-full h-full object-cover" />
                    ) : (
                      <Icon name={cat.icon} className="w-7 h-7" />
                    )}
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">{cat.name}</h3>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-4 mb-8">
              <button onClick={navigateBack} className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-black text-slate-800">{currentCategory?.name}</h2>
            </div>

            <div className="space-y-4">
              {filteredInfo.length > 0 ? filteredInfo.map(item => (
                <div key={item.id} className="bg-white overflow-hidden rounded-[24px] border border-slate-100 shadow-sm flex flex-col sm:flex-row">
                  {item.image && (
                    <div className="w-full sm:w-48 h-48 flex-shrink-0">
                      <img src={item.image} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-lg font-black text-slate-800 mb-3">{item.title}</h4>
                      <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2 font-bold"><MapPin className="w-4 h-4 text-blue-500" /> {item.address}</div>
                        {item.phone && <div className="flex items-center gap-2 font-bold"><Phone className="w-4 h-4 text-emerald-500" /> {item.phone}</div>}
                      </div>
                    </div>
                    {item.phone && (
                      <a href={`tel:${item.phone}`} className="mt-6 w-full py-4 bg-blue-600 text-white rounded-2xl flex items-center justify-center gap-2 font-black active:scale-95 transition-all">
                        <Phone className="w-4 h-4" /> কল করুন
                      </a>
                    )}
                  </div>
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

      <footer className="py-10 text-center border-t border-slate-100 mt-10">
        <p className="text-slate-800 font-black cursor-default select-none">
          মীর রাব্বি হোসেন
        </p>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">আমিনপুর থানা ডিজিটাল প্ল্যাটফর্ম</p>
      </footer>
    </div>
  );
};

export default App;
