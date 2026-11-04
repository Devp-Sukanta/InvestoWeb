import { useState } from 'react';
import toast from 'react-hot-toast';
import { Ban } from 'lucide-react';
import api from '../api/axios';

export default function DashboardTables({ investments = [], roiHistory = [], referralIncome = [], onRefresh }) {
  const [tab, setTab] = useState('investments');
  const [cancellingId, setCancellingId] = useState(null);

  const handleCancelInvestment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this investment? Daily ROI will stop immediately.')) {
      return;
    }

    setCancellingId(id);
    try {
      await api.patch(`/investment/cancel/${id}`);
      toast.success('Investment cancelled successfully.');
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel investment.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
      <div className="flex border-b border-slate-700 bg-slate-850 px-4 pt-3 gap-4">
        {[
          { key: 'investments', label: `Investments (${investments.length})` },
          { key: 'roi', label: `ROI History (${roiHistory.length})` },
          { key: 'referral', label: `Referral Earnings (${referralIncome.length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`pb-3 text-xs font-semibold border-b-2 transition ${
              tab === t.key
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto p-4">
        {tab === 'investments' && (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Plan</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Daily ROI</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">End Date</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-300">
              {investments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-slate-500">
                    No active or past investments found.
                  </td>
                </tr>
              ) : (
                investments.map((inv) => (
                  <tr key={inv._id} className="hover:bg-slate-750">
                    <td className="py-2.5 px-3 font-medium text-white">{inv.planDetails?.planName}</td>
                    <td className="py-2.5 px-3 font-mono">${inv.investmentAmount.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-emerald-400">{inv.dailyRoiPercentage}%</td>
                    <td className="py-2.5 px-3">{inv.planDetails?.durationDays} days</td>
                    <td className="py-2.5 px-3 text-slate-400">{new Date(inv.endDate).toLocaleDateString()}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          inv.investmentStatus === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : inv.investmentStatus === 'Cancelled'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {inv.investmentStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {inv.investmentStatus === 'Active' ? (
                        <button
                          onClick={() => handleCancelInvestment(inv._id)}
                          disabled={cancellingId === inv._id}
                          className="inline-flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 bg-rose-950/30 border border-rose-800/40 px-2 py-1 rounded transition disabled:opacity-50"
                        >
                          <Ban className="w-3 h-3" />
                          <span>{cancellingId === inv._id ? 'Cancelling...' : 'Cancel'}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {tab === 'roi' && (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">ROI Amount</th>
                <th className="py-2.5 px-3">Investment Ref</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-300">
              {roiHistory.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-slate-500">
                    No daily ROI distributions recorded yet.
                  </td>
                </tr>
              ) : (
                roiHistory.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-750">
                    <td className="py-2.5 px-3">{item.dateString || new Date(item.date).toLocaleDateString()}</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-mono font-medium">+${item.roiAmount.toFixed(2)}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">{item.investment?._id?.slice(-6) || item.investment?.slice(-6)}</td>
                    <td className="py-2.5 px-3">
                      <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[10px]">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {tab === 'referral' && (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">From Member</th>
                <th className="py-2.5 px-3">Level</th>
                <th className="py-2.5 px-3">Commission Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-300">
              {referralIncome.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-slate-500">
                    No referral commission recorded yet.
                  </td>
                </tr>
              ) : (
                referralIncome.map((rec) => (
                  <tr key={rec._id} className="hover:bg-slate-750">
                    <td className="py-2.5 px-3">{new Date(rec.createdAt || rec.date).toLocaleDateString()}</td>
                    <td className="py-2.5 px-3 font-medium text-white">
                      {rec.generator?.fullName || 'Downline User'}
                      <span className="text-slate-500 text-[11px] block">{rec.generator?.referralCode}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded text-[10px] font-semibold">
                        Level {rec.referralLevel}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-emerald-400 font-mono font-medium">+${rec.incomeAmount.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}