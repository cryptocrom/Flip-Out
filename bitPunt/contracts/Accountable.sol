import "./Ownable.sol";
import "./Destroyable.sol";

pragma solidity 0.5.12;

contract Accountable is Ownable, Destroyable {

    uint internal contractBalance;

    modifier betDeposit(uint minimumAmount){
        require (msg.value >= minimumAmount, "You must deposit at least 1 Finney to play this game");
        _;
    }

    modifier contractDeposit(uint minimumAmount){
        require (msg.value >= minimumAmount, "Minimum deposit to contract is at least 20 Finney (which will cover at least 2 max bets)");
        _;
    }


    struct Punter {
        address userAddress;
        uint balance;
    }

    address[] internal puntersAddresses;



    mapping(address => Punter) internal punters;


    event userAdded(address user, uint balance);
    event contractDepositMade(uint amountDeposited, address fromAccount);
    event depositMade(uint amountDeposited, address fromAccount);
    event fundsWithdrawn(uint amountWithdrawn, address toAccount);
    event contractBalanceWithdrawn(uint amountWithdrawn, address toAccount);


    function depositToContract() public payable onlyOwner contractDeposit(20 finney) {
        contractBalance += msg.value;

        emit contractDepositMade(msg.value, msg.sender);
    }


    function addBettingFunds() public payable betDeposit(1 finney) {
        Punter memory newPunter;
        newPunter.userAddress;
        newPunter.balance = punters[msg.sender].balance;

        insertPunter(newPunter);
        puntersAddresses.push(msg.sender);

        emit userAdded(newPunter.userAddress, newPunter.balance);

        punters[msg.sender].balance += msg.value;

        emit depositMade(msg.value, msg.sender);
    }

    function insertPunter(Punter memory newPunter) private {
        address punter = msg.sender;
        punters[punter] = newPunter;
    }

        function withdrawBettingFunds() public {
        require(punters[msg.sender].balance > 0, "You do not currently have any funds for withdrawal");
        uint toTransfer = punters[msg.sender].balance;
        punters[msg.sender].balance = 0;
        msg.sender.transfer(toTransfer);
        emit fundsWithdrawn(toTransfer, msg.sender);
    }


    function withdrawContractBalance() public onlyOwner {
        uint toTransfer = contractBalance;
        contractBalance = 0;
        msg.sender.transfer(toTransfer);
        emit contractBalanceWithdrawn(toTransfer, owner);
    }

}
