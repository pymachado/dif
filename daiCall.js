const Web3 = require("web3");
require('dotenv').config();
//const web3 = new Web3("http://loopback:9545");
const web3 = new Web3(`https://ropsten.infura.io/v3/${process.env.INFURA_ID}`);

const Dai = require("./build/contracts/Dai.json");

async function getBalance(address) {
    const id = await web3.eth.net.getId();
    const deployedNetwork = Dai.networks[id];
    const dai = new web3.eth.Contract(Dai.abi, deployedNetwork.address);
    const value = await dai.methods.balanceOf(address).call()
    console.log(web3.utils.fromWei(value)+ " Dai");

}


async function name() {
    const id = await web3.eth.net.getId();
    const deployedNetwork = Dai.networks[id];
    const dai = new web3.eth.Contract(Dai.abi, deployedNetwork.address);
    console.log(await dai.methods.name().call());

}

async function symbol() {
    const id = await web3.eth.net.getId();
    const deployedNetwork = Dai.networks[id];
    const dai = new web3.eth.Contract(Dai.abi, deployedNetwork.address);
    console.log( await dai.methods.symbol().call());

}

async function decimals() {
    const id = await web3.eth.net.getId();
    const deployedNetwork = Dai.networks[id];
    const dai = new web3.eth.Contract(Dai.abi, deployedNetwork.address);
    console.log(await dai.methods.decimals().call());

}

async function totalSuply() {
    const id = await web3.eth.net.getId();
    const deployedNetwork = Dai.networks[id];
    const dai = new web3.eth.Contract(Dai.abi, deployedNetwork.address);
    const value = await dai.methods.totalSupply().call()
    console.log(web3.utils.fromWei(value)+ " Dai");

}

async function transfer(recipient, amount, index) {
    const id = await web3.eth.net.getId();
    const deployedNetwork = Dai.networks[id];
    const accounts = await web3.eth.getAccounts();
    const dai = new web3.eth.Contract(Dai.abi, deployedNetwork.address);
    const gasLimit = await dai.methods.transfer(recipient, amount).estimateGas({from: accounts[index]});
    console.log(await dai.methods.transfer(recipient, amount).send({from: accounts[index], gas: gasLimit}));
}

//name()
//symbol()
//decimals()
//transfer("0xeE4924d58eb24aA3e2FE8A8e24009eE10d09D974", web3.utils.toWei("3000", "ether"), 7);
//getBalance("0x5846346EbBf4b6e2d74a61B846666e605Afd0D2d")
//totalSuply()
