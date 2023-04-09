const hre = require("hardhat");

async function main() {

    const RealEstate = await hre.ethers.getContractFactory("RealEstate");
    const realEstate = await RealEstate.deploy();

    await realEstate.deployed();

    console.log(
        `RealEstate deployed to ${realEstate.address}`
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});