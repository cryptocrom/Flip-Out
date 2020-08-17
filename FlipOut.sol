import "./Ownable.sol";
import "./Destroyable.sol";

pragma solidity 0.5.12;

contract FlipOut is Ownable, Destroyable {

    struct Punter {
        uint age;
        bool legalAge;
        uint balance;
        uint betOnHeads;
        uint betOnTails;
    }

    uint public contractBalance;
    uint private betAmount;

    event ageEntered(uint age, bool legalAge);
    event betPlaced(uint betAmountAdded, uint totalBetAmount, string choice);
    event betCancelled(uint betAmountReturned, address toAccount);
    event coinFlipResult(string result);
    event betResult(string message, uint amountPaid, string paidTo);
    event fundsWithdrawn(uint amountWithdrawn, address toAccount);
    event contractBalanceWithdrawn(uint amountWithdrawn, address toAccount);

    address[] private puntersAddresses;

    modifier betDeposit(uint minimumAmount){
        require (msg.value >= minimumAmount, "You must deposit at least 1 Finney to play this game");
        _;
    }
     modifier contractDeposit(uint minimumAmount){
        require (msg.value >= minimumAmount, "Minimum deposit to contract is at least 20 Finney (which will cover at least 2 losing max bets)");
        _;
    }

    mapping(address => Punter) private punters;


    function enterYourAge(uint age) public {
        require(age > 0, "You cannot be a negative number of years old, it is just not possible");
        require(punters[msg.sender].age == 0, "You have already entered your age");

        Punter memory newPunter;
        newPunter.age = age;
        if (age >= 18) newPunter.legalAge = true;
        else newPunter.legalAge = false;
        newPunter.balance = punters[msg.sender].balance;
        newPunter.betOnTails = 0;
        newPunter.betOnHeads = 0;

        insertPunter(newPunter);
        puntersAddresses.push(msg.sender);

        emit ageEntered(newPunter.age, newPunter.legalAge);
    }

    function insertPunter(Punter memory newPunter) private {
        address punter = msg.sender;
        punters[punter] = newPunter;
    }

    function getAge() public view returns(uint age, bool legalAge) {
        return (punters[msg.sender].age, punters[msg.sender].legalAge);
    }

    function depositToContract() public payable onlyOwner contractDeposit(20 finney) {
        contractBalance += msg.value;
    }

    function addBettingFunds() public payable betDeposit(1 finney) {
        require(punters[msg.sender].age != 0, "You have not yet entered your age");
        require(punters[msg.sender].age >= 18, "You need to be 18 or older to gamble");
        require(punters[msg.sender].age < 125, "It is highly improbable that you are 125 years or older and therefore we will not take the risk of allowing you to place the bet, thank you");

        punters[msg.sender].balance += msg.value;
    }

     function bettingFunds()public view returns(uint){
        return punters[msg.sender].balance;
    }

    function betOnHeads(uint amountToBet) public {
        require(punters[msg.sender].balance >= 1 finney,"You must have some funds in your betting account to place a bet");
        require(punters[msg.sender].betOnTails == 0 finney, "You have already placed a bet on Heads, if you want to change your bet, cancel the bet and start again");

        require(amountToBet >= 1, "The minimum bet amount is 1 (1 Finney)");
        require(amountToBet <= 10, "The maximum bet amount is 10 (10 Finney)");

        if(amountToBet == 1) betAmount = 1 finney;
        if(amountToBet == 2) betAmount = 2 finney;
        if(amountToBet == 3) betAmount = 3 finney;
        if(amountToBet == 4) betAmount = 4 finney;
        if(amountToBet == 5) betAmount = 5 finney;
        if(amountToBet == 6) betAmount = 6 finney;
        if(amountToBet == 7) betAmount = 7 finney;
        if(amountToBet == 8) betAmount = 8 finney;
        if(amountToBet == 9) betAmount = 9 finney;
        if(amountToBet == 10) betAmount = 10 finney;

        punters[msg.sender].betOnHeads += betAmount;

        require(contractBalance >= punters[msg.sender].betOnHeads, "The contract doesn't currently have enough liquidity to cover a winning bet, pleae try again later");
        require(punters[msg.sender].betOnHeads <= 10 finney, "The total you can bet on a single flip of the coin is 10 (10 Finney)");

        punters[msg.sender].balance -= betAmount;
        contractBalance += betAmount;

        emit betPlaced(betAmount, punters[msg.sender].betOnHeads, "Heads");
    }

    function betOnTails(uint amountToBet) public {
        require(punters[msg.sender].balance >= 1 finney,"You must have some funds in your betting account to place a bet");
        require(punters[msg.sender].betOnHeads == 0 finney, "You have already placed a bet on Heads");
        require(punters[msg.sender].betOnTails == 0 finney, "You have already placed a bet on Tails, if you want to change your bet, cancel the bet and start again");
        require(amountToBet >= 1, "The minimum bet amount is 1 (1 Finney)");
        require(amountToBet <= 10, "The maximum bet amount is 10 (10 Finney)");

        if(amountToBet == 1) betAmount = 1 finney;
        if(amountToBet == 2) betAmount = 2 finney;
        if(amountToBet == 3) betAmount = 3 finney;
        if(amountToBet == 4) betAmount = 4 finney;
        if(amountToBet == 5) betAmount = 5 finney;
        if(amountToBet == 6) betAmount = 6 finney;
        if(amountToBet == 7) betAmount = 7 finney;
        if(amountToBet == 8) betAmount = 8 finney;
        if(amountToBet == 9) betAmount = 9 finney;
        if(amountToBet == 10) betAmount = 10 finney;

        punters[msg.sender].betOnTails += betAmount;

        require(contractBalance >= punters[msg.sender].betOnTails, "The contract doesn't currently have enough liquidity to cover a winning bet, pleae try again later");
        require(punters[msg.sender].betOnTails <= 10 finney, "The total amount you can bet on a single flip of the coin is 10 Finney");

        punters[msg.sender].balance -= betAmount;
        contractBalance += betAmount;

        emit betPlaced(betAmount, punters[msg.sender].betOnTails, "Tails");
    }

    function currentBetAmount() public view returns(uint currentBet) {
        if(punters[msg.sender].betOnHeads > 0) {
            currentBet = punters[msg.sender].betOnHeads;
        }
        else if(punters[msg.sender].betOnTails > 0) {
            currentBet = punters[msg.sender].betOnTails;
        } else {
            currentBet = 0;
        }
        return currentBet;
    }

    function cancelBet() public {
        if(punters[msg.sender].betOnHeads > 0) {
            betAmount = punters[msg.sender].betOnHeads;
            punters[msg.sender].betOnHeads = 0;
        }
        if(punters[msg.sender].betOnTails > 0) {
            betAmount = punters[msg.sender].betOnTails;
            punters[msg.sender].betOnTails = 0;
        }
        punters[msg.sender].balance += betAmount;
        contractBalance -= betAmount;

        emit betCancelled(betAmount, msg.sender);
    }

    function flipCoin() public returns(string memory result){
        require(
            (punters[msg.sender].betOnHeads > 0 finney &&
            punters[msg.sender].betOnHeads <= 10 finney &&
            punters[msg.sender].betOnTails == 0 finney)
        ||
            (punters[msg.sender].betOnTails > 0 finney &&
            punters[msg.sender].betOnTails <= 10 finney &&
            punters[msg.sender].betOnHeads == 0 finney),
        "You can must bet between 1 and 10 Finney on either Heads or Tails to flip the coin"
        );

        uint flip = now % 2;
        string memory heads = "Heads";
        string memory tails = "Tails";
        if (flip == 1) result = heads;
        else result = tails;
        emit coinFlipResult(result);

        if (punters[msg.sender].betOnHeads > 0 finney) {
            betAmount = punters[msg.sender].betOnHeads;
            punters[msg.sender].betOnHeads -= betAmount;
            if(flip == 1) {
                punters[msg.sender].balance += betAmount * 2;
                contractBalance -= betAmount * 2;
                emit betResult("Congratulations", betAmount * 2, "The bet placer");
            } else {
                emit betResult("Better luck next time", betAmount, "The House");
            }
        } else {
            betAmount = punters[msg.sender].betOnTails;
            punters[msg.sender].betOnTails -= betAmount;
            if(flip == 0) {
                punters[msg.sender].balance += betAmount * 2;
                contractBalance -= betAmount * 2;
                emit betResult("Congratulations", betAmount * 2, "The bet placer");
            } else {
                emit betResult("Better luck next time", betAmount, "The House");
            }
        }
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
