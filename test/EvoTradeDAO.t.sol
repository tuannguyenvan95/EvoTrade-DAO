// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {EvoTradeToken} from "../src/EvoTradeToken.sol";
import {GovPerformanceNFT} from "../src/GovPerformanceNFT.sol";
import {AgentContract} from "../src/AgentContract.sol";
import {EvoTradeDAO} from "../src/EvoTradeDAO.sol";

contract MockScheduler {
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
    ) external returns (uint256) {
        return 1;
    }
}

contract MockPrecompile {
    fallback() external payable {
        // Return dummy bytes data
        bytes memory returnData = abi.encodePacked("MOCK_RESPONSE");
        assembly {
            return(add(returnData, 0x20), mload(returnData))
        }
    }
}

contract EvoTradeDAOTest is Test {
    EvoTradeToken public token;
    GovPerformanceNFT public nft;
    AgentContract public agent;
    EvoTradeDAO public dao;
    MockScheduler public scheduler;
    
    address public user1 = address(0x1);
    address public user2 = address(0x2);

    function setUp() public {
        token = new EvoTradeToken();
        nft = new GovPerformanceNFT();
        scheduler = new MockScheduler();
        agent = new AgentContract(address(scheduler));
        dao = new EvoTradeDAO(address(token), address(nft), address(agent));

        // Transfer ownership of NFT to DAO so it can mint
        nft.transferOwnership(address(dao));

        // Setup Users
        token.transfer(user1, 1000 * 10 ** token.decimals());
        token.transfer(user2, 50 * 10 ** token.decimals());

        // Setup Precompiles using vm.etch
        MockPrecompile mockPrecompile = new MockPrecompile();
        vm.etch(0x0000000000000000000000000000000000000801, address(mockPrecompile).code);
        vm.etch(0x0000000000000000000000000000000000000802, address(mockPrecompile).code);
    }

    function testProposalCreation() public {
        vm.startPrank(user1);
        dao.createProposal("Buy 100 ETH");
        vm.stopPrank();

        (uint256 id, string memory desc, uint256 forVotes, uint256 againstVotes, bool executed) = dao.proposals(1);
        assertEq(id, 1);
        assertEq(desc, "Buy 100 ETH");
        assertEq(forVotes, 0);
        assertEq(againstVotes, 0);
        assertEq(executed, false);
    }

    function test_RevertIf_ProposalCreationInsufficientTokens() public {
        vm.startPrank(user2);
        vm.expectRevert("Not enough tokens to propose");
        dao.createProposal("Sell 100 ETH"); // user2 only has 50 tokens, needs 100
        vm.stopPrank();
    }

    function testVotingAndNFTMinting() public {
        vm.prank(user1);
        dao.createProposal("Buy 100 ETH");

        vm.prank(user1);
        dao.vote(1, true); // user1 votes FOR

        vm.prank(user2);
        dao.vote(1, false); // user2 votes AGAINST

        (,,, uint256 againstVotes,) = dao.proposals(1);
        assertEq(againstVotes, 50 * 10 ** token.decimals());

        // Check if NFT was minted for user1 and user2
        assertEq(nft.balanceOf(user1), 1);
        assertEq(nft.balanceOf(user2), 1);
    }

    function testProposalExecution() public {
        vm.prank(user1);
        dao.createProposal("Buy 100 ETH");

        vm.prank(user1);
        dao.vote(1, true); // user1 votes FOR

        dao.executeProposal(1);

        (,,,, bool executed) = dao.proposals(1);
        assertEq(executed, true);
    }

    function testAgentMockMode() public {
        agent.generateDebateAndProposal();
        // Event should have been emitted
    }

    function testAgentPrecompiles() public {
        agent.setMockMode(false);
        agent.generateDebateAndProposal();
        // Since we etched the mock precompile, it should succeed
    }

    function testScheduler() public {
        agent.scheduleDebateCycle(100, 5);
        // Mock Scheduler should return 1
    }
}
