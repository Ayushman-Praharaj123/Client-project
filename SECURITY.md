# 🔒 Security Guidelines

## ⚠️ IMPORTANT: Credential Security

### 🚫 NEVER Hardcode Credentials

**DO NOT** hardcode any sensitive information in your code:
- ❌ Admin phone numbers
- ❌ Admin passwords
- ❌ API keys
- ❌ Database connection strings
- ❌ JWT secrets
- ❌ Email passwords

### ✅ Always Use Environment Variables

All sensitive credentials MUST be stored in `.env` file and accessed via `process.env`:

```javascript
// ✅ CORRECT
const adminPhone = process.env.ADMIN_PHONE_1;
const adminPassword = process.env.ADMIN_PASSWORD_1;

// ❌ WRONG - Never do this!
const adminPhone = "9876543210";
const adminPassword = "Admin@123";

// ❌ WRONG - No fallback values for sensitive data!
const adminPhone = process.env.ADMIN_PHONE_1 || "9876543210";
```

---

## 📁 Environment Files

### `.env` File (NEVER commit to Git)
- Contains actual credentials
- Must be in `.gitignore`
- Each developer/server has their own copy
- **NEVER** share this file publicly

### `.env.example` File (Safe to commit)
- Shows structure without real values
- Uses placeholder values
- Helps other developers set up their environment
- **CAN** be committed to Git

---

## 🔐 Admin Credentials Management

### Setting Up Admin Accounts

1. **Update `.env` file** with your admin credentials:
```env
ADMIN_PHONE_1=your_actual_phone_1
ADMIN_PASSWORD_1=your_strong_password_1

ADMIN_PHONE_2=your_actual_phone_2
ADMIN_PASSWORD_2=your_strong_password_2

SUPER_ADMIN_PHONE=your_superadmin_phone
SUPER_ADMIN_PASSWORD=your_strong_superadmin_password
```

2. **Run the reset script** to create admin accounts:
```bash
cd backend
node resetAdmins.js
```

3. **Verify** that admins are created in the database

### Password Requirements

Admin passwords should be:
- ✅ At least 8 characters long
- ✅ Include uppercase and lowercase letters
- ✅ Include numbers
- ✅ Include special characters
- ✅ Unique for each admin
- ✅ Changed regularly

**Example of strong passwords:**
- `MyStr0ng!Pass2024`
- `Adm1n#Secure$Pass`
- `Super@Admin2024!`

---

## 🛡️ Security Best Practices

### 1. Environment Variables Validation

Always validate that required environment variables are set:

```javascript
// ✅ CORRECT - Validate before use
if (!process.env.ADMIN_PHONE_1 || !process.env.ADMIN_PASSWORD_1) {
  throw new Error("Admin credentials must be set in .env file");
}
```

### 2. Never Log Sensitive Data

```javascript
// ❌ WRONG - Don't log passwords
console.log(`Password: ${password}`);

// ✅ CORRECT - Log without sensitive data
console.log("Admin account created successfully");
```

### 3. Use HTTPS in Production

```javascript
// In production
res.cookie("jwt", token, {
  httpOnly: true,
  secure: true, // Only send over HTTPS
  sameSite: "strict",
});
```

### 4. Hash Passwords

All passwords are automatically hashed using bcrypt before storing:

```javascript
// This happens automatically in the Admin model
adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});
```

### 5. Secure JWT Tokens

```javascript
// Use a strong, random JWT secret
JWT_SECRET_KEY=use_a_long_random_string_here_at_least_64_characters_long
```

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 📋 Security Checklist

Before deploying to production:

- [ ] All credentials are in `.env` file
- [ ] `.env` file is in `.gitignore`
- [ ] No hardcoded credentials in code
- [ ] Strong admin passwords set
- [ ] JWT secret is random and strong
- [ ] HTTPS is enabled
- [ ] CORS is configured for production domain
- [ ] Database connection uses authentication
- [ ] Email credentials are secure (app password, not main password)
- [ ] Razorpay keys are production keys (not test keys)
- [ ] All API endpoints have proper authentication
- [ ] Rate limiting is enabled
- [ ] Input validation is in place

---

## 🚨 What to Do If Credentials Are Exposed

If you accidentally commit credentials to Git:

1. **Immediately change all exposed credentials**
2. **Rotate API keys** (Razorpay, SMS, Email)
3. **Update `.env` file** with new credentials
4. **Run reset script** to update admin passwords
5. **Remove credentials from Git history** (use `git filter-branch` or BFG Repo-Cleaner)
6. **Force push** to remote repository
7. **Notify team members** to pull latest changes

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

## 🔍 Code Review Checklist

When reviewing code, check for:

- ❌ Hardcoded credentials
- ❌ Passwords in console.log
- ❌ API keys in frontend code
- ❌ Database credentials in code
- ❌ Fallback values for sensitive data
- ✅ All credentials from environment variables
- ✅ Proper error handling without exposing details
- ✅ Input validation and sanitization
- ✅ Authentication on protected routes

---

## 📞 Contact

If you discover a security vulnerability, please email:
**security@labourunion.com**

Do NOT create a public GitHub issue for security vulnerabilities.

---

**Remember: Security is not a feature, it's a requirement!** 🔒

