// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment the line to use openzeppelin/ERC721,ERC20
// You can use this dependency directly because it has been installed by TA already

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract EasyBet is ERC721, Ownable, ReentrancyGuard {

    using Counters for Counters.Counter;

    // --- Counters ---
    Counters.Counter private _activityIds; // Counter for generating unique activity IDs
    Counters.Counter private _tokenIds; // Counter for generating unique ERC721 Token IDs (Tickets)
    // use a event if you want
    // to represent time you can choose block.timestamp
    event BetPlaced(uint256 tokenId, uint256 price, address owner);
    event ActivityCreated(uint256 indexed activityId, string description, string[] options, uint256 endTime);
    event TicketPurchased(uint256 indexed tokenId, uint256 indexed activityId, address indexed player, uint256 optionIndex, uint256 amount);
    event TicketListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event TicketSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);
    event ListingCancelled(uint256 indexed tokenId);
    event ActivitySettled(uint256 indexed activityId, uint256 winningOption);
    event WinningsClaimed(uint256 indexed tokenId, address indexed player, uint256 amount);
    // maybe you need a struct to store some activity information

 // Information about a betting activity
    struct Activity {
        uint256 id;                 // Unique ID for the activity
        string description;         // Description of the betting event
        string[] options;           // Possible outcomes/choices for the bet
        uint256 endTime;            // Timestamp when betting closes and results can be declared
        uint256 totalPool;          // Total ETH accumulated in the prize pool
        address payable notary;     // Address of the notary (contract owner) who created it
        bool settled;               // Flag indicating if the activity has been settled
        uint256 winningOption;      // Index of the winning option after settlement
        uint256 totalWinningAmount; // Total amount bet on the winning option
    }

    // Information about a specific bet placed by a player
    struct BetInfo {
        uint256 activityId;         // ID of the activity this bet belongs to
        address player;             // Address of the player who placed the bet
        uint256 optionIndex;        // Index of the option the player bet on
        uint256 amount;             // Amount of ETH bet
        bool claimed;               // Flag indicating if winnings have been claimed
    }

    // Information about a listed ticket (NFT) for sale
    struct Listing {
        address seller;             // Address of the seller
        uint256 price;              // Asking price in ETH (wei)
        bool active;                // Whether the listing is currently active
    }
    // mapping(uint256 => Activity) public activities; // A map from activity-index to its information
    // ...
    // TODO add any variables and functions if you want

    constructor()  ERC721("EasyBet Ticket", "EBT") {}

    // --- Mappings ---
    mapping(uint256 => Activity) public activities;     // activityId => Activity info
    mapping(uint256 => BetInfo) public ticketInfo;      // tokenId (ticket) => BetInfo
    mapping(uint256 => Listing) public listings;       // tokenId (ticket) => Listing info

    // --- Errors ---
    error ActivityNotFound();
    error InvalidOption();
    error BettingClosed();
    error InvalidAmount();
    error ActivityAlreadySettled();
    error ActivityNotSettled();
    error NotWinningTicket();
    error AlreadyClaimed();
    error NotTicketOwner();
    error TicketNotListed();
    error IncorrectPayment();
    error TransferFailed();
    error NotListed();
    error NotApproved();

    // ...
    // TODO add any logic if you want
    function createActivity(
        string memory _description,
        string[] memory _options,
        uint256 _endTime
    ) external payable onlyOwner {
        require(_options.length >= 2, "Must have at least two options");
        require(_endTime > block.timestamp, "End time must be in the future");
        require(msg.value > 0, "Initial pool must be greater than zero");

        _activityIds.increment();
        uint256 newActivityId = _activityIds.current();

        activities[newActivityId] = Activity({
            id: newActivityId,
            description: _description,
            options: _options,
            endTime: _endTime,
            totalPool: msg.value, // Start pool with notary's contribution
            notary: payable(owner()),
            settled: false,
            winningOption: 0, // Placeholder
            totalWinningAmount: 0
        });

        emit ActivityCreated(newActivityId, _description, _options, _endTime);
    }

    function buyTicket(uint256 _activityId, uint256 _optionIndex) external payable nonReentrant {
        Activity storage activity = activities[_activityId];

        if (activity.id == 0) revert ActivityNotFound(); // Check if activity exists
        if (activity.settled) revert ActivityAlreadySettled();
        if (block.timestamp >= activity.endTime) revert BettingClosed();
        if (_optionIndex >= activity.options.length) revert InvalidOption();
        if (msg.value == 0) revert InvalidAmount();

        // Increment pool
        activity.totalPool += msg.value;

        // Mint NFT ticket
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);

        // Store bet info
        ticketInfo[newTokenId] = BetInfo({
            activityId: _activityId,
            player: msg.sender,
            optionIndex: _optionIndex,
            amount: msg.value,
            claimed: false
        });

        emit TicketPurchased(newTokenId, _activityId, msg.sender, _optionIndex, msg.value);
    }
    //挂单
    function listTicket(uint256 _tokenId, uint256 _price) external nonReentrant {
        if (ownerOf(_tokenId) != msg.sender) revert NotTicketOwner();
        require(_price > 0, "Price must be greater than zero");
        // Ensure the contract is approved to transfer this token
        if (getApproved(_tokenId) != address(this) && !isApprovedForAll(msg.sender, address(this))) {
             revert NotApproved();
        }

        // Check if the activity is already settled
        BetInfo storage bet = ticketInfo[_tokenId];
        Activity storage activity = activities[bet.activityId];
        if (activity.settled) revert ActivityAlreadySettled();


        listings[_tokenId] = Listing({
            seller: msg.sender,
            price: _price,
            active: true
        });

        emit TicketListed(_tokenId, msg.sender, _price);
    }

    function cancelListing(uint256 _tokenId) external nonReentrant {
        Listing storage listing = listings[_tokenId];
        if (!listing.active) revert NotListed();
        if (listing.seller != msg.sender) revert NotTicketOwner(); // Using NotTicketOwner error for simplicity

        listing.active = false;
        // Consider removing approval if only approved for this listing
        // ERC721(address(this)).approve(address(0), _tokenId); // Requires careful consideration

        emit ListingCancelled(_tokenId);
    }

    function buyListedTicket(uint256 _tokenId) external payable nonReentrant {
        Listing storage listing = listings[_tokenId];
        address seller = listing.seller; // Cache seller address

        if (!listing.active) revert NotListed();
        if (msg.value != listing.price) revert IncorrectPayment();

        // Deactivate listing before transfer
        listing.active = false;

        // Transfer NFT - requires prior approval from seller to this contract
        _transfer(seller, msg.sender, _tokenId);

        // Transfer payment to seller
        (bool success, ) = seller.call{value: msg.value}("");
        if (!success) revert TransferFailed();

        // Update ticket owner in BetInfo
        ticketInfo[_tokenId].player = msg.sender;

        emit TicketSold(_tokenId, seller, msg.sender, msg.value);
    }
    // 结算活动
    function settleActivity(uint256 _activityId, uint256 _winningOptionIndex) external onlyOwner {
        Activity storage activity = activities[_activityId];

        if (activity.id == 0) revert ActivityNotFound();
        if (activity.settled) revert ActivityAlreadySettled();
        
        if (_winningOptionIndex >= activity.options.length) revert InvalidOption();

        activity.settled = true;
        activity.winningOption = _winningOptionIndex;

        // Calculate total amount bet on the winning option - this requires iterating, which is gas-intensive.
        // A better approach in production would be to track this incrementally when tickets are bought.
        // For simplicity here, we leave it to be calculated off-chain or assume it's calculated elsewhere and stored.
        // We will calculate it during claim winnings for this example, which is also gas-intensive and not ideal.

        emit ActivitySettled(_activityId, _winningOptionIndex);
    }
    function _calculateTotalWinningAmount(uint256 _activityId) internal view returns (uint256) {
        Activity storage activity = activities[_activityId];
        require(activity.settled, "Activity not settled");

        uint256 totalAmount = 0;
        uint256 totalTickets = _tokenIds.current();
        for (uint256 i = 1; i <= totalTickets; i++) {
            // Check if token exists before accessing ticketInfo
             if (_exists(i)) {
                 BetInfo storage bet = ticketInfo[i];
                 if (bet.activityId == _activityId && bet.optionIndex == activity.winningOption) {
                    totalAmount += bet.amount;
                 }
            }
        }
        return totalAmount;
    }

    function claimWinnings(uint256 _tokenId) external nonReentrant {
        BetInfo storage bet = ticketInfo[_tokenId];
        Activity storage activity = activities[bet.activityId];

        if (ownerOf(_tokenId) != msg.sender) revert NotTicketOwner();
        if (!activity.settled) revert ActivityNotSettled();
        if (bet.optionIndex != activity.winningOption) revert NotWinningTicket();
        if (bet.claimed) revert AlreadyClaimed();

        // Calculate total winning amount if not already stored (Gas intensive!)
        uint256 totalWinningAmount = activity.totalWinningAmount;
        if (totalWinningAmount == 0) {
            // This is inefficient. Should be tracked incrementally or calculated once during settlement.
            totalWinningAmount = _calculateTotalWinningAmount(bet.activityId);
            // Optionally store it back to save gas on subsequent claims, but requires activity to be mutable
             activity.totalWinningAmount = totalWinningAmount;
        }

        if (totalWinningAmount == 0) {
             // Handle edge case where no one bet on the winning option (e.g., return bet amount)
             // For now, we assume this means no payout, but could refund bet.amount
             bet.claimed = true; // Mark as claimed even if payout is 0
             emit WinningsClaimed(_tokenId, msg.sender, 0);
             return;
        }


        // Calculate winnings proportional to the bet amount
        uint256 winnings = (bet.amount * activity.totalPool) / totalWinningAmount;

        bet.claimed = true;

        (bool success, ) = msg.sender.call{value: winnings}("");
        if (!success) revert TransferFailed();

        emit WinningsClaimed(_tokenId, msg.sender, winnings);
    }

    // --- View Functions ---

    /**
     * @notice Gets the details of a specific activity.
     * @param _activityId The ID of the activity.
     * @return Activity details.
     */
    function getActivity(uint256 _activityId) external view returns (Activity memory) {
        if (activities[_activityId].id == 0) revert ActivityNotFound();
        return activities[_activityId];
    }

    /**
     * @notice Gets the betting info associated with a ticket ID.
     * @param _tokenId The ID of the ticket (NFT).
     * @return BetInfo details.
     */
    function getTicketInfo(uint256 _tokenId) external view returns (BetInfo memory) {
         if (!_exists(_tokenId)) revert("ERC721: invalid token ID");
        return ticketInfo[_tokenId];
    }

     /**
      * @notice Gets the listing details for a specific ticket ID.
      * @param _tokenId The ID of the ticket (NFT).
      * @return Listing details.
      */
     function getListing(uint256 _tokenId) external view returns (Listing memory) {
         // Doesn't check _exists because a non-existent token won't have an active listing
         return listings[_tokenId];
     }

     /**
      * @notice Returns the total number of activities created.
      */
     function totalActivities() external view returns (uint256) {
         return _activityIds.current();
     }

     /**
      * @notice Returns the total number of tickets (NFTs) minted.
      */
     function totalTickets() external view returns (uint256) {
         return _tokenIds.current();
     }

}