import cron from "node-cron";
import User from "../models/User.js";
import { sendPlanExpiringEmail, sendPlanExpiredEmail } from "../lib/email.js";

// Track which users have been notified to avoid duplicate emails
const notifiedUsers = {
  expiring: new Set(),
  expired: new Set(),
};

// Check for expiring and expired memberships
const checkMembershipExpiry = async () => {
  try {
    console.log("Running membership expiry check...");
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Find users with email who have memberships expiring in 7 days
    const expiringUsers = await User.find({
      email: { $exists: true, $ne: null, $ne: "" },
      membershipExpiry: {
        $gte: now,
        $lte: sevenDaysFromNow,
      },
    });

    // Find users with email who have expired memberships (expired in last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const expiredUsers = await User.find({
      email: { $exists: true, $ne: null, $ne: "" },
      membershipExpiry: {
        $gte: thirtyDaysAgo,
        $lt: now,
      },
    });

    // Send expiring soon emails
    for (const user of expiringUsers) {
      const notificationKey = `${user.userId}_${user.membershipExpiry.toISOString()}`;
      
      // Check if we already sent notification for this expiry date
      if (!notifiedUsers.expiring.has(notificationKey)) {
        const daysLeft = Math.ceil((user.membershipExpiry - now) / (1000 * 60 * 60 * 24));
        
        // Send email only if 7, 3, or 1 day(s) left
        if (daysLeft === 7 || daysLeft === 3 || daysLeft === 1) {
          console.log(`Sending expiring email to ${user.email} (${daysLeft} days left)`);
          await sendPlanExpiringEmail(
            user.email,
            user.fullName,
            user.userId,
            user.membershipType,
            user.membershipExpiry
          );
          notifiedUsers.expiring.add(notificationKey);
        }
      }
    }

    // Send expired emails
    for (const user of expiredUsers) {
      const notificationKey = `${user.userId}_${user.membershipExpiry.toISOString()}`;
      
      // Check if we already sent notification for this expiry
      if (!notifiedUsers.expired.has(notificationKey)) {
        const daysExpired = Math.ceil((now - user.membershipExpiry) / (1000 * 60 * 60 * 24));
        
        // Send email on day 1, 7, 14, and 30 after expiry
        if (daysExpired === 1 || daysExpired === 7 || daysExpired === 14 || daysExpired === 30) {
          console.log(`Sending expired email to ${user.email} (expired ${daysExpired} days ago)`);
          await sendPlanExpiredEmail(
            user.email,
            user.fullName,
            user.userId,
            user.membershipType,
            user.membershipExpiry
          );
          notifiedUsers.expired.add(notificationKey);
        }
      }
    }

    console.log(`Membership expiry check complete. Expiring: ${expiringUsers.length}, Expired: ${expiredUsers.length}`);
  } catch (error) {
    console.error("Error checking membership expiry:", error);
  }
};

// Clear notification cache daily to allow re-checking
const clearNotificationCache = () => {
  notifiedUsers.expiring.clear();
  notifiedUsers.expired.clear();
  console.log("Notification cache cleared");
};

// Initialize cron jobs
export const initCronJobs = () => {
  // Run membership expiry check every day at 9:00 AM
  cron.schedule("0 9 * * *", () => {
    console.log("Scheduled task: Checking membership expiry at 9:00 AM");
    checkMembershipExpiry();
  });

  // Also run at 6:00 PM for additional reminder
  cron.schedule("0 18 * * *", () => {
    console.log("Scheduled task: Checking membership expiry at 6:00 PM");
    checkMembershipExpiry();
  });

  // Clear notification cache at midnight
  cron.schedule("0 0 * * *", () => {
    console.log("Scheduled task: Clearing notification cache at midnight");
    clearNotificationCache();
  });

  console.log("✅ Cron jobs initialized:");
  console.log("   - Membership expiry check: 9:00 AM and 6:00 PM daily");
  console.log("   - Notification cache clear: Midnight daily");

  // Run immediately on startup for testing (optional - comment out in production)
  if (process.env.NODE_ENV === "development") {
    console.log("Running initial membership expiry check...");
    setTimeout(() => checkMembershipExpiry(), 5000); // Run after 5 seconds
  }
};

// Export for manual testing
export { checkMembershipExpiry };

