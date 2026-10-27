# API Routes

## Authentication

### POST `/api/auth/signup`
Sign up a new user with email and password.

```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

### POST `/api/auth/login`
Login with email and password.

### POST `/api/auth/logout`
Logout the current user.

## Events

### GET `/api/events`
List all published events. Query params: `city`, `category`, `page`

### POST `/api/events`
Create a new event (authenticated).

### GET `/api/events/[id]`
Get a specific event.

### PATCH `/api/events/[id]`
Update an event (host only).

## Bookings

### POST `/api/bookings`
Request to join an event.

### PATCH `/api/bookings/[id]`
Approve or reject a booking request (host only).

---

More endpoints coming soon.
