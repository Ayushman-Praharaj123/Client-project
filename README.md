<h1 align="center">🔶 All India Labour Union - MERN Stack Application 🔶</h1>

## 📋 Project Overview

A comprehensive full-stack web application for All India Labour Union that allows workers to register as members, manage their profiles, and enables admin management of the union.

## ✨ Features

### Worker Features
- 🔐 User Registration with Razorpay Payment Integration
- 💳 **Two Membership Tiers:** Annual (₹250/year) & Permanent (₹1000/lifetime)
- 📱 **UPI Scan & Pay** - Primary payment method (Google Pay, PhonePe, Paytm)
- 💰 **QR Code Payment** - Easy for labour workers
- 📱 Login with Phone Number & Password
- 🔑 OTP-based Password Reset via Email
- 👤 Profile Management (Edit Name, Email, Phone, Address)
- 📸 **Profile Photo Upload & Change**
- 🆔 Unique User ID Generation & ID Card Download
- 🧾 **Payment Receipt Download (PDF)**
- 📊 View Registration Growth Statistics
- 🏠 **Easy Navigation with Home Buttons on Auth Pages**

### Admin Features
- 👨‍💼 Admin & Super Admin Login
- 📊 Analytics Dashboard (User Growth, Website Visits)
- 👥 User Management (View, Search, Edit Users)
- ➕ **Add Workers Manually with Membership Selection**
- 💰 **Complete Transaction History** (Filter, Search, Export)
- 🧾 **Download Individual Payment Receipts**
- 📥 **Export Transactions to CSV**
- 📈 **Transaction Summary & Statistics**
- 📸 **Admin Profile Photo Upload**
- 📧 View Contact Form Submissions
- 🗑️ Delete Request System (Admin requests, Super Admin approves)

### General Features
- 🏠 Home Page with Hero Section
- 🎠 Animated Member Carousel
- 📈 Registration Growth Graph
- 📞 Contact Us Page
- ℹ️ About Us Page
- 📱 Fully Responsive Design
- 🎨 Orange & White Theme

## 🛠️ Tech Stack

### Frontend
- ⚛️ React 19
- 🎨 TailwindCSS 4
- 🔄 React Router DOM
- 📊 Recharts (for graphs)
- 🔥 React Hot Toast (notifications)
- 🔍 TanStack Query (data fetching)
- 💳 Razorpay Integration
- 🎯 Lucide React (icons)

### Backend
- 🟢 Node.js + Express
- 🍃 MongoDB + Mongoose
- 🔐 JWT Authentication
- 💳 Razorpay Payment Gateway
- 📧 Nodemailer (Email OTP)
- 📱 SMS Integration Support
- 🔒 bcryptjs (Password Hashing)
- 📁 **Multer (File Upload for Profile Photos)**
- 💾 **Transaction Tracking System**

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Razorpay Account (for payment integration)

### Installation

1. **Clone the repository**
```bash
cd "MERNSTACK projects/client project"
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

---

## 🧪 Environment Setup

### Backend `.env` (`/backend/.env`)

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/labour-union-test

# JWT Secret
JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production

# Razorpay Configuration (Test Mode)
RAZORPAY_KEY_ID=rzp_test_RPobt9ebWEo5KJ
RAZORPAY_KEY_SECRET=wXZbTJRzSHkEsySwcIj8klRr

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=All India Labour Union <noreply@labourunion.com>

# SMS Configuration (Optional - for OTP)
SMS_API_KEY=your-sms-api-key
SMS_SENDER_ID=LABOUR

# Admin Credentials
ADMIN_PHONE_1=9876543210
ADMIN_PASSWORD_1=Admin@123
ADMIN_PHONE_2=9876543211
ADMIN_PASSWORD_2=Admin@456

# Super Admin Credentials
SUPER_ADMIN_PHONE=9999999999
SUPER_ADMIN_PASSWORD=SuperAdmin@123

# Registration Fee
REGISTRATION_FEE=250
```

### Frontend `.env` (`/frontend/.env`)

```env
# API Base URL
VITE_API_BASE_URL=http://localhost:5001/api

# Razorpay Key (Public Key)
VITE_RAZORPAY_KEY_ID=rzp_test_RPobt9ebWEo5KJ
```

---

## 🔧 Running the Application

### Run Backend Server
```bash
cd backend
npm run dev
```
Backend will run on: `http://localhost:5001`

### Run Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend will run on: `http://localhost:5173`

---

## 👥 Default Login Credentials

### Worker Login
- Register a new account through the registration page
- Pay ₹250 registration fee via Razorpay
- Login with phone number and password

### Admin Login
- Phone: `9876543210`
- Password: `Admin@123`

### Super Admin Login
- Phone: `9999999999`
- Password: `SuperAdmin@123`

---

## 📁 Project Structure

```
client project/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── admin.controller.js
│   │   │   ├── contact.controller.js
│   │   │   └── analytics.controller.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Contact.js
│   │   │   ├── OTP.js
│   │   │   ├── DeleteRequest.js
│   │   │   └── Analytics.js
│   │   ├── routes/
│   │   │   ├── auth.route.js
│   │   │   ├── user.route.js
│   │   │   ├── admin.route.js
│   │   │   ├── contact.route.js
│   │   │   └── analytics.route.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   └── admin.middleware.js
│   │   ├── lib/
│   │   │   ├── db.js
│   │   │   ├── email.js
│   │   │   ├── payment.js
│   │   │   └── sms.js
│   │   └── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── MemberCard.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── lib/
│   │   │   └── axios.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   │   ├── logo.png
│   │   └── heroimage.png
│   ├── .env
│   └── package.json
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/create-order` - Create Razorpay order for registration
- `POST /api/auth/complete-registration` - Complete registration after payment
- `POST /api/auth/login` - Login (Worker/Admin/Super Admin)
- `POST /api/auth/logout` - Logout
- `POST /api/auth/send-otp` - Send OTP for password reset
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user

### User
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)
- `GET /api/users/members` - Get all members (Public)

### Admin
- `GET /api/admin/users` - Get all users with search (Admin)
- `GET /api/admin/users/:id` - Get user by ID (Admin)
- `PUT /api/admin/users/:id` - Update user (Admin)
- `POST /api/admin/add-worker` - Add worker manually (Admin)
- `POST /api/admin/delete-request` - Create delete request (Admin)
- `GET /api/admin/delete-requests` - Get delete requests (Super Admin)
- `POST /api/admin/process-delete-request` - Process delete request (Super Admin)
- `GET /api/admin/contacts` - Get all contacts (Admin)
- `PUT /api/admin/contacts/:id/resolve` - Mark contact as resolved (Admin)
- `GET /api/admin/analytics` - Get analytics data (Admin)

### Contact
- `POST /api/contact/submit` - Submit contact form (Public)

### Analytics
- `POST /api/analytics/track-visit` - Track website visit (Public)
- `GET /api/analytics/registration-growth` - Get registration growth data (Public)

---

## 🎨 Color Scheme

- **Primary Color (Gerua Orange)**: `#FF6B35`
- **Background**: White (`#FFFFFF`)
- **Text**: Gray shades
- **Accent**: Orange variations

---

## 📧 Email Configuration

To enable email OTP functionality:

1. Use Gmail SMTP or any other email service
2. For Gmail, enable "App Passwords":
   - Go to Google Account Settings
   - Security → 2-Step Verification → App Passwords
   - Generate an app password
   - Use this password in `EMAIL_PASSWORD` env variable

---

## 💳 Razorpay Setup

1. Sign up at [Razorpay](https://razorpay.com/)
2. Get Test API Keys from Dashboard
3. Add keys to `.env` files
4. For production, replace with Live API keys

**Test Cards:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

---

## 🚀 Production Deployment

### Build Frontend
```bash
cd frontend
npm run build
```

### Build & Deploy
```bash
# From root directory
npm run build
npm start
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use production MongoDB URI
- Use Razorpay Live API keys
- Configure production email service
- Set secure JWT secret

---

## 📝 Notes

1. **SMS Integration**: Currently logs OTP to console. Integrate with Twilio, MSG91, or similar service for production.
2. **Email Service**: Configure with your email provider credentials.
3. **MongoDB**: Use MongoDB Atlas for production deployment.
4. **Images**: Place `logo.png` and `heroimage.png` in `/frontend/public/` folder.

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or check Atlas connection string
- Verify network access in MongoDB Atlas

### Payment Integration Issues
- Check Razorpay API keys
- Ensure Razorpay script is loaded
- Check browser console for errors

### CORS Errors
- Verify frontend URL in backend CORS configuration
- Check if credentials are enabled

---

## 📄 License

This project is created for All India Labour Union.

---

## 👨‍💻 Developer Notes

- All passwords are hashed using bcryptjs
- JWT tokens expire in 7 days
- OTP expires in 10 minutes
- Registration fee is configurable via environment variable
- Admin credentials are stored in environment variables for security

---

## 🎯 Future Enhancements

- [ ] SMS OTP integration with actual SMS provider
- [ ] Email templates customization
- [ ] Advanced analytics and reporting
- [ ] Member benefits management
- [ ] Document upload functionality
- [ ] Multi-language support
- [ ] Mobile app development

---

**Built with ❤️ for All India Labour Union**
#   C l i e n t - p r o j e c t  
 