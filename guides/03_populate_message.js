const Web3 = require("web3");
const EthereumTx = require("ethereumjs-tx").Transaction;
const web3 = new Web3("http://localhost:8545");

const address = "0x627306090abaB3A6e1400e9345bC60c78a8BEf57";
const privateKey = Buffer.from(
  /* remove 0x if copy from ganache-cli */
  "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3",
  "hex"
);
const message = "Hello, CBA!";

web3.eth
  .getTransactionCount(address)
  .then(count => {
    var rawTx = {
      nonce: web3.utils.numberToHex(count),
      gasPrice: web3.utils.numberToHex(web3.utils.toWei("10", "Gwei")),
      gasLimit: web3.utils.numberToHex("210000"),
      to: address,
      value: web3.utils.numberToHex("0"),
      data: web3.utils.toHex(message)
    };
    var tx = new EthereumTx(rawTx);
    tx.sign(privateKey);
    return tx.serialize();
  })
  .then(serializedTx => {
    const serializedTxInHex = serializedTx.toString("hex");

    web3.eth.sendSignedTransaction("0x" + serializedTxInHex).then(response => {
      console.log(response);
    });
  });
