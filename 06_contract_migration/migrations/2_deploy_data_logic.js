var Data = artifacts.require("Data");
var Logic = artifacts.require("Logic");

module.exports = async function(deployer) {
  await deployer.deploy(Data);
  await deployer.deploy(Logic, Data.address);
  const DataContract = await Data.deployed();
  DataContract.setLogicContract(Logic.address);
};
