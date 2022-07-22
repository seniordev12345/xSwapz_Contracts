const { ethers, waffle } = require("hardhat");
const swapAbi = require("../artifacts/contracts/Swap.sol/Swap.json").abi;
const IERC20 = require("../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json").abi;

async function main() {

    const [deployer] = await ethers.getSigners();

    const largeAmount = "1000000000000000000000000000000000000000";

    const provider = waffle.provider;

    console.log("Deploying contracts with the account: " + deployer.address);

    var nonce = await provider.getTransactionCount(deployer.address);
    console.log(nonce);
    var startTIme = new Date().getTime();

    console.log("--------------deploy start----------------")

    const MATHUTIL = await ethers.getContractFactory('MathUtils');
    const mathutil = await MATHUTIL.deploy({ nonce: nonce++ });
    console.log("--------------mathutil deployed----------------")

    const SWAPUTIL = await ethers.getContractFactory('SwapUtils', {
        libraries: {
            MathUtils: mathutil.address,
        }
    });
    const swaputil = await SWAPUTIL.deploy({ nonce: nonce++ });
    console.log("--------------swaputil deployed----------------")

    const SWAP = await ethers.getContractFactory('contracts/Swap.sol:Swap', {
        libraries: {
            SwapUtils: swaputil.address,
        }
    });
    const swap = await SWAP.deploy(
        ["0xcBA912F1388e6fA7Ae8dD6f387073d7801Fb9DE9", "0x051d4AB215ec7Af84A5f7592C21d76129bECaA4d", "0x334F16dd7ede5F552a40342D045BB54aEFDdD6DB"], [18, 6, 18], //usdc, usdt, busd 
        "test",
        "test",
        40,
        0,
        0,
        0,
        0,
        deployer.address, { nonce: nonce++ }
    );
    await swap.deployed();

    // const swap = new ethers.Contract("0x4c86ba408Ade1dF2397a7Fb9d56b0D50ce8E1502", swapAbi, deployer);
    // const token1 = new ethers.Contract("0xcBA912F1388e6fA7Ae8dD6f387073d7801Fb9DE9", IERC20, deployer);
    // const token2 = new ethers.Contract("0x051d4AB215ec7Af84A5f7592C21d76129bECaA4d", IERC20, deployer);
    // const token3 = new ethers.Contract("0x334F16dd7ede5F552a40342D045BB54aEFDdD6DB", IERC20, deployer);

    var tx;
    // tx = await token1.approve(swap.address, largeAmount, { nonce: nonce++ });
    // await tx.wait();
    // console.log("approved-1");
    // tx = await token2.approve(swap.address, largeAmount, { nonce: nonce++ });
    // await tx.wait();
    // console.log("approved-2");
    // tx = await token3.approve(swap.address, largeAmount, { nonce: nonce++ });
    // await tx.wait();
    // console.log("approved-3");
    // tx = await swap.addLiquidity(["1000000", "1000000", "1000000000000000000"], 0, 9999999999);
    // await tx.wait();
    // console.log("added liquidity");

    // tx = await swap.calculateSwap(1, 0, 10000);
    // console.log(tx);

    // tx = await swap.addLiquidity([100000, 500], 0, 9999999999);
    // await tx.wait();

    // tx = await swap.calculateSwap(1, 0, 10000);
    // console.log(tx);

    // tx = await swap.swap(1, 0, 1000000, 0, 999999999999);
    // await tx.wait();
    // console.log("swap successful");

    var end = new Date().getTime();

    console.log("deploy ended ", (Number(end) - startTIme) / 1000);

    console.log("swap: ", swap.address);
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
    })