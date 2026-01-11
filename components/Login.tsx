
import React, { useState } from 'react';
import { Lock, User, LogIn, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  onCancel: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'mirrabbihossain' && password === 'Rabbi@198027') {
      sessionStorage.setItem('isAdminLoggedIn', 'true');
      onLogin();
    } else {
      setError('ইউজারনেম বা পাসওয়ার্ড ভুল হয়েছে!');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="bg-indigo-600 p-8 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold">অ্যাডমিন লগইন</h2>
          <p className="text-indigo-100 text-sm mt-1">প্যানেলে প্রবেশ করতে আপনার তথ্য দিন</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium flex items-center gap-2 animate-bounce">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">ইউজারনেম</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="ইউজারনেম লিখুন"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">পাসওয়ার্ড</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="পাসওয়ার্ড লিখুন"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" /> লগইন করুন
            </button>
            <button 
              type="button"
              onClick={onCancel}
              className="w-full py-3 text-slate-500 font-medium hover:text-slate-800 transition-all"
            >
              ফিরে যান
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
