import express, { Router } from "express";
import learnerRouter from "../domaines/learners";
import secteurRouter from "../domaines/secteurs";
import domaineRouter from "../domaines/domaines";
import filiereRouter from "../domaines/filieres";
import specialiteRouter from "../domaines/specialites";
import optionRouter from "../domaines/options";
import trainingStructureRouter from "../domaines/training_structure";
import emailVerificationRouter from "../domaines/email_verification";

const router: Router = express.Router();

router.use("/learner", learnerRouter);
router.use("/secteurs", secteurRouter);
router.use("/domaines", domaineRouter);
router.use("/filieres", filiereRouter);
router.use("/specialites", specialiteRouter);
router.use("/options", optionRouter);
router.use("/training_structure", trainingStructureRouter);
router.use("/email_verification", emailVerificationRouter);

export default router;

// const OTPRouter = require("./../domains/otp");
// const EmailVerificationRoutes = require("../domains/email_verification");
// router.use("/otp", OTPRouter);
// router.use("/email_verification", EmailVerificationRoutes);
