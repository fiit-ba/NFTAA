import {ethers,} from "hardhat";
import {Signer, Contract} from "ethers";
import {expect} from "chai";

describe("NFTAA", function () {
	// mocks
	let targetMock: Contract;
	let nftFactory: Contract;

	// assets
	let nft: any;
	let nftOwner: Signer;
	let addr1: Signer;
	let addrs: Signer[];
	let nftaa: Contract;


	beforeEach(async function () {
		[nftOwner, addr1, ...addrs] = await ethers.getSigners();
		const note = "My NFTAA note"

		// Deploy a mock Staking contract
		const StakingMock2 = await ethers.getContractFactory("StakingMock2");
		targetMock = await StakingMock2.deploy();
		// Wait for the contract to be deployed
		await targetMock.deployed();

		// Deploy a mock NFT contract
		const MockNFT = await ethers.getContractFactory("MockNFT");
		nftFactory = await MockNFT.deploy();
		// Wait for the contract to be deployed
		await nftFactory.deployed();

		const tokenId = 1;
		nft = await nftFactory.mint(nftOwner.getAddress(), tokenId);

		// Deploy NFTAA contract
		const NFTAA = await ethers.getContractFactory("NFTAA");
		nftaa = await NFTAA.deploy(nftFactory.address, tokenId, note);
		// Wait for the contract to be deployed
		await nftaa.deployed();
	});

	describe("Attributes", function () {

		it("Should return the correct binded NFT ID", async function () {
			expect(await nftaa.getBindedNFTId()).to.equal(1);
		});

		it("Should return the correct NFTAA note", async function () {
			expect(await nftaa.getDescription()).to.equal("My NFTAA note");
		});

	});

	describe("Proxy", function () {

		it("Should revert when calling proxy with a non-owner address", async function () {
			const call = "stake()";
			const value = ethers.utils.parseEther("1");
			await expect(nftaa.connect(addr1).proxy(call, targetMock.address, {value: value})).to.be.revertedWith("Caller is not the owner of the NFT");
		});

		it("Should emit a ProxyResponse event when calling proxy with a valid function call", async function () {
			const call = "stake()";
			const value = ethers.utils.parseEther("1");
			const tx = await nftaa.connect(nftOwner).proxy(call, targetMock.address, {value: value});
			await expect(tx).to.emit(nftaa, "ProxyResponse");

			const stakedAmount = await targetMock.getStakedAmount();
			expect(stakedAmount).to.equal(value);
		});

	});

});
