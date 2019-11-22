var fileReaderPullStream = require("pull-file-reader");
var IpfsHttpClient = require("ipfs-http-client");

var ipfs = IpfsHttpClient({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https"
});

var init = async () => {
  console.log("hihi");

  document.getElementById("upload").onchange = async ({ target }) => {
    document.getElementById("ipfsHash").innerText = "IPFS uploading...";
    document.getElementById("base64").innerText = "";
    document.getElementById("url").innerText = "";
    document.getElementById("url").href = "";

    var file = target.files[0];
    var fileStream = fileReaderPullStream(file);
    var reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      document.getElementById("preview").src = reader.result;
      document.getElementById("base64").innerText = `Base64: ${reader.result}`;
    };

    const t = await ipfs.add(fileStream, {
      progress: p => console.log(`progress ${p}`)
    });
    console.log(t);
    document.getElementById("url").href =
      "https://gateway.ipfs.io/ipfs/" + t[0].hash;
    document.getElementById("url").innerText = "Click me";

    document.getElementById(
      "ipfsHash"
    ).innerHTML = `IPFS Hash: <a href="https://gateway.ipfs.io/ipfs/${
      t[0].hash
    }">${t[0].hash}</a>`;
  };
};

init();

/*
Private Key to Public Key

const Wallet = require('ethereumjs-wallet');
const EthUtil = require('ethereumjs-util');

const keyPrivate = '0x61ce8b95ca5fd6f55cd97ac60817777bdf64f1670e903758ce53efc32c3dffeb'
const keyPublic = 'fff49b58b83104ff16875452852466a46c7169ba4e368d11830c9170624e0a9509080a05a38c18841718ea4fc13483ac467d3e2d728d41ff16b73b9c943734f8'

const privateKeyBuffer = EthUtil.toBuffer(keyPrivate);
const wallet = Wallet.fromPrivateKey(privateKeyBuffer);

// Test if it is the same
console.log(keyPublic === wallet.getPublicKeyString()) // true

*/

/*
Upload Encrypted Zip File

var IpfsHttpClient = require('ipfs-http-client')
var EthCrypto = require('eth-crypto')
var intoStream = require('into-stream')

var ipfs = IpfsHttpClient({
  host: 'ipfs.infura.io',
  port: '5001',
  protocol: 'https',
})

var keyPrivate = '0x61ce8b95ca5fd6f55cd97ac60817777bdf64f1670e903758ce53efc32c3dffeb'
var keyPublic = 'fff49b58b83104ff16875452852466a46c7169ba4e368d11830c9170624e0a9509080a05a38c18841718ea4fc13483ac467d3e2d728d41ff16b73b9c943734f8'


// helper function
function decryptStringWithPrivateKey({ encryptedString, privateKey }) {
  const decompressedString = EthCrypto.cipher.parse(encryptedString)
  return EthCrypto.decryptWithPrivateKey(privateKey, decompressedString)
}

// helper function
function encryptStringWithPublicKey({ message, publicKey }) {
  return EthCrypto
    .encryptWithPublicKey(publicKey, message)
    .then(dataObject => EthCrypto
      .cipher
      .stringify(dataObject))
}

// helper function
function decryptStringWithPrivateKey({ encryptedString, privateKey }) {
  const decompressedString = EthCrypto.cipher.parse(encryptedString)
  return EthCrypto.decryptWithPrivateKey(privateKey, decompressedString)
}

document.getElementById("upload").onchange = async (event) => {
  const [file] = Array.from(e.target.files)
  const reader = new FileReader()
  reader.readAsBinaryString(file)
  reader.onload = (event) => {
    encryptStringWithPublicKey({
      message: event.target.result,
      publicKey: keyPublic,
    })
      .then(encryptedString => ipfs.add(
        intoStream(encryptedString),
        {},
        (err, data) => {
          const hash = data[0].hash
          // store this hash from ipfs on smart contract
        },
      ))
  }
}

<input
  type="file"
  accept=".zip"
  id="zipFile"
/>



Download Encrypted Zip File

const fetch = require('node-fetch')
const EthCrypto = require('eth-crypto')
const FileSaver = require('file-saver')
const { binaryStringToBlob } = require('blob-util')

const keyPrivate = '0x61ce8b95ca5fd6f55cd97ac60817777bdf64f1670e903758ce53efc32c3dffeb'
const keyPublic = 'fff49b58b83104ff16875452852466a46c7169ba4e368d11830c9170624e0a9509080a05a38c18841718ea4fc13483ac467d3e2d728d41ff16b73b9c943734f8'
const hashFromSmartContract = 'Qme9JXnWExQLxXS5U1Hd1QdbTCNBQqAiVy5UrR3dwZxmmU' // a zip file contains a image

downloadZipFile(hashFromSmartContract)

function downloadZipFile(hash) {
  fetch(`https://gateway.ipfs.io/ipfs/${hash}`)
    .then(response => response.body)
    .then(readableStream => readStream(readableStream))
    .then(str => decryptStringWithPrivateKey({
      encryptedString: str,
      privateKey: keyPrivate,
    }))
    .then(binaryString => FileSaver.saveAs(binaryStringToBlob(binaryString), 'incentive-program.zip'))
}

// helper
function readStream(stream) {
  const reader = stream.getReader()
  let result = ''
  // read() returns a promise that resolves
  // when a value has been received
  return reader.read().then(function processText({ done, value }) {
    // Result objects contain two properties:
    // done  - true if the stream has already given you all its data.
    // value - some data. Always undefined when done is true.
    if (done) {
      return result
    }
    const enc = new TextDecoder('utf-8')
    const arr = new Uint8Array(value)
    result += enc.decode(arr)

    // Read some more, and call this function again
    return reader.read().then(processText)
  })
}

*/
