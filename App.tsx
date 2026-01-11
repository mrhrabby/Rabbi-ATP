
import React, { useState } from 'react';
import { 
  Menu, X, Home, LayoutDashboard, GraduationCap, Stethoscope, 
  UserRound, Truck, Bus, MapPin, PhoneCall, Building2, Store, 
  ChevronRight, Info, Mail, Phone, ExternalLink, ArrowLeft
} from 'lucide-react';
import { CATEGORIES, INFO_DATA } from './constants';
import { Category, InfoItem, ViewType } from './types';

// Dynamic Icon Component
const Icon = ({ name, className }: { name: string, className?: string }) => {
  const icons: Record<string, any> = {
    Home, LayoutDashboard, GraduationCap, Stethoscope, UserRound, 
    Truck, Bus, MapPin, PhoneCall, Building2, Store, Info, Mail, Phone
  };
  const LucideIcon = icons[name] || Home;
  return <LucideIcon className={className} />;
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleCategorySelect = (id: string) => {
    setSelectedCategoryId(id);
    setCurrentView('category-detail');
    setSidebarOpen(false);
  };

  const currentCategory = CATEGORIES.find(c => c.id === selectedCategoryId);
  const filteredData = INFO_DATA.filter(item => item.categoryId === selectedCategoryId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white z-[60] shadow-2xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-blue-600">আমিনপুর থানা</h2>
            <p className="text-xs text-slate-400 font-medium">তথ্যসেবা পোর্টাল</p>
          </div>
          <button onClick={toggleSidebar} className="p-2 hover:bg-slate-100 rounded-full">
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-100px)] custom-scrollbar">
          <button 
            onClick={() => { setCurrentView('dashboard'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${currentView === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-bold">ড্যাশবোর্ড</span>
          </button>
          
          <div className="pt-4 pb-2 px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">বিভাগ সমুহ</div>
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${selectedCategoryId === cat.id && currentView === 'category-detail' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Icon name={cat.icon} className="w-5 h-5" />
              <span className="font-bold">{cat.name}</span>
            </button>
          ))}

          <div className="pt-4 pb-2 px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">অন্যান্য</div>
          <button 
            onClick={() => { setCurrentView('about'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${currentView === 'about' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Info className="w-5 h-5" />
            <span className="font-bold">আমিনপুর থানা সম্পর্কে</span>
          </button>
          <button 
            onClick={() => { setCurrentView('contact'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${currentView === 'contact' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Mail className="w-5 h-5" />
            <span className="font-bold">যোগাযোগ</span>
          </button>
        </nav>
      </aside>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-40 h-16 border-b border-slate-100 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button onClick={toggleSidebar} className="p-2 -ml-2 hover:bg-slate-100 rounded-lg">
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
          <div>
            <h1 className="text-lg font-black text-slate-800 leading-tight">আমিনপুর থানা</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider hidden sm:block">আমাদের এলাকার সকল তথ্য এক জায়গায়</p>
          </div>
        </div>
        <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-200">আ</div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20 pb-24 px-4 max-w-5xl mx-auto w-full">
        
        {currentView === 'dashboard' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 text-center sm:text-left">
              <h2 className="text-2xl font-black text-slate-800 mb-2">স্বাগতম!</h2>
              <p className="text-slate-500 font-medium">নিচের ক্যাটাগরি থেকে প্রয়োজনীয় তথ্য খুঁজে নিন।</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center group hover:shadow-xl hover:border-blue-200 transition-all active:scale-95"
                >
                  <div className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon name={cat.icon} className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm md:text-base line-clamp-1">{cat.name}</h3>
                  <p className="text-[10px] text-slate-400 mt-1 font-bold">{cat.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentView === 'category-detail' && currentCategory && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-4 mb-8">
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h2 className="text-2xl font-black text-slate-800">{currentCategory.name}</h2>
                <p className="text-sm text-slate-500 font-medium">{currentCategory.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              {filteredData.length > 0 ? filteredData.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-black text-slate-800">{item.title}</h4>
                      {item.type && <span className="inline-block mt-1 px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded-full uppercase">{item.type}</span>}
                    </div>
                    {item.established && <span className="text-[10px] font-bold text-slate-400">স্থাপিত: {item.established}</span>}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                      <p className="text-sm text-slate-600 font-medium">{item.address}</p>
                    </div>
                    
                    {item.specialty && (
                      <div className="flex items-start gap-3">
                        <UserRound className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                        <p className="text-sm text-slate-600 font-bold">{item.specialty}</p>
                      </div>
                    )}

                    {item.timing && (
                      <div className="flex items-start gap-3">
                        <Bus className="w-4 h-4 text-indigo-500 mt-1 flex-shrink-0" />
                        <p className="text-sm text-slate-600 font-medium">সময়: {item.timing}</p>
                      </div>
                    )}

                    {item.details && (
                      <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">{item.details}</p>
                    )}

                    <div className="pt-4 flex flex-wrap gap-2">
                      <a 
                        href={`tel:${item.phone}`}
                        className="flex-1 min-w-[120px] py-3 px-4 bg-blue-600 text-white rounded-2xl flex items-center justify-center gap-2 font-black text-sm shadow-lg shadow-blue-100 active:scale-95 transition-all"
                      >
                        <Phone className="w-4 h-4" /> কল করুন
                      </a>
                      {item.mapLink && (
                        <a 
                          href={item.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-3 px-6 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm hover:bg-slate-200 active:scale-95 transition-all"
                        >
                          <ExternalLink className="w-4 h-4" /> ম্যাপ
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LayoutDashboard className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-500">কোনো তথ্য পাওয়া যায়নি</h3>
                  <p className="text-sm text-slate-400">এই বিভাগে শীঘ্রই আরও তথ্য যোগ করা হবে।</p>
                </div>
              )}
            </div>
          </div>
        )}

        {currentView === 'about' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <h2 className="text-3xl font-black text-slate-800">আমিনপুর থানা সম্পর্কে</h2>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <section className="space-y-3">
                <h3 className="text-xl font-bold text-blue-600">অবস্থান</h3>
                <p className="text-slate-600 leading-relaxed">আমিনপুর থানা বাংলাদেশের পাবনা জেলার একটি গুরুত্বপূর্ণ প্রশাসনিক এলাকা। এটি পাবনা জেলার বেড়া উপজেলা ও সুজানগর উপজেলার কিছু অংশ নিয়ে গঠিত একটি আধুনিক থানা এলাকা।</p>
              </section>

              <section className="space-y-3">
                <h3 className="text-xl font-bold text-blue-600">প্রশাসনিক পরিচিতি</h3>
                <p className="text-slate-600 leading-relaxed">এটি ২০১৩ সালে আনুষ্ঠানিকভাবে থানা হিসেবে যাত্রা শুরু করে। যমুনা ও পদ্মা নদীর সঙ্গমস্থলের নিকটবর্তী হওয়ায় এটি ভৌগোলিক ও অর্থনৈতিকভাবে অত্যন্ত গুরুত্ব বহন করে।</p>
              </section>

              <section className="space-y-3">
                <h3 className="text-xl font-bold text-blue-600">সংস্কৃতি ও সামাজিক বৈশিষ্ট্য</h3>
                <p className="text-slate-600 leading-relaxed">এখানকার মানুষ অত্যন্ত অতিথিপরায়ণ এবং সংস্কৃতিমনা। কৃষিকাজ ও ব্যবসা এখানকার প্রধান চালিকাশক্তি। আমিনপুর বাজার এলাকার একটি অন্যতম প্রধান বাণিজ্যিক কেন্দ্র।</p>
              </section>
            </div>
          </div>
        )}

        {currentView === 'contact' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-lg mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-slate-800 mb-2">যোগাযোগ করুন</h2>
              <p className="text-slate-500 font-medium">যেকোনো মতামত বা তথ্যের জন্য আমাদের লিখুন।</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
               <div className="flex items-center gap-6 p-4 bg-blue-50 rounded-2xl">
                 <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6" />
                 </div>
                 <div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">ইমেইল</p>
                   <p className="font-bold text-slate-800">info@aminpurthana.com</p>
                 </div>
               </div>

               <div className="flex items-center gap-6 p-4 bg-emerald-50 rounded-2xl">
                 <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6" />
                 </div>
                 <div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">সহায়তা হটলাইন</p>
                   <p className="font-bold text-slate-800">০১৭০০-০০০০০১</p>
                 </div>
               </div>

               <form className="space-y-4 pt-4 border-t border-slate-50">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">আপনার নাম</label>
                    <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" placeholder="আপনার নাম লিখুন" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">আপনার বার্তা</label>
                    <textarea rows={4} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" placeholder="আপনার মতামত বা তথ্য লিখুন..."></textarea>
                  </div>
                  <button type="button" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-100 active:scale-95 transition-all">বার্তা পাঠান</button>
               </form>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-100 py-10 px-6 text-center">
        <h4 className="text-lg font-black text-slate-800 mb-1">মীর রাব্বি হোসেন</h4>
        <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-4">আমিনপুর থানার তথ্যভিত্তিক ডিজিটাল প্ল্যাটফর্ম</p>
        <div className="flex justify-center gap-4">
           <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center"><Icon name="Mail" className="w-4 h-4 text-slate-400" /></div>
           <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center"><Icon name="Phone" className="w-4 h-4 text-slate-400" /></div>
        </div>
        <p className="text-[10px] text-slate-300 font-bold mt-8">© {new Date().getFullYear()} সকল স্বত্ব সংরক্ষিত। আমিনপুর থানা তথ্যসেবা।</p>
      </footer>

      {/* Mobile Quick Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 h-20 flex items-center justify-around px-4 md:hidden z-50 rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
        <button 
          onClick={() => { setCurrentView('dashboard'); setSelectedCategoryId(null); }}
          className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${currentView === 'dashboard' ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}
        >
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-tighter">ড্যাশবোর্ড</span>
        </button>
        <button 
          onClick={() => { setCurrentView('about'); }}
          className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${currentView === 'about' ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}
        >
          <Info className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-tighter">সম্পর্কে</span>
        </button>
        <button 
          onClick={() => { setCurrentView('contact'); }}
          className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${currentView === 'contact' ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}
        >
          <Mail className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-tighter">যোগাযোগ</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
