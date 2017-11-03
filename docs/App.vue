<template>
  <div>
    <div style="padding-top:10px; margin-bottom: 10px;"><span v-if="selected">You have selected {{selected}}</span></div>
    <div>
    <vue-autosuggest 
              :suggestions="filteredOptions"
              :result-item-key="'firstname'"
              :input-props="inputProps"
              :section-configs="sectionConfigs"
          >
    </vue-autosuggest>
    </div>
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
          limit: 6,
          onSelected: function(item) {
            alert('default: ' + item.label)
          }
        },
        "blog": {
          limit: 3,
          type: 'url-section',
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
          "name": "blog",
          "data": [
            {"url": "http://bla.com/1", "value":"blog link 1"},
            {"url": "http://bla.com/2", "value":"blog link 2"},
            {"url": "http://bla.com/3", "value":"blog link 3"},
            {"url": "http://bla.com/4", "value":"blog link 4"}
          ]
        }]
    }
  }
};
</script>