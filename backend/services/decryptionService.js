const crypto = require("crypto");
const fs = require("fs");

const algorithm = "aes-256-cbc";

const secretKey = crypto
  .createHash("sha256")
  .update(String(process.env.MASTER_KEY || "perfectxskills-secret"))
  .digest("base64")
  .substr(0, 32);

const decryptFile = (inputPath, ivHex) => {
  const outputPath = inputPath.replace(".enc", "");

  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey),
    Buffer.from(ivHex, "hex")
  );

  const input = fs.createReadStream(inputPath);
  const output = fs.createWriteStream(outputPath);

  input.pipe(decipher).pipe(output);

  return new Promise((resolve, reject) => {
    output.on("finish", () => {
      resolve(outputPath);
    });

    output.on("error", reject);
  });
};

module.exports = { decryptFile };