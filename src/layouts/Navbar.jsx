import { LogOut, Copy, Check, UserCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [copied, setCopied] = useState(false);

  const copyReferral = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(
        `https://investo-app.netlify.app/register?ref=${user.referralCode}`,
      );
      setCopied(true);
      toast.success("Referral link copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">
            N
          </div>
          <span className="font-semibold text-white tracking-wide">
            Nexachain AI
          </span>
        </div>

        <div className="flex items-center gap-4">
          {user?.referralCode && (
            <button
              onClick={copyReferral}
              className="flex items-center gap-1.5 text-xs bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg hover:border-slate-600 transition"
            >
              <span>
                <strong>Reffer & Earn</strong>
              </span>
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          )}

          <Link
            to="/profile"
            className="flex items-center gap-2 text-slate-300 hover:text-white transition px-2 py-1.5 rounded-lg hover:bg-slate-800"
            title="Profile Settings"
          >
            <UserCircle className="w-5 h-5 text-indigo-400" />
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-white leading-tight">
                {user?.fullName}
              </p>
              <p className="text-[10px] text-slate-400 leading-tight">
                {user?.email}
              </p>
            </div>
          </Link>

          <button
            onClick={logout}
            className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 bg-rose-950/40 border border-rose-900/50 px-2.5 py-1.5 rounded-lg transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
