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
