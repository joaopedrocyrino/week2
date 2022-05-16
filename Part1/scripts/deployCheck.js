const { ethers } = require("hardhat");
const { poseidonContract } = require('circomlibjs')

const main = async () => {
    const checkRoot = await (await ethers.getContractFactory('Check')).deploy()
    await checkRoot.deployed()

    console.log('Check root deployed to: ', checkRoot.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })