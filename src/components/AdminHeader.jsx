import { useState } from 'react';
import { Menu, Zap, LogOut, Search, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function AdminHeader({ setIsSidebarOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [triggering, setTriggering] = useState(false);

  const handleManualRoi = async () => {
    if (!window.confirm('Trigger immediate platform-wide ROI calculation now?')) return;
    setTriggering(true);
    try {
      const res = await api.post('/admin/trigger-roi');
      toast.success(res.data?.message || 'Daily ROI distribution finished!');
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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 backdrop-blur-md sm:px-8">
      {/* Sidebar toggle + Search */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="rounded-lg border border-slate-800 p-2 text-slate-400 hover:bg-slate-900 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative hidden sm:block w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Global search (TXID, User, Email)..."
            className="w-full rounded-xl bg-slate-900 border border-slate-800 py-2 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:border-rose-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleManualRoi}
          disabled={triggering}
          className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 disabled:opacity-50 transition"
        >
          <Zap className="h-3.5 w-3.5 fill-amber-400" />
          <span className="hidden md:inline">{triggering ? 'Executing Job...' : 'Trigger ROI'}</span>
        </button>

        <div className="h-5 w-px bg-slate-800" />

        {/* User Card */}
        <div className="flex items-center gap-3 pl-2">
          <div className="hidden text-right md:block">
            <div className="text-xs font-semibold text-white">{user?.fullName || 'Root Admin'}</div>
            <div className="text-[10px] text-rose-400 font-mono tracking-wide">{user?.email}</div>
          </div>

          <button
            onClick={handleLogout}
            title="Sign out from console"
            className="rounded-xl border border-rose-900/40 bg-rose-950/30 p-2 text-rose-400 hover:bg-rose-900/40 transition"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}