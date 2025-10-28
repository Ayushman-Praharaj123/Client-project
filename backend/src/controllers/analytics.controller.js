import Analytics from "../models/Analytics.js";

// Track website visit
export async function trackVisit(req, res) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await Analytics.findOneAndUpdate(
      { date: today },
      { $inc: { visits: 1 } },
      { upsert: true }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error in trackVisit controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get registration growth data (public)
export async function getRegistrationGrowth(req, res) {
  try {
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    startDate.setHours(0, 0, 0, 0);

    const analytics = await Analytics.find({
      date: { $gte: startDate },
    })
      .select("date registrations")
      .sort({ date: 1 });

    res.status(200).json({ success: true, data: analytics });
  } catch (error) {
    console.log("Error in getRegistrationGrowth controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

