import express from "express";
import { getMessages, sendMessage, createUser } from "../controllers/chatController.js";

const router = express.Router();

router.get("/messages", getMessages);
router.post("/messages", sendMessage);
router.post("/users", createUser);

export default router;
