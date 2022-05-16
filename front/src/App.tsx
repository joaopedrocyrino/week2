import React from 'react';
import merkleTree from './merkleTree';

import { InsertLeaf, Inclusion } from './app'

const App: React.FC = () => {
  const checkRoot = async () => {
    await merkleTree.insertLeaf(1)
    await merkleTree.insertLeaf(2)

    const node9 = (await merkleTree.hashes(9)).toString()
    const node13 = (await merkleTree.hashes(13)).toString()

    const isValid = await merkleTree.isValid({
      leaf: 1,
      path_elements: [2, node9, node13],
      path_index: [0, 0, 0]
    });

    console.log('is valid merk', isValid)
  }

  return (
    <div className="App">
      <InsertLeaf />
      <br />
      <hr />
      <Inclusion />
    </div>
  );
}

export default App;
