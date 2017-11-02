<template>
  <div>
    <div style="padding-top:10px; margin-bottom: 10px;"><span v-if="selected">You have selected {{selected}}</span></div>
    <vue-autosuggest 
              :limit="limit"
              :suggestions="filteredOptions"
              :result-item-key="'firstname'"
              :input-props="inputProps"
              :section-configs="sectionConfigs"
          >
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
      ],
      sectionConfigs: {
        "default": {
          onSelected: function(item) {
            alert('default: ' + item.label)
          }
        },
        "url": {
          onSelected: function(item) {
            alert('url: ' + item.item.url);
          }
        }
      },
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
      this.filteredOptions = [{
          "label": "Search",
          "type": "default",
          "data": [
            "clifford kits",
            "friendly chemistry",
            "phonics",
            "life of fred",
            "life of fred math",
            "magic school bus",
            "math mammoth light blue",
            "handwriting",
            "math",
            "minecraft",
            "free worksheets",
            "4th grade",
            "snap circuits",
            "bath toys",
            "channies",
            "fred",
            "lego",
            "math life of fred",
            "multiplication",
            "thinking tree" 
          ]
        },
        {
          "label": "Blog",
          "type": "url",
          "data": [
            {"url": "http://bla.com/1", "value":"blog link 1"},
            {"url": "http://bla.com/1", "value":"blog link 1"},
            {"url": "http://bla.com/1", "value":"blog link 1"},
            {"url": "http://bla.com/1", "value":"blog link 1"}
          ]
        }]
    }
  }
};
</script>