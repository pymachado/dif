const Web3 = require("web3");
const web3 = new Web3("http://loopback:9545");

const TokenFactoring = require("./build/contracts/TokenFactoring.json");


async function getAccounts() {
    console.log(await web3.eth.getAccounts());
}

async function setup(tokenURI, value, expirationDate, description, dataBuyer, index) {
    const id = await web3.eth.net.getId();
    const deployedNetwork = TokenFactoring.networks[id];
    const accounts = await web3.eth.getAccounts();
    const tokenFactoring = new web3.eth.Contract(TokenFactoring.abi, deployedNetwork.address);
    const gasLimit = await tokenFactoring.methods.createInvoice(
        tokenURI, 
        value,
        expirationDate, 
        description, 
        dataBuyer).estimateGas({from: accounts[index]});
    await tokenFactoring.methods.createInvoice(
            tokenURI, 
            value,
            expirationDate, 
            description, 
            dataBuyer).send({from: accounts[index], gas: gasLimit});

        /** function createInvoice(string memory tokenURI, uint256 _value, uint256 _expirationDate, string memory _description, string memory _dataBuyer) */
}

async function getDataTokens(tokenId) {
    const id = await web3.eth.net.getId();
    const deployedNetwork = TokenFactoring.networks[id];
    const tokenFactoring = new web3.eth.Contract(TokenFactoring.abi, deployedNetwork.address);
    const tuple = await tokenFactoring.methods.getDataToken(tokenId).call(); 
    console.log("value of tokenId " +tokenId+ " is " +web3.utils.fromWei(tuple[0]));
    console.log("start up date of tokenId " +tokenId+ " is " +tuple[1]);
    console.log("exiration date of tokenId " +tokenId+ " is " +tuple[2]);
    console.log(tuple[3]);
    console.log(tuple[4]);
    
}

async function heightNFT() {
    const id = await web3.eth.net.getId();
    const deployedNetwork = TokenFactoring.networks[id];
    const tokenFactoring = new web3.eth.Contract(TokenFactoring.abi, deployedNetwork.address);
    console.log(await tokenFactoring.methods._tokenIds().call());     
}

async function ownerOf(tokenId) {
    const id = await web3.eth.net.getId();
    const deployedNetwork = TokenFactoring.networks[id];
    const tokenFactoring = new web3.eth.Contract(TokenFactoring.abi, deployedNetwork.address);
    console.log(await tokenFactoring.methods.ownerOf(tokenId).call());
}

//nonceToken();
//getDataTokens(1);
ownerOf(1);
//setup("https://tabacuba/logo.png", web3.utils.toWei("5000", "ether"), 30, "exportacion de tabacos cohiba", "tabacuba", 1);

