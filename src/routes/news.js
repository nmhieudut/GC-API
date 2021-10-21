import express from "express";
import { getAll } from "../controllers/news";

const router = express.Router();

router.get("/all", getAll);

export default router;
