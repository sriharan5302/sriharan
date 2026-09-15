import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import {
  BookMarked,
  Clock,
  RotateCw,
  AlertCircle,
  Calendar,
  CheckCircle2,
  DollarSign,
  History,
  BookmarkCheck,
  Search,
  Bell,
  ArrowRight
} from 'lucide-react';

export const MemberDashboard: React.FC = () => {
  const {
    currentUser,
    transactions,
    reservations,
    notifications,
    books,
    setCurrentPage,
    renewBook,
    settleFine,
    viewBookDetails,
    cancelReservation,
  } = useLibrary();

  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'reservations'>('current');

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Member Session Required</h2>
        <p className="text-sm text-slate-500">Please sign in with a student or member account to view your borrowed books.</p>
        <button
          onClick={() => setCurrentPage('login')}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700"
        >
          Sign In
        </button>
      </div>
    );
  }

  // Filter loans for this member
  const memberTransactions = transactions.filter(t => t.memberId === currentUser.memberId);
  const currentBorrowed = memberTransactions.filter(t => t.status === 'active' || t.status === 'overdue');
  const borrowingHistory = memberTransactions.filter(t => t.status === 'returned');
  const myReservations = reservations.filter(r => r.memberId === currentUser.memberId);

  // Fines calculation
  const totalFinesDue = currentBorrowed.reduce((acc, t) => acc + (t.fine || 0), 0);
  const overdueCount = currentBorrowed.filter(t => t.status === 'overdue').length;

  // Compute days remaining helper
  const getDueStatus = (dueDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDateStr);
    due.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: `${Math.abs(diffDays)} days overdue`, isOverdue: true, days: diffDays };
    } else if (diffDays === 0) {
      return { label: 'Due today', isOverdue: false, isToday: true, days: 0 };
    } else {
      return { label: `Due in ${diffDays} day${diffDays === 1 ? '' : 's'}`, isOverdue: false, days: diffDays };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <span>Student &bull; {currentUser.memberId}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your current loans, renewal deadlines, active reservations, and membership dues.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCurrentPage('catalogue')}
            id="member-search-books-btn"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold transition-colors shadow-sm"
          >
            <Search className="w-4 h-4" />
            Search &amp; Borrow Books
          </button>
          <button
            onClick={() => setCurrentPage('notifications')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-sm font-semibold transition-colors shadow-xs"
          >
            <Bell className="w-4 h-4 text-blue-600" />
            Alerts
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Books Borrowed */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Currently Borrowed</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookMarked className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900">
              {currentBorrowed.length}
              <span className="text-sm font-normal text-slate-500"> / {currentUser.maxBooksAllowed} max</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Active physical loans in your possession
            </div>
          </div>
        </div>

        {/* Due Dates Alert */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Loan Status</span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              overdueCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
            }`}>
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-3xl font-extrabold ${overdueCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {overdueCount > 0 ? `${overdueCount} Overdue` : 'All On Time'}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {overdueCount > 0 ? 'Return overdue items promptly' : 'Next due date active'}
            </div>
          </div>
        </div>

        {/* Outstanding Dues / Fines */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Accumulated Fines</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-3xl font-extrabold ${totalFinesDue > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              ${totalFinesDue.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {totalFinesDue > 0 ? 'Pay at circulation desk' : 'No overdue fines pending'}
            </div>
          </div>
        </div>

        {/* Reservations Queued */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Holds</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BookmarkCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900">{myReservations.length}</div>
            <div className="text-xs text-slate-500 mt-1">
              {myReservations.filter(r => r.status === 'ready').length} ready for pickup
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation: My Borrowed Books / Borrowing History / Reservations */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="border-b border-slate-200 px-6 pt-4 flex gap-4">
          <button
            onClick={() => setActiveTab('current')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'current'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookMarked className="w-4 h-4" />
            My Borrowed Books ({currentBorrowed.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'history'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            Borrowing History ({borrowingHistory.length})
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'reservations'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            Hold Reservations ({myReservations.length})
          </button>
        </div>

        {/* Tab 1: Current Borrowed Books */}
        {activeTab === 'current' && (
          <div className="p-6">
            {currentBorrowed.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">No active loans at this time</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  You do not have any borrowed books out from the library. Browse the catalogue to issue a textbook.
                </p>
                <button
                  onClick={() => setCurrentPage('catalogue')}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors"
                >
                  Explore Catalogue
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentBorrowed.map(tx => {
                  const dueInfo = getDueStatus(tx.dueDate);
                  return (
                    <div
                      key={tx.txnId}
                      className={`p-5 rounded-2xl border transition-all ${
                        dueInfo.isOverdue
                          ? 'border-rose-200 bg-rose-50/20'
                          : 'border-slate-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block">{tx.txnId}</span>
                          <h4 className="text-base font-bold text-slate-900 line-clamp-1">{tx.bookTitle}</h4>
                          <span className="text-xs text-slate-500 font-mono">Book ID: {tx.bookId}</span>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            dueInfo.isOverdue
                              ? 'bg-rose-100 text-rose-800'
                              : dueInfo.days <= 3
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {dueInfo.label}
                        </span>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[11px]">Issued On</span>
                          <span className="font-semibold text-slate-700">{tx.issueDate}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Due Date</span>
                          <span className="font-semibold text-slate-900">{tx.dueDate}</span>
                        </div>
                        {tx.fine > 0 && (
                          <div className="col-span-2 mt-1 p-2 bg-rose-50 rounded-lg border border-rose-100 flex items-center justify-between text-xs text-rose-700 font-semibold">
                            <span>Overdue Penalty Accrued:</span>
                            <span>${tx.fine.toFixed(2)}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => viewBookDetails(tx.bookId)}
                          className="text-xs font-semibold text-slate-600 hover:text-blue-600"
                        >
                          Book Info
                        </button>

                        <button
                          onClick={() => renewBook(tx.txnId)}
                          disabled={dueInfo.isOverdue || (tx.renewedCount || 0) >= 2}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            dueInfo.isOverdue || (tx.renewedCount || 0) >= 2
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                          }`}
                          title={
                            dueInfo.isOverdue
                              ? 'Cannot renew overdue book'
                              : (tx.renewedCount || 0) >= 2
                              ? 'Maximum renewals reached (2)'
                              : 'Extend due date by 14 days'
                          }
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                          Renew Loan {tx.renewedCount ? `(${tx.renewedCount}/2)` : ''}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Borrowing History */}
        {activeTab === 'history' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Txn ID</th>
                  <th className="py-3 px-6">Book Title</th>
                  <th className="py-3 px-6">Issue Date</th>
                  <th className="py-3 px-6">Due Date</th>
                  <th className="py-3 px-6">Returned Date</th>
                  <th className="py-3 px-6">Settled Fine</th>
                  <th className="py-3 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {borrowingHistory.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No returned transactions on record.
                    </td>
                  </tr>
                ) : (
                  borrowingHistory.map(tx => (
                    <tr key={tx.txnId} className="hover:bg-slate-50">
                      <td className="py-3 px-6 font-mono text-slate-500">{tx.txnId}</td>
                      <td className="py-3 px-6 font-bold text-slate-900">{tx.bookTitle}</td>
                      <td className="py-3 px-6 text-slate-600">{tx.issueDate}</td>
                      <td className="py-3 px-6 text-slate-600">{tx.dueDate}</td>
                      <td className="py-3 px-6 text-slate-900 font-semibold">{tx.returnDate}</td>
                      <td className="py-3 px-6 text-slate-600">${(tx.fine || 0).toFixed(2)}</td>
                      <td className="py-3 px-6">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Returned
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Reservations */}
        {activeTab === 'reservations' && (
          <div className="p-6">
            {myReservations.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                You do not have any active book reservations.
              </div>
            ) : (
              <div className="space-y-3">
                {myReservations.map(res => (
                  <div
                    key={res.reservationId}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{res.bookTitle}</h4>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            res.status === 'ready'
                              ? 'bg-emerald-100 text-emerald-800'
                              : res.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {res.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Requested on {res.requestDate} &bull; Ref: {res.reservationId}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {res.status === 'ready' && (
                        <span className="text-xs text-emerald-700 font-semibold">
                          Available at circulation desk!
                        </span>
                      )}
                      {res.status === 'pending' && (
                        <button
                          onClick={() => cancelReservation(res.reservationId)}
                          className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors font-medium"
                        >
                          Cancel Hold
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
