import { Router } from "express";
import {
  submitContact,
  getAllContacts,
  getContact,
  updateStatus,
  deleteContact,
  bulkDelete,
} from "../controllers/contactController";
import { protect } from "../middleware/auth";

const router = Router();

// Public
router.post("/", submitContact);

// Protected
router.use(protect);
router.get("/", getAllContacts);
router.get("/:id", getContact);
router.patch("/:id/status", updateStatus);
router.delete("/bulk", bulkDelete);
router.delete("/:id", deleteContact);

export default router;
