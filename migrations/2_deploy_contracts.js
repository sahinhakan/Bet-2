var Game = artifacts.require("./Game.sol");
var BetFactory = artifacts.require("./BetFactory");
var BetToken = artifacts.require("./BetToken");
var Stake = artifacts.require("./Stake");
var StakeV2 = artifacts.require("./StakeV2");
var StakeV3 = artifacts.require("./StakeV3");

module.exports = async function(deployer, network, accounts) {

  await deployer.deploy(BetToken);
  const betToken = await BetToken.deployed();
  await betToken.transfer(accounts[1], web3.utils.toWei('100000'), {from : accounts[0] });
  await betToken.transfer(accounts[2], web3.utils.toWei('100000'), {from : accounts[0] });

  await deployer.deploy(Stake, accounts[0]);

  //param1: stakingTokenAddress, param2: rewardsTokenAddress
  const stakeV2 = await deployer.deploy(StakeV2, betToken.address, betToken.address);
  await betToken.transfer(stakeV2.address, web3.utils.toWei('100000'));
  //Account[1] ve Account[2]'de 100k token var.
  //StakeV2 kontratında 100k BET token var. ödüller bu kontrat üzerinden dağıtılacak.

  await deployer.deploy(StakeV3, betToken.address);
  const stakeV3 = await StakeV3.deployed();
  await betToken.transfer(stakeV3.address, web3.utils.toWei('100000'));
  //account[0]'da 600k BET token kaldı. 


  await deployer.deploy(BetFactory);

  //İleride bu kontrattan kopya yaratmak için deploy ediyorum bunu sadece. Takım isimlerini constructor'a göndermesem daha iyi olacak gibi.
  await deployer.deploy(Game, "asd", "fgh");

  //devamındaki kodlara gerek yok. Test amaçlı yazılanları buraya yazmamak gerekiyor. 
  //Sadece kontratı deploy ettiğimiz gibi çalıştırmak istediğimiz komutlar varsa onları yazalım

  //const betFactory = await BetFactory.deployed();
  //await betFactory.createGame("Beşiktaş", "Fenerbahçe");

  //const name1 = await betFactory.getName1();
  //console.log(name1);

  //const game0Address = await betFactory.games(0);
  //console.table(game0Address);

  //const game0Instance = await Game.at(game0Address);
  //const _name1 = await game0Instance.name1();
  //console.log(_name1);
  
  /* const game = await Game.deployed();
  let name1 = await game.name1();
  let name2 = await game.name2();

  console.log(name1)
  console.log(name2) */
};
