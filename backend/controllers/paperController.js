const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const Paper = require("../models/Paper");
const User = require("../models/User");
const { encryptFile } = require("../services/encryptionService");
const { decryptFile } = require("../services/decryptionService");
const { storeOnBlockchain, getPaperFromBlockchain } = require("../services/blockchainService");

// @route  POST /api/papers/upload
// @access Private (Paper Setter)
const uploadPaper = async (req, res) => {
  let encryptedFilePath = null;

  try {
    const { examName, examCode, subject, description, unlockTime, assignedTo } = req.body;

    if (!examName || !examCode || !unlockTime || !assignedTo) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlink(req.file.path, () => {});
      }
      return res.status(400).json({
        message: "Missing required fields: examName, examCode, unlockTime, assignedTo"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload an exam paper file (PDF, DOCX, ZIP)"
      });
    }

    // Verify assigned organiser exists
    const organiser = await User.findById(assignedTo);
    if (!organiser) {
      if (fs.existsSync(req.file.path)) fs.unlink(req.file.path, () => {});
      return res.status(404).json({ message: "Assigned organiser not found" });
    }

    const originalFilePath = req.file.path;
    const originalFileName = req.file.originalname;
    const fileSize = req.file.size;
    const mimeType = req.file.mimetype;

    // 1. Encrypt file and calculate canonical SHA-256 of raw original file bytes
    const encryptedResult = await encryptFile(originalFilePath);
    encryptedFilePath = encryptedResult.encryptedPath;

    const { iv, canonicalHash } = encryptedResult;

    // 2. Persist metadata to MongoDB
    const paper = await Paper.create({
      examName,
      examCode,
      subject: subject || "",
      description: description || "",
      originalFileName,
      fileSize,
      mimeType,
      fileUrl: encryptedFilePath,
      hash: canonicalHash,
      iv,
      unlockTime: new Date(unlockTime),
      uploadedBy: req.user._id,
      assignedTo,
      status: new Date() >= new Date(unlockTime) ? "unlocked" : "locked",
      blockchainStatus: "pending",
      blockchainTxHash: "",
    });

    // 3. Attempt Blockchain Notarization
    const bcResult = await storeOnBlockchain(examCode, canonicalHash, unlockTime);

    if (bcResult.success) {
      paper.blockchainStatus = "registered";
      paper.blockchainTxHash = bcResult.txHash;
    } else {
      paper.blockchainStatus = bcResult.status; // 'offline' or 'failed'
    }
    await paper.save();

    const populatedPaper = await Paper.findById(paper._id)
      .populate("assignedTo", "firstName lastName organisation email")
      .populate("uploadedBy", "firstName lastName organisation email");

    return res.status(201).json({
      message: "Exam paper encrypted and stored successfully",
      paper: populatedPaper,
      blockchainResult: bcResult,
    });

  } catch (error) {
    console.error("Upload paper error:", error);

    // Atomicity cleanup
    if (encryptedFilePath && fs.existsSync(encryptedFilePath)) {
      fs.unlink(encryptedFilePath, () => {});
    }

    return res.status(500).json({
      message: error.message || "Failed to process paper upload"
    });
  }
};

// @route  POST /api/papers/:id/retry-blockchain
// @access Private (Paper Setter / Admin)
const retryBlockchain = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    if (paper.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Not authorized to retry notarization for this paper" });
    }

    const bcResult = await storeOnBlockchain(paper.examCode, paper.hash, paper.unlockTime);

    if (bcResult.success) {
      paper.blockchainStatus = "registered";
      paper.blockchainTxHash = bcResult.txHash;
      await paper.save();
      return res.json({
        message: "Blockchain registration successful!",
        paper,
        blockchainResult: bcResult
      });
    } else {
      paper.blockchainStatus = bcResult.status;
      await paper.save();
      return res.status(503).json({
        message: `Blockchain node is currently ${bcResult.status}. Try again later.`,
        paper,
        blockchainResult: bcResult
      });
    }

  } catch (error) {
    console.error("Retry blockchain error:", error);
    return res.status(500).json({ message: "Failed to retry blockchain registration" });
  }
};

// @route  GET /api/papers/access/:id
// @access Private (Assigned Organiser or Uploader)
const accessPaper = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    const isAssigned = paper.assignedTo.toString() === req.user._id.toString();
    const isUploader = paper.uploadedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "Admin";

    if (!isAssigned && !isUploader && !isAdmin) {
      return res.status(403).json({
        message: "Access denied. You are not assigned to this exam paper."
      });
    }

    // Backend unlock-time enforcement (unless Uploader/Admin)
    const isUnlocked = new Date() >= new Date(paper.unlockTime);
    if (!isUnlocked && !isUploader && !isAdmin) {
      return res.status(403).json({
        message: `Paper is locked until ${new Date(paper.unlockTime).toLocaleString()}`
      });
    }

    // Decrypt to temporary file
    const decryptedPath = await decryptFile(paper.fileUrl, paper.iv, paper.originalFileName);

    // Update status in DB to unlocked
    if (paper.status !== "unlocked") {
      paper.status = "unlocked";
      await paper.save();
    }

    const downloadFileName = paper.originalFileName || `${paper.examCode}.pdf`;

    // Download & clean up decrypted temporary file immediately on finish
    res.download(decryptedPath, downloadFileName, (err) => {
      if (err) {
        console.error("File download error:", err);
      }
      fs.unlink(decryptedPath, () => {});
    });

  } catch (error) {
    console.error("Access paper error:", error);
    return res.status(500).json({ message: "Decryption or file access failed" });
  }
};

// @route  GET /api/papers/my-papers
// @access Private (Paper Setter)
const getMyPapers = async (req, res) => {
  try {
    const papers = await Paper.find({ uploadedBy: req.user._id })
      .populate("assignedTo", "firstName lastName organisation email")
      .sort({ createdAt: -1 });

    // Dynamic status update check
    const updatedPapers = papers.map(p => {
      const obj = p.toObject();
      if (new Date() >= new Date(p.unlockTime)) {
        obj.status = "unlocked";
      }
      return obj;
    });

    return res.json({ papers: updatedPapers });

  } catch (error) {
    console.error("Get my papers error:", error);
    return res.status(500).json({ message: "Failed to fetch uploaded papers" });
  }
};

// @route  GET /api/papers/assigned
// @access Private (Organiser)
const getAssignedPapers = async (req, res) => {
  try {
    const papers = await Paper.find({ assignedTo: req.user._id })
      .populate("uploadedBy", "firstName lastName organisation email")
      .sort({ createdAt: -1 });

    const updatedPapers = papers.map(p => {
      const obj = p.toObject();
      if (new Date() >= new Date(p.unlockTime)) {
        obj.status = "unlocked";
      }
      return obj;
    });

    return res.json({ papers: updatedPapers });

  } catch (error) {
    console.error("Get assigned papers error:", error);
    return res.status(500).json({ message: "Failed to fetch assigned papers" });
  }
};

// @route  POST /api/papers/verify-document
// @access Public / Protected
const verifyDocument = async (req, res) => {
  try {
    let inputHash = req.body.hash;
    const examCode = req.body.examCode;

    if (req.file) {
      const fileBuffer = fs.readFileSync(req.file.path);
      inputHash = crypto.createHash("sha256").update(fileBuffer).digest("hex");
      fs.unlink(req.file.path, () => {});
    }

    if (!inputHash && !examCode) {
      return res.status(400).json({ message: "Provide a document file or exam code/hash to verify" });
    }

    // Find paper in DB
    let query = {};
    if (examCode) query.examCode = examCode;
    else if (inputHash) query.hash = inputHash;

    const paper = await Paper.findOne(query)
      .populate("uploadedBy", "firstName lastName organisation")
      .populate("assignedTo", "firstName lastName organisation");

    let documentHashMatch = false;
    if (paper && inputHash) {
      documentHashMatch = (paper.hash.toLowerCase() === inputHash.toLowerCase());
    }

    // Query Smart Contract
    let blockchainRecord = null;
    let blockchainHashMatch = false;
    if (paper?.examCode || examCode) {
      const targetCode = paper ? paper.examCode : examCode;
      const bcData = await getPaperFromBlockchain(targetCode);
      if (bcData.success && bcData.hash) {
        blockchainRecord = bcData;
        if (inputHash) {
          blockchainHashMatch = (bcData.hash.toLowerCase() === inputHash.toLowerCase());
        } else if (paper) {
          blockchainHashMatch = (bcData.hash.toLowerCase() === paper.hash.toLowerCase());
        }
      }
    }

    return res.json({
      verified: documentHashMatch || blockchainHashMatch,
      documentHashMatch,
      blockchainHashMatch,
      inputHash,
      paper,
      blockchainRecord
    });

  } catch (error) {
    console.error("Verify document error:", error);
    return res.status(500).json({ message: "Verification failed" });
  }
};

module.exports = {
  uploadPaper,
  retryBlockchain,
  accessPaper,
  getAssignedPapers,
  getMyPapers,
  verifyDocument
};