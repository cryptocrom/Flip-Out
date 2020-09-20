import "./Ownable.sol";
import "./Destroyable.sol";
import "./Accountable.sol";

pragma solidity 0.5.12;

contract RollOut is Ownable, Destroyable, Accountable {

    uint internal roll;
    uint internal rollChoice;

    event BetPlaced(uint amountBet, uint newBalance);
    event Results(uint rollResult, uint choice, string winner, uint payoutAmount, address recipient);


    function rollIt(uint amountToBet, uint choice) public {
        require(amountToBet >= 1, "Bet amount must be at least 1 finney");
        require(choice >= 1 && choice <= 6, "You must select a number between 1 and 6, inclusive");

        uint bet = amountToBet * 1e15;      //converts a number to a wei amount (this contract assumes finneys as operational value)
        require(punters[msg.sender].balance >= bet,"You must have enough funds in your betting account to cover that bet");

        require(contractBalance >= bet * 5, "The contract does not currently have enough liquidity to cover a winning bet, please try again later");

        punters[msg.sender].balance -= bet;
        contractBalance += bet;

        emit BetPlaced(bet, punters[msg.sender].balance);

        rollChoice = choice;

        roll = rollDice();

        uint payout = bet * 6;

        if (choice == 1) {
            if (roll == 1) {
                punters[msg.sender].balance += payout;
                contractBalance -= payout;
                emit Results(roll, choice, "The Player", payout, msg.sender);
            } else {
                emit Results(roll, choice, "The House", bet, owner);
            }
        } else if (choice == 2) {
            if (roll == 2) {
                punters[msg.sender].balance += payout;
                contractBalance -= payout;
                emit Results(roll, choice, "The Player", payout, msg.sender);
            } else {
                emit Results(roll, choice, "The House", bet, owner);
            }
        } else if (choice == 3) {
            if (roll == 3) {
                punters[msg.sender].balance += payout;
                contractBalance -= payout;
                emit Results(roll, choice, "The Player", payout, msg.sender);
            } else {
                emit Results(roll, choice, "The House", bet, owner);
            }
        } else if (choice == 4) {
            if (roll == 4) {
                punters[msg.sender].balance += payout;
                contractBalance -= payout;
                emit Results(roll, choice, "The Player", payout, msg.sender);
            } else {
                emit Results(roll, choice, "The House", bet, owner);
            }
        } else if (choice == 5) {
            if (roll == 5) {
                punters[msg.sender].balance += payout;
                contractBalance -= payout;
                emit Results(roll, choice, "The Player", payout, msg.sender);
            } else {
                emit Results(roll, choice, "The House", bet, owner);
            }
        } else if (choice == 6) {
            if (roll == 6) {
                punters[msg.sender].balance += payout;
                contractBalance -= payout;
                emit Results(roll, choice, "The Player", payout, msg.sender);
            } else {
                emit Results(roll, choice, "The House", bet, owner);
            }
        }

    }


    function rollDice() internal view returns(uint rollResult){
        uint random = uint256(keccak256(abi.encodePacked(msg.sender, now)));  //pseudo-randomised number
        uint rollRes = (random % 6) + 1;  //spits out a number between 1 and 6, inclusively
        return (rollRes);
    }


  }
