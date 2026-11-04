import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import {
  Coins,
  TrendingUp,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ArrowRightLeft,
} from 'lucide-react';

export default function AdminLedger() {
  const location = useLocation();
  const navigate = useNavigate();

  // Detect active tab from pathname: '/admin/ledger/roi' or '/admin/ledger/referrals'
  const isReferralTab = location.pathname.includes('referrals');
  const activeTab = isReferralTab ? 'referrals' : 'roi';

  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchLedgerData = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      // Calls respective ledger query based on current tab
      const endpoint = activeTab === 'roi' ? '/admin/roi' : '/admin/referrals';
      const res = await api.get(`${endpoint}?page=${page}&limit=12`);
      const data = res.data?.data;

      setRecords(data?.records || data?.history || []);
      if (data?.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load ledger logs.');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchLedgerData(1);
  }, [fetchLedgerData]);

  // Revert & Delete ROI Entry
  const handleDeleteRoi = async (id) => {
    if (!window.confirm('Delete this ROI record? This will revert the credited balance from the user wallet.')) {
      return;
    }

    setDeletingId(id);
    try {
      await api.delete(`/admin/roi/${id}`);
      toast.success('ROI log deleted and user balance reverted.');
      fetchLedgerData(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to revert ROI record.');
    } finally {
      setDeletingId(null);
    }
  };

  // Revert & Delete Referral Commission Entry
  const handleDeleteReferral = async (id) => {
    if (!window.confirm('Delete this referral bonus record? This will revert the commission from the upline wallet.')) {
      return;
    }

    setDeletingId(id);
    try {
      await api.delete(`/admin/referral-income/${id}`);
      toast.success('Commission record deleted and upline balance adjusted.');
      fetchLedgerData(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to revert referral record.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">Platform Ledger</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit logs and atomic balance adjustments for system distributions
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => navigate('/admin/ledger/roi')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'roi'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>ROI Distributions</span>
          </button>
          <button
            onClick={() => navigate('/admin/ledger/referrals')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'referrals'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Referral Bonuses</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {activeTab === 'roi' ? (
            /* ROI Ledger Table */
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Date String</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Investment ID</th>
                  <th className="py-3 px-4">ROI Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Revert / Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
                        <span>Fetching ROI distribution logs...</span>
                      </div>
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-500">
                      No ROI distribution records found.
                    </td>
                  </tr>
                ) : (
                  records.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-900/40 transition">
                      <td className="py-3 px-4 font-mono text-slate-300">{r.dateString || new Date(r.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{r.user?.fullName || 'User'}</div>
                        <div className="text-[10px] text-slate-500">{r.user?.email}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                        {r.investment?._id || r.investment || '—'}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                        +₹{r.roiAmount?.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-semibold">
                          {r.status || 'Distributed'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteRoi(r._id)}
                          disabled={deletingId === r._id}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-900/40 bg-rose-950/20 px-2.5 py-1 text-[11px] font-medium text-rose-400 hover:bg-rose-900/40 transition disabled:opacity-50"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>{deletingId === r._id ? 'Reverting...' : 'Revert'}</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            /* Referral Ledger Table */
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Beneficiary (Upline)</th>
                  <th className="py-3 px-4">Triggered By (Downline)</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Commission</th>
                  <th className="py-3 px-4 text-right">Revert / Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
                        <span>Fetching referral bonus logs...</span>
                      </div>
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-500">
                      No referral commission logs found.
                    </td>
                  </tr>
                ) : (
                  records.map((ref) => (
                    <tr key={ref._id} className="hover:bg-slate-900/40 transition">
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(ref.createdAt || ref.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{ref.beneficiary?.fullName || 'Beneficiary'}</div>
                        <div className="text-[10px] text-slate-500">{ref.beneficiary?.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-300">{ref.generator?.fullName || 'Downline Member'}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{ref.generator?.referralCode}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          Tier {ref.referralLevel}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                        +₹{ref.incomeAmount?.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteReferral(ref._id)}
                          disabled={deletingId === ref._id}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-900/40 bg-rose-950/20 px-2.5 py-1 text-[11px] font-medium text-rose-400 hover:bg-rose-900/40 transition disabled:opacity-50"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>{deletingId === ref._id ? 'Reverting...' : 'Revert'}</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
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
                onClick={() => fetchLedgerData(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-850 disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Previous
              </button>

              <button
                onClick={() => fetchLedgerData(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-850 disabled:opacity-40"
              >
                Next <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}