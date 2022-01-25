const BetToken = artifacts.require("BetToken");
const StakeV3 = artifacts.require("StakeV3");
let totalBalance, amount, betToken, stakeV3;

const { 
    expectRevert, 
    time, 
    constants 
  } = require('@openzeppelin/test-helpers');

const truffleAssert = require('truffle-assertions');

contract("StakeV3", accounts => {
    it("Deploy contract", async () => {
        stakeV3 = await StakeV3.deployed();
        betToken = await BetToken.deployed();
        assert.ok(stakeV3.address);
    });

    it("Stake 5k BET with accounts[0]", async () => {
        let balance = await betToken.balanceOf(accounts[0]);
        let stakeV3Balance = await betToken.balanceOf(stakeV3.address);
        console.log(`Account[0] Balance : ${web3.utils.fromWei(balance)}`);
        console.log(`V3Contract Balance : ${web3.utils.fromWei(stakeV3Balance)}`);
        //await time.increase(time.duration.years(1));

        await betToken.approve(stakeV3.address, web3.utils.toWei('5000'), { from: accounts[0] });
        await stakeV3.stake(web3.utils.toWei('5000'), {from: accounts[0]});
        let oStaker = await stakeV3.stakers(accounts[0]);
        totalBalance = await stakeV3.totalBalance();
        console.log('Balance          : ', web3.utils.fromWei(oStaker.balance));
        console.log('Timestamp        : ', oStaker.timestamp.toString());
        console.log('UnclaimedRewards : ', web3.utils.fromWei(oStaker.unclaimedRewards));
        console.log(`totalBalance     :  ${web3.utils.fromWei(totalBalance)}`);

    });

    it("1 year later Stake 10k BET with accounts[0]", async () => {
        //await time.increase(time.duration.years(1));
        await time.increase(time.duration.hours(1));

        let rewards = await stakeV3.getRewards();
        console.log(`Rewards before stake : ${web3.utils.fromWei(rewards)}`);
        await betToken.approve(stakeV3.address, web3.utils.toWei('10000'), { from: accounts[0] });
        const tx2 = await stakeV3.stake(web3.utils.toWei('10000'), {from: accounts[0]});
        //console.log(tx2)
        truffleAssert.eventEmitted(tx2, 'Staked', (event) => {
            //console.log(event);
            assert.equal(event.amount, web3.utils.toWei('10000'), "Stake amount is not correct")
            assert.equal(event.user, accounts[0], "Stake Address is not correct")
            return true;
        }, "Staked event should have triggered");
        
        let oStaker = await stakeV3.stakers(accounts[0]);
        totalBalance = await stakeV3.totalBalance();
        console.log('Balance          : ', web3.utils.fromWei(oStaker.balance));
        console.log('Timestamp        : ', oStaker.timestamp.toString());
        console.log('UnclaimedRewards : ', web3.utils.fromWei(oStaker.unclaimedRewards));
        console.log(`totalBalance     :  ${web3.utils.fromWei(totalBalance)}`);

    });

    it("1 year later Withdraw 15k BET with accounts[0]", async () => {
        //await time.increase(time.duration.years(1));
        await time.increase(time.duration.hours(1));

        let rewards = await stakeV3.getRewards();
        console.log(`Rewards before stake : ${web3.utils.fromWei(rewards)}`);
        //await betToken.approve(stakeV3.address, web3.utils.toWei('10000'), { from: accounts[0] });
        const tx3 = await stakeV3.withdraw(web3.utils.toWei('15000'), {from: accounts[0]});
        //console.log(tx3)
        truffleAssert.eventEmitted(tx3, 'Withdrawed', (event) => {
            //console.log(event);
            assert.equal(event.amount, web3.utils.toWei('15000'), "Withdraw amount is not correct")
            assert.equal(event.user, accounts[0], "Withdraw Address is not correct")
            return true;
        }, "Withdrawed event should have triggered");

        let oStaker = await stakeV3.stakers(accounts[0]);
        totalBalance = await stakeV3.totalBalance();
        console.log('Balance          : ', web3.utils.fromWei(oStaker.balance));
        console.log('Timestamp        : ', oStaker.timestamp.toString());
        console.log('UnclaimedRewards : ', web3.utils.fromWei(oStaker.unclaimedRewards));
        console.log(`totalBalance     :  ${web3.utils.fromWei(totalBalance)}`);
        let balance = await betToken.balanceOf(accounts[0]);
        let stakeV3Balance = await betToken.balanceOf(stakeV3.address);
        console.log(`Account[0] Balance : ${web3.utils.fromWei(balance)}`);
        console.log(`V3Contract Balance : ${web3.utils.fromWei(stakeV3Balance)}`);

    });

    
})




