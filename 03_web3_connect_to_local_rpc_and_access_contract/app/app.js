var Web3 = require('web3')
const init = async () => {
  /**
   * 1. MetaMask wallet injects a global variable called ethereum
   * 2. ethereum is a HTTP provider which allows you to communicate with RPC server over HTTP
   * 3. By passing the provider to web3, we are now able to interact with DEXON
   */
  
  if(window.ethereum) {
    await window.ethereum.enable();
    var web3 = new Web3(window.ethereum)
    var accounts = await web3.eth.getAccounts()
    document.getElementById('address').innerHTML = accounts[0]

    var networkId = await web3.eth.net.getId()
    var contractInfo = (await import('../build/contracts/Hello.json')).default;
    var { abi, networks } = contractInfo;

    Object.keys(networks).forEach(
      id => console.log(`
Hello Contract is on network ${id}
Its contract addrress is ${networks[id].address}
`)
    );

    document.getElementById('networkId').innerHTML = networkId

    if(networks[networkId]) {
      document.getElementById('contractAddress').innerHTML = networks[networkId].address
      var helloContract = new web3.eth.Contract(abi, networks[networkId].address);

      
      document.getElementById('get').onclick = async () => {
        const result = await helloContract.methods.get().call();
        console.log('Function Signature',web3.eth.abi.encodeFunctionSignature('get()'));
        alert(result);
      };

      document.getElementById('update').onclick = async () => {
        var accounts = await web3.eth.getAccounts()
        console.log('Function Signature',web3.eth.abi.encodeFunctionSignature('update()'));
        await helloContract.methods.update().send({
          from: accounts[0],
        });
      };

      // Update data via contract Event Emit & websocket
      var web3WS = new Web3('ws://localhost:8545')
      contractReader = new web3WS.eth.Contract(abi, networks[networkId].address)
      contractReader.events.UpdateNumber({}, (err, data) => {
        console.log(data);
      })
    }
  } else {
    console.log('MetaMask Needed')
  }
};

init();