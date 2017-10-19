import Autosuggest from "./Autosuggest.vue";

export default {
  install(Vue) {
    Vue.component("vue-autosuggest", Autosuggest);

    // Automatically register component if Vue is available globally
    if (typeof window !== "undefined" && window.Vue) {
      window.Vue.use(Autosuggest);
    }
  }
};
