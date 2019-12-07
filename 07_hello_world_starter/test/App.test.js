var RandPicker = artifacts.require("HelloWorld");
var Web3 = require("web3");
var HDWalletProvider = require("@truffle/hdwallet-provider");
var mnemonic =
  "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat";

var web3 = new Web3(
  new HDWalletProvider(mnemonic, "http://localhost:8545", 0, 5)
);

contract("HelloWorld", accounts => {
  let contractRandPicker, ownerAddress;
  it("owner should be the one who deployed", async () => {
    await RandPicker.deployed().then(async instance => {
      contractRandPicker = new web3.eth.Contract(
        instance.abi,
        instance.address
      );
      ownerAddress = await contractRandPicker.methods.owner().call();
      assert.equal(accounts[0], ownerAddress, "deployer is not owner");
    });
  });
});
