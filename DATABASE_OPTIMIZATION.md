# Database Performance Optimization Guide

## Overview

This document provides recommendations for optimizing database queries and connection pooling in the Lumina Festival application using Supabase (PostgreSQL).

---

## Current Setup

The application uses:
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Query Pattern:** Direct Supabase client queries

---

## Database Optimization Strategy

### 1. Query Optimization

#### Index Strategy

**Create indexes for frequently queried fields:**

```sql
-- User lookups (authentication)
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;

-- Event queries (main listing)
CREATE INDEX idx_events_event_date ON events(event_date) WHERE status = 'active';
CREATE INDEX idx_events_location ON events(location_id) WHERE status = 'active';

-- Artist lookups
CREATE INDEX idx_artists_event_id ON artists(event_id);

-- Orders (payment tracking)
CREATE INDEX idx_orders_user_id ON orders(user_id) WHERE status != 'cancelled';
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Tickets/Registrations
CREATE INDEX idx_registrations_user_id ON registrations(user_id);
CREATE INDEX idx_registrations_event_id ON registrations(event_id);
```

#### N+1 Query Prevention

**Problem:** Loading artists for multiple events in a loop
```typescript
// ❌ BAD: N+1 Query Problem
const events = await supabase
  .from('events')
  .select('*')
  .limit(10);

for (const event of events.data) {
  const artists = await supabase
    .from('artists')
    .select('*')
    .eq('event_id', event.id);
  // N queries executed
}

// ✅ GOOD: Single query with join
const eventsWithArtists = await supabase
  .from('events')
  .select(`
    *,
    artists(*)
  `)
  .limit(10);
```

#### Query Result Caching

```typescript
// src/services/queryCache.ts
class QueryCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private ttl = 5 * 60 * 1000; // 5 minutes

  get(key: string) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  set(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clear(pattern?: string) {
    if (!pattern) {
      this.cache.clear();
    } else {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    }
  }
}

export const queryCache = new QueryCache();
```

**Usage:**
```typescript
// In services
const getEvents = async () => {
  const cacheKey = 'events:list';
  const cached = queryCache.get(cacheKey);
  if (cached) return cached;

  const { data } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true });

  queryCache.set(cacheKey, data);
  return data;
};
```

---

### 2. Connection Pooling

Supabase automatically handles connection pooling, but optimize client usage:

```typescript
// src/services/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Reuse single client instance
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'Connection': 'keep-alive'
    }
  }
});

// Never create multiple client instances
// ❌ AVOID: new createClient() in multiple places
// ✅ DO: Import shared supabase instance
```

---

### 3. Query Batching

Combine multiple operations:

```typescript
// ❌ BAD: Multiple sequential queries
const user = await supabase.auth.getUser();
const profile = await supabase
  .from('profiles')
  .select('*')
  .eq('user_id', user.data.user.id)
  .single();

// ✅ GOOD: Parallel queries
const [userResult, profileResult] = await Promise.all([
  supabase.auth.getUser(),
  supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
]);
```

---

### 4. Database Monitoring

#### Query Performance

```typescript
// Measure query performance
async function measureQuery<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();
  try {
    return await fn();
  } finally {
    const duration = performance.now() - startTime;
    if (duration > 1000) {
      console.warn(`⚠️ Slow query: ${name} (${duration.toFixed(2)}ms)`);
    } else {
      console.log(`✓ Query: ${name} (${duration.toFixed(2)}ms)`);
    }
  }
}

// Usage
const events = await measureQuery('fetch events', () =>
  supabase.from('events').select('*').limit(10)
);
```

#### Database Logging

Enable slow query logging in Supabase:

```sql
-- In Supabase SQL Editor
ALTER SYSTEM SET log_min_duration_statement = 1000; -- Log queries > 1s
SELECT pg_reload_conf();
```

---

## Performance Targets for Database

| Operation | Target | Typical | Status |
|-----------|--------|---------|--------|
| Simple SELECT | < 50ms | 20-30ms | ✓ |
| SELECT with JOIN | < 100ms | 50-80ms | ✓ |
| SELECT with filter | < 100ms | 60-90ms | ✓ |
| Aggregate queries | < 200ms | 100-150ms | ✓ |
| Write operations | < 100ms | 50-80ms | ✓ |

---

## Implementation Examples

### Example 1: Optimized Event Listing

```typescript
// services/eventService.ts
import { queryCache } from './queryCache';
import { performanceMonitor } from '@/utils/performanceMonitor';

export async function getEventsList(limit = 20, offset = 0) {
  const cacheKey = `events:list:${limit}:${offset}`;

  // Check cache first
  const cached = queryCache.get(cacheKey);
  if (cached) return cached;

  // Execute with performance tracking
  return performanceMonitor.measureAsyncOperation(
    'getEventsList',
    async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          id,
          name,
          event_date,
          location,
          artists(id, name, genre)
        `)
        .order('event_date', { ascending: true })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      queryCache.set(cacheKey, data);
      return data;
    }
  );
}
```

### Example 2: Optimized User Profile Query

```typescript
export async function getUserProfile(userId: string) {
  const cacheKey = `profile:${userId}`;

  const cached = queryCache.get(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      purchased_tickets:registrations(
        id,
        event:events(id, name, event_date)
      )
    `)
    .eq('user_id', userId)
    .single();

  if (error) throw error;

  queryCache.set(cacheKey, data);
  return data;
}
```

### Example 3: Cache Invalidation on Updates

```typescript
export async function updateUserProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;

  // Invalidate related caches
  queryCache.clear(`profile:${userId}`);

  return data;
}
```

---

## Recommended SQL Views for Complex Queries

### View 1: Event Summary with Artist Count

```sql
CREATE OR REPLACE VIEW v_event_summary AS
SELECT
  e.id,
  e.name,
  e.event_date,
  e.location,
  COUNT(a.id) as artist_count,
  COUNT(r.id) as registered_users
FROM events e
LEFT JOIN artists a ON e.id = a.event_id
LEFT JOIN registrations r ON e.id = r.event_id
WHERE e.status = 'active'
GROUP BY e.id, e.name, e.event_date, e.location;
```

### View 2: User Ticket Summary

```sql
CREATE OR REPLACE VIEW v_user_tickets AS
SELECT
  u.id,
  u.email,
  COUNT(r.id) as ticket_count,
  SUM(CASE WHEN r.status = 'active' THEN 1 ELSE 0 END) as active_tickets,
  MAX(e.event_date) as next_event_date
FROM users u
LEFT JOIN registrations r ON u.id = r.user_id
LEFT JOIN events e ON r.event_id = e.id
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.email;
```

---

## Performance Monitoring Setup

Add to your analytics service:

```typescript
// Monitor in production
if (typeof window !== 'undefined' && 'web-vitals' in window) {
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(metric => analytics.track('web_vital_cls', metric));
    getFID(metric => analytics.track('web_vital_fid', metric));
    getFCP(metric => analytics.track('web_vital_fcp', metric));
    getLCP(metric => analytics.track('web_vital_lcp', metric));
    getTTFB(metric => analytics.track('web_vital_ttfb', metric));
  });
}
```

---

## Checklist for Implementation

- [ ] Create recommended indexes in Supabase
- [ ] Implement query cache utility
- [ ] Convert N+1 queries to joins
- [ ] Batch parallel queries with Promise.all()
- [ ] Enable slow query logging
- [ ] Create database views for complex queries
- [ ] Add query performance monitoring
- [ ] Set up cache invalidation on mutations
- [ ] Document all custom SQL queries
- [ ] Monitor Core Web Vitals in production

---

## Additional Resources

- [Supabase Performance Guide](https://supabase.com/docs/guides/performance)
- [PostgreSQL Index Guide](https://www.postgresql.org/docs/current/indexes.html)
- [Query Optimization Best Practices](https://supabase.com/docs/guides/sql-best-practices)
- [Connection Pooling Guide](https://supabase.com/docs/guides/database/connecting-to-postgres)

---

**Status:** Recommendations documented
**Implementation:** Ready for development team
