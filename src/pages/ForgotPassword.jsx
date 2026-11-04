import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';
import api from '../api/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [devToken, setDevToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/user/forgot-password', { email });
      toast.success(res.data?.message || 'Reset link / token generated!');
      // Stores token for local development testing
      if (res.data?.data?.resetToken) {
        setDevToken(res.data.data.resetToken);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to request reset token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-800 p-8 shadow-xl border border-slate-700">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600/20 text-indigo-400 mb-4 border border-indigo-500/30">
          <KeyRound className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold text-white text-center">Forgot Password</h2>
        <p className="text-xs text-slate-400 text-center mt-1">
          Enter your registered email address to receive password reset instructions.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg bg-slate-900 border border-slate-700 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 disabled:opacity-50 transition"
          >
            {loading ? 'Generating...' : 'Send Reset Link'}
          </button>
        </form>

        {devToken && (
          <div className="mt-5 p-3 rounded-lg bg-indigo-950/40 border border-indigo-800 text-xs text-slate-300 space-y-1">
            <p className="font-semibold text-indigo-400">Development Reset Token:</p>
            <p className="font-mono break-all text-[11px] bg-slate-900 p-1.5 rounded">{devToken}</p>
            <Link
              to={`/reset-password/${devToken}`}
              className="inline-block mt-2 text-indigo-400 underline font-medium hover:text-indigo-300"
            >
              Click here to proceed to Reset Password &rarr;
            </Link>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}