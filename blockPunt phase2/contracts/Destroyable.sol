import "./Ownable.sol";

pragma solidity 0.5.12;

contract Destroyable is Ownable {


    function Destroy() public onlyOwner {
        selfdestruct(msg.sender);
    }

}
