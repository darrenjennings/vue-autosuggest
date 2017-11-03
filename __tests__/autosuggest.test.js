import { mount, shallow, createLocalVue } from "vue-test-utils";
import Autosuggest from "../src/Autosuggest";
import { createRenderer } from "vue-server-renderer";

describe("Autosuggest", () => {
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
    }
  ];

  const defaultProps = {
    suggestions: filteredOptions,
    resultItemKey: "firstname",
    inputProps: {
      id: "autosuggest__input",
      initialValue: "",
      onClick: () => {},
      onInputChange: text => {},
      placeholder: "Type 'G'"
    },
    sectionConfigs: {
      default: {
        limit: 5,
        onSelected: function(item) {
          alert("default: " + item.label);
        }
      }
    }
  };

  it("can mount", async () => {
    const props = Object.assign({}, defaultProps);
    props.inputProps = Object.assign({}, defaultProps.inputProps);
    props.suggestions = [filteredOptions[0]];

    const wrapper = shallow(Autosuggest, {
      propsData: props
    });

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) throw new Error(err);
      expect(str).toMatchSnapshot();
    });
  });

  it("can render suggestions", async () => {
    const wrapper = mount(Autosuggest, {
      propsData: defaultProps
    });

    const input = wrapper.find("input");
    expect(input.hasAttribute("id", defaultProps.inputProps.id));

    input.trigger("click");
    wrapper.setData({ searchInput: "G" });
    input.trigger("keydown.down");
    
    expect(wrapper.findAll(`ul li`).length).toBeLessThanOrEqual(defaultProps.sectionConfigs.default.limit);

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot();
    });
  });
  /*
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
