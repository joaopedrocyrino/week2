import React, { useState } from "react";
import merkleTree from '../merkleTree';

const InsertLeaf: React.FC = () => {
    const [leaf, setLeaf] = useState<number>(0)

    const insertLeaf = async () => {
        const index = Number((await merkleTree.index()).toString())
        if (index >= 8) {
            alert('tree is full :(')
            return
        }

        await merkleTree.insertLeaf(leaf)

        const leafInserted = (await merkleTree.hashes(index)).toString()

        alert(`Leaf inserted: ${leafInserted}`)
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center',
                width: '100%',
                height: 400
            }}
        >
            <input
                style={{
                    width: 300,
                    height: 60,
                    borderRadius: 20,
                    boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px',
                    border: 'none',
                    padding: '0 20px'
                }}
                type='number'
                value={leaf}
                onChange={({ target: { value } }) => setLeaf(Number(value))}
            />
            <button
                style={{
                    width: 300,
                    height: 60,
                    borderRadius: 20,
                    boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px',
                    border: 'none',
                    padding: '0 20px',
                    cursor: 'pointer'
                }}
                onClick={insertLeaf}
            >
                INSERT A LEAF
            </button>
        </div>
    )
}

export default InsertLeaf
