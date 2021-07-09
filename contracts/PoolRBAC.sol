// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./ISale.sol";

contract PooLRBAC is AccessControl {
  using Counters for Counters.Counter;
  
  bytes32 public constant MODERATOR_ROLE = keccak256("MODERATOR_ROLE");
  bytes32 public constant FUNDER_ROLE = keccak256("FUNDER_ROLE");

  uint256 public minInvesting;
  uint256 public interest;
  uint256 public stakingDays;
  uint256 public marginInvestment;
  Counters.Counter public _numberOfInvestment;
  IERC20 dai;
  IERC721 tokenFactoring;

  
  struct Investor {
    uint256 amountFounding;
    uint256 benefits;
    uint256 dayDeposit;
  }

  mapping (address => Investor) public investors;
  mapping (address => uint) public pendingReturns;
  mapping (address => bool) public exist;
  mapping (address => bool) private allowance;

  event Deposit(address indexed investor, uint256 indexed amount);
  event Withdraw(address indexed investor, uint256 indexed amount);
  event Funding(address indexed contractSale, uint256 indexed amountFounding);

  constructor(
    address asset,
    address reservaERC721, 
    address accountModerator, 
    address accountFunder, 
    uint256 MinInvesting, uint256 Rate, uint256 StakingDays, uint256 MarginInvestment) {
      minInvesting = MinInvesting;
      interest = Rate;
      dai = IERC20(asset);
      tokenFactoring = IERC721(reservaERC721);
      stakingDays = (StakingDays * 1 minutes) + block.timestamp;
      marginInvestment = MarginInvestment;
      _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
      grantRole(MODERATOR_ROLE, accountModerator);
      grantRole(FUNDER_ROLE, accountFunder);
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

  function showRemainingTimeToWithdraw(address investor) public view returns(uint256) {
    return (investors[investor].dayDeposit - block.timestamp);
  } 

  function _interest(uint256 newInterest) public onlyRole(DEFAULT_ADMIN_ROLE) returns(bool) {
    interest = newInterest;
    return true;
  }

  function _stakingDays(uint256 newStakingDays) public onlyRole(DEFAULT_ADMIN_ROLE) returns(bool) {
    stakingDays = newStakingDays;
    return true;
  }

  function _minInvesting(uint256 newMinInvesting) public onlyRole(DEFAULT_ADMIN_ROLE) returns(bool) {
    minInvesting = newMinInvesting;
    return true;
  }

  function _marginInvestment(uint256 newMarginInvestmment) public onlyRole(DEFAULT_ADMIN_ROLE) returns(bool) {
    marginInvestment = newMarginInvestmment;
    return true;
  }

  function deposit(uint256 _amount) external returns(bool) {
    uint256 valueINV = pendingReturns[_msgSender()] += _amount;
    require(valueINV >= minInvesting, "POOL: Min investing exceeds the amount.");
    dai.transferFrom(_msgSender(), address(this), _amount);
    uint256 _benefits = valueINV + _profit(interest, valueINV);
    investors[_msgSender()] = Investor(valueINV, _benefits, block.timestamp);
    exist[_msgSender()] = true;
    emit Deposit(_msgSender(), _amount);
    return true; 
  }

  function withdraw(uint256 _valueWithdrawal) external returns(bool) {
    require(exist[_msgSender()], "POOL: Your are not an investor registered.");
    require(_valueWithdrawal <= investors[_msgSender()].benefits, "You don't have funds.");
    uint256 daysPassed = (block.timestamp - investors[_msgSender()].dayDeposit) / 1 minutes;
    require(daysPassed >=  stakingDays + 1 minutes, "POOL: You have to wait after the withdraw day.");
    dai.transfer(_msgSender(), _valueWithdrawal);
    investors[_msgSender()].benefits -= _valueWithdrawal;
    emit Withdraw(_msgSender(), _valueWithdrawal);
    return true;
  }  

  function approve(address contractSale) external onlyRole(MODERATOR_ROLE) returns(bool) {
    require(contractSale != address(0), "POOL: MODERATOR query for nonexistent contract Sale");
    require(tokenFactoring.ownerOf(ISale(contractSale).tokenId()) != address(0), "POOL: MODERATOR query for non existent tokenId");
    allowance[contractSale] = true;
    _numberOfInvestment.increment();
    return true;
  }


  function funding(uint256 _amount, address contractSale) external onlyRole(FUNDER_ROLE) returns(bool) {
    require(allowance[contractSale], "POOL: This Sale is not approved.");
    require(_liquidity() - _amount > marginInvestment, "POOL: The amount lees than the marging of investing.");
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

