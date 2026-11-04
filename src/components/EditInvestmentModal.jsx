import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { X, Layers, Percent, Calendar, AlertCircle } from 'lucide-react';

export default function EditInvestmentModal({ investment, onClose, onUpdated }) {
  const [formData, setFormData] = useState({
    planName: investment.planDetails?.planName || '',
    dailyRoiPercentage: investment.dailyRoiPercentage || 0,
    durationDays: investment.planDetails?.durationDays || 30,
    investmentStatus: investment.investmentStatus || 'Active',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put(`/admin/update-investment/${investment._id}`, {
        planName: formData.planName,
        dailyRoiPercentage: Number(formData.dailyRoiPercentage),
        durationDays: Number(formData.durationDays),
        investmentStatus: formData.investmentStatus,
      });

      toast.success('Investment updated successfully');
      onUpdated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update investment');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white">Edit Investment</h3>
            <p className="text-xs text-slate-400 font-mono">ID: {investment._id}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Plan Name</label>
            <div className="relative">
              <Layers className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                name="planName"
                value={formData.planName}
                onChange={handleChange}
                required
                className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 pl-9 pr-3 text-xs text-white focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Daily ROI (%)</label>
              <div className="relative">
                <Percent className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="number"
                  step="0.01"
                  name="dailyRoiPercentage"
                  value={formData.dailyRoiPercentage}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 pl-9 pr-3 text-xs text-white focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Duration (Days)</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="number"
                  name="durationDays"
                  value={formData.durationDays}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 pl-9 pr-3 text-xs text-white focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
            <select
              name="investmentStatus"
              value={formData.investmentStatus}
              onChange={handleChange}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
            >
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-850"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-rose-500 disabled:opacity-50 transition"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}