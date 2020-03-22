import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    canvas: null
  },
  mutations: {
    SET_CANVAS(state, svg) {
      state.canvas = svg
    },
    ADD_TO_CANVAS(state, element) {
      state.canvas.add(element)
    }
  },
  actions: {
    SET_CANVAS({commit}, svg) {
      commit('SET_CANVAS', svg)
    },
    ADD_TO_CANVAS({commit}, element) {
      commit('ADD_TO_CANVAS', element)
    }
  },
  modules: {
  }
})
