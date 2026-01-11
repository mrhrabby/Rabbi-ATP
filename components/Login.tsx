
import React, { useState } from 'react';
import { Lock, User, X, LogIn } from 'lucide-react';

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
    // Default credentials as requested
    if (username === 'admin' && password === 'admin123') {
      onLogin();
    } else {
      setError('ইউজারনেম বা পাসওয়ার্ড ভুল!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        <div className="bg-blue-600 p-8 text-white relative">
          <button onClick={onCancel} className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black">অ্যাডমিন লগইন</h2>
          <p className="text-blue-100 text-sm mt-1">তথ্য পরিবর্তনের জন্য প্রবেশ করুন</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100 animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ইউজারনেম"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all font-bold"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="password"
                placeholder="পাসওয়ার্ড"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all font-bold"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" /> প্রবেশ করুন
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
