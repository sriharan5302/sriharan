import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Transaction } from '../types';
import {
  ArrowLeftRight,
  BookOpen,
  User,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  RotateCw,
  Undo2,
  Check,
  Plus
} from 'lucide-react';

export const IssueReturnPage: React.FC = () => {
  const {
    books,
    members,
    transactions,
    settings,
    issueBook,
    returnBook,
    renewBook,
    settleFine,
    currentUser,
  } = useLibrary();

  // Issue Book Form State
  const [selectedMemberId, setSelectedMemberId] = useState(members[2]?.memberId || '');
  const [selectedBookId, setSelectedBookId] = useState(books[0]?.bookId || '');
  const [customDays, setCustomDays] = useState(settings.maxBorrowDays);
  const [issueError, setIssueError] = useState('');

  // Transactions list filter state
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'overdue' | 'returned'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected transaction for fine checkout/return modal
  const [returningTxn, setReturningTxn] = useState<Transaction | null>(null);

  // Compute calculated due date
  const computeCalculatedDueDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const calculatedDueDateStr = computeCalculatedDueDate(customDays);

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIssueError('');

    if (!selectedMemberId) {
      setIssueError('Please select a member.');
      return;
    }
    if (!selectedBookId) {
      setIssueError('Please select a book.');
      return;
    }

    const result = issueBook(selectedBookId, selectedMemberId, calculatedDueDateStr);
    if (!result.success) {
      setIssueError(result.message);
    } else {
      // Reset form selection
      setIssueError('');
    }
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesSearch =
      (t.bookTitle?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (t.memberName?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      t.memberId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.txnId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.bookId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const activeCount = transactions.filter(t => t.status === 'active').length;
  const overdueCount = transactions.filter(t => t.status === 'overdue').length;
  const totalFinesDue = transactions.filter(t => t.status === 'overdue').reduce((acc, t) => acc + t.fine, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <ArrowLeftRight className="w-4 h-4" />
            Circulation Services
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Issue &amp; Return Desk
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Process textbook loans, check in returned volumes, and compute automated overdue fines (${settings.finePerDay.toFixed(2)}/day).
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Standard Loan</span>
            <span className="font-bold text-slate-800">{settings.maxBorrowDays} Days</span>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Overdue Rate</span>
            <span className="font-bold text-rose-600">${settings.finePerDay.toFixed(2)} / Day</span>
          </div>
        </div>
      </div>

      {/* Grid: Fast Issue Form & Status Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Fast Issue Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Plus className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Issue Book to Member</h3>
              <p className="text-xs text-slate-500">Record a new physical checkout into the system register</p>
            </div>
          </div>

          <form onSubmit={handleIssueSubmit} className="space-y-4">
            {/* Member select */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Member / Borrower <span className="text-rose-500">*</span>
              </label>
              <select
                id="issue-member-select"
                value={selectedMemberId}
                onChange={e => setSelectedMemberId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
              >
                {members.map(m => (
                  <option key={m.memberId} value={m.memberId}>
                    {m.name} ({m.memberId}) — Currently has {m.borrowedCount}/{m.maxBooksAllowed} books {m.status === 'suspended' ? '[SUSPENDED]' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Book select */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Book from Catalogue <span className="text-rose-500">*</span>
              </label>
              <select
                id="issue-book-select"
                value={selectedBookId}
                onChange={e => setSelectedBookId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
              >
                {books.map(b => (
                  <option key={b.bookId} value={b.bookId} disabled={b.copiesAvailable <= 0}>
                    {b.title} by {b.author} ({b.bookId}) — {b.copiesAvailable > 0 ? `${b.copiesAvailable} copies in stock` : 'ALL COPIES ISSUED'}
                  </option>
                ))}
              </select>
            </div>

            {/* Dates: Automatic Computation */}
            <div className="grid grid-cols-2 gap-4 p-3.5 bg-blue-50/50 rounded-xl border border-blue-100 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px] mb-1 font-medium">
                  Issue Date (Today)
                </span>
                <span className="font-bold text-slate-800 font-mono text-sm">{todayStr}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px] mb-1 font-medium">
                  Auto-Computed Due Date (+{customDays} days)
                </span>
                <span className="font-bold text-blue-700 font-mono text-sm">{calculatedDueDateStr}</span>
              </div>
            </div>

            {/* Loan duration adjuster */}
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Loan Duration:</span>
              <div className="flex items-center gap-2">
                {[7, 14, 21, 28].map(days => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setCustomDays(days)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      customDays === days
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </div>

            {issueError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{issueError}</span>
              </div>
            )}

            <button
              type="submit"
              id="confirm-issue-btn"
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Confirm Book Issue
            </button>
          </form>
        </div>

        {/* Status Snapshot & Fine Rules (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Current Circulation Pulse</h3>
            
            <div className="space-y-3">
              <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    {activeCount}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Active Loans</span>
                    <span className="text-[11px] text-slate-500">Books currently in reading hands</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-blue-700">Normal</span>
              </div>

              <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                    {overdueCount}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Overdue Books</span>
                    <span className="text-[11px] text-slate-500">Fines accruing automatically</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-rose-700">${totalFinesDue.toFixed(2)} Accrued</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
              <div className="font-semibold text-slate-700">Automatic Overdue Formula:</div>
              <p className="font-mono text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-200">
                Fine = Math.max(0, (ReturnDate - DueDate) in days) &times; ${settings.finePerDay.toFixed(2)}
              </p>
              <p className="text-[11px]">Members with overdue books receive automated daily reminders.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Register Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Filter Controls */}
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Transaction Register (Issue &amp; Return Records)</h3>
            <p className="text-xs text-slate-500">Member name, book name, issue/due dates, return dates, and fine settlements</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search member, book, txn ID..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              {(['all', 'active', 'overdue', 'returned'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                    statusFilter === st
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Txn ID</th>
                <th className="py-3 px-4">Member Name &amp; ID</th>
                <th className="py-3 px-4">Book Title</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Return Date</th>
                <th className="py-3 px-4">Fine</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map(tx => (
                <tr key={tx.txnId} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-500">{tx.txnId}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{tx.memberName}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{tx.memberId}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-900 block max-w-[200px] truncate">{tx.bookTitle}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{tx.bookId}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{tx.issueDate}</td>
                  <td className="py-3 px-4 text-slate-800 font-medium">{tx.dueDate}</td>
                  <td className="py-3 px-4 text-slate-900 font-semibold">
                    {tx.returnDate || <span className="text-slate-400 font-normal">Pending</span>}
                  </td>
                  <td className="py-3 px-4">
                    {tx.fine > 0 ? (
                      <span className="font-bold text-rose-600">${tx.fine.toFixed(2)}</span>
                    ) : (
                      <span className="text-slate-400">$0.00</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.status === 'returned'
                          ? 'bg-slate-100 text-slate-700'
                          : tx.status === 'overdue'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {tx.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5">
                    {tx.status !== 'returned' && (
                      <>
                        <button
                          onClick={() => returnBook(tx.txnId)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center gap-1"
                          title="Check in this book"
                        >
                          <Undo2 className="w-3 h-3" /> Return
                        </button>
                        <button
                          onClick={() => renewBook(tx.txnId)}
                          disabled={tx.status === 'overdue'}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors inline-flex items-center gap-1 ${
                            tx.status === 'overdue'
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'text-blue-700 bg-blue-50 hover:bg-blue-100'
                          }`}
                          title={tx.status === 'overdue' ? 'Cannot renew overdue loan' : 'Extend due date by 14 days'}
                        >
                          <RotateCw className="w-3 h-3" /> Renew
                        </button>
                      </>
                    )}
                    {tx.fine > 0 && (
                      <button
                        onClick={() => settleFine(tx.txnId)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                        title="Clear or waive fine"
                      >
                        Settle Fine
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs">
            No circulation transactions match the specified filters.
          </div>
        )}
      </div>
    </div>
  );
};
