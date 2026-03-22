"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mediaController_1 = require("../controllers/mediaController");
const auth_1 = require("../middleware/auth");
const cloudinary_1 = require("../config/cloudinary");
const router = (0, express_1.Router)();
router.use(auth_1.protect); // all media routes are protected
router.get("/", mediaController_1.getAllMedia);
router.post("/upload", cloudinary_1.uploadImage.single("file"), mediaController_1.uploadMedia);
router.delete("/:id", mediaController_1.deleteMedia);
exports.default = router;
