# How to Run the Beauty Parlor Management System

## Quick Start

### Option 1: Using the Startup Script (Recommended)
```bash
./start.sh
```

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Backend will run on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd beauty-parlor-frontend
npm start
```
Frontend will run on: http://localhost:3000

## Access the Application

1. Open your browser and go to: **http://localhost:3000**

2. **Login as Admin:**
   - Email: `admin@beautyparlor.com`
   - Password: `admin123`

3. **Or Register as a New User:**
   - Click "Register here" on the login page
   - Create your account

## System Status

✅ **Database**: Connected and configured
✅ **Backend**: All routes configured
✅ **Frontend**: All components ready
✅ **Admin User**: Created
✅ **Availability Slots**: Populated (2400 slots for next 30 days)
✅ **Sample Services**: 8 services loaded

## Available Functionalities

### For Users:
- ✅ User Registration & Login
- ✅ Browse Services
- ✅ View Service Details
- ✅ Book Appointments
- ✅ View Booking History
- ✅ Cancel Bookings

### For Admins:
- ✅ Admin Dashboard with Statistics
- ✅ View All Appointments
- ✅ View Booking History
- ✅ Manage Services (Create, Update, Delete)
- ✅ Set Availability Slots

## API Endpoints

### Authentication
- `POST /api/auth/login` - User/Admin login
- `POST /api/auth/register` - User registration

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get single service
- `POST /api/services` - Create service (admin)
- `PUT /api/services/:id` - Update service (admin)
- `DELETE /api/services/:id` - Delete service (admin)

### Availability
- `GET /api/availability/service/:serviceId` - Get availability
- `POST /api/availability` - Set availability (admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/appointments` - All appointments
- `GET /api/admin/booking-history` - Booking history

## Troubleshooting

### Backend won't start
- Check if MySQL is running
- Verify `.env` file in `backend/` directory has correct database credentials
- Check if port 5000 is available

### Frontend won't start
- Check if port 3000 is available
- Run `npm install` in `beauty-parlor-frontend/` directory
- Check browser console for errors

### Database connection errors
- Ensure MySQL is running
- Verify database credentials in `backend/.env`
- Run: `node backend/scripts/testConnection.js` to test connection

### Can't login
- Verify admin user exists: `node backend/scripts/createAdmin.js`
- Check browser console for API errors
- Clear browser localStorage and try again

## Configuration

### Backend Configuration (`backend/.env`)
```
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=admin123
DB_NAME=beauty_parlor
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024
JWT_EXPIRE=7d
NODE_ENV=development
```

### Frontend Configuration
- API URL is configured in `beauty-parlor-frontend/src/services/api.js`
- Default: `http://localhost:5000/api`

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development
```bash
cd beauty-parlor-frontend
npm start  # React dev server with hot reload
```

## Next Steps

1. **Change Admin Password**: After first login, update the admin password
2. **Customize Services**: Add or modify services through admin dashboard
3. **Manage Availability**: Set specific availability slots for services
4. **Test Bookings**: Create test user accounts and make bookings

## Support

For detailed setup instructions, see:
- `QUICK_START.md` - Quick setup guide
- `SETUP_GUIDE.md` - Complete setup guide
- `XAMPP_SETUP.md` - XAMPP-specific setup

