import React, {Component} from "react";
import betImage from './images/bet.png';
import ListGroup from 'react-bootstrap/ListGroup';
import Game from './Game';

class GameList extends Component{
    componentDidMount = async () => {
        let games = this.props.games;
    };

    render(){
        let games = this.props.games;

        return (
            <ListGroup>
            {
                /* games.map((item, i) => {
                    return <Game key={i} name1={item.name1} name2={item.name2}/>
                }) */

                games.map((item, i) => {
                    return <Game key={i} data={item} bet={this.props.bet}/>
                })
            }
            </ListGroup>
        )
    }
}

export default GameList;