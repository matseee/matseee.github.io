import Vue from 'vue'
import App from './App.vue'

import './../node_modules/milligram/dist/milligram.min.css'
import './../node_modules/normalize.css/normalize.css'
import './assets/css/styles.css'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
