import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import {
  BarChart3,
  BookOpen,
  ArrowLeftRight,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Users,
  Download,
  Printer,
  Award,
  BookMarked
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const {
    books,
    members,
    transactions,
    settings,
    showToast,
  } = useLibrary();

  // Metrics
  const totalBookCopies = books.reduce((acc, b) => acc + b.totalCopies, 0);
  const totalTitles = books.length;
  const issuedLoans = transactions.filter(t => t.status === 'active' || t.status === 'overdue').length;
  const returnedLoans = transactions.filter(t => t.status === 'returned').length;
  const overdueLoans = transactions.filter(t => t.status === 'overdue').length;
  const activeMembers = members.filter(m => m.status === 'active').length;
  
  // Fines
  const fineCollected = transactions
    .filter(t => t.status === 'returned' && t.fine > 0)
    .reduce((acc, t) => acc + t.fine, 0);
  const finePending = transactions
    .filter(t => t.status === 'overdue')
    .reduce((acc, t) => acc + t.fine, 0);
  const totalFineRevenue = fineCollected + finePending;

  // Category Breakdown
  const categoryCounts: Record<string, number> = {};
  books.forEach(b => {
    categoryCounts[b.category] = (categoryCounts[b.category] || 0) + b.totalCopies;
  });
  const categoriesSorted = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);

  // Most Borrowed Books (Calculated from transactions count per bookId)
  const bookBorrowCount: Record<string, { count: number; title: string; author: string }> = {};
  transactions.forEach(t => {
    if (!bookBorrowCount[t.bookId]) {
      const book = books.find(b => b.bookId === t.bookId);
      bookBorrowCount[t.bookId] = {
        count: 0,
        title: t.bookTitle || book?.title || 'Unknown Title',
        author: book?.author || 'Various',
      };
    }
    bookBorrowCount[t.bookId].count += 1;
  });

  const mostBorrowedList = Object.entries(bookBorrowCount)
    .map(([bookId, data]) => ({ bookId, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['TxnID', 'BookID', 'BookTitle', 'MemberID', 'MemberName', 'IssueDate', 'DueDate', 'ReturnDate', 'Fine', 'Status'];
    const rows = transactions.map(t => [
      t.txnId,
      t.bookId,
      `"${t.bookTitle?.replace(/"/g, '""') || ''}"`,
      t.memberId,
      `"${t.memberName?.replace(/"/g, '""') || ''}"`,
      t.issueDate,
      t.dueDate,
      t.returnDate || '',
      t.fine.toFixed(2),
      t.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `library_circulation_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Circulation report exported to CSV successfully.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs print:border-none print:shadow-none">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            Statistical Audit &amp; Performance
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Library Analytics &amp; Circulation Reports
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time audit metrics on inventory utilization, member loan circulation, and collected overdue penalties.
          </p>
        </div>

        <div className="flex items-center gap-3 print:hidden">
          <button
            onClick={handleExportCSV}
            id="export-csv-btn"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-blue-600" />
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            id="print-report-btn"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
        </div>
      </div>

      {/* KPI Cards Grid (7 Metric Cards required in prompt) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* 1. Total Books */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Books</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalBookCopies}</div>
          <span className="text-[10px] text-slate-400">{totalTitles} titles</span>
        </div>

        {/* 2. Issued Books */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Issued Books</span>
          <div className="text-2xl font-extrabold text-blue-600 mt-1">{issuedLoans}</div>
          <span className="text-[10px] text-slate-400">In circulation</span>
        </div>

        {/* 3. Returned Books */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Returned</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{returnedLoans}</div>
          <span className="text-[10px] text-slate-400">Completed loans</span>
        </div>

        {/* 4. Overdue Books */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Overdue</span>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">{overdueLoans}</div>
          <span className="text-[10px] text-rose-500">Requires action</span>
        </div>

        {/* 5. Most Borrowed Count */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Top Title Loans</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {mostBorrowedList[0]?.count || 0}
          </div>
          <span className="text-[10px] text-slate-400">Max checkouts</span>
        </div>

        {/* 6. Active Members */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Active Members</span>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">{activeMembers}</div>
          <span className="text-[10px] text-slate-400">Verified patrons</span>
        </div>

        {/* 7. Fine Collection */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Fine Collection</span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">${totalFineRevenue.toFixed(2)}</div>
          <span className="text-[10px] text-slate-400">${fineCollected.toFixed(2)} settled</span>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Category Breakdown (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Collection Holdings by Discipline</h3>
              <p className="text-xs text-slate-500">Distribution of catalog volumes across academic departments</p>
            </div>
            <span className="text-xs font-semibold text-slate-400">{categoriesSorted.length} Categories</span>
          </div>

          <div className="space-y-4">
            {categoriesSorted.map(([category, count]) => {
              const percentage = Math.round((count / totalBookCopies) * 100);
              return (
                <div key={category} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-800 font-semibold">{category}</span>
                    <span className="text-slate-500 font-mono">{count} volumes ({percentage}%)</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Borrowed Books Ranking (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  Most Borrowed Books
                </h3>
                <p className="text-xs text-slate-500">Top titles by checkout frequency</p>
              </div>
            </div>

            <div className="space-y-3">
              {mostBorrowedList.map((item, idx) => (
                <div
                  key={item.bookId}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center gap-3"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    idx === 0
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : idx === 1
                      ? 'bg-slate-200 text-slate-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    #{idx + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{item.author}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[11px] font-bold">
                      {item.count} loans
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            * Circulation rank recalculated dynamically upon each transaction commit.
          </div>
        </div>

      </div>

      {/* Circulation Efficiency & Financial Dues Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-2">Financial Overdue Dues &amp; Fine Summary</h3>
        <p className="text-xs text-slate-500 mb-6">
          Record of late penalties computed per academic institution regulations (${settings.finePerDay.toFixed(2)}/day rate)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <span className="text-xs font-semibold text-emerald-800 uppercase block">Settled Fines</span>
            <div className="text-2xl font-bold text-emerald-700 mt-1">${fineCollected.toFixed(2)}</div>
            <p className="text-[11px] text-emerald-600 mt-1">Collected and deposited into library book replacement fund</p>
          </div>

          <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
            <span className="text-xs font-semibold text-rose-800 uppercase block">Outstanding Fines</span>
            <div className="text-2xl font-bold text-rose-700 mt-1">${finePending.toFixed(2)}</div>
            <p className="text-[11px] text-rose-600 mt-1">Pending collection on currently overdue volumes</p>
          </div>

          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <span className="text-xs font-semibold text-blue-800 uppercase block">Circulation Rate</span>
            <div className="text-2xl font-bold text-blue-700 mt-1">
              {Math.round((issuedLoans / totalBookCopies) * 100)}%
            </div>
            <p className="text-[11px] text-blue-600 mt-1">Percentage of physical catalogue currently reading active</p>
          </div>
        </div>
      </div>
    </div>
  );
};
