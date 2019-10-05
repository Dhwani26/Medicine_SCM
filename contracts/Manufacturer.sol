pragma solidity >=0.4.22 <0.6.0;

contract Manufacturer{
    uint i = 0;
    
    mapping(uint=>Batch) public batches;
    struct Batch{
        uint batchId;
        string medicineName;
        string manufactureAddress;
        uint dateOfManufacture;
        uint ExpirationDate;
        uint numberOfUnits;
        uint pricePerUnit;
        string description;
        string chemicalSupplierName;
    }

    
    function createBatch(
        string memory _medicineName,
        string memory _manufactureAddress,
        uint _dateOfManufacture,
        uint _ExpirationDate,
        uint _numberOfUnits,
        uint _pricePerUnit,
        string memory _description,
        string memory _chemicalSupplierName) public returns (bool){
        
        i++;
        batches[i].batchId = i; 
        batches[i].medicineName = _medicineName; 
        batches[i].manufactureAddress = _manufactureAddress;
        batches[i].dateOfManufacture =  _dateOfManufacture;
        batches[i].ExpirationDate = _ExpirationDate;
        batches[i].numberOfUnits = _numberOfUnits;
        batches[i].pricePerUnit = _pricePerUnit;
        batches[i].description = _description;
        batches[i].chemicalSupplierName = _chemicalSupplierName;
        
    }
    
    function getQuantity(uint _batchId) public view returns(uint){
        return batches[_batchId].numberOfUnits;
    }
    
    function updateQuantity(uint _batchId, uint _quantity) public returns (bool){
        batches[_batchId].numberOfUnits -= _quantity;
    }
}