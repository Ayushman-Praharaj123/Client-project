import express from "express";
import { trackVisit, getRegistrationGrowth } from "../controllers/analytics.controller.js";

const router = express.Router();

// Public routes
router.post("/track-visit", trackVisit);
router.get("/registration-growth", getRegistrationGrowth);

export default router;

