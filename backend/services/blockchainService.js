const { ethers } = require("ethers");

const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const ABI = [
  "function storePaper(string memory _examCode, string memory _hash, uint256 _unlockTime) public"
];

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

const wallet = new ethers.Wallet(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  provider
);

const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  ABI,
  wallet
);

const storeOnBlockchain = async (
  examCode,
  hash,
  unlockTime
) => {
  const unlockTimestamp = Math.floor(
    new Date(unlockTime).getTime() / 1000
  );

  const tx = await contract.storePaper(
    examCode,
    hash,
    unlockTimestamp
  );

  await tx.wait();

  console.log("Stored on blockchain:", tx.hash);
};

module.exports = { storeOnBlockchain };