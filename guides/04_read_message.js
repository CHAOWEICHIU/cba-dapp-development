var Web3 = require("web3");
var web3 = new Web3("http://localhost:8545");

var message = "Hello, CBA!";

web3.eth.getTransactionFromBlock("5").then(response => {
  var str = web3.utils.hexToString(response.input);
  console.log(str);
});
