
import React, { useState } from 'react';
import { Category, Content } from '../types';
import { ArrowLeft, Plus, Image, Wand2, Loader2, CheckCircle2 } from 'lucide-react';
import { generateAIDescription } from '../services/geminiService';

interface AdminPanelProps {
  categories: Category[];
  onAddCategory: (name: string) => void;
  onAddContent: (content: Omit<Content, 'id' | 'createdAt'>) => void;
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ categories, onAddCategory, onAddContent, onBack }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'category'>('content');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Content form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageIdx, setImageIdx] = useState(1);

  // Category form state
  const [catName, setCatName] = useState('');

  const handleAddContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !categoryId) return;

    onAddContent({
      title,
      description,
      categoryId,
      imageUrl: `https://picsum.photos/seed/${title}${imageIdx}/800/400`
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setTitle('');
      setDescription('');
      setImageIdx(prev => prev + 1);
    }, 2000);
  };

  const handleAIDescription = async () => {
    if (!title || !categoryId) {
      alert("অনুগ্রহ করে আগে টাইটেল এবং ক্যাটাগরি দিন!");
      return;
    }
    setLoading(true);
    const cat = categories.find(c => c.id === categoryId)?.name || '';
    const aiDesc = await generateAIDescription(title, cat);
    setDescription(aiDesc);
    setLoading(false);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;
    onAddCategory(catName);
    setCatName('');
    setActiveTab('content');
  };

  return (
    <div className="animate-in slide-in-from-right-10 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-50 border"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h2 className="text-2xl font-black text-slate-800">অ্যাডমিন প্যানেল</h2>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-200 rounded-xl mb-8">
        <button 
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'content' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
        >
          নতুন কন্টেন্ট
        </button>
        <button 
          onClick={() => setActiveTab('category')}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'category' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
        >
          নতুন ক্যাটাগরি
        </button>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative overflow-hidden">
        {success && (
          <div className="absolute inset-0 bg-white/90 z-20 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
            <CheckCircle2 className="w-20 h-20 text-green-500 mb-4" />
            <p className="text-xl font-bold text-slate-800">সফলভাবে যুক্ত হয়েছে!</p>
          </div>
        )}

        {activeTab === 'content' ? (
          <form onSubmit={handleAddContent} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">কন্টেন্ট এর শিরোনাম</label>
              <input 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="যেমন: নতুন প্রযুক্তির প্রভাব"
                className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">ক্যাটাগরি সিলেক্ট করুন</label>
              <select 
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-medium appearance-none"
              >
                <option value="">বাছাই করুন</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-700">বিস্তারিত বর্ণনা</label>
                <button 
                  type="button"
                  onClick={handleAIDescription}
                  disabled={loading}
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                  AI দিয়ে লিখুন
                </button>
              </div>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                placeholder="বিস্তারিত এখানে লিখুন..."
                className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
            >
              <Plus className="w-5 h-5" />
              কন্টেন্ট পাবলিশ করুন
            </button>
          </form>
        ) : (
          <form onSubmit={handleAddCategory} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">ক্যাটাগরির নাম</label>
              <input 
                value={catName}
                onChange={e => setCatName(e.target.value)}
                placeholder="যেমন: খেলাধুলা (Sports)"
                className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
              />
            </div>
            
            <button 
              type="submit"
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-lg"
            >
              নতুন ক্যাটাগরি তৈরি করুন
            </button>
          </form>
        )}
      </div>

      <div className="mt-8 p-6 bg-amber-50 rounded-2xl border border-amber-200 flex gap-4">
        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Image className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h4 className="font-bold text-amber-900 mb-1">প্রো টিপস</h4>
          <p className="text-amber-800 text-sm leading-relaxed">অ্যাডমিন প্যানেলে টাইটেল দেওয়ার পর <strong>'AI দিয়ে লিখুন'</strong> বাটনে ক্লিক করলে Gemini AI আপনার জন্য সুন্দর একটি বর্ণনা তৈরি করে দেবে!</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
