import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function EarningsChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-6 text-center text-slate-400 flex flex-col items-center justify-center h-64">
        <p className="text-sm">No historical transactions available to chart yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-5 shadow-sm">
      <h4 className="text-sm font-semibold text-white mb-4">Earnings Overview (ROI vs Level Income)</h4>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="levelGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
            <YAxis stroke="#94a3b8" fontSize={11} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ fontSize: '12px' }}
            />
            <Area type="monotone" dataKey="roi" stroke="#10b981" fillOpacity={1} fill="url(#roiGradient)" name="ROI Earned (₹)" />
            <Area type="monotone" dataKey="level" stroke="#6366f1" fillOpacity={1} fill="url(#levelGradient)" name="Level Income (₹)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}