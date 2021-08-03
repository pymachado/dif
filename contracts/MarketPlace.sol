// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MarketPlace is ERC165{
  using Counters for Counters.Counter;
  Counters.Counter public nonce;
  IERC20 asset;
  IERC721 commodity;



  mapping (uint256 => uint256) private priceItems;
  mapping (uint256 => bool) private isPriceSeted;

  event SuccessTrade(address recipient, uint256 tokenId, uint256 indexed hightBlock);
  event PriceSeted(uint256 tokenId, uint256 price);

  constructor(address _asset, address _commodity) {
    asset = IERC20(_asset);
    commodity = IERC721(_commodity);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IERC20).interfaceId
            || interfaceId == type(IERC721).interfaceId || super.supportsInterface(interfaceId);
  }

  function pay(uint256 _tokenId, uint256 _value) external returns (bool){
    require(priceItems[_tokenId] == _value, "Marketplace: The value that you try to pay not match with the value of commodity");
    asset.transferFrom(msg.sender, commodity.ownerOf(_tokenId), _value);
    commodity.transferFrom(commodity.ownerOf(_tokenId), msg.sender, _tokenId);
    nonce.increment();
    emit SuccessTrade(msg.sender, _tokenId, nonce.current());
    return true;
  }

  function putPriceToItem(uint256 _tokenId, uint256 _price) external returns (bool) {
    require(commodity.ownerOf(_tokenId) == msg.sender, "MarketPlace You are not the owner of this item");
    require(isPriceSeted[_tokenId] == false, "Marketplace: This item price it was seted");
    require(commodity.getApproved(_tokenId) == address(this), "Marketplace: I don't have right over this item.");
    priceItems[_tokenId] = _price;
    isPriceSeted[_tokenId] = true;
    emit PriceSeted(_tokenId, _price);
    return true;

  }
  
}
