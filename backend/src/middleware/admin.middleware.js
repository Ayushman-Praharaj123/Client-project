import jwt from "jsonwebtoken";

// Protect admin routes
export const protectAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (decoded.role !== "admin" && decoded.role !== "superadmin") {
      return res.status(403).json({ message: "Forbidden - Admin access required" });
    }

    // Attach admin info from token
    req.admin = {
      phoneNumber: decoded.phoneNumber,
      name: decoded.name,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.log("Error in protectAdmin middleware", error.message);
    res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

// Protect super admin routes
export const protectSuperAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (decoded.role !== "superadmin") {
      return res.status(403).json({ message: "Forbidden - Super Admin access required" });
    }

    // Attach admin info from token
    req.admin = {
      phoneNumber: decoded.phoneNumber,
      name: decoded.name,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.log("Error in protectSuperAdmin middleware", error.message);
    res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

