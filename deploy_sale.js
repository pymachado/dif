const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const Sale = require("./build/contracts/Sale.json");
require("dotenv").config();
const addressAsset = "0x1593145c85fD0041649e51d7d67d2a205E5e5e5D"
const addressDIF = "0xBb4e5208B88F68CE12Afa38403246D9c3D790020"

'addresss sale contract 1 = 0xc81B377b74C596773E9c03f6c8f9F9ff168Ed10A'

const init = async (index) => {
    const provider = new HDWalletProvider({
        mnemonic: {phrase: process.env.MNEMONIC},
        providerOrUrl: `https://ropsten.infura.io/v3/${process.env.INFURA_ID}`,
        addressIndex: index
    });
    const web3 = new Web3(provider);
    let sale = new web3.eth.Contract(Sale.abi,);
    const accounts = await web3.eth.getAccounts();
    //constructor (address asset, address addressDIF, uint256 _tokenId, uint256 _price)
    sale = await sale.deploy({
        data: Sale.bytecode,
        arguments: [addressAsset, addressDIF, 2, web3.utils.toWei("1000", "ether") ]}).send({from: accounts[0]});
    console.log(sale);
}

init(0);