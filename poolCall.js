//import Web3 from "web3";
const Web3 = require("web3");
const web3 = new Web3("http://loopback:9545");


//import PoolRBAC from "./build/contracts/PooLRBAC.json";
const PoolRBAC = require("./build/contracts/PooLRBAC.json");
//import Dai from "./build/contracts/Dai.json";
const Dai = require("./build/contracts/Dai.json");



    //This functions are executed by the investors
async function deposit(amount, index) {
    let id = await web3.eth.net.getId();
    let deployedNetworkDai = Dai.networks[id];
    let deployedNetworkPool = PoolRBAC.networks[id];
    let dai = new web3.eth.Contract(Dai.abi, deployedNetworkDai.address);
    let accounts = await web3.eth.getAccounts();
    let gasLimitTx1 = await dai.methods.approve(deployedNetworkPool.address, amount).estimateGas({from: accounts[index]});
    await dai.methods.approve(deployedNetworkPool.address, amount).send({from: accounts[index], gas: gasLimitTx1});
    let pool = new web3.eth.Contract(PoolRBAC.abi, deployedNetworkPool.address);
    let gasLimitTx2 = await pool.methods.deposit(amount).estimateGas({from: accounts[index]}); 
    console.log(await pool.methods.deposit(amount).send({from: accounts[index], gas: gasLimitTx2}));
   
}

async function withdraw(value, index) {
    let id = await web3.eth.net.getId();
    let deployedNetwork = PoolRBAC.networks[id];
    let pool = new web3.eth.Contract(PoolRBAC.abi, deployedNetwork.address);
    let accounts = await web3.eth.getAccounts();
    let gasLimit = await pool.methods.withdraw(value).estimateGas({from: accounts[index]});
    console.log(await pool.methods.withdraw(value).send({from: accounts[index], gas: gasLimit}));
}

//This funcions are executed by the role users.
async function approveInvoice(addressSale, index) {
    let id = await web3.eth.net.getId();
    let deployedNetwork = PoolRBAC.networks[id];
    let pool = new web3.eth.Contract(PoolRBAC.abi, deployedNetwork.address);
    let accounts = await web3.eth.getAccounts();
    let gasLimit = await pool.methods.approve(addressSale).estimateGas({from: accounts[index]});
    console.log(await pool.methods.approve(addressSale).send({from: accounts[index], gas: gasLimit})); 
}

async function funding(amount, addressSale, index) {
    let id = await web3.eth.net.getId();
    let deployedNetwork = PoolRBAC.networks[id];
    let pool = new web3.eth.Contract(PoolRBAC.abi, deployedNetwork.address);
    let accounts = await web3.eth.getAccounts();
    let gasLimit = await pool.methods.funding(amount, addressSale).estimateGas({from: accounts[index]});
    console.log(await pool.methods.funding(amount, addressSale).send({from: accounts[index], gas: gasLimit}));
   
}

async function interest(newValue, index) {
    let id = await web3.eth.net.getId();
    let deployedNetwork = PoolRBAC.networks[id];
    let pool = new web3.eth.Contract(PoolRBAC.abi, deployedNetwork.address);
    let accounts = await web3.eth.getAccounts();
    let gasLimit = await pool.methods._interest(newValue).estimateGas({from: accounts[index]});
    console.log(await pool.methods._interest(newValue).send({from: accounts[index], gas: gasLimit}));

} 

async function minInvesting(newValue, index) {
    let id = await web3.eth.net.getId();
    let deployedNetwork = PoolRBAC.networks[id];
    let pool = new web3.eth.Contract(PoolRBAC.abi, deployedNetwork.address);
    let accounts = await web3.eth.getAccounts();
    let gasLimit = await pool.methods._minInvesting(newValue).estimateGas({from: accounts[index]});
    console.log(await pool.methods._minInvesting(newValue).send({from: accounts[index], gas: gasLimit}));
    
}


async function marginInvestment(newValue, index) {
    let id = await web3.eth.net.getId();
    let deployedNetwork = PoolRBAC.networks[id];
    let pool = new web3.eth.Contract(PoolRBAC.abi, deployedNetwork.address);
    let accounts = await web3.eth.getAccounts();
    let gasLimit = await pool.methods._marginInvestment(newValue).estimateGas({from: accounts[index]});
    console.log(await pool.methods._marginInvestment(newValue).send({from: accounts[index], gas: gasLimit}));
    
}

async function grantRole(role, account, index) {
    let id = await web3.eth.net.getId();
    let deployedNetwork = PoolRBAC.networks[id];
    let pool = new web3.eth.Contract(PoolRBAC.abi, deployedNetwork.address);
    let accounts = await web3.eth.getAccounts();
    let gasLimit = await pool.methods.grantRole(role, account).estimateGas({from: accounts[index]});
    console.log(await pool.methods.grantRole(role, account).send({from: accounts[index], gas: gasLimit}));
}

async function revokeRole(role, account, inde) {
    let id = await web3.eth.net.getId();
    let deployedNetwork = PoolRBAC.networks[id];
    let pool = new web3.eth.Contract(PoolRBAC.abi, deployedNetwork.address);
    let accounts = await web3.eth.getAccounts();
    let gasLimit = await pool.methods.revokeRole(role, account).estimateGas({from: accounts[index]});
    console.log(await pool.methods.revokeRole(role, account).send({from: accounts[index], gas: gasLimit}));

}

//Function getters for everone

async function hasRole(role, account) {
    let id = await web3.eth.net.getId();
    let deployedNetwork = PoolRBAC.networks[id];
    let pool = new web3.eth.Contract(PoolRBAC.abi, deployedNetwork.address);
    console.log(await pool.methods.hasRoleRole(role, account).call());
 
} 

async function liquidity() {
    let id = await web3.eth.net.getId();
    let deployedNetwork = PoolRBAC.networks[id];
    let pool = new web3.eth.Contract(PoolRBAC.abi, deployedNetwork.address);
    console.log(web3.utils.fromWei(await pool.methods._liquidity().call()));
}

async function getDataInvestor(addressInvestor) {
    let id = await web3.eth.net.getId();
    let deployedNetwork = PoolRBAC.networks[id];
    let pool = new web3.eth.Contract(PoolRBAC.abi, deployedNetwork.address);
    let tuple = await pool.methods.investors(addressInvestor).call(); 
    console.log(web3.utils.fromWei(tuple[0]));
    console.log(web3.utils.fromWei(tuple[1]));
    console.log(tuple[2]);
}
 
async function pendingReturns(addressInvestor) {
    let id = await web3.eth.net.getId();
    let deployedNetwork = PoolRBAC.networks[id];
    let pool = new web3.eth.Contract(PoolRBAC.abi, deployedNetwork.address);
    console.log(web3.utils.fromWei(await pool.methods.pendingReturns(addressInvestor).call())); 
}

async function isExist(addressInvestor) {
    let id = await web3.eth.net.getId();
    let deployedNetwork = PoolRBAC.networks[id];
    let pool = new web3.eth.Contract(PoolRBAC.abi, deployedNetwork.address);
    console.log(await pool.methods.exist(addressInvestor).call()); 
}

async function isAllowance(addressSale) {
    let id = await web3.eth.net.getId();
    let deployedNetwork = PoolRBAC.networks[id];
    let pool = new web3.eth.Contract(PoolRBAC.abi, deployedNetwork.address);
    console.log(await pool.methods.allowance(addressInvestor).call()); 
}

async function getDataPool() {
    let id = await web3.eth.net.getId();
    let deployedNetwork = PoolRBAC.networks[id];
    let pool = new web3.eth.Contract(PoolRBAC.abi, deployedNetwork.address);
    console.log(web3.utils.fromWei(await pool.methods.minInvesting().call()));
    console.log(web3.utils.fromWei(await pool.methods.interest().call()));
    console.log(await pool.methods.stakingDays().call());
    console.log(web3.utils.fromWei(await pool.methods.marginInvestment().call())); 
    console.log(await pool.methods._numberOfInvestment().call());
}

async function getInvestorTimeToWithdraw(addressInvestor) {
    let id = await web3.eth.net.getId();
    let deployedNetwork = PoolRBAC.networks[id];
    let pool = new web3.eth.Contract(PoolRBAC.abi, deployedNetwork.address);
    console.log(await pool.methods.showRemainingTimeToWithdraw(addressInvestor).call() / 5);
}





/**module.export = {
    deposit,
    approveInvoice,
    funding,
    withdraw,
    getDataPool,
    liquidity,
    getDataInvestor,
    getInvestorTimeToWithdraw 
}
*/

//deposit(web3.utils.toWei("3000", "ether"), 5);
//approveInvoice("0x265D2260829B500173992B30f2649fD3B0af2cFa", 1)
//funding(web3.utils.toWei("2500", "ether"), "0x265D2260829B500173992B30f2649fD3B0af2cFa", 2);
//getDataPool();
liquidity();
//getDataInvestor("0x803Cc1E68704f52a8c158EFe0D8d55f8A6D51fCa");
//withdraw(web3.utils.toWei("3090", "ether"), 4);
//getInvestorTimeToWithdraw("0x803Cc1E68704f52a8c158EFe0D8d55f8A6D51fCa");