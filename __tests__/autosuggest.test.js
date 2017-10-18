import Vue from "vue/dist/vue";
import Autosuggest from "../src/index";

describe("Autosuggest", () => {
  Vue.use(Autosuggest);

  const suggestions = [
    { firstname: "Frodo", lastname: "Baggins" },
    { firstname: "Samwise", lastname: "Gamgee" },
    { firstname: "Gandalf", lastname: "the Grey" },
    { firstname: "Gollum", lastname: "" },
    { firstname: "Glorfindel", lastname: "" },
    { firstname: "Galadriel", lastname: "" },
    { firstname: "Faramir", lastname: "Second Son of Denethor II" },
    { firstname: "Boromir", lastname: "First Son of Denother II" }
  ];

  const id = `autosuggest__input`;

  const defaultVM = {
    data: () => {
      return {
        autoSuggestInputId: id,
        suggestions: suggestions,
        results: suggestions
      };
    },
    methods: {
      onInputChange(text) {
        this.suggestions = this.results.filter(person => {
          return (
            person.firstname.toLowerCase().indexOf(text.toLowerCase()) > -1
          );
        });
      },
      clickHandler(e) {
        let value = window.document.getElementById(this.autoSuggestInputId)
          .value;
        this.selected = value;
      }
    }
  };

  it("can mount", async () => {
    document.body.innerHTML = `
            <div id="app">
                <vue-autosuggest 
                  :suggestions="[]"
                  :on-selected="function(){}"
                  :current-query="'cool things'"
                  :placeholder="'placeholder'"
                  :input-props="{
                    onInputChange: function(){}
                  }">
                </vue-autosuggest>
            </div>
        `;

    createVm().then(() => {
      expect(document.body.innerHTML).toMatchSnapshot();
    });
  });

  it("can render suggestions", async () => {
    document.body.innerHTML = `
            <div id="app">
                <vue-autosuggest 
                  :suggestions="suggestions"
                  :on-selected="clickHandler"
                  :result-item-key="'firstname'"
                  :input-props="{id:autoSuggestInputId, initialValue: '', onInputChange:onInputChange}"
                  >
                </vue-autosuggest>
            </div>
        `;

    await createVm(defaultVM);
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(document.body.querySelector(`#${id}`).id).toEqual(id);
    expect(document.querySelectorAll(`ul li`).length).toEqual(
      suggestions.length
    );
  });

  it("can filter suggestions", async () => {
    document.body.innerHTML = `
            <div id="app">
                <vue-autosuggest 
                  :suggestions="suggestions"
                  :on-selected="clickHandler"
                  :result-item-key="'firstname'"
                  :input-props="{id:autoSuggestInputId, initialValue: '', onInputChange:onInputChange}"
                  >
                </vue-autosuggest>
            </div>
        `;

    const searchText = "Samwise";
    const autosuggest = await createVm(defaultVM);
    autosuggest.searchInput = searchText;

    await Vue.nextTick(() => {});

    expect(document.body.innerHTML).toMatchSnapshot();
    expect(document.querySelectorAll(`ul li`).length).toEqual(
      suggestions.filter(person => {
        return (
          person.firstname.toLowerCase().indexOf(searchText.toLowerCase()) > -1
        );
      }).length
    );
  });

  it("can select from suggestions using keystroke", async () => {
    document.body.innerHTML = `
            <div id="app">
                <vue-autosuggest 
                  :suggestions="suggestions"
                  :on-selected="clickHandler"
                  :result-item-key="'firstname'"
                  :input-props="{id:autoSuggestInputId, initialValue: '', onInputChange:onInputChange}"
                  >
                </vue-autosuggest>
            </div>
        `;

    const searchText = "F";
    const autosuggest = await createVm(defaultVM);

    autosuggest.searchInput = searchText;

    await Vue.nextTick(() => {});

    expect(document.querySelectorAll(`ul li`).length).toEqual(
      suggestions.filter(person => {
        return (
          person.firstname.toLowerCase().indexOf(searchText.toLowerCase()) > -1
        );
      }).length
    );

    const input = document.querySelector('input');

    var event = new KeyboardEvent('keydown', {'keyCode': 40});
    times(10)(() => {input.dispatchEvent(event)}); 
    autosuggest._watcher.run();
    await Vue.nextTick(() => {});
    
    const clickEvent = new Event('mouseup');
    document.dispatchEvent(clickEvent);
    autosuggest._watcher.run();

    await Vue.nextTick(() => {});
    expect(document.body.innerHTML).toMatchSnapshot();
  });
});

// Helper to call function x number of times
const times = x => f => {
  if (x > 0) {
    f()
    times (x - 1) (f)
  }
}

async function createVm(options = {}) {
  const vm = new Vue({
    el: "#app",
    ...options
  });

  await Vue.nextTick(() => {});
  const component = vm.$children[0];

  return component;
}
