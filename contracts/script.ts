import { ethers, Transaction } from "ethers";

const PK = "6c4f26a2d428acdd45f2b3f0736548d79e9cd9da534ce952a5422999be31391d";
const RPC_URL = "https://westend-asset-hub-eth-rpc.polkadot.io";
const provider = new ethers.JsonRpcProvider(RPC_URL);

// const send = provider.send;
// provider.send = async function (method: string, params: any[]) {
//   console.log("method:", method);
//   console.log("params:", params);
//   const result = await send.call(this, method, params);
//   console.log("result:", result);
//   return result;
// };

const wallet = new ethers.Wallet(PK, provider);

// (async () => {
//   const contractAddress = "0x0308D149EA4cBa0Bede727e01411879a88267432";

//   const abi_a = [
//     "function getCurrentDate() public view returns (uint64)",
//     "function startChallenge(uint64 numDays, address app) external payable returns (uint256)",
//   ];

//   const contract = new ethers.Contract(contractAddress, abi_a, wallet);

//   const tx = await contract.startChallenge(0, contractAddress, {
//     value: ethers.parseEther("0.01"),
//   });
//   console.log("tx:", tx);
//   const rc = await tx.wait();
//   console.log("rc:", rc);
// })()
//   .then(console.log)
//   .catch(console.error);

(async () => {
  const contractAddress = "0xeCdda85AC4E1FC39e5344F4A322f43e3d661e287";

  const abi_a = [
    "function test() public payable returns (uint256)",
    "function test2() public returns (uint256)",
  ];

  const contract = new ethers.Contract(contractAddress, abi_a, wallet);

  // working

  console.log(
    "t2:",
    Transaction.from(
      "0x02f86e84190f1b452b8203e88203e88602fcb9dc5e0c940c37c30bb94517215e353c0351eab8eeb842d7868080c001a03f29363729c12667ed01f0536e1fa92cd8f3abf8e0b82cfbbdc8a58c5533fe7fa0794bcc8fcb2fa0cf5cafa25ffbe9d1b6c58c94d9cb9b3b3638759bf0e46d8873"
    ).toJSON()
  );
  // gas limit
  console.log(
    "t24:",
    Transaction.from(
      "0x02f86e84190f1b452b8203e88203e886047b16ca8d12940c37c30bb94517215e353c0351eab8eeb842d7868080c001a0d32aa26f631216e66fa7c25be82b499703fc77ae1ff6614b4d9cd79fb83b50aaa05ed76b0b7c25f860f917047654100b5d8003d19ecdb2e1eee01a81c671abe8d1"
    ).toJSON()
  );
  // gas limit too much
  console.log(
    "t243:",
    Transaction.from(
      "0x02f86f84190f1b452c8203e88203e88701c014e71f1b09940c37c30bb94517215e353c0351eab8eeb842d7868080c080a0a804d393da657a28ac2655009543226d9918f2c77c3b3ce33bd3ac87a8f4d438a03de7362edf629a459132e9cb4fc1b51010377d267c66fbba300e8ae1f923f1f8"
    ).toJSON()
  );
  // gas limit fair enough 49267098616501
  console.log(
    "t244:",
    Transaction.from(
      "0x02f86e84190f1b452c8203e88203e8862ccee3e982b5940c37c30bb94517215e353c0351eab8eeb842d7868080c080a0fff16adb337948fdec8304d3567d9895cb6b852e941de19104f3256201d236d5a033e073c69b67f9da7cb8c5704afae4e4ce2559a7d8bd7f1363699d1dd3544083"
    ).toJSON()
  );

  //   const r = await provider.send("eth_sendRawTransaction", [
  //     "0x02f87884190f1b450d81c8820898860316565f511c94ecdda85ac4e1fc39e5344f4a322f43e3d661e287872386f26fc1000084f8a8fd6dc001a01f49d7d3e7860cbcd3e9091b78d6369028c1bf94ffb3d2b9cd28759a79c147e9a0533d366d4c50b00e3cfaa5def72f9408a60cf681bb51fa77a1e5177d4d759e6f",
  //     // "0x02f87284190f1b450e8203e88203e88604890f121faa94ecdda85ac4e1fc39e5344f4a322f43e3d661e287808466e41cb7c001a02a654cefe60ad8fcaf956e97f447377c48eccad866e248f3116805017dacbdffa040a319d0a95763ace84d78e9a1c4293667bd3169eb9ebb4238ec37adda7934de",
  //   ]);
  //   console.log("r:", r);
  //   const result = await contract.test2();
  //   console.log("result:", result);

  //   const nonce = await provider.getTransactionCount(wallet.address);
  //   {
  //     const tx = await contract.test({
  //       value: ethers.parseEther("0.01"),
  //       maxPriorityFeePerGas: 0,
  //       maxFeePerGas: 999,
  //       //   nonce,
  //     });
  //     console.log("tx:", tx);
  //     const rc = await tx.wait();
  //     console.log("rc:", rc);
  //   }
  //   {
  //     const tx = await contract.test({
  //       value: ethers.parseEther("0.02"),
  //       maxPriorityFeePerGas: 0,
  //       maxFeePerGas: 1000,
  //       //   nonce,
  //     });
  //     console.log("tx:", tx);
  //     const rc = await tx.wait();
  //     console.log("rc:", rc);
  //   }
})()
  .then(console.log)
  .catch(console.error);
