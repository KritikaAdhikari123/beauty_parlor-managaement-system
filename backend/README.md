# Beauty Parlor Management System - Backend

Backend API for the Beauty Parlor Management System built with Node.js, Express, and MySQL.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

1. Make sure MySQL is running on your system
2. Create the database and tables by running the SQL schema:

```bash
mysql -u root -p < database/schema.sql
```

Or import it using MySQL Workbench or phpMyAdmin.

### 3. Environment Configuration

Create a `.env` file in the backend root directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=beauty_parlor
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### 4. Create Admin User

Run the admin creation script:

```bash
node scripts/createAdmin.js
```

Default admin credentials:
- Email: `admin@beautyparlor.com`
- Password: `admin123`

**Important:** Change the password after first login!

### 5. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get single service
- `POST /api/services` - Create service (admin only)
- `PUT /api/services/:id` - Update service (admin only)
- `DELETE /api/services/:id` - Delete service (admin only)

### Availability
- `GET /api/availability/service/:serviceId` - Get availability for a service
- `POST /api/availability` - Set availability (admin only)

### Bookings
- `POST /api/bookings` - Create booking (authenticated)
- `GET /api/bookings/my-bookings` - Get user bookings
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/appointments` - Get all appointments
- `GET /api/admin/booking-history` - Get booking history

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Database Schema

The database includes the following tables:
- `users` - User accounts (users and admins)
- `services` - Beauty parlor services
- `availability` - Service time slot availability
- `bookings` - User bookings

See `database/schema.sql` for the complete schema.

