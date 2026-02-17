require("dotenv").config();
const { ethers } = require("ethers");

async function addLiquidity() {
    // 1. Verificación manual de la URL (para debug)
    const rpcUrl = process.env.REACT_APP_RPC_URL;
    if (!rpcUrl) {
        console.error("❌ ERROR: La URL del RPC no está definida en el .env");
        return;
    }

    // 2. Configuración robusta del proveedor en v6
    // Añadimos 'staticNetwork' para evitar que intente detectar la red y falle por timeout
    const provider = new ethers.JsonRpcProvider(rpcUrl, undefined, {
        staticNetwork: true 
    });;
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const tokenAddress = "0x09c2f12B9E2B0d8622795739652f2970b62CC94e";
    const routerAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    
    const erc20Abi = ["function approve(address spender, uint256 amount) public returns (bool)"];
    const routerAbi = [
        "function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)"
    ];

    const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, wallet);
    const routerContract = new ethers.Contract(routerAddress, routerAbi, wallet);

    // CANTIDADES: 100,000 tokens y 0.1 ETH para dar estabilidad al precio
    const amountToken = ethers.parseUnits("100000", 18); 
    const amountETH = ethers.parseUnits("0.1", 18);    

    try {
        console.log("1. Aprobando Router para gastar tokens...");
        const approveTx = await tokenContract.approve(routerAddress, amountToken);
        console.log("Esperando confirmación de aprobación...");
        await approveTx.wait();
        console.log("Aprobación exitosa.");

        console.log("2. Añadiendo liquidez a la pool...");
        const deadline = Math.floor(Date.now() / 1000) + (60 * 20); 

        const tx = await routerContract.addLiquidityETH(
            tokenAddress,
            amountToken,
            0, 
            0, 
            wallet.address,
            deadline,
            { 
                value: amountETH, 
                gasLimit: 3000000 // Subimos el gas para estar seguros
            }
        );

        console.log("Transacción enviada. Hash:", tx.hash);
        const receipt = await tx.wait();
        console.log("✅ Liquidez añadida con éxito! Bloque:", receipt.blockNumber);

    } catch (error) {
        console.error("❌ Error en el proceso:");
        console.error(error.message);
    }
}

addLiquidity();
