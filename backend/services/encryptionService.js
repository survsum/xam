const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const algorithm = "aes-256-cbc";

// 32-byte key
const secretKey = crypto
  .createHash("sha256")
  .update(String(process.env.MASTER_KEY || "perfectxskills-secret"))
  .digest("base64")
  .substr(0, 32);

// 16-byte IV
const iv = crypto.randomBytes(16);

const encryptFile = (inputPath) => {
  const outputPath = inputPath + ".enc";

  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(secretKey),
    iv
  );

  const input = fs.createReadStream(inputPath);
  const output = fs.createWriteStream(outputPath);

  input.pipe(cipher).pipe(output);

  return new Promise((resolve, reject) => {
    output.on("finish", () => {
      resolve({
        encryptedPath: outputPath,
        iv: iv.toString("hex"),
      });
    });

    output.on("error", reject);
  });
};

module.exports = { encryptFile };