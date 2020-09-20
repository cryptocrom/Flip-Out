import "./Ownable.sol";
import "./Destroyable.sol";
import "./Accountable.sol";

pragma solidity 0.5.12;

contract DrawOut is Ownable, Destroyable, Accountable {

    uint internal userCard;
    uint internal houseCard;
    bool internal betHigh;
    uint private bet;

    event BetPlaced(uint amountBet, uint newBalance);
    event DrawOutResult(uint userCard, string betChoice, uint houseCard, string winner);
    event Payout(uint payoutAmount, address recipient);


    function drawHouseCard(uint amountToBet) public returns (uint card){
        require(punters[msg.sender].balance >= 1 finney,"You must have some funds in your betting account to place a bet");
        require(amountToBet >= 1, "You must bet at least 1 finney to play");

        bet = amountToBet * 1e15;
        require(punters[msg.sender].balance >= bet, "You do not currently have enough liquidity to cover that bet, please deposit more funds or reduce bet amount");
        require(contractBalance >= bet, "The contract does not currently have enough liquidity to cover a winning bet, please try again later");

        punters[msg.sender].balance -= bet;


        emit BetPlaced(bet, punters[msg.sender].balance);

        houseCard = randomNumberHouse();

        if (houseCard == 1 || houseCard == 13) {
            punters[msg.sender].balance += bet;
            emit Payout(bet, msg.sender);
        } else {
            contractBalance += bet;
        }

        return houseCard;
    }



    function drawUserCard(bool high) public {
        require(high == true || high == false, "Input must be true or false (higher or lower respectively");
        require(houseCard >= 2 && houseCard <=12, "The House needs to have drawn a card, that is not a Ace or King, first");

        betHigh = high;

        userCard = randomNumberUser();

        uint decimal = bet / 10;      //payout multiplier would not allow floating point numbers, so have reduced bet amount to decimal and increased payout multiplier value by 10x
        uint payout;


        if (houseCard == 2) {
            if (high == true) {
                payout = decimal * 11;
            } else {
                payout = decimal * 130;
            }
        } else if (houseCard == 3) {
            if (high == true) {
                payout = decimal * 13;
            } else {
                payout = decimal * 65;
            }
        } else if (houseCard == 4) {
            if (high == true) {
                payout = decimal * 14;
            } else {
                payout = decimal * 42;
            }
        } else if (houseCard == 5) {
            if (high == true) {
                payout = decimal * 16;
            } else {
                payout = decimal * 32;
            }
        } else if (houseCard == 6) {
            if (high == true) {
                payout = decimal * 18;
            } else {
                payout = decimal * 26;
            }
        } else if (houseCard == 7) {
            payout = decimal * 21;
        } else if (houseCard == 8) {
            if (high == true) {
                payout = decimal * 26;
            } else {
                payout = decimal * 18;
            }
        } else if (houseCard == 9) {
            if (high == true) {
                payout = decimal * 32;
            } else {
                payout = decimal * 16;
            }
        } else if (houseCard == 10) {
            if (high == true) {
                payout = decimal * 42;
            } else {
                payout = decimal * 14;
            }
        } else if (houseCard == 11) {
            if (high == true) {
                payout = decimal * 65;
            } else {
                payout = decimal * 13;
            }
        } else if (houseCard == 12) {
            if (high == true) {
                payout = decimal * 130;
            } else {
                payout = decimal * 11;
            }
        }

        string memory highLowChoice;
        if (high == true) highLowChoice = "High";
        if (high == false) highLowChoice = "Low";

        if ((high == true && userCard > houseCard) || (high == false && userCard < houseCard)) {
            punters[msg.sender].balance += payout;
            contractBalance -= payout;
            emit DrawOutResult(userCard, highLowChoice, houseCard, "Player");
            emit Payout(payout, msg.sender);
        } else {
            emit DrawOutResult(userCard, highLowChoice, houseCard, "The House");
            emit Payout(bet, owner);
        }

    }





    function randomNumberUser() public view returns(uint result){

        uint random = uint256(keccak256(abi.encodePacked(msg.sender, now)));
        uint number = ((random % 13) + 1);   //spits out a number between 1 and 13

        return number;
    }


    function randomNumberHouse() public view returns(uint result){

        uint random = uint256(keccak256(abi.encodePacked(owner, now)));
        uint number = ((random % 13) + 1);   //spits out a number between 1 and 13

        return number;
    }

}
