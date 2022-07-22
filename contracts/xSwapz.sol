// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

// This contract handles swapping to and from xSWZ, Swapz's staking token.
contract xSwapz is ERC20("xSwapz", "xSWZ"){
    using SafeMath for uint256;
    IERC20 public swapz;

    // Define the Swapz token 
    constructor(IERC20 _swapz) public {
        swapz = _swapz;
    }

    // Enter the bar. Pay some Swapzs. Earn some shares.
    // Locks Swapz and mints xSwap
    function enter(uint256 _amount) public {
        // Gets the amount of Swapz locked in the contract
        uint256 totalSwapz = swapz.balanceOf(address(this));
        // Gets the amount of xSwapz in existence
        uint256 totalShares = totalSupply();
        // If no xSwapz exists, mint it 1:1 to the amount put in
        if (totalShares == 0 || totalSwapz == 0) {
            _mint(msg.sender, _amount);
        } 
        // Calculate and mint the amount of xSwapz the Swapz is worth. The ratio will change overtime, as xSwapz is burned/minted and Swapz deposited + gained from fees / withdrawn.
        else {
            uint256 what = _amount.mul(totalShares).div(totalSwapz);
            _mint(msg.sender, what);
        }
        // Lock the Swapz in the contract
        swapz.transferFrom(msg.sender, address(this), _amount);
    }

    // Leave the bar. Claim back your SWAPZs.
    // Unlocks the staked + gained Swapz and burns xSwapz
    function leave(uint256 _share) public {
        // Gets the amount of xSwapz in existence
        uint256 totalShares = totalSupply();
        // Calculates the amount of Swapz the xSwapz is worth
        uint256 what = _share.mul(swapz.balanceOf(address(this))).div(totalShares);
        _burn(msg.sender, _share);
        swapz.transfer(msg.sender, what);
    }
}
