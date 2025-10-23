import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      // hardhat: {1},
      // rpc url, change it according to your ganache configuration
      url: 'http://localhost:7545',
      // the private key of signers, change it according to your ganache user
      accounts: [
        '0x0f9bc5a6ff8aabf945542ebba7279c4c02becdf28fa20587039f0bc109aab54f',
        '0xe451a8c32d0d3389bd6b9d8a8d13fc2712d332c1012a1510c3b2e9cf92f1ba22',
        '0x0725b0cedda029be7084f572fa113eb2063754f4a795789cf5b9123b9c354ac1',

      ]
    },
  },
  paths: {
      sources: "./contracts",
      tests: "./test",
      // cache: "./cache",
      // artifacts: "./artifacts"
    }
};

export default config;
