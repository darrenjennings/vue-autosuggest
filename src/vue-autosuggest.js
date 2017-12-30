import Autosuggest from "./Autosuggest.vue";
import DefaultSection from "./parts/DefaultSection.js";

const VueAutosuggest = {
  install(Vue) {
    Vue.component("vue-autosuggest-default-section", DefaultSection);
    Vue.component("vue-autosuggest", Autosuggest);
  }
};

export default VueAutosuggest;
export { VueAutosuggest, DefaultSection };

if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(VueAutosuggest);
}
