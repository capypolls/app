// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {PollToken} from "./PollToken.sol";

contract CapyPoll is OwnableUpgradeable {
    using SafeERC20 for IERC20;

    struct PollInfo {
        uint256 endTimestamp;
        address yesToken;
        address noToken;
        uint256 totalStaked;
        bool isResolved;
        bool winningPosition;
    }

    struct Stake {
        uint256 amount;
        bool position; // true for YES, false for NO
        bool withdrawn;
    }

    struct EpochInfo {
        uint256 startTime;
        uint256 endTime;
        uint256 totalDistribution;
        bool isDistributed;
        uint256 totalEpochStaked;
        uint256 lastProcessedIndex;
        mapping(address => Stake[]) userStakes;
        address[] stakers;
    }

    // Constants
    uint256 public constant MAX_TOKEN_SUPPLY = 1_000_000_000 * 10 ** 18;
    uint256 public constant CREATOR_REWARD_PERCENTAGE = 100; // 1%
    uint256 public constant DISTRIBUTION_PERCENTAGE = 6900; // 69%
    uint256 public constant PAID_LIST_PERCENTAGE = 3000; // 30%
    uint256 public constant BATCH_SIZE = 100;

    uint256 public constant EPOCH_1_DISTRIBUTION = 3657;
    uint256 public constant EPOCH_2_DISTRIBUTION = 2743;
    uint256 public constant EPOCH_3_DISTRIBUTION = 2058;
    uint256 public constant EPOCH_4_DISTRIBUTION = 1542;

    // uint256[] public constant epochDistributionPercentages; // Scaled by 100

    // State variables
    PollInfo public pollInfo;
    mapping(uint256 => EpochInfo) public epochs;
    uint256 public currentEpoch;
    IERC20 public usdeToken;
    IERC20 public susdeToken;
    uint256 public totalYesStaked;
    uint256 public totalNoStaked;
    uint256 public epochDuration;
    uint256 public numEpochs;

    // Events
    event StakeAdded(
        address indexed user,
        uint256 amount,
        bool position,
        uint256 epoch
    );
    event TokensDistributed(uint256 indexed epoch, uint256 amount);
    event PollResolved(bool winningPosition);
    event RewardsDistributed(address indexed user, uint256 amount);
    event StakeWithdrawn(address indexed user, uint256 amount);

    // Modifiers
    modifier pollActive() {
        require(block.timestamp < pollInfo.endTimestamp, "Poll has ended");
        require(!pollInfo.isResolved, "Poll already resolved");
        _;
    }

    modifier pollEnded() {
        require(block.timestamp >= pollInfo.endTimestamp, "Poll still active");
        require(!pollInfo.isResolved, "Poll already resolved");
        _;
    }

    function initialize(
        address _capyCore,
        address _pollCreator,
        address _usdeToken,
        address _susdeToken,
        uint256 _duration,
        address _yesToken,
        address _noToken
    ) external initializer {
        __Ownable_init(_capyCore);

        usdeToken = IERC20(_usdeToken);
        susdeToken = IERC20(_susdeToken);
        pollInfo.endTimestamp = block.timestamp + _duration;
        pollInfo.yesToken = _yesToken;
        pollInfo.noToken = _noToken;

        epochDuration = _duration / 4;
        numEpochs = 4;

        currentEpoch = 1;
        epochs[currentEpoch].startTime = block.timestamp;
        epochs[currentEpoch].endTime = block.timestamp + epochDuration;
        epochs[currentEpoch].totalDistribution = calculateEpochDistribution(1);

        uint256 creatorAmount = (MAX_TOKEN_SUPPLY * CREATOR_REWARD_PERCENTAGE) /
            10000;
        PollToken(pollInfo.yesToken).mint(_pollCreator, creatorAmount);
        PollToken(pollInfo.noToken).mint(_pollCreator, creatorAmount);
    }

    function stake(uint256 amount, bool position) external pollActive {
        if (block.timestamp >= epochs[currentEpoch].endTime) {
            _moveToNextEpoch();
        }

        require(amount > 0, "Cannot stake 0");

        usdeToken.safeTransferFrom(msg.sender, address(this), amount);

        if (position) {
            totalYesStaked += amount;
        } else {
            totalNoStaked += amount;
        }
        pollInfo.totalStaked += amount;

        EpochInfo storage currentEpochInfo = epochs[currentEpoch];

        // Add to stakers list if first stake in epoch
        if (currentEpochInfo.userStakes[msg.sender].length == 0) {
            currentEpochInfo.stakers.push(msg.sender);
        }

        // Add new stake
        currentEpochInfo.userStakes[msg.sender].push(
            Stake({amount: amount, position: position, withdrawn: false})
        );

        currentEpochInfo.totalEpochStaked += amount;

        emit StakeAdded(msg.sender, amount, position, currentEpoch);
    }

    function _moveToNextEpoch() internal {
        currentEpoch++;
        epochs[currentEpoch].startTime = block.timestamp;
        epochs[currentEpoch].endTime = block.timestamp + epochDuration;
        epochs[currentEpoch].totalDistribution = calculateEpochDistribution(
            currentEpoch
        );
    }

    // function calculateEpochDistribution(
    //     uint256 epochNumber
    // ) internal view returns (uint256) {
    //     require(epochNumber <= numEpochs, "Invalid epoch");

    //     require(epochNumber > 0, "Invalid epoch number");
    //     require(epochNumber <= epochDistributionPercentages.length, "Epoch number out of bounds");

    //     uint256 totalDistribution = (MAX_TOKEN_SUPPLY *
    //         DISTRIBUTION_PERCENTAGE) / 10000;
    //     return
    //         (totalDistribution *
    //             epochDistributionPercentages[epochNumber - 1]) / 10000;
    // }

    function calculateEpochDistribution(uint256 epochNumber) internal view returns (uint256) {
    require(epochNumber <= numEpochs, "Invalid epoch");
    
    uint256 epochDistribution;
    if (epochNumber == 1) {
        epochDistribution = EPOCH_1_DISTRIBUTION;
    } else if (epochNumber == 2) {
        epochDistribution = EPOCH_2_DISTRIBUTION;
    } else if (epochNumber == 3) {
        epochDistribution = EPOCH_3_DISTRIBUTION;
    } else if (epochNumber == 4) {
        epochDistribution = EPOCH_4_DISTRIBUTION;
    } else {
        revert("Invalid epoch number");
    }

    uint256 totalDistribution = (MAX_TOKEN_SUPPLY * DISTRIBUTION_PERCENTAGE) / 10000;
    return (totalDistribution * epochDistribution) / 10000;
}

    function distributeEpochRewards(uint256 epochNumber) external {
        require(epochNumber <= currentEpoch, "Epoch not started");
        require(!epochs[epochNumber].isDistributed, "Already distributed");
        require(
            epochs[epochNumber].endTime <= block.timestamp,
            "Epoch not ended"
        );

        EpochInfo storage epoch = epochs[epochNumber];
        uint256 startIndex = epoch.lastProcessedIndex;
        uint256 endIndex = startIndex + BATCH_SIZE;
        if (endIndex > epoch.stakers.length) {
            endIndex = epoch.stakers.length;
        }

        for (uint256 i = startIndex; i < endIndex; i++) {
            address staker = epoch.stakers[i];
            Stake[] storage userStakes = epoch.userStakes[staker];

            for (uint256 j = 0; j < userStakes.length; j++) {
                uint256 reward = (epoch.totalDistribution *
                    userStakes[j].amount) / epoch.totalEpochStaked;

                if (userStakes[j].position) {
                    PollToken(pollInfo.yesToken).mint(staker, reward);
                } else {
                    PollToken(pollInfo.noToken).mint(staker, reward);
                }
            }
        }

        epoch.lastProcessedIndex = endIndex;

        if (endIndex == epoch.stakers.length) {
            epoch.isDistributed = true;
            emit TokensDistributed(epochNumber, epoch.totalDistribution);
        }
    }

    function withdrawStake() external {
        require(block.timestamp >= pollInfo.endTimestamp, "Poll not ended");

        uint256 totalToWithdraw = 0;

        for (uint256 epochNum = 1; epochNum <= currentEpoch; epochNum++) {
            EpochInfo storage epoch = epochs[epochNum];
            Stake[] storage userStakes = epoch.userStakes[msg.sender];

            for (uint256 i = 0; i < userStakes.length; i++) {
                if (!userStakes[i].withdrawn) {
                    totalToWithdraw += userStakes[i].amount;
                    userStakes[i].withdrawn = true;
                }
            }
        }

        require(totalToWithdraw > 0, "No stakes to withdraw");

        usdeToken.safeTransfer(msg.sender, totalToWithdraw);

        emit StakeWithdrawn(msg.sender, totalToWithdraw);
    }

    function implementBlitz() internal {
        bool losingPosition = !pollInfo.winningPosition;
        uint256 currentSupply = ERC20(
            losingPosition ? pollInfo.yesToken : pollInfo.noToken
        ).totalSupply();
        uint256 tokensToMint = currentSupply * 19; // For a 95% price drop, mint 19× initial supply

        // TODO: Mint token to general public—on paid lists—so price tanking works.
        address losingToken = losingPosition
            ? pollInfo.yesToken
            : pollInfo.noToken;
        PollToken(losingToken).mint(address(this), tokensToMint);
    }

    function resolvePoll(bool winningPosition) external pollEnded onlyOwner {
        require(!pollInfo.isResolved, "Already resolved");

        pollInfo.isResolved = true;
        pollInfo.winningPosition = winningPosition;
        implementBlitz();

        emit PollResolved(winningPosition);
    }

    // View functions
    function getEpochInfo(
        uint256 epochNumber
    )
        external
        view
        returns (
            uint256 startTime,
            uint256 endTime,
            uint256 totalDistribution,
            bool isDistributed,
            uint256 numStakers
        )
    {
        EpochInfo storage epoch = epochs[epochNumber];
        return (
            epoch.startTime,
            epoch.endTime,
            epoch.totalDistribution,
            epoch.isDistributed,
            epoch.stakers.length
        );
    }

    function getUserStakesForEpoch(
        address user,
        uint256 epochNumber
    ) external view returns (Stake[] memory) {
        return epochs[epochNumber].userStakes[user];
    }

    function getPollInfo() external view returns (PollInfo memory) {
        return pollInfo;
    }
}
