require("@nomicfoundation/hardhat-toolbox");
const yaml = require('js-yaml');
const fs = require('fs');

// 加载配置文件
const config = yaml.load(fs.readFileSync('./config/default.yaml', 'utf8'));

// 构建网络配置
const networks = {};
Object.entries(config.networks).forEach(([networkName, networkConfig]) => {
  networks[networkName] = {
    url: networkConfig.rpc,
    accounts: networkConfig.privateKey ? [networkConfig.privateKey] : [],
    timeout: networkName === 'localhost' ? 40000 : 20000,
    gasMultiplier: 1.2
  };
});

// 构建 etherscan 配置
const etherscan = {
  apiKey: {}
};
Object.entries(config.networks).forEach(([networkName, networkConfig]) => {
  if (networkConfig.etherscanApiKey) {
    etherscan.apiKey[networkName] = networkConfig.etherscanApiKey;
  }
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "sepolia",
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      evmVersion: "paris"
    }
  },
  networks: {
    hardhat: {},
    ...networks
  },
  etherscan,
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
}; 