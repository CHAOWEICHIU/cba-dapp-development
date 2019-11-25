const RandPicker = artifacts.require("RandPicker");

module.exports = function(deployer) {
  deployer.deploy(RandPicker);
};
