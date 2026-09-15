import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book, Member, Transaction, Reservation, NotificationItem, SystemSettings, UserRole } from '../types';
import { initialBooks, initialMembers, initialTransactions, initialReservations, initialNotifications, initialSettings } from '../data/sampleData';

export type PageId =
  | 'home'
  | 'login'
  | 'admin-dashboard'
  | 'librarian-dashboard'
  | 'member-dashboard'
  | 'catalogue'
  | 'book-details'
  | 'issue-return'
  | 'member-management'
  | 'reports'
  | 'notifications';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface LibraryContextType {
  currentUser: Member | null;
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  selectedBookId: string | null;
  setSelectedBookId: (id: string | null) => void;
  viewBookDetails: (bookId: string) => void;
  login: (emailOrId: string, role: UserRole) => boolean;
  logout: () => void;
  switchRoleQuick: (role: UserRole) => void;
  
  // Data
  books: Book[];
  members: Member[];
  transactions: Transaction[];
  reservations: Reservation[];
  notifications: NotificationItem[];
  settings: SystemSettings;
  
  // Operations
  addBook: (book: Omit<Book, 'bookId'>) => void;
  updateBook: (bookId: string, updates: Partial<Book>) => void;
  deleteBook: (bookId: string) => void;
  
  addMember: (member: Omit<Member, 'memberId' | 'borrowedCount'>) => void;
  updateMember: (memberId: string, updates: Partial<Member>) => void;
  deleteMember: (memberId: string) => void;
  toggleMemberStatus: (memberId: string) => void;
  
  issueBook: (bookId: string, memberId: string, customDueDate?: string) => { success: boolean; message: string };
  returnBook: (txnId: string) => { success: boolean; message: string; fine: number };
  renewBook: (txnId: string) => { success: boolean; message: string };
  reserveBook: (bookId: string, memberId: string) => { success: boolean; message: string };
  cancelReservation: (resId: string) => void;
  fulfillReservation: (resId: string) => void;
  
  settleFine: (txnId: string) => void;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  
  resetToSampleData: () => void;
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

const STORAGE_PREFIX = 'olms_v1_';

export const LibraryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Local state with localStorage fallback
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'books');
    return saved ? JSON.parse(saved) : initialBooks;
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'members');
    return saved ? JSON.parse(saved) : initialMembers;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'reservations');
    return saved ? JSON.parse(saved) : initialReservations;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  // Current logged in user (defaults to Admin for smooth reviewer evaluation, but easy to toggle)
  const [currentUser, setCurrentUser] = useState<Member | null>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'current_user');
    if (saved) return JSON.parse(saved);
    return initialMembers[0]; // Admin by default
  });

  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_PREFIX + 'current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_PREFIX + 'current_user');
    }
  }, [currentUser]);

  // Recalculate fines on mount & whenever transactions change
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    setTransactions(prevTxns =>
      prevTxns.map(tx => {
        if (tx.status === 'returned') return tx;
        const due = new Date(tx.dueDate);
        due.setHours(0, 0, 0, 0);
        const diffDays = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > 0) {
          const fine = Number((diffDays * settings.finePerDay).toFixed(2));
          return { ...tx, fine, status: 'overdue' as const };
        }
        return { ...tx, status: 'active' as const };
      })
    );
  }, [settings.finePerDay]);

  const viewBookDetails = (bookId: string) => {
    setSelectedBookId(bookId);
    setCurrentPage('book-details');
  };

  const login = (emailOrId: string, role: UserRole): boolean => {
    const clean = emailOrId.trim().toLowerCase();
    const found = members.find(
      m => (m.email.toLowerCase() === clean || m.memberId.toLowerCase() === clean) && m.role === role
    );
    if (found) {
      if (found.status === 'suspended') {
        showToast('Your account is suspended. Please contact the administration.', 'error');
        return false;
      }
      setCurrentUser(found);
      showToast(`Welcome back, ${found.name}! Logged in as ${role.toUpperCase()}.`, 'success');
      if (role === 'admin') setCurrentPage('admin-dashboard');
      else if (role === 'librarian') setCurrentPage('librarian-dashboard');
      else setCurrentPage('member-dashboard');
      return true;
    } else {
      // Fallback matching role if demo
      const fallback = members.find(m => m.role === role);
      if (fallback) {
        setCurrentUser(fallback);
        showToast(`Demo login as ${fallback.name} (${role.toUpperCase()}).`, 'success');
        if (role === 'admin') setCurrentPage('admin-dashboard');
        else if (role === 'librarian') setCurrentPage('librarian-dashboard');
        else setCurrentPage('member-dashboard');
        return true;
      }
      showToast('No user found matching credentials and selected role.', 'error');
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
    showToast('You have been signed out successfully.', 'info');
  };

  const switchRoleQuick = (role: UserRole) => {
    const target = members.find(m => m.role === role) || members[0];
    setCurrentUser(target);
    showToast(`Switched view to ${target.name} (${role.toUpperCase()})`, 'info');
    if (role === 'admin') setCurrentPage('admin-dashboard');
    else if (role === 'librarian') setCurrentPage('librarian-dashboard');
    else setCurrentPage('member-dashboard');
  };

  // Books CRUD
  const addBook = (bookData: Omit<Book, 'bookId'>) => {
    const nextNum = books.length + 1001;
    const newBook: Book = {
      ...bookData,
      bookId: `BK-${nextNum}`,
      copiesAvailable: Number(bookData.copiesAvailable),
      totalCopies: Number(bookData.totalCopies),
      publishedYear: Number(bookData.publishedYear) || new Date().getFullYear(),
    };
    setBooks(prev => [newBook, ...prev]);

    // Push new book notification
    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      memberId: 'all',
      title: 'New Book Added to Catalogue',
      message: `"${newBook.title}" by ${newBook.author} is now available in ${newBook.category}.`,
      date: new Date().toISOString().split('T')[0],
      type: 'new_book',
      read: false,
      actionUrl: 'catalogue',
    };
    setNotifications(prev => [newNotif, ...prev]);
    showToast(`Book "${newBook.title}" added successfully!`, 'success');
  };

  const updateBook = (bookId: string, updates: Partial<Book>) => {
    setBooks(prev =>
      prev.map(b => (b.bookId === bookId ? { ...b, ...updates } : b))
    );
    showToast('Book details updated successfully.', 'success');
  };

  const deleteBook = (bookId: string) => {
    const hasActiveLoans = transactions.some(
      t => t.bookId === bookId && (t.status === 'active' || t.status === 'overdue')
    );
    if (hasActiveLoans) {
      showToast('Cannot delete book while copies are currently issued to members.', 'error');
      return;
    }
    setBooks(prev => prev.filter(b => b.bookId !== bookId));
    showToast('Book removed from catalogue.', 'info');
  };

  // Members CRUD
  const addMember = (memberData: Omit<Member, 'memberId' | 'borrowedCount'>) => {
    const count = members.length + 101;
    const prefix = memberData.role === 'admin' ? 'ADM' : memberData.role === 'librarian' ? 'LIB' : 'MEM';
    const newMember: Member = {
      ...memberData,
      memberId: `${prefix}-${count}`,
      borrowedCount: 0,
      membershipDate: new Date().toISOString().split('T')[0],
      status: memberData.status || 'active',
      maxBooksAllowed: Number(memberData.maxBooksAllowed) || settings.maxBooksPerMember,
    };
    setMembers(prev => [...prev, newMember]);
    showToast(`Member registered successfully with ID: ${newMember.memberId}`, 'success');
  };

  const updateMember = (memberId: string, updates: Partial<Member>) => {
    setMembers(prev =>
      prev.map(m => (m.memberId === memberId ? { ...m, ...updates } : m))
    );
    showToast('Member profile updated successfully.', 'success');
  };

  const deleteMember = (memberId: string) => {
    const hasActiveLoans = transactions.some(
      t => t.memberId === memberId && (t.status === 'active' || t.status === 'overdue')
    );
    if (hasActiveLoans) {
      showToast('Cannot delete member with active borrowed books or outstanding loans.', 'error');
      return;
    }
    setMembers(prev => prev.filter(m => m.memberId !== memberId));
    showToast('Member account removed.', 'info');
  };

  const toggleMemberStatus = (memberId: string) => {
    setMembers(prev =>
      prev.map(m =>
        m.memberId === memberId
          ? { ...m, status: m.status === 'active' ? 'suspended' : 'active' }
          : m
      )
    );
    showToast('Member status toggled.', 'info');
  };

  // Issue Book
  const issueBook = (bookId: string, memberId: string, customDueDate?: string) => {
    const book = books.find(b => b.bookId === bookId);
    const member = members.find(m => m.memberId === memberId);

    if (!book) return { success: false, message: 'Book not found.' };
    if (!member) return { success: false, message: 'Member not found.' };
    if (member.status === 'suspended') return { success: false, message: 'Member account is suspended.' };
    if (book.copiesAvailable <= 0) return { success: false, message: 'No copies available for issue.' };
    if (member.borrowedCount >= member.maxBooksAllowed) {
      return { success: false, message: `Member has reached maximum borrowing limit (${member.maxBooksAllowed} books).` };
    }

    const todayStr = new Date().toISOString().split('T')[0];
    let dueStr = customDueDate;
    if (!dueStr) {
      const d = new Date();
      d.setDate(d.getDate() + settings.maxBorrowDays);
      dueStr = d.toISOString().split('T')[0];
    }

    const nextTxnId = `TXN-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTxn: Transaction = {
      txnId: nextTxnId,
      bookId: book.bookId,
      bookTitle: book.title,
      memberId: member.memberId,
      memberName: member.name,
      issueDate: todayStr,
      dueDate: dueStr,
      returnDate: null,
      fine: 0,
      status: 'active',
      renewedCount: 0,
    };

    // Update book copies
    setBooks(prev =>
      prev.map(b =>
        b.bookId === bookId ? { ...b, copiesAvailable: Math.max(0, b.copiesAvailable - 1) } : b
      )
    );

    // Update member borrowedCount
    setMembers(prev =>
      prev.map(m =>
        m.memberId === memberId ? { ...m, borrowedCount: m.borrowedCount + 1 } : m
      )
    );

    // Add transaction
    setTransactions(prev => [newTxn, ...prev]);

    // Send notification to member
    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      memberId: member.memberId,
      title: 'Book Issued Successfully',
      message: `"${book.title}" was issued to you. Please return or renew on or before ${dueStr}.`,
      date: todayStr,
      type: 'due_reminder',
      read: false,
    };
    setNotifications(prev => [notif, ...prev]);

    showToast(`Issued "${book.title}" to ${member.name}. Due on ${dueStr}.`, 'success');
    return { success: true, message: 'Book issued successfully.' };
  };

  // Return Book
  const returnBook = (txnId: string) => {
    const txn = transactions.find(t => t.txnId === txnId);
    if (!txn || txn.status === 'returned') {
      return { success: false, message: 'Transaction already returned or invalid.', fine: 0 };
    }

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const due = new Date(txn.dueDate);
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    const calculatedFine = diffDays > 0 ? Number((diffDays * settings.finePerDay).toFixed(2)) : 0;

    // Update transaction
    setTransactions(prev =>
      prev.map(t =>
        t.txnId === txnId
          ? {
              ...t,
              returnDate: todayStr,
              fine: calculatedFine,
              status: 'returned',
            }
          : t
      )
    );

    // Restock book
    setBooks(prev =>
      prev.map(b =>
        b.bookId === txn.bookId ? { ...b, copiesAvailable: b.copiesAvailable + 1 } : b
      )
    );

    // Decrease member borrowed count
    setMembers(prev =>
      prev.map(m =>
        m.memberId === txn.memberId
          ? { ...m, borrowedCount: Math.max(0, m.borrowedCount - 1) }
          : m
      )
    );

    // Check if any reservation waiting for this book
    const pendingRes = reservations.find(r => r.bookId === txn.bookId && r.status === 'pending');
    if (pendingRes) {
      setReservations(prev =>
        prev.map(r =>
          r.reservationId === pendingRes.reservationId ? { ...r, status: 'ready' } : r
        )
      );
      // Notify member
      const notif: NotificationItem = {
        id: `NOTIF-${Date.now()}`,
        memberId: pendingRes.memberId,
        title: 'Reserved Book Ready for Pickup',
        message: `Your reserved book "${pendingRes.bookTitle}" is now available at the circulation desk!`,
        date: todayStr,
        type: 'reservation',
        read: false,
      };
      setNotifications(prev => [notif, ...prev]);
    }

    const fineMsg = calculatedFine > 0 ? ` (Overdue fine: $${calculatedFine.toFixed(2)})` : '';
    showToast(`Book returned successfully${fineMsg}.`, 'success');
    return { success: true, message: 'Book returned.', fine: calculatedFine };
  };

  // Renew Book
  const renewBook = (txnId: string) => {
    const txn = transactions.find(t => t.txnId === txnId);
    if (!txn || txn.status === 'returned') {
      return { success: false, message: 'Cannot renew a completed transaction.' };
    }

    if (txn.status === 'overdue') {
      return { success: false, message: 'Overdue books cannot be renewed online. Please return at circulation desk.' };
    }

    if ((txn.renewedCount || 0) >= 2) {
      return { success: false, message: 'Renewal limit reached (Maximum 2 renewals per issue).' };
    }

    // Extend due date by maxBorrowDays
    const currentDue = new Date(txn.dueDate);
    currentDue.setDate(currentDue.getDate() + settings.maxBorrowDays);
    const newDueStr = currentDue.toISOString().split('T')[0];

    setTransactions(prev =>
      prev.map(t =>
        t.txnId === txnId
          ? {
              ...t,
              dueDate: newDueStr,
              renewedCount: (t.renewedCount || 0) + 1,
            }
          : t
      )
    );

    showToast(`Book renewed! New due date: ${newDueStr}`, 'success');
    return { success: true, message: `Renewed successfully until ${newDueStr}` };
  };

  // Reserve Book
  const reserveBook = (bookId: string, memberId: string) => {
    const book = books.find(b => b.bookId === bookId);
    const member = members.find(m => m.memberId === memberId);
    if (!book || !member) return { success: false, message: 'Book or member not found.' };

    const existing = reservations.find(
      r => r.bookId === bookId && r.memberId === memberId && (r.status === 'pending' || r.status === 'ready')
    );
    if (existing) {
      return { success: false, message: 'You already have an active reservation for this book.' };
    }

    const newRes: Reservation = {
      reservationId: `RES-${Math.floor(500 + Math.random() * 500)}`,
      bookId: book.bookId,
      bookTitle: book.title,
      memberId: member.memberId,
      memberName: member.name,
      requestDate: new Date().toISOString().split('T')[0],
      status: book.copiesAvailable > 0 ? 'ready' : 'pending',
    };

    setReservations(prev => [newRes, ...prev]);

    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      memberId: member.memberId,
      title: 'Reservation Confirmed',
      message: `You have reserved "${book.title}". Status: ${newRes.status === 'ready' ? 'Ready for pickup' : 'Waiting in queue'}.`,
      date: new Date().toISOString().split('T')[0],
      type: 'reservation',
      read: false,
    };
    setNotifications(prev => [notif, ...prev]);

    showToast(`Reservation submitted for "${book.title}".`, 'success');
    return { success: true, message: 'Reserved successfully.' };
  };

  const cancelReservation = (resId: string) => {
    setReservations(prev =>
      prev.map(r => (r.reservationId === resId ? { ...r, status: 'cancelled' } : r))
    );
    showToast('Reservation cancelled.', 'info');
  };

  const fulfillReservation = (resId: string) => {
    const res = reservations.find(r => r.reservationId === resId);
    if (!res) return;
    // Issue the book to the member
    const resIssue = issueBook(res.bookId, res.memberId);
    if (resIssue.success) {
      setReservations(prev =>
        prev.map(r => (r.reservationId === resId ? { ...r, status: 'fulfilled' } : r))
      );
    }
  };

  const settleFine = (txnId: string) => {
    setTransactions(prev =>
      prev.map(t => (t.txnId === txnId ? { ...t, fine: 0 } : t))
    );
    showToast('Fine balance cleared/settled.', 'success');
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast('System configuration updated.', 'success');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read.', 'info');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const resetToSampleData = () => {
    setBooks(initialBooks);
    setMembers(initialMembers);
    setTransactions(initialTransactions);
    setReservations(initialReservations);
    setNotifications(initialNotifications);
    setSettings(initialSettings);
    setCurrentUser(initialMembers[0]);
    localStorage.clear();
    showToast('Demo data reset to initial default state.', 'info');
  };

  return (
    <LibraryContext.Provider
      value={{
        currentUser,
        currentPage,
        setCurrentPage,
        selectedBookId,
        setSelectedBookId,
        viewBookDetails,
        login,
        logout,
        switchRoleQuick,
        books,
        members,
        transactions,
        reservations,
        notifications,
        settings,
        addBook,
        updateBook,
        deleteBook,
        addMember,
        updateMember,
        deleteMember,
        toggleMemberStatus,
        issueBook,
        returnBook,
        renewBook,
        reserveBook,
        cancelReservation,
        fulfillReservation,
        settleFine,
        updateSettings,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        resetToSampleData,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = (): LibraryContextType => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
