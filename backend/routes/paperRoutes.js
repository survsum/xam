const express = require("express");
const router = express.Router();
const multer = require("multer");
const { protect } = require("../middleware/authMiddleware");
const {
  uploadPaper,
  accessPaper,
  getAssignedPapers,
  getMyPapers
} = require("../controllers/paperController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/upload",
  protect,
  upload.single("paper"),
  uploadPaper
);

router.get(
  "/access/:id",
  protect,
  accessPaper
);

router.get(
  "/assigned",
  protect,
  getAssignedPapers
);
router.get(
  "/my-papers",
  protect,
  getMyPapers
);

module.exports = router;