/* global BigInt */
type bigInts = string | any[] | { [k: string]: any } | null | bigint

export const unstringifyBigInts = (o: bigInts): bigInts => {
    if (typeof o === 'string' && ((/^[0-9]+$/.test(o)) || (/^0x[0-9a-fA-F]+$/.test(o)))) {
        return BigInt(o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts);
    } else if (typeof o === 'object') {
        if (o) {
            const res: { [k: string]: bigInts } = {};
            const keys = Object.keys(o);
            keys.forEach((k) => {
                res[k] = unstringifyBigInts(o[k]);
            });
            return res;
        } else { return null; }
    } else { return o }
}
