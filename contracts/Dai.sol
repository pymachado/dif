// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Dai is ERC20 {
	constructor(
		address custumerOne, 
		address custumerTwo,
		address custumerThree, 
		address custumerFor,
		address custumerFive) ERC20("Dai Stablecoin", "DAI") {
		_mint(custumerOne, 10000 * 10 ** decimals());
		_mint(custumerTwo, 10000 * 10 ** decimals());
		_mint(custumerThree, 10000 * 10 ** decimals());
		_mint(custumerFor, 10000 * 10 ** decimals());
		_mint(custumerFive, 10000 * 10 ** decimals());
	}

}

