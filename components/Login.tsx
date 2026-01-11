
import React, { useState } from 'react';
import { Lock, User, X, LogIn, ShieldCheck } from 'lucide-react';

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
    if (username === 'admin' && password === 'admin123') {
      onLogin();
    } else {
      setError('ইউজারনেম বা পাসওয়ার্ড ভুল!');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
      <div className="bg-white rounded-[48px] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-500 border border-white/20">
        <div className="bg-gradient-to-br from-slate-900 to-blue-900 p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
          <button onClick={onCancel} className="absolute top-8 right-8 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10">
            <X className="w-5 h-5" />
          </button>
          <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-[28px] flex items-center justify-center mb-6 border border-white/20 shadow-2xl relative z-10">
            <ShieldCheck className="w-10 h-10 text-blue-400" />
          </div>
          <h2 className="text-3xl font-black relative z-10 leading-tight">অ্যাডমিন প্যানেল</h2>
          <p className="text-blue-200 text-sm mt-2 font-medium opacity-80 relative z-10 uppercase tracking-widest">সিকিউর লগইন</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl text-xs font-black border border-rose-100 animate-in shake-in">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="group relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="ইউজারনেম"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 transition-all font-bold text-slate-700"
              />
            </div>

            <div className="group relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="password"
                placeholder="পাসওয়ার্ড"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 transition-all font-bold text-slate-700"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-[24px] font-black shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg"
          >
            <LogIn className="w-6 h-6" /> প্রবেশ করুন
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
