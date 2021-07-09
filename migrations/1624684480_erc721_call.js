const ERC721 = artifacts.require("TokenFactoring");

module.exports = async function(deployer) {
  await deployer.deploy(ERC721);

};
