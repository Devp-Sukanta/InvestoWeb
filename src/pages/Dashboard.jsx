import { useState, useEffect } from 'react';
import { IndianRupeeIcon, TrendingUp, Users, Wallet, Plus, RefreshCw, GitBranch } from 'lucide-react';
import Navbar from '../layouts/Navbar';
import StatCard from '../components/StatCard'
import EarningsChart from '../components/EarningsChart';
import DashboardTables from '../components/DashboardTables';
import ReferralTree from '../components/ReferralTree';
import CreateInvestmentModal from '../components/CreateInvestmentModal';
import api from '../api/axios';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalInvestments: 0,
    totalRoiEarned: 0,
    totalLevelIncomeEarned: 0,
    walletBalance: 0,
  });

  const [investments, setInvestments] = useState([]);
  const [roiHistory, setRoiHistory] = useState([]);
  const [referralIncome, setReferralIncome] = useState([]);
  const [referralTreeData, setReferralTreeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, invRes, roiRes, refIncomeRes, treeRes] = await Promise.all([
        api.get('/dashboard'),
        api.get('/investment/my'),
        api.get('/dashboard/roi-history'),
        api.get('/referrel/income-history'),
        api.get('/referrel/tree'),
      ]);

      // console.log(statsRes, invRes,roiRes,refIncomeRes, treeRes)

      setStats(statsRes.data?.data?.stats || {});
      setInvestments(invRes.data?.data?.investments || []);
      setRoiHistory(roiRes.data?.data?.roiHistory || []);
      setReferralIncome(refIncomeRes.data?.data?.history || []);
      setReferralTreeData(treeRes.data?.data?.tree || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Format chart data combining recent daily ROI and level commissions
  const chartData = [
    ...roiHistory.map((r) => ({ date: r.dateString || new Date(r.date).toLocaleDateString(), roi: r.roiAmount, level: 0 })),
    ...referralIncome.map((l) => ({ date: new Date(l.date).toLocaleDateString(), roi: 0, level: l.incomeAmount })),
  ].slice(-10);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Overview Dashboard</h1>
            <p className="text-xs text-slate-400 mt-1">Real-time performance of your investments & referral network</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>New Investment</span>
            </button>
          </div>
        </div>

        {/* 1. Dashboard Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Investments"
            amount={stats.totalInvestments}
            icon={TrendingUp}
            color="indigo"
            subtext={`${investments.length} total portfolios`}
          />
          <StatCard
            title="Total ROI Earned"
            amount={stats.totalRoiEarned}
            icon={IndianRupeeIcon}
            color="emerald"
            subtext="From active allocations"
          />
          <StatCard
            title="Total Level Income"
            amount={stats.totalLevelIncomeEarned}
            icon={Users}
            color="violet"
            subtext="Downline commissions"
          />
          <StatCard
            title="Wallet Balance"
            amount={stats.walletBalance}
            icon={Wallet}
            color="amber"
            subtext="Available for withdrawal"
          />
        </div>

        {/* 2. Visual Earnings Chart */}
        <EarningsChart data={chartData} />

        {/* 3. Transaction & Portfolio Tables */}
        <DashboardTables
          investments={investments}
          roiHistory={roiHistory}
          referralIncome={referralIncome}
        />

        {/* 4. Complete Referral Tree View */}
        <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <GitBranch className="w-4 h-4 text-indigo-400" />
            <h4 className="text-sm font-semibold text-white">Your Referral Network Hierarchy</h4>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800 min-h-[140px] overflow-x-auto">
            {referralTreeData.length === 0 ? (
              <p className="text-xs text-slate-500 italic">
                You do not have any downline members in your referral tree yet. Share your referral code to grow your network!
              </p>
            ) : (
              referralTreeData.map((childNode) => (
                <ReferralTree key={childNode._id} node={childNode} />
              ))
            )}
          </div>
        </div>
      </main>

      {/* Investment Modal */}
      <CreateInvestmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
    </div>
  );
}