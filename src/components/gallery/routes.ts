import { Router } from "express";
import getGallery from "./controllers/getGallery";

const router = Router();

router.get("/get", getGallery);

export default router;
