import Vue from "vue";
import App from "./App.vue";

import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import axios from "axios";
import moment from "moment";

Vue.use(Vuetify);
const vuetify = new Vuetify();
Vue.prototype.moment = moment;

new Vue({
  vuetify,
  render: h => h(App)
}).$mount("#app");
