import { Router } from "express";
import { emailVerification, emailVerificationToken } from "../Controllers/emailVerificationController.js";

const router = Router();

router.route('/generate-otp').post(emailVerificationToken)
router.route('/verify-otp').post(emailVerification)

export default router;