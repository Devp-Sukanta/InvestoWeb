import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Users, Layers, Zap, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useState } from 'react';

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [triggering, setTriggering] = useState(false);

  const handleManualRoi = async () => {
    if (!window.confirm('Trigger immediate platform-wide ROI calculation now?')) return;
    setTriggering(true);
    try {
      const res = await api.post('/admin/trigger-roi');
      toast.success(res.data?.message || 'Daily ROI distribution executed!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to trigger ROI job');
    } finally {
      setTriggering(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-rose-600 flex items-center justify-center font-bold text-white shadow-sm">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-bold text-white tracking-wide text-sm">Control Panel</span>
          </Link>

          <nav className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-400">
            <Link to="/admin/dashboard" className="hover:text-white transition">Dashboard</Link>
            <Link to="/admin/users" className="hover:text-white transition">Users</Link>
            <Link to="/admin/investments" className="hover:text-white transition">Investments</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleManualRoi}
            disabled={triggering}
            className="flex items-center gap-1.5 text-xs bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1.5 rounded-lg hover:bg-amber-500/20 transition disabled:opacity-50"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>{triggering ? 'Running...' : 'Trigger ROI'}</span>
          </button>

          <div className="hidden sm:block text-right">
            <p className="text-xs font-semibold text-white">{user?.fullName}</p>
            <span className="text-[10px] uppercase font-bold text-rose-400">Master Admin</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 bg-rose-950/40 border border-rose-900/50 px-2.5 py-1.5 rounded-lg transition"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}