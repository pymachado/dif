const ERC721 = artifacts.require("TokenFactoring");
const Dai = artifacts.require("Dai");
const Pool = artifacts.require("PoolRBAC");
const Sale = artifacts.require("Sale");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(ERC721, {from: accounts[0]});
  const tokenFactoring = await ERC721.deployed(); 
  await deployer.deploy(Dai, accounts[3], accounts[4], accounts[5], accounts[6], accounts[7], {from: accounts[0]});
  const dai = await Dai.deployed();
  await deployer.deploy(Pool, dai.address, tokenFactoring.address, accounts[1], accounts[2], 
    web3.utils.toWei("1000", "ether"), 
    web3.utils.toWei("3", "ether"), 
    30, 
    web3.utils.toWei("100", "ether"), {from: accounts[0]});
  await tokenFactoring.createInvoice("https://tabacuba/logo.png", web3.utils.toWei("3000", "ether"), 30, "exportacion de tabacos cohiba", "tabacuba", {from: accounts[3]})
  await deployer.deploy(Sale, dai.address, tokenFactoring.address, 1, web3.utils.toWei("2500", "ether"), {from: accounts[3]});
  console.log("Everything it's okay");
  // Use deployer to state migration tasks.
  //createInvoice(string memory tokenURI, uint256 _value, uint256 _expirationDate, string memory _description, string memory _dataBuyer)
};
