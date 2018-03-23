import { mount, shallow } from "vue-test-utils";
import { createRenderer } from "vue-server-renderer";

import Autosuggest from "../src/Autosuggest.vue";

Element.prototype.scrollTo = () => {}; // https://github.com/vuejs/vue-test-utils/issues/319

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
    expect(input.attributes()["role"]).toBe("combobox");
    expect(input.attributes()["aria-autocomplete"]).toBe("list");
    expect(input.attributes()["aria-activedescendant"]).toBe("");
    expect(input.attributes()["aria-owns"]).toBe("autosuggest__results");
    expect(input.attributes()["aria-owns"]).toBe("autosuggest__results");

    // TODO: Make sure aria-completeness is actually 2legit2quit.

    input.trigger("click");
    wrapper.setData({ searchInput: "G" });

    expect(input.attributes()["aria-haspopup"]).toBe("true");

    const mouseDownTimes = 3;
    times(mouseDownTimes)(() => {
      input.trigger("keydown.down");
    });

    const activeDescendentString = input.attributes()["aria-activedescendant"];
    expect(parseInt(activeDescendentString[activeDescendentString.length - 1])).toBe(
      mouseDownTimes - 1
    );
    expect(input.element.value).toBe(filteredOptions[0].data[mouseDownTimes - 1]);

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
    wrapper.find("li").trigger("mouseover");
    wrapper.find("li").trigger("mouseenter");
    wrapper.find("li").trigger("mouseleave");

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) {
        return false;
      }
      expect(str).toMatchSnapshot();
    });
  });

  it("onBlur and onFocus work as expected", async () => {
    let props = Object.assign({}, defaultProps);

    const mockFn = jest.fn();
    const mockConsole = jest.fn();

    console.warn = mockConsole;

    const blurred = () => {
      mockFn();
    };
    const focused = () => {
      mockFn();
    };

    props.inputProps.onBlur = blurred;
    props.inputProps.onFocus = focused;

    const wrapper = mount(Autosuggest, {
      propsData: props,
      attachToDocument: true
    });

    const input = wrapper.find("input");

    input.trigger("click");
    wrapper.setData({ searchInput: "G" });
    await wrapper.vm.$nextTick(() => {});

    input.trigger("blur");
    input.trigger("focus");

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) {
        return false;
      }
      expect(str).toMatchSnapshot();
    });

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockConsole).toHaveBeenCalledTimes(2);
  });
});
