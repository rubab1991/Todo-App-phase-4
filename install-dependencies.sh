#!/bin/bash

# Script to install all dependencies for both frontend and backend
# Ensures compatibility with Ubuntu WSL environment

echo "Starting dependency installation for Phase-3 Chatbot..."

# Frontend dependency installation
echo "Installing frontend dependencies..."
cd frontend/

# Clean existing node_modules and lock files
echo "Cleaning existing frontend dependencies..."
rm -rf node_modules
rm -f package-lock.json

# Install frontend dependencies
echo "Installing npm packages..."
npm install

if [ $? -eq 0 ]; then
    echo "✓ Frontend dependencies installed successfully"
else
    echo "✗ Frontend dependency installation failed"
    exit 1
fi

# Go back to project root
cd ..

# Backend dependency installation
echo "Installing backend dependencies..."
cd backend/

# Create and activate virtual environment
echo "Creating Python virtual environment..."
python -m venv venv

# Activate virtual environment and install dependencies
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    source venv/Scripts/activate
else
    # Linux/Unix/WSL
    source venv/bin/activate
fi

# Upgrade pip
pip install --upgrade pip

# Install backend dependencies
echo "Installing Python packages from requirements.txt..."
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✓ Backend dependencies installed successfully"
else
    echo "✗ Backend dependency installation failed"
    exit 1
fi

echo "✓ All dependencies installed successfully!"
echo ""
echo "Frontend dependencies installed in: $(pwd)/../frontend/node_modules"
echo "Backend dependencies installed in: $(pwd)/venv/lib/python*/site-packages"
echo ""
echo "To activate backend virtual environment in the future, run:"
echo "cd backend && source venv/bin/activate"
echo ""
echo "To start frontend development server:"
echo "cd frontend && npm run dev"
echo ""
echo "To start backend development server:"
echo "cd backend && source venv/bin/activate && uvicorn main:app --reload"