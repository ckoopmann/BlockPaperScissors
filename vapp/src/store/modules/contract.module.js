const contractJson = require("../../contracts/BlockPaperScissors.json");

// Mappings of solidity enum indexes on label
const states = ["None", "Started", "Played", "Evaluated"];
const moves = ["None", "Block", "Paper", "Scissors"];
const results = ["None", "Player 1 Wins", "Player 2 Wins", "Draw"];

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
    setGameData(state, gameId, gameData) {
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
        dispatch("loadSingleGame", gameId);
      }
    },
    async loadSingleGame({ getters, commit, rootGetters }, gameId) {
      const contract = getters["contractInstance"];
      const contractData = await contract.methods.getGameData(gameId).call();

      const gameData = {
        state: states[parseInt(contractData["0"])],
        firstPlayer: contractData["1"],
        secondPlayer: contractData["2"],
        firstMoveEncrypted: contractData["3"],
        firstMoveSecret: contractData["4"],
        firstMove: moves[parseInt(contractData["5"])],
        secondMove: moves[parseInt(contractData["6"])],
        result: results[parseInt(contractData["7"])],
      };

      console.log(`Setting game data for ${gameId} to: `, gameData);
      commit("setGameData", gameId, gameData);
    },
  },
  getters: {
    contractInstance(state) {
      return state.contract;
    },
    gameIds(state) {
      return state.gameIds;
    },
    gameData(state) {
      return state.gameData;
    },
  },
};
export default contractModule;
