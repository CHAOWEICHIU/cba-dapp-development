var Web3 = require("web3");
const init = async () => {
  /**
   * 1. MetaMask wallet injects a global variable called ethereum
   * 2. ethereum is a HTTP provider which allows you to communicate with RPC server over HTTP
   * 3. By passing the provider to web3, we are now able to interact with DEXON
   */

  if (window.ethereum) {
    await window.ethereum.enable();
    var web3 = new Web3(window.ethereum);
    var [account] = await web3.eth.getAccounts();
    document.getElementById("address").innerHTML = account;
  } else {
    console.log("MetaMask Needed");
  }
};

init();
