import express from "express";
import {
  getManager,
  createManager,
  updateManager,
  deleteManager,
  getManagerProperties,
} from "../controllers/manager.controller";

const router = express.Router();

router.get("/:cognitoId", getManager);
router.put("/:cognitoId", updateManager);
router.delete("/:cognitoId", deleteManager);
router.get("/:cognitoId/properties", getManagerProperties);
router.post("/", createManager);

export default router;
