<template>
  <div class="about">
    <h1 class="mt-4 mb-4 white--text">Block Paper Scissors</h1>
    <h4 class="mb-4 white--text">Your favourite game - on chain</h4>
    <AboutElement title="What is Block Paper Scissors ?" class="mb-4">
      This is the blockchain version of the classic game
      <a href="https://en.wikipedia.org/wiki/Rock_paper_scissors">
        Rock Paper Scissors</a
      >
      running on Ethereum.
      <br />
      <br />

      This is a web3 application therefore you will need to install / connect
      the <a href="https://metamask.io/"> Metamask</a> smart wallet to use its
      features.
      <br />
      <br />

      The code for this dapp including the smart contract that implements the
      game logic can be found in the
      <a href="https://github.com/ckoopmann/BlockPaperScissors"> Github-Repo</a
      >. The link to this repository as well as to any other part of the
      application is accesible via the menu .

      <br />
      <br />
      Note that the smart contract underlying this dapp is currently only
      <b>deployed on Rinkeby</b> test-net therefore you have to switch the
      network of your wallet accordingly to try it out.

      <br />
      <br />
      Also note that since all actions in this application (such as creating a
      new game), are executed via ethereum transactions they will take more time
      than you might be used to from a centralized application. The app is set
      up to listen to all relevant contract events such that the data should be
      updated automatically without you having to refresh the page.
    </AboutElement>

    <AboutElement title="How do I play ?" class="mb-4">
      A round of Block Paper Scissors is played in 3 steps, each corresponding
      to one ethereum transaction.
      <ol>
        <li>
          Player 1 creates a New Game providing the opponents address and his
          own "Move" encrypted with a secret key
        </li>
        <li>
          Player 2 submits his move.
        </li>
        <li>
          Player 1 reveals his move by providing the secret key he used in Step
          1 and the game is evaluated
        </li>
      </ol>
      A new game can be opened using the button at the top of the page while all
      ongoing / evaluated games can be viewed
      <router-link to="/games">here</router-link>, including games to which
      other players have challenged you.
    </AboutElement>

    <AboutElement title="What are the rules ?" class="mb-4">
      In case you are not aware of the original Rock Paper Scissors game here
      are the rules that are used to evaluate a game result once both players
      have submitted / revealed their moves:
      <ol>
        <li>
          If both moves are identical the game ends in a draw
        </li>
        <li>
          Paper beats Block
        </li>
        <li>
          Scissors beat Paper
        </li>
        <li>
          Block beats Scissors
        </li>
      </ol>
    </AboutElement>
  </div>
</template>

<script>
import NewGame from "../components/dialogues/NewGame";
import AboutElement from "../components/AboutElement";

export default {
  components: { NewGame, AboutElement },
};
</script>

<style>
ul {
  list-style-position: inside;
}
ol li {
  padding: 5px;
  margin-left: 35px;
}
.about {
  background-image: url(/assets/hands.jpg);
  background-size: cover; /* <------ */
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;
  display: inline-table;
}
</style>
