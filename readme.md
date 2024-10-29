# ERC20 Token Project

这是一个使用 Hardhat 开发的 ERC20 代币项目，包含一个水龙头合约和 ETH 转账脚本。

## 项目结构
1. `contracts/` - 智能合约目录
   - `MyContract.sol` - ERC20 代币合约
   - `Faucet.sol` - 水龙头合约
2. `scripts/` - 部署和交互脚本目录
   - `deploy.js` - 部署合约脚本
   - `faucet.js` - 领取水龙头代币脚本
   - `transfer.js` - ETH 转账脚本
3. `test/` - 测试文件目录
   - `MyContract.test.js` - 代币合约测试
4. `config/` - 配置文件目录
   - `default.yaml` - 网络配置文件
   - `default.example.yaml` - 网络配置示例文件
5. `hardhat.config.js` - Hardhat 配置文件

## 合约功能
### MyContract.sol
- 标准 ERC20 功能
- 所有权控制
- mint（铸造）功能 - 仅限 owner
- burn（销毁）功能 - 仅限 owner
- approve（授权）功能 - 仅限 owner
- transferFrom（授权转账）功能 - 仅限 owner
- allowance（查询授权）功能 - 仅限 owner

### Faucet.sol
- 每个地址可以无限领取，每次领取 100 个代币
- 如果水龙头余额不足则领取失败

## 脚本功能
### 部署合约
- `deploy.js` - 部署 `MyContract` 和 `Faucet` 合约，并将 50% 的代币转移到水龙头合约

### 领取水龙头代币
- `faucet.js` - 使用指定的私钥从水龙头合约领取代币

### ETH 转账
- `transfer.js` - 使用指定的私钥将 ETH 转账到指定地址

## 开发指南
1. 安装依赖：
   ```bash
   npm install
   ```

2. 编译合约：
   ```bash
   npm run compile
   ```

3. 运行测试：
   ```bash
   npm run test
   ```

4. 部署合约：
   ```bash
   npm run deploy:sepolia
   ```

5. 领取水龙头代币：
   ```bash
   npm run faucet
   ```

6. ETH 转账：
   ```bash
   npm run transfer
   ```

## 配置
- 使用 `config/default.yaml` 配置不同网络的 RPC、私钥和 Etherscan API Key。
- 使用 `config/default.example.yaml` 作为模板创建自己的配置文件。

## 注意事项
- 确保在 `config/default.yaml` 中正确配置了网络信息。
- 私钥和其他敏感信息不应提交到代码仓库。 