"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactController_1 = require("../controllers/contactController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public
router.post("/", contactController_1.submitContact);
// Protected
router.use(auth_1.protect);
router.get("/", contactController_1.getAllContacts);
router.get("/:id", contactController_1.getContact);
router.patch("/:id/status", contactController_1.updateStatus);
router.delete("/bulk", contactController_1.bulkDelete);
router.delete("/:id", contactController_1.deleteContact);
exports.default = router;
