import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import {
  Search,
  Filter,
  Edit,
  UserCheck,
  UserX,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import EditUserModal from '../components/EditUserModal';

export default function Users() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlStatus = searchParams.get('status') || 'all';

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(urlStatus);
  const [editingUser, setEditingUser] = useState(null);

  // Sync state when sidebar route params change
  useEffect(() => {
    setSelectedStatus(urlStatus);
  }, [urlStatus]);

  const fetchUsers = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 12);

      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus);
      }

      const res = await api.get(`/admin/users?${params.toString()}`);
      const data = res.data?.data;

      setUsers(data?.users || []);
      if (data?.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch users list.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedStatus]);

  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  const handleStatusTabChange = (status) => {
    setSelectedStatus(status);
    if (status === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ status });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">User Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage credentials, permissions, and monitor active account statuses
          </p>
        </div>

        {/* Status Tab Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 p-1 rounded-xl">
          {[
            { id: 'all', label: 'All Accounts' },
            { id: 'inactive', label: 'Pending / Inactive' },
            { id: 'suspended', label: 'Suspended' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleStatusTabChange(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedStatus === tab.id
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 shadow-sm overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or referral code..."
              className="w-full rounded-xl bg-slate-900 border border-slate-800 py-2 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="text-xs text-slate-400">
            Total Results: <span className="font-semibold text-white">{pagination.total}</span>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Wallet Balance</th>
                <th className="py-3 px-4">Sponsor / Ref</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
                      <span>Loading records...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    No accounts found matching your selection.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-900/50 transition">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{u.fullName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{u._id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{u.email}</div>
                      <div className="text-[10px] text-slate-500">{u.mobileNumber || 'No mobile linked'}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-emerald-400">
                      ₹{u.walletBalance?.toFixed(2) || '0.00'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono text-slate-300 font-semibold">{u.referralCode}</div>
                      <div className="text-[10px] text-slate-500">
                        {u.referredBy?.fullName ? `By: ${u.referredBy.fullName}` : 'Direct / Root'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          u.role === 'admin'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold ${
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
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setEditingUser(u)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:border-rose-500 hover:text-white transition"
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

        {/* Pagination Footer */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-850 px-4 py-3 bg-slate-950 text-xs">
            <span className="text-slate-400">
              Page <span className="font-semibold text-white">{pagination.page}</span> of{' '}
              <span className="font-semibold text-white">{pagination.pages}</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchUsers(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-850 disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Previous
              </button>

              <button
                onClick={() => fetchUsers(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-850 disabled:opacity-40"
              >
                Next <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUpdated={() => fetchUsers(pagination.page)}
        />
      )}
    </div>
  );
}