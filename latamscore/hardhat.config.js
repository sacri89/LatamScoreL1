require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;

module.exports = {
  solidity: "0.8.24",

  networks: {
    latamscorel1: {
      url: RPC_URL,
      chainId: 422122,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }
};