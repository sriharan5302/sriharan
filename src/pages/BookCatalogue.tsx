import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookModal } from '../components/BookModal';
import { Book } from '../types';
import {
  Search,
  Filter,
  BookPlus,
  BookOpen,
  LayoutGrid,
  List,
  CheckCircle2,
  XCircle,
  BookmarkPlus,
  ArrowRight,
  Eye,
  SlidersHorizontal,
  BookmarkCheck
} from 'lucide-react';

export const BookCatalogue: React.FC = () => {
  const {
    books,
    currentUser,
    viewBookDetails,
    reserveBook,
    setCurrentPage,
    reservations,
  } = useLibrary();

  const [searchTitle, setSearchTitle] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'low' | 'out'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Book modal state
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);

  // Derive unique categories
  const categories = ['All', ...Array.from(new Set(books.map(b => b.category)))];

  // Filtering
  const filteredBooks = books.filter(book => {
    const matchesTitle = book.title.toLowerCase().includes(searchTitle.toLowerCase()) ||
                         book.isbn.toLowerCase().includes(searchTitle.toLowerCase()) ||
                         book.bookId.toLowerCase().includes(searchTitle.toLowerCase());
    const matchesAuthor = book.author.toLowerCase().includes(searchAuthor.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;

    let matchesAvailability = true;
    if (availabilityFilter === 'available') {
      matchesAvailability = book.copiesAvailable > 0;
    } else if (availabilityFilter === 'low') {
      matchesAvailability = book.copiesAvailable > 0 && book.copiesAvailable <= 1;
    } else if (availabilityFilter === 'out') {
      matchesAvailability = book.copiesAvailable === 0;
    }

    return matchesTitle && matchesAuthor && matchesCategory && matchesAvailability;
  });

  const isStaff = currentUser?.role === 'admin' || currentUser?.role === 'librarian';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <span>Official Library Collection</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Book Catalogue &amp; Repository
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse through textbook volumes, search by title, author, or discipline, and check real-time availability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View mode toggle */}
          <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {isStaff && (
            <button
              onClick={() => {
                setBookToEdit(null);
                setIsBookModalOpen(true);
              }}
              id="catalogue-add-book-btn"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold transition-colors shadow-sm"
            >
              <BookPlus className="w-4 h-4" />
              Add New Title
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar (Search by Title, Author, Category, Availability) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Title / ISBN */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              id="filter-title-input"
              value={searchTitle}
              onChange={e => setSearchTitle(e.target.value)}
              placeholder="Search by Title, ISBN, ID..."
              className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden bg-slate-50/50"
            />
          </div>

          {/* Search Author */}
          <div className="relative">
            <input
              type="text"
              id="filter-author-input"
              value={searchAuthor}
              onChange={e => setSearchAuthor(e.target.value)}
              placeholder="Filter by Author name..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden bg-slate-50/50"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              id="filter-category-select"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden bg-slate-50/50"
            >
              {categories.map(c => (
                <option key={c} value={c}>Category: {c}</option>
              ))}
            </select>
          </div>

          {/* Availability Dropdown */}
          <div>
            <select
              id="filter-availability-select"
              value={availabilityFilter}
              onChange={e => setAvailabilityFilter(e.target.value as any)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden bg-slate-50/50"
            >
              <option value="all">Availability: All Copies</option>
              <option value="available">Available in Stacks Only (&gt; 0)</option>
              <option value="low">Low Stock (&le; 1)</option>
              <option value="out">Checked Out / Waitlist Only (0)</option>
            </select>
          </div>
        </div>

        {/* Results Counter & Reset */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-800">{filteredBooks.length}</strong> books matching current filters
          </div>
          {(searchTitle || searchAuthor || selectedCategory !== 'All' || availabilityFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTitle('');
                setSearchAuthor('');
                setSelectedCategory('All');
                setAvailabilityFilter('all');
              }}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Book List: Grid Mode */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map(book => {
            const isAvailable = book.copiesAvailable > 0;
            return (
              <div
                key={book.bookId}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg hover:border-blue-300 transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                      {book.category}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        isAvailable
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {isAvailable ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          {book.copiesAvailable} in Stock
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          All Checked Out
                        </>
                      )}
                    </span>
                  </div>

                  <h3
                    onClick={() => viewBookDetails(book.bookId)}
                    className="text-base font-bold text-slate-900 group-hover:text-blue-600 cursor-pointer transition-colors leading-snug line-clamp-2"
                  >
                    {book.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 mb-3">by {book.author}</p>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {book.description}
                  </p>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-[11px] text-slate-600 font-mono mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Book ID:</span>
                      <span className="font-semibold text-slate-700">{book.bookId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">ISBN:</span>
                      <span className="text-slate-700">{book.isbn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Location:</span>
                      <span className="text-slate-700 font-sans">{book.shelfLocation}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => viewBookDetails(book.bookId)}
                    className="px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Details
                  </button>

                  <div className="flex items-center gap-2">
                    {isStaff ? (
                      <button
                        onClick={() => {
                          setBookToEdit(book);
                          setIsBookModalOpen(true);
                        }}
                        className="px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                      >
                        Edit
                      </button>
                    ) : null}

                    {isAvailable ? (
                      <button
                        onClick={() => {
                          if (isStaff) {
                            setCurrentPage('issue-return');
                          } else if (currentUser) {
                            reserveBook(book.bookId, currentUser.memberId);
                          } else {
                            setCurrentPage('login');
                          }
                        }}
                        className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1"
                      >
                        {isStaff ? 'Issue to Member' : 'Reserve Copy'}
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
                        className="px-3.5 py-2 text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-xl transition-colors flex items-center gap-1"
                      >
                        <BookmarkPlus className="w-3.5 h-3.5" /> Join Waitlist
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Book List: Table Mode */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Book ID</th>
                  <th className="py-3 px-4">Title &amp; Author</th>
                  <th className="py-3 px-4">ISBN</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Copies</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBooks.map(book => {
                  const isAvailable = book.copiesAvailable > 0;
                  return (
                    <tr key={book.bookId} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-slate-500 font-semibold">{book.bookId}</td>
                      <td className="py-3 px-4">
                        <span
                          onClick={() => viewBookDetails(book.bookId)}
                          className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer block text-sm"
                        >
                          {book.title}
                        </span>
                        <span className="text-[11px] text-slate-500">by {book.author} ({book.publishedYear})</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">{book.isbn}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                          {book.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{book.shelfLocation}</td>
                      <td className="py-3 px-4">
                        <span className={`font-bold ${isAvailable ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {book.copiesAvailable}
                        </span>
                        <span className="text-slate-400"> / {book.totalCopies}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isAvailable
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isAvailable ? 'Available' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => viewBookDetails(book.bookId)}
                          className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          Details
                        </button>
                        {isAvailable ? (
                          <button
                            onClick={() => {
                              if (isStaff) {
                                setCurrentPage('issue-return');
                              } else if (currentUser) {
                                reserveBook(book.bookId, currentUser.memberId);
                              } else {
                                setCurrentPage('login');
                              }
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                          >
                            {isStaff ? 'Issue' : 'Reserve'}
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
                            className="px-2.5 py-1 text-[11px] font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"
                          >
                            Waitlist
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredBooks.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No books found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords, clearing selected category filters, or searching by ISBN.
          </p>
        </div>
      )}

      {/* Book Add/Edit Modal */}
      <BookModal
        isOpen={isBookModalOpen}
        onClose={() => {
          setIsBookModalOpen(false);
          setBookToEdit(null);
        }}
        bookToEdit={bookToEdit}
      />
    </div>
  );
};
