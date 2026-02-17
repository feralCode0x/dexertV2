const { ethers } = require("ethers");
require("dotenv").config();

async function test() {
    const p = new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
    const block = await p.getBlockNumber();
    console.log("Bloque actual:", block);
}
test();
