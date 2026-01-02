# Booking Status Control Flow - Documentation

## 🔒 Strict Booking Status Control

### Status Enum Values
The database enforces the following status values (UPPERCASE):
- `PENDING` - Initial status when user creates booking
- `CONFIRMED` - Admin has confirmed the booking
- `CANCEL_REQUESTED` - User has requested cancellation
- `CANCELLED` - Admin has approved cancellation or rejected booking
- `COMPLETED` - Service has been completed

## 📋 Booking Lifecycle

### 1. User Creates Booking
- **Status**: Automatically set to `PENDING`
- **Action**: User submits booking request
- **Result**: Booking is created but NOT confirmed
- **Slot Availability**: Slot remains available until admin confirms

### 2. Admin Confirms Booking
- **Status Change**: `PENDING` → `CONFIRMED`
- **Action**: Admin clicks "Confirm" button
- **Result**: 
  - Slot is marked as unavailable
  - User receives confirmed booking
- **Who Can Do**: **ONLY ADMIN**

### 3. Admin Rejects Booking
- **Status Change**: `PENDING` → `CANCELLED`
- **Action**: Admin clicks "Reject" button
- **Result**: Booking is cancelled, slot remains available
- **Who Can Do**: **ONLY ADMIN**

### 4. User Requests Cancellation
- **Status Change**: `CONFIRMED` or `PENDING` → `CANCEL_REQUESTED`
- **Action**: User clicks "Request Cancellation" button
- **Result**: 
  - Status changes to `CANCEL_REQUESTED`
  - User can provide cancellation reason
  - Admin must approve or reject
- **Who Can Do**: **USER** (only if status is PENDING or CONFIRMED)

### 5. Admin Approves Cancellation
- **Status Change**: `CANCEL_REQUESTED` → `CANCELLED`
- **Action**: Admin clicks "Approve Cancellation" button
- **Result**: 
  - Booking is cancelled
  - Slot becomes available again
- **Who Can Do**: **ONLY ADMIN**

### 6. Admin Rejects Cancellation Request
- **Status Change**: `CANCEL_REQUESTED` → `CONFIRMED`
- **Action**: Admin clicks "Reject Cancellation" button
- **Result**: Booking remains confirmed
- **Who Can Do**: **ONLY ADMIN**

### 7. Admin Marks as Completed
- **Status Change**: `CONFIRMED` → `COMPLETED`
- **Action**: Admin clicks "Mark Completed" button
- **Result**: Service is marked as completed
- **Who Can Do**: **ONLY ADMIN**

## 🚫 User Restrictions

Users CANNOT:
- ❌ Directly confirm bookings
- ❌ Directly cancel bookings (only request cancellation)
- ❌ Change booking status in any way
- ❌ Mark bookings as completed

Users CAN:
- ✅ View their booking status (read-only)
- ✅ Request cancellation (if status is PENDING or CONFIRMED)
- ✅ View cancellation reason if provided

## 🔐 Admin Controls

Admins CAN:
- ✅ Confirm pending bookings
- ✅ Reject pending bookings
- ✅ Approve cancellation requests
- ✅ Reject cancellation requests
- ✅ Mark confirmed bookings as completed
- ✅ Assign stylists to bookings
- ✅ Cancel any booking

## 📊 Status Display

### User View (BookingHistory.js)
- Shows status badge with appropriate color
- "Request Cancellation" button (only for PENDING/CONFIRMED)
- Read-only status display
- Shows cancellation reason if provided

### Admin View (AdminDashboard.js)
- Shows all bookings with current status
- Action buttons based on current status:
  - **PENDING**: "Confirm" (green) | "Reject" (red)
  - **CONFIRMED**: "Mark Completed" (blue) | "Cancel" (red)
  - **CANCEL_REQUESTED**: "Approve Cancellation" (orange) | "Reject Cancellation" (green)
- Stylist assignment dropdown
- Filter by status and date

## 🗄️ Database Schema

```sql
status ENUM('PENDING','CONFIRMED','CANCEL_REQUESTED','CANCELLED','COMPLETED') DEFAULT 'PENDING'
```

## 🔄 API Endpoints

### User Endpoints
- `POST /api/bookings` - Creates booking with PENDING status
- `PUT /api/bookings/:id/cancel` - Requests cancellation (status → CANCEL_REQUESTED)
- `GET /api/bookings/my-bookings` - Gets user bookings (read-only)

### Admin Endpoints
- `PUT /api/bookings/:id/status` - Updates booking status (ONLY ADMIN)
  - Body: `{ status: 'CONFIRMED'|'CANCELLED'|'COMPLETED', stylist_id?: number }`
  - Validates status transitions
  - Updates slot availability accordingly

## ✅ Validation Rules

1. **Booking Creation**: Always starts as `PENDING`
2. **Status Transitions**: Only admin can change status
3. **Slot Management**: 
   - Slot marked unavailable only when status changes to `CONFIRMED`
   - Slot becomes available when status changes to `CANCELLED`
4. **Cancellation Requests**: Only allowed for `PENDING` or `CONFIRMED` bookings

## 🎯 Key Implementation Points

1. **Backend (`backend/routes/bookings.js`)**:
   - Booking creation sets status to `PENDING`
   - Does NOT mark slot as unavailable initially
   - Admin status update endpoint validates transitions
   - Manages slot availability based on status changes

2. **Frontend User (`pages/BookingHistory.js`)**:
   - Read-only status display
   - "Request Cancellation" button (not direct cancel)
   - Shows appropriate status badges

3. **Frontend Admin (`pages/AdminDashboard.js`)**:
   - Comprehensive booking management table
   - Status-based action buttons
   - Stylist assignment
   - Filter and search capabilities

This strict control ensures that:
- Users cannot bypass admin approval
- All bookings require admin confirmation
- Cancellations are properly managed
- System maintains data integrity

