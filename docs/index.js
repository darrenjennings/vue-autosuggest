import Vue from "vue";
import UrlSection from './UrlSection.vue';
import App from './App.vue';

Vue.component('UrlSection', UrlSection);

new Vue({
    el: "#app",
    components: {
      App
    },
    template: "<App/>"
});