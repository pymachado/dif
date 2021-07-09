const Web3 = require("web3");
const web3 = new Web3("http://loopback:9545");

//import liquidity from "./poolCall.js";

const pool = new require("./poolCall.js");

pool.deposit = {
    amount: web3.utils.toWei("3000", "ether"),
    index: 5
}