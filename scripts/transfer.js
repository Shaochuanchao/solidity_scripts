const hre = require("hardhat");

async function main() {
    // 写死的参数
    const privateKey = "2cc918843658639a9c098ef5d81bd97c0fa38a274a45a48027ebcf03c7f376c3"; // 替换为实际的私钥
    const toAddress = "0x2F2B2DB30e5Ff6b2A1F4325d9C1E6b13dE660B46"; // 替换为接收地址
    const amountInEther = "0.2"; // 转账金额，单位为 ETH

    try {
        // 创建签名者
        const provider = hre.ethers.provider;
        const wallet = new hre.ethers.Wallet(privateKey, provider);
        console.log("Using address:", wallet.address);

        // 检查余额
        const balance = await provider.getBalance(wallet.address);
        console.log("Current balance:", hre.ethers.formatEther(balance), "ETH");

        // 检查余额是否足够
        if (balance < hre.ethers.parseEther(amountInEther)) {
            throw new Error("Insufficient balance for transfer");
        }

        // 创建交易
        const tx = {
            to: toAddress,
            value: hre.ethers.parseEther(amountInEther)
        };

        // 发送交易
        console.log(`Transferring ${amountInEther} ETH to ${toAddress}...`);
        const transactionResponse = await wallet.sendTransaction(tx);
        
        // 等待交易确认
        console.log("Transaction hash:", transactionResponse.hash);
        await transactionResponse.wait();
        console.log("Transaction confirmed");

    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 