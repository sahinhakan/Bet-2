// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract StakeV2 {
    
  IERC20 public rewardsToken;
  IERC20 public stakingToken;

  uint private le18 = 10 ** 18;
  uint public rewardRate = 1 * le18;
  uint public lastUpdateTime;
  uint public rewardPerTokenStored;

  mapping(address => uint) public userRewardPerTokenPaid;
  mapping(address => uint) public rewards;

  uint public _totalSupply;//private
  mapping(address => uint) public _balances;//private


  constructor(address _stakingToken, address _rewardsToken){
      stakingToken = IERC20(_stakingToken);
      rewardsToken = IERC20(_rewardsToken);
  }

  function rewardPerToken() public view returns (uint) {
      if(_totalSupply == 0){
          return 0;
      }
      return rewardPerTokenStored + (
          rewardRate * (block.timestamp - lastUpdateTime) * le18 / _totalSupply
      );
  }

  function earned(address account) public view returns (uint) {
      return (
          _balances[account] * (rewardPerToken() - userRewardPerTokenPaid[account]) / le18
      ) + rewards[account];
  }

  modifier updateReward(address account){
      rewardPerTokenStored = rewardPerToken();
      lastUpdateTime = block.timestamp;

      rewards[account] = earned(account);
      userRewardPerTokenPaid[account] = rewardPerTokenStored;
      _;
  }

  function stake(uint _amount) external updateReward(msg.sender){
      _totalSupply += _amount;
      _balances[msg.sender] += _amount;
      stakingToken.transferFrom(msg.sender, address(this), _amount);
  }

  function withdraw(uint _amount) external updateReward(msg.sender){
      _totalSupply -= _amount;
      _balances[msg.sender] -= _amount;
      stakingToken.transfer(msg.sender, _amount);
  }

  function getReward() external updateReward(msg.sender){
      uint reward = rewards[msg.sender];
      rewards[msg.sender] = 0;
      rewardsToken.transfer(msg.sender, reward);
  }
}