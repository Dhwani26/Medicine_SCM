pragma solidity >=0.4.22 <0.6.0;
import "./Manufacturer.sol";

contract Pharma{
    struct lot{
        uint BatchId;
        uint updatedPrice;
        uint quantity;
    }
    
    Manufacturer manufacturer;
    uint i = 0;
    function giveInstance(address _manufacturer) public{
        manufacturer = Manufacturer(_manufacturer);
    }
    
    mapping(uint=>lot) public Lots;
    
    function creatLot(uint _quantity, uint _batchId, uint _updatedPrice) public returns(bool){
        require(_quantity <= manufacturer.getQuantity(_batchId), "handling require");
        i++;
        Lots[i].BatchId = _batchId;
        Lots[i].updatedPrice = _updatedPrice;
        Lots[i].quantity = _quantity;
        manufacturer.updateQuantity(_batchId, _quantity);
    }
}