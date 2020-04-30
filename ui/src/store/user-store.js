const state = {
  username: '',
  name: '',
  lent_money_to: [],
  owes_money_to: [],
  pic_url: 'https://s.gravatar.com/avatar/4f0ba5cd9ec13e0c103a265fc4bc231e?s=80'
}

const mutations = {
  setInfo(state, payload_obj) {
    state.username = payload_obj.username;
    state.name = payload_obj.name;
    state.lent_money_to = payload_obj.lent_money_to;
    state.owes_money_to = payload_obj.owes_money_to;
    state.pic_url = payload_obj.pic_url;
  },
  setLent(state, payload_arr) {
    state.lent_money_to = payload_arr;
  },
  setOwes(state, payload_arr) {
    state.owes_money_to = payload_arr;
  }
}

const actions = {
  setUserData({ commit }, payload) {
    commit('setInfo', payload);
  },
  updateLentArr({ commit }, payload) {
    commit('setLent', payload);
  },
  updateOwesArr({ commit }, payload) {
    commit('setOwes', payload);
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