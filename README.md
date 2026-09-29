# Online Library Management System (OLMS)
### College Academic Project & Technical Review Documentation
**Current Review Phase:** Review 1 (35% Completion Milestone) & Review 2 Preparatory Specification  
**Architecture:** React 19 SPA (Vite, TypeScript, Tailwind CSS, Lucide Icons, Full-Stack REST / Relational & NoSQL Schema Models)

---

## 1. Executive Summary & Review 1 (35% Completion) Report

### 1.1 Project Objective & Problem Statement
Traditional library operations rely heavily on manual paper registers, physical ledger books, and verbal tracking. This legacy approach is prone to record loss, delayed returns, inaccurate fine accounting, and cumbersome catalog searches.

The **Online Library Management System (OLMS)** is a modern digital platform designed for colleges and universities. It centralizes catalog discovery, automated checkouts, renewals, fine accrual, member role authorization, and real-time inventory metrics into an intuitive, responsive interface.

### 1.2 Review 1: 35% Project Completion Deliverables
The project has successfully met all milestones defined for **Review 1 (35% Project Completion)**:
1. **Foundational Architecture & Public Repository Structure**: Established clean TypeScript modular directory layout (`/src/components`, `/src/context`, `/src/pages`, `/src/utils`, `/src/tests`, `/src/data`, `/src/types.ts`).
2. **Three-Tier Role-Based Access Control (RBAC)**:
   - **Administrator**: Global inventory oversight, librarian credentialing, member status suspension, fine rule configuration, analytics reports.
   - **Librarian**: Catalog CRUD, issue/return circulation desk, due date scheduling, member assistance.
   - **Student / Faculty Member**: Book search, active loan inspection, one-click renewals, reservations, due date countdowns, fine tracking.
3. **Dynamic Book Catalog & Search Engine**: Multi-parameter search filterable by Title, Author, Category, ISBN, and Real-time Availability.
4. **Circulation Workflow (Issue, Return, Renew)**: Real-time stock decrement on issue, stock restocking on return, and automated reservation queue alert generation.
5. **Automated Overdue Fine Calculation Engine**: Algorithmic penalty computation based on overdue calendar days, daily rate multipliers, and grace period settings.
6. **Persistent State Management**: Context-driven architecture with client synchronization and sample seed data.

---

## 2. Subsequent Review (Review 2) Implementation & Next Steps

In direct response to Review 1 evaluation feedback:
- [x] **Granular Technical Documentation on Unit Testing**: Architected an automated unit testing suite with in-browser runner and formal test specifications.
- [x] **Production React Error Boundaries**: Engineered class-based error boundaries with stack trace diagnostics and isolated recovery mechanisms.
- [x] **Formal Database Schemas (Relational & NoSQL)**: Created production-grade PostgreSQL/MySQL DDL and MongoDB JSON Schema definitions.
- [x] **REST API Endpoints Specification**: Documented complete RESTful contracts with HTTP verbs, request/response bodies, query parameters, and status codes.
- [x] **Granular Code Comments**: Added detailed JSDoc documentation across business logic utilities, models, and context providers.

---

## 3. Unit Testing Architecture & Test Specifications

### 3.1 Testing Philosophy & Pyramid
The testing architecture is split into three primary tiers:
1. **Algorithmic / Unit Layer**: Pure mathematical functions with 0 side effects (fine calculation, due date calendar rolling, ISBN-10/13 checksum algorithms).
2. **State & Invariant Layer**: Business constraint enforcement (borrowing limits, suspension locks, FIFO reservation priority).
3. **Resilience / Integration Layer**: Component recovery under error conditions via Error Boundaries.

### 3.2 Implemented Unit Test Suite Matrix (`/src/tests/unitTests.ts`)
The project includes 20+ automated test cases executable in real-time via the in-app **Technical Docs & Tests Runner**:

| Test ID | Module / Category | Test Case Description | Assertion Criteria | Status |
| :--- | :--- | :--- | :--- | :--- |
| `ISBN-01` | ISBN Validation | Valid ISBN-10 clean string | Modulo 11 checksum returns `valid: true` | **PASS** |
| `ISBN-02` | ISBN Validation | Valid ISBN-10 with check digit 'X' | Correctly evaluates 10 as last digit | **PASS** |
| `ISBN-03` | ISBN Validation | Corrupted ISBN-10 check digit | Fails checksum and returns `valid: false` | **PASS** |
| `ISBN-04` | ISBN Validation | Valid ISBN-13 with hyphens | Sanitizes hyphens, verifies modulo 10 checksum | **PASS** |
| `ISBN-05` | ISBN Validation | Corrupted ISBN-13 checksum | Fails modulo 10 checksum | **PASS** |
| `ISBN-06` | ISBN Validation | Malformed non-numeric string | Immediately rejects invalid format | **PASS** |
| `OVD-01` | Overdue Logic | Loan before due date | Returns `0` days overdue | **PASS** |
| `OVD-02` | Overdue Logic | Return on exact due date | Returns `0` days overdue | **PASS** |
| `OVD-03` | Overdue Logic | Return 5 calendar days past due date | Returns exactly `5` days overdue | **PASS** |
| `OVD-04` | Overdue Logic | Empty or invalid date string | Gracefully returns `0` without throwing | **PASS** |
| `FIN-01` | Fine Calculation | 0 days overdue | Returns `$0.00` fine | **PASS** |
| `FIN-02` | Fine Calculation | 4 days overdue @ $0.50/day | Accrues exactly `$2.00` | **PASS** |
| `FIN-03` | Fine Calculation | 2 days overdue within 2-day grace period | Waives fine and returns `$0.00` | **PASS** |
| `FIN-04` | Fine Calculation | 5 days overdue with 2-day grace period | Only charges 3 days = `$3.00` | **PASS** |
| `FIN-05` | Fine Calculation | 100 days overdue with max cap ($25.00) | Caps total fine at `$25.00` ceiling | **PASS** |
| `DUE-01` | Due Date Projection | Standard 14-day loan | Accurately adds 14 calendar days | **PASS** |
| `DUE-02` | Due Date Projection | Month and Year boundary rollover | Roll from Dec 25 to Jan 04 across years | **PASS** |
| `DUE-03` | Due Date Projection | Weekend skipping rule | Shifts Saturday due date to following Monday | **PASS** |
| `ELG-01` | Eligibility Quota | Active member under borrowing quota | Approves loan eligibility | **PASS** |
| `ELG-02` | Eligibility Quota | Suspended account status | Disallows loan with descriptive reason | **PASS** |
| `ELG-03` | Eligibility Quota | Member at max borrowing quota | Rejects loan when active loans >= quota | **PASS** |
| `ELG-04` | Eligibility Quota | Outstanding fines exceed threshold ($10) | Freezes account checkout privileges | **PASS** |
| `QUE-01` | Queue Ordering | Multiple reservations for same book | Returns earliest reservation by FIFO date | **PASS** |
| `QUE-02` | Queue Ordering | Book with 0 pending reservations | Returns `null` without error | **PASS** |
| `ANL-01` | Analytics Engine | System statistics aggregation | Accurately aggregates total and issued copies | **PASS** |

---

## 4. Error Boundary Architecture & UI Resilience

### 4.1 React Error Boundary Lifecycle
Render errors in React normally cause the entire component tree to unmount, resulting in a blank screen. OLMS implements class-based React Error Boundaries conforming to enterprise standards:

```
[ Unhandled JavaScript Render Error ]
                 │
                 ▼
  static getDerivedStateFromError(error)
     ↳ Synchronously sets { hasError: true, error }
     ↳ Swaps crashed subtree with Fallback UI
                 │
                 ▼
     componentDidCatch(error, errorInfo)
     ↳ Captures componentStack trace
     ↳ Transmits telemetry / error diagnostic logging
                 │
                 ▼
        [ User Recovery Action ]
     ↳ User clicks "Reload Section" or "Recover & Continue"
     ↳ Resets boundary state { hasError: false }
```

### 4.2 Hierarchy of Error Boundaries
1. **Root Application Boundary (`<RootErrorBoundary>`)**: Protects against unexpected boot failures, theme crashes, or top-level provider disruptions.
2. **Page-Level Route Boundary (`<PageErrorBoundary>`)**: Wrapped around the active view in `App.tsx`. If a table or report card throws, the user can reset the page or navigate away without losing the overall session or navbar.
3. **Widget-Level Boundary (`<WidgetErrorBoundary>`)**: Encapsulates data-dense widgets (e.g., charts, simulators) with localized inline fallback cards.

---

## 5. Database Schemas (Relational SQL & Document NoSQL)

### 5.1 Relational Schema (PostgreSQL / MySQL DDL)

```sql
-- 1. Members / Users Table
CREATE TABLE members (
    member_id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'librarian', 'member')),
    contact_info VARCHAR(100),
    membership_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
    borrowed_count INT NOT NULL DEFAULT 0 CHECK (borrowed_count >= 0),
    max_books_allowed INT NOT NULL DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_role ON members(role);

-- 2. Books Catalog Table
CREATE TABLE books (
    book_id VARCHAR(32) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(180) NOT NULL,
    isbn VARCHAR(20) NOT NULL UNIQUE,
    category VARCHAR(80) NOT NULL,
    copies_available INT NOT NULL DEFAULT 1 CHECK (copies_available >= 0),
    total_copies INT NOT NULL DEFAULT 1 CHECK (total_copies >= copies_available),
    description TEXT,
    shelf_location VARCHAR(50),
    published_year INT CHECK (published_year BETWEEN 1400 AND 2100),
    publisher VARCHAR(150),
    cover_image_url VARCHAR(500),
    rating NUMERIC(3, 2) DEFAULT 4.50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_books_isbn ON books(isbn);
CREATE INDEX idx_books_category ON books(category);
CREATE INDEX idx_books_title_author ON books(title, author);

-- 3. Transactions (Issue & Return) Table
CREATE TABLE transactions (
    txn_id VARCHAR(36) PRIMARY KEY,
    book_id VARCHAR(32) NOT NULL REFERENCES books(book_id) ON DELETE RESTRICT,
    member_id VARCHAR(32) NOT NULL REFERENCES members(member_id) ON DELETE RESTRICT,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    return_date DATE NULL,
    fine NUMERIC(8, 2) NOT NULL DEFAULT 0.00 CHECK (fine >= 0.00),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'returned', 'overdue')),
    renewed_count INT NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_txn_member_id ON transactions(member_id);
CREATE INDEX idx_txn_book_id ON transactions(book_id);
CREATE INDEX idx_txn_status ON transactions(status);

-- 4. Book Reservations Table
CREATE TABLE reservations (
    reservation_id VARCHAR(36) PRIMARY KEY,
    book_id VARCHAR(32) NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
    member_id VARCHAR(32) NOT NULL REFERENCES members(member_id) ON DELETE CASCADE,
    request_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'ready', 'fulfilled', 'cancelled')),
    expiry_date DATE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_res_book_status ON reservations(book_id, status);

-- 5. System Settings Table
CREATE TABLE system_settings (
    setting_key VARCHAR(64) PRIMARY KEY,
    setting_value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 5.2 Document Schema (MongoDB BSON JSON Schema)

```json
{
  "$jsonSchema": {
    "bsonType": "object",
    "required": ["bookId", "title", "author", "isbn", "category", "copiesAvailable", "totalCopies"],
    "properties": {
      "bookId": { "bsonType": "string" },
      "title": { "bsonType": "string" },
      "author": { "bsonType": "string" },
      "isbn": { "bsonType": "string", "pattern": "^[0-9-]{10,17}$" },
      "category": { "bsonType": "string" },
      "copiesAvailable": { "bsonType": "int", "minimum": 0 },
      "totalCopies": { "bsonType": "int", "minimum": 1 },
      "shelfLocation": { "bsonType": "string" },
      "publishedYear": { "bsonType": "int" }
    }
  }
}
```

---

## 6. REST API Endpoints Specification

### Authentication & Authorization
All secured endpoints expect an HTTP Header:
`Authorization: Bearer <JWT_ACCESS_TOKEN>`

| Method | Endpoint | Access Role | Description | Success Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/books` | Public / All | Search books with filters (`?search=...&category=...`) | `200 OK` `{ data: Book[], total: number }` |
| `GET` | `/api/books/:id` | Public / All | Get full metadata for single book | `200 OK` `{ book: Book }` |
| `POST` | `/api/books` | Librarian, Admin | Add new book to library inventory | `201 Created` `{ bookId: string }` |
| `PUT` | `/api/books/:id` | Librarian, Admin | Update existing book details | `200 OK` `{ success: true }` |
| `DELETE` | `/api/books/:id` | Librarian, Admin | Remove book (blocked if active loans exist) | `200 OK` / `409 Conflict` |
| `GET` | `/api/members` | Librarian, Admin | List registered members with loan counts | `200 OK` `{ members: Member[] }` |
| `POST` | `/api/members` | Librarian, Admin | Register new member / staff account | `201 Created` `{ memberId: string }` |
| `PATCH` | `/api/members/:id/status`| Admin | Suspend or activate member account | `200 OK` `{ status: 'suspended' }` |
| `POST` | `/api/transactions/issue` | Librarian, Admin | Issue book to member with due date | `201 Created` `{ txnId: string }` |
| `POST` | `/api/transactions/:id/return`| Librarian, Admin | Return book, compute fines, alert queue | `200 OK` `{ fine: number, status: 'returned' }` |
| `POST` | `/api/transactions/:id/renew` | Member, Librarian | Extend loan due date by policy days | `200 OK` `{ newDueDate: string }` |
| `POST` | `/api/reservations` | Member, Librarian | Place hold on out-of-stock book | `201 Created` `{ queuePosition: number }` |
| `POST` | `/api/fines/:txnId/settle` | Librarian, Admin | Mark accrued fine as collected / paid | `200 OK` `{ settled: true }` |
| `GET` | `/api/reports/analytics` | Librarian, Admin | Summary circulation metrics and fine sums | `200 OK` `{ metrics: AnalyticsObject }` |

---

## 7. How to Run & Verify

1. **Start the Development Server**:
   ```bash
   npm run dev
   ```
2. **Access the Application**:
   Open browser at `http://localhost:3000`.
3. **Run Unit Tests Live**:
   Click the **"Run Tests"** button in the bottom-right corner or the **"Tech Docs & Tests"** button in the top navigation bar, then click **"Run All Unit Tests Live"**.
4. **Test Error Boundary Resilience**:
   In the Technical Documentation modal, open the **"Error Boundaries & Resilience"** tab and click **"Trigger Simulated Crash"** to observe isolated graceful crash containment.
5. **Switch Roles**:
   Use the **"Switch Role"** buttons (Admin, Librarian, Member) in the top announcement bar to verify access-control views.
