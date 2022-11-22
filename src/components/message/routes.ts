import { Router } from "express";
import sendTextMessage from "./controllers/sendTextMessage";
import sendAudioMessage from "./controllers/sendAudioMessage";
import getMessages from "./controllers/getMessages";

const router = Router();

router.post("/send/text", sendTextMessage);
router.post("/send/audio", sendAudioMessage);

router.get("/get", getMessages);

export default router;
