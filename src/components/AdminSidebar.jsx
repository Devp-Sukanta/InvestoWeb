import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Coins,
  Settings,
  ChevronDown,
  Shield,
  FileSpreadsheet,
  X,
} from 'lucide-react';

export default function AdminSidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const currentFullPath = location.pathname + location.search;

  const [openSubmenus, setOpenSubmenus] = useState({
    users: true,
    investments: true,
  });

  const toggleSubmenu = (menu) => {
    setOpenSubmenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const navLinks = [
    {
      label: 'Overview',
      to: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'User Control',
      key: 'users',
      icon: Users,
      badge: 'CRUD',
      sublinks: [
        { label: 'All Users Directory', to: '/admin/users' },
      ],
    },
    {
      label: 'Financial Ledger',
      key: 'investments',
      icon: Coins,
      sublinks: [
        { label: 'Investments', to: '/admin/investments' },
        { label: 'Daily ROI Distribution', to: '/admin/ledger/roi' },
        { label: 'Referral Commissions', to: '/admin/ledger/referrals' },
      ],
    },
    {
      label: 'Reports & Export',
      to: '/admin/reports',
      icon: FileSpreadsheet,
    },
    {
      label: 'System Settings',
      to: '/admin/settings',
      icon: Settings,
    },
  ];

  // Helper: check exact match for query params or exact path
  const isSublinkActive = (targetTo) => {
    return currentFullPath === targetTo;
  };

  const isParentActive = (item) => {
    if (!item.sublinks) return location.pathname === item.to;
    return item.sublinks.some((sub) => currentFullPath === sub.to || location.pathname === sub.to.split('?')[0]);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-slate-950 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 shadow-lg shadow-rose-950/40">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-wider text-white">NEXA MASTER</span>
              <span className="block text-[10px] font-medium tracking-tight text-rose-400">RESTRICTED CONSOLE</span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-5 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
          {navLinks.map((item) => {
            const Icon = item.icon;

            if (item.sublinks) {
              const isSubmenuOpen = openSubmenus[item.key];
              const parentActive = isParentActive(item);

              return (
                <div key={item.key} className="space-y-1">
                  <button
                    onClick={() => toggleSubmenu(item.key)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                      parentActive
                        ? 'bg-rose-950/30 text-rose-400'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[9px] font-bold text-rose-300">
                          {item.badge}
                        </span>
                      )}
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${
                          isSubmenuOpen ? 'rotate-180 text-rose-400' : 'text-slate-600'
                        }`}
                      />
                    </div>
                  </button>

                  {/* Submenu links */}
                  {isSubmenuOpen && (
                    <div className="ml-3 space-y-1 border-l border-slate-800 pl-3 pt-1">
                      {item.sublinks.map((sub) => {
                        const active = isSublinkActive(sub.to);
                        return (
                          <Link
                            key={sub.to}
                            to={sub.to}
                            onClick={() => setIsOpen(false)}
                            className={`block rounded-lg px-3 py-2 text-xs transition ${
                              active
                                ? 'bg-rose-600 font-semibold text-white shadow-sm'
                                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                            }`}
                          >
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                  active
                    ? 'bg-rose-600 font-semibold text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-900 bg-slate-950">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 text-[11px] text-slate-400">
            <div className="flex items-center gap-2 font-medium text-slate-200 mb-0.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Core System Secure
            </div>
            Active session guarded
          </div>
        </div>
      </aside>
    </>
  );
}