
import React, { useState, useEffect } from 'react';
import { Category, Content, GitHubConfig } from '../types';
import { ArrowLeft, Plus, Wand2, Loader2, CheckCircle2, Github, CloudUpload, Key, Download, Database } from 'lucide-react';
import { generateAIDescription } from '../services/geminiService';
import { pushToGitHub } from '../services/githubService';

interface AdminPanelProps {
  categories: Category[];
  contents: Content[];
  onAddCategory: (name: string) => void;
  onAddContent: (content: Omit<Content, 'id' | 'createdAt'>) => void;
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ categories, contents, onAddCategory, onAddContent, onBack }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'category' | 'github'>('content');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Content form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageIdx, setImageIdx] = useState(1);

  // Category form state
  const [catName, setCatName] = useState('');

  // GitHub Config state
  const [ghConfig, setGhConfig] = useState<GitHubConfig>({
    token: '',
    owner: '',
    repo: '',
    path: 'data.json'
  });

  useEffect(() => {
    const savedConfig = localStorage.getItem('gh_config');
    if (savedConfig) setGhConfig(JSON.parse(savedConfig));
  }, []);

  const saveGitHubConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('gh_config', JSON.stringify(ghConfig));
    alert('GitHub কনফিগারেশন সেভ করা হয়েছে! এখন থেকে ডেটা এখান থেকে লোড হবে।');
  };

  const downloadDataJSON = () => {
    const dataToSync = { 
      categories, 
      contents, 
      lastUpdated: new Date().toISOString(),
      exportVersion: "1.1"
    };
    
    const blob = new Blob([JSON.stringify(dataToSync, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSyncToGitHub = async () => {
    if (!ghConfig.token || !ghConfig.owner || !ghConfig.repo) {
      alert('দয়া করে আগে "সেটিংস" ট্যাব থেকে GitHub কনফিগারেশন সম্পন্ন করুন!');
      setActiveTab('github');
      return;
    }

    setSyncing(true);
    try {
      const dataToSync = { 
        categories, 
        contents, 
        lastUpdated: new Date().toISOString() 
      };
      await pushToGitHub(ghConfig, dataToSync);
      alert('সাফল্যের সাথে গিটহাবে পাবলিশ করা হয়েছে! অ্যাপের সকল ব্যবহারকারী এখন এই নতুন ডেটা দেখতে পাবেন।');
    } catch (error: any) {
      alert('গিটহাবে পুশ করতে সমস্যা হয়েছে: ' + error.message);
    } finally {
      setSyncing(false);
    }
  };

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
    }, 1500);
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
    setSuccess(true);
    setTimeout(() => setSuccess(false), 1500);
  };

  return (
    <div className="animate-in slide-in-from-right-8 duration-500">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-3 bg-white rounded-2xl shadow-sm hover:bg-slate-50 border border-slate-100 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-800">অ্যাডমিন কন্ট্রোল</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Content & Sync Management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleSyncToGitHub}
              disabled={syncing}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-2xl text-xs font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CloudUpload className="w-4 h-4" />}
              <span>গিটহাবে পাবলিশ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-8 overflow-x-auto scrollbar-hide">
        <button 
          onClick={() => setActiveTab('content')}
          className={`flex-1 min-w-[100px] py-3 text-xs md:text-sm font-bold rounded-xl transition-all ${activeTab === 'content' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:bg-white/50'}`}
        >
          নতুন কন্টেন্ট
        </button>
        <button 
          onClick={() => setActiveTab('category')}
          className={`flex-1 min-w-[100px] py-3 text-xs md:text-sm font-bold rounded-xl transition-all ${activeTab === 'category' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:bg-white/50'}`}
        >
          ক্যাটাগরি
        </button>
        <button 
          onClick={() => setActiveTab('github')}
          className={`flex-1 min-w-[100px] py-3 text-xs md:text-sm font-bold rounded-xl transition-all ${activeTab === 'github' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:bg-white/50'}`}
        >
          সেটিংস
        </button>
      </div>

      <div className="bg-white rounded-[32px] p-6 md:p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
        {success && (
          <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <p className="text-2xl font-black text-slate-800">সফল হয়েছে!</p>
            <p className="text-slate-400 mt-2 font-medium">এটি লোকাল মেমোরিতে সেভ হয়েছে।</p>
          </div>
        )}

        {activeTab === 'content' && (
          <form onSubmit={handleAddContent} className="space-y-8">
            <div className="space-y-3">
              <label className="text-sm font-black text-slate-700 uppercase tracking-wider">কন্টেন্ট শিরোনাম</label>
              <input 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="যেমন: ২০২৫ সালের নতুন প্রযুক্তি ট্রেন্ড"
                className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none font-bold transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-black text-slate-700 uppercase tracking-wider">ক্যাটাগরি</label>
              <select 
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none font-bold transition-all appearance-none"
              >
                <option value="">বাছাই করুন</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-black text-slate-700 uppercase tracking-wider">বিস্তারিত তথ্য</label>
                <button 
                  type="button"
                  onClick={handleAIDescription}
                  disabled={loading}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100"
                >
                  {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                  AI ম্যাজিক
                </button>
              </div>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={5}
                placeholder="আপনার কন্টেন্টের বিস্তারিত এখানে লিখুন..."
                className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none font-medium leading-relaxed transition-all"
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-slate-900 text-white rounded-[20px] font-black hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200"
            >
              <Plus className="w-6 h-6" />
              পাবলিশ করুন (লোকাল)
            </button>
          </form>
        )}

        {activeTab === 'category' && (
          <form onSubmit={handleAddCategory} className="space-y-8">
            <div className="space-y-3">
              <label className="text-sm font-black text-slate-700 uppercase tracking-wider">ক্যাটাগরির নাম</label>
              <input 
                value={catName}
                onChange={e => setCatName(e.target.value)}
                placeholder="যেমন: বিনোদন, শিক্ষা, ইত্যাদি"
                className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none font-bold transition-all"
              />
            </div>
            
            <button 
              type="submit"
              className="w-full py-5 bg-slate-900 text-white rounded-[20px] font-black hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
            >
              ক্যাটাগরি তৈরি করুন
            </button>
          </form>
        )}

        {activeTab === 'github' && (
          <form onSubmit={saveGitHubConfig} className="space-y-6">
            <div className="bg-indigo-50 p-5 rounded-2xl flex gap-4 border border-indigo-100">
              <Database className="w-6 h-6 text-indigo-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-black text-indigo-900 uppercase mb-1">ডেটা সোর্স গাইড</p>
                <p className="text-[11px] text-indigo-800 leading-relaxed font-medium">
                  এখানে সেটিংস সেভ করার পর অ্যাপটি সরাসরি আপনার গিটহাব থেকে তথ্য লোড করবে। এটি আপনার অ্যাপকে পার্মানেন্ট স্টোরেজ প্রদান করে।
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Key className="w-3 h-3" /> GitHub Access Token</label>
              <input 
                type="password"
                value={ghConfig.token}
                onChange={e => setGhConfig({...ghConfig, token: e.target.value})}
                placeholder="ghp_xxxxxxxxxxxx"
                className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none font-mono text-sm transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">User / Owner</label>
                <input 
                  value={ghConfig.owner}
                  onChange={e => setGhConfig({...ghConfig, owner: e.target.value})}
                  placeholder="mirrabbihossain"
                  className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none font-bold text-sm transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Repo Name</label>
                <input 
                  value={ghConfig.repo}
                  onChange={e => setGhConfig({...ghConfig, repo: e.target.value})}
                  placeholder="contenthub-pro"
                  className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none font-bold text-sm transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-indigo-600 text-white rounded-[20px] font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
            >
              কনফিগারেশন সেভ করুন
            </button>
            
            <div className="pt-4 border-t border-slate-50">
              <button 
                type="button"
                onClick={downloadDataJSON}
                className="w-full flex items-center justify-center gap-2 text-slate-400 font-bold hover:text-slate-600 transition-colors text-sm"
              >
                <Download className="w-4 h-4" /> অফলাইন ব্যাকআপ ডাউনলোড করুন
              </button>
            </div>
          </form>
        )}
      </div>
      
      <div className="mt-10 p-6 bg-white rounded-3xl border border-slate-100 flex items-center gap-5 shadow-sm">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
           <Github className="w-6 h-6 text-slate-400" />
        </div>
        <div>
          <p className="text-sm font-black text-slate-800">গিটহাব কানেকশন স্ট্যাটাস</p>
          <p className="text-xs text-slate-400 font-medium">
            {ghConfig.token ? 'কানেক্টেড: ডেটা সরাসরি গিটহাব থেকে আসছে' : 'অফলাইন: ডেটা লোকাল স্টোরেজ থেকে লোড হচ্ছে'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
