# ERC20 Token Project

这是一个使用 Hardhat 开发的 ERC20 代币项目。

## 项目结构
1. `contracts/` - 智能合约目录
   - MyContract.sol - ERC20 代币合约
2. `scripts/` - 部署和交互脚本目录
3. `test/` - 测试文件目录
4. `hardhat.config.js` - Hardhat 配置文件

## 合约功能
MyContract.sol 实现了以下功能：
- 标准 ERC20 功能
- 所有权控制
- mint（铸造）功能 - 仅限 owner
- burn（销毁）功能 - 仅限 owner
- approve（授权）功能 - 仅限 owner
- transferFrom（授权转账）功能 - 仅限 owner
- allowance（查询授权）功能 - 仅限 owner

## 开发指南
1. 安装依赖：


