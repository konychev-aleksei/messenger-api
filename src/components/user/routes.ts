import { Router } from "express";
import checkUser from "./controllers/checkUser";
import changePhoto from "./controllers/changePhoto";

const router = Router();

router.post("/check", checkUser);

router.put("/photo", changePhoto);

export default router;
