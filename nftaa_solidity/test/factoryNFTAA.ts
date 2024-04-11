import {ethers,} from "hardhat";
import {Contract} from "ethers";
import {expect} from "chai";

describe("FactoryNFTAA", function () {
	let factoryNFTAA: Contract;

	beforeEach(async function () {
		const FactoryNFTAA = await ethers.getContractFactory("FactoryNFTAA");
		factoryNFTAA = await FactoryNFTAA.deploy();
		// Wait for the contract to be deployed
		await factoryNFTAA.deployed();
	});

	describe("Flow test", function () {

		it("Should mint a new NFTAA contract and emit a NewNFTAA event", async function () {
			const description = "test";

			// Mint a new NFTAA contract
			await factoryNFTAA.safeMint(description);

			// Get the address of the NFTAA contract that was created
			const [event] = await factoryNFTAA.queryFilter("NewNFTAA", undefined);
			const nftaaAddress = event.args?.data;

			// Verify that the NFTAA contract was created
			const NFTAA = await ethers.getContractFactory("NFTAA");
			const nftaa = NFTAA.attach(nftaaAddress);

			expect(await nftaa.getBindedNFTId()).to.equal(0);
			expect(await nftaa.getDescription()).to.equal(description);
		});

	})

	describe("Validations", function () {

		it("Should revert when minting with an empty description", async function () {
			await expect(factoryNFTAA.safeMint("")).to.be.revertedWith("Description cannot be empty");
		});

		it("Should revert when minting with a too long description", async function () {
			const tooLongDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget lectus pharetra, blandit nisi ac, bibendum nunc. Sed pharetra sagittis tellus, eu interdum nibh congue quis. Duis tempus massa et orci auctor, non varius ex faucibus. Nullam at nunc in dolor malesuada imperdiet vel vel nisl. Aliquam auctor nisi non sapien convallis, sed interdum turpis sagittis. Donec sodales lorem vel quam vestibulum, sit amet ullamcorper erat viverra. Aenean finibus metus vitae lectus vehicula, eget maximus libero sagittis. Integer euismod, massa eu venenatis tempus, orci mauris vehicula lacus, in placerat nibh tellus ac dui.";
			await expect(factoryNFTAA.safeMint(tooLongDescription)).to.be.revertedWith("Description is too long");
		});

	});

});
