import { mount, shallowMount } from "@vue/test-utils";
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
      placeholder: "Type 'G'"
    },
    sectionConfigs: {
      default: {
        limit: 5,
        onSelected: () => {}
      }
    }
  };

  const defaultListeners = {
    click: () => {}
  };

  it("can mount", () => {
    const props = Object.assign({}, defaultProps);
    props.inputProps = Object.assign({}, defaultProps.inputProps);

    props.suggestions = [filteredOptions[0]];

    const wrapper = shallowMount(Autosuggest, {
      propsData: props
    });

    const input = wrapper.find('input[type="text"]')
    input.setValue('q')

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) throw new Error(err);
      expect(str).toMatchSnapshot();
    });
  });

  it("can render suggestions", () => {
    const props = Object.assign({}, defaultProps);
    props.inputProps = Object.assign({}, defaultProps.inputProps);

    const wrapper = mount(Autosuggest, {
      propsData: props,
      attachToDocument: true
    });

    const input = wrapper.find("input");
    expect(input.attributes("id", defaultProps.inputProps.id)).toBeTruthy();

    input.trigger("click");
    input.setValue("G");
    input.trigger("keydown.down");

    expect(wrapper.findAll(`ul li`).length).toBeLessThanOrEqual(
      defaultProps.sectionConfigs.default.limit
    );

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) throw new Error(err);
      expect(str).toMatchSnapshot();
    });
  });

  it("can use escape key to exit", async () => {
    const wrapper = mount(Autosuggest, {
      propsData: defaultProps,
      listeners: defaultListeners
    });

    const input = wrapper.find("input");
    input.trigger("click");
    input.setValue("G");
    input.trigger("keydown.up"); // Check it doesn't offset the selection by going up first when nothing is selected.

    // TODO: test these keys are actually returning early.
    input.trigger("keydown", {
      keyCode: 16 // Shift
    });
    input.trigger("keydown", {
      keyCode: 9 // Tab
    });
    input.trigger("keydown", {
      keyCode: 18 // alt/option
    });
    input.trigger("keydown", {
      keyCode: 91 // OS Key
    });
    input.trigger("keydown", {
      keyCode: 93 // Right OS Key
    });

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
    input.setValue("G");

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

  it("can interact with results of specific instance when multiple instances exist", async () => {
    const multipleAutosuggest = {
      components: {
        Autosuggest
      },
      data () {
        return {
          autosuggestProps: defaultProps,
          automatischsuchen: true
        }
      },
      render(h) {
        return h(
          "div",
          [
            h(
              Autosuggest,
              {
                props: this.autosuggestProps
              }
            ),
            h(
              Autosuggest,
              {
                props: this.autosuggestProps
              }
            )
          ]
        );
      }
    }
    const wrapper = mount(multipleAutosuggest, {
      attachToDocument: true 
    });

    const autosuggestInstances = wrapper.findAll(Autosuggest);

    const autosuggest1 = autosuggestInstances.at(0);
    const autosuggest2 = autosuggestInstances.at(1);
    const input1 = autosuggest1.find("input");
    const input2 = autosuggest2.find("input");

    input1.trigger("click");
    input2.trigger("click");
    
    expect(autosuggest1.findAll("li.autosuggest__results-item").length).toBe(5);
    expect(autosuggest1.findAll("li.autosuggest__results-item").length).toBe(5);

    times(2)(() => {
      input2.trigger("keydown.down");
    });

    expect(autosuggest1.findAll("li.autosuggest__results-item--highlighted").length).toBe(0);
    expect(autosuggest2.findAll("li.autosuggest__results-item--highlighted").length).toBe(1);
    expect(autosuggest2.findAll("li").at(1).classes()).toContain("autosuggest__results-item--highlighted");

    input2.trigger("keydown.enter");

    expect(input1.element.value).toBe("");
    expect(input2.element.value).toBe("friendly chemistry");
  });

  it("can click outside document to trigger close", async () => {
    const props = Object.assign({}, defaultProps);

    const wrapper = mount(Autosuggest, {
      propsData: props,
      listeners: defaultListeners,
      attachToDocument: true
    });

    const input = wrapper.find("input");
    input.setValue("G");

    input.trigger("click");
    input.setValue("G");
    window.document.dispatchEvent(new Event("mousedown"));
    window.document.dispatchEvent(new Event("mouseup"));
    
    await wrapper.vm.$nextTick(() => {});

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
      listeners: defaultListeners,
      attachToDocument: true
    });

    const input = wrapper.find("input");
    input.setValue("G");

    input.trigger("click");
    input.setValue("G");
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
    input.setValue("G");

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
    input.setValue("G");

    times(3)(() => {
      input.trigger("keydown.down");
    });

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

  it("can render default suggestion value by property name", async () => {
    const props = Object.assign({}, defaultProps);
    props.inputProps = Object.assign({}, defaultProps.inputProps);
    props.inputProps.class = "cool-class";
    props.suggestions = [
      {
        data: [
          {
            id: 1,
            name: "Frodo",
            avatar:
              "https://upload.wikimedia.org/wikipedia/en/4/4e/Elijah_Wood_as_Frodo_Baggins.png"
          }
        ]
      }
    ];

    props.onSelected = () => {};

    const wrapper = mount(Autosuggest, {
      propsData: props,
      attachToDocument: true
    });

    const input = wrapper.find("input");
    input.trigger("click");
    input.setValue("F");

    input.trigger("keydown.down");
    input.trigger("keydown.enter");

    await wrapper.vm.$nextTick(() => {});

    expect(input.element.value).toBe("Frodo");

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) {
        return false;
      }
      expect(str).toMatchSnapshot();
    });
  });

  it("changes input attributes", () => {
    const props = { ...defaultProps };
    props.inputProps = { ...defaultProps.inputProps, name: "my-input" };

    const wrapper = mount(Autosuggest, {
      propsData: props
    });

    const input = wrapper.find("input");
    expect(input.attributes()["name"]).toBe("my-input");
  });

  it("search input prop type handles string and integers only", async () => {
    let props = {
      ...defaultProps, 
      inputProps: {...defaultProps.inputProps}
    };

    const mockConsole = jest.fn();
    console.error = mockConsole;

    const blurred = () => {};
    props.inputProps.onBlur = blurred;

    const wrapper = mount(Autosuggest, {
      propsData: props
    });

    const input = wrapper.find("input");

    // Integers
    input.trigger("click");
    input.setValue(1);
    await wrapper.vm.$nextTick(() => {});
    input.trigger("blur");

    // Strings
    input.trigger("click");
    input.setValue("Hello");
    await wrapper.vm.$nextTick(() => {});
    input.trigger("blur");

    // Should not throw any errors
    expect(mockConsole).toHaveBeenCalledTimes(0);

    // Functions
    input.trigger("click");
    wrapper.setData({ searchInput: () => { /* BAD */ } });
    await wrapper.vm.$nextTick(() => {});
    input.trigger("blur");
    
    // Should throw validation error
    expect(mockConsole).toHaveBeenCalled();
  });

  it("can render slots", async () => {
    const wrapper = mount(Autosuggest, {
      propsData: defaultProps,
      slots: {
        'before-suggestions': '<div class="header-dude"></div>',
        'after-suggestions': '<div id="footer-dude"><span>1</span><span>2</span></div>'
      },
      scopedSlots: {
        default: `
          <h1 slot-scope="{suggestion}">{{ suggestion.item }}</h1>
        `
      },
      attachToDocument: true
    });

    const input = wrapper.find("input");
    input.trigger("click");
    input.setValue("G");
    
    expect(wrapper.findAll('.header-dude').length).toEqual(1);
    expect(wrapper.findAll('#footer-dude span').length).toEqual(2);
    expect(wrapper.findAll('h1').length).toEqual(5);

    await wrapper.vm.$nextTick(() => {});

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) {
        return false;
      }
      expect(str).toMatchSnapshot();
    });
  });
  
  it("can render section slots", async () => {
    const props = { ...defaultProps };
    props.suggestions.push({ name: 'dogs', data: ['spike', 'bud', 'rover']})
    props.suggestions.push({ name: 'cats', data: ['sassy', 'tuesday', 'church']})
    props.suggestions.push({ name: 'zeu', data: ['elephant', 'lion']})
    props.suggestions.push({ name: 'Uhh', data: ['something', 'something2']})

    props.sectionConfigs = {
      default: {
        label: "Suggestions",
        limit: 5,
        onSelected: () => {}
      },
      Uhh: {
        label: "uhh"
      },
    };
    const wrapper = mount(Autosuggest, {
      propsData: props,
      attachToDocument: true,
      scopedSlots: {
        'before-section-dogs': `<li :class="props.className">The Dogs</li>`,
        'before-section-cats': `<li>Moar Cats is good</li>`,
        'before-section-zeu': `<li>zoo animals?</li>`
      },
    });

    const input = wrapper.find("input");
    input.setValue("G");

    input.trigger("click");
    input.setValue("G");
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

  it("can customize ids and classes for container divs", async () => {
    const wrapper = mount(Autosuggest, {
      propsData: {
        ...defaultProps,
        class: "containerz",
        'component-attr-id-autosuggest': "automatischsuchen",
        'component-attr-class-autosuggest-results-container': 'resultz-containerz',
        'component-attr-class-autosuggest-results': 'resultz'
      },
      attachToDocument: true
    });
    
    const input = wrapper.find("input");
    input.trigger("click");
    input.setValue("G");

    expect(wrapper.find('#automatischsuchen').is('div')).toBe(true);
    expect(wrapper.find('.containerz').is('div')).toBe(true);
    expect(wrapper.find('.resultz-containerz').is('div')).toBe(true);
    expect(wrapper.find(`#${defaultProps.inputProps.id}`).is('input')).toBe(true);

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) {
        return false;
      }
      expect(str).toMatchSnapshot();
    });
  });
  
  it("can customize css prefix", async () => {
    const wrapper = mount(Autosuggest, {
      propsData: {
        ...defaultProps,
        class: "containerz",
        'component-attr-prefix': 'v',
        'component-attr-id-autosuggest': "the-whole-thing",
        'component-attr-class-autosuggest-results-container': 'the-results-container',
        'component-attr-class-autosuggest-results': 'the-results',
        inputProps: {
          ...defaultProps.inputProps,
          id: 'the-input-thing',
        }
      },
      attachToDocument: true
    });
    
    const input = wrapper.find("input");
    input.trigger("click");
    input.setValue("G");

    // Make sure the prefixes still allow for custom css/id's
    expect(wrapper.find('#the-whole-thing').is('div')).toBe(true);
    expect(wrapper.find('#the-input-thing').is('input')).toBe(true);
    expect(wrapper.find('.the-results-container').is('div')).toBe(true);
    expect(wrapper.find('.the-results').is('div')).toBe(true);
    
    // Prefix checks
    expect(wrapper.find('#v__results-item--0').is('li')).toBeTruthy()
    expect(wrapper.find('.v__results-item').is('li')).toBeTruthy()

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) {
        return false;
      }
      expect(str).toMatchSnapshot();
    });
  });

  it("@click and @selected listener events works as expected", async () => {
    let props = Object.assign({}, defaultProps);

    delete props['sectionConfigs']

    const mockFn = jest.fn();
    const mockConsole = jest.fn();

    console.warn = mockConsole;

    const wrapper = mount(Autosuggest, {
      propsData: props,
      listeners: {
        click: e => {
          mockFn(e);
        },
        selected: e => {
          mockFn(e);
        }
      },
      attachToDocument: true
    });

    await wrapper.vm.$nextTick(() => {});

    const input = wrapper.find("input");
    input.trigger("click");
    wrapper.setData({ searchInput: "F" });

    input.trigger("keydown.down");
    input.trigger("keydown.enter");

    expect(input.element.value).toBe("clifford kits");

    expect(mockConsole).toHaveBeenCalledTimes(0);
    expect(mockFn).toHaveBeenCalledTimes(2);

    const renderer = createRenderer();

    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) {
        return false;
      }
      expect(str).toMatchSnapshot();
    });
  });

  it("tears down event listeners", async () => {
    let props = {...defaultProps};

    delete props['sectionConfigs']

    const AEL = jest.fn();
    const REL = jest.fn();

    window.document.addEventListener = AEL
    window.document.removeEventListener = REL

    const wrapper = mount(Autosuggest, {
      propsData: props,
      attachToDocument: true
    });

    wrapper.destroy()
    expect(AEL).toHaveBeenCalledTimes(2)
    expect(REL).toHaveBeenCalledTimes(2)
  });

  it("can modify input type attribute", async () => {
    const props = Object.assign({}, defaultProps);
    props.inputProps = {
      ...defaultProps.inputProps,
      type: 'search'
    };

    props.suggestions = [filteredOptions[0]];

    const wrapper = shallowMount(Autosuggest, {
      propsData: props
    });

    const input = wrapper.find('input[type="search"]')
    expect(input.is('input')).toBe(true)
    expect(input.attributes("type", 'search')).toBeTruthy();

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) throw new Error(err);
      expect(str).toMatchSnapshot();
    });
  });
  
  it("can modify input props", async () => {
    const Parent = {
      template: `<div>
       <Autosuggest
        :suggestions="[{data:['Frodo']}]"
        :input-props="{id:'autosuggest', placeholder: ph}" />
      </div>
      `,
      components: { Autosuggest },
      data: () => {
        return {
          'ph': 'Type here...'
        }
      }
    }

    const wrapper = mount(Parent);
    const input = wrapper.find('input[type="text"]')
    expect(input.attributes("placeholder")).toBe('Type here...');
    
    wrapper.setData({ ph: 'Please type here...' })
    expect(input.attributes("placeholder")).toBe('Please type here...')
  });
  
  it("can handle null data", async () => {
    const props = {...defaultProps, suggestions: [{ data: null }]};

    const wrapper = shallowMount(Autosuggest, {
      propsData: props
    });

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) throw new Error(err);
      expect(str).toMatchSnapshot();
    });
  });
  
  it("highlights first option on keydown when previously closed", async () => {
    const props = { ...defaultProps };
    props.inputProps = { ...defaultProps.inputProps };

    const wrapper = mount(Autosuggest, {
      propsData: props,
      attachToDocument: true
    });

    const input = wrapper.find("input");
    expect(input.attributes("id", defaultProps.inputProps.id)).toBeTruthy();

    input.trigger("click");
    input.setValue("G");
    input.trigger("keydown.down");
    input.trigger("keydown.enter");
    input.trigger("keydown.down");

    expect(wrapper.findAll("li.autosuggest__results-item--highlighted")).toHaveLength(1)
    
    const item = wrapper.find("li.autosuggest__results-item--highlighted")
    expect(item.attributes('data-suggestion-index')).toBe('0')
    expect(input.attributes('aria-activedescendant')).toBe('autosuggest__results-item--0')

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) {
        return false;
      }
      expect(str).toMatchSnapshot();
    });
  });
  
  it("can display ul and li classNames", async () => {
    const props = { ...defaultProps };
    props.sectionConfigs.default.liClass = { 'hello-li': true }
    props.sectionConfigs.default.ulClass = { 'hello-ul': true }

    const wrapper = mount(Autosuggest, {
      propsData: props,
      listeners: defaultListeners,
      attachToDocument: true
    });

    const input = wrapper.find("input");
    input.setValue("G");

    input.trigger("click");
    input.setValue("G");
    
    const ul = wrapper.find("ul")
    const li = ul.find("li:nth-child(1)")

    expect(ul.classes()).toContain('hello-ul');
    expect(li.classes()).toContain('hello-li');
    
    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) {
        return false;
      }
      expect(str).toMatchSnapshot();
    });
  });

  it("emits opened and closed events", async () => {
    const props = { ...defaultProps };
    props.inputProps = { ...defaultProps.inputProps };

    const wrapper = mount(Autosuggest, {
      propsData: props,
    });

    const input = wrapper.find("input");
    input.setValue("G");
    input.trigger("keydown.down");

    await wrapper.vm.$nextTick(() => {})
    expect(wrapper.emitted().opened).toBeTruthy();

    input.trigger("keydown.esc");
    await wrapper.vm.$nextTick(() => {})
    expect(wrapper.emitted().closed).toBeTruthy();
  });
  
  it("emits item-changed event", async () => {
    const props = { ...defaultProps };
    props.inputProps = { ...defaultProps.inputProps };

    const wrapper = mount(Autosuggest, {
      propsData: props,
    });
    
    const input = wrapper.find("input");
    input.setValue("G");
    input.trigger("keydown.down");
    input.trigger("keydown.down");

    await wrapper.vm.$nextTick(() => {})
    expect(wrapper.emitted()['item-changed']).toHaveLength(2);
    const itemChanged1 = wrapper.emitted()['item-changed'][0]
    const itemChanged2 = wrapper.emitted()['item-changed'][1]
    
    // Emits with item and index
    expect(itemChanged1[0].item).toBe('clifford kits');
    expect(itemChanged1[1]).toBe(0);
    expect(itemChanged2[0].item).toBe('friendly chemistry');
    expect(itemChanged2[1]).toBe(1);
    
    input.trigger("keydown.up");
    await wrapper.vm.$nextTick(() => {})
    input.trigger("keydown.up");
    await wrapper.vm.$nextTick(() => {})
    await wrapper.vm.$nextTick(() => {})
    
    // Ensure empty item-changed is emitted when user keys back
    // to the input #177
    expect(wrapper.emitted()['item-changed']).toHaveLength(4)
    const itemChangedEmpty = wrapper.emitted()['item-changed'][3]
    expect(itemChangedEmpty[0]).toBeNull();
    expect(itemChangedEmpty[1]).toBeNull();
  });
  
  it("current index resilient against many keyups #190", async () => {
    const props = { ...defaultProps };
    props.inputProps = { ...defaultProps.inputProps };

    const wrapper = mount(Autosuggest, {
      propsData: props,
    });
    
    const input = wrapper.find("input");
    input.setValue("G");
    input.trigger("keydown.down");
    await wrapper.vm.$nextTick(() => {})
    expect(wrapper.vm.currentIndex).toBe(0)
    input.trigger("keydown.up");
    expect(wrapper.vm.currentIndex).toBe(-1)
    
    // Go into the upside down, but make sure to come back unscathed
    await wrapper.vm.$nextTick(() => {})
    input.trigger("keydown.up");
    await wrapper.vm.$nextTick(() => {})
    input.trigger("keydown.up");
    await wrapper.vm.$nextTick(() => {})
    
    expect(wrapper.vm.currentIndex).toBe(-1)
  });
});
