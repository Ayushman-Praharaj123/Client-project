# 🔧 UPI Not Showing - Troubleshooting Guide

## ❌ Problem: UPI Section Missing from Payment Modal

You're seeing only "Other Payment Methods" (Cards, Netbanking, Wallet) but **no UPI option**.

---

## 🔍 Root Causes & Solutions

### **Cause 1: UPI Not Enabled in Razorpay Dashboard** ⭐ MOST COMMON

**Why:** Razorpay requires you to explicitly enable UPI in your account settings.

**Solution:**

1. **Login to Razorpay Dashboard:**
   - Go to: https://dashboard.razorpay.com/

2. **Navigate to Settings:**
   - Click on **Settings** (gear icon) in left sidebar
   - Or go to: https://dashboard.razorpay.com/app/settings

3. **Go to Payment Methods:**
   - Click on **Payment Methods** or **Configuration**
   - Look for **Payment Methods** section

4. **Enable UPI:**
   - Find **UPI** in the list
   - Toggle it **ON** (enable it)
   - Click **Save**

5. **Verify:**
   - UPI should now show a green checkmark or "Enabled" status

6. **Test Again:**
   - Refresh your registration page
   - Try payment again
   - UPI should now appear!

---

### **Cause 2: Test Mode Limitations**

**Why:** Razorpay Test Mode has limited UPI functionality.

**Current Status:**
- ✅ UPI works in Test Mode (but with test credentials only)
- ⚠️ QR Code might not show in Test Mode
- ⚠️ Only test UPI IDs work (like `success@razorpay`)

**Test Mode UPI IDs:**
```
success@razorpay     → Payment succeeds
failure@razorpay     → Payment fails
```

**Solution:**
- For **testing**: Use test UPI IDs (QR code may not appear)
- For **production**: Switch to Live Mode (QR code will work)

---

### **Cause 3: Account Activation Required**

**Why:** New Razorpay accounts need activation before UPI works.

**Check Account Status:**

1. **Login to Dashboard:**
   - https://dashboard.razorpay.com/

2. **Check Activation Status:**
   - Look for banner: "Complete KYC" or "Activate Account"
   - Check if account is in "Test Mode Only"

3. **Complete Activation:**
   - Submit business details
   - Complete KYC verification
   - Wait for approval (usually 24-48 hours)

4. **After Activation:**
   - UPI will be available
   - Switch to Live Mode for production

---

### **Cause 4: Configuration Issue** ✅ FIXED

**Why:** The previous configuration syntax wasn't compatible with all Razorpay versions.

**What I Fixed:**
- ✅ Simplified the configuration
- ✅ Used `sequence` to prioritize UPI
- ✅ Enabled default blocks

**New Configuration:**
```javascript
config: {
  display: {
    sequence: ["block.upi", "block.card", "block.netbanking", "block.wallet"],
    preferences: {
      show_default_blocks: true
    }
  }
}
```

This tells Razorpay to show UPI first, then cards, then netbanking, then wallets.

---

## 🧪 Testing Steps

### **Step 1: Check Razorpay Dashboard**

1. Login: https://dashboard.razorpay.com/
2. Go to: **Settings** → **Payment Methods**
3. Verify: **UPI** is **Enabled** ✅
4. If not enabled: **Enable it** and **Save**

---

### **Step 2: Restart Your Application**

```bash
# Stop both frontend and backend (Ctrl+C)

# Restart Backend
cd backend
npm run dev

# Restart Frontend (in new terminal)
cd frontend
npm run dev
```

---

### **Step 3: Clear Browser Cache**

1. Open browser DevTools (F12)
2. Right-click on refresh button
3. Select "Empty Cache and Hard Reload"
4. Or use: Ctrl+Shift+Delete → Clear cache

---

### **Step 4: Test Payment**

1. Go to: http://localhost:5173/register
2. Fill registration form
3. Click "Register & Pay"
4. **Check payment modal:**
   - ✅ Should see UPI section at top
   - ✅ Should see UPI apps listed
   - ⚠️ QR code might not show in Test Mode

---

## 📱 What You Should See

### **In Test Mode:**

```
┌─────────────────────────────────────────┐
│  Payment Options                        │
├─────────────────────────────────────────┤
│                                         │
│  UPI                                    │
│  ───────────────────────────────────    │
│  • Enter UPI ID: [success@razorpay]    │
│  • Select UPI App                       │
│  • (QR code may not appear)             │
│                                         │
│  Cards                                  │
│  ───────────────────────────────────    │
│  • Credit/Debit Card                    │
│                                         │
│  Netbanking                             │
│  ───────────────────────────────────    │
│  • Select Bank                          │
│                                         │
│  Wallet                                 │
│  ───────────────────────────────────    │
│  • Paytm, etc.                          │
│                                         │
└─────────────────────────────────────────┘
```

### **In Live Mode (Production):**

```
┌─────────────────────────────────────────┐
│  Payment Options                        │
├─────────────────────────────────────────┤
│                                         │
│  UPI                                    │
│  ───────────────────────────────────    │
│  • Scan QR Code: [QR CODE SHOWN] ✅     │
│  • Google Pay                           │
│  • PhonePe                              │
│  • Paytm                                │
│  • Enter UPI ID                         │
│                                         │
│  Cards                                  │
│  Netbanking                             │
│  Wallet                                 │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔑 Razorpay Dashboard - Step by Step

### **Enable UPI Payment Method:**

1. **Login:**
   ```
   https://dashboard.razorpay.com/signin
   ```

2. **Navigate to Settings:**
   ```
   Dashboard → Settings (⚙️ icon) → Payment Methods
   ```

3. **Find UPI:**
   ```
   Payment Methods List:
   ├─ Cards ✅
   ├─ UPI ❌ ← Enable this!
   ├─ Netbanking ✅
   └─ Wallets ✅
   ```

4. **Enable UPI:**
   ```
   Click toggle switch next to UPI
   Status should change to: Enabled ✅
   ```

5. **Save Changes:**
   ```
   Click "Save" or "Update" button
   ```

6. **Verify:**
   ```
   UPI should show:
   ✅ Enabled
   ✅ Green checkmark
   ```

---

## 🎯 Quick Checklist

Run through this checklist:

- [ ] **Razorpay Dashboard Login**
  - Can you access https://dashboard.razorpay.com/?

- [ ] **UPI Enabled in Dashboard**
  - Settings → Payment Methods → UPI → Enabled ✅

- [ ] **Account Activated**
  - No "Complete KYC" banner
  - Account status: Active

- [ ] **Code Updated**
  - Latest Register.jsx with simplified config ✅

- [ ] **Application Restarted**
  - Backend restarted
  - Frontend restarted

- [ ] **Browser Cache Cleared**
  - Hard reload performed

- [ ] **Test Payment**
  - UPI appears in payment modal
  - Can select UPI option

---

## 🆘 Still Not Working?

### **Check Browser Console:**

1. Open DevTools (F12)
2. Go to **Console** tab
3. Look for errors related to Razorpay
4. Share any error messages

### **Check Network Tab:**

1. Open DevTools (F12)
2. Go to **Network** tab
3. Click "Register & Pay"
4. Look for Razorpay API calls
5. Check if any fail

### **Verify Environment Variables:**

Check your `.env` file:

```bash
# Frontend: frontend/.env
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx

# Backend: backend/.env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
```

Make sure:
- ✅ Keys start with `rzp_test_` (for test mode)
- ✅ Keys are correct (from Razorpay dashboard)
- ✅ No extra spaces or quotes

---

## 📞 Razorpay Support

If UPI still doesn't appear after enabling it:

1. **Contact Razorpay Support:**
   - Email: support@razorpay.com
   - Phone: +91-80-6900-6900
   - Dashboard: Help & Support section

2. **Ask them:**
   - "Why is UPI not appearing in checkout even though it's enabled?"
   - "Is my account approved for UPI payments?"
   - "Are there any restrictions on my test account?"

---

## 💡 Important Notes

### **Test Mode vs Live Mode:**

| Feature | Test Mode | Live Mode |
|---------|-----------|-----------|
| **UPI Available** | ✅ Yes | ✅ Yes |
| **QR Code** | ⚠️ Limited | ✅ Full |
| **Real Payments** | ❌ No | ✅ Yes |
| **Test UPI IDs** | ✅ Works | ❌ No |
| **Real UPI Apps** | ❌ No | ✅ Yes |

### **Test Mode UPI:**
- Use test UPI IDs: `success@razorpay`, `failure@razorpay`
- QR code might not appear
- Real UPI apps won't work

### **Live Mode UPI:**
- Real UPI IDs work
- QR code appears
- Real UPI apps work (Google Pay, PhonePe, etc.)
- Actual money is transferred

---

## 🎯 Expected Behavior After Fix

### **After Enabling UPI in Dashboard:**

1. **Payment Modal Opens**
2. **UPI Section Appears First** ✅
3. **Options Available:**
   - Enter UPI ID (Test Mode: `success@razorpay`)
   - Select UPI App (Test Mode: limited)
   - Scan QR Code (Live Mode only)
4. **Other Methods Below:**
   - Cards
   - Netbanking
   - Wallets

---

## 📋 Summary

### **Most Likely Solution:**

**Enable UPI in Razorpay Dashboard:**
1. Login to https://dashboard.razorpay.com/
2. Go to Settings → Payment Methods
3. Enable UPI
4. Save
5. Restart your app
6. Test again

### **If Still Not Working:**

1. Check account activation status
2. Verify environment variables
3. Clear browser cache
4. Check browser console for errors
5. Contact Razorpay support

---

## ✅ Success Indicators

You'll know it's working when:

- ✅ UPI appears as first option in payment modal
- ✅ Can enter UPI ID (test: `success@razorpay`)
- ✅ Can select UPI apps
- ✅ Payment completes successfully
- ✅ Registration succeeds

---

**🎯 Next Step: Enable UPI in Razorpay Dashboard and test again!**

