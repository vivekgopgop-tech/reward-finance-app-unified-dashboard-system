# Reward Finance App   Unified Dashboard System

## Overview
A comprehensive financial application with 6 integrated dashboards providing user authentication, deposit rewards, daily games, referral system, wallet management, and admin controls. All features are connected through a unified navigation system with Hindi language support.

## Core Features

### 1. Home Dashboard
- User registration via Google account or mobile number with 6-digit OTP verification
- Password creation during signup process
- Login system using mobile number and password
- Integration with backend user profile management
- Welcome interface with navigation to other dashboards

### 2. Deposit Rewards Dashboard
- Amount selection interface for deposits
- Payment method selection: PhonePe, Google Pay, Paytm, BHIM
- Dynamic UPI QR code generation using base UPI ID `95232483@axl`
- Auto-filled amount embedding in QR codes
- Reward calculation system:
  - ₹100 → ₹3 reward
  - ₹200 → ₹6 reward  
  - ₹300 → ₹20 reward
  - ₹400 → ₹40 reward
  - ₹500-1000 → 4% reward
  - ₹1000-90000 → 3% reward
- Current wallet balance display with verified deposit rewards

### 3. Daily Reward Dashboard
- Interactive spinning wheel game interface
- Daily reward range: ₹1-₹5 per spin
- Once-per-day limitation enforcement
- Real-time wallet balance updates after game completion
- Game state management in frontend

### 4. Referral Dashboard
- Unique referral link generation for each user
- Social sharing integration (WhatsApp, Telegram, etc.)
- Referral bonus system:
  - Referrer earns ₹5 per successful signup
  - New user receives ₹15 instant bonus
- Referral tracking and earnings display
- Balance contribution breakdown (referral vs daily rewards)

### 5. Wallet Dashboard
- Comprehensive balance display: total, pending, and verified amounts
- Deposit range support: ₹100-₹100000 with 3% reward processing
- Withdrawal system:
  - Withdrawal range: ₹20-₹100000
  - Once per 24-hour limitation
  - UPI-based withdrawal requests
- Admin verification workflow for withdrawals
- Transaction history and status tracking

### 6. Admin Dashboard
- Restricted access to authorized administrators only
- Withdrawal request management and verification controls
- User account oversight and management
- System-wide transaction monitoring
- Admin-only operations for app maintenance

## Navigation System
- Unified tab-based navigation connecting all 6 dashboards
- Admin Dashboard access embedded directly in the UnifiedDashboard page
- "Open Admin Panel" button visible only to authorized users (email: `vivekgopgop@gmail.com`, `Kumarirani71318@gmail.com` or phone: `9153873434`)
- Regular users cannot see or access the admin panel link
- Seamless switching between different application sections
- Consistent user experience across all features

## Authentication & User Management
- Google OAuth integration
- Mobile number verification with OTP
- Password-based authentication
- User profile creation and management
- Session management across dashboards
- Admin privilege verification system

## Admin Access Control
- Predefined admin users with emails `vivekgopgop@gmail.com`, `Kumarirani71318@gmail.com` and phone `9153873434`
- First registered user automatically granted admin privileges
- Admin panel button visibility based on user email/phone verification
- Direct navigation to AdminDashboard for authorized users only
- Secure admin-only operations and data access

## Backend Data Storage
- User profiles with authentication credentials and verification status
- Admin user records with privilege levels and contact information
- Deposit requests with amounts, payment methods, and reward calculations
- Daily game participation records and earnings
- Referral relationships and bonus tracking
- Wallet balances (total, pending, verified) and transaction history
- Withdrawal requests with verification status
- UPI QR code metadata and payment verification records

## Backend Operations
- User registration and authentication processing
- Admin privilege verification and access control for both authorized admin emails
- OTP generation and verification
- Dynamic UPI QR code generation with embedded payment details
- Reward calculation and wallet balance management
- Daily game eligibility checking and reward distribution
- Referral link generation and bonus processing
- Withdrawal request handling and admin verification workflow
- Real-time balance updates across all dashboard activities
- Admin-only operations for system management accessible to both authorized admins
