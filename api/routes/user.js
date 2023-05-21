import express from "express";
import {
  login,
  uploadImage,
  Register,
  updateCoordinates,
  notifications,
  getuser,
} from "../controller/User.js";
const router = express.Router();

router.post("/login", login);
router.post("/register", Register);
router.post("/img", uploadImage);
router.get("/:id", getuser);
router.post("/coordinates/:id", updateCoordinates);
router.post("/notifications/:id", notifications);
export default router;
