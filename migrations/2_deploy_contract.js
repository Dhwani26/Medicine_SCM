var Manufacturer = artifacts.require("./Manufacturer.sol");
var Pharma = artifacts.require("./Pharma.sol");
var Warehouse = artifacts.require("./Warehouse.sol");
var Wholesaler = artifacts.require("./Wholesaler.sol");

module.exports = function(deployer) {
  // Use deployer to state migration tasks.
  deployer.deploy(Manufacturer);
  deployer.deploy(Pharma);
  deployer.deploy(Warehouse);
  deployer.deploy(Wholesaler);
};
