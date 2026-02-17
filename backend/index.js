const express = require("express");
const { ethers } = require("ethers");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 3001;

app.use(cors());
app.use(express.json());

// 1. Configuración de Provider (Backend usa URL de RPC, no window.ethereum)
const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL); 
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
//const signer = provider.getSigner();
// 2. ABI mínima para consultar el contrato (debes incluir la función de precio)
const abi = [
  "function getRelativePrice(address token) external view returns (uint256)"
];

const contractAddress = "0xA7cDD3298e508127186077981Ef8688166030fE8";

app.get("/tokenPrice", async (req, res) => {
  const { addressOne, addressTwo } = req.query; // Recibir direcciones por query params

  try {
    const dexertContract = new ethers.Contract(contractAddress, abi, wallet);

    // Ejecución en paralelo para mayor velocidad
    const [priceOne, priceTwo] = await Promise.all([
      dexertContract.getRelativePrice(addressOne),
      dexertContract.getRelativePrice(addressTwo)
    ]);

    // Formatear (asumiendo 18 decimales, ajustar según token)
    const p1 = parseFloat(ethers.formatUnits(priceOne, 18));
    const p2 = parseFloat(ethers.formatUnits(priceTwo, 18));

    const usdPrices = {
      tokenOne: 1,
      tokenTwo: 1,
      ratio: 1.0
      //ratio: p1 / p2
    };

    return res.status(200).json(usdPrices);

  } catch (error) {
    console.error(error);
    res.status(200).json({ ratio: "1.0" });
  }
});

app.get("/approve/allowance", async (req, res) => {
    try {
        const { tokenAddress, walletAddress } = req.query;
        const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

        // Si es ETH nativo, el permiso es "infinito" por defecto (no aplica ERC20)
        if (tokenAddress === "0x0000000000000000000000000000000000000000") {
            return res.json({ allowance: ethers.MaxUint256.toString() });
        }

        const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
        const erc20Abi = ["function allowance(address owner, address spender) view returns (uint256)"];
        const contract = new ethers.Contract(tokenAddress, erc20Abi, wallet);

        const allowance = await contract.allowance(wallet, ROUTER_ADDRESS);
        
        res.json({ allowance: allowance.toString() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error consultando allowance" });
    }
});

app.get("/approve/transaction", async (req, res) => {
    try {
        const { tokenAddress, amount } = req.query;
        // Dirección del Router de Uniswap V2 en Sepolia
        const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

        // 1. Validar si es ETH nativo (No requiere aprobación)
        if (tokenAddress === "0x0000000000000000000000000000000000000000") {
            return res.json({ 
                needsApproval: false,
                message: "ETH nativo no requiere aprobación" 
            });
        }

        // 2. Crear la interfaz del contrato ERC20 (v6 usa ethers.Interface)
        const erc20Interface = new ethers.Interface([
            "function approve(address spender, uint256 amount) public returns (bool)"
        ]);

        // 3. Codificar la función 'approve'
        // Usamos MaxUint256 para evitar pedir permisos cada vez, o usa el 'amount' enviado
        const data = erc20Interface.encodeFunctionData("approve", [
            ROUTER_ADDRESS,
            ethers.MaxUint256 
        ]);

        // 4. Responder con los datos que el Frontend pasará a MetaMask
        res.json({
            to: tokenAddress,
            data: data,
            value: "0", // Las aprobaciones no cuestan ETH, solo Gas
            needsApproval: true
        });

    } catch (error) {
        console.error("Error en /approve/transaction:", error);
        res.status(500).json({ error: error.message });
    }
});

app.get("/swap", async (req, res) => {
    try {
        const { fromTokenAddress, toTokenAddress, amount, fromAddress } = req.query;
        const WETH = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9";
        const ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

        // 1. IDENTIFICAR EL TOKEN QUE NO ES WETH
        // Si el origen es WETH, pedimos el precio del destino.
        const tokenToQuery = fromTokenAddress.toLowerCase() === WETH.toLowerCase() 
            ? toTokenAddress 
            : fromTokenAddress;

        const priceContract = new ethers.Contract(
            "0xA7cDD3298e508127186077981Ef8688166030fE8",
            ["function getRelativePrice(address) view returns (uint256)"],
            provider
        );

        // 2. OBTENER PRECIO (con try/catch para que no explote el backend)
        let estimatedAmountOut = "0";
        try {
            const price = await priceContract.getRelativePrice(tokenToQuery);
            estimatedAmountOut = price.toString();
        } catch (e) {
            console.warn("Fallo al obtener precio, usando 0");
        }

        // 3. GENERAR DATA PARA EL SWAP (Uniswap V2)
        const routerInterface = new ethers.Interface([
            "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)"
        ]);

        const data = routerInterface.encodeFunctionData("swapExactTokensForTokens", [
            ethers.parseUnits(amount, 18),
            0,
            [fromTokenAddress, toTokenAddress],
            fromAddress,
            Math.floor(Date.now() / 1000) + 600
        ]);

        res.json({
            to: ROUTER,
            data: data,
            value: "0",
            toTokenAmount: estimatedAmountOut // Esto quita el NaN del frontend
        });

    } catch (error) {
        console.error("BACKEND ERROR:", error.message);
        res.status(500).json({ error: error.message });
    }
});
app.listen(port, () => {
  console.log(`🚀 Backend escuchando en http://localhost:${port}`);
});
