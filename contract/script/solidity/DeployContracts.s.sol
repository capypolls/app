// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {CapyCore} from "../../src/CapyCore.sol";
import {CapyPoll} from "../../src/CapyPoll.sol";
import {PollToken} from "../../src/PollToken.sol";
import {MockUSDe, MockSUSDe} from "../../src/MockTokens.sol";

contract DeployCapyPolls is Script {
    // Contract instances
    CapyPoll public pollImplementation;
    PollToken public tokenImplementation;
    CapyCore public capyCore;
    MockUSDe public mockUsde;
    MockSUSDe public mockSusde;

    function run() external {
        // Load configuration from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        //address usdeToken = vm.envAddress("USDE_TOKEN_ADDRESS");
        //address susdeToken = vm.envAddress("SUSDE_TOKEN_ADDRESS");

        console.log("Starting deployment with deployer:", deployer);
        //console.log("USDe Token:", usdeToken);
       // console.log("SUSDe Token:", susdeToken);

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy implementation contracts first
        // Deploy mock tokens first
        mockUsde = new MockUSDe();
        mockSusde = new MockSUSDe();
        
        console.log("Mock USDe deployed at:", address(mockUsde));
        console.log("Mock sUSDe deployed at:", address(mockSusde));

        // Deploy implementation contracts
        pollImplementation = new CapyPoll();
        console.log("Poll Implementation deployed at:", address(pollImplementation));

        tokenImplementation = new PollToken();
        console.log("Token Implementation deployed at:", address(tokenImplementation));

        // 2. Deploy CapyCore with implementations
        // Deploy CapyCore with mock tokens
        capyCore = new CapyCore(
                //             address(pollImplementation),  // Poll implementation for cloning
                // address(tokenImplementation), // Token implementation for cloning
                // usdeToken,                   // USDe token address
                // susdeToken,                  // SUSDe token address
                // deployer                     // Initial owner
            address(pollImplementation),
            address(tokenImplementation),
            address(mockUsde),
            address(mockSusde),
            deployer
        );
        console.log("CapyCore deployed at:", address(capyCore));

        vm.stopBroadcast();

        // Log final configuration
        console.log("\nDeployment completed!");
        console.log("-------------------");
        console.log("Mock USDe:", address(mockUsde));
        console.log("Mock sUSDe:", address(mockSusde));
        console.log("Poll Implementation:", address(pollImplementation));
        console.log("Token Implementation:", address(tokenImplementation));
        console.log("CapyCore:", address(capyCore));
        
        // Verify key configurations
        verify();
    }

    function verify() internal view {
        // Verify CapyCore configuration
        require(address(capyCore) != address(0), "CapyCore not deployed");

                
        // Verify implementations are set
        (bool exists, ) = capyCore.getPollDetails(address(pollImplementation));
        require(!exists, "Poll implementation should not be registered as a poll");
        
        // // Verify core functionality
        // require(capyCore.cloneablePoll() == address(pollImplementation), "Invalid poll implementation");
        // require(capyCore.cloneableToken() == address(tokenImplementation), "Invalid token implementation");

        require(address(mockUsde) != address(0), "MockUSDe not deployed");
        require(address(mockSusde) != address(0), "MockSUSDe not deployed");
        
        console.log("Verification passed");
    }
}

/*
Deployment Instructions:

1. Set environment variables:
export PRIVATE_KEY=your_private_key
export USDE_TOKEN_ADDRESS=usde_token_address
export SUSDE_TOKEN_ADDRESS=susde_token_address

2. Run deployment:
forge script script/solidity/DeployContracts.s.sol:DeployCapyPolls \
--rpc-url your_rpc_url \
--broadcast -vvvv

3. Verify contracts:
forge verify-contract CONTRACT_ADDRESS \
--chain-id CHAIN_ID \
--constructor-args $(cast abi-encode "constructor(address,address,address,address,address)" POLL_IMPL TOKEN_IMPL USDE_TOKEN SUSDE_TOKEN OWNER) \
--etherscan-api-key YOUR_API_KEY
*/