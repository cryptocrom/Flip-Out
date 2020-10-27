import "./Ownable.sol";
import "./Destroyable.sol";
import "./provableAPI.sol";

pragma solidity 0.5.12;

contract Accountable is Ownable, Destroyable, usingProvable {

    uint256 internal contractBalance;           //the contract balance
    uint256 internal pendingPayouts;            //all pending payouts stored until contract balance is increased or decreased at conclusion of bet
    bool public freeCallBack = true;            //so the contract knows whether to charge for callback or not, will become false after first call is made

    /*
        I have chosen not to deduct bet amounts from contract or player balances at the start of the bets for various reasons and
        instead I have instigated pending balances for both player and contract (these are set at start of bet and removed at the end of the bet)
        For the player, the pending amount will be the betAmount + the queryPrice.
        For the contract, the pendingPayouts amount will be full potential payout amount (less the betAmount) + the queryPrice.  This means the Rollout game
        and DrawOut game have their full payouts accounted for (RollOut payout is betAmount * 6 and Drawout payout can be as high as betAmount * 13)
        It doesn't seem right to deduct this full amount from the contract balance and then put back the difference, so the pendingPayouts system
        will work for the require statements and avoid having to deduct from account balances until the bet's conlcusion.
    */

    modifier betDeposit(uint minimumAmount){
        require (msg.value >= minimumAmount, "1 finney minimum");
        _;
    }

    modifier contractDeposit(uint minimumAmount){
        require (msg.value >= minimumAmount, "20 finney minimum");
        _;
    }


    struct Punter {     //created for each player
        address playerAddress;
        uint256 balance;
        uint256 pendingBets;            //pending bet amounts stored here (instead of deducting the player's balance at the start of a bet) in case something goes wrong with bet
        bytes32 latestQueryId;
    }


    struct Bet {
        bytes32 id;
        address player;
        uint256 gameRef;
        uint256 betAmount;
        uint256 choice;
        uint256 queryPrice;
        uint256 result;
    }


    struct Card {   //used only for the house card storage in DrawOut as this card is generated within the smart contract, not usingProvable
        address user;
        uint256 houseCard;
        bytes32 cardId;
        bool waiting;
    }


    mapping(address => Punter) public punters;
    mapping(address => Card) public cards;      //only for DrawOut Game
    mapping(bytes32 => Bet) public bets;

    event ContractDepositMade(address indexed fromAccount, uint amountDeposited, uint newBalance);
    event UserDepositMade(address indexed fromAccount, uint amountDeposited, uint newBalance);
    event PlayerFundsWithdrawn(address indexed toAccount, uint amountWithdrawn);
    event ContractBalanceWithdrawn(address indexed toAccount, uint amountWithdrawn);


    function depositToContract() public payable onlyOwner contractDeposit(20 finney) {
        contractBalance += msg.value;

        emit ContractDepositMade(msg.sender, msg.value, contractBalance);
    }


    function addBettingFunds() public payable betDeposit(1 finney) {

        Punter memory newPunter;
        newPunter.playerAddress = msg.sender;
        newPunter.balance = punters[msg.sender].balance;
        newPunter.pendingBets = punters[msg.sender].pendingBets;
        newPunter.latestQueryId = punters[msg.sender].latestQueryId;

        punters[msg.sender] = newPunter;

        punters[msg.sender].balance += msg.value;

        emit UserDepositMade(msg.sender, msg.value, punters[msg.sender].balance);
    }


    function withdrawBettingFunds() public {
        require(punters[msg.sender].balance > 0, "Cannot withdraw 0");
        uint toTransfer = punters[msg.sender].balance - punters[msg.sender].pendingBets;
        punters[msg.sender].balance = 0;
        msg.sender.transfer(toTransfer);
        emit PlayerFundsWithdrawn(msg.sender, toTransfer);
    }


    function withdrawContractBalance() public onlyOwner {
        uint toTransfer = contractBalance - pendingPayouts;
        contractBalance = 0;
        msg.sender.transfer(toTransfer);
        emit ContractBalanceWithdrawn(owner, toTransfer);
    }

}
