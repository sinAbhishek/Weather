import express from "express";
import { sendEmail, test, getUsers } from "../controller/Email.js";
const router = express.Router();

router.post("/", sendEmail);
router.get("/test", getUsers);

export default router;
