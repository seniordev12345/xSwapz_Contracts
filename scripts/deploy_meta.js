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

    const baseswap = new ethers.Contract("0x519dc12e1957B5C354c7936E0857994E1cf25248", swapAbi, deployer);
    const lpToken = (await baseswap.swapStorage()).lpToken;

    console.log("--------------deploy start----------------")

    const MATHUTIL = await ethers.getContractFactory('MathUtils');
    const mathutil = await MATHUTIL.deploy({ nonce: nonce++ });

    const METASWAPUTIL = await ethers.getContractFactory('MetaSwapUtils', {
        libraries: {
            MathUtils: mathutil.address,
        }
    });
    const metaswaputil = await METASWAPUTIL.deploy({ nonce: nonce++ });

    const SWAPUTIL = await ethers.getContractFactory('SwapUtils', {
        libraries: {
            MathUtils: mathutil.address,
        }
    });
    const swaputil = await SWAPUTIL.deploy({ nonce: nonce++ });

    const AmplificationUtils = await ethers.getContractFactory('AmplificationUtils');
    const amplificationutils = await AmplificationUtils.deploy({ nonce: nonce++ });
    const SWAP = await ethers.getContractFactory('MetaSwap', {
        libraries: {
            MetaSwapUtils: metaswaputil.address,
            SwapUtils: swaputil.address,
            AmplificationUtils: amplificationutils.address
        }
    });
    const swap = await SWAP.deploy({ nonce: nonce++ });
    await swap.deployed();

    var tx = await swap.metaInitialize(
        ["0x264Bb72837a02e73180451426923098125aB244D", lpToken], [18, 18],
        "test",
        "test",
        40,
        0,
        0,
        0,
        0,
        deployer.address,
        baseswap.address, { nonce: nonce++ });
    await tx.wait();

    // const swap = new ethers.Contract("0x8d2c4028F5CD2E9f709ce76dBE944acd5D605087", swapAbi, deployer);
    // const token1 = new ethers.Contract("0x3A5b6631aD2Bd2b82fd3C5c4007937F14fa809b9", IERC20, deployer);
    // const token2 = new ethers.Contract("0x0108A8cA2D2029AcF6266220855A59DdE281f720", IERC20, deployer);

    // var tx;
    // tx = await token1.approve(swap.address, largeAmount, { nonce: nonce++ });
    // await tx.wait();
    // console.log("approved-1");
    // tx = await token2.approve(swap.address, largeAmount, { nonce: nonce++ });
    // await tx.wait();
    // console.log("approved-2");
    // tx = await swap.addLiquidity([100000, 100000], 0, 9999999999);
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