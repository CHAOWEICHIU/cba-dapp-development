pragma solidity ^0.5.0;

contract HelloWorld {
    address payable public owner;
    
    constructor() public {
        owner = msg.sender;
    }
    
}