var HelloWorld = artifacts.require("HelloWorld");
var Web3 = require('web3')
var web3 = new Web3('http://localhost:8545/')

contract("HelloWorld", accounts => {
  it("owner should be the one who contract deployer", () =>
    HelloWorld.deployed()
      .then(async instance => {
        var helloContract = new web3.eth.Contract(instance.abi, instance.address)
        var ownerAddress = await helloContract.methods.owner().call()
        assert.equal(accounts[0], ownerAddress, 'deployer is not owner')
      }));
});