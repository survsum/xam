const crypto = require("crypto");
const Paper = require("../models/Paper");
const { encryptFile } = require("../services/encryptionService");
const { decryptFile } = require("../services/decryptionService");
const { storeOnBlockchain } = require("../services/blockchainService");

const accessPaper = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        message: "Paper not found",
      });
    }
     if (
      paper.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Access denied. This paper is not assigned to you."
      });
    }

    if (new Date() < new Date(paper.unlockTime)) {
      return res.status(403).json({
        message: "Paper is still locked",
      });
    }

    const decryptedPath = await decryptFile(
      paper.fileUrl,
      paper.iv
    );

    res.download(decryptedPath);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Decryption failed",
    });
  }
};


const uploadPaper = async (req, res) => {
  try {
    const { examName, examCode, unlockTime, assignedTo } = req.body;
       if (!assignedTo) {
      return res.status(400).json({
        message: "Organiser assignment is required"
      });
    }


    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a file",
      });
    }

    const originalFilePath = req.file.path;

const encryptedResult = await encryptFile(originalFilePath);

const filePath = encryptedResult.encryptedPath;
const iv = encryptedResult.iv;

    // Generate SHA256 hash
    const hash = crypto
      .createHash("sha256")
      .update(filePath + Date.now())
      .digest("hex");

    const paper = await Paper.create({
      examName,
      examCode,
      fileUrl: filePath,
      hash,
      iv,
      unlockTime,
      uploadedBy: req.user._id,
      assignedTo,
    });

    await storeOnBlockchain(
  examCode,
  hash,
  unlockTime
);

    res.status(201).json({
      message: "Paper uploaded successfully",
      paper,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Upload failed",
    });
  }
};

const getAssignedPapers = async (req, res) => {
  try {
    const papers = await Paper.find({
      assignedTo: req.user._id
    }).sort({ createdAt: -1 });

    res.json({ papers });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};
const getMyPapers = async (req, res) => {
  try {
    const papers = await Paper.find({
      uploadedBy: req.user._id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      papers
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch papers"
    });
  }
};

module.exports = {
  uploadPaper,
  accessPaper,
  getAssignedPapers,
  getMyPapers
};