export type UserRole = 'admin' | 'librarian' | 'member';

export interface Book {
  bookId: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  copiesAvailable: number;
  totalCopies: number;
  description: string;
  shelfLocation: string;
  publishedYear: number;
  publisher: string;
  coverImage?: string;
  rating?: number;
}

export interface Member {
  memberId: string;
  name: string;
  email: string;
  role: UserRole;
  contactInfo: string;
  membershipDate: string;
  status: 'active' | 'suspended';
  borrowedCount: number;
  maxBooksAllowed: number;
}

export type TransactionStatus = 'active' | 'returned' | 'overdue';

export interface Transaction {
  txnId: string;
  bookId: string;
  bookTitle?: string;
  memberId: string;
  memberName?: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string;   // YYYY-MM-DD
  returnDate: string | null; // YYYY-MM-DD or null if not yet returned
  fine: number;      // fine in USD or standard currency
  status: TransactionStatus;
  renewedCount?: number;
  notes?: string;
}

export interface Reservation {
  reservationId: string;
  bookId: string;
  bookTitle: string;
  memberId: string;
  memberName: string;
  requestDate: string;
  status: 'pending' | 'ready' | 'fulfilled' | 'cancelled';
  expiryDate?: string;
}

export interface NotificationItem {
  id: string;
  memberId: string; // 'all' or specific memberId
  title: string;
  message: string;
  date: string;
  type: 'due_reminder' | 'overdue' | 'reservation' | 'new_book' | 'system';
  read: boolean;
  actionUrl?: string;
}

export interface SystemSettings {
  libraryName: string;
  finePerDay: number;
  maxBorrowDays: number;
  maxBooksPerMember: number;
  emailAlertsEnabled: boolean;
  academicYear: string;
}
