const state = {
  username: 'user1@protonmail.com',
  name: 'Mahavir Jhawar',
  owes_money_to: ['user3@ashoka.edu'],
  lent_money_to: [],
  pic_url: ''
}

const mutations = {

}

const actions = {

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