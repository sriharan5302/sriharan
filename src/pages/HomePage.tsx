import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import {
  BookOpen,
  Search,
  ArrowLeftRight,
  Calculator,
  Users,
  Bell,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  BookMarked
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { setCurrentPage, books, members, transactions, currentUser, viewBookDetails } = useLibrary();

  const activeIssued = transactions.filter(t => t.status === 'active' || t.status === 'overdue').length;
  const featuredBooks = books.slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-white border-b border-slate-200/80 pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Next-Gen Academic Library Automation
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.15]">
                Manage Your Library <span className="text-blue-600">Smarter</span>.
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                A simple and user-friendly digital library platform that replaces cumbersome manual registers with automated cataloging, real-time book issuance, automatic overdue fine calculations, and member records.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setCurrentPage('catalogue')}
                  id="hero-explore-btn"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all transform active:scale-95"
                >
                  <Search className="w-5 h-5" />
                  Explore Books
                </button>

                {currentUser ? (
                  <button
                    onClick={() => {
                      if (currentUser.role === 'admin') setCurrentPage('admin-dashboard');
                      else if (currentUser.role === 'librarian') setCurrentPage('librarian-dashboard');
                      else setCurrentPage('member-dashboard');
                    }}
                    id="hero-dashboard-btn"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-800 border border-slate-300 font-semibold text-base hover:bg-slate-50 transition-all"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 text-blue-600" />
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentPage('login')}
                    id="hero-login-btn"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-800 border border-slate-300 font-semibold text-base hover:bg-slate-50 transition-all"
                  >
                    Login to Portal
                    <ArrowRight className="w-4 h-4 text-blue-600" />
                  </button>
                )}
              </div>

              {/* Trust/Metric Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900">{books.length}+</div>
                  <div className="text-xs text-slate-500 font-medium">Cataloged Titles</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600">{members.length}</div>
                  <div className="text-xs text-slate-500 font-medium">Active Members</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900">{activeIssued}</div>
                  <div className="text-xs text-slate-500 font-medium">Circulating Loans</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Quick Card Preview */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200/80 relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Library Terminal</span>
                </div>

                <div className="mt-4 space-y-3.5">
                  <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                        BK
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Designing Data-Intensive Apps</div>
                        <div className="text-[11px] text-slate-500">Martin Kleppmann &bull; CS-401</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      3 Copies In
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                        TX
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Overdue Fine Engine</div>
                        <div className="text-[11px] text-slate-500">Auto-applies $1.00/day fee</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                      Zero Manual Math
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
                        ID
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Role-Based Access</div>
                        <div className="text-[11px] text-slate-500">Admin, Librarian, Member</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                      Secured
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                    <CheckCircle2 className="w-4 h-4" /> System Operational
                  </div>
                  <button
                    onClick={() => setCurrentPage('catalogue')}
                    className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1"
                  >
                    View Books <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Showcase Grid: The 6 Key System Modules */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">Core Capabilities</h2>
          <h3 className="text-3xl font-extrabold text-slate-950">Everything Needed to Run a Modern Library</h3>
          <p className="text-slate-600 text-sm mt-2">
            Engineered specifically to solve real-world college library operational bottlenecks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1: Fast Book Search */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Fast Book Search</h4>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Instantly query titles, authors, categories, ISBNs, and shelf locations with zero latency and live availability counts.
            </p>
            <button
              onClick={() => setCurrentPage('catalogue')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              Search Catalogue &rarr;
            </button>
          </div>

          {/* Feature 2: Issue & Return */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <ArrowLeftRight className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Issue & Return</h4>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              One-click loan checkout, quick returns, borrowing limits enforcement, and renewal extensions without manual paper slips.
            </p>
            <button
              onClick={() => setCurrentPage('issue-return')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              Issue/Return Desk &rarr;
            </button>
          </div>

          {/* Feature 3: Fine Calculation */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Calculator className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Fine Calculation</h4>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Autonomous overdue fine calculator based on loan days elapsed, daily penalty rates, and transparent fee settlement records.
            </p>
            <button
              onClick={() => setCurrentPage('issue-return')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              Inspect Overdue Fines &rarr;
            </button>
          </div>

          {/* Feature 4: Member Management */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Member Management</h4>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Maintain full digital registers of students, faculty, librarians, and administrators with role permissions and suspension toggles.
            </p>
            <button
              onClick={() => setCurrentPage('member-management')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              Member Directory &rarr;
            </button>
          </div>

          {/* Feature 5: Notifications */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Bell className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Notifications & Alerts</h4>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Proactive alerts for upcoming due dates, overdue notices, book arrivals, and reservation pickup ready confirmations.
            </p>
            <button
              onClick={() => setCurrentPage('notifications')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              Notification Center &rarr;
            </button>
          </div>

          {/* Feature 6: Reports & Analytics */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Reports & Analytics</h4>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Visual insights on most borrowed books, category distribution, active circulation, return rates, and collected fines.
            </p>
            <button
              onClick={() => setCurrentPage('reports')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              View Circulation Charts &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* Featured Book Arrivals Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Featured Books & Textbooks</h3>
            <p className="text-xs text-slate-500">Popular reading materials available in the university library</p>
          </div>
          <button
            onClick={() => setCurrentPage('catalogue')}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
          >
            See All Books <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBooks.map(book => (
            <div
              key={book.bookId}
              className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {book.category}
                  </span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    book.copiesAvailable > 0
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {book.copiesAvailable > 0 ? `${book.copiesAvailable} Available` : 'Reserved/Out'}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 mb-1">
                  {book.title}
                </h4>
                <p className="text-xs text-slate-600 mb-2">by {book.author}</p>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                  {book.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">{book.bookId}</span>
                <button
                  onClick={() => viewBookDetails(book.bookId)}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* College Project Architecture Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-500/30">
              College Project Architecture
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold mb-3">
              Built to Demonstrate Modern Software Engineering Principles
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Features relational entity structures (BOOK, MEMBER, TRANSACTION, RESERVATION), validation layers, reactive UI updates, automated overdue fines calculation, and tiered role-based access control (Admin, Librarian, Member).
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setCurrentPage('login')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-sm transition-colors"
              >
                Launch Role-Based Login
              </button>
              <button
                onClick={() => setCurrentPage('reports')}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 font-semibold text-sm transition-colors border border-white/10"
              >
                Open Analytics Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
