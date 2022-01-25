const BetToken = artifacts.require("BetToken");
const Stake = artifacts.require("Stake");
const StakeV2 = artifacts.require("StakeV2");
const Game = artifacts.require("Game");
const BetFactory = artifacts.require("BetFactory");
let game, game0Address, game0Instance, betFactory, totalAmount, amount, betToken, stake, stakeV2;

const { 
    expectRevert, 
    time, 
    constants 
  } = require('@openzeppelin/test-helpers'); 

contract("Bet Token", accounts => {
    it("Deploy contract", async () => {
        betToken = await BetToken.deployed();
        assert.ok(betToken.address)
    });
    
    it("Total Supply Check", async () => {
        let totalSupply = await betToken.balanceOf(accounts[0]);
        assert.ok(totalSupply, (700000 * 10 ** 18).toString());
    });
});

contract("StakeV2", accounts => {
    it("Deploy contract", async () => {
        stakeV2 = await StakeV2.deployed();
        assert.ok(stakeV2.address);
    });

    it("Stake 10k BET with accounts[0]", async () => {
        await betToken.approve(stakeV2.address, web3.utils.toWei('10000'));
        await stakeV2.stake(web3.utils.toWei('10000'), {from: accounts[0]});
        let rewardPerTokenStored = await stakeV2.rewardPerTokenStored();
        let lastUpdateTime = await stakeV2.lastUpdateTime();
        let rewardsAccount0 = await stakeV2.rewards(accounts[0]);
        let userRewardPerTokenPaidAccount0 = await stakeV2.userRewardPerTokenPaid(accounts[0]);
        let totalSupply = await stakeV2._totalSupply();
        let stakeBalanceAccount0 = await stakeV2._balances(accounts[0]);
        let account0BetBalance = await betToken.balanceOf(accounts[0]);
        let stakeV2ContractBetBalance = await betToken.balanceOf(stakeV2.address);

        console.log(`rewardPerTokenStored : ${web3.utils.fromWei(rewardPerTokenStored)}`);
        console.log(`lastUpdateTime : ${lastUpdateTime}`);
        console.log(`rewardsAccount0 : ${web3.utils.fromWei(rewardsAccount0)}`);
        console.log(`userRewardPerTokenPaidAccount0 : ${web3.utils.fromWei(userRewardPerTokenPaidAccount0)}`);
        console.log(`totalSupply : ${web3.utils.fromWei(totalSupply)}`);
        console.log(`stakeBalanceAccount0 : ${web3.utils.fromWei(stakeBalanceAccount0)}`);
        console.log(`account0BetBalance : ${web3.utils.fromWei(account0BetBalance)}`);
        console.log(`stakeV2ContractBetBalance : ${web3.utils.fromWei(stakeV2ContractBetBalance)}`);
    });

    it("Stake 5k BET with accounts[1]", async () => {
        await time.increase(time.duration.years(1));

        await betToken.approve(stakeV2.address, web3.utils.toWei('5000'), { from: accounts[1] });
        await stakeV2.stake(web3.utils.toWei('5000'), {from: accounts[1]});
        let rewardPerTokenStored = await stakeV2.rewardPerTokenStored();
        let lastUpdateTime = await stakeV2.lastUpdateTime();
        let rewardsAccount0 = await stakeV2.rewards(accounts[0]);
        let rewardsAccount1 = await stakeV2.rewards(accounts[1]);
        let userRewardPerTokenPaidAccount0 = await stakeV2.userRewardPerTokenPaid(accounts[0]);
        let userRewardPerTokenPaidAccount1 = await stakeV2.userRewardPerTokenPaid(accounts[1]);
        let totalSupply = await stakeV2._totalSupply();
        let stakeBalanceAccount0 = await stakeV2._balances(accounts[0]);
        let stakeBalanceAccount1 = await stakeV2._balances(accounts[1]);
        let account0BetBalance = await betToken.balanceOf(accounts[0]);
        let account1BetBalance = await betToken.balanceOf(accounts[1]);
        let stakeV2ContractBetBalance = await betToken.balanceOf(stakeV2.address);

        console.log(`rewardPerTokenStored : ${web3.utils.fromWei(rewardPerTokenStored)}`);
        console.log(`lastUpdateTime : ${lastUpdateTime}`);
        console.log(`rewardsAccount0 : ${web3.utils.fromWei(rewardsAccount0)}`);
        console.log(`rewardsAccount1 : ${web3.utils.fromWei(rewardsAccount1)}`);
        console.log(`userRewardPerTokenPaidAccount0 : ${web3.utils.fromWei(userRewardPerTokenPaidAccount0)}`);
        console.log(`userRewardPerTokenPaidAccount1 : ${web3.utils.fromWei(userRewardPerTokenPaidAccount1)}`);
        console.log(`totalSupply : ${web3.utils.fromWei(totalSupply)}`);
        console.log(`stakeBalanceAccount0 : ${web3.utils.fromWei(stakeBalanceAccount0)}`);
        console.log(`stakeBalanceAccount1 : ${web3.utils.fromWei(stakeBalanceAccount1)}`);
        console.log(`account0BetBalance : ${web3.utils.fromWei(account0BetBalance)}`);
        console.log(`account1BetBalance : ${web3.utils.fromWei(account1BetBalance)}`);
        console.log(`stakeV2ContractBetBalance : ${web3.utils.fromWei(stakeV2ContractBetBalance)}`);
    });

    it("Stake 4k BET with accounts[2]", async () => {
        await time.increase(time.duration.years(1));

        await betToken.approve(stakeV2.address, web3.utils.toWei('4000'), { from: accounts[2] });
        await stakeV2.stake(web3.utils.toWei('4000'), {from: accounts[2]});
        let rewardPerTokenStored = await stakeV2.rewardPerTokenStored();
        let lastUpdateTime = await stakeV2.lastUpdateTime();
        let rewardsAccount0 = await stakeV2.rewards(accounts[0]);
        let rewardsAccount1 = await stakeV2.rewards(accounts[1]);
        let rewardsAccount2 = await stakeV2.rewards(accounts[2]);
        let userRewardPerTokenPaidAccount0 = await stakeV2.userRewardPerTokenPaid(accounts[0]);
        let userRewardPerTokenPaidAccount1 = await stakeV2.userRewardPerTokenPaid(accounts[1]);
        let userRewardPerTokenPaidAccount2 = await stakeV2.userRewardPerTokenPaid(accounts[2]);
        let totalSupply = await stakeV2._totalSupply();
        let stakeBalanceAccount0 = await stakeV2._balances(accounts[0]);
        let stakeBalanceAccount1 = await stakeV2._balances(accounts[1]);
        let stakeBalanceAccount2 = await stakeV2._balances(accounts[2]);
        let account0BetBalance = await betToken.balanceOf(accounts[0]);
        let account1BetBalance = await betToken.balanceOf(accounts[1]);
        let account2BetBalance = await betToken.balanceOf(accounts[2]);
        let stakeV2ContractBetBalance = await betToken.balanceOf(stakeV2.address);

        console.log(`rewardPerTokenStored : ${web3.utils.fromWei(rewardPerTokenStored)}`);
        console.log(`lastUpdateTime : ${lastUpdateTime}`);
        console.log(`rewardsAccount0 : ${web3.utils.fromWei(rewardsAccount0)}`);
        console.log(`rewardsAccount1 : ${web3.utils.fromWei(rewardsAccount1)}`);
        console.log(`rewardsAccount2 : ${web3.utils.fromWei(rewardsAccount2)}`);
        console.log(`userRewardPerTokenPaidAccount0 : ${web3.utils.fromWei(userRewardPerTokenPaidAccount0)}`);
        console.log(`userRewardPerTokenPaidAccount1 : ${web3.utils.fromWei(userRewardPerTokenPaidAccount1)}`);
        console.log(`userRewardPerTokenPaidAccount2 : ${web3.utils.fromWei(userRewardPerTokenPaidAccount2)}`);
        console.log(`totalSupply : ${web3.utils.fromWei(totalSupply)}`);
        console.log(`stakeBalanceAccount0 : ${web3.utils.fromWei(stakeBalanceAccount0)}`);
        console.log(`stakeBalanceAccount1 : ${web3.utils.fromWei(stakeBalanceAccount1)}`);
        console.log(`stakeBalanceAccount2 : ${web3.utils.fromWei(stakeBalanceAccount2)}`);
        console.log(`account0BetBalance : ${web3.utils.fromWei(account0BetBalance)}`);
        console.log(`account1BetBalance : ${web3.utils.fromWei(account1BetBalance)}`);
        console.log(`account2BetBalance : ${web3.utils.fromWei(account2BetBalance)}`);
        console.log(`stakeV2ContractBetBalance : ${web3.utils.fromWei(stakeV2ContractBetBalance)}`);
    });

    it("Stake 5k BET with accounts[0]", async () => {
        await time.increase(time.duration.years(1));

        await betToken.approve(stakeV2.address, web3.utils.toWei('5000'), { from: accounts[0] });
        await stakeV2.stake(web3.utils.toWei('5000'), {from: accounts[0]});
        let rewardPerTokenStored = await stakeV2.rewardPerTokenStored();
        let lastUpdateTime = await stakeV2.lastUpdateTime();
        let rewardsAccount0 = await stakeV2.rewards(accounts[0]);
        let rewardsAccount1 = await stakeV2.rewards(accounts[1]);
        let rewardsAccount2 = await stakeV2.rewards(accounts[2]);
        let userRewardPerTokenPaidAccount0 = await stakeV2.userRewardPerTokenPaid(accounts[0]);
        let userRewardPerTokenPaidAccount1 = await stakeV2.userRewardPerTokenPaid(accounts[1]);
        let userRewardPerTokenPaidAccount2 = await stakeV2.userRewardPerTokenPaid(accounts[2]);
        let totalSupply = await stakeV2._totalSupply();
        let stakeBalanceAccount0 = await stakeV2._balances(accounts[0]);
        let stakeBalanceAccount1 = await stakeV2._balances(accounts[1]);
        let stakeBalanceAccount2 = await stakeV2._balances(accounts[2]);
        let account0BetBalance = await betToken.balanceOf(accounts[0]);
        let account1BetBalance = await betToken.balanceOf(accounts[1]);
        let account2BetBalance = await betToken.balanceOf(accounts[2]);
        let stakeV2ContractBetBalance = await betToken.balanceOf(stakeV2.address);

        console.log(`rewardPerTokenStored : ${web3.utils.fromWei(rewardPerTokenStored)}`);
        console.log(`lastUpdateTime : ${lastUpdateTime}`);
        console.log(`rewardsAccount0 : ${web3.utils.fromWei(rewardsAccount0)}`);
        console.log(`rewardsAccount1 : ${web3.utils.fromWei(rewardsAccount1)}`);
        console.log(`rewardsAccount2 : ${web3.utils.fromWei(rewardsAccount2)}`);
        console.log(`userRewardPerTokenPaidAccount0 : ${web3.utils.fromWei(userRewardPerTokenPaidAccount0)}`);
        console.log(`userRewardPerTokenPaidAccount1 : ${web3.utils.fromWei(userRewardPerTokenPaidAccount1)}`);
        console.log(`userRewardPerTokenPaidAccount2 : ${web3.utils.fromWei(userRewardPerTokenPaidAccount2)}`);
        console.log(`totalSupply : ${web3.utils.fromWei(totalSupply)}`);
        console.log(`stakeBalanceAccount0 : ${web3.utils.fromWei(stakeBalanceAccount0)}`);
        console.log(`stakeBalanceAccount1 : ${web3.utils.fromWei(stakeBalanceAccount1)}`);
        console.log(`stakeBalanceAccount2 : ${web3.utils.fromWei(stakeBalanceAccount2)}`);
        console.log(`account0BetBalance : ${web3.utils.fromWei(account0BetBalance)}`);
        console.log(`account1BetBalance : ${web3.utils.fromWei(account1BetBalance)}`);
        console.log(`account2BetBalance : ${web3.utils.fromWei(account2BetBalance)}`);
        console.log(`stakeV2ContractBetBalance : ${web3.utils.fromWei(stakeV2ContractBetBalance)}`);
    });

    
})




