import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookModal } from '../components/BookModal';
import { MemberModal } from '../components/MemberModal';
import { Book } from '../types';
import {
  BookPlus,
  ArrowLeftRight,
  Search,
  Users,
  DollarSign,
  BookmarkCheck,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertCircle,
  Undo2,
  Calendar,
  Check,
  X
} from 'lucide-react';

export const LibrarianDashboard: React.FC = () => {
  const {
    books,
    transactions,
    reservations,
    members,
    setCurrentPage,
    deleteBook,
    returnBook,
    fulfillReservation,
    cancelReservation,
    settleFine,
    viewBookDetails,
  } = useLibrary();

  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedBookToEdit, setSelectedBookToEdit] = useState<Book | null>(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [bookSearchQuery, setBookSearchQuery] = useState('');

  // Overdue transactions requiring fine management
  const overdueTransactions = transactions.filter(t => t.status === 'overdue');
  const pendingReservations = reservations.filter(r => r.status === 'pending' || r.status === 'ready');

  const filteredBooks = books.filter(b =>
    b.title.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
    b.author.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
    b.isbn.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
    b.bookId.toLowerCase().includes(bookSearchQuery.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            Circulation &amp; Catalog Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Librarian Operations Desk
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Fast checkout, returns, inventory cataloging, book reservations, and fine waivers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setSelectedBookToEdit(null);
              setIsBookModalOpen(true);
            }}
            id="lib-add-book-btn"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold transition-colors shadow-sm"
          >
            <BookPlus className="w-4 h-4" />
            Add New Book
          </button>
          <button
            onClick={() => setCurrentPage('issue-return')}
            id="lib-issue-return-btn"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-sm font-semibold transition-colors shadow-xs"
          >
            <ArrowLeftRight className="w-4 h-4 text-blue-600" />
            Issue / Return Book
          </button>
        </div>
      </div>

      {/* Quick Action Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => {
            setSelectedBookToEdit(null);
            setIsBookModalOpen(true);
          }}
          className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 text-center transition-all group"
        >
          <BookPlus className="w-5 h-5 text-blue-600 mx-auto mb-1.5" />
          <span className="text-xs font-bold text-slate-900 block">Add Book</span>
          <span className="text-[10px] text-slate-500">Register copy</span>
        </button>

        <button
          onClick={() => setCurrentPage('issue-return')}
          className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 text-center transition-all group"
        >
          <ArrowLeftRight className="w-5 h-5 text-indigo-600 mx-auto mb-1.5" />
          <span className="text-xs font-bold text-slate-900 block">Issue / Return</span>
          <span className="text-[10px] text-slate-500">Circulation desk</span>
        </button>

        <button
          onClick={() => setCurrentPage('catalogue')}
          className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 text-center transition-all group"
        >
          <Search className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
          <span className="text-xs font-bold text-slate-900 block">Search Books</span>
          <span className="text-[10px] text-slate-500">Find in stacks</span>
        </button>

        <button
          onClick={() => setCurrentPage('member-management')}
          className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 text-center transition-all group"
        >
          <Users className="w-5 h-5 text-purple-600 mx-auto mb-1.5" />
          <span className="text-xs font-bold text-slate-900 block">Members</span>
          <span className="text-[10px] text-slate-500">Manage records</span>
        </button>

        <button
          onClick={() => {
            const el = document.getElementById('fines-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 text-center transition-all group"
        >
          <DollarSign className="w-5 h-5 text-amber-600 mx-auto mb-1.5" />
          <span className="text-xs font-bold text-slate-900 block">Manage Fines</span>
          <span className="text-[10px] text-slate-500">{overdueTransactions.length} pending</span>
        </button>

        <button
          onClick={() => setCurrentPage('reports')}
          className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 text-center transition-all group"
        >
          <BarChart3 className="w-5 h-5 text-blue-600 mx-auto mb-1.5" />
          <span className="text-xs font-bold text-slate-900 block">Reports</span>
          <span className="text-[10px] text-slate-500">Analytics &amp; print</span>
        </button>
      </div>

      {/* Book Search & Quick Actions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Catalogue Quick Search &amp; Operations</h3>
            <p className="text-xs text-slate-500">Update, restock, or remove titles from library stacks</p>
          </div>
          <div className="w-full sm:w-72 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={bookSearchQuery}
              onChange={e => setBookSearchQuery(e.target.value)}
              placeholder="Search by Title, Author, ISBN..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Book ID</th>
                <th className="py-2.5 px-3">Title &amp; Author</th>
                <th className="py-2.5 px-3">ISBN</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Available / Total</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBooks.map(book => (
                <tr key={book.bookId} className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-3 font-mono text-slate-500">{book.bookId}</td>
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-900">{book.title}</div>
                    <div className="text-[11px] text-slate-500">{book.author}</div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{book.isbn}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                      {book.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`font-semibold ${book.copiesAvailable > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {book.copiesAvailable}
                    </span>
                    <span className="text-slate-400"> / {book.totalCopies}</span>
                  </td>
                  <td className="py-2.5 px-3 text-right space-x-1">
                    <button
                      onClick={() => viewBookDetails(book.bookId)}
                      className="px-2 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setSelectedBookToEdit(book);
                        setIsBookModalOpen(true);
                      }}
                      className="px-2 py-1 text-[11px] font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteBook(book.bookId)}
                      className="px-2 py-1 text-[11px] font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 text-right">
          <button
            onClick={() => setCurrentPage('catalogue')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Explore Complete Book Catalogue &rarr;
          </button>
        </div>
      </div>

      {/* Grid: Pending Reservations & Overdue Fines Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Manage Reservations (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Member Book Reservations</h3>
              <p className="text-xs text-slate-500">Hold requests queued by patrons</p>
            </div>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800">
              {pendingReservations.length} Active
            </span>
          </div>

          {pendingReservations.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No pending reservations in queue.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingReservations.map(res => (
                <div
                  key={res.reservationId}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{res.bookTitle}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        res.status === 'ready' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {res.status === 'ready' ? 'Ready for Pickup' : 'Queued'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Reserved by: <span className="font-semibold text-slate-700">{res.memberName}</span> ({res.memberId}) on {res.requestDate}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fulfillReservation(res.reservationId)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1"
                      title="Issue book to this reserved member"
                    >
                      <Check className="w-3.5 h-3.5" /> Issue Book
                    </button>
                    <button
                      onClick={() => cancelReservation(res.reservationId)}
                      className="px-2 py-1.5 text-xs text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Cancel reservation"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Manage Fines (6 Cols) */}
        <div id="fines-section" className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Overdue Fines Desk</h3>
              <p className="text-xs text-slate-500">Collect dues or waive fines for returned or overdue items</p>
            </div>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800">
              {overdueTransactions.length} Delinquent
            </span>
          </div>

          {overdueTransactions.length === 0 ? (
            <div className="py-8 text-center text-emerald-600 text-xs flex flex-col items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              All current loans are within their due dates!
            </div>
          ) : (
            <div className="space-y-3">
              {overdueTransactions.map(tx => (
                <div
                  key={tx.txnId}
                  className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">{tx.bookTitle}</div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Borrower: <span className="font-semibold text-slate-800">{tx.memberName}</span> ({tx.memberId})
                    </div>
                    <div className="text-[11px] text-rose-600 font-semibold mt-0.5">
                      Due date: {tx.dueDate} &bull; Accrued fine: ${tx.fine.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => returnBook(tx.txnId)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Undo2 className="w-3.5 h-3.5" /> Return Book
                    </button>
                    <button
                      onClick={() => settleFine(tx.txnId)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors"
                      title="Settle or waive fine"
                    >
                      Clear Fine
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Modals */}
      <BookModal
        isOpen={isBookModalOpen}
        onClose={() => {
          setIsBookModalOpen(false);
          setSelectedBookToEdit(null);
        }}
        bookToEdit={selectedBookToEdit}
      />
      <MemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
      />
    </div>
  );
};
