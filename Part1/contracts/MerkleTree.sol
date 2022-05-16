//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {PoseidonT3} from "./Poseidon.sol"; //an existing library to perform Poseidon hash on solidity
import "./Verifier.sol"; //inherits with the MerkleTreeInclusionProof verifier contract

contract MerkleTree is Verifier {
    uint8 private levels = 3;
    uint256 private n = 2**levels;
    uint256 private numHashes = 2 * n - 1;

    uint256[] public hashes; // the Merkle tree in flattened array form
    uint256 public index = 0; // the current index of the first unfilled leaf
    uint256 public root; // the current Merkle root

    constructor() {
        hashes = new uint256[](numHashes);

        for (uint256 i = 0; i < numHashes; i++) {
            hashes.push(0);
        }

        root = 0;
    }

    function insertLeaf(uint256 hashedLeaf) public {
        require(index < n, "Merkle tree is full");

        hashes[index] = hashedLeaf;
        uint256 leftIndex = index % 2 == 0 ? index : index - 1;

        for (uint256 i = 0; i < levels; i++) {
            hashes[leftIndex / 2 + n] = PoseidonT3.poseidon(
                [hashes[leftIndex], hashes[leftIndex + 1]]
            );
            leftIndex = leftIndex / 2 + n;
        }

        root = hashes[numHashes - 1];
        index++;
    }

    function verify(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[1] memory input
    ) public view returns (bool) {
        bool isProofValid = this.verifyProof(a, b, c, input);

        // uint256 root = this.verifyProofCheck(a, b, c, input);

        return isProofValid && input[0] == root;
    }
}
