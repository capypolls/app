// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {CapyPoll} from "./CapyPoll.sol";
import {PollToken} from "./PollToken.sol";

/// @title CapyCore - Factory contract for creating and managing polls
/// @notice This contract handles the creation and management of prediction market polls
contract CapyCore is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    /// @notice Address of the USDe token used for staking
    address public usdeToken;
    /// @notice Address of the sUSDe token used for staking
    address public susdeToken;
    /// @notice Address of the template poll contract for cloning
    address public cloneablePoll;
    /// @notice Address of the template token contract for cloning
    address public cloneableToken;
    /// @notice Protocol fee in basis points (e.g., 100 = 1%)
    uint256 public protocolFee;
    /// @notice Array of all created poll addresses
    address[] public polls;

    /// @notice Minimum duration for a poll (1 day)
    uint256 public constant MIN_DURATION = 1 days;
    /// @notice Maximum duration for a poll (30 days)
    uint256 public constant MAX_DURATION = 30 days;
    /// @notice Maximum protocol fee (10%)
    uint256 public constant MAX_PROTOCOL_FEE = 1000;

    /// @notice Maps creator address to their poll creation nonce
    mapping(address => uint256) private _nonces;
    /// @notice Maps poll address to its description
    mapping(address => string) public pollDescriptions;

    event PollCreated(
        address indexed creator,
        address pollAddress,
        address yesToken,
        address noToken,
        string question,
        string avatar,
        string description
    );
    event ProtocolFeeUpdated(uint256 oldFee, uint256 newFee);
    event CloneablePollUpdated(address oldAddress, address newAddress);
    event CloneableTokenUpdated(address oldAddress, address newAddress);
    event USDETokenUpdated(address oldAddress, address newAddress);
    event SUSDETokenUpdated(address oldAddress, address newAddress);
    event FeesWithdrawn(address to, uint256 amount);

    /// @notice Initializes the contract with required addresses
    /// @param _cloneablePoll Address of the template poll contract
    /// @param _cloneableToken Address of the template token contract
    /// @param _usdeToken Address of the USDe token
    /// @param _susdeToken Address of the SUSDe token
    /// @param initialOwner Address of the contract owner
    constructor(
        address _cloneablePoll,
        address _cloneableToken,
        address _usdeToken,
        address _susdeToken,
        address initialOwner
    ) Ownable(initialOwner) {
        require(_cloneablePoll != address(0), "Invalid poll address");
        require(_cloneableToken != address(0), "Invalid token address");
        require(_usdeToken != address(0), "Invalid USDe address");

        cloneablePoll = _cloneablePoll;
        cloneableToken = _cloneableToken;
        usdeToken = _usdeToken;
        susdeToken = _susdeToken;
    }

    /// @notice Creates a new prediction market poll
    /// @param initialStake Amount of USDe to stake initially
    /// @param question The poll question
    /// @param avatar URL or IPFS hash of the poll avatar
    /// @param description Detailed description of the poll
    /// @param duration Duration of the poll in seconds
    /// @param yesTokenName Name for the YES token
    /// @param yesTokenSymbol Symbol for the YES token
    /// @param noTokenName Name for the NO token
    /// @param noTokenSymbol Symbol for the NO token
    /// @return pollAddress Address of the created poll
    function createPoll(
        uint256 initialStake,
        string memory question,
        string memory avatar,
        string memory description,
        uint256 duration,
        string memory yesTokenName,
        string memory yesTokenSymbol,
        string memory noTokenName,
        string memory noTokenSymbol
    ) external nonReentrant returns (address pollAddress) {
        require(initialStake > 0, "Initial stake required");
        require(bytes(question).length > 0, "Empty question");
        require(
            bytes(yesTokenName).length > 0 && bytes(noTokenName).length > 0,
            "Empty token names"
        );
        require(
            bytes(yesTokenSymbol).length > 0 && bytes(noTokenSymbol).length > 0,
            "Empty token symbols"
        );
        require(
            duration >= MIN_DURATION && duration <= MAX_DURATION,
            "Invalid duration"
        );

        // Calculate protocol fee and net stake
        uint256 fee = (initialStake * protocolFee) / 10000;
        uint256 netStake = initialStake - fee;

        // Transfer USDe from creator
        IERC20(usdeToken).safeTransferFrom(
            msg.sender,
            address(this),
            initialStake
        );

        // Store the nonce first
        uint256 currentNonce = _nonces[msg.sender];
        _nonces[msg.sender] = currentNonce + 1;

        // Deploy poll contract
        bytes32 pollSalt = keccak256(
            abi.encodePacked(msg.sender, currentNonce)
        );
        pollAddress = Clones.cloneDeterministic(cloneablePoll, pollSalt);

        // Deploy YES token
        bytes32 yesSalt = keccak256(
            abi.encodePacked("YES", msg.sender, currentNonce)
        );
        address yesToken = Clones.cloneDeterministic(cloneableToken, yesSalt);
        PollToken(yesToken).initialize(
            yesTokenName,
            yesTokenSymbol,
            pollAddress
        );

        // Deploy NO token
        bytes32 noSalt = keccak256(
            abi.encodePacked("NO", msg.sender, currentNonce)
        );
        address noToken = Clones.cloneDeterministic(cloneableToken, noSalt);
        PollToken(noToken).initialize(noTokenName, noTokenSymbol, pollAddress);

        // Initialize poll contract
        CapyPoll(pollAddress).initialize(
            address(this),
            msg.sender,
            usdeToken,
            susdeToken,
            duration,
            yesToken,
            noToken
        );

        // Transfer stake to poll
        IERC20(usdeToken).safeTransfer(pollAddress, netStake);

        polls.push(pollAddress);
        pollDescriptions[pollAddress] = description;

        emit PollCreated(
            msg.sender,
            pollAddress,
            yesToken,
            noToken,
            question,
            avatar,
            description
        );
    }

    /// @notice Updates the template poll contract address
    /// @param _cloneablePoll New template poll address
    function updateCloneablePollAddress(
        address _cloneablePoll
    ) external onlyOwner {
        require(_cloneablePoll != address(0), "Invalid Poll address");
        address oldAddress = cloneablePoll;
        cloneablePoll = _cloneablePoll;
        emit CloneablePollUpdated(oldAddress, _cloneablePoll);
    }

    /// @notice Updates the template token contract address
    /// @param _cloneableToken New template token address
    function updateCloneableTokenAddress(
        address _cloneableToken
    ) external onlyOwner {
        require(_cloneableToken != address(0), "Invalid Token address");
        address oldAddress = cloneableToken;
        cloneableToken = _cloneableToken;
        emit CloneableTokenUpdated(oldAddress, _cloneableToken);
    }

    /// @notice Updates the USDe token address
    /// @param _usdeToken New USDe token address
    function updateUSDETokenAddress(address _usdeToken) external onlyOwner {
        require(_usdeToken != address(0), "Invalid USDe address");
        address oldAddress = usdeToken;
        usdeToken = _usdeToken;
        emit USDETokenUpdated(oldAddress, _usdeToken);
    }

    /// @notice Updates the SUSDe token address
    /// @param _susdeToken New SUSDe token address
    function updateSUSDETokenAddress(address _susdeToken) external onlyOwner {
        require(_susdeToken != address(0), "Invalid SUSDe address");
        address oldAddress = susdeToken;
        susdeToken = _susdeToken;
        emit SUSDETokenUpdated(oldAddress, _susdeToken);
    }

    /// @notice Returns the total number of polls created
    /// @return Number of polls
    function getPollCount() external view returns (uint256) {
        return polls.length;
    }

    /// @notice Returns the poll address at a specific index
    /// @param _index Index in the polls array
    /// @return Poll address
    function getPollAt(uint256 _index) external view returns (address) {
        require(_index < polls.length, "Index out of bounds");
        return polls[_index];
    }

    /// @notice Checks if an address is a poll created by this factory
    /// @param _pollAddress Address to check
    /// @return True if address is a valid poll
    function isPollFromFactory(
        address _pollAddress
    ) external view returns (bool) {
        for (uint256 i = 0; i < polls.length; i++) {
            if (polls[i] == _pollAddress) {
                return true;
            }
        }
        return false;
    }

    /// @notice Sets the protocol fee
    /// @param newFee New fee in basis points
    function setProtocolFee(uint256 newFee) external onlyOwner {
        require(newFee <= MAX_PROTOCOL_FEE, "Fee too high");
        uint256 oldFee = protocolFee;
        protocolFee = newFee;
        emit ProtocolFeeUpdated(oldFee, newFee);
    }

    /// @notice Withdraws accumulated protocol fees
    /// @param to Address to send fees to
    function withdrawFees(address to) external onlyOwner nonReentrant {
        require(to != address(0), "Invalid address");
        uint256 balance = IERC20(usdeToken).balanceOf(address(this));
        require(balance > 0, "No fees to withdraw");

        IERC20(usdeToken).safeTransfer(to, balance);
        emit FeesWithdrawn(to, balance);
    }

    /// @notice Gets poll details including existence and description
    /// @param pollAddress Address of the poll to check
    /// @return exists Whether the poll exists
    /// @return description Poll description
    function getPollDetails(
        address pollAddress
    ) external view returns (bool exists, string memory description) {
        exists = false;
        for (uint256 i = 0; i < polls.length; i++) {
            if (polls[i] == pollAddress) {
                exists = true;
                break;
            }
        }
        return (exists, pollDescriptions[pollAddress]);
    }
}
