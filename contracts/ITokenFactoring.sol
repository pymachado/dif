// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface ITokenFactoring is IERC721 {
    function getDataToken(uint256 tokenId) external view returns(
    uint256 value, 
    uint256 startupDate, 
    uint256 expirationDate,
    string memory description, 
    string memory dataBuyer);
}