# 🚀 Quick Start Guide - All India Labour Union

## ⚡ Fast Setup (5 Minutes)

### Step 1: Start MongoDB
Make sure MongoDB is running on your system:
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

### Step 2: Start Backend Server
```bash
cd backend
npm run dev
```
✅ Backend should be running on `http://localhost:5001`

### Step 3: Start Frontend Server
```bash
cd frontend
npm run dev
```
✅ Frontend should be running on `http://localhost:5173`

### Step 4: Open Application
Open your browser and navigate to: `http://localhost:5173`

---

## 🧪 Test the Application

### 1. Test Worker Registration
1. Click "Register" button
2. Fill in the registration form:
   - Full Name: Test Worker
   - Phone: 9876543200
   - Email: test@example.com
   - Address: Test Address
   - Worker Type: Select any
   - Password: test123
3. Click "Proceed to Payment"
4. Use Razorpay test card:
   - Card: `4111 1111 1111 1111`
   - CVV: `123`
   - Expiry: Any future date
5. Complete payment
6. You should be logged in and redirected to home page

### 2. Test Worker Login
1. Click "Login"
2. Select "Worker"
3. Enter phone number and password
4. Click "Login"

### 3. Test Admin Login
1. Click "Login"
2. Select "Admin"
3. Phone: `9876543210`
4. Password: `Admin@123`
5. Click "Login"
6. You'll be redirected to Admin Dashboard

### 4. Test Super Admin Login
1. Click "Login"
2. Select "Super Admin"
3. Phone: `9999999999`
4. Password: `SuperAdmin@123`
5. Click "Login"

### 5. Test Password Reset
1. Click "Login" → "Forgot Password?"
2. Enter registered phone number
3. Check console for OTP (since SMS is not configured)
4. Check email for OTP
5. Enter OTP and reset password

---

## 📧 Email Configuration (Optional)

To enable email OTP:

1. **For Gmail:**
   - Enable 2-Step Verification
   - Generate App Password
   - Update `.env`:
     ```
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASSWORD=your-app-password
     ```

2. **For Other Providers:**
   - Update SMTP settings in `.env`

---

## 🎨 Features to Test

### Worker Features
- ✅ Registration with payment
- ✅ Login/Logout
- ✅ View profile
- ✅ Edit profile
- ✅ Password reset with OTP
- ✅ View members carousel
- ✅ View registration growth graph

### Admin Features
- ✅ Admin dashboard
- ✅ View analytics
- ✅ View all users
- ✅ Search users
- ✅ Edit user details
- ✅ Add worker manually
- ✅ View contacts
- ✅ Create delete requests

### Super Admin Features
- ✅ All admin features
- ✅ View delete requests
- ✅ Approve/Reject delete requests

---

## 🐛 Common Issues

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB service or update `MONGO_URI` in `.env`

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5001
```
**Solution:** Kill the process using the port or change `PORT` in `.env`

### Razorpay Not Loading
**Solution:** Check internet connection and Razorpay API keys

### CORS Error
**Solution:** Ensure backend is running and CORS is configured correctly

---

## 📱 Access URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5001/api
- **Health Check:** http://localhost:5001/api/health

---

## 🎯 Next Steps

1. ✅ Test all features
2. ✅ Customize About Us page content
3. ✅ Add real SMS provider for OTP
4. ✅ Configure production email service
5. ✅ Add more worker types if needed
6. ✅ Deploy to production

---

## 💡 Tips

- Use Chrome DevTools to debug
- Check browser console for errors
- Check terminal for backend errors
- Use MongoDB Compass to view database
- Test on different screen sizes for responsiveness

---

**Happy Testing! 🎉**

