// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {EvoTradeToken} from "../src/EvoTradeToken.sol";
import {GovPerformanceNFT} from "../src/GovPerformanceNFT.sol";
import {AgentContract} from "../src/AgentContract.sol";
import {EvoTradeDAO} from "../src/EvoTradeDAO.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address schedulerAddress = 0x0000000000000000000000000000000000000000; // Placeholder for Ritual Scheduler if known, or we just mock it for now since there's no official address in prompt

        vm.startBroadcast(deployerPrivateKey);

        EvoTradeToken token = new EvoTradeToken();
        console.log("EvoTradeToken deployed at:", address(token));

        GovPerformanceNFT nft = new GovPerformanceNFT();
        console.log("GovPerformanceNFT deployed at:", address(nft));

        AgentContract agent = new AgentContract(schedulerAddress);
        console.log("AgentContract deployed at:", address(agent));

        EvoTradeDAO dao = new EvoTradeDAO(address(token), address(nft), address(agent));
        console.log("EvoTradeDAO deployed at:", address(dao));

        // Setup
        nft.transferOwnership(address(dao));
        console.log("NFT ownership transferred to DAO");

        // The user specified to deposit RITUAL into the Agent Contract for the scheduler.
        // We will just log the instructions, or if RITUAL is native gas token, we can send it.
        // On Ritual testnet, the gas token is likely ETH or RITUAL.
        // We will just leave it to the user to fund the agent contract if needed.

        vm.stopBroadcast();
    }
}
