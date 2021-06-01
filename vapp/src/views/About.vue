<template>
  <div class="about">
    <h1 class="mb-4">Block Paper Scissors</h1>
    <h4 class="mb-4">Your favourite game - on chain</h4>
    <p>
    You have probably played it many times before, a game as simple as it gets.
    <a href="https://en.wikipedia.org/wiki/Rock_paper_scissors"> Rock Paper Scissors</a>: You and your opponent both secretly choose one of thre allowed moves listed in the name of the game.
    Then both of you reveal your choice and the game is evaluated according to the following rules:
    <ul>
       <li>Rock beats Scissors</li> 
       <li>Paper beats Scissors</li> 
       <li>Scissors beat Paper</li> 
       <li>If both players choose the same move the game ends in a draw</li> 
    </ul>

    Thanks to Block Paper Scissors you can now play this game via a smart contract on the ethereum block chain.
    This gives you a variety of advantages over the traditional "implementation":
    <ul>
       <li>Play with anyone around the world</li> 
       <li>Game evaluation is done in a trustless / decentralized / transparent way</li> 
       <li>Game results are recorded on-chain for eternity</li> 
       <li>Contract can be integrated into other contracts / systems to settle "Coin-Flip" decisions between two participants without the need for (pseudo-)random number generation</li> 
    </ul>

    The core logic of the game is implemented in a solidity smart-contract that includes the following steps:
    <ol>
       <li>Player 1 decides on a move and chooses a secret string</li> 
       <li>Using the chosen secret the move is encrypted in the client dapp</li> 
       <li>Player 1 calls the smart contract to create the game providing his encrypted move and the ethereum adress of Player 2</li> 
       <li>Player 2 calls the smart contract to provide his move (without encryption)</li> 
       <li>Player 1 calls the smart contract to evaluate the game by providing the secret with which he encrypted his move previously</li>
       <li>Inside the smart contract Player 1's move is decrypted and used together with the second move to evaluate the game.</li> 
    </ol>





    </p>
  </div>
</template>

<script>
import NewGame from "../components/dialogues/NewGame";

export default {
  components: { NewGame },
};
</script>
