# Nammane Database

## Migrations

This folder contains all database migrations for Nammane.

### Files

- `001_initial_schema.sql` - Initial database schema with all core tables

### Running Migrations

For Supabase:
```bash
# Pull current schema
supabase db pull

# Apply migrations
supabase db push
```

For production:
```sql
-- Connect to your database and run the migration files
```

### Schema Overview

- **profiles** - User accounts and profiles
- **events** - Event listings (poker, dinner, party, etc.)
- **bookings** - Event attendance requests and approvals
- **event_details** - Category-specific event data
- **event_images** - Photos for events
- **event_messages** - In-app chat for events
- **reviews** - Ratings after attendance
- **reports** - Safety reporting system
- **notifications** - User notifications

