/**
 * @file libraryCalculations.ts
 * @description Core business logic and algorithmic calculations for the Online Library Management System (OLMS).
 * Provides pure functions for fine estimation, due date projections, ISBN checksum validation,
 * member borrowing quota enforcement, and reservation priority queueing.
 * 
 * All functions are deterministic and designed for rigorous unit testing with 100% code coverage.
 */

import { Book, Member, Transaction, Reservation } from '../types';

/**
 * Result structure for ISBN validation
 */
export interface IsbnValidationResult {
  valid: boolean;
  format: 'ISBN-10' | 'ISBN-13' | 'INVALID';
  cleanIsbn: string;
  formatted?: string;
  error?: string;
}

/**
 * Result structure for member loan eligibility checks
 */
export interface BorrowEligibilityResult {
  allowed: boolean;
  reason?: string;
  activeCount: number;
  maxAllowed: number;
  outstandingFines: number;
}

/**
 * Validates ISBN-10 or ISBN-13 using standard international checksum algorithms.
 * 
 * ISBN-10 Checksum Algorithm:
 *   Sum(i=1..10) [ d_i * (11 - i) ] mod 11 === 0
 *   (Last character can be 'X' representing 10)
 * 
 * ISBN-13 Checksum Algorithm:
 *   Sum(i=1..13) [ d_i * (1 if i is odd else 3) ] mod 10 === 0
 * 
 * @param rawIsbn - The input ISBN string (may include hyphens or spaces)
 * @returns IsbnValidationResult with validation flag, format identifier, and sanitized string
 * 
 * @example
 * validateIsbn("978-0-13-235088-4"); // { valid: true, format: "ISBN-13", ... }
 */
export function validateIsbn(rawIsbn: string): IsbnValidationResult {
  if (!rawIsbn || typeof rawIsbn !== 'string') {
    return { valid: false, format: 'INVALID', cleanIsbn: '', error: 'ISBN must be a non-empty string' };
  }

  // Strip hyphens and spaces
  const clean = rawIsbn.replace(/[-\s]/g, '').toUpperCase();

  // Validate ISBN-10
  if (clean.length === 10) {
    if (!/^[0-9]{9}[0-9X]$/.test(clean)) {
      return { valid: false, format: 'INVALID', cleanIsbn: clean, error: 'Invalid characters in ISBN-10' };
    }

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(clean[i], 10) * (10 - i);
    }
    const checkChar = clean[9];
    sum += checkChar === 'X' ? 10 : parseInt(checkChar, 10);

    const valid = sum % 11 === 0;
    return {
      valid,
      format: valid ? 'ISBN-10' : 'INVALID',
      cleanIsbn: clean,
      formatted: valid ? `${clean.slice(0, 1)}-${clean.slice(1, 4)}-${clean.slice(4, 9)}-${clean.slice(9)}` : undefined,
      error: valid ? undefined : 'ISBN-10 checksum verification failed',
    };
  }

  // Validate ISBN-13
  if (clean.length === 13) {
    if (!/^[0-9]{13}$/.test(clean)) {
      return { valid: false, format: 'INVALID', cleanIsbn: clean, error: 'Invalid characters in ISBN-13' };
    }

    let sum = 0;
    for (let i = 0; i < 13; i++) {
      const digit = parseInt(clean[i], 10);
      sum += i % 2 === 0 ? digit : digit * 3;
    }

    const valid = sum % 10 === 0;
    return {
      valid,
      format: valid ? 'ISBN-13' : 'INVALID',
      cleanIsbn: clean,
      formatted: valid ? `${clean.slice(0, 3)}-${clean.slice(3, 4)}-${clean.slice(4, 7)}-${clean.slice(7, 12)}-${clean.slice(12)}` : undefined,
      error: valid ? undefined : 'ISBN-13 checksum verification failed',
    };
  }

  return {
    valid: false,
    format: 'INVALID',
    cleanIsbn: clean,
    error: `Expected 10 or 13 digits, but received ${clean.length}`,
  };
}

/**
 * Calculates the number of calendar days a book is overdue.
 * Returns 0 if the book is not overdue or returnDate precedes dueDate.
 * 
 * @param dueDateStr - Due date formatted as 'YYYY-MM-DD'
 * @param returnDateStr - Optional return date formatted as 'YYYY-MM-DD'. If null/omitted, uses referenceDate.
 * @param referenceDate - Optional reference date (defaults to today midnight)
 * @returns Integer number of overdue days (>= 0)
 */
export function calculateOverdueDays(
  dueDateStr: string,
  returnDateStr?: string | null,
  referenceDate: Date = new Date()
): number {
  if (!dueDateStr) return 0;

  const due = new Date(dueDateStr);
  due.setHours(0, 0, 0, 0);

  const compareDate = returnDateStr ? new Date(returnDateStr) : new Date(referenceDate);
  compareDate.setHours(0, 0, 0, 0);

  if (isNaN(due.getTime()) || isNaN(compareDate.getTime())) {
    return 0;
  }

  const diffMs = compareDate.getTime() - due.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
}

/**
 * Computes the late return monetary penalty based on daily rate and optional grace period.
 * 
 * @param overdueDays - Total number of days overdue
 * @param finePerDay - Penalty charge per day in currency units (e.g. $0.50)
 * @param gracePeriodDays - Days of leeway before fines start compounding (default 0)
 * @param maxFineCap - Optional maximum ceiling to prevent exorbitant debts (default: Infinity)
 * @returns Calculated fine formatted to 2 decimal places as a number
 * 
 * @example
 * calculateFine(5, 0.50, 0); // 2.50
 * calculateFine(2, 0.50, 3); // 0 (within 3-day grace period)
 */
export function calculateFine(
  overdueDays: number,
  finePerDay: number,
  gracePeriodDays: number = 0,
  maxFineCap: number = Infinity
): number {
  if (overdueDays <= 0 || finePerDay <= 0) return 0;
  if (overdueDays <= gracePeriodDays) return 0;

  const chargeableDays = overdueDays - gracePeriodDays;
  const rawFine = chargeableDays * finePerDay;
  const cappedFine = Math.min(rawFine, maxFineCap);

  return Number(cappedFine.toFixed(2));
}

/**
 * Projects the expected return due date given an issuance timestamp and loan duration.
 * 
 * @param issueDateStr - Date book is checked out ('YYYY-MM-DD')
 * @param loanPeriodDays - Standard loan duration (e.g. 14 days)
 * @param skipWeekends - When true, automatically rolls a weekend due date to the following Monday
 * @returns Projected due date in 'YYYY-MM-DD' ISO format
 */
export function calculateDueDate(
  issueDateStr: string,
  loanPeriodDays: number = 14,
  skipWeekends: boolean = false
): string {
  const issue = issueDateStr ? new Date(issueDateStr) : new Date();
  if (isNaN(issue.getTime())) {
    const fallback = new Date();
    fallback.setDate(fallback.getDate() + loanPeriodDays);
    return fallback.toISOString().split('T')[0];
  }

  const due = new Date(issue);
  due.setDate(due.getDate() + Math.max(1, loanPeriodDays));

  if (skipWeekends) {
    const dayOfWeek = due.getDay(); // 0 is Sunday, 6 is Saturday
    if (dayOfWeek === 6) {
      due.setDate(due.getDate() + 2); // Push Saturday -> Monday
    } else if (dayOfWeek === 0) {
      due.setDate(due.getDate() + 1); // Push Sunday -> Monday
    }
  }

  return due.toISOString().split('T')[0];
}

/**
 * Evaluates whether a member is eligible to borrow another book based on:
 * 1. Account status (must not be 'suspended')
 * 2. Active book loans limit (must be strictly below member.maxBooksAllowed)
 * 3. Outstanding unpaid fines threshold (must not exceed maxUnpaidFineThreshold)
 * 
 * @param member - Member object to evaluate
 * @param activeLoansCount - Current number of active checked-out books
 * @param outstandingFines - Sum of unpaid overdue fines
 * @param maxUnpaidFineThreshold - Maximum fine amount allowed before borrowing freeze (default $10.00)
 * @returns BorrowEligibilityResult detailing decision and rationale
 */
export function checkBorrowEligibility(
  member: Member | null | undefined,
  activeLoansCount: number,
  outstandingFines: number = 0,
  maxUnpaidFineThreshold: number = 10.0
): BorrowEligibilityResult {
  if (!member) {
    return {
      allowed: false,
      reason: 'Member record not found.',
      activeCount: activeLoansCount,
      maxAllowed: 0,
      outstandingFines,
    };
  }

  if (member.status === 'suspended') {
    return {
      allowed: false,
      reason: 'Member account is currently suspended. Please contact library administration.',
      activeCount: activeLoansCount,
      maxAllowed: member.maxBooksAllowed,
      outstandingFines,
    };
  }

  if (outstandingFines > maxUnpaidFineThreshold) {
    return {
      allowed: false,
      reason: `Member has outstanding unpaid fines of $${outstandingFines.toFixed(2)}, which exceeds the $${maxUnpaidFineThreshold.toFixed(2)} threshold.`,
      activeCount: activeLoansCount,
      maxAllowed: member.maxBooksAllowed,
      outstandingFines,
    };
  }

  if (activeLoansCount >= member.maxBooksAllowed) {
    return {
      allowed: false,
      reason: `Member has reached maximum simultaneous loan capacity (${member.maxBooksAllowed} books).`,
      activeCount: activeLoansCount,
      maxAllowed: member.maxBooksAllowed,
      outstandingFines,
    };
  }

  return {
    allowed: true,
    activeCount: activeLoansCount,
    maxAllowed: member.maxBooksAllowed,
    outstandingFines,
  };
}

/**
 * Determines the next member in the FIFO reservation queue when a book copy becomes available.
 * Filters for 'pending' requests and selects the earliest requestDate.
 * 
 * @param reservations - List of all system reservations
 * @param bookId - Target book identifier
 * @returns Earliest eligible Reservation or null if queue is empty
 */
export function getNextReservationInQueue(
  reservations: Reservation[],
  bookId: string
): Reservation | null {
  const pendingForBook = reservations
    .filter(r => r.bookId === bookId && r.status === 'pending')
    .sort((a, b) => new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime());

  return pendingForBook.length > 0 ? pendingForBook[0] : null;
}

/**
 * Aggregates analytical metrics for library reporting dashboards.
 * 
 * @param books - Array of books
 * @param members - Array of registered members
 * @param transactions - Array of loan transactions
 * @returns High-level summary metrics object
 */
export function computeSystemAnalytics(
  books: Book[],
  members: Member[],
  transactions: Transaction[]
) {
  const totalBooks = books.length;
  const totalCopies = books.reduce((acc, b) => acc + (b.totalCopies || 0), 0);
  const availableCopies = books.reduce((acc, b) => acc + (b.copiesAvailable || 0), 0);
  
  const activeLoans = transactions.filter(t => t.status === 'active').length;
  const overdueLoans = transactions.filter(t => t.status === 'overdue').length;
  const returnedLoans = transactions.filter(t => t.status === 'returned').length;

  const totalFinesAccrued = transactions.reduce((acc, t) => acc + (t.fine || 0), 0);
  const activeMembers = members.filter(m => m.status === 'active').length;
  const suspendedMembers = members.filter(m => m.status === 'suspended').length;

  return {
    totalBooks,
    totalCopies,
    availableCopies,
    issuedCopies: totalCopies - availableCopies,
    activeLoans,
    overdueLoans,
    returnedLoans,
    totalFinesAccrued: Number(totalFinesAccrued.toFixed(2)),
    activeMembers,
    suspendedMembers,
    totalMembers: members.length,
    circulationRate: totalCopies > 0 ? Number((((totalCopies - availableCopies) / totalCopies) * 100).toFixed(1)) : 0,
  };
}
