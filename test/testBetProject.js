const BetToken = artifacts.require("BetToken");
const Stake = artifacts.require("Stake");
const StakeV2 = artifacts.require("StakeV2");
const Game = artifacts.require("Game");
const BetFactory = artifacts.require("BetFactory");
let game, game0Address, game0Instance, betFactory, totalAmount, amount, betToken, stake, stakeV2;
const team1 = "Beşiktaş", team2 = "Fenerbahçe";

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

contract("Stake", accounts => {
    it("Deploy contract", async () => {
        stake = await Stake.deployed();
        assert.ok(stake.address)
    });
    
    it("Deposit", async () => {
        let depositAmount = web3.utils.toWei('100000');
        await betToken.approve(stake.address, depositAmount);
        await stake.deposit(betToken.address, depositAmount);
        let account0BetBalance = betToken.balanceOf(accounts[0]);
        let stakeBetBalance = betToken.balanceOf(stake.address);
        assert.ok(account0BetBalance, web3.utils.toWei('600000'));
        assert.ok(stakeBetBalance,    web3.utils.toWei('100000'));
    });
    
    it("Withdraw", async () => {
        let depositAmount = web3.utils.toWei('100000');

        await expectRevert(
            stake.withdraw(betToken.address, depositAmount, {from: accounts[1]}),
            'only owner'
        );

        await expectRevert(
            stake.withdraw(betToken.address, depositAmount),
            'too early'
        );

        await time.increase(time.duration.years(1));

        await stake.withdraw(betToken.address, depositAmount);
        let account0BetBalance = betToken.balanceOf(accounts[0]);
        let stakeBetBalance = betToken.balanceOf(stake.address);
        assert.ok(account0BetBalance,  web3.utils.toWei('700000'));
        assert.ok(stakeBetBalance, web3.utils.toWei('0'));
    });
});

contract("BetFactory", accounts => {
    it("Deploy contract", async () => {
        betFactory = await BetFactory.deployed();
        //console.log(`BetFactory contract address: ${betFactory.address}`)
        assert.ok(betFactory.address)
    });

    it("Create game", async () => {
        await betFactory.createGame(team1, team2);
        game0Address = await betFactory.games(0);
        //console.log(`Game[0] contract address: ${game0Address}`)
        assert.ok(game0Address)

        game0Instance = await Game.at(game0Address);
        let factoryAddress = await game0Instance.factory();
        let team1Name = await game0Instance.name1();
        let team2Name = await game0Instance.name2();
        //console.log(`Team1: ${team1Name}, Team2: ${team2Name}`);
        assert.equal(factoryAddress, betFactory.address)
        assert.equal(team1Name, team1)
        assert.equal(team2Name, team2)
    });

    it("bet to 1", async () => {
        amount = web3.utils.toWei("1", "ether")
        await game0Instance.bet(1, {
            from: accounts[1],
            value: amount
        });
        totalAmount = parseInt(amount);
        let totalBet1_balance = await game0Instance.totalBet1();
        assert.equal(amount, totalBet1_balance);
        let totalBet_balance = await game0Instance.totalBet();
        assert.equal(totalAmount.toString(), totalBet_balance)
    });

    it("bet to 0", async () => {
        amount = web3.utils.toWei("2", "ether")
        await game0Instance.bet(0, {
            from: accounts[2],
            value: amount
        })
        totalAmount += parseInt(amount);
        let totalBet0_balance = await game0Instance.totalBet0();
        assert.equal(amount, totalBet0_balance)
        totalBet_balance = await game0Instance.totalBet();
        assert.equal(totalAmount.toString(), totalBet_balance)
    });

    it("bet to 2", async () => {
        amount = web3.utils.toWei("3", "ether")
        await game0Instance.bet(2, {
            from: accounts[3],
            value: amount
        })
        totalAmount += parseInt(amount);
        let totalBet2_balance = await game0Instance.totalBet2();
        assert.equal(amount, totalBet2_balance)
        totalBet_balance = await game0Instance.totalBet();
        assert.equal(totalAmount.toString(), totalBet_balance)
    });

    it("check rates", async () => {
        let rate1, rate2, rate0;
        rate1 = (await game0Instance.rate1()) / 1000 ;
        rate2 = (await game0Instance.rate2()) / 1000 ;
        rate0 = (await game0Instance.rate0()) / 1000 ;

        assert.equal(rate1, 6)
        assert.equal(rate0, 3)
        assert.equal(rate2, 2)
        //console.log(`Oranlar: Beşiktaş:${rate1}, Beraberlik:${rate0}, Fenerbahçe:${rate2}`);
    });

    //
    it("select winner & distribute rewards & check balances", async () => {
        /* console.log(`Accounts[0]                  : ${accounts[0]}`)
        console.log(`BetFactory contract address  : ${betFactory.address}`)
        let betFactoryContractOwner = await betFactory.owner()
        console.log(`Betfactory contract owner    : ${betFactoryContractOwner}`)
        let game0InstanceOwner = await game0Instance.factory();
        console.log(`Game contract instance owner : ${game0InstanceOwner}`) */

        let account1Balance = await web3.eth.getBalance(accounts[1]);
        let account2Balance = await web3.eth.getBalance(accounts[2]);
        let account3Balance = await web3.eth.getBalance(accounts[3]);
        /* console.log(`Account1Balance: ${account1Balance}`);
        console.log(`Account2Balance: ${account2Balance}`);
        console.log(`Account3Balance: ${account3Balance}`); */
        let account1Bet1Amount = await game0Instance.addressToAmountBet1(accounts[1]);
        let account2Bet1Amount = await game0Instance.addressToAmountBet1(accounts[2]);
        let account3Bet1Amount = await game0Instance.addressToAmountBet1(accounts[3]);
        /* console.log(`Account1Bet1Amount: ${account1Bet1Amount}`);
        console.log(`Account2Bet1Amount: ${account2Bet1Amount}`);
        console.log(`Account3Bet1Amount: ${account3Bet1Amount}`); */
        rate1 = await game0Instance.rate1();
        /* console.log(`Rate1: ${rate1}`) */
        let account1Reward = account1Bet1Amount * rate1 / 1000;
        let account2Reward = account2Bet1Amount * rate1 / 1000;
        let account3Reward = account3Bet1Amount * rate1 / 1000;
        /* console.log(`Account1Reward: ${account1Reward}`);
        console.log(`Account2Reward: ${account2Reward}`);
        console.log(`Account3Reward: ${account3Reward}`); */
        //select winner and distribute rewards
        await betFactory.selectWinner(game0Address, 1);
        let newAccount1Balance = await web3.eth.getBalance(accounts[1]);
        let newAccount2Balance = await web3.eth.getBalance(accounts[2]);
        let newAccount3Balance = await web3.eth.getBalance(accounts[3]);
        /* console.log(`newAccount1Balance: ${newAccount1Balance}`);
        console.log(`newAccount2Balance: ${newAccount2Balance}`);
        console.log(`newAccount3Balance: ${newAccount3Balance}`); */
        assert.equal(parseInt(account1Balance) + parseInt(account1Reward), newAccount1Balance)
        assert.equal(parseInt(account2Balance) + parseInt(account2Reward), newAccount2Balance)
        assert.equal(parseInt(account3Balance) + parseInt(account3Reward), newAccount3Balance)

    });
});

/* contract("Game", (accounts) => {

        
    it("deploy contract", async () => {
        //deployed a constructor parametreleri verebiliyorum.
        //.new ile aynı kontrattan bir tane daha instance yaratabiliyorum.
        //let game = await Game.new("Beşiktaş", "Fenerbahçe");
        game = await Game.deployed("asd", "Fenerbahçe");
        const name1 = await game.name1();
        const name2 = await game.name2();
        assert.equal(name1, "Beşiktaş", "Evsahibi takım Beşiktaş olmalı");
        assert.equal(name2, "Fenerbahçe", "Deplasman takım Fenerbahçe olmalı");

        // Set value of 89
        //await simpleStorageInstance.set(89, { from: accounts[0] });

        // Get stored value
        //const storedData = await simpleStorageInstance.get.call();

        //assert.equal(storedData, 89, "The value 89 was not stored.");
    });

    it("bet to 1", async () => {
        amount = web3.utils.toWei("1", "ether")
        await game.bet(1, {
            from: accounts[1],
            value: amount
        });
        totalAmount = parseInt(amount);
        let totalBet1_balance = await game.totalBet1();
        assert.equal(amount, totalBet1_balance);
        let totalBet_balance = await game.totalBet();
        assert.equal(totalAmount.toString(), totalBet_balance)
    });

    it("bet to 0", async () => {
        amount = web3.utils.toWei("2", "ether")
        await game.bet(0, {
            from: accounts[2],
            value: amount
        })
        totalAmount += parseInt(amount);
        let totalBet0_balance = await game.totalBet0();
        assert.equal(amount, totalBet0_balance)
        totalBet_balance = await game.totalBet();
        assert.equal(totalAmount.toString(), totalBet_balance)
    });

    it("bet to 2", async () => {
        amount = web3.utils.toWei("3", "ether")
        await game.bet(2, {
            from: accounts[3],
            value: amount
        })
        totalAmount += parseInt(amount);
        let totalBet2_balance = await game.totalBet2();
        assert.equal(amount, totalBet2_balance)
        totalBet_balance = await game.totalBet();
        assert.equal(totalAmount.toString(), totalBet_balance)
    });

    it("check rates", async () => {
        let rate1, rate2, rate0;
        rate1 = (await game.rate1()) / 1000 ;
        rate2 = (await game.rate2()) / 1000 ;
        rate0 = (await game.rate0()) / 1000 ;

        console.log(`Oranlar: Beşiktaş:${rate1}, Beraberlik:${rate0}, Fenerbahçe:${rate2}`);
        assert.equal(rate1, 6)
        assert.equal(rate0, 3)
        assert.equal(rate2, 2)
    });





}); */
