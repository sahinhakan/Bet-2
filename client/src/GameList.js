import React, {Component} from "react";
import ListGroup from 'react-bootstrap/ListGroup';
import Game from './Game';
import getWeb3 from "./getWeb3";

import GameContract from "./contracts/Game.json";
import BetFactoryContract from "./contracts/BetFactory.json";
import BetTokenContract from "./contracts/BetToken.json";

class GameList extends Component{
    state = { storageValue: 0, web3: null, accounts: null, contract: null, contracts: null, games: null };
  
    componentDidMount = async () => {
        try {
          // Get network provider and web3 instance.
          const web3 = await getWeb3();
    
          // Use web3 to get the user's accounts.
          const accounts = await web3.eth.getAccounts();
    
          // Get the contract instance.
          const networkId = await web3.eth.net.getId();
          let gameContractDeployedNetwork = GameContract.networks[networkId];
          const gameInstance = new web3.eth.Contract(
            GameContract.abi,
            gameContractDeployedNetwork && gameContractDeployedNetwork.address,
          );
    
          let betFactoryContractDeployedNetwork = BetFactoryContract.networks[networkId];
          const betFactoryInstance = new web3.eth.Contract(
            BetFactoryContract.abi,
            betFactoryContractDeployedNetwork && betFactoryContractDeployedNetwork.address
          )
    
          // Set web3, accounts, and contract to the state, and then proceed with an
          // example of interacting with the contract's methods.
          this.setState({ 
            web3,
            accounts,
            contracts: {
              betFactory : betFactoryInstance
            },
            contract : gameInstance,
            games: []
          }, this.runExample);
        } catch (error) {
          // Catch any errors for any of the above operations.
          alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
          );
          console.error(error);
        }
    };
    
    runExample = async () => {
        const { accounts, contract, web3, games } = this.state;
        const betFactory = this.state.contracts.betFactory;
        let gamesLength = await betFactory.methods.gamesCount().call();
    
        for(var i = 0; i < gamesLength; i++){
          let oGame = {};
          let address = await betFactory.methods.games(i).call();
          let instance = new web3.eth.Contract(GameContract.abi, address);
          oGame.address = address;
          oGame.instance = instance;
          oGame.name1 = await instance.methods.name1().call();
          oGame.name2 = await instance.methods.name2().call();
          oGame.totalBet1 = web3.utils.fromWei(await instance.methods.totalBet1().call(), "ether");
          oGame.totalBet0 = web3.utils.fromWei(await instance.methods.totalBet0().call(), "ether");
          oGame.totalBet2 = web3.utils.fromWei(await instance.methods.totalBet2().call(), "ether");
          oGame.rate1 = (await instance.methods.rate1().call()) / 1000;
          oGame.rate0 = (await instance.methods.rate0().call()) / 1000;
          oGame.rate2 = (await instance.methods.rate2().call()) / 1000;
          games.push(oGame);
        }
        this.setState({ games });
    
    
    
        // Stores a given value, 5 by default.
        //await contract.methods.set(5).send({ from: accounts[0] });
        /* let totalBet1 = web3.utils.fromWei(await contract.methods.totalBet1().call(), "ether");
        let totalBet0 = web3.utils.fromWei(await contract.methods.totalBet0().call(), "ether");
        let totalBet2 = web3.utils.fromWei(await contract.methods.totalBet2().call(), "ether");
        let rate1 = (await contract.methods.rate1().call()) / 1000;
        let rate0 = (await contract.methods.rate0().call()) / 1000;
        let rate2 = (await contract.methods.rate2().call()) / 1000;
        let name1 = await contract.methods.name1().call();
        let name2 = await contract.methods.name2().call(); */
    
        //this.setState({ totalBet1, totalBet0, totalBet2, rate1, rate0, rate2, name1, name2, games });
    };
    
    bet = async (_betSelection, data) => {
        const { accounts, contract, web3, games } = this.state;
    
        await data.instance.methods.bet(_betSelection).send({
          from: accounts[0],
          value: web3.utils.toWei("0.1", "ether")
        })
    
        const gameIndex = games.findIndex( item => {
          return item.address == data.address;
        })
    
        games[gameIndex].totalBet1 = web3.utils.fromWei(await data.instance.methods.totalBet1().call(), "ether");
        games[gameIndex].totalBet0 = web3.utils.fromWei(await data.instance.methods.totalBet0().call(), "ether");
        games[gameIndex].totalBet2 = web3.utils.fromWei(await data.instance.methods.totalBet2().call(), "ether");
        games[gameIndex].rate1 = (await data.instance.methods.rate1().call()) / 1000;
        games[gameIndex].rate0 = (await data.instance.methods.rate0().call()) / 1000;
        games[gameIndex].rate2 = (await data.instance.methods.rate2().call()) / 1000;
    
        this.setState({ games });
    }

    render(){
        let games = this.state.games;
        if (!this.state.web3) {
          return <div>Loading Web3, accounts, and contract...</div>;
        }

        return (
            <ListGroup>
            {
                /* games.map((item, i) => {
                    return <Game key={i} name1={item.name1} name2={item.name2}/>
                }) */

                games.map((item, i) => {
                    return <Game key={i} data={item} bet={this.bet}/>
                })
            }
            </ListGroup>
        )
    }
}

export default GameList;