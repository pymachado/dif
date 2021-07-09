// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ITokenFactoring.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Sale is Ownable{

    IERC20 dai;
    ITokenFactoring dif;

    address public seller;
    address public factor;
    uint256 public tokenId;
    uint256 public price;
    bool public ended;

    event PaidUP (address indexed payer, uint256 indexed tokenId);
    event NewSale(uint256 indexed tokenId, uint256 indexed price);

    constructor (address asset, address addressDIF, uint256 _tokenId, uint256 _price) {
        dai = IERC20(asset);
        dif = ITokenFactoring(addressDIF);
        seller = owner();
        tokenId = _tokenId;
        price = _price;
    }

    function pay(uint256 _amount) external returns(bool) {
       (, , uint256 expirationDate, , ) = dif.getDataToken(tokenId);
       require(block.timestamp < expirationDate, "Sale: This token has been expirated.");
       require(price == _amount, "Sale: Not match the amount transfered with token price.");
       factor = _msgSender();
       dai.transferFrom(factor, seller, _amount);
       dif.transferFrom(seller, factor, tokenId);
       emit PaidUP(factor, tokenId);
       ended = true;
       return true;
    }

    function showRemainingDate() external view returns(uint256) {
        (, , uint256 expirationDate, , ) = dif.getDataToken(tokenId);
        require(block.timestamp <= expirationDate, "Sale: This token has expirated");
        return (expirationDate - block.timestamp) / 1 days;  
    }

    function showProfit() external view returns(uint256) {
        (uint256 value, , , , ) = dif.getDataToken(tokenId);
        return value - price;
    }

    function newSale(uint256 _tokenId, uint256 _price) external onlyOwner() returns(bool) {
        require(ended, "Sale: You hae to wait to endng the current sale.");
        factor = address(0);
        tokenId = _tokenId;
        price = _price;
        ended = false;
        emit NewSale(tokenId, price);    
        return true;
    }

}