// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

interface ISale {
  function pay(uint256 _amount) external returns(bool);
  function tokenId() external view returns(uint256);
  function price() external view returns(uint256);
}
