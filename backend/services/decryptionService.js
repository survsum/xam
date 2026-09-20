const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const algorithm = "aes-256-cbc";

const getSecretKeyBuffer = () => {
  return crypto
    .createHash("sha256")
    .update(String(process.env.MASTER_KEY || "perfectxams-secret"))
    .digest(); // 32-byte Buffer
};

const decryptFile = (inputPath, ivHex, originalFileName = "paper.pdf") => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(inputPath)) {
      return reject(new Error("Encrypted file not found on disk"));
    }

    const secretKeyBuffer = getSecretKeyBuffer();
    const ivBuffer = Buffer.from(ivHex, "hex");

    const decipher = crypto.createDecipheriv(
      algorithm,
      secretKeyBuffer,
      ivBuffer
    );

    // Save temporary decrypted file in uploads/decrypted folder
    const decryptedDir = path.join(__dirname, "..", "uploads", "decrypted");
    if (!fs.existsSync(decryptedDir)) {
      fs.mkdirSync(decryptedDir, { recursive: true });
    }

    const safeBaseName = path.basename(originalFileName || "paper.pdf");
    const uniqueDecryptedName = `${Date.now()}-${Math.floor(Math.random() * 10000)}-${safeBaseName}`;
    const outputPath = path.join(decryptedDir, uniqueDecryptedName);

    const inputStream = fs.createReadStream(inputPath);
    const outputStream = fs.createWriteStream(outputPath);

    inputStream
      .pipe(decipher)
      .pipe(outputStream)
      .on("finish", () => {
        resolve(outputPath);
      })
      .on("error", (err) => {
        // Clean up partial output file if error occurs
        if (fs.existsSync(outputPath)) {
          fs.unlink(outputPath, () => {});
        }
        reject(err);
      });
  });
};

module.exports = { decryptFile };