#!/bin/bash

# SecureSight Dashboard Deployment Script

echo " SecureSight Dashboard Deployment"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo " Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo " Node.js found: $(node --version)"

# Install dependencies
echo " Installing dependencies..."
npm install

# Generate Prisma client
echo " Generating Prisma client..."
npx prisma generate

# Run database migrations
echo " Running database migrations..."
npx prisma migrate deploy

# Seed the database
echo " Seeding database with sample data..."
npx prisma db seed

# Build the application
echo " Building application..."
npm run build

echo ""
echo " Deployment complete!"
echo " Start the application with: npm run dev"
echo " Open browser to: http://localhost:3000"
echo ""
echo " Features available:"
echo "   • Interactive dashboard with incident management"
echo "   • 24-hour timeline with draggable scrubber"
echo "   • Real-time incident resolution"
echo "   • 15 sample incidents across 3 cameras"
