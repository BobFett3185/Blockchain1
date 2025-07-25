const{Blockchain, Transaction} = require("./blockchain");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('85b4de22acc078d77416dfc774b702b75caaa12f92b7740472661c2f34dc3409');
const myWalletAddress = myKey.getPublic('hex');

// in this code, myKey is your private key and walletAddress is your public key
let SGACoin = new Blockchain();

// create transactions and sign with your private key
const tx1 = new Transaction(myWalletAddress, 'random 2nd person', 80); 
tx1.signTransaction(myKey)
SGACoin.addTransaction(tx1); 

// new Transaction(fromAddress, toAddress, amount)

console.log("\n Starting the miner...");
SGACoin.minePendingTrans(myWalletAddress); 

console.log("\n Keane's balance is", SGACoin.getBalanceOfAddress(myWalletAddress));

console.log('Is the blockchain valid?'+ SGACoin.isChainValid()+"\n"); // true 


/*
// this tampers with the blockchain
SGACoin.chain[1].transactions[1].amount = "100";
// if you do this then recalculate hash it won't work bc chain of hashes will be broken
console.log('Is the blockchain valid?'+ SGACoin.isChainValid()); // false

// to print blockchain log
console.log(JSON.stringify(SGACoin, null, 4 ));

*/

