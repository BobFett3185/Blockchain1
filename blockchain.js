/*
The `this` keyword in JavaScript:
- Inside a class method, `this` refers to the specific instance of the object created from that class.
- Use `this` to access the object's own properties and other methods defined in the same class.
- `this` helps make the method dynamic and work on any instance of the class.
*/

// Import built-in crypto module
const crypto = require('crypto');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction{ // these transactions make up a block. They are stored in array
    constructor (fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
    calculateHash(){ // calculate hash for a transaction to allow signing a transaction 
        const dataToHash = this.fromAddress + this.toAddress + (this.amount).toString();
        return crypto.createHash('sha256').update(dataToHash).digest('hex');

    }
    signTransaction(signingKey){ 
        //calls ec function to get public key which should be the same as the fromAddress 
        if(signingKey.getPublic('hex')!= this.fromAddress){
            throw new Error("You can't sign from another person's address");
        }

        // we calculate a hash for the transaction and then create a signature for it based on the hash
        const hashTx = this.calculateHash(); 
        const sig = signingKey.sign(hashTx);            // no 'base64'
        this.signature = sig.toDER('hex'); 
    }

    isValid(){ // for a given transaction it checks the validity of fromAddress, signature and verifies signature using ec
        // basic checks 
        if(this.fromAddress == null){
            return true; 
        }
        if (this.signature == null || this.signature.length ==0 ){
            throw new Error("No valid signature");
        }
        //verifying signature
        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex')
        return publicKey.verify(this.calculateHash(), this.signature); 

    }


}

class Block{
    //constructor for a block
    constructor(timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp; 
        this.transactions = transactions; 
        this.previousHash = previousHash; 
        this.hash = this.calculateHash(); 
        this.nonce =0; 
    }
    // get hash from js crypto library
    calculateHash(){  // uses libary to make hash
        const dataToHash =  this.timestamp + this.previousHash + JSON.stringify(this.transactions)+ this.nonce;
        return crypto.createHash('sha256').update(dataToHash).digest('hex');
    }
    mineBlock(difficulty){// you call this mine block when you create a new block. The hash is now calculated in here 
        while(this.hash.substring(0, difficulty) != Array(difficulty+1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();

        }
        console.log("Block Mined: " + this.hash + " Nonce: " + this.nonce);    // nonce tells you how many times the hash had to be recalculated
       
        /*
        while(this.hash.substring(0, difficulty) != Array(difficulty-1).join("0"))
        This condition ensures that the block's hash is recalculated until the substring of the first 0 to difficulty characters are zeroes
        Having the requirement for a certain number of leading zeros is important for blockchain because it requires coputational power to 
        get the blocks hash with the required number of zeros. This allows the proof of work mechanism to happen. 
        */
    }
    hasValidTransactions(){
        for(const tx of this.transactions){// loops through the array of transactions
            if(!tx.isValid()){
                return false; 
            }
            return true; 
        }  

    }
}

class Blockchain{ 
    constructor(){
        this.chain = [this.createGenesisBlock()] // the chain is an array of blocks 
        this.difficulty =2;  // increasing difficulty is exponential since the machine has to try tons more combinations
        this.pendingTransactions = [];
        this.reward = 100; 
    }

    createGenesisBlock(){
        return new Block("7/7/2025", "Genesis block", "0");// create some random block by calling new block constructor
        // new keyword to create instance of user defined object 
    }

    getPreviousBlockHash(){
        return this.chain[this.chain.length-1].hash;
        // return the last element in the chain array-- this is the latest block 

    }
    /*
    This gets replaced by new function minePendingTrans
    addBlock(newBlock){ // newBlock is a block object 
    // need to make block and give it a hash and the previous hash
        newBlock.previousHash = this.getLatestBlock().hash; // the previous hash from the latest hash 
        //newBlock.hash = newBlock.calculateHash(); // give it its own hash 
        newBlock.mineBlock(this.difficulty); 
        this.chain.push(newBlock) 
    }
    */


    // allows for multiple transactions in a block
    minePendingTrans(miningRewardAddress){ // when a miner calls the method they give their address to recieve reward
        let block = new Block(Date.now(), this.pendingTransactions, this.getPreviousBlockHash());
        block.mineBlock(this.difficulty)
        this.chain.push(block)

        // adds the reward to the next set of pending transactions, to be verified in the next block
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.reward)
        ];

    }

    addTransaction(transaction){
        if(!transaction.toAddress || !transaction.fromAddress)
            throw new Error("Transaction must have a 'to address' and a 'from address'.");

        if(!transaction.isValid())
            throw new Error("Transaction is not valid");  // might be a signature reason if this error is thrown

        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0; 

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress == address) 
                    balance -= trans.amount; 
                if(trans.toAddress == address) 
                    balance += trans.amount; 

            }
        }
        return balance; 
    }

    isChainValid(){  // verifying integrity of the chain

        // checks the hash to make sure the blocks are still linked correctly 
        for(let i =1; i< this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1]; 

            //check if the current block transcation has validTransactions 
            if(!currentBlock.hasValidTransactions())
                return false; 

            // check if the hashes match up 
            if(currentBlock.hash != currentBlock.calculateHash())
                return false;
            if(currentBlock.previousHash != previousBlock.hash)
                return false; 
        }

        return true; 
    }
}

module.exports.Blockchain = Blockchain; 
module.exports.Transaction = Transaction; 