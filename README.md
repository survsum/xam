# PerfectXams

**Hack India 2026 Finalist Project — Team 2NKL**

## Overview
PerfectXams is a secure exam paper management platform built for Hack India Spark 7. It protects exam papers through encryption, time-locked access, role-based access control, and blockchain-backed paper notarization.

This project was developed as a finalist submission for Hack India 2026 in the North Region.

## What this project does
- Allows exam authorities to securely upload exam papers.
- Encrypts uploaded files before saving them to storage.
- Stores paper metadata and access rules in MongoDB.
- Records a tamper-proof proof of each uploaded paper on a blockchain smart contract.
- Enables organised users to download papers only after a configured unlock time.
- Provides separate dashboards for paper setters and organisers.

## How it works
1. **User registration and login**
   - Users register with a role: `Exam Authority / Paper Setter`, `Institution Organiser`, or `Admin`.
   - Login returns a JWT token that enables secure API access.

2. **Secure paper upload**
   - Exam authorities upload an exam file from the dashboard.
   - The backend encrypts the uploaded file using AES-256-CBC.
   - The encrypted file path, IV, SHA-256 hash, unlock time, and assignment data are saved in MongoDB.

3. **Blockchain notarization**
   - The backend writes a proof record to a local Hardhat blockchain contract.
   - The contract stores the exam code, file hash, and unlock timestamp.
   - This enables auditability and tamper resistance for uploaded exam papers.

4. **Time-based access control**
   - Organisers can view assigned papers in their dashboard.
   - Paper access remains locked until the unlock time is reached.
   - Once the unlock time passes, the organiser can request download and the backend returns the decrypted file.

## Key components
- `backend/` — Node.js + Express API
- `frontend/` — React + Vite user interface
- `backend/contracts/` — Smart contract definitions
- `backend/ignition/modules/` — Hardhat Ignition deployment module
- `backend/models/` — MongoDB schema definitions for users and papers
- `backend/services/` — Encryption, decryption, and blockchain integration logic
- `backend/routes/` — Authentication and paper API routes
- `backend/uploads/` — Encrypted sample uploaded files

## How to run it
### 1. Setup
- Install Node.js and npm.
- Install dependencies in both folders:
  ```bash
  cd backend
  npm install
  cd ../frontend
  npm install
  ```

### 2. Environment variables
Create a `.env` file in `backend/` with values similar to:
```env
MONGO_URI=mongodb://localhost:27017/perfectxams
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
MASTER_KEY=your_encryption_secret
```

### 3. Start the blockchain node
- Run a local Hardhat node from the backend folder.
- Deploy the smart contract using the provided Ignition module.

### 4. Start the backend API
```bash
cd backend
npm run dev
```

### 5. Start the frontend app
```bash
cd frontend
npm run dev
```

## User flow
- `Exam Authority / Paper Setter` logs in and uploads exam papers.
- They set an unlock date/time and assign the paper to an organiser.
- The paper is encrypted and registered on blockchain.
- `Institution Organiser` logs in, sees assigned papers, and downloads them only after unlock.



## Notes
- The blockchain integration is built for local development with Hardhat.
- The file encryption uses AES-256-CBC and an application master key.
- This project demonstrates secure exam document delivery and decentralized proof of authenticity.

---

**Hack India Spark 7 2026 Finalist** — Team 2NKL
