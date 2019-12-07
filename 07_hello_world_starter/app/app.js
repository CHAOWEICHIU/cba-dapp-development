var Web3 = require("web3");

const init = async () => {
  if (window.ethereum) {
    await window.ethereum.enable();
    var web3 = new Web3(window.ethereum);
    var [account] = await web3.eth.getAccounts();
    document.getElementById("address").innerHTML = account;
    document.getElementById("getContractAddressButton").onclick = async () => {
      var networkId = await web3.eth.net.getId();
      var contractInfo = (await import("../build/contracts/HelloWorld.json"))
        .default;
      var { networks } = contractInfo;
      if (networks[networkId] && networks[networkId].address) {
        document.getElementById("contractAddress").innerHTML =
          networks[networkId].address;
      } else {
        throw "cannot find deployed contract, please make sure you have selected correct network in your metamask";
      }
    };
  } else {
    console.log("MetaMask Needed");
  }
};

init();
