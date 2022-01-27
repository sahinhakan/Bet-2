import React, {Component} from "react";
import betImage from './images/bet.png';
import ListGroup from 'react-bootstrap/ListGroup';

import './Game.css';

class Game extends Component{
    componentDidMount = async () => {
        let games = this.props.games;
    };

    render(){

        return (
            {/* <ListGroup.Item>{`${this.props.name1} - ${this.props.name2}`}</ListGroup.Item> */},
            <ListGroup.Item>
                <div>
                    <h3>{this.props.data.name1}-{this.props.data.name2}</h3>
                </div>
                <table className="center">
                    {/* <thead>
                        <tr>
                            <th></th>
                            <th>{this.props.data.name1}</th>
                            <th>-</th>
                            <th>{this.props.data.name2}</th>
                        </tr>
                    </thead> */}
                    <tbody>
                        <tr>
                            <td>14.04.2022</td>
                            <td>Ev Sahibi (1)</td>
                            <td>Beraberlik (0)</td>
                            <td>Deplasman (2)</td>
                        </tr>
                        <tr>
                            <td>Oran</td>
                            <td>{this.props.data.rate1}</td>
                            <td>{this.props.data.rate0}</td>
                            <td>{this.props.data.rate2}</td>
                        </tr>
                        <tr>
                            <td>Toplam Bahis</td>
                            <td>{this.props.data.totalBet1} ETH</td>
                            <td>{this.props.data.totalBet0} ETH</td>
                            <td>{this.props.data.totalBet2} ETH</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <button
                                onClick={(event) => {
                                    event.preventDefault();
                                    this.props.bet(1, this.props.data);
                                }}
                                >+0.1 ETH</button>
                            </td>
                            <td>
                                <button
                                onClick={(event) => {
                                    event.preventDefault();
                                    this.props.bet(0, this.props.data);
                                }}
                                >+0.1 ETH</button>
                            </td>
                            <td>
                                <button
                                onClick={(event) => {
                                    event.preventDefault();
                                    this.props.bet(2, this.props.data);
                                }}
                                >+0.1 ETH</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </ListGroup.Item>
        )
    }
}

export default Game;