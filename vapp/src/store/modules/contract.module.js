const contractJson = require("../../contracts/BlockPaperScissors.json");

// Mappings of solidity enum indexes on label
const states = ["None", "Started", "Played", "Evaluated"];
const moves = ["None", "Block", "Paper", "Scissors"];
const results = ["None", "Player 1 Wins", "Player 2 Wins", "Draw"];
const moveMapping = { Block: 1, Paper: 2, Scissors: 3 };

function parseAddress(address, activeAccount) {
  if (address === activeAccount) {
    return "YOU";
  } else {
    return address;
  }
}

const contractModule = {
  namespaced: true,
  name: "contract",
  state: {
    contract: null,
    gameIds: [],
    gameData: {},
  },
  mutations: {
    setContractInstance(state, contractInstance) {
      state.contract = contractInstance;
    },
    setGameIds(state, gameIds) {
      state.gameIds = gameIds;
    },
    setGameData(state, { gameId, gameData }) {
      state.gameData[gameId] = gameData;
    },
  },
  actions: {
    initializeContract({ commit, rootGetters }) {
      const web3 = rootGetters["web3Module/web3Instance"];
      const networkId = rootGetters["web3Module/networkId"];
      const abi = contractJson.abi;
      const address = contractJson.networks[networkId].address;
      console.log("using abi: ", abi);
      console.log("using address: ", address);
      const contract = new web3.eth.Contract(abi, address);
      console.log("setting contract to: ", contract);
      commit("setContractInstance", contract);
    },
    async loadGames({ getters, rootGetters, commit, dispatch }) {
      const contract = getters["contractInstance"];
      const activeAccount = rootGetters["web3Module/activeAccount"];
      const gameIds = await contract.methods
        .getPlayerGames(activeAccount)
        .call({ from: activeAccount });
      console.log("Setting game ids to: ", gameIds);
      commit("setGameIds", gameIds);
      for (var gameId of gameIds) {
        await dispatch("loadSingleGame", gameId);
      }
    },
    async loadSingleGame({ getters, commit, rootGetters }, gameId) {
      const contract = getters["contractInstance"];
      const contractData = await contract.methods.getGameData(gameId).call();
      const activeAccount = rootGetters["web3Module/activeAccount"];

      const gameData = {
        state: states[parseInt(contractData["0"])],
        firstPlayer: parseAddress(contractData["1"], activeAccount),
        secondPlayer: parseAddress(contractData["2"], activeAccount),
        firstMoveEncrypted: contractData["3"],
        firstMoveSecret: contractData["4"],
        firstMove: moves[parseInt(contractData["5"])],
        secondMove: moves[parseInt(contractData["6"])],
        result: results[parseInt(contractData["7"])],
      };

      console.log(`Setting game data for ${gameId} to: `, gameData);
      commit("setGameData", { gameId, gameData });
    },
    async makeMove({ getters, rootGetters }, { gameId, move }) {
      const contract = getters["contractInstance"];
      const activeAccount = rootGetters["web3Module/activeAccount"];
      console.log(gameId, move);

      const moveNumber = moveMapping[move];

      const result = await contract.methods
        .makeMove(gameId, moveNumber)
        .send({ from: activeAccount });
      console.log("Result: ", result);
    },
    async startGame({ getters, rootGetters }, { opponent, secret, move }) {
      const web3 = rootGetters["web3Module/web3Instance"];
      const contract = getters["contractInstance"];
      const activeAccount = rootGetters["web3Module/activeAccount"];

      console.log(opponent, secret, move);
      const hashedSecret = web3.utils.sha3(secret);
      console.log(hashedSecret);
      console.log(contract.methods);
      const encryptedMove = await contract.methods
        .encryptMove(1, hashedSecret)
        .call();
      console.log("Encrypted Move: ", encryptedMove);

      const result = await contract.methods
        .startGame(opponent, encryptedMove)
        .send({ from: activeAccount });
      console.log("Result: ", result);
    },
    async evaluateGame({ getters, rootGetters }, {gameId, secret}) {
      const web3 = rootGetters["web3Module/web3Instance"];
      const contract = getters["contractInstance"];
      const activeAccount = rootGetters["web3Module/activeAccount"];

      const hashedSecret = web3.utils.sha3(secret);
      console.log(hashedSecret);

      const result = await contract.methods
        .evaluateGame(gameId, hashedSecret)
        .send({ from: activeAccount });
      console.log("Evaluate Game Result: ", result);
    },
  },
  getters: {
    contractInstance(state) {
      return state.contract;
    },
    gameIds(state) {
      return state.gameIds;
    },
    gameDataAll(state) {
      return state.gameData;
    },
    loadedGameIds(state) {
      console.log("GameIds: ", gameIds);
      const loadedGames = state.gameIds.filter(
        (gameId) => gameId in state.gameData
      );
      console.log("Loaded Games: ", loadedGames);
      return loadedGames;
    },
  },
};
export default contractModule;
