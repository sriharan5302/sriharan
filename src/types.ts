/**
 * @file types.ts
 * @description Centralized TypeScript type definitions and interfaces for the Online Library Management System (OLMS).
 * Encapsulates entity models, status enums, relational payloads, and configuration settings.
 */

/**
 * Roles recognized by the authentication and access-control matrix.
 * - `admin`: Complete system privileges including librarian management, system settings, and analytics.
 * - `librarian`: Operational privileges for catalog management, issuing, returning, and member verification.
 * - `member`: End-user access for catalog browsing, borrowing history, reservations, and renewals.
 */
export type UserRole = 'admin' | 'librarian' | 'member';

/**
 * Represents a cataloged book entity within the library inventory.
 * Maps to the relational `books` SQL table and MongoDB `books` collection.
 */
export interface Book {
  /** Unique primary identifier for the book (e.g., 'BK-1001') */
  bookId: string;
  /** Full title of the book */
  title: string;
  /** Primary author or lead contributor */
  author: string;
  /** International Standard Book Number (10 or 13 digits) */
  isbn: string;
  /** Academic or literary category/genre (e.g., 'Computer Science', 'Literature') */
  category: string;
  /** Physical copies currently sitting on shelves ready to loan */
  copiesAvailable: number;
  /** Total physical copies owned by the institution */
  totalCopies: number;
  /** Synoptic summary of the book content */
  description: string;
  /** Physical warehouse/stack shelf location (e.g., 'Shelf B-14') */
  shelfLocation: string;
  /** Year of publication */
  publishedYear: number;
  /** Publishing house name */
  publisher: string;
  /** Optional cover image thumbnail URL */
  coverImage?: string;
  /** User review average score out of 5.0 */
  rating?: number;
}

/**
 * Represents a registered user/patron of the library.
 * Maps to the relational `members` SQL table.
 */
export interface Member {
  /** Unique primary identifier for the patron (e.g., 'MEM-101', 'LIB-01') */
  memberId: string;
  /** Full legal or registered name */
  name: string;
  /** Institutional email address (serves as primary login handle) */
  email: string;
  /** Access-control role assigned to this account */
  role: UserRole;
  /** Contact phone number or campus department */
  contactInfo: string;
  /** ISO Date string when patron registered (YYYY-MM-DD) */
  membershipDate: string;
  /** Account standing; 'suspended' accounts cannot borrow new items */
  status: 'active' | 'suspended';
  /** Number of physical books currently in possession of this member */
  borrowedCount: number;
  /** Maximum quota of simultaneous loans allowed for this account tier */
  maxBooksAllowed: number;
}

/**
 * Lifecycle state of a loan transaction:
 * - `active`: Book is currently checked out and due date is in the future or today.
 * - `returned`: Book has been safely received back in the library stacks.
 * - `overdue`: Book due date has passed without return; fines accrue automatically.
 */
export type TransactionStatus = 'active' | 'returned' | 'overdue';

/**
 * Represents an issue/return loan transaction record.
 * Maps to the relational `transactions` table.
 */
export interface Transaction {
  /** Unique primary key identifier for the transaction (e.g., 'TXN-9001') */
  txnId: string;
  /** Foreign key pointing to the borrowed Book */
  bookId: string;
  /** Denormalized book title for high-performance UI display without joins */
  bookTitle?: string;
  /** Foreign key pointing to the borrowing Member */
  memberId: string;
  /** Denormalized member name for quick table rendering */
  memberName?: string;
  /** ISO Date when loan was approved and book checked out (YYYY-MM-DD) */
  issueDate: string;
  /** Target ISO Date by which book must be returned to avoid penalties (YYYY-MM-DD) */
  dueDate: string;
  /** ISO Date when book was physically checked back in, or null if active */
  returnDate: string | null;
  /** Calculated late penalty fee in USD */
  fine: number;
  /** Current state of the loan lifecycle */
  status: TransactionStatus;
  /** Number of times the loan has been extended/renewed */
  renewedCount?: number;
  /** Optional administrative annotations or condition notes upon return */
  notes?: string;
}

/**
 * Represents a patron hold request on a book whose copies are currently exhausted.
 * Follows a FIFO queue mechanism.
 */
export interface Reservation {
  /** Unique primary key identifier for the hold request */
  reservationId: string;
  /** Foreign key of reserved book */
  bookId: string;
  /** Denormalized book title */
  bookTitle: string;
  /** Foreign key of member requesting hold */
  memberId: string;
  /** Denormalized member name */
  memberName: string;
  /** Timestamp when reservation was logged */
  requestDate: string;
  /** State of reservation: 'pending' (in queue), 'ready' (available for pickup), 'fulfilled', 'cancelled' */
  status: 'pending' | 'ready' | 'fulfilled' | 'cancelled';
  /** Date when ready hold expires if member does not claim book */
  expiryDate?: string;
}

/**
 * Represents system alerts, overdue warnings, and reservation pickup notices.
 */
export interface NotificationItem {
  /** Unique notification ID */
  id: string;
  /** Target member recipient ID or 'all' for institutional broadcast */
  memberId: string;
  /** Concise headline */
  title: string;
  /** Full notification body text */
  message: string;
  /** Date notification was generated (YYYY-MM-DD) */
  date: string;
  /** Semantic notification classification */
  type: 'due_reminder' | 'overdue' | 'reservation' | 'new_book' | 'system';
  /** Read acknowledgement state */
  read: boolean;
  /** Optional deep-link view route */
  actionUrl?: string;
}

/**
 * Configurable institutional rules and loan policy constraints.
 */
export interface SystemSettings {
  /** Name of the academic institution or library */
  libraryName: string;
  /** Penalty fee accrued per day overdue (in USD) */
  finePerDay: number;
  /** Standard checkout duration in calendar days */
  maxBorrowDays: number;
  /** Default borrowing limit per patron */
  maxBooksPerMember: number;
  /** Toggle for automated dispatch of overdue email alerts */
  emailAlertsEnabled: boolean;
  /** Active academic session */
  academicYear: string;
}
