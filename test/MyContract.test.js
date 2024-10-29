const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyContract", function () {
  let myContract;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const MyContract = await ethers.getContractFactory("MyContract");
    myContract = await MyContract.deploy("MyToken", "MTK");
    await myContract.deployed();
  });

  describe("部署", function () {
    it("应该设置正确的所有者", async function () {
      expect(await myContract.owner()).to.equal(owner.address);
    });

    it("初始总供应量应该为0", async function () {
      expect(await myContract.totalSupply()).to.equal(0);
    });
  });

  describe("铸造功能", function () {
    it("所有者应该能够铸造代币", async function () {
      await myContract.mint(addr1.address, 100);
      expect(await myContract.balanceOf(addr1.address)).to.equal(100);
    });

    it("非所有者不能铸造代币", async function () {
      await expect(
        myContract.connect(addr1).mint(addr2.address, 100)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("销毁功能", function () {
    beforeEach(async function () {
      await myContract.mint(addr1.address, 1000);
    });

    it("所有者应该能够销毁代币", async function () {
      await myContract.burn(addr1.address, 100);
      expect(await myContract.balanceOf(addr1.address)).to.equal(900);
    });

    it("非所有者不能销毁代币", async function () {
      await expect(
        myContract.connect(addr1).burn(addr1.address, 100)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("授权功能", function () {
    it("只有所有者能够授权", async function () {
      await myContract.approve(addr1.address, 100);
      expect(await myContract.allowance(owner.address, addr1.address)).to.equal(100);
    });

    it("非所有者不能授权", async function () {
      await expect(
        myContract.connect(addr1).approve(addr2.address, 100)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("授权转账功能", function () {
    beforeEach(async function () {
      await myContract.mint(owner.address, 1000);
      await myContract.approve(addr1.address, 100);
    });

    it("只有所有者能够执行授权转账", async function () {
      await myContract.transferFrom(owner.address, addr2.address, 50);
      expect(await myContract.balanceOf(addr2.address)).to.equal(50);
    });

    it("非所有者不能执行授权转账", async function () {
      await expect(
        myContract.connect(addr1).transferFrom(owner.address, addr2.address, 50)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
}); 