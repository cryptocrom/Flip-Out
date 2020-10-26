import "./Ownable.sol";
import "./Destroyable.sol";
import "./provableAPI.sol";
import "./Accountable.sol";
import "./Winnable.sol";
import "./Randomised.sol";

pragma solidity 0.5.12;

contract FlipOut is Ownable, Destroyable, usingProvable, Accountable, Winnable, Randomised {

    function flipIt(uint256 amountToBet, uint256 betChoice) public {

        require(amountToBet >= 1, "Must bet something");
        require(betChoice == 1 || betChoice == 0, "Must select Heads or Tails to bet");

        uint256 betAmount = amountToBet * 1e15;         //takes integer and turns it into finney amount
        uint256 queryPrice = getQueryPrice();

        require(punters[msg.sender].balance - punters[msg.sender].pendingBets >= betAmount + queryPrice, "Not enough liquidity");
        require(contractBalance - pendingPayouts >= (betAmount + queryPrice), "Contract cannot cover bet");

        //Instead of deducting from contract and player balances at the start of a bet I have instigated a pending bet amount for the player
        //and a pending payout amount for the contract (which holds the full payout amount applicable for each bet until the bet conclusion)
        //this means the full payout amounts, bet amounts and query costs are accounted for in require statments to ensure both the
        //contract and player have enough liquidity to cover all bets.
        //This ensures contract can handle multiple users and player's can play mulptiple games at the same time (except for DrawOut)

        pendingPayouts += (betAmount + queryPrice);        //maximum payout amount (less bet amount) + queryPrice, for this game is added to contract's pending bet balances, which is checked against all incoming bets
        punters[msg.sender].pendingBets += (betAmount + queryPrice);       //betAmount + queryPrice added to player's pending bets and deducted at conclusion of bet

        requestNumber(msg.sender, 1, betAmount, betChoice, queryPrice);         //requestNumber function is in Randomised contract
    }


}
