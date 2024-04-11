// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTAA {
    address private _binded_nft_adders;
    uint256 private _binded_nft_id;
    string private _note;

    event ProxyResponse(bool success, bytes data);

    constructor(address binded_nft_adders, uint256 binded_nft_id, string memory note) {
        _binded_nft_adders = binded_nft_adders;
        _binded_nft_id = binded_nft_id;
        _note = note;
    }

    receive() external payable {
        // Code to handle received funds
    }

    modifier onlyNFTOwner() {
        require(
            msg.sender == ERC721(_binded_nft_adders).ownerOf(_binded_nft_id),
            "Caller is not the owner of the NFT"
        );
        _;
    }

    function proxy(string memory call, address finalContract) public payable {

        require(
            msg.sender == ERC721(_binded_nft_adders).ownerOf(_binded_nft_id),
            "Caller is not the owner of the NFT"
        );

        (bool success, bytes memory resultData) = finalContract.call{value : msg.value}(
            abi.encodeWithSignature(call)
        );

        require(
            success,
            "Proxy call failed"
        );

        emit ProxyResponse(success, resultData);
    }

    // FOR TESTING
    function getBindedNFTAddress() public view returns (address) {
        return _binded_nft_adders;
    }

    function getBindedNFTId() public view returns (uint256) {
        return _binded_nft_id;
    }

    function getDescription() public view returns (string memory) {
        return _note;
    }

}
