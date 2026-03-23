# SGACoin Blockchain Implementation

A from-scratch implementation of a basic blockchain system featuring a custom Smart Contract Virtual Machine and Elliptic Curve Cryptography.

## Technical Overview
This project is a full-stack decentralized ledger designed to demonstrate the interaction between cryptographic security, consensus algorithms, and state machines. It moves beyond a simple data structure by incorporating a functional Virtual Machine (VM) and a web-based interface for network interaction.

---

## Core Architecture

### 1. Cryptographic Identity Layer
The security of the system is rooted in the **secp256k1** elliptic curve, the same mathematical standard used by Bitcoin and Ethereum.
* **Asymmetric Encryption:** The `generateKeys.js` utility produces private keys for signing and public keys that serve as wallet addresses.
* **Digital Signatures:** Transactions are only added to the "pending" pool if they carry a valid cryptographic signature. This proves ownership without revealing the private key.
* **Data Integrity:** Every block contains a SHA-256 hash of its contents and the hash of the previous block, ensuring the ledger is immutable.

### 2. Consensus and Mining (Proof-of-Work)
To secure the network against spam and Sybil attacks, the system requires computational work to validate blocks.
* **Mining Algorithm:** Miners must solve a computational puzzle by finding a "nonce" that, when hashed with the block data, results in a string meeting a specific difficulty target (e.g., starting with four zeros).
* 
* **Block Rewards:** The first node to solve the puzzle is granted a reward transaction, which is the primary mechanism for minting new currency in the system.

### 3. Smart Contract Virtual Machine (VM)
Unlike standard ledgers that only track balances, this system supports deployable logic and persistent storage.
* **JavaScript VM:** Users can deploy JavaScript code directly to the chain.
* **Persistent State:** Each contract maintains a "state" object stored on-chain. When a contract function is called via a transaction, the VM executes the code and updates the global state.
* 
* **On-Chain Logic:** This allows for decentralized applications (dApps) where the rules of the contract are enforced by the blockchain itself rather than a central server.

### 4. Interface and Connectivity
The system is exposed via a standard web stack to allow for real-time monitoring and interaction.
* **REST API (Node.js/Express):** Provides endpoints for querying the chain (`GET /blocks`), submitting transactions (`POST /transaction`), and triggering the mining process (`GET /mine`).
* **Frontend Dashboard (React):** A visual "Block Explorer" that allows users to monitor the chain, check wallet balances, and observe the mining process as it happens.

---

## Tech Stack
* **Language:** JavaScript (ES6+)
* **Runtime:** Node.js
* **Frameworks:** Express.js (API), React.js (Frontend)
* **Libraries:** `crypto-js` (Hashing), `elliptic` (secp256k1 Cryptography)

## Project Structure
* `blockchain.js`: Core logic for blocks, the chain, and the mining algorithm.
* `Main.js`: The server entry point and REST API routes.
* `generateKeys.js`: Utility for creating secure cryptographic identities.
* `src/`: React source code for the dashboard and visualizer.

## Setup and Installation
1. **Install Dependencies:**
   ```bash
   npm install

2. **Generate your wallet:**
    node generateKeys.js
3. **Start it up:**
    node Main.js
   

  
