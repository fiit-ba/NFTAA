// SPDX-License-Identifier: MIT


pragma solidity ^0.8.0;

contract StakingMock2 {

    address private _staker;
    uint256 private _stakedAmount;
    uint256 private _unlockTime;

    constructor() {
        _unlockTime = block.timestamp + 5;
    }

    function stake() public payable {
        require(msg.value > 0, "Staked amount must be greater than 0.");
        require(_stakedAmount == 0, "Staker has already staked.");
        _staker = msg.sender;
        _stakedAmount = msg.value;
    }

    function unstake() public {
        require(msg.sender == _staker, "Only the staker can unstake.");
        require(block.timestamp >= _unlockTime, "Stake is locked and cannot be unstaked yet.");
        uint256 amountToReturn = _stakedAmount;
        _stakedAmount = 0;
        payable(_staker).transfer(amountToReturn);
    }

    function addStake() public payable {
        require(msg.value > 0, "Staked amount must be greater than 0.");
        require(msg.sender == _staker, "Only the staker can add stake.");
        _stakedAmount += msg.value;
    }

    function getStaker() public view returns (address) {
        return _staker;
    }

    function getStakedAmount() public view returns (uint256) {
        return _stakedAmount;
    }

    function getUnlockTime() public view returns (uint256) {
        return _unlockTime;
    }
}
