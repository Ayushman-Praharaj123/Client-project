# 🔌 API Endpoints Reference

## Base URL
- **Backend:** http://localhost:5001
- **API Base:** http://localhost:5001/api

---

## 🔐 Authentication Endpoints

### POST /api/auth/create-order
Create Razorpay order for registration

**Request Body:**
```json
{
  "fullName": "John Doe",
  "phoneNumber": "9876543210",
  "email": "john@example.com",
  "address": "123 Street, City",
  "workerType": "Construction Worker",
  "password": "password123",
  "membershipType": "annual" // or "permanent"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "order_...",
  "amount": 250, // or 1000
  "currency": "INR",
  "membershipType": "annual"
}
```

---

### POST /api/auth/complete-registration
Complete registration after payment

**Request Body:**
```json
{
  "fullName": "John Doe",
  "phoneNumber": "9876543210",
  "email": "john@example.com",
  "address": "123 Street, City",
  "workerType": "Construction Worker",
  "password": "password123",
  "membershipType": "annual",
  "amount": 250,
  "orderId": "order_...",
  "paymentId": "pay_...",
  "signature": "signature..."
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "9876543210",
    "userId": "AILU001234",
    "workerType": "Construction Worker",
    "membershipType": "annual",
    "membershipExpiry": "2025-10-19T..."
  }
}
```

---

### POST /api/auth/login
Worker login

**Request Body:**
```json
{
  "phoneNumber": "9876543210",
  "password": "password123"
}
```

---

### POST /api/auth/admin-login
Admin/Super Admin login

**Request Body:**
```json
{
  "phoneNumber": "9876543210",
  "password": "Admin@123"
}
```

---

### POST /api/auth/send-password-reset-otp
Send OTP to email for password reset

**Request Body:**
```json
{
  "phoneNumber": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to your email and phone"
}
```

---

### POST /api/auth/reset-password
Reset password with OTP

**Request Body:**
```json
{
  "phoneNumber": "9876543210",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

---

## 👤 User Endpoints

### GET /api/users/profile
Get user profile (Protected)

**Headers:**
```
Cookie: jwt=<token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "9876543210",
    "userId": "AILU001234",
    "workerType": "Construction Worker",
    "membershipType": "annual",
    "membershipExpiry": "2025-10-19T...",
    "profilePic": "/uploads/profiles/profile-123456.jpg"
  }
}
```

---

### PUT /api/users/profile
Update user profile (Protected)

**Request Body:**
```json
{
  "fullName": "John Updated",
  "email": "newemail@example.com",
  "phoneNumber": "9999999999",
  "address": "New Address"
}
```

---

### POST /api/users/upload-photo
Upload profile photo (Protected)

**Request:**
- Content-Type: multipart/form-data
- Field name: "photo"
- File: Image file (max 5MB)

**Response:**
```json
{
  "success": true,
  "profilePic": "/uploads/profiles/profile-123456.jpg",
  "message": "Profile photo uploaded successfully"
}
```

---

### GET /api/users/transaction
Get user's transaction (Protected)

**Response:**
```json
{
  "success": true,
  "transaction": {
    "_id": "...",
    "userId": "...",
    "orderId": "order_...",
    "paymentId": "pay_...",
    "amount": 250,
    "membershipType": "annual",
    "addedBy": "self",
    "paymentDate": "2024-10-19T...",
    "status": "completed"
  }
}
```

---

## 👨‍💼 Admin Endpoints

### GET /api/admin/users
Get all users (Admin/Super Admin)

**Query Parameters:**
- `search` - Search by name, email, phone, userId
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "users": [...],
  "totalPages": 5,
  "currentPage": 1,
  "total": 100
}
```

---

### GET /api/admin/users/:id
Get user by ID (Admin/Super Admin)

---

### PUT /api/admin/users/:id
Update user (Admin/Super Admin)

---

### POST /api/admin/add-worker
Add worker manually (Admin/Super Admin)

**Request Body:**
```json
{
  "fullName": "Worker Name",
  "phoneNumber": "9999999999",
  "email": "worker@example.com",
  "address": "Worker Address",
  "workerType": "Construction Worker",
  "password": "password123",
  "membershipType": "annual" // or "permanent"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Worker added successfully",
  "user": {
    "_id": "...",
    "fullName": "Worker Name",
    "email": "worker@example.com",
    "phoneNumber": "9999999999",
    "userId": "AILU001235",
    "membershipType": "annual"
  }
}
```

---

### GET /api/admin/transactions
Get all transactions (Admin/Super Admin)

**Query Parameters:**
- `membershipType` - Filter by "annual" or "permanent"
- `startDate` - Filter from date (YYYY-MM-DD)
- `endDate` - Filter to date (YYYY-MM-DD)
- `page` - Page number
- `limit` - Items per page

**Response:**
```json
{
  "success": true,
  "transactions": [
    {
      "_id": "...",
      "userId": {
        "fullName": "John Doe",
        "email": "john@example.com",
        "phoneNumber": "9876543210",
        "userId": "AILU001234"
      },
      "orderId": "order_...",
      "paymentId": "pay_...",
      "amount": 250,
      "membershipType": "annual",
      "addedBy": "self",
      "paymentDate": "2024-10-19T...",
      "status": "completed"
    }
  ],
  "totalPages": 3,
  "currentPage": 1,
  "total": 50
}
```

---

### GET /api/admin/transactions/summary
Get transaction summary (Admin/Super Admin)

**Response:**
```json
{
  "success": true,
  "summary": {
    "totalFees": 25000,
    "totalTransactions": 100,
    "byMembershipType": [
      { "_id": "annual", "total": 15000, "count": 60 },
      { "_id": "permanent", "total": 10000, "count": 10 }
    ],
    "byAddedBy": [
      { "_id": "self", "total": 20000, "count": 80 },
      { "_id": "9876543210", "total": 5000, "count": 20 }
    ],
    "monthlyBreakdown": [
      {
        "_id": { "year": 2024, "month": 10 },
        "total": 5000,
        "count": 20
      }
    ]
  }
}
```

---

### POST /api/admin/upload-photo
Upload admin profile photo (Admin/Super Admin)

**Request:**
- Content-Type: multipart/form-data
- Field name: "photo"
- File: Image file (max 5MB)

---

### GET /api/admin/analytics
Get analytics (Admin/Super Admin)

**Query Parameters:**
- `days` - Number of days (default: 30)

---

### GET /api/admin/contacts
Get all contact messages (Admin/Super Admin)

---

### POST /api/admin/delete-request
Create delete request (Admin)

---

### GET /api/admin/delete-requests
Get all delete requests (Super Admin only)

---

### POST /api/admin/process-delete-request
Approve/reject delete request (Super Admin only)

---

## 📁 Static Files

### GET /uploads/profiles/:filename
Get uploaded profile photo

**Example:**
```
http://localhost:5001/uploads/profiles/profile-1234567890.jpg
```

---

## 🔒 Authentication

Most endpoints require authentication via JWT cookie.

**Cookie Name:** `jwt`

**How it works:**
1. Login via `/api/auth/login` or `/api/auth/admin-login`
2. JWT token set in HTTP-only cookie
3. Cookie automatically sent with subsequent requests
4. Backend verifies token in middleware

---

## 📊 Response Codes

- **200** - Success
- **201** - Created
- **400** - Bad Request (validation error)
- **401** - Unauthorized (not logged in)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **500** - Internal Server Error

---

## 🧪 Testing with Postman/Thunder Client

### 1. Login
```
POST http://localhost:5001/api/auth/login
Body: { "phoneNumber": "9876543210", "password": "password123" }
```

### 2. Get Profile (with cookie from login)
```
GET http://localhost:5001/api/users/profile
```

### 3. Upload Photo
```
POST http://localhost:5001/api/users/upload-photo
Body: form-data
Key: photo
Value: [Select file]
```

### 4. Get Transactions (Admin)
```
GET http://localhost:5001/api/admin/transactions?membershipType=annual
```

---

## 💡 Tips

1. **CORS:** Frontend must be on http://localhost:5173
2. **Cookies:** Use credentials: true in axios
3. **File Upload:** Use FormData for photo uploads
4. **Filters:** Combine query parameters with &
5. **Pagination:** Use page and limit parameters

---

## 🎯 Quick Reference

**User Registration:** POST /api/auth/create-order → POST /api/auth/complete-registration
**User Login:** POST /api/auth/login
**Admin Login:** POST /api/auth/admin-login
**Upload Photo:** POST /api/users/upload-photo
**Get Transaction:** GET /api/users/transaction
**View All Transactions:** GET /api/admin/transactions
**Add Worker:** POST /api/admin/add-worker

---

**All endpoints are implemented and working!** ✅

