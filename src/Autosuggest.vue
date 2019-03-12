<template>
  <div :id="componentAttrIdAutosuggest">
    <input 
      v-model="searchInput"
      type="text"
      :autocomplete="inputProps.autocomplete"
      role="combobox"
      :class="[isOpen ? 'autosuggest__input-open' : '', inputProps['class']]"
      v-bind="inputProps"
      aria-autocomplete="list"
      aria-owns="autosuggest__results"
      :aria-activedescendant="isOpen && currentIndex !== null ? `autosuggest__results_item-${currentIndex}` : ''"
      :aria-haspopup="isOpen ? 'true' : 'false'"
      :aria-expanded="isOpen ? 'true' : 'false'"
      @keydown="handleKeyStroke"
      v-on="listeners"
    >
    <div :class="componentAttrClassAutosuggestResultsContainer">
      <div 
        v-if="getSize() > 0 && !loading"
        :class="componentAttrClassAutosuggestResults"
        :aria-labelledby="componentAttrIdAutosuggest"
      >
        <slot name="header" />
        <component
          :is="cs.type"
          v-for="(cs, key) in computedSections"
          :ref="getSectionRef(key)"
          :key="getSectionRef(key)"
          :current-index="currentIndex"
          :normalize-item-function="normalizeItem"
          :render-suggestion="renderSuggestion"
          :section="cs"
          :update-current-index="updateCurrentIndex"
          :search-input="searchInput"
        >
          <template slot-scope="{ suggestion, _key }">
            <slot 
              :suggestion="suggestion" 
              :index="_key"
            >
              {{ suggestion.item }}
            </slot>
          </template>
        </component>
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script>

import DefaultSection from "./parts/DefaultSection.js";
import { addClass, removeClass } from "./utils";
export default {
  name: "Autosuggest",
  components: {
    /* eslint-disable-next-line vue/no-unused-components */
    DefaultSection
  },
  props: {
    inputProps: {
      type: Object,
      required: true,
      default: function() {
        return {
          id: {
            type: String,
            default: "autosuggest__input"
          },
          onInputChange: {
            type: Function,
            required: true
          },
          initialValue: {
            type: String,
            required: false
          },
          onClick: {
            type: Function,
            required: false
          }
        };
      }
    },
    limit: {
      type: Number,
      required: false,
      default: Infinity
    },
    suggestions: {
      type: Array,
      required: true,
      default: () => []
    },
    renderSuggestion: {
      type: Function,
      required: false,
      default: null
    },
    getSuggestionValue: {
      type: Function,
      required: false,
      default: suggestion => {
        const item = suggestion.item;
        if (typeof item === "object" && item.hasOwnProperty("name")) {
          return item.name;
        } else {
          return item;
        }
      }
    },
    shouldRenderSuggestions: {
      type: Function,
      required: false,
      default: () => {
        return true;
      }
    },
    sectionConfigs: {
      type: Object,
      required: false,
      default: () => {
        return {
          default: {
            onSelected: null
          }
        };
      }
    },
    onSelected: {
      type: Function,
      required: false,
      default: null
    },
    componentAttrIdAutosuggest: {
      type: String,
      required: false,
      default: "autosuggest"
    },
    componentAttrClassAutosuggestResultsContainer: {
      type: String,
      required: false,
      default: "autosuggest__results-container"
    },
    componentAttrClassAutosuggestResults: {
      type: String,
      required: false,
      default: "autosuggest__results"
    }
  },
  data() {
    return {
      searchInput: "",
      searchInputOriginal: null,
      currentIndex: null,
      currentItem: null,
      loading: false /** Helps with making sure the dropdown doesn't stay open after certain actions */,
      didSelectFromOptions: false,
      computedSections: [],
      computedSize: 0,
      internal_inputProps: {}, // Nest default prop values don't work currently in Vue
      defaultInputProps: {
        name: "q", // TODO: 2.0 Deprecate default name value
        initialValue: "",
        autocomplete: "off",
        class: 'form-control', // TODO: 2.0 remove
      },
      defaultSectionConfig: {
        name: "default",
        type: "default-section"
      },
      clientXMouseDownInitial: null
    };
  },
  computed: {
    listeners() {
      return {
        ...this.$listeners,
        focus: e => {
          this.$listeners.focus && this.$listeners.focus(e);
          if (this.inputProps.onFocus) {
            this.onFocus(e)
          }
        },
        blur: e => {
          this.$listeners.blur && this.$listeners.blur(e);
          if (this.inputProps.onBlur) {
            this.onBlur(e)
          }
        },
        click: () => {
          /* eslint-disable-next-line vue/no-side-effects-in-computed-properties */
          this.loading = false;
          this.$listeners.click && this.$listeners.click(this.currentItem);

          if(this.inputProps.onClick){
            this.onClick(this.currentItem);
          }
          this.$nextTick(() => {
            this.ensureItemVisible(this.currentItem, this.currentIndex);
          });
        },
        selected: () => {
          // Determine which onSelected to fire. This can be either from inside
          // a section's object, from the @selected event, or from the deprecated
          // native onSelected prop (to be removed later)
          if (
            this.currentItem &&
            this.sectionConfigs[this.currentItem.name] &&
            this.sectionConfigs[this.currentItem.name].onSelected
          ) {
            this.sectionConfigs[this.currentItem.name].onSelected(
              this.currentItem,
              this.searchInputOriginal
            );
          } else if (this.sectionConfigs["default"].onSelected) {
            this.sectionConfigs["default"].onSelected(null, this.searchInputOriginal);
          } else if (this.$listeners.selected) {
            this.$emit('selected', this.currentItem);
          } else if (this.onSelected){
            // TODO: 2.0 deprecate old event listeners
            this._onSelected(this.currentItem);
          }
          this.setChangeItem(null)
        }
      };
    },
    isOpen() {
      return this.getSize() > 0 && this.shouldRenderSuggestions() && !this.loading;
    }
  },
  watch: {
    searchInput(newValue, oldValue) {
      this.value = newValue;
      if (!this.didSelectFromOptions) {
        this.searchInputOriginal = this.value;
        this.currentIndex = null;
        this.internal_inputProps.onInputChange(newValue, oldValue);
      }
    },
    suggestions: {
      immediate: true,
      handler() {
        this.computedSections = [];
        this.computedSize = 0;

        this.suggestions.forEach(section => {
          if (!section.data) return;

          const name = section.name ? section.name : this.defaultSectionConfig.name;

          let { type, limit, label } = this.sectionConfigs[name];

          limit = limit || this.limit

          /** Set defaults for section configs. */
          type = type ? type : this.defaultSectionConfig.type;

          limit = limit ? limit : Infinity;
          limit = section.data.length < limit ? section.data.length : limit;

          label = label ? label : section.label;

          let computedSection = {
            name,
            label,
            type,
            limit,
            data: section.data,
            start_index: this.computedSize,
            end_index: this.computedSize + limit - 1
          };
          this.computedSections.push(computedSection);
          this.computedSize += limit;
        }, this);
      }
    }
  },
  created() {
    /** Take care of nested input props */
    this.internal_inputProps = { ...this.defaultInputProps, ...this.inputProps };
    this.inputProps.autocomplete = this.internal_inputProps.autocomplete;
    this.inputProps.name = this.internal_inputProps.name; // TODO: 2.0 Deprecate default name value
    this.inputProps.class = this.internal_inputProps.class; // TODO: 2.0 Deprecate default name value

    this.searchInput = this.internal_inputProps.initialValue; // set default query, e.g. loaded server side.
    this.loading = this.shouldRenderSuggestions();
  },
  mounted() {
    document.addEventListener("mouseup", this.onDocumentMouseUp);
    document.addEventListener("mousedown", this.onDocumentMouseDown);
  },
  beforeDestroy() {
    document.removeEventListener("mouseup", this.onDocumentMouseUp)
    document.removeEventListener("mousedown", this.onDocumentMouseDown)
  },
  methods: {
    getSectionRef(i) {
      return "computed_section_" + i;
    },
    getSize() {
      return this.computedSize;
    },
    getItemByIndex(index) {
      let obj = false;
      if (index === null) return obj;
      for (var i = 0; i < this.computedSections.length; i++) {
        if (
          index >= this.computedSections[i].start_index &&
          index <= this.computedSections[i].end_index
        ) {
          let trueIndex = index - this.computedSections[i].start_index;
          let childSection = this.$refs["computed_section_" + i][0];
          if (childSection) {
            obj = this.normalizeItem(
              this.computedSections[i].name,
              this.computedSections[i].type,
              childSection.getLabelByIndex(trueIndex),
              childSection.getItemByIndex(trueIndex)
            );
            break;
          }
        }
      }

      return obj;
    },
    handleKeyStroke(e) {
      const { keyCode } = e;

      const ignoredKeyCodes = [
        16, // Shift
        9,  // Tab
        18, // alt/option
        91, // OS Key
        93  // Right OS Key
      ];

      if (ignoredKeyCodes.indexOf(keyCode) > -1) {
        return;
      }

      this.loading = false;
      this.didSelectFromOptions = false;
      switch (keyCode) {
        case 40: // ArrowDown
        case 38: // ArrowUp
          e.preventDefault();
          if (this.isOpen) {
            if (keyCode === 38 && this.currentIndex === null) {
              break;
            }
            // Determine direction of arrow up/down and determine new currentIndex
            const direction = keyCode === 40 ? 1 : -1;
            const newIndex = parseInt(this.currentIndex) + direction;

            this.setCurrentIndex(newIndex, this.getSize(), direction);
            this.didSelectFromOptions = true;
            if (this.getSize() > 0 && this.currentIndex >= 0) {
              this.setChangeItem(this.getItemByIndex(this.currentIndex));
              this.didSelectFromOptions = true;
            } else if (this.currentIndex == -1) {
              this.currentIndex = null;
              this.searchInput = this.searchInputOriginal;
              e.preventDefault();
            }
          }
          break;
        case 13: // Enter
          e.preventDefault();

          if (keyCode === 229) {
            // https://github.com/moroshko/react-autosuggest/pull/388
            break;
          }

          if (this.getSize() > 0 && this.currentIndex >= 0) {
            this.setChangeItem(this.getItemByIndex(this.currentIndex), true);
            this.didSelectFromOptions = true;
          }
          
          this.loading = true;
          this.listeners.selected(this.didSelectFromOptions);        
          break;
        case 27: // Escape
          if (this.isOpen) {
            /* For 'search' input type, make sure the browser doesn't clear the input when Escape is pressed. */
            this.loading = true;
            this.currentIndex = null;
            this.searchInput = this.searchInputOriginal;
            e.preventDefault();
          }
          break;
      }
    },
    setChangeItem(item, overrideOriginalInput = false) {
      if (this.currentIndex === null || !item) {
        this.currentItem = null;
      } else if (item) {
        this.searchInput = this.getSuggestionValue(item);
        this.currentItem = item;
        if (overrideOriginalInput) {
          this.searchInputOriginal = this.getSuggestionValue(item);
        }
        this.ensureItemVisible(item, this.currentIndex);
      }
    },
    normalizeItem(name, type, label, item) {
      return {
        name,
        type,
        label,
        item
      };
    },
    ensureItemVisible(item, index) {
      const resultsScrollElement = this.$el.querySelector(
        `.${this.componentAttrClassAutosuggestResults}`
      );

      if (!item || (!index && index !== 0) || !resultsScrollElement) {
        return;
      }

      const itemElement = this.$el.querySelector(`#autosuggest__results_item-${index}`);
      if (!itemElement) {
        return;
      }

      const resultsScrollWindowHeight = resultsScrollElement.clientHeight;
      const resultsScrollScrollTop = resultsScrollElement.scrollTop;

      const itemHeight = itemElement.clientHeight;
      const currentItemScrollOffset = itemElement.offsetTop;

      if (
        itemHeight + currentItemScrollOffset >=
        resultsScrollScrollTop + resultsScrollWindowHeight
      ) {
        /** Current item goes below visible scroll window */
        resultsScrollElement.scrollTo(
          0,
          itemHeight + currentItemScrollOffset - resultsScrollWindowHeight
        );
      } else if (currentItemScrollOffset < resultsScrollScrollTop && resultsScrollScrollTop > 0) {
        /** Current item goes above visible scroll window */
        resultsScrollElement.scrollTo(0, currentItemScrollOffset);
      }
    },
    updateCurrentIndex(index) {
      this.currentIndex = index;
    },
    clickedOnScrollbar(e, mouseX){
      const results = this.$el.querySelector(`.${this.componentAttrClassAutosuggestResults}`);

      const mouseIsInsideScrollbar = results && results.clientWidth <= (mouseX + 17) && 
        mouseX + 17 <= results.clientWidth + 34
      return e.target.tagName === 'DIV' && results && mouseIsInsideScrollbar || false;
    },
    onDocumentMouseDown(e) {
      var rect = e.target.getBoundingClientRect ? e.target.getBoundingClientRect() : 0;
      this.clientXMouseDownInitial = e.clientX - rect.left;
    },
    onDocumentMouseUp(e) {
      /** Do not re-render list on input click  */
      const isChild = this.$el.contains(e.target);

      if (isChild && e.target.tagName === 'INPUT' ||
        (this.clickedOnScrollbar(e, this.clientXMouseDownInitial))) {
        return;
      }
      
      /** Clicks outside of dropdown to exit */
      if (this.currentIndex === null || !this.isOpen) {
        this.loading = this.shouldRenderSuggestions();
        return;
      }

      /** Selects an item in the dropdown */
      this.loading = true;
      this.didSelectFromOptions = true;
      this.setChangeItem(this.getItemByIndex(this.currentIndex), true);
      this.$nextTick(() => {
        this.listeners.selected(true);
      });
    },
    setCurrentIndex(newIndex, limit = -1, direction) {
      let adjustedValue = newIndex;

      // if we hit the lower limit then stop iterating the index
      if (this.currentIndex === null) {
        adjustedValue = 0;
      }

      if (this.currentIndex < 0 && direction === 1) {
        adjustedValue = 0;
      }

      // if we hit the upper limit then just stop iterating the index
      if (newIndex >= limit) {
        adjustedValue = 0;
      }

      this.currentIndex = adjustedValue;

      const element = this.$el.querySelector(`#autosuggest__results_item-${this.currentIndex}`);

      const hoverClass = "autosuggest__results_item-highlighted";
      if (this.$el.querySelector(`.${hoverClass}`)) {
        removeClass(this.$el.querySelector(`.${hoverClass}`), hoverClass);
      }
      if (element) {
        addClass(element, hoverClass);
      }
    },
    _onSelected(e) {
      console.warn(
        'onSelected is deprecated. Please use click event listener \n\ne.g. <vue-autosuggest ... @selected="onSelectedMethod" /> \n\nhttps://vuejs.org/v2/guide/syntax.html#v-on-Shorthand'
      );
      this.onSelected && this.onSelected(e);
    },
    onClick(e) {
      console.warn(
        'inputProps.onClick is deprecated. Please use native click event listener \n\ne.g. <vue-autosuggest ... @click="clickMethod" /> \n\nhttps://vuejs.org/v2/guide/syntax.html#v-on-Shorthand'
      );
      this.internal_inputProps.onClick && this.internal_inputProps.onClick(e);
    },
    onBlur(e) {
      console.warn(
        'inputProps.onBlur is deprecated. Please use native blur event listener \n\ne.g. <vue-autosuggest ... @blur="blurMethod" /> \n\nhttps://vuejs.org/v2/guide/syntax.html#v-on-Shorthand'
      );
      this.internal_inputProps.onBlur && this.internal_inputProps.onBlur(e);
    },
    onFocus(e) {
      console.warn(
        'inputProps.onFocus is deprecated. Please use native focus event listener \n\ne.g. <vue-autosuggest ... @focus="focusMethod" /> \n\nhttps://vuejs.org/v2/guide/syntax.html#v-on-Shorthand'
      );
      this.internal_inputProps.onFocus && this.internal_inputProps.onFocus(e);
    }
  },
};
</script>
