<template>
  <div class="demo">
    <button @click="toggleDark">go {{ colorMode === 'light' ? 'dark' : 'light' }}</button>
    <h1>🔍 Vue-autosuggest</h1>
    <div>
      <vue-autosuggest
        v-model="searchText"
        @selected="onSelected"
        :suggestions="filteredOptions"
        :input-props="inputProps"
        :section-configs="sectionConfigs"
        :getSuggestionValue="getSuggestionValue"
        :should-render-suggestions="(size, loading) => size >= 0 && !loading && searchText !== ''"
        ref="autocomplete"
      >
        <template slot-scope="{suggestion, index, cs}">
          <div>{{ suggestion && suggestion.item.Name }}</div>
        </template>
        <template slot="after-suggestions">
          <p v-if="filteredOptions == 0" style="text-align: center;">No Results...</p>
        </template>
      </vue-autosuggest>
    </div>
    <div style="padding-top:10px; margin-bottom: 10px;">
      <span
        v-if="selected.Race === 'Human' && selected.Name === 'Aragorn I'"
      >"Not idly do the leaves of Lórien fall," proclaimed Aragorn.</span>
      <span v-else-if="selected.Race === 'Human'">
        You have choosen poorly. Humans
        are like... the worst.
      </span>
      <span
        v-else-if="selected.Race === 'Elf' && selected.Name === 'Legolas'"
      >Legolas is like... so hawt.</span>
      <span v-else-if="selected.Race === 'Elf' && selected.Name === 'Galadriel'">
        "Things that were... things that are... and some things... that have not
        yet come to pass." Wait... is that in the book?!
      </span>
      <span v-else-if="selected.Race === 'Dwarf' && selected.Name === 'Gimli'">And with my axe!</span>
      <span v-else-if="selected.Race === 'Dwarf'">What is the plural of Dwarf anyways?</span>
      <span v-else-if="selected.Race === 'Maiar' && selected.Name === 'Gandalf'">
        The counsel of Gandalf was not founded on foreknowledge of safety, for
        himself or for others," said Aragorn. "There are some things that it is
        better to begin than to refuse, even though the end may be dark."
      </span>
      <span v-else-if="selected.Race === 'Hobbit'">Sneaky little Hobbitses. Wicked. Tricksy.</span>
    </div>
  </div>
</template>

<script>
import VueAutosuggest from "../src/Autosuggest.vue";
import characters from './lotr-character'

function updateCSSVariables(theme) {
  for (const key in theme) {
    document.body.style.setProperty(`--theme-${key}`, theme[key]);
  }
}

const darkTheme = {
  bg: '#21222C',
  header: '#8F73BD',
  item_color_highlighted: '#80D4E7',
  item_bg_highlighted: '#363948'
}

const races = [...new Set(characters.map(c => { return c.Race }))]

export default {
  components: {
    VueAutosuggest
  },
  mounted(){
    updateCSSVariables(darkTheme)
  },
  data() {
    return {
      selected: "",
      searchText: "",
      colorMode: 'dark',
      options: races.map(r => ({
        	label: r,
          name: r,
          data: characters.filter(c => c.Race === r)
        })
      ),
      sectionConfigs: {
        default: {
          limit: 4
        },
        hobbits: {
          limit: 6
        }
      },
      inputProps: {
        id: "autosuggest__input",
        placeholder: "Search"
      }
    };
  },
  computed: {
    filteredOptions() {
      const filtered = []
      if(!this.searchText){
        return []
      }
      races.forEach(r => {
        const people = this.options.filter(o => o.name === r)[0].data.filter(p => {
          return p.Name.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1;
        });

        people.length > 0 &&
          filtered.push({
            label: r,
            data: people
          });
      })

      return Object.freeze(filtered)
    }
  },
  methods: {
    toggleDark(){
      this.colorMode = ((this.colorMode === 'dark') ? 'light' : 'dark')
      if(this.colorMode === 'dark'){
        updateCSSVariables({
          bg: '#21222C',
          color: 'white',
          header: '#8F73BD',
          item_color_highlighted: '#80D4E7',
          item_bg_highlighted: '#363948',
        })
      }else{
        updateCSSVariables({
          bg: 'white',
          header: 'black',
          color: '#21222C',
          item_color_highlighted: 'black',
          item_bg_highlighted: '#e0e0e0',
        })
      }
    },

    getSuggestionValue(item) {
      return item.item.Name;
    },

    onSelected(item) {
      if(!item){
        return
      }
      this.selected = item.item
    }
  }
};
</script>

<style rel="stylesheet">
button {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  background: var(--theme-bg);
  color: var(--theme-color);
  text-transform: uppercase;
  font-weight: 700;
  font-size: .66rem;
  white-space: nowrap;
  border: 3px solid var(--theme-color);
  border-radius: 2rem;
  padding: .2rem .85rem .25rem .85rem;
  cursor: pointer;
}

h1 {
  color: var(--theme-header);
}

* {
  transition: height 0.200s linear;
  transition: border-color linear 0.1s;
}

#autosuggest__input {
  background-color: var(--theme-bg);
  caret-color: #ddd;
  color: var(--theme-color);
  position: relative;
  display: block;
  font-family: monospace;
  font-size: 20px;
  border: 1px solid #616161;
  border-radius: 3px;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
}

#autosuggest__input.autosuggest__input--open, #autosuggest__input:hover {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid lightgray;
}

.autosuggest__results-container {
  position: relative;
  width: 100%;
  background-color: var(--theme-bg);
  
}

.autosuggest__results {
  background-color: var(--theme-bg);
  font-weight: 300;
  margin: 0;
  position: absolute;
  z-index: 10000001;
  width: 100%;
  border: 1px solid #e0e0e0;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  padding: 0px;
  overflow: scroll;
  max-height: 400px;
}

.autosuggest__results ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
  background-color: var(--theme-bg);
}

.autosuggest__results .autosuggest__results-item {
  cursor: pointer;
  background-color: var(--theme-bg);
  padding: 10px;
}

#autosuggest ul:nth-child(1) > .autosuggest__results-before {
  border-top: none;
}

.autosuggest__results .autosuggest__results-before {
  color: var(--theme-color);
  opacity: 0.5;
  font-size: 11px;
  margin-left: 0;
  padding: 15px 13px 5px;
  border-top: 1px solid lightgray;
}

.autosuggest__results .autosuggest__results-item:active,
.autosuggest__results .autosuggest__results-item:hover,
.autosuggest__results .autosuggest__results-item:focus,
.autosuggest__results .autosuggest__results-item.autosuggest__results-item--highlighted {
  background-color: var(--theme-item_bg_highlighted);
  color: var(--theme-item_color_highlighted);
}
</style>
