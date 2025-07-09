import { Router } from "express";
import { emailVerification } from "../Controllers/emailVerificationController.js";

const router = Router();

router.route('/generate-otp').post(emailVerification)

export default router;