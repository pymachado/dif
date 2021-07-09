// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract TokenFactoring is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;
    
    struct Data {
        uint256 value;
        uint256 startupDate;
        uint256 expirationDate;
        string description;
        string dataBuyer;
    }

  mapping (uint256 => Data) public _dataTokens;

  constructor() ERC721("Decentralized Invoice Factoring", "DIF") {

  }

  function createInvoice(string memory tokenURI, uint256 _value, uint256 _expirationDate, string memory _description, string memory _dataBuyer) public returns(uint256) {
    _tokenIds.increment();
    uint256 newItemId = _tokenIds.current();
    _mint(msg.sender, newItemId);
    _setTokenURI(newItemId, tokenURI);
    _expirationDate = (_expirationDate * 1 days) + block.timestamp;
    _dataTokens[newItemId] = Data(_value, block.timestamp, _expirationDate, _description, _dataBuyer); 
     return newItemId;
  }
  

  function getDataToken(uint256 tokenId) public view returns(uint256 value, uint256 startupDate, uint256 expirationDate, string memory description, string memory dataBuyer) {
    value = _dataTokens[tokenId].value;
    startupDate = _dataTokens[tokenId].startupDate;
    expirationDate = _dataTokens[tokenId].expirationDate;
    description = _dataTokens[tokenId].description;
    dataBuyer = _dataTokens[tokenId].dataBuyer;
  }

  







}
