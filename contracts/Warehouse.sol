pragma solidity ^0.5.0;

contract Warehouse{
    
    
    constructor() public{
        
    }

    struct warehouse{
        uint batchId;
        uint updatedPrice;
        string location;
        address owner;
        string warehouseName;
        uint capacity;
        uint256 incomingDate;
        uint256 outgoingDate;
    }
    
    mapping(uint => warehouse) public warehouses;
    uint nextId = 0;
    function addToWarehouse(uint _batchId, uint _updatedPrice, string memory _location, string memory _warehouseName, uint _capacity, uint256 _incomingDate, uint256 _outgoingDate) public {
        nextId++;
        warehouses[nextId].batchId = _batchId;
        warehouses[nextId].updatedPrice = _updatedPrice;
        warehouses[nextId].location = _location;
        warehouses[nextId].warehouseName = _warehouseName;
        warehouses[nextId].capacity = _capacity;
        warehouses[nextId].incomingDate = _incomingDate;
        warehouses[nextId].outgoingDate = _outgoingDate;
        warehouses[nextId].owner = msg.sender;
    }  
}
