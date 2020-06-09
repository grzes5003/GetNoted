import Vue from 'vue'
//import App from './App.vue'
import NotesWindow from "@/components/NotesWindow";

import 'bootstrap-css-only/css/bootstrap.min.css'
import 'mdbvue/lib/css/mdb.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

Vue.config.productionTip = false;

new Vue({
  render: h => h(NotesWindow),
}).$mount('#app');
