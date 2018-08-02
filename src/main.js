import 'babel-polyfill'

import Vue from 'vue'
import App from './App.vue'

// Router
import router from './router'

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faMicrophone, faMicrophoneSlash)

Vue.component('font-awesome-icon', FontAwesomeIcon)

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
