import { mount, shallow } from "vue-test-utils";
import { createRenderer } from "vue-server-renderer";

import Autosuggest from "../src/Autosuggest.vue";

Element.prototype.scrollTo = () => {}  // https://github.com/vuejs/vue-test-utils/issues/319

// Helper to call function x number of times
const times = x => f => {
  if (x > 0) {
    f();
    times(x - 1)(f);
  }
};

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
    inputProps: {
      id,
      initialValue: "",
      onClick: () => {},
      onInputChange: () => {},
      placeholder: "Type 'G'"
    },
    sectionConfigs: {
      default: {
        limit: 5,
        onSelected: () => {}
      }
    }
  };


  it("can mount", () => {
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

  
  it("can be readonly", () => {
    const wrapper = mount(Autosuggest, {
      propsData: {
        ...defaultProps,
        readonly: true,
      }
    });

    const input = wrapper.find("input");
    expect(input.attributes().readonly).toBeTruthy();
    
  })

  it("can be readonly", () => {
    const wrapper = mount(Autosuggest, {
      propsData: {
        ...defaultProps,
        readonly: false,
      }
    });

    const input = wrapper.find("input");
    expect(input.attributes().readonly).toBeFalsy();
    
  })

  it("can render suggestions", () => {
    const wrapper = mount(Autosuggest, {
      propsData: defaultProps
    });

    const input = wrapper.find("input");
    expect(input.attributes("id", defaultProps.inputProps.id)).toBeTruthy();

    input.trigger("click");
    wrapper.setData({ searchInput: "G" });
    input.trigger("keydown.down");

    expect(wrapper.findAll(`ul li`).length).toBeLessThanOrEqual(
      defaultProps.sectionConfigs.default.limit
    );

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) {
        return false;
      }
      expect(str).toMatchSnapshot();
    });
  });

  it("can use escape key to exit", async () => {
    const wrapper = mount(Autosuggest, {
      propsData: defaultProps
    });

    const input = wrapper.find("input");
    input.trigger("click");
    wrapper.setData({ searchInput: "G" });
    input.trigger("keydown.down");

    expect(wrapper.findAll(`ul li`).length).toBeLessThanOrEqual(
      defaultProps.sectionConfigs.default.limit
    );

    input.trigger("keydown.esc");

    expect(wrapper.findAll(`ul li`).length).toEqual(0);

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) {
        return false;
      }
      expect(str).toMatchSnapshot();
    });
  });

  it("can select from suggestions using keystroke", async () => {
    const wrapper = mount(Autosuggest, {
      propsData: defaultProps,
      attachToDocument: true
    });

    const input = wrapper.find("input");
    input.trigger("click");
    wrapper.setData({ searchInput: "G" });

    times(5)(() => {
      input.trigger("keydown.down");
    });

    times(5)(() => {
      input.trigger("keydown.up");
    });

    input.trigger("keydown.enter");

    await wrapper.vm.$nextTick(() => {});

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) {
        return false;
      }
      expect(str).toMatchSnapshot();
    });
  });

  it("can click outside document to trigger close", async () => {
    const props = Object.assign({}, defaultProps);

    const wrapper = mount(Autosuggest, {
      propsData: props,
      attachToDocument: true
    });

    wrapper.setData({ searchInput: "G" });

    const input = wrapper.find("input");

    input.trigger("click");
    wrapper.setData({ searchInput: "G" });
    window.document.dispatchEvent(new Event("mouseup"));

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) {
        return false;
      }
      expect(str).toMatchSnapshot();
    });
  });

  it("can display section header", async () => {
    const props = Object.assign({}, defaultProps);
    props.sectionConfigs = {
      default: {
        label: "Suggestions",
        limit: 5,
        onSelected: () => {}
      }
    };
    const wrapper = mount(Autosuggest, {
      propsData: props,
      attachToDocument: true
    });

    wrapper.setData({ searchInput: "G" });

    const input = wrapper.find("input");

    input.trigger("click");
    wrapper.setData({ searchInput: "G" });
    expect(wrapper.find("ul li:nth-child(1)").element.innerHTML).toBe(
      props.sectionConfigs.default.label
    );
    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) {
        return false;
      }
      expect(str).toMatchSnapshot();
    });
  });

  it("is aria complete", async () => {
    const wrapper = mount(Autosuggest, {
      propsData: defaultProps
    });

    const input = wrapper.find("input");
    expect(input.attributes('aria-autosuggest','list')).toBeTruthy();
    expect(input.attributes('aria-activedescendant', '')).toBeTruthy();
    expect(input.attributes('aria-owns', 'autosuggest__results')).toBeTruthy();   
    
    // TODO: Make sure aria-completeness is actually 2legit2quit.
    
    input.trigger("click");
    wrapper.setData({ searchInput: "G" });

    expect(input.attributes('aria-haspopup', 'true')).toBeTruthy();
    
    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) {
        return false;
      }
      expect(str).toMatchSnapshot();
    });
  });

  it("can render simplest component with single onSelected", async () => {
    const props = Object.assign({}, defaultProps);
    props.inputProps = Object.assign({}, defaultProps.inputProps);
    props.inputProps.class = "cool-class";
    props.suggestions = filteredOptions;

    delete props.suggestions[0].name; // ensure empty component name is OK
    delete props.sectionConfigs; // ensure empty sectionConfigs is OK
    delete props.inputProps.onClick; // ensure empty onClick is OK

    props.onSelected = () => {};

    const wrapper = mount(Autosuggest, {
      propsData: props,
      attachToDocument: true
    });

    const input = wrapper.find("input");
    input.trigger("click");
    wrapper.setData({ searchInput: "G" });
    
    times(3)(() => {
        input.trigger("keydown.down");
    });
  
    input.trigger("keydown.enter");
    wrapper.find('li').trigger("mouseover");
    wrapper.find('li').trigger("mouseenter");
    wrapper.find('li').trigger("mouseleave");

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) {
        return false;
      }
      expect(str).toMatchSnapshot();
    });
  });
});

/**
 * **Force** update until vue-test-utils is out of beta
 * @param {*} wrapper mounted Vue component
 */
function runWatchers(wrapper) {
  wrapper.vm._watchers.forEach(watcher => {
    watcher.run();
  });
}
