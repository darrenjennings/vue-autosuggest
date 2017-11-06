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
      options: [],
      sectionConfigs: {
        default: {
          limit: 6,
          onSelected: function(item) {
            alert("default: " + item.label);
          }
        },
        blog: {
          limit: 3,
          type: "url-section",
          onSelected: function(item) {
            alert("url: " + item.item.url);
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
      this.filteredOptions = [
        {
          data: [
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
          label: "Blog",
          name: "blog",
          data: [
            { url: "https://blog.educents.com/best-educational-games-2017-inchimals/", value: "The Best Educational Games and Toys of 2017: Inchimals" },
            { url: "https://blog.educents.com/reading-exploring-world-through-literature/", value: "Family Read-Alouds: Exploring the World Through Literature" }
          ]
        }
      ];
    }
  }
};
</script>