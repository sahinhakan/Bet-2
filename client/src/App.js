import React, { Component } from "react";
import logo from './logo.svg';

import GameContract from "./contracts/Game.json";
import BetFactoryContract from "./contracts/BetFactory.json";
import BetTokenContract from "./contracts/BetToken.json";
import getWeb3 from "./getWeb3";

import './App.css';

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = GameContract.networks[networkId];
      const instance = new web3.eth.Contract(
        GameContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract, web3 } = this.state;

    // Stores a given value, 5 by default.
    //await contract.methods.set(5).send({ from: accounts[0] });
    let totalBet1 = web3.utils.fromWei(await contract.methods.totalBet1().call(), "ether");
    let totalBet0 = web3.utils.fromWei(await contract.methods.totalBet0().call(), "ether");
    let totalBet2 = web3.utils.fromWei(await contract.methods.totalBet2().call(), "ether");
    let rate1 = (await contract.methods.rate1().call()) / 1000;
    let rate0 = (await contract.methods.rate0().call()) / 1000;
    let rate2 = (await contract.methods.rate2().call()) / 1000;
    let name1 = await contract.methods.name1().call();
    let name2 = await contract.methods.name2().call();

    this.setState({ totalBet1, totalBet0, totalBet2, rate1, rate0, rate2, name1, name2 });
  };

  bet = async (_betSelection) => {
    const { accounts, contract, web3 } = this.state;

    await contract.methods.bet(_betSelection).send({
      from: accounts[0],
      value: web3.utils.toWei("1", "ether")
    })

    let totalBet1 = web3.utils.fromWei(await contract.methods.totalBet1().call(), "ether");
    let totalBet0 = web3.utils.fromWei(await contract.methods.totalBet0().call(), "ether");
    let totalBet2 = web3.utils.fromWei(await contract.methods.totalBet2().call(), "ether");
    let rate1 = (await contract.methods.rate1().call()) / 1000;
    let rate0 = (await contract.methods.rate0().call()) / 1000;
    let rate2 = (await contract.methods.rate2().call()) / 1000;

    this.setState({ totalBet1, totalBet0, totalBet2, rate1, rate0, rate2 });
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        {/* <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div> */
        }
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Ev Sahibi (1)</th>
              <th>Beraberlik (0)</th>
              <th>Deplasman (2)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>14.04.2022</td>
              <td>{this.state.name1}</td>
              <td>X</td>
              <td>{this.state.name2}</td>
            </tr>
            <tr>
              <td>Oran</td>
              <td>{this.state.rate1}</td>
              <td>{this.state.rate0}</td>
              <td>{this.state.rate2}</td>
            </tr>
            <tr>
              <td>Toplam Bahis</td>
              <td>{this.state.totalBet1} ETH</td>
              <td>{this.state.totalBet0} ETH</td>
              <td>{this.state.totalBet2} ETH</td>
            </tr>
            <tr>
              <td></td>
              <td>
                <button
                  onClick={(event) => {
                    event.preventDefault();
                    this.bet(1);
                  }}
                >+1 ETH</button>
              </td>
              <td>
                <button
                  onClick={(event) => {
                    event.preventDefault();
                    this.bet(0);
                  }}
                >+1 ETH</button>
              </td>
              <td>
                <button
                  onClick={(event) => {
                    event.preventDefault();
                    this.bet(2);
                  }}
                >+1 ETH</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;