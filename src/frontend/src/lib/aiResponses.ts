export function getAIResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes("dashboard") || lower.includes("ড্যাশবোর্ড")) {
    return `Great choice! Here's a professional React dashboard structure with analytics components:

\`\`\`tsx
// Dashboard.tsx
import { useState, useEffect } from 'react';

interface DashboardMetrics {
  users: number;
  revenue: number;
  sessions: number;
  conversion: number;
}

export function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  useEffect(() => {
    fetchMetrics().then(setMetrics);
  }, []);

  return (
    <div className="grid grid-cols-4 gap-6 p-8">
      <MetricCard title="Total Users" value={metrics?.users} trend="+12%" />
      <MetricCard title="Revenue" value={metrics?.revenue} trend="+8.3%" />
      <MetricCard title="Sessions" value={metrics?.sessions} trend="+24%" />
      <MetricCard title="Conversion" value={metrics?.conversion} trend="-1.2%" />
      <div className="col-span-2">
        <LineChart data={revenueData} title="Revenue Over Time" />
      </div>
      <div className="col-span-2">
        <BarChart data={userStats} title="User Activity" />
      </div>
    </div>
  );
}
\`\`\`

I've structured this with:
- **Metric cards** in a responsive 4-column grid
- **Line chart** for time-series data (revenue)
- **Bar chart** for categorical data (user activity)
- TypeScript interfaces for type safety

Want me to add dark mode, real-time updates, or data filtering?`;
  }

  if (
    lower.includes("backend") ||
    lower.includes("ব্যাক-এন্ড") ||
    lower.includes("api")
  ) {
    return `Here's a production-ready Node.js/Express REST API with proper middleware:

\`\`\`javascript
// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS }));
app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api/', limiter);

app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/auth', require('./routes/auth'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));
\`\`\`

Key features:
- **Helmet.js** for security headers
- **CORS** configuration with env-based origins
- **Rate limiting** to prevent abuse
- **Centralized error handling**
- Modular route structure

Should I add authentication middleware, database integration, or Swagger docs?`;
  }

  if (
    lower.includes("database") ||
    lower.includes("ডাটাবেস") ||
    lower.includes("sql") ||
    lower.includes("postgres")
  ) {
    return `Here's a PostgreSQL schema for a scalable application:

\`\`\`sql
-- PostgreSQL Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       VARCHAR(255) UNIQUE NOT NULL,
  username    VARCHAR(50) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  role        VARCHAR(20) DEFAULT 'user',
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE sessions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  token       VARCHAR(500) UNIQUE NOT NULL,
  expires_at  TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id  UUID REFERENCES sessions(id) ON DELETE CASCADE,
  role        VARCHAR(20) NOT NULL,
  content     TEXT NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_messages_session_id ON messages(session_id);
CREATE INDEX idx_users_email ON users(email);
\`\`\`

Best practices applied:
- **UUID primary keys** for security and distribution
- **Foreign key constraints** with cascade deletes
- **Indexes** on frequently queried columns
- **Timezone-aware timestamps**

Want me to add Prisma schema, migration files, or query optimization?`;
  }

  if (
    lower.includes("security") ||
    lower.includes("সিকিউরিটি") ||
    lower.includes("auth") ||
    lower.includes("jwt")
  ) {
    return `Here's a complete JWT authentication system with refresh tokens:

\`\`\`javascript
// auth.service.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

class AuthService {
  generateTokens(userId) {
    const accessToken = jwt.sign(
      { userId, type: 'access' },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
    const refreshToken = jwt.sign(
      { userId, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
    return { accessToken, refreshToken };
  }

  async hashPassword(password) {
    return bcrypt.hash(password, 12);
  }

  async verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return null;
    }
  }
}

module.exports = new AuthService();
\`\`\`

Security features:
- **Short-lived access tokens** (15 min)
- **Refresh token rotation** (7 days)
- **bcrypt** with high salt rounds (12)
- **Token type validation**

Should I add 2FA, OAuth integration, or session blacklisting?`;
  }

  if (
    lower.includes("test") ||
    lower.includes("টেস্ট") ||
    lower.includes("testing")
  ) {
    return `Here's a comprehensive testing setup with Jest and React Testing Library:

\`\`\`typescript
// user.service.test.ts
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { UserService } from '../services/UserService';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(mockDatabase);
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('creates a user with hashed password', async () => {
      const userData = { email: 'test@example.com', password: 'secure123' };
      const user = await userService.createUser(userData);

      expect(user.id).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.password).not.toBe(userData.password);
    });

    it('throws error for duplicate email', async () => {
      const userData = { email: 'existing@example.com', password: '123' };
      await expect(userService.createUser(userData))
        .rejects.toThrow('Email already exists');
    });
  });

  describe('authenticateUser', () => {
    it('returns tokens for valid credentials', async () => {
      const result = await userService.authenticate('user@test.com', 'password');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });
});
\`\`\`

Testing strategy:
- **Unit tests** for services and utilities
- **Integration tests** for API endpoints
- **E2E tests** with Playwright for user flows
- **Mock factories** for database isolation
- **Coverage threshold** enforcement (>80%)

Want me to add API integration tests, component tests, or CI/CD pipeline config?`;
  }

  if (
    lower.includes("frontend") ||
    lower.includes("ফ্রন্ট-এন্ড") ||
    lower.includes("react") ||
    lower.includes("component")
  ) {
    return `Here's a well-structured React component with TypeScript:

\`\`\`tsx
// components/DataTable/DataTable.tsx
import { useState, useMemo } from 'react';

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  searchable?: boolean;
  paginate?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  onRowClick,
  searchable = true,
  paginate = true,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() =>
    data.filter(row =>
      JSON.stringify(row).toLowerCase().includes(search.toLowerCase())
    ),
    [data, search]
  );

  const paginated = useMemo(() =>
    filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page]
  );

  return (
    <div className="space-y-4">
      {searchable && (
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search..."
          className="w-full rounded-lg border px-4 py-2"
        />
      )}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            {columns.map(col => (
              <th key={col.key} className="text-left py-3 px-4 font-semibold">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginated.map((row, i) => (
            <tr
              key={i}
              onClick={() => onRowClick?.(row)}
              className="border-b hover:bg-muted/50 cursor-pointer"
            >
              {columns.map(col => (
                <td key={col.key} className="py-3 px-4">
                  {String(row[col.key as keyof T] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
\`\`\`

Component principles:
- **Generic TypeScript** for full type safety
- **useMemo** for expensive computations
- **Accessible** table markup
- **Pagination and search** built in

Should I add sorting, column resizing, row selection, or virtualization?`;
  }

  return `I'm your AI app builder! I can help you build complete, production-ready applications.

Here's what I can generate for you:

\`\`\`
📦 Full-Stack App Architecture
├── frontend/          # React + TypeScript
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Route pages
│   └── lib/           # Utilities & helpers
├── backend/           # Node.js / Python / Go
│   ├── routes/        # API endpoints
│   ├── services/      # Business logic
│   ├── models/        # Data models
│   └── middleware/    # Auth, validation, logging
├── database/          # SQL / NoSQL schemas
│   ├── migrations/    # Version-controlled changes
│   └── seeds/         # Sample data
└── tests/             # Unit, integration, E2E
\`\`\`

Try asking me about:
- **"Build a dashboard"** — Analytics dashboard with charts
- **"Create a REST API"** — Express/FastAPI backend
- **"Setup a database"** — PostgreSQL or MongoDB schema
- **"Add authentication"** — JWT or OAuth flow
- **"Write tests"** — Jest + RTL test suite

What would you like to build today?`;
}
