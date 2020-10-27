import "./Ownable.sol";
import "./Destroyable.sol";
import "./provableAPI.sol";
import "./Accountable.sol";
import "./Winnable.sol";
import "./Randomisable.sol";
import "./Playable.sol";

pragma solidity 0.5.12;

contract Callable is Ownable, Destroyable, usingProvable, Accountable, Winnable, Randomisable, Playable  {

//Callable contract inherits from all 3 games so that this single contract instance is created that will allow all functionality and interoperability with DApp

    function getContractInfo() external view returns(address contractAddress, uint256 balance, uint256 pendingAmount){
        contractAddress = owner;
        balance = contractBalance;
        pendingAmount = pendingPayouts;
    }


    function getUserInfo() external view returns(address user, uint256 balance, uint256 pendingBets) {
        user = msg.sender;
        balance = punters[msg.sender].balance;
        pendingBets = punters[msg.sender].pendingBets;
    }

}
