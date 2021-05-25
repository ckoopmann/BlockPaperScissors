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
        bool firstPlayerWon;
    }
    
    uint256 gameCount;

    mapping(bytes32 => Game) games;
    mapping(address => bytes32[]) public playerGames;

    event GameStarted(address firstPlayer, address secondPlayer, bytes32 gameId);
    event FirstMovePlayed(bytes32 gameId, bytes32 encryptedMove);
    event FirstMoveRevealed(bytes32 gameId, bytes32 encryptedMove, Move decryptedMove, bytes32 secret);
    event MoveHashCalculated(bytes32 encryptedMove, uint8 decryptedMove, bytes32 secret);
    event SecondMovePlayed(bytes32 gameId, Move move);
    event FirstPlayerWon(bytes32 gameId);
    event SecondPlayerWon(bytes32 gameId);

    function encryptMove(uint8 move, bytes32 secret) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(move, secret));
    }

    function decryptMove(bytes32 encryptedMove, bytes32 secret) public pure returns (uint8) {
        bytes32 currentHash;
        for(uint8 i = 1; i<4; i++){
            currentHash = encryptMove(i, secret);
            if(currentHash == encryptedMove){
                return(i);
            }
        }
        return 0;
    }

    function startGame(address opponent, bytes32 encryptedMove) public returns(bytes32 gameId) {
        gameId = keccak256(abi.encodePacked(gameCount, msg.sender, opponent));
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

    function makeMove(bytes32 gameId, uint8 move) public {
        require(move <= 3, "Invalid Move: Out of range");
        require(move > 0, "Invalid Move: Zero");
        require(msg.sender == games[gameId].secondPlayer, "Sender is not the second player");
        require(games[gameId].state == GameState.Started, "Can't move in current game state");

        games[gameId].secondMove = Move(move);
        games[gameId].state = GameState.Played;

        emit SecondMovePlayed(gameId, Move(move));
    }


    function evaluateGame(bytes32 gameId, bytes32 secret) public {
        require(msg.sender == games[gameId].firstPlayer, "Sender is not the first player");
        require(games[gameId].state == GameState.Played, "Can't reveal move in current game state");

        // Decrypt move using given secret
        bytes32 encryptedMove = games[gameId].firstMoveEncrypted;
        uint8 decryptedMove = decryptMove(encryptedMove, secret);
        require(decryptedMove > 0, "No valid move could be decrypted for given secret");
        games[gameId].firstMoveSecret = secret;
        emit FirstMoveRevealed(gameId, encryptedMove, Move(decryptedMove), secret);

        // Evaluate Game
        Move firstMove = Move(decryptedMove);
        Move secondMove = games[gameId].secondMove;
        bool firstPlayerWon = (firstMove == Move.Block && secondMove == Move.Scissors) ||
            (firstMove == Move.Paper && secondMove == Move.Block) ||
            (firstMove == Move.Scissors && secondMove == Move.Paper);
        games[gameId].state = GameState.Evaluated;
        if(firstPlayerWon){
            games[gameId].firstPlayerWon = true;
            emit FirstPlayerWon(gameId);
        }
        else {
            emit SecondPlayerWon(gameId);
        }
    }

    function getGameResult(bytes32 gameId) public view returns(uint8){
        if(games[gameId].state == GameState.Evaluated){
            if(games[gameId].firstPlayerWon){
                return 1;
            }
            else{
                return 2;
            }
        }
        else{
            return 0;
        }
    }

    
}
