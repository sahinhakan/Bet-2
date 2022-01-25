// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract StakeV3 {
    IERC20 public stakeToken;
    uint private constant le18 = 10 ** 18;
    uint public constant year = 365 days;
    uint public totalBalance;

    struct Staker{
        uint balance;
        uint timestamp;
        uint unclaimedRewards;
    }

    mapping(address => Staker) public stakers;

    event Staked(address indexed user, uint256 amount, uint256 timestamp);
    event Withdrawed(address indexed user, uint256 amount, uint256 timestamp);

    constructor(address _stakeToken){
        stakeToken = IERC20(_stakeToken);
    }

    function stake(uint _amount) external{
        Staker storage staker = stakers[msg.sender];
        totalBalance += _amount;
        //calculate previous rewards
        updateUnclaimedRewards();
        staker.balance += _amount;
        staker.timestamp = block.timestamp;
        stakeToken.transferFrom(msg.sender, address(this), _amount);
        emit Staked(msg.sender, _amount, block.timestamp);
    }

    function updateUnclaimedRewards() internal returns(uint _reward){
        Staker storage staker = stakers[msg.sender];
        if(staker.balance > 0){
            uint duration = block.timestamp - staker.timestamp;
            _reward = staker.balance * duration / year;
            staker.unclaimedRewards += _reward;
        }
    }

    function withdraw(uint _amount) external{
        Staker storage staker = stakers[msg.sender];
        require(staker.balance >= _amount, 'Insufficient Stake Balance !');
        totalBalance -= _amount;
        updateUnclaimedRewards();
        staker.balance -= _amount;
        uint _totalAmount = staker.unclaimedRewards + _amount;
        stakeToken.transfer(msg.sender, _totalAmount);
        staker.unclaimedRewards = 0;
        staker.timestamp = block.timestamp;
        emit Withdrawed(msg.sender, _amount, block.timestamp);
    }

    function getRewards() external view returns(uint _reward){
        Staker storage staker = stakers[msg.sender];
        if(staker.balance > 0){
            uint duration = block.timestamp - staker.timestamp;
            _reward = staker.balance * duration / year;
            _reward += staker.unclaimedRewards;
            return _reward;
        }
    }

    
}