import Autosuggest from "./Autosuggest.vue";

const VueAutosuggest = {
  install(Vue) {
    Vue.component("vue-autosuggest", Autosuggest);
  }
};

export default VueAutosuggest;

if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(VueAutosuggest);
}
