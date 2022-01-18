// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Game.sol";

contract BetFactory{

    address public owner;
    
    Game[] public games;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function !");
        _;
    }

    function createGame(string memory name1, string memory name2) public onlyOwner{
        Game game = new Game(name1, name2);
        games.push(game);
    }

    function selectWinner(address gameContractAddress, uint winner) public onlyOwner{
        Game(gameContractAddress).selectWinner(winner);
    }

    function getName1() public view returns (string memory _name){
        _name = Game(address(games[0])).name1();
    }

}