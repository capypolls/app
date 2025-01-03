// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {MockUSDe} from "../../src/MockTokens.sol";

contract MintMockTokens is Script {
    function run() public {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        address usdeAddress = vm.envAddress("USDE_TOKEN_ADDRESS");
        uint256 mintAmount = 1000 * 1e18; // Mint 1000 USDe tokens

        address deployer = vm.addr(privateKey);
        console.log("Minting tokens to:", deployer);
        console.log("USDe address:", usdeAddress);
        console.log("Mint amount:", mintAmount);

        vm.startBroadcast(privateKey);

        MockUSDe mockUsde = MockUSDe(usdeAddress);
        mockUsde.mint(deployer, mintAmount);

        uint256 balance = mockUsde.balanceOf(deployer);
        console.log("New balance:", balance);

        vm.stopBroadcast();
    }
}
