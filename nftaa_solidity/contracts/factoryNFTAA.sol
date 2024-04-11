// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./NFTAA.sol";

contract FactoryNFTAA is ERC721, ERC721URIStorage, Ownable {

    event NewNFTAA(address data);

    // storage
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // constructor
    constructor() ERC721("NFTAA", "TAA") {

    }

    // Implement the receive function to handle incoming Ether
    receive() external payable {

    }

    function safeMint(string memory description) public {

        // Validate input
        require(bytes(description).length > 0, "Description cannot be empty");
        require(bytes(description).length <= 100, "Description is too long");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, description);

        address addr_of_new_contract = _spawnNFTAA(tokenId, "test");

        emit NewNFTAA(addr_of_new_contract);
    }

    /// The following functions are overrides required by Solidity.

    function _baseURI() internal pure override returns (string memory) {
        return "Description: ";
    }

    function _burn(uint256 tokenId) internal
    override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view
    virtual override(ERC721, ERC721URIStorage)
    returns (string memory) {
        return ERC721URIStorage.tokenURI(tokenId);
    }

    /// MY CUSTOM FUNCTIONS

    function _spawnNFTAA(uint256 _binded_nft, string memory _note) private returns (address nftaa) {

        nftaa = address(
            new NFTAA(address(this), _binded_nft, _note)
        );

        return nftaa;
    }

    // HELPERS

    function asDerivate(bytes32 salt, uint arg) public view returns (address predictedAddress) {

        // https://docs.soliditylang.org/en/latest/control-structures.html#salted-contract-creations-create2

        predictedAddress = address(
            uint160(
                uint(
                    keccak256(
                        abi.encodePacked(
                            bytes1(0xff),
                            address(this),
                            salt,
                            keccak256(abi.encodePacked(
                                type(NFTAA).creationCode,
                                abi.encode(arg)
                            )
                            )
                        )
                    )
                )
            )
        );

        return predictedAddress;
    }
}
