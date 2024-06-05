// main.js
import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import Dashboard from './components/Dashboard.vue'
import AssetList from './components/AssetList.vue'
import AssetDetailsModal from './components/AssetDetailsModal.vue'

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(Vuetify)

const routes = [
  { path: '/', component: Dashboard },
  { path: '/assets', component: AssetList }
]

const router = new VueRouter({
  routes
})

const store = new Vuex.Store({
  state: {
    assets: [],
    selectedAsset: null
  },
  mutations: {
    setAssets(state, assets) {
      state.assets = assets
    },
    setSelectedAsset(state, asset) {
      state.selectedAsset = asset
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
