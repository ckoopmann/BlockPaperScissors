// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract BlockPaperScissors {

    struct Game {
        bool isStarted;
    }

    mapping(address => mapping(address => Game)) games;

    event GameStarted(address firstPlayer, address secondPlayer);

    function startGame(address opponent) public {
        require(!games[msg.sender][opponent].isStarted, "Game has already been started");

        games[msg.sender][opponent].isStarted = true;
        
        emit GameStarted(msg.sender, opponent);
    }
}
