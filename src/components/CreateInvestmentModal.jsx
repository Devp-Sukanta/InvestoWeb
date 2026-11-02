import { useState } from 'react';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import api from '../api/axios';

const PLANS = [
  { name: 'Starter Plan', duration: 30, dailyRoi: 1.5, min: 50 },
  { name: 'Growth Plan', duration: 60, dailyRoi: 2.0, min: 250 },
  { name: 'Pro Plan', duration: 90, dailyRoi: 2.5, min: 1000 },
];

export default function CreateInvestmentModal({ isOpen, onClose, onSuccess }) {
  const [selectedPlan, setSelectedPlan] = useState(PLANS[0]);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericAmount = Number(amount);

    if (numericAmount < selectedPlan.min) {
      return toast.error(`Minimum amount for ${selectedPlan.name} is ₹${selectedPlan.min}`);
    }

    setLoading(true);
    try {
      await api.post('/investment/create', {
        investmentAmount: numericAmount,
        planName: selectedPlan.name,
        durationDays: selectedPlan.duration,
        dailyRoiPercentage: selectedPlan.dailyRoi,
      });

      toast.success('Investment activated successfully!');
      setAmount('');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place investment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-white">Create New Investment</h3>
        <p className="text-xs text-slate-400 mt-1">Select a portfolio plan and enter principal amount</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1.5">Select Plan</label>
            <div className="grid grid-cols-3 gap-2">
              {PLANS.map((p) => (
                <button
                  type="button"
                  key={p.name}
                  onClick={() => setSelectedPlan(p)}
                  className={`p-2.5 rounded-lg border text-left transition ${
                    selectedPlan.name === p.name
                      ? 'border-indigo-500 bg-indigo-500/10 text-white'
                      : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <p className="text-xs font-semibold">{p.name}</p>
                  <p className="text-[10px] text-emerald-400 mt-0.5">{p.dailyRoi}% / day</p>
                  <p className="text-[10px] text-slate-500">{p.duration} Days</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1.5">
              Investment Amount (Min: ₹{selectedPlan.min})
            </label>
            <input
              type="number"
              min={selectedPlan.min}
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`e.g. ${selectedPlan.min}`}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/50 text-xs space-y-1 text-slate-300">
            <div className="flex justify-between">
              <span>Daily Earnings:</span>
              <span className="text-emerald-400 font-medium">
                ₹{((Number(amount || 0) * selectedPlan.dailyRoi) / 100).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Expected Total ROI:</span>
              <span className="text-white font-medium">
                ₹{(((Number(amount || 0) * selectedPlan.dailyRoi) / 100) * selectedPlan.duration).toFixed(2)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg text-sm font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Confirm Investment'}
          </button>
        </form>
      </div>
    </div>
  );
}