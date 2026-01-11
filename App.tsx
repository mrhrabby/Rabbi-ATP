
import React, { useState, useEffect } from 'react';
import { LayoutGrid, PlusCircle, Home, Layers, Settings, ChevronRight } from 'lucide-react';
import { Category, Content, View } from './types';
import { INITIAL_CATEGORIES, INITIAL_CONTENTS } from './constants';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [categories, setCategories] = useState<Category[]>([]);
  const [contents, setContents] = useState<Content[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    // Load data from localStorage or initial constants
    const savedCategories = localStorage.getItem('ch_categories');
    const savedContents = localStorage.getItem('ch_contents');
    
    setCategories(savedCategories ? JSON.parse(savedCategories) : INITIAL_CATEGORIES);
    setContents(savedContents ? JSON.parse(savedContents) : INITIAL_CONTENTS);
  }, []);

  const persistData = (newCategories: Category[], newContents: Content[]) => {
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
    persistData(updated, contents);
  };

  const addContent = (content: Omit<Content, 'id' | 'createdAt'>) => {
    const newContent: Content = {
      ...content,
      id: Date.now().toString(),
      createdAt: Date.now()
    };
    const updated = [...contents, newContent];
    setContents(updated);
    persistData(categories, updated);
  };

  const handleCategoryClick = (cat: Category) => {
    setSelectedCategory(cat);
    setCurrentView('category-detail');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-0 md:pt-16">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm h-16 flex items-center justify-between px-6 z-40 border-b">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">C</div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">ContentHub</h1>
        </div>
        <button 
          onClick={() => setCurrentView('admin')}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors hidden md:block"
        >
          <Settings className="w-6 h-6 text-slate-600" />
        </button>
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
            onAddCategory={addCategory} 
            onAddContent={addContent} 
            onBack={() => setCurrentView('home')}
          />
        )}

        {currentView === 'category-detail' && selectedCategory && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-2 mb-6">
              <button 
                onClick={() => setCurrentView('home')}
                className="text-slate-500 hover:text-indigo-600 font-medium"
              >
                হোম
              </button>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <span className="font-bold text-slate-800">{selectedCategory.name}</span>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {contents
                .filter(c => c.categoryId === selectedCategory.id)
                .map(content => (
                  <div key={content.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all border border-slate-100 group">
                    <img 
                      src={content.imageUrl} 
                      alt={content.title} 
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 text-slate-800">{content.title}</h3>
                      <p className="text-slate-600 leading-relaxed mb-4">{content.description}</p>
                      <div className="text-xs text-slate-400">
                        প্রকাশিত: {new Date(content.createdAt).toLocaleDateString('bn-BD')}
                      </div>
                    </div>
                  </div>
                ))}
              {contents.filter(c => c.categoryId === selectedCategory.id).length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium">এই ক্যাটাগরিতে এখনো কোনো কনটেন্ট নেই।</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex items-center justify-around h-16 md:hidden z-50">
        <button 
          onClick={() => { setCurrentView('home'); setSelectedCategory(null); }}
          className={`flex flex-col items-center gap-1 ${currentView === 'home' || currentView === 'category-detail' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium">হোম</span>
        </button>
        <button 
          onClick={() => setCurrentView('admin')}
          className={`flex flex-col items-center gap-1 ${currentView === 'admin' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <PlusCircle className="w-6 h-6" />
          <span className="text-[10px] font-medium">যুক্ত করুন</span>
        </button>
        <div className="flex flex-col items-center gap-1 text-slate-400">
          <Layers className="w-6 h-6" />
          <span className="text-[10px] font-medium">সংগ্রহ</span>
        </div>
      </nav>
    </div>
  );
};

export default App;
