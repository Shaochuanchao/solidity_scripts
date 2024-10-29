const hre = require("hardhat");

async function main() {
    // 写死的参数
    const privateKey = "";
    const faucetAddress = "0x80Ea9CEf1c430c99Bfc107377B0D2deD18FFaf4E"; // 需要手动替换为实际部署的水龙头地址

    try {
        // 创建签名者
        const provider = hre.ethers.provider;
        const wallet = new hre.ethers.Wallet(privateKey, provider);
        console.log("Using address:", wallet.address);

        // 获取水龙头合约实例
        const Faucet = await hre.ethers.getContractFactory("Faucet");
        const faucet = Faucet.attach(faucetAddress);

        // 连接到签名者
        const faucetWithSigner = faucet.connect(wallet);

        // 获取代币地址
        const tokenAddress = await faucet.token();
        const token = await hre.ethers.getContractAt("MyContract", tokenAddress, wallet);

        // 获取当前余额
        const oldBalance = await token.balanceOf(wallet.address);
        console.log("Current balance:", hre.ethers.formatEther(oldBalance));

        // 请求代币
        console.log("Requesting tokens from faucet...");
        const tx = await faucetWithSigner.requestTokens();
        
        // 等待交易确认
        console.log("Transaction hash:", tx.hash);
        await tx.wait();
        console.log("Transaction confirmed");

        // 获取新余额
        const newBalance = await token.balanceOf(wallet.address);
        console.log("New balance:", hre.ethers.formatEther(newBalance));
        console.log("Received:", hre.ethers.formatEther(newBalance - oldBalance));

    } catch (error) {
        if (error.reason) {
            console.error("Error:", error.reason);
        } else {
            console.error("Error:", error.message);
        }
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 