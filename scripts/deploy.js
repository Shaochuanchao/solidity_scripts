const hre = require("hardhat");
const yaml = require('js-yaml');
const fs = require('fs');

async function main() {
  // 获取当前网络名称
  const networkName = hre.network.name;
  
  // 读取配置文件
  const config = yaml.load(fs.readFileSync('./config/default.yaml', 'utf8'));
  
  // 获取对应网络的配置
  const networkConfig = config.networks[networkName];
  
  if (!networkConfig) {
    throw new Error(`Network ${networkName} not found in config`);
  }

  // 使用配置中的私钥创建签名者
  let deployer;
  if (networkConfig.privateKey) {
    deployer = new hre.ethers.Wallet(networkConfig.privateKey, hre.ethers.provider);
    console.log("Deploying contracts with account:", deployer.address);
  } else {
    throw new Error(`Private key not found for network ${networkName}`);
  }

  // 部署代币合约
  const initialSupply = hre.ethers.parseEther("1000000"); // 100万代币
  console.log("Deploying MyContract...");
  const MyContract = await hre.ethers.getContractFactory("MyContract");
  const myContract = await MyContract.connect(deployer).deploy("MyToken", "MTK", initialSupply);
  await myContract.waitForDeployment();
  console.log(`MyContract deployed to ${await myContract.getAddress()} on ${networkName}`);

  // 部署水龙头合约
  console.log("Deploying Faucet...");
  const Faucet = await hre.ethers.getContractFactory("Faucet");
  const faucet = await Faucet.connect(deployer).deploy(await myContract.getAddress());
  await faucet.waitForDeployment();
  console.log(`Faucet deployed to ${await faucet.getAddress()} on ${networkName}`);

  // 将50%的代币转移到水龙头合约
  const faucetAmount = initialSupply / 2n; // 50%的初始供应量
  const transferTx = await myContract.transfer(await faucet.getAddress(), faucetAmount);
  await transferTx.wait(); // 等待交易确认
  console.log(`Transferred ${hre.ethers.formatEther(faucetAmount)} tokens to faucet`);
  
  // 如果配置了etherscan API key，等待几个区块后验证合约
  if (networkConfig.etherscanApiKey) {
    console.log("Waiting for 6 blocks confirmation...");
    await hre.ethers.provider.waitForBlock(hre.ethers.provider.blockNumber + 6);
    
    console.log("Verifying contracts on Etherscan...");
    // 验证代币合约
    await hre.run("verify:verify", {
      address: await myContract.getAddress(),
      constructorArguments: ["MyToken", "MTK", initialSupply],
    });

    // 验证水龙头合约
    await hre.run("verify:verify", {
      address: await faucet.getAddress(),
      constructorArguments: [await myContract.getAddress()],
    });
  }

  // 打印部署信息
  console.log("\nDeployment Summary:");
  console.log("-------------------");
  console.log(`Token Contract: ${await myContract.getAddress()}`);
  console.log(`Faucet Contract: ${await faucet.getAddress()}`);
  console.log(`Initial Supply: ${hre.ethers.formatEther(initialSupply)} MTK`);
  console.log(`Faucet Balance: ${hre.ethers.formatEther(faucetAmount)} MTK`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 