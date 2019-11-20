/* Using Web3.js */

var Web3 = require("web3");
var web3 = new Web3("http://localhost:8545/");
web3.eth.getBalance(
  "0x627306090abaB3A6e1400e9345bC60c78a8BEf57",
  (err, balance) => {
    console.log(balance);
  }
);

/*
  Using curl

  JSON-RPC Reference
  https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getbalance

  curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x627306090abaB3A6e1400e9345bC60c78a8BEf57", "latest"],"id":1}' http://localhost:8545/

  {
    "id":1,
    "jsonrpc": "2.0",
    "result": "0x56bc75e2d63100000" -> 100000000000000000000
  }

  https://www.rapidtables.com/convert/number/hex-to-decimal.html

*/
