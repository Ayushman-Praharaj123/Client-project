# ⚠️ Important Notes & Configuration

## 🔴 MUST DO Before Production

### 1. Email Configuration
**Current Status:** Using placeholder credentials

**Action Required:**
```env
# Update in backend/.env
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**For Gmail:**
1. Enable 2-Step Verification
2. Go to: https://myaccount.google.com/apppasswords
3. Generate App Password
4. Use that password in EMAIL_PASSWORD

---

### 2. SMS Integration
**Current Status:** Logs OTP to console only

**Action Required:**
Integrate with actual SMS provider (Twilio, MSG91, etc.)

**File to Update:** `backend/src/lib/sms.js`

**Example with Twilio:**
```javascript
import twilio from 'twilio';

const client = twilio(accountSid, authToken);

export const sendOTPSMS = async (phoneNumber, otp) => {
  await client.messages.create({
    body: `Your OTP for AILU password reset is: ${otp}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber
  });
};
```

---

### 3. MongoDB Production
**Current Status:** Using local MongoDB

**Action Required:**
1. Create MongoDB Atlas account
2. Create cluster
3. Get connection string
4. Update MONGO_URI in .env

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/labour-union?retryWrites=true&w=majority
```

---

### 4. Razorpay Production Keys
**Current Status:** Using test keys

**Action Required:**
1. Complete KYC on Razorpay
2. Get Live API keys
3. Update both .env files

```env
# Backend
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_live_secret

# Frontend
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
```

---

### 5. JWT Secret
**Current Status:** Using default secret

**Action Required:**
Generate strong random secret

```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Update in backend/.env:
```env
JWT_SECRET_KEY=your_generated_secret_here
```

---

### 6. Admin Credentials
**Current Status:** Using default passwords

**Action Required:**
Change admin passwords in .env

```env
ADMIN_PHONE_1=your_admin_phone
ADMIN_PASSWORD_1=strong_password_here
SUPER_ADMIN_PHONE=your_superadmin_phone
SUPER_ADMIN_PASSWORD=strong_password_here
```

---

### 7. CORS Configuration
**Current Status:** Allowing localhost only

**Action Required:**
Update allowed origins in `backend/src/server.js`

```javascript
app.use(cors({
  origin: ["https://yourdomain.com", "https://www.yourdomain.com"],
  credentials: true,
}));
```

---

### 8. Environment Variables
**Action Required:**
Update frontend API URL for production

```env
# frontend/.env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

---

## 🟡 Recommended Before Production

### 1. Add Rate Limiting
Prevent abuse of APIs

```bash
npm install express-rate-limit
```

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

### 2. Add Helmet for Security
```bash
npm install helmet
```

```javascript
import helmet from 'helmet';
app.use(helmet());
```

---

### 3. Add Compression
```bash
npm install compression
```

```javascript
import compression from 'compression';
app.use(compression());
```

---

### 4. Add Logging
```bash
npm install morgan
```

```javascript
import morgan from 'morgan';
app.use(morgan('combined'));
```

---

### 5. Error Monitoring
Consider integrating:
- Sentry
- LogRocket
- New Relic

---

## 🟢 Optional Enhancements

### 1. Add More Worker Types
Update in `frontend/src/pages/Register.jsx`:

```javascript
const workerTypes = [
  "Domestic Worker",
  "Saloon Worker",
  "Rickshaw Driver",
  "Auto Driver",
  "Construction Worker",
  "Factory Worker",      // Add new
  "Agricultural Worker", // Add new
  "Other",
];
```

Also update in `backend/src/models/User.js`

---

### 2. Customize About Us Content
Edit `frontend/src/pages/About.jsx` with actual content

---

### 3. Update Contact Information
Edit in:
- `frontend/src/components/Footer.jsx`
- `frontend/src/pages/Contact.jsx`

---

### 4. Add Logo and Hero Image
Place your images in `frontend/public/`:
- `logo.png` (recommended: 200x200px)
- `heroimage.png` (recommended: 800x600px)

---

## 🔧 Deployment Options

### Option 1: Vercel (Frontend) + Render (Backend)
**Frontend (Vercel):**
1. Push code to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy

**Backend (Render):**
1. Create Web Service
2. Connect GitHub repo
3. Set environment variables
4. Deploy

---

### Option 2: Heroku (Full Stack)
```bash
# Install Heroku CLI
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=your_mongo_uri
# ... set all env variables
git push heroku main
```

---

### Option 3: DigitalOcean / AWS / Azure
1. Create droplet/instance
2. Install Node.js and MongoDB
3. Clone repository
4. Set environment variables
5. Use PM2 for process management
6. Configure Nginx as reverse proxy
7. Set up SSL with Let's Encrypt

---

## 📊 Performance Optimization

### 1. Database Indexing
Already implemented on:
- User email, phoneNumber, userId
- OTP auto-expiration

### 2. Image Optimization
- Compress logo and hero image
- Use WebP format
- Implement lazy loading

### 3. Code Splitting
Already implemented with React Router

### 4. Caching
Consider adding:
- Redis for session storage
- CDN for static assets

---

## 🔐 Security Checklist

- ✅ Passwords hashed with bcryptjs
- ✅ JWT in HTTP-only cookies
- ✅ CORS configured
- ✅ Input validation
- ✅ SQL injection prevention (using Mongoose)
- ✅ XSS prevention
- ⚠️ Add rate limiting (recommended)
- ⚠️ Add helmet (recommended)
- ⚠️ Add HTTPS in production (required)

---

## 📱 Testing Checklist

### Before Going Live:
- [ ] Test registration with real payment
- [ ] Test email delivery
- [ ] Test SMS delivery (when integrated)
- [ ] Test all admin functions
- [ ] Test on mobile devices
- [ ] Test on different browsers
- [ ] Test password reset flow
- [ ] Load test with multiple users
- [ ] Security audit
- [ ] Backup database

---

## 🆘 Troubleshooting

### Payment Not Working
1. Check Razorpay keys
2. Check internet connection
3. Verify payment signature validation
4. Check browser console for errors

### Email Not Sending
1. Verify email credentials
2. Check spam folder
3. Enable "Less secure app access" (Gmail)
4. Use App Password instead of regular password

### Database Connection Failed
1. Check MongoDB is running
2. Verify connection string
3. Check network access (Atlas)
4. Verify credentials

### CORS Errors
1. Check backend CORS configuration
2. Verify frontend URL
3. Ensure credentials: true

---

## 📞 Support Resources

### Documentation
- MongoDB: https://docs.mongodb.com
- Express: https://expressjs.com
- React: https://react.dev
- Razorpay: https://razorpay.com/docs

### Communities
- Stack Overflow
- MongoDB Community
- React Discord
- Node.js Discord

---

## 🎯 Next Steps

1. ✅ Review all MUST DO items
2. ✅ Update production credentials
3. ✅ Test thoroughly
4. ✅ Deploy to staging
5. ✅ Final testing
6. ✅ Deploy to production
7. ✅ Monitor and maintain

---

**Remember: Never commit .env files to version control!**

Add to `.gitignore`:
```
.env
.env.local
.env.production
node_modules/
dist/
build/
```

---

**Good Luck with Your Deployment! 🚀**

