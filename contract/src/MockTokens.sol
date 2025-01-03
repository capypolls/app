// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDe is ERC20 {
    constructor() ERC20("Mock USDe", "USDe") {
        // Mint initial supply to deployer
        _mint(msg.sender, 1000000 * 10**decimals());
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract MockSUSDe is ERC20 {
    constructor() ERC20("Mock sUSDe", "sUSDe") {
        // Mint initial supply to deployer
        _mint(msg.sender, 1000000 * 10**decimals());
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
