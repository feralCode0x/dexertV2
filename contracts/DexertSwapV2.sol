// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {IUniversalRouter} from "https://github.com/Uniswap/universal-router/blob/main/contracts/interfaces/IUniversalRouter.sol";
import {Commands} from "@uniswap/universal-router/contracts/libraries/Commands.sol";
import{IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
//import {IUniswapV3Factory } from './interfaces/IUniswapV3Factory.sol';
import { IPermit2 } from "https://github.com/Uniswap/permit2/blob/main/src/interfaces/IPermit2.sol";

interface IUniswapV2Factory {
    function getPair(address tokenA, address tokenB) external view returns (address pair);
}

interface IUniswapV2Pair {
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
    function token0() external view returns (address);
}

contract DexertSwapV2 {

    address public owner;
   // ISwapRouter02 public immutable swapRouter02;
    IUniversalRouter public immutable router;
    IPermit2 public immutable permit2;
    IERC20 public immutable weth;

    event Error(string);
   
    constructor(){
        owner = msg.sender;
        router = IUniversalRouter(0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD);//0x198EF79F1F515F02dFE9e3115eD9fC07183f02fC;
        permit2 = IPermit2(0x000000000022D473030F116dDEE9F6B43aC78BA3);
        weth = IERC20(0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14);// mainnet: 0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14 // alt mainnet: 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D  //base weth 0x4200000000000000000000000000000000000006
        permit2.approve(address(weth), address(router), type(uint160).max, type(uint48).max);
        weth.approve(address(permit2),type(uint256).max);
        //swapRouter02 = ISwapRouter02(0x2626664c2603336E57B271c5C0b26F421741e481);
    }

   function callExecute(address token) payable public {
    require(msg.value > 0, "No ETH sent");
    
    // 0x0b = WRAP_ETH, 0x08 = V2_SWAP_EXACT_IN
    bytes memory commands = abi.encodePacked(
        bytes1(uint8(Commands.WRAP_ETH)),
        bytes1(uint8(Commands.V2_SWAP_EXACT_IN))
    );

    bytes[] memory inputs = new bytes[](2);
    
    // Input 0: WRAP_ETH
    // El receptor debe ser ROUTER (usando la constante 0x0000000000000000000000000000000000000001)
    // o simplemente enviarlo al contrato del router para que lo use.
    inputs[0] = abi.encode(
        address(0x0000000000000000000000000000000000000002), // Constante para "ADDRESS_THIS" del Router
        msg.value
    );

    // Input 1: V2_SWAP_EXACT_IN
    address[] memory path = new address[](2);
    path[0] = address(weth);
    path[1] = token;

    inputs[1] = abi.encode(
        msg.sender,     // Recibe el token resultante
        msg.value,      // Cantidad de WETH de entrada
        0,              // AmountOutMinimum (Slippage) - ¡Cuidado en producción!
        path,           // Ruta
        false           // payerIsUser = false (porque el WETH ya está en el Router tras el WRAP)
    );

    // Ejecución - Importante enviar el msg.value
    router.execute{value: msg.value}(commands, inputs, block.timestamp);
   }

    // Direcciones oficiales para Ethereum Mainnet (ajustar según red)
    address public constant V2_FACTORY = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;

    /**
     * @dev Devuelve el precio de un token en términos de WETH usando Uniswap V2
     * El resultado está escalado a 18 decimales.
     */
    function getRelativePrice(address token) public view returns (uint256) {
        if (token == address(weth)) return 1e18; // 1 WETH = 1 WETH

        address pair = IUniswapV2Factory(V2_FACTORY).getPair(token, address(weth));
        require(pair != address(0), "Pool no existe");

        IUniswapV2Pair pool = IUniswapV2Pair(pair);
        (uint112 reserve0, uint112 reserve1, ) = pool.getReserves();
        
        // Determinar cuál es el token0 para calcular el ratio correcto
        (uint256 resToken, uint256 resWeth) = token == pool.token0() 
            ? (uint256(reserve0), uint256(reserve1)) 
            : (uint256(reserve1), uint256(reserve0));

        // Precio = (Reserva WETH / Reserva Token) * 1e18
        // Usamos precisión de 18 decimales
        return (resWeth * 1e18) / resToken;
    }

    receive() external payable {} 
    //function to allow contract to recieve ether
    fallback() external payable{}
}