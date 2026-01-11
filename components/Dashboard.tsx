
import React from 'react';
import { Category, Content } from '../types';
import { Search, Sparkles } from 'lucide-react';

interface DashboardProps {
  categories: Category[];
  contents: Content[];
  onCategorySelect: (cat: Category) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ categories, contents, onCategorySelect }) => {
  return (
    <div className="animate-in fade-in duration-500">
      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="আপনার পছন্দের কনটেন্ট খুঁজুন..." 
          className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-sm border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-600 font-medium"
        />
      </div>

      {/* Categories Grid */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">ক্যাটাগরি</h2>
          <button className="text-indigo-600 text-sm font-semibold hover:underline">সবগুলো</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onCategorySelect(cat)}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-200 transition-all active:scale-95 group"
            >
              <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center text-2xl mb-3 shadow-inner group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <span className="text-slate-700 font-bold text-sm text-center line-clamp-1">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Latest Content */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2 className="text-xl font-bold text-slate-800">সাম্প্রতিক আপডেট</h2>
        </div>
        <div className="space-y-4">
          {contents.slice(0, 5).map(content => {
            const cat = categories.find(c => c.id === content.categoryId);
            return (
              <div 
                key={content.id} 
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex gap-4 hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-xl">
                  <img src={content.imageUrl} alt={content.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="flex flex-col justify-center flex-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${cat?.color.replace('bg-', 'text-')} px-2 py-0.5 rounded-full bg-opacity-10 bg-slate-100 w-fit`}>
                    {cat?.name || 'অন্যান্য'}
                  </span>
                  <h3 className="font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">{content.title}</h3>
                  <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{content.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
