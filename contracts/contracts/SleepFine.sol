// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/access/AccessControl.sol";

import { IStaking, IStakingRoles, IStakingRewards } from "./IStaking.sol";

contract SleepFine is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    bytes32 public constant AI_AGENT_ROLE = keccak256("AI_AGENT_ROLE");

    struct Challenge {
        // The user who started the challenge.
        address user;
       
        // App key from secure enclave, created when user installed the app,
        // used to ensure that user cannot tamper the data (without jailbreaking).
        address app;
        
        // Whether the challenge is completed and user has withdrawn pending balance
        bool completed;
        // The date when the challenge started
        uint64 startDate;
        // Duration of the challenge in days.
        uint64 durationDays;
        // Total penalties incurred by the user.
        uint64 missedDaysCount;
         
        // Array of missed days
        bool[] missedDaysArray;
        // User's security deposit that is locked for the duration of the challenge.
        uint128 deposit;
    }

    /// @notice A challenge is uniquely identified by an incremental Challenge ID
    /// This simple structure enables users to start multiple challenges
    Challenge[] public challenges;
    IStaking public immutable stakingPrecompile;

    modifier onlyApp(uint256 challengeId) {
        require(challenges[challengeId].app == msg.sender, "Not authorized");
        _;
    }

    event NewChallenge(
        address indexed user,
        uint256 indexed challengeId
    );

    constructor(IStaking _stakingPrecompile) {
        stakingPrecompile = _stakingPrecompile;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /*
     * Admin functions
     */

    function grantAiAgentRole(address aiAgent) external onlyRole(ADMIN_ROLE) {
        _grantRole(AI_AGENT_ROLE, aiAgent);
    }

    function revokeAiAgentRole(address aiAgent) external onlyRole(ADMIN_ROLE) {
        _revokeRole(AI_AGENT_ROLE, aiAgent);
    }

    /*
     * User functions
     */

    /// @notice User starts challenge by making a deposit from their wallet
    /// @param numDays Number of days for the challenge
    /// @param app iOS app scoped key from secure enclave, created when user installed the app
    function startChallenge(uint64 numDays, address app) external payable returns (uint256) {
        require(msg.value > 0, "Deposit required");

        uint256 challengeId = challenges.length;
        challenges.push();
        Challenge storage c = challenges[challengeId];
        c.user = msg.sender;
        c.app = app;
        c.startDate = getCurrentDate();
        c.durationDays = numDays;
        c.deposit = uint128(msg.value);
        c.missedDaysCount = 0;
        c.missedDaysArray = new bool[](numDays);
        c.completed = false;

        emit NewChallenge(msg.sender, challengeId);
        return challengeId;
    }

    /// @notice iOS app informs the system that the user has missed a sleep
    /// @dev For hackathon purpose, the app's temporary key is making the
    // transaction, it covers gas. However, we later plan get the arguments
    // signed by the app's private key for free using EIP-712 structured
    // signing and that payload can be relayed by the developer which sponsors
    // the gas. We expect that the earnings will be enough to cover the
    // insignificant gas cost.
    /// @param challengeId The ID of the challenge
    function reportMissedSleep(uint256 challengeId, uint64 dayId) external onlyApp(challengeId) {
        Challenge storage c = challenges[challengeId];
        require(!c.completed, "Challenge already completed");
        if (!c.missedDaysArray[dayId]) {
            c.missedDaysArray[dayId] = true;
            c.missedDaysCount++;
        }
    }

    function completeChallenge(uint256 challengeId) external onlyApp(challengeId) {
        Challenge storage c = challenges[challengeId];
        require(!c.completed, "Challenge already completed");
        require(c.startDate + c.durationDays <= getCurrentDate(), "Challenge time not completed yet");
        c.completed = true;

        uint128 refund = c.deposit * (c.durationDays - c.missedDaysCount) / c.durationDays;
    
        (bool success, ) =  payable(c.user).call{value: refund}("");
        require(success, "Transfer failed");
    }

    /*
     * AI Agent functions
     */

    function nominate(address[] calldata targets) external onlyRole(AI_AGENT_ROLE) returns (bool) {
        return stakingPrecompile.nominate(targets);
    }

    function bond(uint128 amount) external onlyRole(AI_AGENT_ROLE) {
        stakingPrecompile.bond{ value: amount }();
    }

    function unbond(uint128 amount) external onlyRole(AI_AGENT_ROLE) {
        stakingPrecompile.unbond(amount);
    }

    /*
     * View functions
     */

    function getChallenge(uint256 challengeId) external view returns (Challenge memory) {
        return challenges[challengeId];
    }

    function getCurrentDate() public view returns (uint64) {
        return uint64(block.timestamp) / 1 days / 1000;
    }
}
