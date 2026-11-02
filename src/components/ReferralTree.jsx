import { useState } from 'react';
import { ChevronRight, ChevronDown, User, ShieldCheck } from 'lucide-react';

export default function ReferralTree({ node }) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = node.referrals && node.referrals.length > 0;

  return (
    <div className="ml-4 pl-3 border-l-2 border-slate-700 my-1.5">
      <div
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs cursor-pointer select-none transition ${
          hasChildren ? 'bg-slate-800 hover:bg-slate-700/70' : 'bg-slate-800/40'
        } border border-slate-700/80`}
      >
        {hasChildren ? (
          isOpen ? <ChevronDown className="w-3.5 h-3.5 text-indigo-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        ) : (
          <span className="w-3.5" />
        )}

        <User className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-white">{node.fullName}</span>
        <span className="text-slate-400 text-[11px]">({node.email})</span>
        <span className="bg-indigo-900/60 text-indigo-300 px-1.5 py-0.5 rounded text-[10px] uppercase font-mono">
          {node.referralCode}
        </span>
        <span className="text-slate-500 text-[10px]">Lvl {node.level}</span>
        {node.accountStatus === 'active' && (
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 ml-1" />
        )}
      </div>

      {hasChildren && isOpen && (
        <div className="mt-1">
          {node.referrals.map((child) => (
            <ReferralTreeNode key={child._id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}