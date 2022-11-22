import { Router } from "express";
import getChats from "./controllers/getChats";
import getParticipants from "./controllers/getParticipants";
import changePhoto from "./controllers/changePhoto";
import changeTitle from "./controllers/changeTitle";
import createNewChat from "./controllers/createNewChat";
import addUser from "./controllers/addUser";
import removeUser from "./controllers/removeUser";

const router = Router();

router.get("/get", getChats);
router.get("/participants", getParticipants);

router.put("/change-photo", changePhoto);
router.put("/change-title", changeTitle);

router.post("/create", createNewChat);

router.patch("/add-user", addUser);

router.delete("/remove-user", removeUser);

export default router;
