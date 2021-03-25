<template>
  <div class="demo">
    <div 
      v-if="selected" 
      style="padding-top:10px; width: 100%;"
    >
      You have selected <code>{{ selected.name }}, the {{ selected.race }}</code>
    </div>
    <div class="autosuggest-container">
      <vue-autosuggest
        v-model="query"
        v-slot="{suggestion}"
        :suggestions="filteredOptions"
        :get-suggestion-value="getSuggestionValue"
        :input-props="{id:'autosuggest__input', placeholder:'Do you feel lucky, punk?'}"
        @focus="focusMe"
        @click="clickHandler"
        @selected="onSelected"
      >
        <div 
          style="display: flex; align-items: center;"
        >
          <img 
            :style="{ display: 'flex', width: '25px', height: '25px', borderRadius: '15px', marginRight: '10px'}" 
            :src="suggestion.item.avatar"
          >
          {{ Math.random().toString().split('').slice(0,3).join('') }}&nbsp;
          <div style="{ display: 'flex', color: 'navyblue'}">{{ suggestion.item.name }}</div>
        </div>
      </vue-autosuggest>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { VueAutosuggest } from "../../../../src/vue-autosuggest";

export default {
  components: {
    VueAutosuggest
  },
  setup () {
    const query = ref("")
    const selected = ref("")
    const suggestions = ref([
      {
        data: [
          { id: 1, name: "Frodo", race: "Hobbit", avatar: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/Elijah_Wood_as_Frodo_Baggins.png/220px-Elijah_Wood_as_Frodo_Baggins.png" },
          { id: 2, name: "Samwise", race: "Hobbit", avatar: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/Sean_Astin_as_Samwise_Gamgee.png/200px-Sean_Astin_as_Samwise_Gamgee.png" },
          { id: 3, name: "Gandalf", race: "Maia", avatar: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e9/Gandalf600ppx.jpg/220px-Gandalf600ppx.jpg" },
          { id: 4, name: "Aragorn", race: "Human", avatar: "https://upload.wikimedia.org/wikipedia/en/thumb/3/35/Aragorn300ppx.png/150px-Aragorn300ppx.png" }
        ]
      }
    ])
  
    const filteredOptions = computed(() => {
        console.log(suggestions.value[0].data.filter(option => {
          return option.name.toLowerCase().indexOf(query.value.toLowerCase()) > -1;
        }))

        return [
          { 
            data: suggestions.value[0].data.filter(option => {
              return option.name.toLowerCase().indexOf(query.value.toLowerCase()) > -1;
            })
          }
        ]
    })
  
    function clickHandler(item) {
      // event fired when clicking on the input
    }
    
    function onSelected(item) {
      this.selected = item.item;
    }
  
    function getSuggestionValue(suggestion) {
      return suggestion.item.name;
    }

    function focusMe(e) {
      console.log(e) // FocusEvent
    }

    return {
      query,
      selected,
      suggestions,
      filteredOptions,

      clickHandler,
      onSelected,
      getSuggestionValue,
      focusMe
    }
  }
}
</script>

<style>
.demo { 
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

input {
  width: 260px;
  padding: 0.5rem;
}

ul {
  width: 100%;
  color: rgba(30, 39, 46,1.0);
  list-style: none;
  margin: 0;
  padding: 0.5rem 0 .5rem 0;
}
li {
  margin: 0 0 0 0;
  border-radius: 5px;
  padding: 0.75rem 0 0.75rem 0.75rem;
  display: flex;
  align-items: center;
}
li:hover {
  cursor: pointer;
}

.autosuggest-container {
  display: flex;
  justify-content: center;
  width: 280px;
}

#autosuggest { width: 100%; display: block;}
.autosuggest__results-item--highlighted {
  background-color: rgba(51, 217, 178,0.2);
}
</style>