import React, { useState } from "react";
import merkleTree from '../merkleTree';

const Inclusion: React.FC = () => {
    const [leaf, setLeaf] = useState<number>(0)
    const [pathElements, setPathElements] = useState<number[]>([0, 0, 0])
    const [pathIndex, setPathIndex] = useState<number[]>([0, 0, 0])

    const inclusion = async () => {
        const isValid = await merkleTree.isValid({
            leaf,
            path_elements: pathElements,
            path_index: pathIndex
        });

        alert(`Is valid: ${isValid}`)
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center',
                width: '100%',
                height: 600
            }}
        >
            Leaf
            <input
                style={{
                    width: 600,
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
            Path elements
            <div
                style={{
                    display: 'flex',
                    height: 100,
                    width: 600,
                    alignItems: 'center',
                    justifyContent: "space-between"
                }}
            >
                <input
                    style={{
                        width: 140,
                        height: 60,
                        borderRadius: 20,
                        boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px',
                        border: 'none',
                        padding: '0 20px'
                    }}
                    type='number'
                    value={pathElements[0]}
                    onChange={({ target: { value } }) => setPathElements([Number(value), pathElements[1], pathElements[2]])}
                />
                <input
                    style={{
                        width: 140,
                        height: 60,
                        borderRadius: 20,
                        boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px',
                        border: 'none',
                        padding: '0 20px'
                    }}
                    type='number'
                    value={pathElements[1]}
                    onChange={({ target: { value } }) => setPathElements([pathElements[0], Number(value), pathElements[2]])}
                />
                <input
                    style={{
                        width: 140,
                        height: 60,
                        borderRadius: 20,
                        boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px',
                        border: 'none',
                        padding: '0 20px'
                    }}
                    type='number'
                    value={pathElements[2]}
                    onChange={({ target: { value } }) => setPathElements([pathElements[0], pathElements[1], Number(value)])}
                />
            </div>
            Path index
            <div
                style={{
                    display: 'flex',
                    height: 100,
                    width: 600,
                    alignItems: 'center',
                    justifyContent: "space-between"
                }}
            >
                <input
                    style={{
                        width: 140,
                        height: 60,
                        borderRadius: 20,
                        boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px',
                        border: 'none',
                        padding: '0 20px'
                    }}
                    type='number'
                    value={pathIndex[0]}
                    onChange={({ target: { value } }) => setPathIndex([Number(value), pathIndex[1], pathIndex[2]])}
                />
                <input
                    style={{
                        width: 140,
                        height: 60,
                        borderRadius: 20,
                        boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px',
                        border: 'none',
                        padding: '0 20px'
                    }}
                    type='number'
                    value={pathIndex[1]}
                    onChange={({ target: { value } }) => setPathIndex([pathIndex[0], Number(value), pathIndex[2]])}
                />
                <input
                    style={{
                        width: 140,
                        height: 60,
                        borderRadius: 20,
                        boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px',
                        border: 'none',
                        padding: '0 20px'
                    }}
                    type='number'
                    value={pathIndex[2]}
                    onChange={({ target: { value } }) => setPathIndex([pathIndex[0], pathIndex[1], Number(value)])}
                />
            </div>
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
                onClick={inclusion}
            >
                Check inclusion
            </button>
        </div>
    )
}

export default Inclusion
