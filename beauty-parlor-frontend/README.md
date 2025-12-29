# Beauty Parlor Management System - Frontend

React-based frontend for the Beauty Parlor Management System.

## Features

- **User Authentication**: Login and registration with JWT
- **Service Browsing**: View all available services
- **Booking System**: Book appointments with date and time selection
- **Booking Management**: View and cancel bookings
- **Admin Dashboard**: View all appointments and statistics
- **Responsive Design**: Works on desktop and mobile devices

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

### 3. Backend Configuration

Make sure the backend server is running on `http://localhost:5000`

If your backend runs on a different port, update the API URL in:
- `src/services/api.js`
- `src/context/AuthContext.js`

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Login.js
│   ├── Register.js
│   ├── Navbar.js
│   ├── ProtectedRoute.js
│   ├── BookingForm.js
│   └── ServiceCard.js
├── pages/              # Page components
│   ├── Services.js
│   ├── BookingHistory.js
│   └── AdminDashboard.js
├── context/            # React Context
│   └── AuthContext.js
├── services/           # API services
│   └── api.js
└── App.js              # Main app component
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## User Roles

### Regular User
- View services
- Book appointments
- View and cancel own bookings

### Admin
- Access admin dashboard
- View all appointments
- Manage services (add/edit/delete)
- View statistics

## Default Admin Credentials

- Email: `admin@beautyparlor.com`
- Password: `admin123`

**Note:** Create admin user via backend script first.
