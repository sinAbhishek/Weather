import express from "express";
import { sendEmail, test } from "../controller/Email.js";
const router = express.Router();

router.post("/", sendEmail);
router.get("/test", test);

export default router;
