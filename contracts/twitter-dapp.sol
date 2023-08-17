// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.22 <0.9.0;

contract IPFSHashStorage {
    uint256 private index; // keep track of the current index
    mapping(uint256 => string) private ipfsHashes;
    uint256 public count;

    function setIPFSHash(string memory _ipfsHash) public {
        ipfsHashes[index] = _ipfsHash;
        index++; // increment the index after storing the IPFS hash
        count++;
    }
    
    function getIPFSHash(uint256 _index) public view returns (string memory) {
        return ipfsHashes[_index];
    }
}