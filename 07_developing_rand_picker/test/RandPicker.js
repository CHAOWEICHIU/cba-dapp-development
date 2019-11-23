var RandPicker = artifacts.require("RandPicker");
var Web3 = require("web3");
var web3 = new Web3("http://localhost:8545/");

contract("RandPicker", accounts => {
  it("owner should be the one who contract deployer", () =>
    RandPicker.deployed().then(async instance => {
      var randContract = new web3.eth.Contract(instance.abi, instance.address);
      var ownerAddress = await randContract.methods.owner().call();
      assert.equal(accounts[0], ownerAddress, "deployer is not owner");
    }));
});
