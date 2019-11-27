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

    var items;

    document.getElementById("inputTextArea").oninput = () => {
      items = document.getElementById("inputTextArea").value.split(",");

      /* remove all child */
      const myNode = document.getElementById("list");
      while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
      }

      /* append child */
      for (let index = 0; index < items.length; index++) {
        var node = document.createElement("li");
        node.innerHTML = items[index];
        document.getElementById("list").appendChild(node);
      }
    };
    document.getElementById("submitButton").onclick = async () => {
      var networkId = await web3.eth.net.getId();
      var contractInfo = (await import("../build/contracts/RandPicker.json"))
        .default;
      var { abi, networks } = contractInfo;

      if (networks[networkId]) {
        var contract = new web3.eth.Contract(abi, networks[networkId].address);
        var networkId = await web3.eth.net.getId();

        var [account] = await web3.eth.getAccounts();

        await contract.methods.newEntry(items).send({ from: account });

        // const secondAddressEntryCount = await ;
        var pickersCount = await contract.methods.pickersIndex(account).call();
        let pickers = [];
        for (let index = 1; index <= pickersCount; index++) {
          let data = await contract.methods.getPicker(account, index).call();
          pickers.push(data);
        }

        /* remove all child */
        var myNode = document.getElementById("randPickerList");
        while (myNode.firstChild) {
          myNode.removeChild(myNode.firstChild);
        }

        document.getElementById("randPickerList").innerHTML = pickers
          .map(
            (picker, pickerIndex) => `
            <br />
            <ul>
              <li>Words List</li>
              <ul>
                ${picker.words.reduce(
                  (container, word) => container + "<li>" + word + "</li>",
                  ""
                )}
              </ul>
              <li>Result</li>
              <ul>
              ${
                picker.picks.length === 0
                  ? "<li>" + "yet picked" + "</li>"
                  : picker.picks.reduce(
                      (container, word) => container + "<li>" + word + "</li>",
                      ""
                    )
              }
              </ul>
              <li>
                <button id="button_for_picker_${pickerIndex + 1}">
                  Pick One
                </button>
              </li>
            </ul>
        `
          )
          .reverse()
          .join("");
        for (let index = 0; index < pickers.length; index++) {
          document.getElementById(
            `button_for_picker_${index + 1}`
          ).onclick = async () => {
            await contract.methods
              .pickOne(String(index + 1))
              .send({ from: account });

            // TODO Update UI after contract interaction
          };
        }
      } else {
        console.log(`cannot find deployed contract on network ${networkId}`);
      }
    };
  } else {
    console.log("MetaMask Needed");
  }
};

init();
