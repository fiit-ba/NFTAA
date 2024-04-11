import {ethers, network} from "hardhat";
import {Signer, Contract} from "ethers";
import {expect} from "chai";

describe("Staking", () => {
	let accounts: Signer[];
	let stakingMock: Contract;
	let staker: Signer;

	beforeEach(async () => {
		accounts = await ethers.getSigners();
		staker = accounts[0];
		const StakingMock2 = await ethers.getContractFactory("StakingMock2");
		stakingMock = await StakingMock2.deploy();
		await stakingMock.deployed();
	});

	it("Should allow staking", async () => {
		const amountToStake = ethers.utils.parseEther("1");

		// Staker stakes some ETH
		await stakingMock.connect(staker).stake({value: amountToStake});

		// Check that the staker is set correctly
		const stakerAddress = await stakingMock.getStaker();
		expect(stakerAddress).to.equal(await staker.getAddress());

		// Check that the staked amount is set correctly
		const stakedAmount = await stakingMock.getStakedAmount();
		expect(stakedAmount).to.equal(amountToStake);
	});

	it("Should allow adding to a stake", async () => {
		const initialAmountToStake = ethers.utils.parseEther("1");
		const additionalAmountToStake = ethers.utils.parseEther("2");

		// Staker stakes some ETH
		await stakingMock.connect(staker).stake({value: initialAmountToStake});

		// Staker adds to their stake
		await stakingMock.connect(staker).addStake({value: additionalAmountToStake});

		// Check that the staked amount is updated correctly
		const stakedAmount = await stakingMock.getStakedAmount();
		expect(stakedAmount).to.equal(initialAmountToStake.add(additionalAmountToStake));
	});

	it("Should allow unstaking after unlock time", async () => {
		const amountToStake = ethers.utils.parseEther("1");
		const unlockTime = await stakingMock.getUnlockTime();

		// Staker stakes some ETH
		await stakingMock.connect(staker).stake({value: amountToStake});

		// Increase block time to unlock time
		await network.provider.send("evm_setNextBlockTimestamp", [unlockTime.toNumber()]);
		await network.provider.send("evm_mine")

		// Staker unstakes their ETH
		await stakingMock.connect(staker).unstake();

		// Check that the staked amount is 0 after unstaking
		const stakedAmount = await stakingMock.getStakedAmount();
		expect(stakedAmount).to.equal(0);
	});

	it("Should not allow unstaking before unlock time", async () => {
		const amountToStake = ethers.utils.parseEther("1");
		const unlockTime = await stakingMock.getUnlockTime();

		// Staker stakes some ETH
		await stakingMock.connect(staker).stake({value: amountToStake});

		// Try to unstake before unlock time
		await expect(stakingMock.connect(staker).unstake()).to.be.revertedWith("Stake is locked and cannot be unstaked yet.");

		// Check that the staked amount is not changed
		const stakedAmount = await stakingMock.getStakedAmount();
		expect(stakedAmount).to.equal(amountToStake);
	});
});
