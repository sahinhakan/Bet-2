var Game = artifacts.require("./Game.sol");
var BetFactory = artifacts.require("./BetFactory");
var BetToken = artifacts.require("./BetToken");
var Stake = artifacts.require("./Stake");

module.exports = async function(deployer, network, accounts) {

  await deployer.deploy(BetToken);

  await deployer.deploy(Stake, accounts[0]);

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
