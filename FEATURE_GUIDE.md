# 📖 All India Labour Union - Complete Feature Guide

## 🎯 Overview

This guide covers all the new features implemented in the All India Labour Union application.

---

## 🚀 Quick Start

### Start the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Access URLs:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001

---

## 👤 User Roles & Access

### 1. Worker (Regular User)
**Login:** Register through the website
**Access:**
- Home page
- About page
- Contact page
- Profile page (with ID download)

### 2. Admin
**Login Credentials:**
- Phone: `9876543210`
- Password: `Admin@123`

**Access:**
- All worker features
- Admin Dashboard
- View/Edit Users
- Add Workers
- Analytics
- Messages
- Send Delete Requests

### 3. Super Admin
**Login Credentials:**
- Phone: `9999999999`
- Password: `SuperAdmin@123`

**Access:**
- All admin features
- Add new admins
- Approve/Reject delete requests

---

## 📋 Feature Details

### 1. Clean Auth Pages ✨
**What:** Navbar and Footer removed from authentication pages

**Affected Pages:**
- Register
- Login
- Forgot Password
- Admin Dashboard
- All admin sub-pages

**Why:** Provides distraction-free authentication experience

---

### 2. ID Card Download 🆔
**Location:** Profile Page (Worker only)

**How to Use:**
1. Login as worker
2. Navigate to Profile
3. Click "Download ID Card" button
4. PDF will download automatically

**ID Card Contains:**
- User ID (e.g., AILU1234567890)
- Full Name
- Phone Number
- Email
- Worker Type
- AILU Branding

**Format:** PDF (Credit card size: 85.6mm x 53.98mm)

---

### 3. Leadership Team Display 👥
**Location:** Home Page

**Features:**
- 6 leadership positions displayed
- Modern card design
- Hover effects
- Responsive layout

**Positions:**
1. President
2. Vice President
3. General Secretary
4. Treasurer
5. Joint Secretary
6. Women's Wing Head

**To Update:** Edit `frontend/src/pages/Home.jsx` - `leadershipTeam` array

---

### 4. Modern Admin Dashboard 🎛️

#### Dashboard Overview
**Access:** Login as Admin/Super Admin

**Features:**
- Sidebar navigation
- Statistics cards
- Quick action buttons
- Responsive design

**Statistics Shown:**
- Total Users
- Total Contacts
- Unresolved Contacts

---

#### 4.1 View Users 👥
**Path:** Dashboard → View Users

**Features:**
- Search by name, email, phone, or user ID
- Paginated table (10 users per page)
- Inline editing
- Send delete requests

**How to Edit User:**
1. Click edit icon (pencil)
2. Modify fields
3. Click save icon (checkmark)
4. Click X to cancel

**How to Delete User:**
1. Click delete icon (trash)
2. Enter reason for deletion
3. Request sent to super admin

---

#### 4.2 Add Worker ➕
**Path:** Dashboard → Add Worker

**Form Fields:**
- Full Name *
- Phone Number *
- Email *
- Address *
- Worker Type * (dropdown)
- Password *

**Worker Types:**
- Domestic Worker
- Saloon Worker
- Rickshaw Driver
- Auto Driver
- Construction Worker
- Factory Worker
- Agricultural Worker
- Other

**Note:** Worker is added without payment. User ID generated automatically.

---

#### 4.3 Add Admin 🛡️
**Path:** Dashboard → Add Admin (Super Admin Only)

**Form Fields:**
- Phone Number *
- Password *
- Confirm Password *

**Note:** This feature is for super admins only.

---

#### 4.4 Analytics 📊
**Path:** Dashboard → Analytics

**Charts Available:**

1. **Monthly Registrations (Line Chart)**
   - Shows registration trends
   - Last 30 days
   - Grouped by month

2. **Worker Type Distribution (Pie Chart)**
   - Percentage breakdown
   - Color-coded categories
   - Interactive tooltips

3. **Workers by Category (Bar Chart)**
   - Count per category
   - Easy comparison
   - Rotated labels

**Summary Stats:**
- Total Workers
- Worker Categories
- This Month's Registrations

---

#### 4.5 Messages 💬
**Path:** Dashboard → Messages

**Features:**
- View all contact form submissions
- Separate unresolved and resolved sections
- Mark messages as resolved
- Statistics dashboard

**Message Details:**
- Sender name
- Email
- Phone number
- Message content
- Timestamp

**How to Resolve:**
1. Find message in "Unresolved Messages"
2. Click "Mark Resolved" button
3. Message moves to "Resolved Messages"

---

#### 4.6 Delete Requests 🗑️
**Path:** Dashboard → Delete Requests (Super Admin Only)

**Features:**
- View all delete requests from admins
- Approve or reject requests
- See request details and reason
- Track processed requests

**How to Process:**
1. Review pending request
2. Click "Approve" to delete user (permanent)
3. Click "Reject" to deny request
4. Confirmation dialog appears
5. Request moves to processed section

**Request Details:**
- User ID
- User name, email, phone
- Deletion reason
- Requesting admin
- Request timestamp

---

## 🎨 UI/UX Features

### Color Scheme
- **Primary:** #FF6B35 (Gerua Orange)
- **Background:** White
- **Text:** Gray shades
- **Success:** Green
- **Warning:** Orange
- **Error:** Red

### Responsive Design
- **Mobile:** Collapsible sidebar, stacked cards
- **Tablet:** Optimized layouts
- **Desktop:** Full sidebar, grid layouts

### Interactions
- Hover effects on cards and buttons
- Smooth transitions
- Loading spinners
- Toast notifications
- Confirmation dialogs

---

## 🔧 Technical Details

### Frontend Technologies
- React 19
- TailwindCSS 4
- React Router DOM v7
- TanStack Query
- Recharts (for analytics)
- jsPDF (for ID cards)
- Lucide React (icons)
- React Hot Toast (notifications)

### New Dependencies
```json
{
  "jspdf": "^2.x.x",
  "html2canvas": "^1.x.x"
}
```

### File Structure
```
frontend/src/
├── pages/
│   ├── AdminDashboard.jsx (Main dashboard)
│   ├── admin/
│   │   ├── AdminUsers.jsx
│   │   ├── AdminAddWorker.jsx
│   │   ├── AdminAddAdmin.jsx
│   │   ├── AdminAnalytics.jsx
│   │   ├── AdminMessages.jsx
│   │   └── AdminDeleteRequests.jsx
│   ├── Home.jsx (Updated with leadership)
│   └── Profile.jsx (Updated with ID download)
└── App.jsx (Updated with conditional layout)
```

---

## 📱 Mobile Experience

### Responsive Features
- Hamburger menu for sidebar
- Touch-friendly buttons
- Scrollable tables
- Stacked statistics cards
- Optimized charts

### Mobile Navigation
1. Tap hamburger icon (top-left)
2. Sidebar slides in
3. Select menu item
4. Sidebar auto-closes
5. Content updates

---

## 🔐 Security Features

### Access Control
- Role-based routing
- Protected admin routes
- Super admin restrictions
- JWT authentication
- Secure API calls

### Data Protection
- Password hashing
- HTTP-only cookies
- CORS configuration
- Input validation

---

## 🧪 Testing Guide

### Test Worker Features
1. Register new worker
2. Login
3. View profile
4. Download ID card
5. Check PDF quality

### Test Admin Features
1. Login as admin
2. Search users
3. Edit user details
4. Add new worker
5. View analytics
6. Check messages
7. Send delete request

### Test Super Admin Features
1. Login as super admin
2. Access all admin features
3. Add new admin
4. Approve delete request
5. Verify user deletion

---

## 🐛 Troubleshooting

### ID Card Not Downloading
- Check browser pop-up blocker
- Ensure user has all profile fields filled
- Check browser console for errors

### Charts Not Showing
- Verify backend is running
- Check if data exists in database
- Refresh the page

### Search Not Working
- Check search term spelling
- Try partial matches
- Verify backend API is responding

### Sidebar Not Opening (Mobile)
- Check screen size
- Try refreshing page
- Clear browser cache

---

## 💡 Tips & Best Practices

### For Admins
1. **Regular Monitoring:** Check messages daily
2. **User Management:** Keep user data updated
3. **Analytics:** Review trends weekly
4. **Delete Requests:** Process promptly

### For Super Admins
1. **Admin Creation:** Use strong passwords
2. **Delete Approval:** Verify reason before approving
3. **System Health:** Monitor analytics regularly

### For Workers
1. **Profile Completion:** Fill all details for better ID card
2. **ID Card:** Download and save for offline use
3. **Contact:** Use contact form for queries

---

## 📞 Support

For issues or questions:
1. Check this guide
2. Review NEW_FEATURES.md
3. Check browser console for errors
4. Verify backend is running
5. Check API responses

---

## 🎉 Summary

All features are:
- ✅ Fully functional
- ✅ Production-ready
- ✅ Responsive
- ✅ Secure
- ✅ Well-documented

**Enjoy the new features!** 🚀

