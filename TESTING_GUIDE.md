# 🧪 Complete Testing Guide

## 🚀 Quick Start

### 1. Start Backend Server
```bash
cd backend
npm run dev
```
✅ Server should start on: http://localhost:5001
✅ MongoDB should connect successfully

### 2. Start Frontend Server
```bash
cd frontend
npm run dev
```
✅ Frontend should start on: http://localhost:5173

---

## 📋 Feature Testing Checklist

### ✅ Feature 1: Email OTP for Password Reset

**Steps:**
1. Go to http://localhost:5173/login
2. Click "Forgot Password" link
3. Enter a registered phone number
4. Click "Send OTP"
5. Check the registered email for OTP
6. Enter OTP and new password
7. Submit to reset password

**Expected Result:**
- ✅ OTP sent to email
- ✅ Password reset successful
- ✅ Can login with new password

---

### ✅ Feature 2: Home Button on Auth Forms

**Steps:**
1. Go to http://localhost:5173/register
2. Look for "Back to Home" button at top left
3. Click the button
4. Should navigate to home page
5. Repeat for http://localhost:5173/login

**Expected Result:**
- ✅ Home button visible on both pages
- ✅ Clicking navigates to home page
- ✅ Icon and text displayed correctly

---

### ✅ Feature 3: Membership Tier Options

**Steps:**
1. Go to http://localhost:5173/register
2. Fill in all required fields:
   - Full Name
   - Phone Number (10 digits)
   - Email
   - Address
   - Worker Type
   - Password
3. Scroll to "Membership Type" section
4. See two cards: Annual (₹250) and Permanent (₹1000)
5. Click on "Permanent Membership" card
6. Card should highlight with orange border
7. Click "Register & Pay"
8. Complete Razorpay payment
9. Check database for transaction record

**Expected Result:**
- ✅ Membership selection cards displayed
- ✅ Selected card highlights
- ✅ Payment amount matches selection
- ✅ Transaction created in database
- ✅ User created with correct membershipType
- ✅ membershipExpiry set correctly (1 year for annual, null for permanent)

**Database Check:**
```javascript
// In MongoDB
db.users.findOne({ email: "test@example.com" })
// Should show: membershipType: "permanent", membershipExpiry: null

db.transactions.findOne({ userId: ObjectId("...") })
// Should show: amount: 1000, membershipType: "permanent"
```

---

### ✅ Feature 4: User Profile Photo Upload

**Steps:**
1. Login as a user
2. Go to Profile page
3. See profile photo circle in header
4. Click camera icon on bottom-right of photo
5. Select an image file (< 5MB)
6. Preview should appear below header
7. Click "Upload" button
8. Wait for success message
9. Photo should update immediately

**Expected Result:**
- ✅ Camera icon visible
- ✅ File selection works
- ✅ Preview displays correctly
- ✅ Upload successful
- ✅ Photo displays in profile
- ✅ Photo saved in backend/uploads/profiles/
- ✅ Photo accessible at http://localhost:5001/uploads/profiles/filename.jpg

**Test Edge Cases:**
- Try uploading file > 5MB (should show error)
- Try uploading non-image file (should show error)
- Upload new photo to replace existing one

---

### ✅ Feature 5: Admin Profile Photo Upload

**Steps:**
1. Login as admin (phone: 9876543210, password: Admin@123)
2. Go to admin dashboard
3. Same process as user photo upload
4. Upload admin profile photo

**Expected Result:**
- ✅ Same functionality as user upload
- ✅ Photo saved and displayed

---

### ✅ Feature 6: Payment Option for Admin-Added Workers

**Steps:**
1. Login as admin
2. Click "Add Worker" in sidebar
3. Fill in worker details:
   - Full Name: "Test Worker"
   - Phone: "9999999999"
   - Email: "worker@test.com"
   - Address: "Test Address"
   - Worker Type: "Construction Worker"
   - Password: "Test@123"
4. Scroll to "Membership Type" section
5. Select "Annual Membership" (₹250)
6. Click "Add Worker"
7. Success message should appear
8. Check database

**Expected Result:**
- ✅ Membership selection cards displayed
- ✅ Worker created successfully
- ✅ Worker has membershipType: "annual"
- ✅ membershipExpiry set to 1 year from now
- ✅ isPaid: true (admin added)
- ✅ No transaction created (free registration by admin)

**Database Check:**
```javascript
db.users.findOne({ email: "worker@test.com" })
// Should show: 
// - membershipType: "annual"
// - membershipExpiry: Date (1 year from now)
// - isPaid: true
```

---

### ✅ Feature 7: Transaction History Section

**Steps:**
1. Login as admin/superadmin
2. Click "Transaction History" in sidebar
3. View summary cards at top:
   - Total Fees Collected
   - Total Transactions
   - By Membership Type
   - By Source
4. Use filters:
   - Select "Annual" membership type
   - Set date range
   - Click "Clear Filters"
5. View transaction table
6. Click "Receipt" button on any transaction
7. PDF should download
8. Click "Export CSV" button
9. CSV file should download

**Expected Result:**
- ✅ Summary cards show correct data
- ✅ Filters work correctly
- ✅ Transaction table displays all transactions
- ✅ User details populated correctly
- ✅ Receipt PDF downloads with correct data
- ✅ CSV export works
- ✅ All transactions visible to admin

**Test Filters:**
- Filter by Annual membership
- Filter by Permanent membership
- Filter by date range
- Combine filters

---

### ✅ Feature 8: Payment Receipt Download in User Profile

**Steps:**
1. Login as a user who has completed payment
2. Go to Profile page
3. Look for "Download Receipt" button (blue button)
4. Click the button
5. PDF should download
6. Open PDF and verify:
   - AILU header
   - Transaction ID
   - Payment ID
   - User details
   - Membership type
   - Amount paid
   - Date

**Expected Result:**
- ✅ Receipt button visible (only if user has transaction)
- ✅ PDF downloads successfully
- ✅ PDF contains all correct information
- ✅ Professional formatting

**If button not visible:**
- User hasn't completed payment yet
- Register a new user with payment to test

---

## 🔍 Complete User Journey Test

### Journey 1: New User Registration

1. **Home Page**
   - Go to http://localhost:5173
   - Click "Register" button

2. **Registration**
   - Click "Back to Home" (should work)
   - Click "Register" again
   - Fill all fields
   - Select "Permanent Membership" (₹1000)
   - Click "Register & Pay"
   - Complete Razorpay payment (use test card)

3. **After Registration**
   - Should redirect to home page
   - Should be logged in
   - Click "Profile" in navbar

4. **Profile Page**
   - See user details
   - Click camera icon
   - Upload profile photo
   - Click "Download ID Card" (should work)
   - Click "Download Receipt" (should work)
   - Verify both PDFs download correctly

### Journey 2: Admin Workflow

1. **Login as Admin**
   - Phone: 9876543210
   - Password: Admin@123

2. **Dashboard**
   - View statistics
   - Click "Add Worker"

3. **Add Worker**
   - Fill worker details
   - Select "Annual Membership"
   - Submit
   - Worker should be created

4. **View Users**
   - Click "View Users"
   - Search for newly added worker
   - Click "Edit" to view details

5. **Transaction History**
   - Click "Transaction History"
   - See all transactions
   - Download a receipt
   - Export to CSV

6. **Analytics**
   - Click "Analytics"
   - View charts and statistics

---

## 🐛 Common Issues & Solutions

### Issue 1: Backend not starting
**Solution:**
```bash
cd backend
npm install
npm run dev
```

### Issue 2: Frontend not starting
**Solution:**
```bash
cd frontend
npm install
npm run dev
```

### Issue 3: Photos not displaying
**Solution:**
- Check backend/uploads/profiles/ folder exists
- Verify server.js has static file serving
- Check browser console for CORS errors

### Issue 4: Transaction not created
**Solution:**
- Check MongoDB connection
- Verify Transaction model imported in auth.controller.js
- Check browser console for errors

### Issue 5: Receipt download not working
**Solution:**
- Ensure user has completed payment
- Check transaction exists in database
- Verify jsPDF is installed

---

## 📊 Database Verification

### Check User with Membership
```javascript
db.users.findOne({ email: "your@email.com" })
```
Should show:
```javascript
{
  membershipType: "annual" or "permanent",
  membershipExpiry: Date or null,
  profilePic: "/uploads/profiles/filename.jpg" (if uploaded)
}
```

### Check Transaction
```javascript
db.transactions.find().sort({ createdAt: -1 }).limit(5)
```
Should show recent transactions with:
```javascript
{
  userId: ObjectId,
  orderId: "order_...",
  paymentId: "pay_...",
  amount: 250 or 1000,
  membershipType: "annual" or "permanent",
  addedBy: "self",
  status: "completed"
}
```

---

## ✅ Final Checklist

Before considering testing complete, verify:

- [ ] Email OTP works for password reset
- [ ] Home buttons work on Register and Login pages
- [ ] Annual membership (₹250) registration works
- [ ] Permanent membership (₹1000) registration works
- [ ] Transaction created on payment
- [ ] User profile photo upload works
- [ ] Admin profile photo upload works
- [ ] Admin can add worker with membership selection
- [ ] Transaction history displays correctly
- [ ] Receipt download works from admin panel
- [ ] Receipt download works from user profile
- [ ] CSV export works
- [ ] Filters work in transaction history
- [ ] Summary cards show correct data
- [ ] All photos display correctly
- [ ] Database records are correct

---

## 🎉 Success Criteria

All features are working if:
1. ✅ Users can register with membership selection
2. ✅ Payments are tracked in transactions table
3. ✅ Photos can be uploaded and displayed
4. ✅ Receipts can be downloaded
5. ✅ Admin can view complete transaction history
6. ✅ All navigation works correctly
7. ✅ No console errors
8. ✅ Database records are accurate

**If all checkboxes are ticked, implementation is 100% complete!** 🎊

