import "./Ownable.sol";
import "./Destroyable.sol";
import "./Accountable.sol";
import "./FlipOut.sol";
import "./RollOut.sol";
import "./DrawOut.sol";

pragma solidity 0.5.12;

contract Callable is Ownable, Destroyable, Accountable, FlipOut, RollOut, DrawOut  {


    function getContractInfo() public view returns(address contractAddress, uint balance){
        contractAddress = owner;
        balance = contractBalance;
        return (contractAddress, balance);
    }


    function getUserInfo() public view returns(address user, uint balance, uint flipChoice, uint rollChoice, bool betHigh) {
        user = msg.sender;
        balance = punters[msg.sender].balance;
        return (user, balance, flipChoice, rollChoice, betHigh);
    }


    function getResults() public view returns(uint flipOut, uint rollOut, uint drawOutUser, uint drawOutHouse) {
        flipOut = flip;
        rollOut = roll;
        drawOutUser = userCard;
        drawOutHouse = houseCard;
        return (flipOut, rollOut, drawOutUser, drawOutHouse);
    }

}
