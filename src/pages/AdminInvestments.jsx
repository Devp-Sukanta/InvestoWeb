import { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import {
  Coins,
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import EditInvestmentModal from '../components/EditInvestmentModal';


export default function AdminInvestments() {
  const [investments, setInvestments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchInvestments = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/investments?page=${page}&limit=12`);
      const data = res.data?.data;
      setInvestments(data?.investments || []);
      if (data?.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch platform investments.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvestments(1);
  }, [fetchInvestments]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this investment record permanently? This cannot be undone.')) {
      return;
    }

    setDeletingId(id);
    try {
      await api.delete(`/admin/delete-investment/${id}`);
      toast.success('Investment record deleted successfully');
      fetchInvestments(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete investment.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">Investment Ledger</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor, modify, and manage all active, completed, or cancelled investments across members
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs text-slate-400">
          <Coins className="h-4 w-4 text-amber-400" />
          <span>Total Records: <strong className="text-white">{pagination.total}</strong></span>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Plan Name</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Daily Yield</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Start / End</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
                      <span>Loading investment portfolio...</span>
                    </div>
                  </td>
                </tr>
              ) : investments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-500">
                    No investment records present.
                  </td>
                </tr>
              ) : (
                investments.map((inv) => (
                  <tr key={inv._id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{inv.user?.fullName || 'Unknown User'}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{inv.user?.email}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-200">
                      {inv.planDetails?.planName}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-emerald-400">
                      ₹{inv.investmentAmount?.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-amber-400 font-mono">
                      {inv.dailyRoiPercentage}% / day
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {inv.planDetails?.durationDays} days
                    </td>
                    <td className="py-3 px-4 text-[11px] text-slate-400">
                      <div>{new Date(inv.startDate).toLocaleDateString()}</div>
                      <div className="text-[10px] text-slate-500">{new Date(inv.endDate).toLocaleDateString()}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          inv.investmentStatus === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : inv.investmentStatus === 'Completed'
                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {inv.investmentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedInvestment(inv)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] font-medium text-slate-300 hover:border-slate-500 hover:text-white transition"
                      >
                        <Edit className="h-3 w-3 text-rose-400" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(inv._id)}
                        disabled={deletingId === inv._id}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-900/40 bg-rose-950/20 px-2 py-1 text-[11px] font-medium text-rose-400 hover:bg-rose-900/40 transition disabled:opacity-50"
                      >
                        <Trash2 className="h-3 w-3" />
                        {deletingId === inv._id ? '...' : 'Del'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-850 px-4 py-3 bg-slate-950 text-xs">
            <span className="text-slate-400">
              Page <span className="font-semibold text-white">{pagination.page}</span> of{' '}
              <span className="font-semibold text-white">{pagination.pages}</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchInvestments(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-850 disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Previous
              </button>

              <button
                onClick={() => fetchInvestments(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-850 disabled:opacity-40"
              >
                Next <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedInvestment && (
        <EditInvestmentModal
          investment={selectedInvestment}
          onClose={() => setSelectedInvestment(null)}
          onUpdated={() => fetchInvestments(pagination.page)}
        />
      )}
    </div>
  );
}