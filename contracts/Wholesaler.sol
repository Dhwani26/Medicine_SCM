pragma solidity >=0.4.22 <0.6.0;

contract Wholesaler {

   struct wholesaler{
        uint batch_id;
        uint256 incoming_date ;
        uint256 outgoing_date ;
        address wholesaler;
        uint updated_price;
        string status;
    }
    
    mapping(uint=> wholesaler) public wholesalers;
    
    
    function add_Wholesaler(uint _batchId ,uint256 _incoming,uint256 _outgoing,uint _price, string memory _status) public {
        wholesalers[_batchId].batch_id = _batchId;
        wholesalers[_batchId].outgoing_date = _outgoing;
        wholesalers[_batchId].incoming_date = _incoming;
        wholesalers[_batchId].wholesaler = msg.sender;
        wholesalers[_batchId].updated_price=_price;
        wholesalers[_batchId].status = _status;
    }
}