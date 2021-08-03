// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";


contract TokenFactoring is ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;

    mapping(uint256 => uint256) public expirationDate;

    constructor() ERC721("Decentralized Invoice Factoring", "DIF") {
      _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }

    function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, ERC721) returns (bool) {
      return this.supportsInterface(interfaceId);
  }

    function createInvoice(string memory tokenURI, uint256 _expirationDate) public onlyRole(DEFAULT_ADMIN_ROLE) returns (uint256) {
      _tokenIds.increment();
      uint256 newItemId = _tokenIds.current();
      _mint(msg.sender, newItemId);
      _setTokenURI(newItemId, tokenURI);
      expirationDate[newItemId] = ((_expirationDate * 1 days) + block.timestamp);
      return newItemId;
  }

    function destroyInvoice(uint256 _tokenId) public onlyRole(DEFAULT_ADMIN_ROLE) returns (bool) {
      require(block.timestamp > expirationDate[_tokenId], "DIF: Wait to token's expiration date");
      ERC721URIStorage._burn(_tokenId);
      if (expirationDate[_tokenId] != 0) {
        delete expirationDate[_tokenId];
      }
      return true;
  }

  







}
