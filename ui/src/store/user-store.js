const defaultState = () => {
  return {
    username: '',
    name: '',
    lent_money_to: [],
    owes_money_to: [],
    pic_url: ''
  };
}

const state = defaultState();

const mutations = {
  setInfo(state, payload_obj) {
    state.username = payload_obj.username;
    state.name = payload_obj.name;
  },
  setUrl(state, payload_str) {
    state.pic_url = payload_str;
  },
  setLent(state, payload_arr) {
    state.lent_money_to = payload_arr;
  },
  setOwes(state, payload_arr) {
    state.owes_money_to = payload_arr;
  },
  clearState(state) {
    Object.assign(state, defaultState());
  }
}

const actions = {
  setUserData({ commit }, payload) {
    commit('setInfo', payload);
  },
  setProfileImg({ commit }, payload) {
    commit('setUrl', payload);
  },
  updateLentArr({ commit }, payload) {
    commit('setLent', payload);
  },
  updateOwesArr({ commit }, payload) {
    commit('setOwes', payload);
  },
  clearUserData({ commit }) {
    commit('clearState');
  }
}

const getters = {
  uname: (state) => {
    return state.username;
  },
  name: (state) => {
    return state.name;
  },
  lent_money_to: (state) => {
    return state.lent_money_to;
  },
  owes_money_to: (state) => {
    return state.owes_money_to;
  },
  pic_url: (state) => {
    return state.pic_url;
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}