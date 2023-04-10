require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
require("hardhat-gas-reporter");
const {INFURA_ID} = process.env;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    networks: {
        localhost: {
            url: "http://localhost:8545/",
        },
        sepolia: {
            url: `https://sepolia.infura.io/v3/${INFURA_ID}`,
            chainId: 11155111,
            accounts: ["0xea6b287ee4fc4dd266739ef3bf6fca8e6b04bf5c40ed78d61839c28a14653fac"]
        },
        goerli: {
            url: `https://goerli.infura.io/v3/${INFURA_ID}`,
            chainId: 5,
        },
    },
    solidity: {
        version: "0.8.15",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    gasReporter: {
        enabled: true,
        currency: 'CHF',
        gasPrice: 21
    }
};