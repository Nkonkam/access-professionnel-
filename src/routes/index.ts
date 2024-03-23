import express, { Router } from "express";
import learnerRouter from "../domaines/learners";
import emailVerificationRouter from "../domaines/email_verification";

const router: Router = express.Router();

router.use("/learner", learnerRouter);
router.use("/email_verification", emailVerificationRouter);

export default router;

// const OTPRouter = require("./../domains/otp");
// const EmailVerificationRoutes = require("../domains/email_verification");
// router.use("/otp", OTPRouter);
// router.use("/email_verification", EmailVerificationRoutes);
