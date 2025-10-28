# 🧪 API Testing Guide

## Base URL
```
http://localhost:5001/api
```

---

## 🔐 Authentication APIs

### 1. Create Registration Order
**Endpoint:** `POST /auth/create-order`

**Request Body:**
```json
{
  "fullName": "John Doe",
  "phoneNumber": "9876543200",
  "email": "john@example.com",
  "address": "123 Main Street, Delhi",
  "workerType": "Construction Worker",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "order_xxxxx",
    "amount": 25000,
    "currency": "INR"
  },
  "amount": 250
}
```

---

### 2. Complete Registration
**Endpoint:** `POST /auth/complete-registration`

**Request Body:**
```json
{
  "fullName": "John Doe",
  "phoneNumber": "9876543200",
  "email": "john@example.com",
  "address": "123 Main Street, Delhi",
  "workerType": "Construction Worker",
  "password": "password123",
  "orderId": "order_xxxxx",
  "paymentId": "pay_xxxxx",
  "signature": "signature_xxxxx"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "9876543200",
    "userId": "AILU123456789",
    "workerType": "Construction Worker",
    "address": "123 Main Street, Delhi"
  }
}
```

---

### 3. Login
**Endpoint:** `POST /auth/login`

**Request Body (Worker):**
```json
{
  "phoneNumber": "9876543200",
  "password": "password123",
  "loginType": "worker"
}
```

**Request Body (Admin):**
```json
{
  "phoneNumber": "9876543210",
  "password": "Admin@123",
  "loginType": "admin"
}
```

**Request Body (Super Admin):**
```json
{
  "phoneNumber": "9999999999",
  "password": "SuperAdmin@123",
  "loginType": "superadmin"
}
```

**Response:**
```json
{
  "success": true,
  "user": { ... },
  "role": "worker"
}
```

---

### 4. Send OTP
**Endpoint:** `POST /auth/send-otp`

**Request Body:**
```json
{
  "phoneNumber": "9876543200"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to your email and phone number"
}
```

---

### 5. Verify OTP
**Endpoint:** `POST /auth/verify-otp`

**Request Body:**
```json
{
  "phoneNumber": "9876543200",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

---

### 6. Reset Password
**Endpoint:** `POST /auth/reset-password`

**Request Body:**
```json
{
  "phoneNumber": "9876543200",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

### 7. Get Current User
**Endpoint:** `GET /auth/me`

**Headers:**
```
Cookie: jwt=<token>
```

**Response:**
```json
{
  "success": true,
  "user": { ... },
  "role": "worker"
}
```

---

### 8. Logout
**Endpoint:** `POST /auth/logout`

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 👤 User APIs

### 1. Get User Profile
**Endpoint:** `GET /users/profile`

**Headers:** `Cookie: jwt=<token>`

**Response:**
```json
{
  "success": true,
  "user": { ... }
}
```

---

### 2. Update User Profile
**Endpoint:** `PUT /users/profile`

**Headers:** `Cookie: jwt=<token>`

**Request Body:**
```json
{
  "fullName": "John Updated",
  "email": "john.updated@example.com",
  "phoneNumber": "9876543201",
  "address": "456 New Street, Delhi"
}
```

**Response:**
```json
{
  "success": true,
  "user": { ... }
}
```

---

### 3. Get All Members
**Endpoint:** `GET /users/members`

**Response:**
```json
{
  "success": true,
  "members": [
    {
      "_id": "...",
      "fullName": "John Doe",
      "location": "Delhi",
      "workerType": "Construction Worker"
    }
  ]
}
```

---

## 👨‍💼 Admin APIs

### 1. Get All Users
**Endpoint:** `GET /admin/users?search=john&page=1&limit=20`

**Headers:** `Cookie: jwt=<admin_token>`

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

### 2. Get User by ID
**Endpoint:** `GET /admin/users/:id`

**Headers:** `Cookie: jwt=<admin_token>`

**Response:**
```json
{
  "success": true,
  "user": { ... }
}
```

---

### 3. Update User
**Endpoint:** `PUT /admin/users/:id`

**Headers:** `Cookie: jwt=<admin_token>`

**Request Body:**
```json
{
  "fullName": "Updated Name",
  "email": "updated@example.com"
}
```

---

### 4. Add Worker
**Endpoint:** `POST /admin/add-worker`

**Headers:** `Cookie: jwt=<admin_token>`

**Request Body:**
```json
{
  "fullName": "New Worker",
  "phoneNumber": "9876543202",
  "email": "newworker@example.com",
  "address": "Worker Address",
  "workerType": "Domestic Worker",
  "password": "password123"
}
```

---

### 5. Create Delete Request
**Endpoint:** `POST /admin/delete-request`

**Headers:** `Cookie: jwt=<admin_token>`

**Request Body:**
```json
{
  "userId": "user_id_to_delete",
  "reason": "Duplicate account"
}
```

---

### 6. Get Delete Requests
**Endpoint:** `GET /admin/delete-requests?status=pending`

**Headers:** `Cookie: jwt=<superadmin_token>`

**Response:**
```json
{
  "success": true,
  "deleteRequests": [...]
}
```

---

### 7. Process Delete Request
**Endpoint:** `POST /admin/process-delete-request`

**Headers:** `Cookie: jwt=<superadmin_token>`

**Request Body:**
```json
{
  "requestId": "request_id",
  "action": "approve"
}
```

---

### 8. Get Analytics
**Endpoint:** `GET /admin/analytics?days=30`

**Headers:** `Cookie: jwt=<admin_token>`

**Response:**
```json
{
  "success": true,
  "analytics": [...],
  "summary": {
    "totalUsers": 100,
    "totalContacts": 50,
    "unresolvedContacts": 10
  }
}
```

---

## 📧 Contact APIs

### Submit Contact Form
**Endpoint:** `POST /contact/submit`

**Request Body:**
```json
{
  "name": "Contact Name",
  "email": "contact@example.com",
  "phoneNumber": "9876543200",
  "message": "I have a problem..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Your message has been sent successfully. We will contact you soon.",
  "contact": { ... }
}
```

---

## 📊 Analytics APIs

### 1. Track Visit
**Endpoint:** `POST /analytics/track-visit`

**Response:**
```json
{
  "success": true
}
```

---

### 2. Get Registration Growth
**Endpoint:** `GET /analytics/registration-growth?days=30`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2025-01-01",
      "registrations": 5
    }
  ]
}
```

---

## 🧪 Testing with cURL

### Example: Login
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "9876543210",
    "password": "Admin@123",
    "loginType": "admin"
  }'
```

### Example: Get Users (with auth)
```bash
curl -X GET http://localhost:5001/api/admin/users \
  -H "Cookie: jwt=YOUR_JWT_TOKEN"
```

---

## 📝 Notes

- All protected routes require JWT token in cookies
- Admin routes require admin or superadmin role
- Super admin routes require superadmin role only
- Timestamps are automatically added to all records
- All responses include `success` boolean field

---

**Use Postman or Thunder Client for easier API testing!**

