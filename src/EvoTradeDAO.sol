// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {EvoTradeToken} from "./EvoTradeToken.sol";
import {GovPerformanceNFT} from "./GovPerformanceNFT.sol";
import {AgentContract} from "./AgentContract.sol";
import {Ownable} from "lib/openzeppelin-contracts/contracts/access/Ownable.sol";

contract EvoTradeDAO is Ownable {
    EvoTradeToken public token;
    GovPerformanceNFT public nft;
    AgentContract public agent;

    struct Proposal {
        uint256 id;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        bool executed;
    }

    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ProposalCreated(uint256 id, string description);
    event Voted(uint256 proposalId, address voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 id);

    constructor(address _token, address _nft, address _agent) Ownable(msg.sender) {
        token = EvoTradeToken(_token);
        nft = GovPerformanceNFT(_nft);
        agent = AgentContract(_agent);
    }

    function createProposal(string memory description) external {
        require(token.balanceOf(msg.sender) >= 100 * 10 ** token.decimals(), "Not enough tokens to propose");
        
        proposalCount++;
        proposals[proposalCount] = Proposal({
            id: proposalCount,
            description: description,
            forVotes: 0,
            againstVotes: 0,
            executed: false
        });

        emit ProposalCreated(proposalCount, description);
    }

    function vote(uint256 proposalId, bool support) external {
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal");
        require(!hasVoted[proposalId][msg.sender], "Already voted");
        require(!proposals[proposalId].executed, "Already executed");

        uint256 weight = token.balanceOf(msg.sender);
        require(weight > 0, "No voting weight");

        if (support) {
            proposals[proposalId].forVotes += weight;
        } else {
            proposals[proposalId].againstVotes += weight;
        }

        hasVoted[proposalId][msg.sender] = true;

        // Reward voters with an NFT if they haven't received one yet for their contribution
        if (nft.balanceOf(msg.sender) == 0) {
            nft.mint(msg.sender);
        }

        emit Voted(proposalId, msg.sender, support, weight);
    }

    function executeProposal(uint256 proposalId) external {
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal");
        Proposal storage p = proposals[proposalId];
        require(!p.executed, "Already executed");
        require(p.forVotes > p.againstVotes, "Proposal didn't pass");

        p.executed = true;

        emit ProposalExecuted(proposalId);
    }
}
