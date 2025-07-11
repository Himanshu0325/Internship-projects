import { Router } from "express";
import { createActivityLog, GetAllLogs } from "../Controllers/activityLogsController.js";

const router = Router();

router.route('/Activitylog').post(createActivityLog)
router.route('/FetchALLActivityLogs').get(GetAllLogs)

export default router;