pragma solidity ^0.5.11;

/**
  Data-logic separation pattern
*/

contract Data {
  address owner;
  address logicContract;

  uint256 public number;
  
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  modifier onlyLogicContract() {
    require(msg.sender == logicContract);
    _;
  }

  constructor() public {
    owner = msg.sender;
  }

  function setNumber(uint256 num) onlyLogicContract external {
    number = num;
  }
  function getNumber() external view returns(uint256) {
    return number;
  }

  function setLogicContract(address _addr) onlyOwner public {
    logicContract = _addr;
  }
}

contract Logic {

  Data public data;
  address owner;

  constructor(address _data) public {
    data = Data(_data);
    owner = msg.sender;
  }

  function setNumber(uint256 num) public {
    data.setNumber(num);
  }

  function getNumber() view public returns(uint256 num) {
    return data.getNumber();
  }

  function setDataContract(address _data) public {
    data = Data(_data);
  }


}
