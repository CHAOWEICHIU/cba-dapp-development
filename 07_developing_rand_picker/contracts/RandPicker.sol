pragma solidity ^0.5.2;
pragma experimental ABIEncoderV2;

contract RandPicker {
    
    address payable public owner;
    uint public entryFee = 0;
    uint public pickOneFee = 0;
    uint public namePurposeFee = 0;
    
    constructor() public {
        owner = msg.sender;
    }
    
    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }
    
    struct Picker {
        address takenBy;
        string[] words;
        uint wordsTimestamp;
        string[] picks;
        uint[] picksTimestamp;
        string purpose;
        bool purposeSet;
    }
    
    mapping(address => mapping(uint => Picker)) public pickers;
    mapping(address => uint) public pickersIndex;
    
    function changeFee(uint entryFee, uint pickOneFee, uint namePurposeFee) isOwner public {

    }
    
    function withdraw() public {

    }
    
    function() external payable {}
    
    function namePurpose(uint index ,string memory purpose) public payable {

    }
    
    function newEntry(string[] memory words) public payable  {

    }
    
    function pickOne(uint index) public payable {
     
    }
    
    function getPicker(address caller, uint index) public view returns(
        Picker memory picker
    ) {

    }
   
}

/*
pragma solidity ^0.5.2;
pragma experimental ABIEncoderV2;

contract RandPicker {
    
    address payable public owner;
    uint public entryFee = 0;
    uint public pickOneFee = 0;
    uint public namePurposeFee = 0;
    
    constructor() public {
        owner = msg.sender;
    }
    
    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }
    
    struct Picker {
        address takenBy;
        string[] words;
        uint wordsTimestamp;
        string[] picks;
        uint[] picksTimestamp;
        string purpose;
        bool purposeSet;
    }
    
    mapping(address => mapping(uint => Picker)) public pickers;
    mapping(address => uint) public pickersIndex;
    
    function changeFee(uint entryFee, uint pickOneFee, uint namePurposeFee) isOwner public {
        entryFee == entryFee;
        pickOneFee == pickOneFee;
        namePurposeFee = namePurposeFee;
    }
    
    function withdraw() public {
        owner.transfer(address(this).balance);
    }
    
    function() external payable {}
    
    function namePurpose(uint index ,string memory purpose) public payable {
        address caller = msg.sender;
        string memory defaultString;
        require(msg.value >= namePurposeFee);
        pickers[caller][index].purpose = purpose;
    }
    
    function newEntry(string[] memory words) public payable  {
        require(msg.value >= entryFee);
        address caller = msg.sender;
        pickersIndex[caller] ++;
        uint newCounter = pickersIndex[caller];
        pickers[caller][newCounter].takenBy == caller;
        pickers[caller][newCounter].words = words;
        pickers[caller][newCounter].wordsTimestamp = now;
    }
    
    function pickOne(uint index) public payable {
        require(msg.value >= pickOneFee);
        address caller = msg.sender;
        uint randIndex = now % (pickers[caller][index].words.length + 1);
        string memory winner = pickers[caller][index].words[randIndex];
        pickers[caller][index].picks.push(winner);
        pickers[caller][index].picksTimestamp.push(now);
    }
    
    function getPicker(address caller, uint index) public view returns(
        Picker memory picker
    ) {
        picker = pickers[caller][index];
    }
   
}
*/
