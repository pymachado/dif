// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./ISale.sol";

contract POOL is Ownable {
  using Counters for Counters.Counter;
  uint256 public minInvesting;
  uint256 public interest;
  uint256 public withdrawDay;
  uint256 public marginInvestment;
  Counters.Counter private _numberOfInvestment;
  IERC20 dai;

  
  struct Investor {
    uint256 amountFounding;
    uint256 benefits;
    uint256 dayDeposit;
  }

  mapping (address => Investor) public investors;
  mapping(address => uint) public pendingReturns;
  mapping (address => bool) public exist;

  event Deposit(address indexed investor, uint256 indexed amount);
  event Withdraw(address indexed investor, uint256 indexed amount);
  event Funding(address indexed contractSale, uint256 indexed amountFounding);

  constructor(address asset, uint256 MinInvesting, uint256 Rate, uint256 WithdrawDay, uint256 MarginInvestment) {
      minInvesting = MinInvesting;
      interest = Rate;
      dai = IERC20(asset);
      withdrawDay = (WithdrawDay * 1440 minutes) + block.timestamp;
      marginInvestment = MarginInvestment;
  }
  
  function investingOf(address _investor) public view returns(uint256 balance){
    balance = investors[_investor].amountFounding;
  }
  
  function profit(address _investor) public view returns(uint256) {
    return _profit(interest, investors[_investor].amountFounding);
  }

  function _liquidity() public view returns(uint256 liquidity) {
    liquidity = dai.balanceOf(address(this));
  } 

  function _interest(uint256 newInterest) public onlyOwner() returns(bool status) {
    interest = newInterest;
    status = true;
  }

  function _minInvesting(uint256 newMinInvesting) public onlyOwner() returns(bool status) {
    minInvesting = newMinInvesting;
    status = true;
  }

  function _marginInvestment(uint256 newMarginInvestmment) public onlyOwner() returns(bool status) {
    marginInvestment = newMarginInvestmment;
    status = true;
  }

  function deposit(uint256 _amount) external returns(bool) {
    uint256 valueINV = pendingReturns[_msgSender()] += _amount;
    require(valueINV >= minInvesting, "POOL: Min investing exceeds the amount.");
    dai.transferFrom(_msgSender(), address(this), _amount);
    uint256 _benefits = valueINV + _profit(interest, valueINV);
    investors[_msgSender()] = Investor(valueINV, _benefits, block.timestamp);
    exist[_msgSender()] = true;
    _numberOfInvestment.increment();
    emit Deposit(_msgSender(), _amount);
    return true; 
  }

  function withdraw(uint256 _valueWithdrawal) external returns(bool) {
    require(exist[_msgSender()], "POOL: Your are not an investor registered.");
    require(_valueWithdrawal <= investors[_msgSender()].benefits, "You don't have funds.");
    uint256 daysPassed = (block.timestamp - investors[_msgSender()].dayDeposit) / 1 minutes;
    require(daysPassed >=  withdrawDay + 1 minutes, "POOL: You have to wait after the withdraw day.");
    dai.transfer(_msgSender(), _valueWithdrawal);
    investors[_msgSender()].benefits -= _valueWithdrawal;
    emit Withdraw(_msgSender(), _valueWithdrawal);
    return true;
  }  


  function funding(uint256 _amount, address contractSale) external onlyOwner() returns(bool) {
    require(_liquidity() - _amount > marginInvestment, "POOL: The amount exceed the marging of investing.");
    dai.approve(contractSale, _amount);
    ISale(contractSale).pay(_amount);
    emit Funding(contractSale, _amount);
    return true;
  }

  function _profit(uint256 _interestInPorcentage, uint256 _amount) private pure returns(uint256) {
     uint256 value = (_interestInPorcentage * _amount) / (100 * 10 **18);
     return value;
  }


}
