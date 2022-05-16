pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/mux1.circom";

template CheckRoot(n) { // compute the root of a MerkleTree of n Levels
    var numLeaves = 2 ** n;

    signal input leaves[numLeaves];
    signal output root;

    component hashes[numLeaves - 1];

    var numFirstHashes = numLeaves / 2;
    var i;

    for (i=0; i < numFirstHashes; i++) {
        hashes[i] = Poseidon(2);
        hashes[i].inputs[0] <== leaves[i * 2];
        hashes[i].inputs[1] <== leaves[i * 2 + 1];
    }

    var k = 0;
    for (i=numFirstHashes; i < numLeaves - 1; i++) {
        hashes[i] = Poseidon(2);
        hashes[i].inputs[0] <== hashes[k * 2].out;
        hashes[i].inputs[1] <== hashes[k * 2 + 1].out;
        k++;
    }

    root <== hashes[numLeaves - 2].out;
}

template MerkleTreeInclusionProof(n) {
    signal input leaf;
    signal input path_elements[n];
    signal input path_index[n]; // path index are 0's and 1's indicating whether the current element is on the left or right
    signal output root; // note that this is an OUTPUT signal

    component hashers[n];
    component mux[n];

    signal hashs[n + 1];
    hashs[0] <== leaf;

    for (var i = 0; i < n; i++) {
        hashers[i] = Poseidon(2);
        mux[i] = MultiMux1(2);

        mux[i].c[0][1] <== path_elements[i];
        mux[i].c[1][0] <== path_elements[i];

        mux[i].c[0][0] <== hashs[i];
        mux[i].c[1][1] <== hashs[i];

        mux[i].s <== path_index[i];

        hashers[i].inputs[0] <== mux[i].out[0];
        hashers[i].inputs[1] <== mux[i].out[1];

        hashs[i + 1] <== hashers[i].out;
    }

    root <== hashs[n];
}