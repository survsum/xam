const crypto = require("crypto");
const fs = require("fs");

const algorithm = "aes-256-cbc";

// Generate exact 32-byte key buffer from MASTER_KEY
const getSecretKeyBuffer = () => {
  return crypto
    .createHash("sha256")
    .update(String(process.env.MASTER_KEY || "perfectxams-secret"))
    .digest(); // returns 32-byte Buffer
};

const encryptFile = (inputPath) => {
  return new Promise((resolve, reject) => {
    // 1. Calculate canonical SHA-256 from original raw file bytes
    fs.readFile(inputPath, (readErr, fileBuffer) => {
      if (readErr) return reject(readErr);

      const canonicalHash = crypto
        .createHash("sha256")
        .update(fileBuffer)
        .digest("hex");

      // 2. Generate random 16-byte IV per document
      const iv = crypto.randomBytes(16);
      const secretKeyBuffer = getSecretKeyBuffer();

      const cipher = crypto.createCipheriv(algorithm, secretKeyBuffer, iv);

      const outputPath = inputPath + ".enc";
      const outputStream = fs.createWriteStream(outputPath);

      const inputStream = fs.createReadStream(inputPath);

      inputStream
        .pipe(cipher)
        .pipe(outputStream)
        .on("finish", () => {
          // Unlink unencrypted temporary upload file
          fs.unlink(inputPath, () => {});

          resolve({
            encryptedPath: outputPath,
            iv: iv.toString("hex"),
            canonicalHash,
          });
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  });
};

module.exports = { encryptFile, getSecretKeyBuffer };