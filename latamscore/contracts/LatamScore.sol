// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract LatamScoreRegistry {

    address public owner;

    struct CreditProfile {
        uint256 score;
        uint256 updatedAt;
        bool exists;
    }

    mapping(address => CreditProfile)
        public profiles;

    event ScoreUpdated(
        address indexed user,
        uint256 score,
        uint256 timestamp
    );

    modifier onlyOwner() {

        require(
            msg.sender == owner,
            "Not authorized"
        );

        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerScore(
        address user,
        uint256 score
    )
        public
        onlyOwner
    {

        profiles[user] = CreditProfile({
            score: score,
            updatedAt: block.timestamp,
            exists: true
        });

        emit ScoreUpdated(
            user,
            score,
            block.timestamp
        );
    }

    function getScore(address user)
        public
        view
        returns (
            uint256,
            uint256
        )
    {

        require(
            profiles[user].exists,
            "No score found"
        );

        return (
            profiles[user].score,
            profiles[user].updatedAt
        );
    }
}