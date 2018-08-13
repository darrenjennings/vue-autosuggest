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
  ],
  methods: {
    onInputChange(text) {
      if (text === null) {
        return;
      }
      const filteredData = this.options[0].data.filter(item => {
        return item.toLowerCase().indexOf(text.toLowerCase()) > -1;
      });
      this.filteredOptions = [{ data: filteredData }];
    }
  }
};

storiesOf("Vue-Autosuggest", module)
  .add("simplest", () => ({
    components: { Autosuggest },
    template: `<div>
                    <div style="padding-top:10px; margin-bottom: 10px;"><span v-if="selected">You have selected '{{selected}}'</span></div>
                    <div>
                        <autosuggest :suggestions="filteredOptions" :inputProps="inputProps" :onSelected="onSelected" />
                    </div>
                </div>`,
    data() {
      return {
        selected: "",
        filteredOptions: [],
        options: [{ data: sharedData.options.slice(0, 10) }],
        inputProps: {
          id: "autosuggest__input",
          onInputChange: this.onInputChange,
          initialValue: "",
          placeholder: "Type 'e'"
        },
        onSelected: item => {
          this.selected = item;
        }
      };
    },
    methods: sharedData.methods
  }))
  .add("simple with multiple sections", () => ({
    components: { Autosuggest },
    template: `<div>
                    <div style="padding-top:10px; margin-bottom: 10px;"><span v-if="selected">You have selected {{selected}}</span></div>
                    <div>
                        <autosuggest :suggestions="filteredOptions" :inputProps="inputProps" :sectionConfigs="sectionConfigs"
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
            onSelected: item => {
              console.log(`Selected "${item.item}"`);
            }
          }
        },
        inputProps: {
          id: "autosuggest__input",
          initialValue: "",
          onClick: item => {
            console.log("hold my beer", item);
          },
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
          filtered.push(
            {
              label: "Section 1",
              data: suggestionsData
            },
            {
              label: "Section 2",
              data: suggestionsData
            }
          );
        this.filteredOptions = filtered;
      }
    }
  }))
  .add("with property: initial value", () => ({
    components: { Autosuggest },
    template: `<div>
                    <div style="padding-top:10px; margin-bottom: 10px;"><span v-if="selected">You have selected {{selected}}</span></div>
                    <div>
                        <autosuggest :suggestions="filteredOptions" :inputProps="inputProps" :sectionConfigs="sectionConfigs" />
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
          onInputChange: this.onInputChange,
          placeholder: "Type 'g'"
        }
      };
    },
    methods: sharedData.methods
  }))
  .add("render with advanced styling + images", () => ({
    components: { Autosuggest },
    template: `<div>
                    <div style="padding-top:10px; margin-bottom: 10px;"><span v-if="selected">You have selected '{{JSON.stringify(selected,null,2)}}'</span></div>
                    <div>
                        <autosuggest 
                            :suggestions="filteredOptions"
                            :onSelected="onSelected"
                            :renderSuggestion="renderSuggestion"
                            :getSuggestionValue="getSuggestionValue"
                            :inputProps="{id:'autosuggest__input', onInputChange: this.onInputChange, placeholder:'Do you feel lucky, punk?'}"/>
                    </div>
                </div>`,
    data() {
      return {
        selected: "",
        filteredOptions: [],
        suggestions: [
          {
            data: [
              { id: 1, name: "Frodo", avatar: "https://upload.wikimedia.org/wikipedia/en/4/4e/Elijah_Wood_as_Frodo_Baggins.png" },
              { id: 2, name: "Samwise", avatar: "https://pbs.twimg.com/media/Cdbyw8JUIAAXY8d.jpg" },
              { id: 3, name: "Gandalf", avatar: "http://www.thelandofshadow.com/wp-content/uploads/2014/08/GandalfStaff2-200x200.jpg" },
              { id: 4, name: "Aragorn", avatar: "https://i.pinimg.com/236x/78/75/40/7875409365d056d145dfb4c32e413aad--viggo-mortensen-aragorn-lord-of-the-rings.jpg" }
            ]
          }
        ]
      };
    },
    methods: {
      onInputChange(item) {
        if (item === null) {
          return;
        }
        const filteredData = this.suggestions[0].data.filter(option => {
          return option.name.toLowerCase().indexOf(item.toLowerCase()) > -1;
        });
        this.filteredOptions = [{ data: filteredData }];
      },
      onSelected(item) {
        console.log("Selected: ", item);
        this.selected = item;
      },
      renderSuggestion(suggestion) {
        const item = suggestion.item;
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center"
            }}
          >
            <img
              style={{
                width: "25px",
                height: "25px",
                borderRadius: "15px",
                marginRight: "10px"
              }}
              src={item.avatar}
            />
            <span style={{ color: "navyblue" }}>{item.name}</span>
          </div>
        );
      },
      getSuggestionValue(suggestion) {
        return suggestion.item.name;
      }
    }
  }))
  .add("selecting from a list", () => ({
    components: { Autosuggest },
    template: `<div>
                    <div>
                        <autosuggest ref="autosuggest" :suggestions="filteredOptions" :inputProps="inputProps" :sectionConfigs="sectionConfigs"/>
                        <div v-for="item in selected">
                            <div style="display: block; width: 100%; padding: 10px; margin-right: 20px;">
                            <div style="float:left;">{{item}}</div>
                            <div style="float:right;"><button type="button" @click="remove(item)">remove</button></div>
                            </div>
                        </div>
                    </div>
                </div>`,
    data() {
      return {
        selected: [],
        limit: 10,
        filteredOptions: [],
        options: [
          {
            data: sharedData.options.slice(0, 5)
          }
        ],
        sectionConfigs: {
          default: {
            onSelected: (item, originalInput) => {
              this.add(item.item);
            }
          }
        },
        inputProps: {
          id: "autosuggest__input",
          initialValue: "math",
          onInputChange: this.onInputChange,
          onClick: this.onClick,
          placeholder: "Type 'g'"
        }
      };
    },
    methods: {
      onClick() {
        this.onInputChange("");
      },
      onInputChange: sharedData.methods.onInputChange,
      add(item) {
        this.$refs.autosuggest.searchInput = "";
        this.selected.push(item);
        this.options[0].data.splice(this.options[0].data.indexOf(item), 1);
        this.onInputChange(item);
      },
      remove(item) {
        this.options[0].data.push(item);
        this.selected.splice(this.selected.indexOf(item), 1);
        this.onInputChange(item);
      }
    }
  }))
  .add("many many options", () => ({
    components: { Autosuggest },
    template: `<div>
                    <div id="many-many-options">
                        <autosuggest
                            :suggestions="filteredOptions"
                            :onSelected="onSelected"
                            :renderSuggestion="renderSuggestion"
                            :inputProps="{id:'autosuggest__input', onInputChange: this.onInputChange, placeholder:'Do you feel lucky, punk?'}"/>
                    </div>
                </div>`,
    data() {
      return {
        selected: "",
        filteredOptions: [],
        suggestions: [],
        timeout: null
      };
    },
    created() {
      let options = [];
      for (let i = 0; i < 1000; ++i) {
        options.push(String(i));
      }
      this.suggestions = [{ data: options }];
    },
    methods: {
      onInputChange(input) {
        if (input === null) {
          return;
        }
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          const filteredData = this.suggestions[0].data.filter(option => {
            return option.indexOf(input) > -1;
          });
          this.filteredOptions = [{ data: filteredData }];
        }, 100);
      },
      onSelected(item) {
        console.log("Selected:", item);
        this.selected = item;
      },
      renderSuggestion(suggestion) {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center"
            }}
          >
            <span style={{ color: "navyblue" }}>{suggestion.item}</span>
          </div>
        );
      }
    }
  }))
  .add("Slots - Header, Footer, Suggestion", () => ({
    components: { Autosuggest },
    template: `
              <div>
                <autosuggest 
                  ref="autosuggest" 
                  :renderSuggestion="renderSuggestion"
                  :suggestions="filteredOptions" 
                  :inputProps="inputProps" 
                  :sectionConfigs="sectionConfigs">
                  <template slot="header">
                    <h3 style="margin: 10px 10px 0; padding: 5px;">this is a header slot</h3>
                  </template>
                  <template slot-scope="{suggestion, index}">
                    <div>{{suggestion.item}}, suggestion slot 
                      <span :style="{color: colors[Math.floor(Math.random()*colors.length)]}">style</span> 
                      <span :style="{color: colors[Math.floor(Math.random()*colors.length)]}">me</span> 
                      <span :style="{color: colors[Math.floor(Math.random()*colors.length)]}">pretty</span> 
                    </div>
                  </template>
                  <template slot="footer">
                    <h3 style="margin: 10px 10px 0; padding: 5px;">this is a footer slot</h3>
                  </template>
                </autosuggest>
              </div>
              `,
    data() {
      return {
        selected: [],
        colors: [
          '#1abc9c',
          '#2ecc71',
          '#3498db',
          '#9b59b6',
          '#34495e',
          '#f1c40f',
          '#e74c3c',
          '#7f8c8d',
          '#C4E538',
          '#0652DD',
          '#9980FA',
          '#EA2027',
        ],
        limit: 10,
        filteredOptions: [],
        options: [
          {
            data: [...sharedData.options]
          }
        ],
        inputProps: {
          id: "autosuggest__input",
          onInputChange: this.onInputChange,
          onClick: this.onClick,
          placeholder: "Type 'g'"
        }
      };
    },
    methods: {
      onInputChange: sharedData.methods.onInputChange,
      renderSuggestion(suggestion) {
        const item = suggestion.item;
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center"
            }}
          >
            d - {item}
          </div>
        );
      },
    }
  }));
