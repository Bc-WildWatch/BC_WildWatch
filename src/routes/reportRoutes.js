import express from "express";

import { getReports,
        createReport,
        updateReport,
        deleteReport } from "../controllers/reportController.js";
import validateReport from "../middleware/validateReport.js";

const router = express.Router();

router.get("/",getReports);
router.post("/",validateReport, createReport);
router.put("/:id",updateReport);
router.delete("/:id",deleteReport);

export default router;