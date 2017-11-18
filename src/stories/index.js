import Vue from "vue";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/vue";

import Autosuggest from "../Autosuggest.vue";

const sharedData = {
  options: [
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
};

storiesOf("Autosuggest", module)
  .add("simplest", () => ({
    components: { Autosuggest },
    template: `<div>
                    <div style="padding-top:10px; margin-bottom: 10px;"><span v-if="selected">You have selected {{selected}}</span></div>
                    <div>
                        <autosuggest :suggestions="filteredOptions" :inputProps="inputProps"/>
                    </div>
                </div>`,
    data() {
      return {
        selected: "",
        filteredOptions: [],
        options: [
          {
            data: sharedData.options
          }
        ],
        inputProps: {
          id: "autosuggest__input",
          onInputChange: this.onInputChange,
          placeholder: "Type 'g'",
          onClick: () => {
            action("clicked-it");
          },
          initialValue: ""
        }
      };
    },
    methods: {
      onInputChange(text) {
        if (text === null) {
          return;
        }
        const filtered = [];
        const suggestionsData = this.options[0].data.filter(item => {
          return item.toLowerCase().indexOf(text.toLowerCase()) > -1;
        });

        suggestionsData.length > 0 &&
          filtered.push({
            data: suggestionsData
          });

        this.filteredOptions = filtered;
      }
    }
  }))
  .add("simple with section configs", () => ({
    components: { Autosuggest },
    template: `<div>
                    <div style="padding-top:10px; margin-bottom: 10px;"><span v-if="selected">You have selected {{selected}}</span></div>
                    <div>
                        <autosuggest 
                        :suggestions="filteredOptions"
                        :input-props="inputProps"
                        :section-configs="sectionConfigs"
                                />
                    </div>
                </div>`,
    data() {
      return {
        selected: "",
        limit: 10,
        filteredOptions: [],
        options: [
          {
            data: sharedData.options
          }
        ],
        sectionConfigs: {
          default: {
            limit: 6,
            onSelected: (item, originalInput) => {
              console.log(`Selected "${item.item}"`);
            }
          }
        },
        inputProps: {
          id: "autosuggest__input",
          initialValue: "",
          onClick: () => {},
          onInputChange: this.onInputChange,
          placeholder: "Type 'g'"
        }
      };
    },
    methods: {
      onInputChange(text) {
        if (text === null) {
          return;
        }

        const filtered = [];
        const suggestionsData = this.options[0].data.filter(item => {
          return item.toLowerCase().indexOf(text.toLowerCase()) > -1;
        });

        suggestionsData.length > 0 &&
          filtered.push({
            label: "Suggestions",
            data: suggestionsData
          });

        this.filteredOptions = filtered;
      }
    }
  }))
  .add("with property: initial value", () => ({
    components: { Autosuggest },
    template: `<div>
                    <div style="padding-top:10px; margin-bottom: 10px;"><span v-if="selected">You have selected {{selected}}</span></div>
                    <div>
                        <autosuggest 
                        :suggestions="filteredOptions"
                        :input-props="inputProps"
                        :section-configs="sectionConfigs"
                                />
                    </div>
                </div>`,
    data() {
      return {
        selected: "",
        limit: 10,
        filteredOptions: [],
        options: [
          {
            data: sharedData.options
          }
        ],
        sectionConfigs: {
          default: {
            limit: 6,
            onSelected: (item, originalInput) => {
              console.log(`Selected "${item.item}"`);
            }
          }
        },
        inputProps: {
          id: "autosuggest__input",
          initialValue: "math",
          onClick: () => {},
          onInputChange: this.onInputChange,
          placeholder: "Type 'g'"
        }
      };
    },
    methods: {
      onInputChange(text) {
        if (text === null) {
          return;
        }
        const filtered = [];
        const suggestionsData = this.options[0].data.filter(item => {
          return item.toLowerCase().indexOf(text.toLowerCase()) > -1;
        });

        suggestionsData.length > 0 &&
          filtered.push({
            label: "Suggestions",
            data: suggestionsData
          });

        this.filteredOptions = filtered;
      }
    }
  }));
