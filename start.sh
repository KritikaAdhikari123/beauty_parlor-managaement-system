#!/bin/bash

# Beauty Parlor Management System - Startup Script

echo "=========================================="
echo "Beauty Parlor Management System"
echo "=========================================="
echo ""

# Check if MySQL is running
echo "Checking MySQL connection..."
mysql -u root -padmin123 -e "SELECT 1" > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "⚠️  Warning: Could not connect to MySQL. Please ensure MySQL is running."
    echo "   You may need to update the password in backend/.env"
else
    echo "✓ MySQL connection successful"
fi

echo ""
echo "Starting Backend Server..."
cd backend
npm start &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"
echo "Backend running on http://localhost:5001"
echo ""

# Wait a bit for backend to start
sleep 3

echo "Starting Frontend Server..."
cd ../beauty-parlor-frontend
npm start &
FRONTEND_PID=$!
echo "Frontend started with PID: $FRONTEND_PID"
echo "Frontend running on http://localhost:3000"
echo ""

echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Access the application at: http://localhost:3000"
echo ""
echo "Admin Credentials:"
echo "  Email: admin@beautyparlor.com"
echo "  Password: admin123"
echo ""
echo "To stop the servers, press Ctrl+C or run:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Wait for user interrupt
wait

