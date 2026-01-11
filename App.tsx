
import React, { useState, useEffect } from 'react';
import { LayoutGrid, PlusCircle, Home, Layers, Settings, ChevronRight, RefreshCcw } from 'lucide-react';
import { Category, Content, View, GitHubConfig } from './types';
import { INITIAL_CATEGORIES, INITIAL_CONTENTS } from './constants';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [categories, setCategories] = useState<Category[]>([]);
  const [contents, setContents] = useState<Content[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    // Auth Check
    const loggedIn = sessionStorage.getItem('isAdminLoggedIn') === 'true';
    setIsAuthenticated(loggedIn);

    // Initial Load
    loadData();
  }, []);

  const loadData = async () => {
    setIsFetching(true);
    
    // 1. Try to fetch from GitHub if config exists
    const savedConfig = localStorage.getItem('gh_config');
    if (savedConfig) {
      try {
        const config: GitHubConfig = JSON.parse(savedConfig);
        const url = `https://raw.githubusercontent.com/${config.owner}/${config.repo}/main/${config.path}`;
        // Cache busting with timestamp
        const response = await fetch(`${url}?t=${Date.now()}`);
        if (response.ok) {
          const remoteData = await response.json();
          if (remoteData.categories && remoteData.contents) {
            setCategories(remoteData.categories);
            setContents(remoteData.contents);
            persistToLocal(remoteData.categories, remoteData.contents);
            setIsFetching(false);
            return;
          }
        }
      } catch (err) {
        console.error("Remote fetch failed, falling back to local storage", err);
      }
    }

    // 2. Fallback to LocalStorage or Constants
    const localCats = localStorage.getItem('ch_categories');
    const localConts = localStorage.getItem('ch_contents');
    
    setCategories(localCats ? JSON.parse(localCats) : INITIAL_CATEGORIES);
    setContents(localConts ? JSON.parse(localConts) : INITIAL_CONTENTS);
    setIsFetching(false);
  };

  const persistToLocal = (newCategories: Category[], newContents: Content[]) => {
    localStorage.setItem('ch_categories', JSON.stringify(newCategories));
    localStorage.setItem('ch_contents', JSON.stringify(newContents));
  };

  const addCategory = (name: string) => {
    const newCat: Category = {
      id: Date.now().toString(),
      name,
      icon: '📂',
      color: 'bg-indigo-500'
    };
    const updated = [...categories, newCat];
    setCategories(updated);
    persistToLocal(updated, contents);
  };

  const addContent = (content: Omit<Content, 'id' | 'createdAt'>) => {
    const newContent: Content = {
      ...content,
      id: Date.now().toString(),
      createdAt: Date.now()
    };
    const updated = [newContent, ...contents];
    setContents(updated);
    persistToLocal(categories, updated);
  };

  const handleAdminAccess = () => {
    if (isAuthenticated) {
      setCurrentView('admin');
    } else {
      setShowLogin(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLogin(false);
    setCurrentView('admin');
  };

  const handleCategoryClick = (cat: Category) => {
    setSelectedCategory(cat);
    setCurrentView('category-detail');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-0 md:pt-16 font-['Hind_Siliguri']">
      {/* Login Modal */}
      {showLogin && <Login onLogin={handleLoginSuccess} onCancel={() => setShowLogin(false)} />}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm h-16 flex items-center justify-between px-6 z-40 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-indigo-200 shadow-lg">C</div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">ContentHub</h1>
        </div>
        <div className="flex items-center gap-2">
           {isFetching && <RefreshCcw className="w-4 h-4 text-indigo-500 animate-spin mr-2" />}
           <button 
            onClick={handleAdminAccess}
            className="p-2.5 bg-slate-50 border border-slate-100 hover:bg-slate-100 rounded-xl transition-all"
          >
            <Settings className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-20 md:py-8">
        {currentView === 'home' && (
          <Dashboard 
            categories={categories} 
            contents={contents} 
            onCategorySelect={handleCategoryClick} 
          />
        )}
        
        {currentView === 'admin' && (
          <AdminPanel 
            categories={categories} 
            contents={contents}
            onAddCategory={addCategory} 
            onAddContent={addContent} 
            onBack={() => {
              setCurrentView('home');
              loadData(); // Reload to sync state
            }}
          />
        )}

        {currentView === 'category-detail' && selectedCategory && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-2 mb-6">
              <button 
                onClick={() => setCurrentView('home')}
                className="text-slate-500 hover:text-indigo-600 font-medium transition-colors"
              >
                হোম
              </button>
              <ChevronRight className="w-4 h-4 text-slate-300" />
              <span className="font-bold text-slate-800">{selectedCategory.name}</span>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {contents
                .filter(c => c.categoryId === selectedCategory.id)
                .map(content => (
                  <div key={content.id} className="bg-white rounded-3xl shadow-sm overflow-hidden hover:shadow-xl hover:translate-y-[-4px] transition-all border border-slate-100 group">
                    <img 
                      src={content.imageUrl} 
                      alt={content.title} 
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="p-8">
                      <h3 className="text-2xl font-bold mb-4 text-slate-800 leading-tight">{content.title}</h3>
                      <p className="text-slate-600 leading-relaxed mb-6 text-lg">{content.description}</p>
                      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                        <span className="text-sm font-semibold text-slate-400">প্রকাশিত</span>
                        <span className="text-sm font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
                          {new Date(content.createdAt).toLocaleDateString('bn-BD')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              {contents.filter(c => c.categoryId === selectedCategory.id).length === 0 && (
                <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Layers className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-400 font-medium">এই ক্যাটাগরিতে এখনো কোনো কনটেন্ট নেই।</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 flex items-center justify-around h-20 md:hidden z-50 px-4 rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        <button 
          onClick={() => { setCurrentView('home'); setSelectedCategory(null); }}
          className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all ${currentView === 'home' || currentView === 'category-detail' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-bold">হোম</span>
        </button>
        <button 
          onClick={handleAdminAccess}
          className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all ${currentView === 'admin' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <PlusCircle className="w-6 h-6" />
          <span className="text-[10px] font-bold">যুক্ত করুন</span>
        </button>
        <div className="flex flex-col items-center gap-1.5 p-2 rounded-2xl text-slate-300">
          <Layers className="w-6 h-6" />
          <span className="text-[10px] font-bold">সংগ্রহ</span>
        </div>
      </nav>
    </div>
  );
};

export default App;
