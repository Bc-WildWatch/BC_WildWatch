import express from "express";

import { getReports, createReport, updateReport, deleteReport } from "../controllers/reportController.js";
import validateReport from "../middleware/validateReport.js";
import { requireAuth, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/",          requireAuth,               getReports);
router.post("/",         requireAuth, validateReport, createReport);
router.put("/:id",       requireAuth, requireAdmin,  updateReport);
router.delete("/:id",    requireAuth, requireAdmin,  deleteReport);

export default router;