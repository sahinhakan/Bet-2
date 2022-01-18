// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Game {

    address public factory;

    uint public winner = 3;//3 yanlış bir bahis tipi.. Buradan ayırt edebiliriz
    bool public isActive = true;

    enum BetType{ HOME, X, AWAY }

    string public name1;//Ev sahibi ismi
    string public name2;//deplasman ismi

    uint256 public totalBet; //toplam bahis miktarı
    uint256 public totalBet1;//ev sahibi toplam bahis miktarı
    uint256 public totalBet0;//beraberlik toplam bahis miktarı
    uint256 public totalBet2;//deplasman toplam bahis miktarı

    mapping(address => uint256) public addressToAmountBet1; //adrese göre Ev sahibine yatırılan miktar
    mapping(address => uint256) public addressToAmountBet0; //adrese göre beraberliğe yatırılan miktar
    mapping(address => uint256) public addressToAmountBet2; //adrese göre deplasmana yatırılan miktar

    address payable[] public Bets1; //Ev sahibi bahisi yapan adresler
    address payable[] public Bets0; //beraberlik bahsi yapan adresler
    address payable[] public Bets2; //deplasman bahsi yapan adresler

    uint256 public rate1 = 1; //Ev sahibi oran
    uint256 public rate0 = 1; //Beraberlik oran
    uint256 public rate2 = 1; //Deplasman oran

    constructor(string memory _name1, string memory _name2) public {
        factory = msg.sender;
        name1 = _name1;
        name2 = _name2;
    }

    modifier onlyOwner() {
        require(msg.sender == factory, "Only owner can call this function !");
        _;
    }

    function bet(uint _type) public payable{
        require(msg.value > 0, "Amount must be greater than zero !");
        require(_type >= 0 && _type <=2, "Wrong bet type !");
        require(isActive, "Bet is inactive !");
        //seçime göre bahisi yatır
        if(_type == 1){
            addressToAmountBet1[msg.sender] += msg.value;
            Bets1.push(payable(msg.sender));
            totalBet1 += msg.value;
        }else if(_type == 0){
            addressToAmountBet0[msg.sender] += msg.value;
            Bets0.push(payable(msg.sender));
            totalBet0 += msg.value;
        }else if(_type == 2){
            addressToAmountBet2[msg.sender] += msg.value;
            Bets2.push(payable(msg.sender));
            totalBet2 += msg.value;
        }
        totalBet += msg.value;
        calculateRate();
    }

    //150 şeklinde rate hesaplanacak. Bu 1,50 demektir
    function calculateRate() internal {
        rate1 = (totalBet*1000) / (totalBet1 == 0 ? totalBet : totalBet1);
        rate0 = (totalBet*1000) / (totalBet0 == 0 ? totalBet : totalBet0);
        rate2 = (totalBet*1000) / (totalBet2 == 0 ? totalBet : totalBet2);
    }

    function selectWinner(uint _winner) external onlyOwner {
        winner = _winner;
        stopBet();
        distributeRewards();
    }

    function distributeRewards() internal onlyOwner {
        require(winner >= 0 && winner < 3, "Kazanan bahis tipi hatali !");
        uint256 _amount;
        if(winner == 1){
            for(uint i = 0; i < Bets1.length; i++){
                _amount = addressToAmountBet1[Bets1[i]] * rate1 / 1000;
                Bets1[i].transfer(_amount);
                addressToAmountBet1[Bets1[i]] = 0;
            }
        }else if(winner == 0){
            for(uint i = 0; i < Bets0.length; i++){
                _amount = addressToAmountBet0[Bets0[i]] * rate0 / 1000;
                Bets0[i].transfer(_amount);
                addressToAmountBet0[Bets0[i]] = 0;
            }
        }else if(winner == 2){
            for(uint i = 0; i < Bets2.length; i++){
                _amount = addressToAmountBet2[Bets2[i]] * rate2 / 1000;
                Bets2[i].transfer(_amount);
                addressToAmountBet2[Bets2[i]] = 0;
            }
        }
    }

    function stopBet() public onlyOwner{
        isActive = false;
    }

    function getContractBalance() public view returns(uint256){
        return address(this).balance;
    }

}