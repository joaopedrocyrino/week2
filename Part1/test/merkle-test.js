const { poseidonContract } = require('circomlibjs')
const { expect } = require('chai')
const { ethers } = require('hardhat')
const { groth16 } = require('snarkjs')

function unstringifyBigInts(o) {
    if (typeof o == 'string' && /^[0-9]+$/.test(o)) {
        return BigInt(o)
    } else if (typeof o == 'string' && /^0x[0-9a-fA-F]+$/.test(o)) {
        return BigInt(o)
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts)
    } else if (typeof o == 'object') {
        if (o === null) return null
        const res = {}
        const keys = Object.keys(o)
        keys.forEach((k) => {
            res[k] = unstringifyBigInts(o[k])
        })
        return res
    } else {
        return o
    }
}

const grothProof = async (Input, wasm, zkey) => {
    const { proof, publicSignals } = await groth16.fullProve(Input, wasm, zkey)

    const editedPublicSignals = unstringifyBigInts(publicSignals)
    const editedProof = unstringifyBigInts(proof)
    const calldata = await groth16.exportSolidityCallData(
        editedProof,
        editedPublicSignals,
    )

    const argv = calldata
        .replace(/["[\]\s]/g, '')
        .split(',')
        .map((x) => BigInt(x).toString())

    const a = [argv[0], argv[1]]
    const b = [
        [argv[2], argv[3]],
        [argv[4], argv[5]],
    ]
    const c = [argv[6], argv[7]]
    const input = argv.slice(8)

    return { a, b, c, input }
}

describe('MerkleTree', function () {
    let merkleTree, check

    const inclusionProof = async (leaf, path_elements, path_index) => {
        const Input = {
            leaf,
            path_elements,
            path_index,
        }

        const { a, b, c, input } = await grothProof(
            Input,
            'circuits/MerkleTree/circuit_js/circuit.wasm',
            'circuits/MerkleTree/circuit_final.zkey',
        )

        return await merkleTree.verify(a, b, c, input)
    }

    beforeEach(async function () {
        const PoseidonT3 = await ethers.getContractFactory(
            poseidonContract.generateABI(2),
            poseidonContract.createCode(2),
        )
        const poseidonT3 = await PoseidonT3.deploy()
        await poseidonT3.deployed()

        const MerkleTree = await ethers.getContractFactory('MerkleTree', {
            libraries: {
                PoseidonT3: poseidonT3.address,
            },
        })
        merkleTree = await MerkleTree.deploy()
        await merkleTree.deployed()

        check = await (await ethers.getContractFactory('Check')).deploy()
        await check.deployed()
    })

    it('Insert two new leaves and verify the first and second leaf in an inclusion proof', async function () {
        await merkleTree.insertLeaf(1)
        await merkleTree.insertLeaf(2)

        const node9 = (await merkleTree.hashes(9)).toString()
        const node13 = (await merkleTree.hashes(13)).toString()

        expect(await inclusionProof(1, [2, node9, node13], [0, 0, 0])).to.be.true

        expect(await inclusionProof(2, [1, node9, node13], [1, 0, 0])).to.be.true
    })

    it('check root', async () => {
        const leaves = [1, 2, 3, 4, 5, 6, 7, 8]

        const { a, b, c, input } = await grothProof(
            { leaves },
            'circuits/CheckRoot/checkRoot_js/checkRoot.wasm',
            'circuits/CheckRoot/checkRoot_final.zkey',
        )

        const isValid = await check.verifyProof(a, b, c, input)

        expect(isValid).to.be.true
    })
})