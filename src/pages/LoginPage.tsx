import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { UserRole } from '../types';
import {
  BookOpen,
  Lock,
  Mail,
  Shield,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  ArrowRight,
  Info
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, setCurrentPage } = useLibrary();

  const [role, setRole] = useState<UserRole>('admin');
  const [emailOrId, setEmailOrId] = useState('admin@library.edu');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setError('');
    if (newRole === 'admin') {
      setEmailOrId('admin@library.edu');
      setPassword('admin123');
    } else if (newRole === 'librarian') {
      setEmailOrId('librarian@library.edu');
      setPassword('lib123');
    } else {
      setEmailOrId('sophia.m@student.edu');
      setPassword('student123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrId.trim()) {
      setError('Please enter your email or member ID.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your account password.');
      return;
    }

    const success = login(emailOrId, role);
    if (!success) {
      setError('Invalid credentials for the selected role. Try one of the demo accounts below.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50/60">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-blue-600 text-white items-center justify-center shadow-lg shadow-blue-500/25 mb-1">
            <BookOpen className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Library Portal Login
          </h1>
          <p className="text-sm text-slate-500">
            Sign in to access your dashboard, catalogue & circulation desk
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection Tabs */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  id="role-admin-btn"
                  onClick={() => handleRoleChange('admin')}
                  className={`py-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
                    role === 'admin'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin
                </button>
                <button
                  type="button"
                  id="role-librarian-btn"
                  onClick={() => handleRoleChange('librarian')}
                  className={`py-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
                    role === 'librarian'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  Librarian
                </button>
                <button
                  type="button"
                  id="role-member-btn"
                  onClick={() => handleRoleChange('member')}
                  className={`py-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
                    role === 'member'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  Member
                </button>
              </div>
            </div>

            {/* Email / Username Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address or Member ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  id="login-email-input"
                  value={emailOrId}
                  onChange={e => {
                    setEmailOrId(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g. admin@library.edu or MEM-101"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition-colors"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <span className="text-[11px] text-blue-600 hover:underline cursor-pointer">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  id="login-password-input"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              id="login-submit-btn"
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins Section */}
          <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Instant Demo Logins</span>
              <span className="text-blue-600 text-[11px]">Click to prefill &amp; test:</span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  handleRoleChange('admin');
                  login('admin@library.edu', 'admin');
                }}
                className="w-full p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-left transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-900 block">Dr. Eleanor Vance</span>
                  <span className="text-slate-500">System Administrator &bull; admin@library.edu</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">Admin</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleRoleChange('librarian');
                  login('librarian@library.edu', 'librarian');
                }}
                className="w-full p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-left transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-900 block">David Miller</span>
                  <span className="text-slate-500">Circulation Librarian &bull; librarian@library.edu</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Librarian</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleRoleChange('member');
                  login('sophia.m@student.edu', 'member');
                }}
                className="w-full p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-left transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-900 block">Sophia Martinez</span>
                  <span className="text-slate-500">Student Member &bull; sophia.m@student.edu</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-bold">Member</span>
              </button>
            </div>
          </div>
        </div>

        {/* Back to Catalogue */}
        <div className="text-center">
          <button
            onClick={() => setCurrentPage('catalogue')}
            className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            &larr; Return to Public Book Catalogue
          </button>
        </div>
      </div>
    </div>
  );
};
