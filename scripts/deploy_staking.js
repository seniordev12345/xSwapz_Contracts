const { ethers, waffle } = require("hardhat");
const swapz = require("../artifacts/contracts/SwapzToken.sol/SwapzToken.json").abi;

async function main() {

    const [deployer] = await ethers.getSigners();

    const largeAmount = "1000000000000000000000000000000000000000";

    const provider = waffle.provider;

    console.log("Deploying contracts with the account: " + deployer.address);

    var nonce = await provider.getTransactionCount(deployer.address);
    console.log(nonce);

    var tx;

    // const swapztoken = new ethers.Contract("0x4ab99FD9856f24Ea6dc421eeaae6370Cfd3Ae89e", swapz, deployer);

    // tx = await swapztoken.mint(deployer.address, "0xfffffffffffffffffffff", { nonce: nonce++ });
    // await tx.wait();
    const SwapzToken = await ethers.getContractFactory('SwapzToken');
    const swapztoken = await SwapzToken.deploy({ nonce: nonce++ });

    var mintRole = await swapztoken.MINTER_ROLE();

    const xSwapz = await ethers.getContractFactory('xSwapz');
    const xswapz = await xSwapz.deploy(swapztoken.address, { nonce: nonce++ });

    const MasterMind = await ethers.getContractFactory('MasterMind');
    const mastermind = await MasterMind.deploy(
        swapztoken.address,
        deployer.address,
        "100000000",
        "2956000",
        "10000", { nonce: nonce++ }
    );

    tx = await swapztoken.grantRole(mintRole, "0x779041E8eB3D4eA729955d03B672E1CEC2Eb3e2B", { nonce: nonce++ });
    await tx.wait();

    tx = await mastermind.add(100, "0xA7B0aA1D2D2AAE9a7d95D8e2A11f59D5C5f3a8E1", true, { nonce: nonce++ });
    await tx.wait(); // 3pools lp
    console.log("added-1");

    tx = await mastermind.add(100, xswapz.address, true, { nonce: nonce++ });
    await tx.wait(); // xswapz
    console.log("added-2");

    // tx = await mastermind.add(100, "0x264Bb72837a02e73180451426923098125aB244D", true, { nonce: nonce++ }); // lp
    // await tx.wait(); // swapz-busd lp
    // console.log("added-3");

    var startTIme = new Date().getTime();
    var end = new Date().getTime();

    console.log("deploy ended ", (Number(end) - startTIme) / 1000);
    // console.log("swapz: ", swapztoken.address);
    // console.log("xswapz: ", xswapz.address);
    // console.log("master: ", mastermind.address);
}
main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
    })