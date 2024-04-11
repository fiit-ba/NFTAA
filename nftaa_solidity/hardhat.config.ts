import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";


const config: HardhatUserConfig = {
  solidity: "0.8.18",
};

export default config;

require("@nomiclabs/hardhat-etherscan");
require('@openzeppelin/hardhat-upgrades');
