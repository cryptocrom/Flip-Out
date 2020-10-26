import "./Ownable.sol";
import "./Destroyable.sol";
import "./provableAPI.sol";
import "./Accountable.sol";

pragma solidity 0.5.12;

contract Winnable is Ownable, Destroyable, usingProvable, Accountable {

    //results events from each game
    event FlipOutResults(address indexed player, bytes32 indexed queryId, string flipResult, string choice, string winner, uint betAmount, uint payOutAmount);
    event RollOutResults(address indexed player, bytes32 indexed queryId, uint rollResult, uint choice, string winner, uint betAmount, uint payOutAmount);
    event DrawOutResults(address indexed player, bytes32 indexed queryId, uint houseCard, uint userCard, bool choseHigher, uint betAmount, uint payOutAmount, string winner);

    //arguments for payout function come from callback function in Randomised contract
    function payOut(address punter, bytes32 query_id, uint256 result, uint256 game) public {         //game declares which game was played and therefore what payout structure is needed

        uint256 betAmount = bets[query_id].betAmount;
        uint256 queryPrice = bets[query_id].queryPrice;
        contractBalance += betAmount;
        punters[punter].balance -= betAmount;

        if (game == 1) {            //game 1 is FlipOut (coinflip)
            uint256 payoutFlip = betAmount * 2;
            if (result == bets[query_id].choice) {          //uint for result and choice will be either 1 for heads or 0 for tails
                punters[punter].balance += payoutFlip;
                contractBalance -= (payoutFlip + queryPrice);      //loser pays for the oracle call
                if (result == 1) {          //1 is heads
                    emit FlipOutResults(punter, query_id, "Heads", "Heads", "Player", betAmount, payoutFlip);
                } else {
                    emit FlipOutResults(punter, query_id, "Tails", "Tails", "Player", betAmount, payoutFlip);
                }
            } else {
                punters[punter].balance -= queryPrice;      //loser pays for the oracle call
                if (result == 1) {          //1 is heads
                    emit FlipOutResults(punter, query_id, "Heads", "Tails", "House", betAmount, betAmount);
                } else {
                    emit FlipOutResults(punter, query_id, "Tails", "Heads", "House", betAmount, betAmount);
                }
            }
            pendingPayouts -= (betAmount * 2);         //amount allocated to pending when initiating FlipOut bet
        }

        if (game == 2) {            //game 2 is RollOut (dice roll)
            uint256 payoutRoll = betAmount * 6;       //payout is 6 times bet as odds are 6 to 1
            if (result == bets[query_id].choice) {
                punters[punter].balance += payoutRoll;
                contractBalance -= (payoutRoll + queryPrice);      //loser pays for the oracle call
                emit RollOutResults(punter, query_id, result, bets[query_id].choice, "Player", betAmount, payoutRoll);
            } else {
                punters[punter].balance -= queryPrice;      //loser pays for the oracle call
                emit RollOutResults(punter, query_id, result, bets[query_id].choice, "House", betAmount, betAmount);
            }
            pendingPayouts -= (betAmount * 6);         //amount allocated to pending when initiating RollOut bet
        }

        if (game == 3) {            //game 3 is DrawOut (high card draw)
            require(cards[punter].waiting == true, "Must be waiting");      //waiting will be true if house card has been dealt
            require(cards[punter].cardId > 0, "Must have housecard id");    //cardId is generated in contract and reset to 0 after bet
            cards[punter].cardId = 0;           //cardId reset to 0 as it helps to ensure id has been updated nfor subsequent bets
            cards[punter].waiting = false;          //reset to false, ready for next bet
            uint256 houseCard = cards[punter].houseCard;
            cards[punter].houseCard = 0;            //reset card to 0 for next bet
            bool high;
            if (bets[query_id].choice == 1) high = true;        //turns integer argument into bool for less confusion in payout structure below
            if (bets[query_id].choice == 0) high = false;

            //payout structure is a house card dependent payout due to the changing odds of each card and subsequent high/low choice
            //no payout if house card is 1 or 13 (Ace or King) as there is no high/low choice available for these cards, user card will not be requested
            uint256 payoutDraw;
            if (houseCard == 2) {
                if (high == true) {
                    payoutDraw = betAmount * 11;
                } else {
                    payoutDraw = betAmount * 130;
                }
            } else if (houseCard == 3) {
                if (high == true) {
                    payoutDraw = betAmount * 13;
                } else {
                    payoutDraw = betAmount * 65;
                }
            } else if (houseCard == 4) {
                if (high == true) {
                    payoutDraw = betAmount * 14;
                } else {
                    payoutDraw = betAmount * 42;
                }
            } else if (houseCard == 5) {
                if (high == true) {
                    payoutDraw = betAmount * 16;
                } else {
                    payoutDraw = betAmount * 32;
                }
            } else if (houseCard == 6) {
                if (high == true) {
                    payoutDraw = betAmount * 18;
                } else {
                    payoutDraw = betAmount * 26;
                }
            } else if (houseCard == 7) {
                payoutDraw = betAmount * 21;
            } else if (houseCard == 8) {
                if (high == true) {
                    payoutDraw = betAmount * 26;
                } else {
                    payoutDraw = betAmount * 18;
                }
            } else if (houseCard == 9) {
                if (high == true) {
                    payoutDraw = betAmount * 32;
                } else {
                    payoutDraw = betAmount * 16;
                }
            } else if (houseCard == 10) {
                if (high == true) {
                    payoutDraw = betAmount * 42;
                } else {
                    payoutDraw = betAmount * 14;
                }
            } else if (houseCard == 11) {
                if (high == true) {
                    payoutDraw = betAmount * 65;
                } else {
                    payoutDraw = betAmount * 13;
                }
            } else if (houseCard == 12) {
                if (high == true) {
                    payoutDraw = betAmount * 130;
                } else {
                    payoutDraw = betAmount * 11;
                }
            }

            uint256 userCard = result;      //result passed to payout function from callback function in Randomised contract

            payoutDraw = payoutDraw / 10;       //payout amount divided by 10 as payout amounts, in payout structure above, are 10x higher to avoid floating point numbers

            if ((high == true && userCard > houseCard) || (high == false && userCard < houseCard)) {
                punters[punter].balance += payoutDraw;
                contractBalance -= (payoutDraw + queryPrice);      //loser pays for the oracle call
                emit DrawOutResults(punter, query_id, houseCard, userCard, high, betAmount, payoutDraw, "Player");
            } else {
                punters[punter].balance -= queryPrice;      //loser pays for the oracle call
                emit DrawOutResults(punter, query_id, houseCard, userCard, high, betAmount, betAmount, "House");
            }
            pendingPayouts -= (betAmount * 13);         //amount allocated to pending when initiating DrawOut bet
        }
        punters[punter].pendingBets -= betAmount;
    }
}
