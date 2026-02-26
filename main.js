import App from './App'
import './style/app.less';
import DemoBaseMixin from './mixins/demo-base.js';

import TDemo from '@tdesign/uniapp/demo/demo.vue';
import TNavbar from '@tdesign/uniapp/navbar/navbar.vue';
import TDemoHeader from '@tdesign/uniapp/demo-header/demo-header.vue';
import TDemoNavbar from '@tdesign/uniapp/demo-navbar/demo-navbar.vue';

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false;
Vue.mixin(DemoBaseMixin);
Vue.component('t-demo', TDemo);
Vue.component('t-demo-header', TDemoHeader);
Vue.component('t-demo-navbar', TDemoNavbar);
Vue.component('t-navbar', TNavbar);

App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif