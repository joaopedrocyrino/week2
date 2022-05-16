// @ts-ignore
import generateWitness from './generate_witness'
import Contract from '../contract'
import artifact from '../artifacts/MerkleTree.json'
import address from '../address.json'

class MerkleTree extends Contract {
    constructor() {
        super(
            'circuit_final.zkey',
            generateWitness,
            address.merkle,
            artifact.abi
        )
    }

    async insertLeaf(leaf: number): Promise<boolean> {
        try {
            await this.contract.insertLeaf(leaf)
            return true
        } catch { return false }
    }

    async hashes(i: number) {
        return await this.contract.hashes(i)
    }

    async isValid(input: { [k: string]: any }): Promise<boolean> {
        const { err, hash } = await this.verify(input, this.contract.verify)

        if (err) {
            console.error('ERROR! INVALID PROOF')
            return false
        }

        console.log('THE HASH OF MERKLE TREE AFTER INSERTION: ', hash)

        return true
    }

    async index() {
        return this.contract.index()
    }
}

export default new MerkleTree()
