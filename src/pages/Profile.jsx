import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Lock } from 'lucide-react';
import api from '../api/axios';
import Navbar from '../layouts/Navbar';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, refreshProfile } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    currentPassword: '',
    newPassword: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || '',
        email: user.email || '',
        mobileNumber: user.mobileNumber || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
      };

      // Only send email if user currently didn't have one
      if (!user?.email && formData.email) {
        payload.email = formData.email;
      }

      // Only send password fields if newPassword is provided
      if (formData.newPassword) {
        payload.currentPassword = formData.currentPassword;
        payload.newPassword = formData.newPassword;
      }

      await api.put('/user/update-profile', payload);
      toast.success('Profile updated successfully!');
      await refreshProfile();

      // Clear password fields on success
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
          <p className="text-xs text-slate-400 mt-1">Manage your account credentials and personal details</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm">
          <form onSubmit={handleProfileSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 py-2.5 pl-10 pr-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Email (Locked if set) */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address {user?.email && <span className="text-[10px] text-slate-400 font-normal">(Locked)</span>}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  readOnly={!!user?.email}
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm ${
                    user?.email
                      ? 'bg-slate-900/50 border-slate-800 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500 focus:outline-none'
                  }`}
                />
              </div>
              {user?.email && (
                <p className="text-[11px] text-slate-500 mt-1">Email is permanently locked for account security.</p>
              )}
            </div>

            {/* Mobile Number (Freely editable) */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <hr className="border-slate-700 my-4" />

            {/* Password Section */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">Change Password</h3>
              <p className="text-[11px] text-slate-400 mb-3">Leave blank if you do not want to change your password.</p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full rounded-lg bg-slate-900 border border-slate-700 py-2.5 pl-10 pr-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">New Password (Min 8 chars)</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      name="newPassword"
                      minLength={8}
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full rounded-lg bg-slate-900 border border-slate-700 py-2.5 pl-10 pr-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 disabled:opacity-50 transition"
              >
                {loading ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}