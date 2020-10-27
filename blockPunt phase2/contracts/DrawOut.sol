import "./Ownable.sol";
import "./Destroyable.sol";
import "./provableAPI.sol";
import "./Accountable.sol";
import "./Winnable.sol";
import "./Randomised.sol";

pragma solidity 0.5.12;

contract DrawOut is Ownable, Destroyable, usingProvable, Accountable, Winnable, Randomised {

    function drawHouseCard(uint256 amountToBet) public {
        require(cards[msg.sender].waiting != true, "Cannot be waiting for card");

        uint256 betAmount = amountToBet * 1e15;         //takes integer and turns it into finney amount
        uint256 queryPrice = getQueryPrice();

        require(punters[msg.sender].balance - punters[msg.sender].pendingBets >= betAmount + queryPrice, "Not enough liquidity");
        require(contractBalance - pendingPayouts >= ((betAmount * 12) + queryPrice), "Contract cannot cover bet");

        //Instead of deducting from contract and player balances at the start of a bet I have instigated a pending bet amount for the player
        //and a pending payout amount for the contract (which holds the full payout amount applicable for each bet until the bet conclusion)
        //this means the full payout amounts, bet amounts and query costs are accounted for in require statments to ensure both the
        //contract and player have enough liquidity to cover all bets.
        //This ensures contract can handle multiple users and player's can play mulptiple games at the same time (except for DrawOut)

        pendingPayouts += ((betAmount * 12) + queryPrice);        //maximum payout amount (less bet amount) + queryPrice, for this game is added to contract's pending bet balances, which is checked against all incoming bets
        punters[msg.sender].pendingBets += (betAmount + queryPrice);       //betAmount + queryPrice added to player's pending bets and deducted at conclusion of bet

        uint256 random = uint256(keccak256(abi.encodePacked(msg.sender, now)));         //pseudo-random number generator for the house card only as this is no critical for outcome or decision
        uint256 card = ((random % 13) + 1);     //provides number between 1 and 13, inclusive (which would be Ace through King)

        if (card != 1 && card != 13) {      //if card is 1 or 13 (Ace or King) no bet is initiated and event will fire showing card value for DApp event listener
            //if card is not 1 or 13 then house card is created along with a bytes32 id (using pseudo-random number generator from above)
            //then a bet is created (using the id created within this contract) here instead of in the Randomised contract (since we are not requesting a number from the oracle)

            bytes32 id = convert(random);       //converts random number from above to a bytes32 id

            Card memory newCard;        //house card will be stored here until conclusion of bet
            newCard.user;
            newCard.cardId = id;
            newCard.houseCard = card;
            newCard.waiting = true;

            cards[msg.sender] = newCard;

            Bet memory newBet;         //bet initiated here as we are not requesting number for housecard, just using pseudo-random number generator (above)
            newBet.id = id;
            newBet.player = msg.sender;
            newBet.gameRef;
            newBet.betAmount = betAmount;
            newBet.choice;
            newBet.queryPrice = queryPrice;
            newBet.result = card;

            bets[id] = newBet;

            emit BetPlaced(msg.sender, id, betAmount, punters[msg.sender].balance);
        } else {
            pendingPayouts -= betAmount;
            punters[msg.sender].pendingBets -= betAmount;
        }
        emit HouseCard_Received(msg.sender, random, card);
    }

    function drawUserCard(uint256 high) public {
        require(high == 0 || high == 1, "Must choose high or low");     //0 for low, 1 for high
        require(cards[msg.sender].waiting == true, "Must be waiting");
        bytes32 id = cards[msg.sender].cardId;    //id from card mapping was used for bet mapping also (when house card was drawn) - can access this bet using the id stored in the card mapping tied to this user

        requestNumber(msg.sender, 3, bets[id].betAmount, high, bets[id].queryPrice);         //requestNumber function is in Randomised contract
    }


    function convert(uint256 n) private pure returns (bytes32) {        //takes uint and spits out bytes32
        return bytes32(n);
    }
}
