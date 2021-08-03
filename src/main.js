import Vue from 'vue';
import locale from 'webmd-elements/lib/locale';
import lang from 'webmd-elements/lib/locale/lang/en';
import pageDataMixin from 'webmd-page-common/src/util/pagedata';
import Metrics from 'webmd-vuejs-metrics';
import dfp from 'webmd-vue-ad/src/lib/dfp';
import App from './App.vue';
import createStore from './store';
import createRouter from './router';

Vue.mixin(pageDataMixin);
Vue.use(Metrics);
Vue.use(dfp);

locale.use(lang);

export { createStore, createRouter, App };
