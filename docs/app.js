import Vue from "vue";
import VueAutosuggest from "../src/Autosuggest.vue";

new Vue({
  el: "#app",
  components: {
    VueAutosuggest
  },
  data() {
    return {
      suggestions: [],
      selected: '',
      clicked: '',
      limit: 5,
      autoSuggestInputId: 'autosuggest__input',
      results: [
        { firstname: "Frodoz", lastname: "Baggins" },
        { firstname: "Samwise", lastname: "Gamgee" },
        { firstname: "Gandalf", lastname: "the Grey" },
        { firstname: "Gollum", lastname: "" },
        { firstname: "Glorfindel", lastname: "" },
        { firstname: "Galadriel", lastname: "" },
        { firstname: "Faramir", lastname: "Second Son of Denethor II" },
        { firstname: "Boromir", lastname: "First Son of Denother II" }
      ]
    };
  },
  methods: {
    onInputChange(text) {
      this.suggestions = this.results.filter(person => {
        return person.firstname.toLowerCase().indexOf(text.toLowerCase()) > -1;
      });
    },
    clickHandler(e) {
      let value = window.document.getElementById(this.autoSuggestInputId).value;
      this.selected = value;
    }
  }
});
