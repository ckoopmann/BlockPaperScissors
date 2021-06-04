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
    gameDataLoaded: false,
    gameIds: [],
    gameData: {},
    gameLoadingStates: {},
    contractDeployed: false,
  },
  mutations: {
    setContractInstance(state, contractInstance) {
      state.contract = contractInstance;
    },
    setGameIds(state, gameIds) {
      state.gameIds = gameIds;
    },
    setGameData(state, { gameId, gameData }) {
      console.log("Adding Game Data: ", gameId, gameData);
      if (!state.gameIds.includes(gameId)) {
        state.gameIds = [gameId, ...state.gameIds];
      }
      state.gameData[gameId] = gameData;
    },
    setGameDataLoaded(state, loadingFlag) {
      state.gameDataLoaded = loadingFlag;
    },
    setContractDeployed(state, contractDeployed) {
      state.contractDeployed = contractDeployed;
    },
  },
  actions: {
    initializeContract({ commit, rootGetters }) {
      commit("setContractDeployed", false);
      const web3 = rootGetters["web3Module/web3Instance"];
      const networkId = rootGetters["web3Module/networkId"];
      const abi = contractJson.abi;
      if(networkId in contractJson.networks){
        const address = contractJson.networks[networkId].address;
        console.log("using abi: ", abi);
        console.log("using address: ", address);
        const contract = new web3.eth.Contract(abi, address);
        console.log("setting contract to: ", contract);
        commit("setContractInstance", contract);
        commit("setContractDeployed", true);
      }
      else{
        console.log(`Contract is not deployed on network ${networkId}`);
      } 
    },
    registerContractEventListeners({ getters, rootGetters, dispatch }) {
      const contract = getters["contractInstance"];
      if (contract != null) {
        // Reload game list on any event TODO: Filter to avoid triggering unecessary reloads
        contract.events.allEvents({ fromBloc: "lates" }, (error, event) => {
          console.log("Intercepted GameStarted Event:", event, error);
          if (event != null) {
            const { firstPlayer, secondPlayer, gameId } = event.returnValues;
            const activeAccount = rootGetters["web3Module/activeAccount"];
            if ([firstPlayer, secondPlayer].includes(activeAccount)) {
              dispatch("loadSingleGame", gameId);
            }
          }
        });
      }
    },
    async loadGames({ getters, rootGetters, commit, dispatch }) {
      commit("setGameDataLoaded", false);
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
      commit("setGameDataLoaded", true);
    },
    async loadSingleGame({ getters, commit, rootGetters }, gameId) {
      commit("setGameDataLoaded", false);
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
        title: contractData["8"],
      };

      console.log(`Setting game data for ${gameId} to: `, gameData);
      commit("setGameData", { gameId, gameData });
      commit("setGameDataLoaded", true);
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
    async startGame(
      { getters, rootGetters },
      { title, opponent, secret, move }
    ) {
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
        .startGame(title, opponent, encryptedMove)
        .send({ from: activeAccount });
      console.log("Result: ", result);
    },
    async evaluateGame({ getters, rootGetters }, { gameId, secret }) {
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
    contractAddress(state){
      if(state.contract != null){
        return state.contract.options.address;
      }
      return null;
    },
    gameIds(state) {
      return state.gameIds;
    },
    contractDeployed(state) {
      return state.contractDeployed;
    },
    gameDataLoaded(state) {
      return state.gameDataLoaded;
    },
    gameDataAll(state) {
      return state.gameData;
    },
    gameDataSingle: (state) => (gameId) => {
      if (gameId in state.gameData) {
        return state.gameData[gameId];
      } else {
        return {
          state: "Loading",
          firstPlayer: "Loading",
          secondPlayer: "Loading",
          result: "None",
        };
      }
    },
    previousOpponents(state) {
      if (!state.gameDataLoaded) {
        return [];
      }
      const opponents = state.gameIds.map((id) => {
        const data = state.gameData[id];
        if (data.firstPlayer == "YOU") {
          return data.secondPlayer;
        } else {
          return data.firstPlayer;
        }
      });
      console.log("All opponents", opponents);
      const uniqueOpponents = opponents.filter(
        (x, i, a) => x != null && a.indexOf(x) === i
      );
      return uniqueOpponents;
    },
  },
};
export default contractModule;
