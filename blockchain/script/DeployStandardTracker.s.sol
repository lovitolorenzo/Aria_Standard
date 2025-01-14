// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/SupplyChainTracker.sol";

contract DeployStandardTracker is Script {
    function run() external {
        // Remove private key handling since we'll use cast wallet
        vm.startBroadcast();  // No private key parameter needed

        StandardTracker tracker = new StandardTracker();
        
        // Use msg.sender instead of deriving from private key
        tracker.grantRole(tracker.OPERATOR_ROLE(), msg.sender);

        vm.stopBroadcast();
    }
}