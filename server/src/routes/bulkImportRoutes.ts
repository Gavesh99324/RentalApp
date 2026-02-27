import express from "express";
import {
  bulkImportLocations,
  bulkImportProperties,
  getBulkImportStats,
} from "../controllers/bulkImportControllers";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// Only managers can perform bulk imports
router.post("/locations", authMiddleware(["manager"]), bulkImportLocations);
router.post("/properties", authMiddleware(["manager"]), bulkImportProperties);
router.get("/stats", authMiddleware(["manager"]), getBulkImportStats);

export default router;
