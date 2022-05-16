#!/bin/bash

npx hardhat run --network localhost scripts/deployMerkle.js
npx hardhat run --network localhost scripts/deployCheck.js