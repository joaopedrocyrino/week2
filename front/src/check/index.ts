// @ts-ignore
import generateWitness from './generate_witness'
import Contract from '../contract'
import artifact from '../artifacts/Check.json'
import address from '../address.json'

class Check extends Contract {
    constructor() {
        super(
            'checkRoot_final.zkey',
            generateWitness,
            address.check,
            artifact.abi
        )
    }

    async isValid(input: { [k: string]: any }): Promise<boolean> {
        const { err, hash } = await this.verify(input, this.contract.verifyProof)

        if (err) {
            console.error('ERROR! INVALID PROOF')
            return false
        }

        console.log('THE ROOT: ', hash)

        return true
    }
}

export default new Check()
