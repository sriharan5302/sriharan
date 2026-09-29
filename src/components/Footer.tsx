import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookOpen, Shield, Code, Database, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage, settings, books, members, openDocsTab } = useLibrary();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Purpose */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-bold text-base leading-tight">
                  {settings.libraryName}
                </h3>
                <p className="text-xs text-blue-400">Digital Automation Suite</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Replacing manual library registers with a modern, computerized inventory, circulation, fine computation, and member tracking system.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Database Online &bull; {books.length} Titles &bull; {members.length} Registered Members
            </div>
          </div>

          {/* Col 2: Quick Navigation */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setCurrentPage('home')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Home & Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('catalogue')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Book Catalogue
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('issue-return')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Issue & Return Desk
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('member-management')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Member Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('reports')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Reports & Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Project Info */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">College Project Scope</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Entities: BOOK, MEMBER, TRANSACTION, RESERVATION</span>
              </li>
              <li className="flex items-center gap-2">
                <Code className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Full-Stack Architecture Ready (Node/Express API)</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400 shrink-0" />
                <span>3-Tier RBAC: Admin, Librarian, Student Member</span>
              </li>
              <li className="text-slate-500 pt-1">
                Automatic overdue fine calculator (${settings.finePerDay.toFixed(2)}/day), max {settings.maxBorrowDays} day loan period.
              </li>
              <li className="pt-2">
                <button
                  onClick={() => openDocsTab('report')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                >
                  <span>Review Report, Unit Tests & Specs</span>
                  <span>&rarr;</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Operating Hours & Support */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Library Desk & Hours</h4>
            <div className="text-xs space-y-1.5 text-slate-400">
              <p><strong className="text-slate-300">Monday – Friday:</strong> 8:00 AM – 9:00 PM</p>
              <p><strong className="text-slate-300">Saturday:</strong> 9:00 AM – 6:00 PM</p>
              <p><strong className="text-slate-300">Sunday & Holidays:</strong> 10:00 AM – 4:00 PM</p>
              <div className="pt-2">
                <p className="text-slate-300 font-medium">Circulation Desk Helpline:</p>
                <p className="text-blue-400">circulation@{settings.libraryName.toLowerCase().replace(/\s+/g, '')}.edu</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Online Library Management System. Academic College Project Prototype.
          </div>
          <div className="flex items-center gap-1">
            <span>Built for higher education library automation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
