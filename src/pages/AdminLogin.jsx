import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { ShieldAlert, Mail, Lock } from 'lucide-react';

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/admin/login', formData);
      const { token, user } = res.data.data;

      login(token, user);
      toast.success('Admin authenticated successfully!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Invalid administrator credentials'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-2xl border border-rose-900/30">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-600/10 text-rose-500 mb-4 border border-rose-500/20">
          <ShieldAlert className="h-6 w-6" />
        </div>

        <h2 className="text-2xl font-bold text-white text-center">Admin Portal</h2>
        <p className="text-xs text-slate-400 text-center mt-1">
          Restricted management console. Authorized personnel only.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@platform.com"
                className="w-full rounded-lg bg-slate-950 border border-slate-800 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-600 focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Master Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-lg bg-slate-950 border border-slate-800 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-600 focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-rose-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-950/50 hover:bg-rose-500 disabled:opacity-50 transition"
          >
            {loading ? 'Authenticating...' : 'Enter Admin Console'}
          </button>
        </form>
      </div>
    </div>
  );
}