import Vue from "vue/dist/vue";
import Autosuggest from "../src/index";

describe("Autosuggest", () => {
  Vue.use(Autosuggest);

  const id = `autosuggest__input`;
  const filteredOptions = [
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
      type: "url",
      data: [
        { url: "http://bla.com/1", value: "blog link 1" },
        { url: "http://bla.com/1", value: "blog link 1" },
        { url: "http://bla.com/1", value: "blog link 1" },
        { url: "http://bla.com/1", value: "blog link 1" }
      ]
    }
  ];

  const defaultVM = {
    data() {
      return {
        selected: "",
        limit: 10,
        options: [],
        sectionConfigs: {
          default: {
            limit: 5,
            onSelected: function(item) {
              alert("default: " + item.label);
            }
          },
          url: {
            limit: 2,
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
        this.filteredOptions = filteredOptions;
      }
    }
  };

  it("can mount", async () => {
    document.body.innerHTML = `
            <div id="app">
                <vue-autosuggest 
                :suggestions="filteredOptions"
                :result-item-key="'firstname'"
                :input-props="inputProps"
                :section-configs="sectionConfigs">
                </vue-autosuggest>
            </div>
        `;

    createVm(defaultVM).then(() => {
      expect(document.body.innerHTML).toMatchSnapshot();
    });
  });

  /*
  it("can render suggestions", async () => {
    document.body.innerHTML = `
            <div id="app">
              <vue-autosuggest 
              :suggestions="filteredOptions"
              :result-item-key="'firstname'"
              :input-props="inputProps"
              :section-configs="sectionConfigs">
              </vue-autosuggest>
            </div>
        `;
    
    const searchText = "E";
    const autosuggest = await createVm(defaultVM);

    autosuggest.searchInput = searchText;

    await Vue.nextTick(() => {});

    expect(document.body.innerHTML).toMatchSnapshot();
    expect(document.body.querySelector(`#${id}`).id).toEqual(id);
    expect(document.querySelectorAll(`ul li`).length).toEqual(
      filteredOptions[0].data.length + filteredOptions[1].data.length + 1
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

  it("can limit options via 'limit' prop", async () => {
    const limit = 3;
    document.body.innerHTML = `
            <div id="app">
                <vue-autosuggest 
                  :limit="${limit}"
                  :suggestions="suggestions"
                  :on-selected="clickHandler"
                  :result-item-key="'firstname'"
                  :input-props="{id:autoSuggestInputId, initialValue: '', onInputChange:onInputChange}"
                  >
                </vue-autosuggest>
            </div>
        `;

    const searchText = "E";
    const autosuggest = await createVm(defaultVM);

    autosuggest.searchInput = searchText;

    await Vue.nextTick(() => {});

    expect(document.querySelectorAll(`ul li`).length).toEqual(limit);
    expect(document.body.innerHTML).toMatchSnapshot();
  });
*/
});

// Helper to call function x number of times
const times = x => f => {
  if (x > 0) {
    f();
    times(x - 1)(f);
  }
};

async function createVm(options = {}) {
  const vm = new Vue({
    el: "#app",
    ...options
  });

  await Vue.nextTick(() => {});
  const component = vm.$children[0];

  return component;
}
