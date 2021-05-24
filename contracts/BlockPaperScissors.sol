// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract BlockPaperScissors {

    enum Move { None, Block, Paper, Scissors}
    enum GameState { None, Started, Played, Evaluated}
    struct Game {
        GameState state;
        address firstPlayer;
        address secondPlayer;
        bytes32 firstMoveEncrypted;
        bytes32 firstMoveSecret;
        Move secondMove;
    }
    
    uint256 gameCount;

    mapping(bytes32 => Game) games;
    mapping(address => bytes32[]) public playerGames;

    event GameStarted(address firstPlayer, address secondPlayer, bytes32 gameId);
    event FirstMovePlayed(bytes32 gameId, bytes32 encryptedMove);

    function startGame(address opponent, bytes32 encryptedMove) public {
        bytes32 gameId = keccak256(abi.encodePacked(gameCount, msg.sender, opponent));
        gameCount++;

        games[gameId].state = GameState.Started;
        games[gameId].firstPlayer = msg.sender;
        games[gameId].secondPlayer = opponent;

        playerGames[msg.sender].push(gameId);
        playerGames[opponent].push(gameId);

        emit GameStarted(msg.sender, opponent, gameId);

        games[gameId].firstMoveEncrypted = encryptedMove;
        emit FirstMovePlayed(gameId, encryptedMove);
    }
    
}
