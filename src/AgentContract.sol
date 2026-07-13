// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "lib/openzeppelin-contracts/contracts/access/Ownable.sol";

interface IScheduler {
    function schedule(
        address target,
        bytes calldata data,
        uint256 value,
        uint256 gasLimit,
        uint256 startTimestamp,
        uint256 interval,
        uint256 maxOccurrences,
        address refundAddress,
        bool isNative,
        uint256 fee
    ) external returns (uint256);
}

contract AgentContract is Ownable {
    address public constant LLM_PRECOMPILE = 0x0000000000000000000000000000000000000802;
    address public constant HTTP_PRECOMPILE = 0x0000000000000000000000000000000000000801;
    address public schedulerAddress;

    bool public mockMode = true;
    
    event ProposalGenerated(string strategy, string analysis);
    event TaskScheduled(uint256 taskId);

    constructor(address _scheduler) Ownable(msg.sender) {
        schedulerAddress = _scheduler;
    }

    function setMockMode(bool _mock) external onlyOwner {
        mockMode = _mock;
    }

    function generateDebateAndProposal() external {
        string memory strategy;
        string memory analysis;

        if (mockMode) {
            // Mock Mode Bypass
            strategy = "LONG ETH";
            analysis = "Bullish momentum detected across technical indicators.";
        } else {
            // Fetch market data (mocking HTTP precompile interaction)
            bytes memory marketData = _callHttp("https://api.marketdata.com/latest");
            
            // LLM analyzes market and creates proposal
            bytes memory llmPrompt = abi.encodePacked("Analyze market and propose strategy: ", marketData);
            bytes memory llmResponse = _callLlm(llmPrompt);
            
            strategy = "DYNAMIC_GENERATED_STRATEGY"; // In real scenario, parse llmResponse
            analysis = string(llmResponse);
        }

        emit ProposalGenerated(strategy, analysis);
    }

    function _callHttp(string memory url) internal returns (bytes memory) {
        (bool success, bytes memory returnData) = HTTP_PRECOMPILE.call(abi.encode(url));
        require(success, "HTTP Precompile call failed");
        return returnData;
    }

    function _callLlm(bytes memory prompt) internal returns (bytes memory) {
        (bool success, bytes memory returnData) = LLM_PRECOMPILE.call(prompt);
        require(success, "LLM Precompile call failed");
        return returnData;
    }

    function scheduleDebateCycle(uint256 interval, uint256 maxOccurrences) external onlyOwner {
        require(schedulerAddress != address(0), "Scheduler not set");

        bytes memory data = abi.encodeWithSelector(this.generateDebateAndProposal.selector);
        
        uint256 taskId = IScheduler(schedulerAddress).schedule(
            address(this),
            data,
            0, // value
            500000, // gasLimit
            block.timestamp + 60, // startTimestamp
            interval,
            maxOccurrences,
            msg.sender, // refundAddress
            true, // isNative
            0 // fee (assume 0 for now)
        );

        emit TaskScheduled(taskId);
    }
}
