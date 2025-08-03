#!/bin/bash

echo "Starting WeSpend Expense Tracker..."

# Start the backend server
echo "Starting backend server..."
cd tracker-server
npm start &
SERVER_PID=$!

# Wait a moment for server to start
sleep 3

# Start the frontend client
echo "Starting frontend client..."
cd ../tracker-client
npm run dev &
CLIENT_PID=$!

echo "Application starting..."
echo "Backend server PID: $SERVER_PID"
echo "Frontend client PID: $CLIENT_PID"
echo ""
echo "Frontend will be available at: http://localhost:3000"
echo "Backend API will be available at: http://localhost:4000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait 