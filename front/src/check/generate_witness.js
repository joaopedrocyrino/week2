
import { builder as wc } from "./witness_calculator.js";

export default async function generateWitness(input) {
	const response = await fetch('checkRoot.wasm');
	const buffer = await response.arrayBuffer();
	let buff;

	await wc(buffer).then(async witnessCalculator => {
		buff = await witnessCalculator.calculateWTNSBin(input, 0);
	});
	return buff;
}