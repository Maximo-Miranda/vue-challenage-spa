import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import vuetify from './plugins/vuetify'
import router from './router'

import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import * as rules from 'vee-validate/dist/rules'
import es from 'vee-validate/dist/locale/es'

import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

Vue.use(VueSweetalert2)
Vue.use(VueAxios, axios)

// loop over all rules
for (let rule in rules) {
  extend(rule, {
      ...rules[rule], // add the rule
      message: es.messages[rule] // add its message
  });
}

extend('password', {
  validate: (value, { other }) => value === other,
  message: 'La confirmación de contraseña no coincide.',
  params: [{ name: 'other', isTarget: true }]
});

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
