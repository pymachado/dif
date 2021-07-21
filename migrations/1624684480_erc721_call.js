const ERC721 = artifacts.require("TokenFactoring");
const PoolRBAC = artifacts.require("PooLRBAC");
const erc20Address = "0x1593145c85fD0041649e51d7d67d2a205E5e5e5D";
module.exports = async function(deployer, network, accounts) {
  const [admin, moderator, funder, _] = accounts;
  if (network === 'ropsten' || network === 'development') {
    await deployer.deploy(ERC721, {from: admin});
    const tokenFactoring = await ERC721.deployed();
    await deployer.deploy(PoolRBAC, 
      erc20Address, 
      tokenFactoring.address, 
      moderator, 
      funder, 
      web3.utils.toWei("2000", "ether"), 
      web3.utils.toWei("10", "ether"),
      360, 
      web3.utils.toWei("500", "ether"), {from: admin});
  }
  
};
