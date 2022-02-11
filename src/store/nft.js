import {Contract} from "ethers";
const ethers = require('ethers');
import NFT from '@contracts/BorrowAccessNFT.json'
const FACTORY_TUP = require('../../build/contracts/SmartLoansFactoryTUP.json');
const POOL_TUP = require('../../build/contracts/PoolTUP.json');
import {parseArweaveURI} from "../utils/blockchain";
import config from "@/config";
import FACTORY_NFT from "../../build/contracts/SmartLoansFactoryWithAccessNFT.json";
import POOL_NFT from "../../build/contracts/PoolWithAccessNFT.json";
const ZERO = ethers.constants.AddressZero;

export default {
  namespaced: true,
  state: {
    borrowNftContract: null,
    hasBorrowNft: false,
    borrowNftId: null,
    borrowNftImageUri: null,
    depositNftContract: null,
    hasDepositNft: false,
    depositNftId: null,
    depositNftImageUri: null
  },
  mutations: {
    setBorrowNftContract(state, contract) {
      state.borrowNftContract = contract;
    },
    setHasBorrowNft(state, has) {
      state.hasBorrowNft = has;
    },
    setBorrowNftId(state, id) {
      state.borrowNftId = id;
    },
    setBorrowNftImageUri(state, uri) {
      state.borrowNftImageUri = uri;
    },
    setDepositNftContract(state, contract) {
      state.depositNftContract = contract;
    },
    setHasDepositNft(state, has) {
      state.hasDepositNft = has;
    },
    setDepositNftId(state, id) {
      state.depositNftId = id;
    },
    setDepositNftImageUri(state, uri) {
      state.depositNftImageUri = uri;
    },
  },
  getters: {
    hasBorrowNft(state) {
      return state.borrowNftId !== null;
    },
    borrowingLocked(state) {
      return state.hasBorrowNft && state.borrowNftId === null;
    },
    depositLocked(state) {
      return state.hasDepositNft && state.depositNftId === null;
    }
  },
  actions: {
    async initNfts({ commit, dispatch, rootState }) {
      const provider = rootState.network.provider;

      try {
        const factory = new Contract(FACTORY_TUP.networks[config.chainId].address, FACTORY_NFT.abi, provider.getSigner());
        factory.iface = new ethers.utils.Interface(FACTORY_NFT.abi);

        const address = await factory.getAccessNFT();
        commit('setHasBorrowNft', address !== ZERO);

        const borrowContract = new Contract(address, NFT.abi, provider.getSigner());

        commit('setBorrowNftContract', borrowContract);
        dispatch('getBorrowNftId');
      } catch(e) {
        console.error(e)
        console.log('No access NFT for borrow required')
      }

      try {
        const pool = new Contract(POOL_TUP.networks[config.chainId].address, POOL_NFT.abi, provider.getSigner());
        const address = await pool.getAccessNFT();
        commit('setHasDepositNft', address !== ZERO);

        const depositContract = new Contract(address, NFT.abi, provider.getSigner());

        commit('setDepositNftContract', depositContract);
        dispatch('getDepositNftId');
      } catch(e) {
        console.error(e)
        console.log('No access NFT for deposit required')
      }
    },
    async updateBorrowNftFromId({ commit, state }, { id }) {
      const jsonUri = parseArweaveURI(await state.borrowNftContract.tokenURI(id));
      const response = await fetch(jsonUri);
      const json = await response.json();
      const uri = parseArweaveURI(json.image);

      commit('setBorrowNftImageUri', uri);
    },
    async getBorrowNftId({ state, rootState, dispatch, commit }) {
      const balance = (await state.borrowNftContract.balanceOf(rootState.network.account)).toNumber();
      if (balance > 0) {
        const id = (await state.borrowNftContract.tokenOfOwnerByIndex(rootState.network.account, 0)).toNumber();

        commit('setBorrowNftId', id);
        dispatch('updateBorrowNftFromId', {id: id})
      }
    },
    async getDepositNftId({ state, rootState, dispatch, commit }) {
      const balance = (await state.depositNftContract.balanceOf(rootState.network.account)).toNumber();
      if (balance > 0) {
        const id = (await state.depositNftContract.tokenOfOwnerByIndex(rootState.network.account, 0)).toNumber();

        commit('setDepositNftId', id);
        dispatch('updateDepositNftFromId', {id: id})
      }
    }
  }
};
