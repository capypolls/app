// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {CapyCore} from "../../src/CapyCore.sol";
import {CapyPoll} from "../../src/CapyPoll.sol";

contract CreatePoll is Script {
    function run() public {
        console.log("\nStarting deployment script...");
        this.executeScript();
    }

    function executeScript() external {
        address capyCoreAddress = vm.envAddress("CAPY_CORE_ADDRESS");
        address usdeTokenAddress = vm.envAddress("USDE_TOKEN_ADDRESS");
        uint256 initialStake = vm.envUint("INITIAL_STAKE");
        uint256 duration = vm.envUint("POLL_DURATION");
        string memory question = vm.envString("POLL_QUESTION");
        string memory avatar = vm.envString("POLL_AVATAR");
        string memory description = vm.envString("POLL_DESCRIPTION");
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        
        console.log("Creating poll...");
        console.log("Question:", question);
        console.log("Initial stake:", initialStake);
        console.log("Duration:", duration);

        vm.startBroadcast(privateKey);

        CapyCore capyCore = CapyCore(capyCoreAddress);
        IERC20 usdeToken = IERC20(usdeTokenAddress);

        // Set allowance if needed
        uint256 allowance = usdeToken.allowance(vm.addr(privateKey), capyCoreAddress);
        if (allowance < initialStake) {
            usdeToken.approve(capyCoreAddress, type(uint256).max);
        }

        // Create poll with simple token names
        address pollAddress = capyCore.createPoll(
            initialStake,
            question,
            avatar,
            description,
            duration,
            "Celtic YES Token",  // Simple static names
            "YCEL",
            "Celtic NO Token",
            "NCEL"
        );

        console.log("Poll created at:", pollAddress);

        vm.stopBroadcast();
    }
}
/*
Deployment Instructions:

1. Set environment variables:
export PRIVATE_KEY=your_private_key
export CAPY_CORE_ADDRESS=deployed_capycore_address
export USDE_TOKEN_ADDRESS=0x9E1eF5A92C9Bf97460Cd00C0105979153EA45b27
export INITIAL_STAKE=1000000000000000000  # 1 USDe
export POLL_DURATION=604800               # 7 days in seconds
export POLL_QUESTION="What is your opinion on this topic?"
export POLL_AVATAR="https://picsum.photos/200/200?random=100"
export POLL_DESCRIPTION="This is a detailed description of the poll question that explains the context"

2. Run script:
forge script script/solidity/createPoll.s.sol:CreatePoll \
--rpc-url your_rpc_url \
--broadcast -vvvv
*/

