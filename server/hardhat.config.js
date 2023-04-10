require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
require("hardhat-gas-reporter");
const {INFURA_ID} = process.env;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    networks: {
        localhost: {
            url: "http://127.0.0.1:8545",
            chainId: 31337,
        },
        sepolia: {
            url: `https://sepolia.infura.io/v3/${INFURA_ID}`,
            chainId: 11155111,
        },
        goerli: {
            url: `https://goerli.infura.io/v3/${INFURA_ID}`,
            chainId: 5,
        },
    },
    solidity: {
        version: "0.8.19",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    gasReporter: {
        currency: 'CHF',
        gasPrice: 21
    }
};