const hre = require("hardhat");

async function main() {
  // 部署 MyContract
  const MyContract = await hre.ethers.getContractFactory("MyContract");
  const myContract = await MyContract.deploy("MyToken", "MTK");

  await myContract.deployed();

  console.log("MyContract deployed to:", myContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 