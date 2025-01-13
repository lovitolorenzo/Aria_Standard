// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/SupplyChainTracker.sol";

contract DeployStandardTracker is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        StandardTracker tracker = new StandardTracker();

        // Grant OPERATOR_ROLE to the deployer
        tracker.grantRole(tracker.OPERATOR_ROLE(), vm.addr(deployerPrivateKey));

        vm.stopBroadcast();
    }
}