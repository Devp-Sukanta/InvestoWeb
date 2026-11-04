import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import {
  FileSpreadsheet,
  Download,
  Users,
  Coins,
  TrendingUp,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export default function AdminReports() {
  const [downloading, setDownloading] = useState(null);

  const handleExport = async (type, filenamePrefix) => {
    try {
      setDownloading(type);
      const response = await api.get(`/admin/reports/export/${type}`, {
        responseType: 'blob',
      });

      // Trigger browser native file download
      const blob = new Blob([response.data], { type: 'text/csv' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `${filenamePrefix}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      toast.success(`${filenamePrefix} export generated successfully!`);
    } catch (err) {
      toast.error('Failed to export dataset. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  const exportCards = [
    {
      id: 'users',
      title: 'User Master Directory',
      description: 'Complete user demographic profile, wallet balances, roles, account statuses, and referral parentage.',
      icon: Users,
      color: 'indigo',
    },
    {
      id: 'investments',
      title: 'Platform Investments',
      description: 'Historical and active member stakes, durations, daily returns, completion dates, and cancellations.',
      icon: Layers,
      color: 'emerald',
    },
    {
      id: 'roi',
      title: 'Daily ROI Distribution Ledger',
      description: 'Detailed distribution transaction log, date strings, daily credit volume, and audit reference keys.',
      icon: Coins,
      color: 'amber',
    },
    {
      id: 'referrals',
      title: 'Referral Multi-Tier Ledger',
      description: 'Upline commission credits, downline generator links, level tier hierarchy, and timestamp stamps.',
      icon: TrendingUp,
      color: 'rose',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white tracking-wide">Data Reports & CSV Export</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Generate point-in-time spreadsheet audits for reconciliation, reporting, and offline backup
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exportCards.map((card) => {
          const Icon = card.icon;
          const isBusy = downloading === card.id;

          return (
            <div
              key={card.id}
              className="rounded-2xl border border-slate-800 bg-slate-950 p-6 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300">
                      <Icon className="h-5 w-5 text-rose-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{card.title}</h3>
                      <span className="text-[10px] uppercase font-mono text-slate-500">FORMAT: CSV</span>
                    </div>
                  </div>
                  <FileSpreadsheet className="h-5 w-5 text-slate-600" />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {card.description}
                </p>
              </div>

              <button
                onClick={() => handleExport(card.id, card.title.toLowerCase().replace(/\s+/g, '_'))}
                disabled={isBusy}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-rose-500/60 hover:bg-slate-850 px-4 py-2.5 text-xs font-semibold text-white transition disabled:opacity-50"
              >
                {isBusy ? (
                  <>
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
                    <span>Preparing CSV stream...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 text-rose-400" />
                    <span>Download CSV Dataset</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}