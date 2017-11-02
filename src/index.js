import Autosuggest from "./Autosuggest.vue";
import DefaultSection from './parts/DefaultSection.vue';

const VueAutosuggest = {
  install(Vue) {
    Vue.component('DefaultSection', DefaultSection);    
    Vue.component("vue-autosuggest", Autosuggest);
  }
};

export default VueAutosuggest;

if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(install);
  if (install.installed) {
    install.installed = false;
  }
}
