/**
 * @file App.tsx
 * @description Main application entry point for the Online Library Management System (OLMS).
 * Configures global error boundaries, context provider, navigation router, and technical docs modal.
 */

import React from 'react';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TechnicalDocsModal } from './components/TechnicalDocsModal';

import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { LibrarianDashboard } from './pages/LibrarianDashboard';
import { MemberDashboard } from './pages/MemberDashboard';
import { BookCatalogue } from './pages/BookCatalogue';
import { BookDetailsPage } from './pages/BookDetailsPage';
import { IssueReturnPage } from './pages/IssueReturnPage';
import { MemberManagementPage } from './pages/MemberManagementPage';
import { ReportsPage } from './pages/ReportsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { Cpu, Activity } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    isDocsOpen,
    setIsDocsOpen,
    docsInitialTab,
    openDocsTab
  } = useLibrary();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'login':
        return <LoginPage />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'librarian-dashboard':
        return <LibrarianDashboard />;
      case 'member-dashboard':
        return <MemberDashboard />;
      case 'catalogue':
        return <BookCatalogue />;
      case 'book-details':
        return <BookDetailsPage />;
      case 'issue-return':
        return <IssueReturnPage />;
      case 'member-management':
        return <MemberManagementPage />;
      case 'reports':
        return <ReportsPage />;
      case 'notifications':
        return <NotificationsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-slate-900 font-sans antialiased relative">
      <Navbar />

      {/* Page Content wrapped in sub-tree ErrorBoundary */}
      <main className="flex-1">
        <ErrorBoundary
          key={currentPage}
          sectionName={`Page View [${currentPage}]`}
          onReset={() => setCurrentPage('home')}
        >
          {renderCurrentPage()}
        </ErrorBoundary>
      </main>

      <Footer />
      <ToastContainer />

      {/* Technical Architecture & Review Documentation Modal */}
      <TechnicalDocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
        defaultTab={docsInitialTab}
      />

      {/* Floating Quick Action for Project Reviewers / Examiners */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        <button
          onClick={() => openDocsTab('tests')}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-lg hover:shadow-xl transition-all border border-slate-700 cursor-pointer"
          title="Open Technical Docs & Live Test Runner"
        >
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Run Tests</span>
        </button>

        <button
          onClick={() => openDocsTab('report')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-lg hover:shadow-xl transition-all shadow-blue-500/25 cursor-pointer"
          title="Review 1 & 2 Technical Report & Architecture"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Tech Specs & Docs</span>
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary sectionName="Root Application Container">
      <LibraryProvider>
        <MainContent />
      </LibraryProvider>
    </ErrorBoundary>
  );
}
