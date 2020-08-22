import "./Ownable.sol";
import "./Destroyable.sol";

pragma solidity 0.5.12;

contract FlipOut is Ownable, Destroyable {

    struct Punter {
        uint age;
        bool legalAge;
        uint balance;
        uint betAmount;
        bool betHeads;
        bool betTails;
    }

    uint public contractBalance;

    event ageEntered(uint age, bool legalAge, uint balance, uint betAmount, bool betHeads, bool betTails);
    event contractDepositMade(uint amountDeposited, address fromAccount);
    event depositMade(uint amountDeposited, address fromAccount);
    event betPlaced(uint amountBet, uint currentBettingBalance);
    event betCancelled(uint betAmountCancelled, uint bettingBalance);
    event choiceMade(string choice);
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
        require (msg.value >= minimumAmount, "Minimum deposit to contract is at least 20 Finney (which will cover at least 2 max bets)");
        _;
    }

    mapping(address => Punter) private punters;


    function enterYourAge(uint age) public {
        require(punters[msg.sender].age == 0, "You have already entered your age");

        Punter memory newPunter;
        newPunter.age = age;
        if (age >= 18) newPunter.legalAge = true;
        else newPunter.legalAge = false;
        newPunter.balance = punters[msg.sender].balance;
        newPunter.betAmount = 0;
        newPunter.betHeads = false;
        newPunter.betTails = false;

        insertPunter(newPunter);
        puntersAddresses.push(msg.sender);

        emit ageEntered(newPunter.age, newPunter.legalAge, newPunter.balance, newPunter.betAmount, newPunter.betHeads, newPunter.betTails);
    }

    function depositToContract() public payable onlyOwner contractDeposit(20 finney) {
        contractBalance += msg.value;

        emit contractDepositMade(msg.value, msg.sender);
    }

    function addBettingFunds() public payable betDeposit(1 finney) {
        require(punters[msg.sender].age != 0, "You have not yet entered your age");
        require(punters[msg.sender].age >= 18, "You need to be 18 or older to gamble");
        require(punters[msg.sender].age < 125, "It is highly improbable that you are 125 years or older and therefore we will not take the risk of allowing you to place the bet, thank you");

        punters[msg.sender].balance += msg.value;

        emit depositMade(msg.value, msg.sender);
    }

     function bettingFunds()public view returns(uint){
        return punters[msg.sender].balance;
    }

    function chooseBetAmount (uint amountToBet) public {
        require(punters[msg.sender].balance >= 1 finney,"You must have some funds in your betting account to place a bet");
        require(punters[msg.sender].betAmount == 0, "You have already selected a bet amount, cancel your bet to start again");
        require(amountToBet >= 1, "The minimum bet amount is 1 (1 Finney)");
        require(amountToBet <= 10, "The maximum bet amount is 10 (10 Finney)");

        uint bet;
        if(amountToBet == 1) bet = 1 finney;
        if(amountToBet == 2) bet = 2 finney;
        if(amountToBet == 3) bet = 3 finney;
        if(amountToBet == 4) bet = 4 finney;
        if(amountToBet == 5) bet = 5 finney;
        if(amountToBet == 6) bet = 6 finney;
        if(amountToBet == 7) bet = 7 finney;
        if(amountToBet == 8) bet = 8 finney;
        if(amountToBet == 9) bet = 9 finney;
        if(amountToBet == 10) bet = 10 finney;

        require(contractBalance >= bet, "The contract does not currently have enough liquidity to cover a winning bet, pleae try again later");

        punters[msg.sender].betAmount += bet;
        punters[msg.sender].balance -= bet;

        emit betPlaced(punters[msg.sender].betAmount, punters[msg.sender].balance);
    }

    function betOnHeads() public {
        uint userBet = punters[msg.sender].betAmount;

        if (userBet >= 1 finney){
            punters[msg.sender].betHeads = true;
            punters[msg.sender].betTails = false;
        }

        emit choiceMade("Heads");
    }

    function betOnTails() public {
      uint userBet = punters[msg.sender].betAmount;

      if (userBet >= 1 finney){
          punters[msg.sender].betHeads = false;
          punters[msg.sender].betTails = true;
      }

      emit choiceMade("Tails");
    }

    function currentBetAmount() public view returns(uint currentBet) {
        currentBet = punters[msg.sender].betAmount;
        return currentBet;
    }

    function currentChoice()public view returns(string memory choice){
        if (punters[msg.sender].betHeads == true) choice = "Heads";
        else if (punters[msg.sender].betTails == true) choice = "Tails";
        else choice = "No selection made";
        return choice;
    }

    function cancelBet() public {
        uint bet = punters[msg.sender].betAmount;
        punters[msg.sender].balance += bet;
        punters[msg.sender].betAmount = 0;
        punters[msg.sender].betHeads = false;
        punters[msg.sender].betTails = false;

        emit betCancelled(bet, punters[msg.sender].balance);
    }

    function flipCoin() public returns(string memory result){

        uint flip = now % 2;
        string memory heads = "Heads";
        string memory tails = "Tails";
        if (flip == 1) result = heads;
        else result = tails;

        emit coinFlipResult(result);

        if (punters[msg.sender].betAmount > 0){
            require(punters[msg.sender].betHeads == true || punters[msg.sender].betTails == true);

            uint bet = punters[msg.sender].betAmount;
            punters[msg.sender].betAmount = 0;

            if (punters[msg.sender].betHeads == true) {
                punters[msg.sender].betHeads = false;
                punters[msg.sender].betTails = false;
                if(flip == 1) {
                    uint payout = bet * 2;
                    punters[msg.sender].balance += payout;
                    contractBalance -= bet;
                    emit betResult("Congratulations", payout, "The Player");
                } else {
                    contractBalance += bet;
                    emit betResult("Better luck next time", bet, "The House");
                }
            }

            if (punters[msg.sender].betTails == true) {
                punters[msg.sender].betHeads = false;
                punters[msg.sender].betTails = false;
                if(flip == 0) {
                    uint payout = bet * 2;
                    punters[msg.sender].balance +=payout;
                    contractBalance -= bet;
                    emit betResult("Congratulations", payout, "The Player");
                } else {
                    contractBalance += bet;
                    emit betResult("Better luck next time", bet, "The House");
                }
            }
        }
    }

    function withdrawBettingFunds() public {
        require(punters[msg.sender].balance > 0, "You do not currently have any funds for withdrawal");
        cancelBet();
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

    function insertPunter(Punter memory newPunter) private {
        address punter = msg.sender;
        punters[punter] = newPunter;
    }

    function getUserInfo() public view returns(uint age, bool legalAge, bool heads, bool tails) {
        age = punters[msg.sender].age;
        legalAge = punters[msg.sender].legalAge;
        heads = punters[msg.sender].betHeads;
        tails = punters[msg.sender].betTails;
        return (age, legalAge, heads, tails);
    }

    function getContractBalance() public view returns(uint balance){
        return contractBalance;
    }
