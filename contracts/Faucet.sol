// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Faucet is Ownable {
    IERC20 public token;
    uint256 public constant FAUCET_AMOUNT = 100 * 10**18; // 100 tokens with 18 decimals

    event FaucetRequested(address indexed to, uint256 amount);
    event TokensWithdrawn(address indexed to, uint256 amount);

    constructor(address _token) {
        token = IERC20(_token);
    }

    function requestTokens() external {
        require(
            token.balanceOf(address(this)) >= FAUCET_AMOUNT,
            "Insufficient faucet balance"
        );
        
        require(
            token.transfer(msg.sender, FAUCET_AMOUNT),
            "Token transfer failed"
        );
        
        emit FaucetRequested(msg.sender, FAUCET_AMOUNT);
    }

    // 允许所有者提取代币
    function withdrawTokens(address to, uint256 amount) external onlyOwner {
        require(
            token.transfer(to, amount),
            "Token transfer failed"
        );
        
        emit TokensWithdrawn(to, amount);
    }
} 