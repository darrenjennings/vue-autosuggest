import Vue from "vue";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/vue";

import Autosuggest from "../Autosuggest.vue";

const sharedData = {
  options: [
    "Frodo",
    "Gandalf",
    "Samwise",
    "Aragorn",
    "Galadriel",
    "Sauron",
    "Gimli",
    "Legolas",
    "Saruman",
    "Elrond",
    "Gollum",
    "Bilbo"
  ],
  methods: {
    onInputChange(text) {
      action('onInputChange')(text)
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
                        <autosuggest @input="onInputChange" :suggestions="filteredOptions" :inputProps="inputProps" @selected="onSelected" />
                    </div>
               </div>`,
    data() {
      return {
        selected: "",
        filteredOptions: [],
        options: [{ data: sharedData.options.slice(0, 10) }],
        inputProps: {
          id: "autosuggest__input",
          placeholder: "Type 'e'"
        },
        onSelected: item => {
          action("Selected")(item)
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
                        <autosuggest @input="onInputChange" :limit="5" :suggestions="filteredOptions" :inputProps="inputProps" @selected="onSelected"/>
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
        inputProps: {
          id: "autosuggest__input",
          placeholder: "Type 'g'"
        }
      };
    },
    methods: {
      onSelected(item) {
        action('Selected')(item.item);
      },
      onInputChange(text) {
        action('onInputChange')(text)
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
  .add("selected", () => ({
    components: { Autosuggest },
    template: `
              <div>
                <autosuggest 
                  ref="autosuggest" 
                  @input="onInputChange"
                  v-on:selected="onSelected"
                  :suggestions="filteredOptions" 
                  :inputProps="inputProps">
                  <template slot="header">
                    <h3 style="margin: 10px 10px 0; padding: 5px;">this is a header slot</h3>
                  </template>
                  <template slot-scope="{suggestion, index}">
                    <div>{{suggestion.item}}
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
          onClick: this.onClick,
          placeholder: "Type 'g'"
        },
        onSelected(i){
          action('Selected')(i);
        }
      };
    },
    methods: {
      onInputChange: sharedData.methods.onInputChange
    }
  }))
  .add("with property: initial value", () => ({
    components: { Autosuggest },
    template: `<div>
                    <div style="padding-top:10px; margin-bottom: 10px;"><span v-if="selected">You have selected {{selected}}</span></div>
                    <div>
                        <autosuggest v-model="query" @input="onInputChange" :suggestions="filteredOptions" :inputProps="inputProps" :sectionConfigs="sectionConfigs" />
                    </div>
                </div>`,
    data() {
      return {
        selected: "",
        limit: 10,
        query: 'Frodo',
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
              action('Selected')(item);
            }
          }
        },
        inputProps: {
          id: "autosuggest__input",
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
                            @input="onInputChange"
                            @selected="onSelected"
                            :renderSuggestion="renderSuggestion"
                            :getSuggestionValue="getSuggestionValue"
                            :inputProps="{id:'autosuggest__input', placeholder:'Do you feel lucky, punk?'}"/>
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
              { id: 3, name: "Gandalf", avatar: "https://upload.wikimedia.org/wikipedia/en/e/e9/Gandalf600ppx.jpg" },
              { id: 4, name: "Aragorn", avatar: "https://i.pinimg.com/236x/78/75/40/7875409365d056d145dfb4c32e413aad--viggo-mortensen-aragorn-lord-of-the-rings.jpg" }
            ]
          }
        ]
      };
    },
    methods: {
      onInputChange(item) {
        action('onInputChange')(item);
        if (item === null) {
          return;
        }
        const filteredData = this.suggestions[0].data.filter(option => {
          return option.name.toLowerCase().indexOf(item.toLowerCase()) > -1;
        });
        this.filteredOptions = [{ data: filteredData }];
      },
      onSelected(item) {
        action("Selected")(item);
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
                        <autosuggest ref="autosuggest" @input="onInputChange" @click="onClick" @selected="onSelected" :suggestions="filteredOptions" :inputProps="inputProps"/>
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
        inputProps: {
          id: "autosuggest__input",
          placeholder: "Type 'g'"
        }
      };
    },
    methods: {
      onSelected(item) {
        action("Selected")(item);
        item && item.item && this.add(item.item);
      },
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
                            @input="onInputChange"
\                            @selected="onSelected"
                            :renderSuggestion="renderSuggestion"
                            :inputProps="{id:'autosuggest__input', placeholder:'Do you feel lucky, punk?'}"/>
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
        action("onInputChange")(input);
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
        action("Selected")(item);
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
                  :suggestions="filteredOptions"
                  :inputProps="inputProps"
                  @input="onInputChange">
                  <template slot="before-section-default">
                    <h3 style="margin: 10px 10px 0; padding: 5px;">this is a header slot</h3>
                  </template>
                  <template slot-scope="{suggestion, index}">
                    <div>{{suggestion.item}}
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
          onClick: this.onClick,
          placeholder: "Type 'g'"
        }
      };
    },
    methods: {
      onInputChange: sharedData.methods.onInputChange
    }
  }))
  .add("multiple instances", () => ({
    components: { Autosuggest },
    template: `
              <div>
                <div style="width: 100%;">
                    <p>Tab throw each component and use arrow keys to test isolation of functionality.</p>
                </div>
                <div style="display: flex; justify-content: center;">
                  <autosuggest
                    style="display: block; width: 100%; margin-right: 1rem;"
                    :suggestions="filteredOptions[0]"
                    @input="(text) => this.onInputChange(text, 0)"
                    :inputProps="{...inputProps}">
                  </autosuggest>
                  <autosuggest
                    style="display: block; width: 100%; margin-right: 1rem;"
                    :suggestions="filteredOptions[1]"
                    :inputProps="{...inputProps}"
                    @input="(text) => this.onInputChange(text, 1)">
                  </autosuggest>
                  <autosuggest
                    style="display: block; width: 100%;"
                    :suggestions="filteredOptions[2]"
                    :inputProps="{...inputProps}"
                    @input="(text) => this.onInputChange(text, 2)">
                  </autosuggest>
                </div>
              </div>
              `,
    data() {
      return {
        selected: [],
        limit: 10,
        filteredOptions: {
          0: [],
          1: [],
          2: []
        },
        options: [
          {
            data: [...sharedData.options]
          }
        ],
        inputProps: {
          id: "autosuggest__input",
          onClick: this.onClick,
          placeholder: "Type 'g'"
        }
      };
    },
    methods: {
      onInputChange(text, index) {
        action('onInputChange')(text)
        if (text === null) {
          return;
        }
        const filteredData = this.options[0].data.filter(item => {
          return item.toLowerCase().indexOf(text.toLowerCase()) > -1;
        });

        this.filteredOptions[index] = [{ data: filteredData }];
      }
    }
  }))
  .add("with section before/after slots", () => ({
      components: { Autosuggest },
      template: `<div>
                      <div style="padding-top:10px; margin-bottom: 10px;"><span v-if="selected">You have selected {{selected}}</span></div>
                      <div>
                          <autosuggest 
                            @input="onInputChange" 
                            @selected="onSelected"
                            :limit="5"
                            :suggestions="filteredOptions"
                            :inputProps="inputProps">
                            <template slot="before-section-1" slot-scope="{section, className}">
                              <li :class="className">A Custom Section <strong style="color: blue;">Before</strong></li>
                            </template>
                            <template slot="after-section" slot-scope="{section}">
                              <li style="padding: 1rem; text-align: center; color: lightgray;">
                                Showing {{section.limit}} / {{section.data.length}}
                              </li>
                            </template>
                          </autosuggest>
                      </div>
                  </div>`,
      data() {
        return {
          selected: "",
          limit: 10,
          query: '',
          options: [
            {
              data: sharedData.options
            }
          ],
          inputProps: {
            id: "autosuggest__input",
            placeholder: "Type 'g'"
          }
        };
      },
      computed: {
        filteredOptions() {
          const suggestionsData = this.options[0].data.filter(item => {
            return item.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
          });

          return [
              {
                label: "Section 1",
                data: suggestionsData,
                limit: 2
              },
              {
                label: "Section 2",
                data: suggestionsData.map(a => `${a} ${this.rando()}` )
                  .concat(suggestionsData.map(a => `${a} ${this.rando()}`))
                  .concat(suggestionsData.map(a => `${a} ${this.rando()}`))
              }
          ]
        }
      },
      methods: {
        rando(){
          return Math.floor(Math.random() * (100 - 1)) + 1
        },
        onSelected(item) {
          action('Selected')(item.item)
          
          this.query = item.item
        },
        onInputChange(text) {
          action('onInputChange')(text)
          if (text === null) {
            return;
          }
          this.query = text
        }
      }
    }));
