<template>
  <div>
    <div style="padding-top:10px; margin-bottom: 10px;"><span v-if="selected">You have selected {{selected}}</span></div>
    <div>
    <vue-autosuggest 
              :suggestions="filteredOptions"
              :input-props="inputProps"
              :section-configs="sectionConfigs"
              :getSuggestionValue="getSuggestionValue"
          />
    </div>
  </div>
</template>

<script>
import VueAutosuggest from "../src/Autosuggest.vue";

export default {
  components: {
    VueAutosuggest
  },
  data() {
    return {
      selected: "",
      limit: 10,
      filteredOptions: [],
      options: [
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
            {
              url: "https://blog.educents.com/",
              value: "The Best Blog in the Entire World"
            },
            {
              url:
                "https://blog.educents.com/best-educational-games-2017-inchimals/",
              value: "The Best Educational Games and Toys of 2017: Inchimals"
            },
            {
              url:
                "https://blog.educents.com/reading-exploring-world-through-literature/",
              value:
                "Family Read-Alouds: Exploring the World Through Literature"
            }
          ]
        }
      ],
      sectionConfigs: {
        default: {
          limit: 6,
          onSelected: function() {
            // console.log(item, originalInput, `Selected "${item.item}"`);
          }
        },
        blog: {
          limit: 3,
          type: "url-section",
          onSelected: function() {
            //alert("url: " + item.item.url);
          }
        }
      },
      inputProps: {
        id: "autosuggest__input",
        onClick: () => {},
        onInputChange: this.onInputChange,
        placeholder: "Type 'g'"
      }
    };
  },
  methods: {
    onInputChange(text) {
      let filtered = [];
      const suggestionsData = this.options[0].data.filter(item => {
        return item.toLowerCase().indexOf(text.toLowerCase()) > -1;
      });
      const blogData = this.options[1].data.filter(item => {
        return item.value.toLowerCase().indexOf(text.toLowerCase()) > -1;
      });

      suggestionsData.length > 0 &&
        filtered.push({
          label: "Suggestions",
          data: suggestionsData
        });

      blogData.length > 0 &&
        filtered.push({
          label: "Blog Resources",
          name: "blog",
          data: blogData
        });

      this.filteredOptions = filtered;
    },
    getSuggestionValue(item){
      if(item.name == 'blog'){
        return item.item.value;
      }else{
        return item.item;
      }
    }
  }
};
</script>

<style rel="stylesheet">
body {
  max-width: 800px;
  padding: 20px;
  margin-left: auto !important;
  margin-right: auto !important;
  font-family: monospace;
  background-color: #f2f2f2;
}

#autosuggest__input {
  outline: none;
  position: relative;
  display: block;
  font-family: monospace;
  font-size: 20px;
  border: 1px solid #616161;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
}

#autosuggest__input.autosuggest__input-open {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.autosuggest__results-container {
  position: relative;
  width: 100%;
}

.autosuggest__results {
  font-weight: 300;
  margin: 0;
  position: absolute;
  z-index: 10000001;
  width: 100%;
  border: 1px solid #e0e0e0;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  background: white;
  padding: 0px;
}

.autosuggest__results ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.autosuggest__results .autosuggest__results_item {
  cursor: pointer;
  padding: 15px;
}

#autosuggest ul:nth-child(1) > .autosuggest__results_title {
  border-top: none;
}

.autosuggest__results .autosuggest__results_title {
  color: gray;
  font-size: 11px;
  margin-left: 0;
  padding: 15px 13px 5px;
  border-top: 1px solid lightgray;
}

.autosuggest__results .autosuggest__results_item:active,
.autosuggest__results .autosuggest__results_item:hover,
.autosuggest__results .autosuggest__results_item:focus,
.autosuggest__results
  .autosuggest__results_item.autosuggest__results_item-highlighted {
  background-color: #ddd;
}
</style>
