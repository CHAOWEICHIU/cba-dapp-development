var HDWalletProvider = require("@truffle/hdwallet-provider");
var Web3 = require("web3");
var mnemonic =
  "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat";

var provider = new HDWalletProvider(mnemonic, "http://localhost:8545");

var web3 = new Web3(provider);
web3.setProvider(provider);
web3.eth.sendTransaction(
  {
    from: "0x627306090abaB3A6e1400e9345bC60c78a8BEf57", // private key -> 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3,
    to: "0xf17f52151EbEF6C7334FAD080c5704D77216b732",
    value: web3.utils.toWei("1", "ether")
  },
  (err, transaction) => {
    console.log("err", transaction);
  }
);

provider.engine.stop();

/*
  JSON-RPC Reference
  https://github.com/ethereum/wiki/wiki/JSON-RPC

  eth_getBlockByNumber 
  -> The number of the most recent block.

  eth_gasPrice
  -> The gas price is determined by the last few blocks median gas price.

  eth_estimateGas
  -> Estimate Gas

  eth_getTransactionCount
  -> Nonce for particular user

  eth_sendRawTransaction
  -> Send signed transaction

*/
