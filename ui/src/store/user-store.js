const state = {
  username: 'user1@protonmail.com',
  name: 'Mahavir Jhawar',
  owes_money_to: ['user3@ashoka.edu'],
  lent_money_to: [],
  pic_url: ''
}

const mutations = {
  updateLent(state, payload_arr) {
    state.lent_money_to = payload_arr;
  },
  updateOwes(state, payload_arr) {
    state.owes_money_to = payload_arr;
  }
}

const actions = {
  updateLentArr({ commit }, payload) {
    commit('updateLent', payload)
    return;
  },
  updateOwesArr({ commit }, payload) {
    commit('updateOwes', payload)
    return;
  }
}

const getters = {
  uname: (state) => {
    return state.username;
  },
  lent_money_to: (state) => {
    return state.lent_money_to;
  },
  owes_money_to: (state) => {
    return state.owes_money_to;
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}