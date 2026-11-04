import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import {
  Users,
  Wallet,
  Coins,
  TrendingUp,
  Search,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Edit,
} from 'lucide-react';
import EditUserModal from './EditUserModal';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get(`/admin/users?search=${encodeURIComponent(search)}`),
      ]);
      setStats(statsRes.data?.data?.stats);
      setUsers(usersRes.data?.data?.users || []);
    } catch (err) {
      toast.error('Failed to load system metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Total Users</span>
            <Users className="h-5 w-5 text-indigo-400" />
          </div>
          <div className="mt-3 text-2xl font-bold text-white">{stats?.totalUsers ?? '...'}</div>
          <div className="mt-1 text-[11px] text-emerald-400 font-medium">
            {stats?.activeUsers ?? 0} Accounts Active
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Volume Invested</span>
            <Wallet className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="mt-3 text-2xl font-bold text-white font-mono">
            ₹{stats?.totalPlatformInvestments?.toLocaleString() ?? '0.00'}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {stats?.activeInvestmentsCount ?? 0} Ongoing plans
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Total ROI Distributed</span>
            <Coins className="h-5 w-5 text-amber-400" />
          </div>
          <div className="mt-3 text-2xl font-bold text-white font-mono">
            ₹{stats?.totalRoiDistributed?.toLocaleString() ?? '0.00'}
          </div>
          <div className="mt-1 text-[11px] text-amber-400 font-medium">Settled via cron & manual</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Referral Commissions</span>
            <TrendingUp className="h-5 w-5 text-rose-400" />
          </div>
          <div className="mt-3 text-2xl font-bold text-white font-mono">
            ₹{stats?.totalReferralIncomeDistributed?.toLocaleString() ?? '0.00'}
          </div>
          <div className="mt-1 text-[11px] text-rose-400 font-medium">Platform multi-tier bonus</div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-b border-slate-850">
          <div>
            <h2 className="text-base font-bold text-white">Platform User Directory</h2>
            <p className="text-xs text-slate-400">Manage member privileges, security states, and accounts</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by name, email, ref code..."
              className="w-full rounded-xl bg-slate-900 border border-slate-800 py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-rose-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/50 text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-850">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Wallet Balance</th>
                <th className="py-3 px-4">Ref Code</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-slate-300">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{u.fullName}</div>
                      <div className="text-[10px] text-slate-500">{u._id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{u.email}</div>
                      <div className="text-[10px] text-slate-500">{u.mobileNumber || 'No mobile'}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-emerald-400">
                      ₹{u.walletBalance?.toFixed(2) || '0.00'}
                    </td>
                    <td className="py-3 px-4 font-mono">{u.referralCode}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold ${
                          u.accountStatus === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : u.accountStatus === 'suspended'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {u.accountStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-400">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-850 px-2.5 py-1 text-[11px] font-medium text-slate-250 hover:bg-slate-800 transition"
                      >
                        <Edit className="h-3 w-3 text-rose-400" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdated={fetchData}
        />
      )}
    </div>
  );
}