import React, { useState } from 'react';
import { useLibrary, PageId } from '../context/LibraryContext';
import { UserRole } from '../types';
import {
  BookOpen,
  Bell,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  LayoutDashboard,
  BookMarked,
  ArrowLeftRight,
  Users,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Cpu
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    currentPage,
    setCurrentPage,
    logout,
    switchRoleQuick,
    notifications,
    resetToSampleData,
    settings,
    openDocsTab,
  } = useLibrary();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  // Compute unread count for current user
  const unreadCount = notifications.filter(
    n => !n.read && (n.memberId === 'all' || (currentUser && n.memberId === currentUser.memberId))
  ).length;

  const navigate = (page: PageId) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  const getDashboardPage = (role?: UserRole): PageId => {
    if (role === 'admin') return 'admin-dashboard';
    if (role === 'librarian') return 'librarian-dashboard';
    return 'member-dashboard';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      {/* Top Demo Bar / Announcement */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-600 text-white">
              PROJECT PROTOTYPE
            </span>
            <span className="hidden sm:inline">Academic Year {settings.academicYear} | {settings.libraryName}</span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Quick Role Switcher for instant evaluator testing */}
            <span className="text-slate-400 text-[11px] hidden md:inline">Switch Role:</span>
            <div className="inline-flex items-center bg-slate-800 rounded-md p-0.5 border border-slate-700">
              <button
                onClick={() => switchRoleQuick('admin')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  currentUser?.role === 'admin'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Log in as Administrator (Dr. Eleanor Vance)"
              >
                Admin
              </button>
              <button
                onClick={() => switchRoleQuick('librarian')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  currentUser?.role === 'librarian'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Log in as Librarian (David Miller)"
              >
                Librarian
              </button>
              <button
                onClick={() => switchRoleQuick('member')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  currentUser?.role === 'member'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Log in as Student Member (Sophia Martinez)"
              >
                Member
              </button>
            </div>

            <button
              onClick={() => openDocsTab('report')}
              className="text-amber-400 hover:text-amber-300 text-[11px] font-semibold flex items-center gap-1 pl-2 border-l border-slate-700 transition-colors cursor-pointer"
              title="View Review 1 & 2 Technical Report, Schemas & Testing Docs"
            >
              <Cpu className="w-3 h-3" />
              <span>Tech Docs & Tests</span>
            </button>

            <button
              onClick={resetToSampleData}
              className="text-slate-400 hover:text-blue-400 text-[11px] flex items-center gap-1 pl-2 border-l border-slate-700 transition-colors"
              title="Reset state to initial sample records"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => navigate('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
            id="nav-brand"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 tracking-tight block leading-tight">
                Online Library
              </span>
              <span className="text-[11px] font-medium text-blue-600 uppercase tracking-wider block">
                Management System
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => navigate('home')}
              id="nav-home"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'home'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => navigate('catalogue')}
              id="nav-catalogue"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentPage === 'catalogue' || currentPage === 'book-details'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookMarked className="w-4 h-4" />
              Book Catalogue
            </button>

            {currentUser && (currentUser.role === 'admin' || currentUser.role === 'librarian') && (
              <>
                <button
                  onClick={() => navigate('issue-return')}
                  id="nav-issue-return"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    currentPage === 'issue-return'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  Issue & Return
                </button>

                <button
                  onClick={() => navigate('member-management')}
                  id="nav-members"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    currentPage === 'member-management'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Members
                </button>

                <button
                  onClick={() => navigate('reports')}
                  id="nav-reports"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    currentPage === 'reports'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Reports
                </button>
              </>
            )}

            {currentUser ? (
              <button
                onClick={() => navigate(getDashboardPage(currentUser.role))}
                id="nav-dashboard"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  currentPage.includes('dashboard')
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-blue-700 bg-blue-50 hover:bg-blue-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                {currentUser.role === 'admin'
                  ? 'Admin Dashboard'
                  : currentUser.role === 'librarian'
                  ? 'Librarian Desk'
                  : 'My Dashboard'}
              </button>
            ) : null}

            {/* Tech Docs & Reviewer Specs Button */}
            <button
              onClick={() => openDocsTab('report')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer ml-1"
              title="Technical Documentation, Database Schemas & Unit Testing Suite"
            >
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              <span>Tech Specs</span>
            </button>
          </nav>

          {/* Right Actions: Notifications & User Profile */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Notification Bell */}
            <button
              onClick={() => navigate('notifications')}
              id="nav-notifications-btn"
              className={`relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors ${
                currentPage === 'notifications' ? 'bg-blue-50 text-blue-700' : ''
              }`}
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile / Login */}
            {currentUser ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-900 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-blue-600 flex items-center justify-end gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {currentUser.role}
                  </div>
                </div>

                <button
                  onClick={logout}
                  id="nav-logout-btn"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('login')}
                id="nav-login-btn"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-sm transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => navigate('notifications')}
              className="relative p-2 rounded-lg text-slate-600"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="nav-mobile-toggle"
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <button
            onClick={() => navigate('home')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              currentPage === 'home' ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => navigate('catalogue')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              currentPage === 'catalogue' ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
            }`}
          >
            Book Catalogue
          </button>

          {currentUser && (currentUser.role === 'admin' || currentUser.role === 'librarian') && (
            <>
              <button
                onClick={() => navigate('issue-return')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  currentPage === 'issue-return' ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                }`}
              >
                Issue & Return
              </button>
              <button
                onClick={() => navigate('member-management')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  currentPage === 'member-management' ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                }`}
              >
                Member Management
              </button>
              <button
                onClick={() => navigate('reports')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  currentPage === 'reports' ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                }`}
              >
                Reports & Analytics
              </button>
            </>
          )}

          <button
            onClick={() => {
              openDocsTab('report');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-2"
          >
            <Cpu className="w-4 h-4 text-amber-700" />
            <span>Tech Docs, Tests & Schemas</span>
          </button>

          {currentUser ? (
            <>
              <button
                onClick={() => navigate(getDashboardPage(currentUser.role))}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white"
              >
                {currentUser.role === 'admin'
                  ? 'Admin Dashboard'
                  : currentUser.role === 'librarian'
                  ? 'Librarian Dashboard'
                  : 'Member Dashboard'}
              </button>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <div className="text-xs">
                  <span className="font-semibold block text-slate-800">{currentUser.name}</span>
                  <span className="text-slate-500 capitalize">{currentUser.role}</span>
                </div>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 text-xs text-rose-600 font-medium rounded-md hover:bg-rose-50"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => navigate('login')}
              className="w-full text-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold"
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </header>
  );
};
