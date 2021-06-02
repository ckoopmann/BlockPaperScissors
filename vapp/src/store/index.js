import Vue from "vue";
import Vuex from "vuex";
import web3Module from "./modules/web3.module"
import contractModule from "./modules/contract.module"

Vue.use(Vuex);
export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    web3Module,
    contractModule,
  },
});
