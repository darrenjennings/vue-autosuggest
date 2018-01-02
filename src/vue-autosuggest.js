import VueAutosuggest from "./Autosuggest.vue";
import DefaultSection from "./parts/DefaultSection.js";

const VueAutosuggestPlugin = {
  install(Vue) {
    Vue.component("vue-autosuggest-default-section", DefaultSection);
    Vue.component("vue-autosuggest", VueAutosuggest);
  }
};

export default VueAutosuggestPlugin;
export { VueAutosuggest, DefaultSection };

if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(VueAutosuggestPlugin);
}
