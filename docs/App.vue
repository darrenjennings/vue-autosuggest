<template>
  <div>
    <div style="padding-top:10px; margin-bottom: 10px;"><span v-if="selected">You have selected {{selected}}</span></div>
    <vue-autosuggest 
              :limit="limit"
              :suggestions="filteredOptions" 
              :on-selected="clickHandler"
              :result-item-key="'firstname'"
              :input-props="inputProps"
          >
          <li slot="autosuggest"
              slot-scope="props"
              @mouseenter="props.mouseenter"
              @mouseleave="props.mouseleave"
              :data-suggestion-index="props.dataSuggestionIndex"
              role="option"
              class="autosuggest__results_item"
              :class="props.class"
              :id="props.id" 
              :key="props.id">
              <span class="bullet"></span><span v-html="props.styleItem(props.result.firstname)"></span>
          </li>
    </vue-autosuggest>
  </div>
</template>

<script>
import Vue from "vue";
import VueAutosuggest from "../src/Autosuggest.vue";

export default {
  components: {
    VueAutosuggest
  },
  data() {
    return {
      selected: "",
      limit: 10,
      options: [
        { firstname: "Frodo", lastname: "Baggins" },
        { firstname: "Samwise", lastname: "Gamgee" },
        { firstname: "Gandalf", lastname: "the Grey" },
        { firstname: "Gollum", lastname: "aka Sméagol" },
        { firstname: "Glorfindel" },
        { firstname: "Galadriel" },
        { firstname: "Faramir" },
        { firstname: "Boromir" },
        { firstname: "Saruman" },
        { firstname: "Sauron" },
        { firstname: "Eomer" },
        { firstname: "Éowyn" },
        { firstname: "Elrond" }
      ],
      filteredOptions: [],
      inputProps: {
        id: "autosuggest__input",
        initialValue: "",
        onClick: () => {},
        onInputChange: this.onInputChange,
        placeholder: "Type 'G'"
      }
    };
  },
  methods: {
    onInputChange(text) {
      this.filteredOptions = this.options.filter(person => {
        return person.firstname.toLowerCase().indexOf(text.toLowerCase()) > -1;
      });
    },
    clickHandler(e) {
      let value = window.document.getElementById(this.inputProps.id).value;
      this.selected = value;
    }
  }
};
</script>