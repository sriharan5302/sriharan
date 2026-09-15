import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookModal } from '../components/BookModal';
import { MemberModal } from '../components/MemberModal';
import { SettingsModal } from '../components/SettingsModal';
import { Member } from '../types';
import {
  BookOpen,
  Users,
  ArrowLeftRight,
  AlertTriangle,
  Settings,
  BarChart3,
  UserPlus,
  BookPlus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileText,
  DollarSign
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    books,
    members,
    transactions,
    setCurrentPage,
    deleteMember,
    toggleMemberStatus,
    settings,
  } = useLibrary();

  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);

  // Key metrics
  const totalBooks = books.reduce((acc, b) => acc + b.totalCopies, 0);
  const totalTitles = books.length;
  const totalMembers = members.length;
  const activeLoans = transactions.filter(t => t.status === 'active').length;
  const overdueLoans = transactions.filter(t => t.status === 'overdue').length;
  const totalFines = transactions.reduce((acc, t) => acc + t.fine, 0);

  const librarians = members.filter(m => m.role === 'librarian');
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            System Administration Panel
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Admin Overview & Control Center
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Supervise catalogue collections, librarian staffing, circulation policies, and financial dues.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            id="admin-settings-btn"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-sm font-semibold transition-colors shadow-xs"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            System Settings
          </button>
          <button
            onClick={() => {
              setMemberToEdit(null);
              setIsMemberModalOpen(true);
            }}
            id="admin-add-user-btn"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            Add Staff / Member
          </button>
        </div>
      </div>

      {/* Metric Cards (Total Books, Total Members, Issued Books, Overdue Books) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Books */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Books</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900">{totalBooks}</div>
            <div className="text-xs text-slate-500 mt-1">
              across <span className="font-semibold text-slate-700">{totalTitles} distinct titles</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage('catalogue')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Manage Catalog &rarr;
            </button>
            <button
              onClick={() => setIsBookModalOpen(true)}
              className="text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1"
            >
              <BookPlus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>

        {/* Total Members */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Members</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900">{totalMembers}</div>
            <div className="text-xs text-slate-500 mt-1">
              <span className="font-semibold text-slate-700">{librarians.length} Staff</span> &bull; {totalMembers - librarians.length} Students
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage('member-management')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              View Member Directory &rarr;
            </button>
          </div>
        </div>

        {/* Issued Books */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Issued Loans</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900">{activeLoans}</div>
            <div className="text-xs text-slate-500 mt-1">
              Currently in circulation with members
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage('issue-return')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Circulation Desk &rarr;
            </button>
          </div>
        </div>

        {/* Overdue Books */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Overdue Books</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-rose-600">{overdueLoans}</div>
            <div className="text-xs text-slate-500 mt-1">
              Accrued fines: <span className="font-semibold text-rose-600">${totalFines.toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage('issue-return')}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700"
            >
              Resolve Overdues &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Action Shortcut Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setCurrentPage('member-management')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs text-left transition-all group"
        >
          <div className="text-xs font-semibold text-slate-500 group-hover:text-blue-600">Action 01</div>
          <div className="text-sm font-bold text-slate-900 mt-1">Manage Librarians</div>
          <p className="text-xs text-slate-500 mt-0.5">Assign circulation staff</p>
        </button>

        <button
          onClick={() => setCurrentPage('member-management')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs text-left transition-all group"
        >
          <div className="text-xs font-semibold text-slate-500 group-hover:text-blue-600">Action 02</div>
          <div className="text-sm font-bold text-slate-900 mt-1">Manage Members</div>
          <p className="text-xs text-slate-500 mt-0.5">Students, staff & limits</p>
        </button>

        <button
          onClick={() => setCurrentPage('catalogue')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs text-left transition-all group"
        >
          <div className="text-xs font-semibold text-slate-500 group-hover:text-blue-600">Action 03</div>
          <div className="text-sm font-bold text-slate-900 mt-1">Manage Books</div>
          <p className="text-xs text-slate-500 mt-0.5">Add, edit, restock inventory</p>
        </button>

        <button
          onClick={() => setCurrentPage('reports')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs text-left transition-all group"
        >
          <div className="text-xs font-semibold text-slate-500 group-hover:text-blue-600">Action 04</div>
          <div className="text-sm font-bold text-slate-900 mt-1">View Reports</div>
          <p className="text-xs text-slate-500 mt-0.5">Circulation charts & stats</p>
        </button>
      </div>

      {/* Grid: Librarians List & Recent Circulation Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Manage Librarians Table (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Appointed Librarians</h3>
                <p className="text-xs text-slate-500">Staff with circulation desk privileges</p>
              </div>
              <button
                onClick={() => {
                  setMemberToEdit(null);
                  setIsMemberModalOpen(true);
                }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                + Add Librarian
              </button>
            </div>

            <div className="space-y-3">
              {librarians.map(lib => (
                <div
                  key={lib.memberId}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                      {lib.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{lib.name}</div>
                      <div className="text-xs text-slate-500">{lib.email}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      {lib.status}
                    </span>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-mono">{lib.memberId}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>System Policy: Fine rate is ${settings.finePerDay.toFixed(2)}/day</span>
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="text-blue-600 hover:underline font-semibold"
            >
              Configure
            </button>
          </div>
        </div>

        {/* Recent Transactions & Circulation (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Circulation Transactions</h3>
              <p className="text-xs text-slate-500">Live feed of book checkouts and returns</p>
            </div>
            <button
              onClick={() => setCurrentPage('issue-return')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Full Register &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Txn ID</th>
                  <th className="py-2.5 px-3">Book</th>
                  <th className="py-2.5 px-3">Member</th>
                  <th className="py-2.5 px-3">Due Date</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentTransactions.map(tx => (
                  <tr key={tx.txnId} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-mono text-slate-500">{tx.txnId}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 truncate max-w-[160px]">
                      {tx.bookTitle}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">{tx.memberName}</td>
                    <td className="py-2.5 px-3 text-slate-600">{tx.dueDate}</td>
                    <td className="py-2.5 px-3">
                      {tx.status === 'returned' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          Returned
                        </span>
                      )}
                      {tx.status === 'active' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                          Active
                        </span>
                      )}
                      {tx.status === 'overdue' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                          Overdue (${tx.fine.toFixed(2)})
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Modals */}
      <BookModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        bookToEdit={null}
      />
      <MemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        memberToEdit={memberToEdit}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
};
