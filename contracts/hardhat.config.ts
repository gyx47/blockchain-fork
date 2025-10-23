import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      // hardhat: {1},
      // rpc url, change it according to your ganache configuration
      url: 'http://localhost:8545',
      // the private key of signers, change it according to your ganache user
      accounts: [
        '0x0f9bc5a6ff8aabf945542ebba7279c4c02becdf28fa20587039f0bc109aab54f'
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
