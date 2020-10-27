import "./Ownable.sol";
import "./Destroyable.sol";
import "./provableAPI.sol";
import "./Accountable.sol";
import "./Winnable.sol";

pragma solidity 0.5.12;

contract Randomisable is Ownable, Destroyable, usingProvable, Accountable, Winnable {

    uint256 constant NUM_RANDOM_BYTES_REQUESTED = 1;
    uint256 constant GAS_FOR_CALLBACK = 200000;

    event BetPlaced(address indexed player, bytes32 indexed queryId, uint256 amountBet, uint256 balanceBeforeBet);
    event FlipNumberReceived(address indexed player, bytes32 indexed queryId, uint256 latestNumber, uint256 Heads1orTails0);
    event RollNumberReceived(address indexed player, bytes32 indexed queryId, uint256 latestNumber, uint256 diceNumber);
    event HouseCard_Received(address indexed player, uint256 latestNumber, uint256 houseCard);
    event UserCard_Received(address indexed player, bytes32 indexed queryId, uint256 latestNumber, uint256 userCard);

    function __callback(bytes32 _queryId, string memory _result/*, bytes memory _proof*/) public {
        require(msg.sender == provable_cbAddress());
        
        address punter = bets[_queryId].player;
        punters[punter].latestQueryId = _queryId;
        
        
        /*I have commented out the proof check as it throws the size of my contract over the allowed size
        if (provable_randomDS_proofVerify__returnCode(_queryId, _result, _proof) != 0) {
            pendingPayouts -= bets[_queryId].betAmount;
            punters[punter].pendingBets -= bets[_queryId].betAmount;
        } else {
        */
    
            uint256 randomNumber = uint256(keccak256(abi.encodePacked(_result)));
    
            if (bets[_queryId].gameRef == 1) {      //gameRef 1 refers to FlipOut game (coin flip)
                bets[_queryId].result = randomNumber % 2;       //produces number 1 or 0 (heads or tails respectively)
    
                payOut(punter, _queryId, bets[_queryId].result, bets[_queryId].gameRef);        //payout function in Winnable contract
    
                emit FlipNumberReceived(punter, _queryId, randomNumber, bets[_queryId].result);
    
            } else if (bets[_queryId].gameRef == 2) {      //gameRef 2 refers to RollOut game (dice roll)
                bets[_queryId].result = (randomNumber % 6) + 1;         //produces a number between 1 and 6, inclusively
    
                payOut(punter, _queryId, bets[_queryId].result, bets[_queryId].gameRef);        //payout function in Winnable contract
    
                emit RollNumberReceived(punter, _queryId, randomNumber, bets[_queryId].result);
                
            } else if (bets[_queryId].gameRef == 3) {           //gameRef 3 refers to DrawOut game (high card draw game)
                
                bets[_queryId].result = (randomNumber % 13) + 1;            //produces a number between 1 and 13, inclusively (which would be Ace through King)
    
                payOut(punter, _queryId, bets[_queryId].result, bets[_queryId].gameRef);        //payout function in Winnable contract
    
                emit UserCard_Received(punter, _queryId, randomNumber, bets[_queryId].result);
            }
       // }
    }


    function requestNumber(address punter, uint256 gameRef, uint256 betAmount, uint256 choice, uint256 query_price) payable public {
        uint256 queryPrice;
        if (freeCallBack == false) {
            queryPrice = query_price;
        } else {
            queryPrice = 0;
            freeCallBack = false;
        }
        
        
        uint256 QUERY_EXECUTION_DELAY = 0;
        bytes32 _queryId = provable_newRandomDSQuery(
            QUERY_EXECUTION_DELAY,
            NUM_RANDOM_BYTES_REQUESTED,
            GAS_FOR_CALLBACK
        );
        

        Bet memory newBet;          //new bet created every time a new number is requested
        newBet.id = _queryId;
        newBet.player = punter;
        newBet.gameRef = gameRef;
        newBet.betAmount = betAmount;
        newBet.choice = choice;
        newBet.queryPrice = queryPrice;
        newBet.result;

        bets[_queryId] = newBet;

        emit BetPlaced(punter, newBet.id, newBet.betAmount, punters[newBet.player].balance);
    }
    
    
    function getQueryPrice() internal returns (uint256 price) {
         price = provable_getPrice("price", GAS_FOR_CALLBACK);
    }

 }
