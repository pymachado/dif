const Web3 = require("web3");
const web3 = new Web3("http://loopback:9545");

const Sale = require("./build/contracts/Sale.json");
const Dai = require("./build/contracts/Dai.json");
const Dif = require("./build/contracts/TokenFactoring.json");


async function owner() {
    const id = await web3.eth.net.getId();
    const deployedNetwork = Sale.networks[id];
    const sale = new web3.eth.Contract(Sale.abi, deployedNetwork.address);
    console.log(await sale.methods.owner().call());
}

async function price() {
    const id = await web3.eth.net.getId();
    const deployedNetwork = Sale.networks[id];
    const sale = new web3.eth.Contract(Sale.abi, deployedNetwork.address);
    const value = await sale.methods.price().call(); 
    console.log(web3.utils.fromWei(value));
}

async function tokenId() {
    const id = await web3.eth.net.getId();
    const deployedNetwork = Sale.networks[id];
    const sale = new web3.eth.Contract(Sale.abi, deployedNetwork.address);
    console.log(await sale.methods.tokenId().call());
}


async function ended() {
    const id = await web3.eth.net.getId();
    const deployedNetwork = Sale.networks[id];
    const sale = new web3.eth.Contract(Sale.abi, deployedNetwork.address);
    console.log(await sale.methods.ended().call());
}

async function factor() {
    const id = await web3.eth.net.getId();
    const deployedNetwork = Sale.networks[id];
    const sale = new web3.eth.Contract(Sale.abi, deployedNetwork.address);
    console.log(await sale.methods.factor().call());
}

async function seller() {
    const id = await web3.eth.net.getId();
    const deployedNetwork = Sale.networks[id];
    const sale = new web3.eth.Contract(Sale.abi, deployedNetwork.address);
    console.log(await sale.methods.seller().call());
}

async function showProfit() {
    const id = await web3.eth.net.getId();
    const deployedNetwork = Sale.networks[id];
    const sale = new web3.eth.Contract(Sale.abi, deployedNetwork.address);
    const value = await sale.methods.showProfit().call() 
    console.log(web3.utils.fromWei(value));
    /**function showProfit()  */
}

async function showRemainingDate() {
    const id = await web3.eth.net.getId();
    const deployedNetwork = Sale.networks[id];
    const sale = new web3.eth.Contract(Sale.abi, deployedNetwork.address);
    console.log(await sale.methods.showRemainingDate().call());     
/**function showRemainingDate() external view returns(uint256)*/
}
 
async function pay(amount, index) {
    const id = await web3.eth.net.getId();
    const deployedNetworkSale = Sale.networks[id];
    const deployedNetworkDai = Dai.networks[id];
    const accounts = await web3.eth.getAccounts();
    const dai = new web3.eth.Contract(Dai.abi, deployedNetworkDai.address);
    const gasLimitTx1 = await dai.methods.approve(deployedNetworkSale.address, amount).estimateGas({from: accounts[index]})
    await dai.methods.approve(deployedNetworkSale.address, amount).send({from: accounts[index], gas: gasLimitTx1});
    const sale = new web3.eth.Contract(Sale.abi, deployedNetworkSale.address);
    const gasLimitTx2 = await sale.methods.pay(amount).estimateGas({from: accounts[index]});
    const tx=  await sale.methods.pay(amount).send({from: accounts[index], gas: gasLimitTx2});  
    console.log(tx);
    /**function pay(uint256 _amount)*/
}

async function associate(tokenId, index) {
    const id = await web3.eth.net.getId();
    const deployedNetwork = Dif.networks[id];
    const deployedNetworkSale = Sale.networks[id];
    const accounts = await web3.eth.getAccounts();
    const dif = new web3.eth.Contract(Dif.abi, deployedNetwork.address);
    const gasLimit = await dif.methods.approve(deployedNetworkSale.address, tokenId).estimateGas({from: accounts[index]});
    const tx = await dif.methods.approve(deployedNetworkSale.address, tokenId).send({from: accounts[index], gas: gasLimit});
    console.log(tx);
}

async function newSale(tokenId, price, index) {
    const id = await web3.eth.net.getId();
    const deployedNetwork = Sale.networks[id];
    const accounts = await web3.eth.getAccounts();
    const sale = new web3.eth.Contract(Sale.abi, deployedNetwork.address);
    const gasLimit = await sale.methods.newSale(amount).estimateGas({from: accounts[index]}); 
    const tx=  await sale.methods.newSale(tokenId, price).send({from: accounts[index], gas: gasLimit}); 
    console.log(tx);    
    /**function newSale(uint256 _tokenId, uint256 _price) external onlyOwner()*/
}

//owner()
//tokenId()
//price()
//ended()
//factor()
//seller()
//showProfit()
//showRemainingDate()
associate(1, 3);
//pay(web3.utils.toWei("2500", "ether"), 3)