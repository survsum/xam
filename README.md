# VIEL

**Secure Examination Infrastructure**

**Hack India Spark 7 2026 Finalist — Team 2NKL**

## Overview

VIEL (formerly PerfectXams) is a secure exam paper management platform built for Hack India Spark 7. It protects examination papers using encryption, time-locked access, role-based authorization, and blockchain-backed paper notarization.

## What this project does

- Allows exam authorities to securely upload examination papers.
- Encrypts uploaded files using AES-256-CBC before storage.
- Stores paper metadata and access rules in MongoDB.
- Generates SHA-256 hashes for document integrity verification.
- Records paper proofs on a blockchain smart contract.
- Prevents organisers from downloading papers before the configured unlock time.
- Provides separate dashboards for Paper Setters and Institution Organisers.
- Provides an audit portal for cryptographic document verification.

## How it works

1. **User registration and login**
   - Users register as `Exam Authority / Paper Setter`, `Institution Organiser`, or `Admin`.
   - Authentication is handled using JWT.

2. **Secure paper upload**
   - Paper Setters upload examination files through the dashboard.
   - The backend generates a SHA-256 hash.
   - The file is encrypted using AES-256-CBC.
   - Paper metadata, encryption information, hash, assignment, and unlock time are stored in MongoDB.

3. **Blockchain notarization**
   - The document hash and unlock timestamp are registered on the blockchain.
   - The project uses a Solidity smart contract deployed through Hardhat.
   - The blockchain record provides a tamper-evident proof of the uploaded paper.

4. **Time-locked access**
   - Institution Organisers can view their assigned papers.
   - Downloads remain locked until the configured release time.
   - Once unlocked, the backend decrypts and securely returns the original document.

## Tech Stack

- **Frontend:** React, Vite, React Router, Three.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Security:** AES-256-CBC, SHA-256, JWT, bcrypt
- **Blockchain:** Solidity, Hardhat, Ethers.js
- **Deployment:** Vercel

## Project Structure

```text
VIEL/
├── backend/
│   ├── contracts/
│   ├── controllers/
│   ├── ignition/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   └── server.js
│
├── frontend/
│   ├── public/
│   └── src/
│
├── vercel.json
├── LICENSE
└── README.md