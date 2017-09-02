// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueFire from 'vuefire'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'

Vue.use(VueFire)
Vue.use(VueMaterial)
Vue.material.registerTheme('default', {
  primary: {
    color: 'cyan',
    hue: 500,
    textColor: 'white'
  },
  accent: {
    color: 'grey',
    hue: 800
  },
  warn: 'deep-orange',
  background: 'white'
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
