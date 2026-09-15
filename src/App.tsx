import React from 'react';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';

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

const MainContent: React.FC = () => {
  const { currentPage } = useLibrary();

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
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-slate-900 font-sans antialiased">
      <Navbar />
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <LibraryProvider>
      <MainContent />
    </LibraryProvider>
  );
}
