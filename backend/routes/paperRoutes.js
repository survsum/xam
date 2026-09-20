const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { protect } = require("../middleware/authMiddleware");
const {
  uploadPaper,
  retryBlockchain,
  accessPaper,
  getAssignedPapers,
  getMyPapers,
  verifyDocument
} = require("../controllers/paperController");

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    cb(null, `${Date.now()}-${Math.floor(Math.random() * 10000)}-${safeName}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/zip",
    "application/x-zip-compressed"
  ];
  if (allowedTypes.includes(file.mimetype) || file.originalname.endsWith(".pdf") || file.originalname.endsWith(".docx")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF, DOCX, and ZIP exam papers are allowed."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 } // 25 MB limit
});

router.post("/upload", protect, upload.single("paper"), uploadPaper);
router.post("/:id/retry-blockchain", protect, retryBlockchain);
router.get("/access/:id", protect, accessPaper);
router.get("/assigned", protect, getAssignedPapers);
router.get("/my-papers", protect, getMyPapers);
router.post("/verify-document", upload.single("paper"), verifyDocument);

module.exports = router;