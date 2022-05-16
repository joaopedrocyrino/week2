/* global BigInt */
// @ts-ignore
import { groth16 } from 'snarkjs'
import { ethers } from 'ethers';
import { unstringifyBigInts } from './utils';

export default class Contract {
    protected readonly contract: ethers.Contract

    constructor(
        private readonly zkey: string,
        private readonly genWitness: Function,
        address: string,
        abi: ethers.ContractInterface
    ) {
        const { ethereum } = window as { [k: string]: any }

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        this.contract = new ethers.Contract(address, abi, signer);

        console.log("Connect to Contract:", this.contract);
    }

    protected async verify(input: { [k: string]: any }, verifyProof: Function): Promise<{ err?: boolean; hash?: string }> {
        try {
            const witness = await this.genWitness(input)

            const { proof, publicSignals } = await groth16.prove(this.zkey, witness)

            const editedPublicSignals = unstringifyBigInts(publicSignals);
            const editedProof = unstringifyBigInts(proof);
            const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);

            const argv = calldata.replace(/["[\]\s]/g, "").split(',').map((x: any) => BigInt(x).toString());

            const a = [argv[0], argv[1]];
            const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
            const c = [argv[6], argv[7]];
            const Input = argv.slice(8);

            const txn = await verifyProof(a, b, c, Input)

            if (txn) { await txn.wait() }
            
            console.log("transaction: ", txn.hash);

            return { hash: txn.hash }
        } catch { return { err: true } }
    }
}
