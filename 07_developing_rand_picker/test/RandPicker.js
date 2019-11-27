var RandPicker = artifacts.require("RandPicker");
var Web3 = require("web3");
var HDWalletProvider = require("@truffle/hdwallet-provider");
var mnemonic =
  "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat";

var web3 = new Web3(
  new HDWalletProvider(mnemonic, "http://localhost:8545", 0, 5)
);

contract("App.sol", accounts => {
  let contractRandPicker, ownerAddress;
  describe("Contract initialization", () => {
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
    it("initial value are set to default", async () => {
      let [entryFee, pickOneFee, namePurposeFee] = await Promise.all([
        contractRandPicker.methods.entryFee().call(),
        contractRandPicker.methods.pickOneFee().call(),
        contractRandPicker.methods.namePurposeFee().call()
      ]);
      assert.equal(entryFee, "0", "entryFee should be 0");
      assert.equal(pickOneFee, "0", "pickOneFee should be 0");
      assert.equal(namePurposeFee, "0", "namePurposeFee should be 0");
    });
  });

  describe("function changeFee(uint _entryFee, uint _pickOneFee, uint _namePurposeFee) isOwner public {}", () => {
    it("can not be called by non-owner", async () => {
      const [, secondAccount] = await web3.eth.getAccounts();
      try {
        await contractRandPicker.methods.changeFee("1", "1", "1").send({
          from: secondAccount
        });
        assert.fail();
      } catch (error) {
        const errorCorrect = error.message.includes("revert");
        assert(errorCorrect, "Should revert");
      }
    });
    it("will change fee correctly", async () => {
      const [ownerAccount] = await web3.eth.getAccounts();
      await contractRandPicker.methods.changeFee("1", "2", "3").send({
        from: ownerAccount
      });

      let [entryFee, pickOneFee, namePurposeFee] = await Promise.all([
        contractRandPicker.methods.entryFee().call(),
        contractRandPicker.methods.pickOneFee().call(),
        contractRandPicker.methods.namePurposeFee().call()
      ]);
      assert.equal(entryFee, "1", "entryFee should be 1");
      assert.equal(pickOneFee, "2", "pickOneFee should be 2");
      assert.equal(namePurposeFee, "3", "namePurposeFee should be 3");
    });
  });

  describe("function() external payable {}", () => {
    it("money can be given to contract", async () => {
      const [, secondAccount] = await web3.eth.getAccounts();
      await web3.eth.sendTransaction({
        from: secondAccount,
        to: contractRandPicker._address,
        value: web3.utils.toWei("1", "ether")
      });

      var contractBalance = await web3.eth.getBalance(
        contractRandPicker._address
      );
      assert.equal(contractBalance, web3.utils.toWei("1", "ether"));
    });
  });

  describe("function withdraw() {}", () => {
    it("money will be given to contract owner if withdraw being called", async () => {
      const [ownerAccount, secondAccount] = await web3.eth.getAccounts();
      const ownerBeforeBalance = await web3.eth.getBalance(ownerAccount);
      await contractRandPicker.methods.withdraw().send({
        from: secondAccount
      });
      const ownerAfterBalance = await web3.eth.getBalance(ownerAccount);
      assert.equal(
        Number(ownerAfterBalance) - Number(ownerBeforeBalance),
        web3.utils.toWei("1", "ether"),
        "Owner should get 1 eth"
      );
    });
  });

  describe("function newEntry(string[] memory words) public payable {}", () => {
    it("will not add newEntry if not paying enough", async () => {
      const [, secondAccount] = await web3.eth.getAccounts();
      try {
        await contractRandPicker.methods.newEntry(["a", "b"]).send({
          from: secondAccount
        });
      } catch (error) {
        const errorCorrect = error.message.includes("revert");
        assert(errorCorrect, "Should revert");
      }
    });
    it("will add one entry", async () => {
      const [, secondAccount] = await web3.eth.getAccounts();
      await Promise.all([
        contractRandPicker.methods.newEntry(["a", "b"]).send({
          from: secondAccount,
          value: web3.utils.toWei("1", "ether")
        }),
        contractRandPicker.methods.newEntry(["c", "d"]).send({
          from: secondAccount,
          value: web3.utils.toWei("1", "ether")
        })
      ]);
      const secondAddressEntryCount = await contractRandPicker.methods
        .pickersIndex(secondAccount)
        .call();
      assert.equal(secondAddressEntryCount, "2", "should have 2 entry");
      const [firstEntry, secondEntry] = await Promise.all([
        contractRandPicker.methods.getPicker(secondAccount, 1).call(),
        contractRandPicker.methods.getPicker(secondAccount, 2).call()
      ]);
      assert.deepEqual(firstEntry.words, ["a", "b"], "should match");
      assert.deepEqual(secondEntry.words, ["c", "d"], "should match");
    });
  });

  describe("pickOne(uint index) public payable {}", () => {
    it("not able to pick one if not paying enough fee", async () => {
      const [, secondAccount] = await web3.eth.getAccounts();
      try {
        await contractRandPicker.methods.pickOne(1).send({
          from: secondAccount,
          value: 1
        });
      } catch (error) {
        const errorCorrect = error.message.includes("revert");
        assert(errorCorrect, "Should revert");
      }
    });
    it("able to pick one if enough fee being paid", async () => {
      const [, secondAccount] = await web3.eth.getAccounts();
      await Promise.all([
        contractRandPicker.methods
          .pickOne(1)
          .send({ from: secondAccount, value: 2 }),
        contractRandPicker.methods
          .pickOne(1)
          .send({ from: secondAccount, value: 2 }),
        contractRandPicker.methods
          .pickOne(1)
          .send({ from: secondAccount, value: 2 })
      ]);
      const data = await contractRandPicker.methods
        .getPicker(secondAccount, 1)
        .call();

      assert.equal(data.picks.length, "3");
    });
  });
});
