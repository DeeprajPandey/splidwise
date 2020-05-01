import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

import user_info from './user-store'

Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  key: 'state',
  storage: window.sessionStorage,
  // Function that passes the state and returns the state with only the objects you want to store.
  // reducer: state => state,
  // Function that passes a mutation and lets you decide if it should update the state in localStorage.
  // filter: mutation => mutation.type == 'setLent' || mutation.type == 'setOwes'
})

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      user_info
    },
    plugins: [vuexLocalStorage.plugin],
    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
