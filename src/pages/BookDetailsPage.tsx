import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookModal } from '../components/BookModal';
import {
  ArrowLeft,
  BookOpen,
  MapPin,
  Calendar,
  Building2,
  Barcode,
  CheckCircle2,
  XCircle,
  BookmarkPlus,
  ArrowLeftRight,
  Edit3,
  History,
  ShieldCheck,
  Star
} from 'lucide-react';

export const BookDetailsPage: React.FC = () => {
  const {
    selectedBookId,
    books,
    transactions,
    currentUser,
    setCurrentPage,
    reserveBook,
  } = useLibrary();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Find book
  const book = books.find(b => b.bookId === selectedBookId) || books[0];

  if (!book) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Book Not Found</h2>
        <p className="text-sm text-slate-500">The requested catalog item could not be retrieved.</p>
        <button
          onClick={() => setCurrentPage('catalogue')}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700"
        >
          Return to Catalogue
        </button>
      </div>
    );
  }

  // Transactions associated with this book
  const bookTransactions = transactions.filter(t => t.bookId === book.bookId);
  const activeLoans = bookTransactions.filter(t => t.status === 'active' || t.status === 'overdue');
  const pastReturns = bookTransactions.filter(t => t.status === 'returned');

  const isStaff = currentUser?.role === 'admin' || currentUser?.role === 'librarian';
  const isAvailable = book.copiesAvailable > 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <div>
        <button
          onClick={() => setCurrentPage('catalogue')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Book Catalogue
        </button>
      </div>

      {/* Main Details Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Book Cover Placeholder Badge (Left, 4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="w-full max-w-[240px] aspect-[3/4] rounded-2xl bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 text-white p-6 shadow-xl flex flex-col justify-between relative overflow-hidden border border-blue-500/20">
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/20 text-white backdrop-blur-xs">
                  {book.category}
                </span>
                <BookOpen className="w-5 h-5 text-blue-200" />
              </div>

              <div className="space-y-1">
                <h3 className="font-extrabold text-lg leading-tight line-clamp-3">
                  {book.title}
                </h3>
                <p className="text-xs text-blue-200 font-medium">by {book.author}</p>
              </div>

              <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[10px] text-blue-200 font-mono">
                <span>{book.bookId}</span>
                <span>{book.publishedYear}</span>
              </div>
            </div>

            {/* Availability pill */}
            <div className="mt-4 w-full max-w-[240px]">
              <div className={`p-3 rounded-xl border text-center ${
                isAvailable
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                <div className="text-sm font-extrabold flex items-center justify-center gap-1.5">
                  {isAvailable ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
                  {isAvailable ? `${book.copiesAvailable} Available for Loan` : 'Currently Checked Out'}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Total inventory in library: {book.totalCopies} copies
                </div>
              </div>
            </div>
          </div>

          {/* Book Information (Right, 8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  {book.category}
                </span>
                <span className="text-xs font-mono text-slate-400">ID: {book.bookId}</span>
                {book.rating && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 ml-auto">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {book.rating.toFixed(1)} / 5.0
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-snug">
                {book.title}
              </h1>
              <p className="text-base text-slate-700 mt-1 font-medium">
                Authored by <span className="text-blue-700 font-semibold">{book.author}</span>
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px] flex items-center gap-1 mb-0.5">
                  <Barcode className="w-3.5 h-3.5" /> ISBN Number
                </span>
                <span className="font-mono font-bold text-slate-800">{book.isbn}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] flex items-center gap-1 mb-0.5">
                  <MapPin className="w-3.5 h-3.5" /> Shelf Stacks
                </span>
                <span className="font-semibold text-slate-800">{book.shelfLocation}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] flex items-center gap-1 mb-0.5">
                  <Building2 className="w-3.5 h-3.5" /> Publisher
                </span>
                <span className="font-semibold text-slate-800">{book.publisher || 'University Press'}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] flex items-center gap-1 mb-0.5">
                  <Calendar className="w-3.5 h-3.5" /> Publication Year
                </span>
                <span className="font-semibold text-slate-800">{book.publishedYear}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">Copies In Circulation</span>
                <span className="font-semibold text-slate-800">{book.totalCopies - book.copiesAvailable} copies</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">Loan Duration</span>
                <span className="font-semibold text-slate-800">14 Days (Standard)</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Book Synopsis &amp; Syllabus Context
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {book.description || 'No detailed abstract recorded for this volume.'}
              </p>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-3">
              {isStaff ? (
                <>
                  <button
                    onClick={() => setCurrentPage('issue-return')}
                    id="details-issue-btn"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm flex items-center gap-2"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                    Issue This Book
                  </button>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-semibold text-sm transition-colors flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4 text-slate-500" />
                    Edit Record
                  </button>
                </>
              ) : isAvailable ? (
                <button
                  onClick={() => {
                    if (currentUser) {
                      reserveBook(book.bookId, currentUser.memberId);
                    } else {
                      setCurrentPage('login');
                    }
                  }}
                  id="details-reserve-btn"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-md shadow-blue-500/20 flex items-center gap-2"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  Borrow / Reserve Copy
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (currentUser) {
                      reserveBook(book.bookId, currentUser.memberId);
                    } else {
                      setCurrentPage('login');
                    }
                  }}
                  className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition-colors flex items-center gap-2"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  Join Reserve Waitlist (Queue)
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Circulation History for this Book */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Circulation History for This Title</h3>
          </div>
          <span className="text-xs text-slate-500">{bookTransactions.length} Total Recorded Loans</span>
        </div>

        {bookTransactions.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No past circulation transactions on record for this book ID.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Txn ID</th>
                  <th className="py-2.5 px-3">Borrower Member</th>
                  <th className="py-2.5 px-3">Issue Date</th>
                  <th className="py-2.5 px-3">Due Date</th>
                  <th className="py-2.5 px-3">Return Date</th>
                  <th className="py-2.5 px-3">Fine</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookTransactions.map(tx => (
                  <tr key={tx.txnId} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-mono text-slate-500">{tx.txnId}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {tx.memberName} <span className="font-normal text-slate-400">({tx.memberId})</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{tx.issueDate}</td>
                    <td className="py-2.5 px-3 text-slate-600">{tx.dueDate}</td>
                    <td className="py-2.5 px-3 text-slate-900 font-semibold">{tx.returnDate || '—'}</td>
                    <td className="py-2.5 px-3 text-slate-600">${tx.fine.toFixed(2)}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.status === 'returned'
                          ? 'bg-slate-100 text-slate-700'
                          : tx.status === 'overdue'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {tx.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <BookModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        bookToEdit={book}
      />
    </div>
  );
};
