const { ethers } = require("ethers");

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const PRIVATE_KEY = process.env.HARDHAT_PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const ABI = [
  "function storePaper(string memory _examCode, string memory _hash, uint256 _unlockTime) public",
  "function getPaper(string memory _examCode) public view returns (string memory, string memory, uint256, address)"
];

const storeOnBlockchain = async (examCode, hash, unlockTime) => {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL, undefined, { staticNetwork: true, timeout: 2000 });
    
    // Quick connectivity check
    await provider.getBlockNumber().catch(() => {
      throw new Error("RPC_OFFLINE");
    });

    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

    const unlockTimestamp = Math.floor(new Date(unlockTime).getTime() / 1000);

    const tx = await contract.storePaper(examCode, hash, unlockTimestamp);
    const receipt = await tx.wait();

    console.log(`Stored on blockchain [${examCode}]:`, tx.hash);

    return {
      success: true,
      status: "registered",
      txHash: tx.hash,
      blockNumber: receipt?.blockNumber
    };
  } catch (error) {
    console.warn(`Blockchain notarization note for [${examCode}]:`, error.message);
    const isOffline = error.message.includes("RPC_OFFLINE") || error.code === "ECONNREFUSED" || error.code === "TIMEOUT";
    return {
      success: false,
      status: isOffline ? "offline" : "failed",
      txHash: "",
      error: error.message
    };
  }
};

const getPaperFromBlockchain = async (examCode) => {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL, undefined, { staticNetwork: true, timeout: 2000 });
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    const result = await contract.getPaper(examCode);
    return {
      success: true,
      examCode: result[0],
      hash: result[1],
      unlockTime: Number(result[2]),
      uploadedBy: result[3]
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = { storeOnBlockchain, getPaperFromBlockchain };