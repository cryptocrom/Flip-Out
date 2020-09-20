import "./Ownable.sol";
import "./Destroyable.sol";
import "./Accountable.sol";

pragma solidity 0.5.12;

contract FlipOut is Ownable, Destroyable, Accountable {

    uint internal flip;
    uint internal flipChoice;

    event BetPlaced(uint amountBet, uint newBalance);
    event Results(string flipResult, string choice, string winner, uint payoutAmount, address recipient);


//takes amountToBet integer to be finney amount and will be converted to wei in function
//takes betChoice as integer as it is easier to deal with an integer than a string:  1 == Heads and 0 == Tails for the purpose of this function
    function flipIt(uint amountToBet, uint betChoice) public {
        require(amountToBet >= 1, "Bet amount must be at least 1 finney and no more than 100 finney");
        require(betChoice == 1 || betChoice == 0, "Heads or Tails must be selected for bet to proceed");
        require(punters[msg.sender].balance >= 1 finney,"You must have some funds in your betting account to place a bet");

        uint bet = amountToBet * 1e15;      //converts a number to a wei amount (this contract assumes finneys as operational value)
        require(punters[msg.sender].balance >= bet, "You do not currently have enough liquidity to cover that bet, please deposit more funds or reduce bet amount");
        require(contractBalance >= bet, "The contract does not currently have enough liquidity to cover a winning bet, please try again later");

        punters[msg.sender].balance -= bet;

        emit BetPlaced(bet, punters[msg.sender].balance);

        string memory choice;
        if(betChoice == 1) {
            choice = "Heads";
            flipChoice = 1;
        } else {
            choice = "Tails";
            flipChoice = 0;
        }

        flip = flipCoin();

        uint payout = bet * 2;

        if (betChoice == 1) {  //1 is equal to heads, 0 is equal to tails
            if (flip == 1) {   //1 is equal to heads, 0 is equal to tails
                punters[msg.sender].balance += payout;
                contractBalance -= bet;
                emit Results("Heads", choice, "The Player", payout, msg.sender);
            } else {
                contractBalance += bet;
                emit Results("Tails", choice, "The House", bet, owner);
            }
        }

        if (betChoice == 0) {   //1 is equal to heads, 0 is equal to tails
            if (flip == 0) {   //1 is equal to heads, 0 is equal to tails
                punters[msg.sender].balance += payout;
                contractBalance -= bet;
                emit Results("Tails", choice, "The Player", payout, msg.sender);
            } else {
                contractBalance += bet;
                emit Results("Heads", choice, "The House", bet, owner);
            }
        }
    }


    function flipCoin() internal view returns(uint flipResult){      //used in the flipIt and doubleOrNothing functions, can also be called by Dapp for non bet coin flip

        uint flipRes = now % 2;
        string memory result;
        if (flipRes == 1){
            flipResult = 1;
            result = "Heads";
        } else {
            flipResult = 0;
            result = "Tails";
        }
    }


  }
