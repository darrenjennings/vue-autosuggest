<template>
    <div :id="component_attr_id_autosuggest">
        <input class="form-control"
               type="text"
               :autocomplete="inputProps.autocomplete"
               role="combobox"
               v-model="searchInput"
               :class="[isOpen ? 'autosuggest__input-open' : '', inputProps['class']]"
               @keydown="handleKeyStroke"
               v-bind="inputProps"
               v-on="listeners"
               aria-autocomplete="list"
               aria-owns="autosuggest__results"
               :aria-activedescendant="isOpen && currentIndex !== null ? `autosuggest__results_item-${currentIndex}` : ''"
               :aria-haspopup="isOpen ? 'true' : 'false'"
               :aria-expanded="isOpen ? 'true' : 'false'"
        />
        <div :class="component_attr_class_autosuggest__results_container">
                <div :class="component_attr_class_autosuggest__results"
                    :aria-labelledby="component_attr_id_autosuggest"
                    v-if="getSize() > 0 && !loading">
                    <slot name="header"/>
                    <component :normalizeItemFunction="normalizeItem"
                              :renderSuggestion="renderSuggestion"
                              v-for="(cs, key) in this.computedSections"
                              :is="cs.type"
                              :section="cs"
                              :ref="getSectionRef(key)"
                              :key="getSectionRef(key)"
                              :updateCurrentIndex="updateCurrentIndex"
                              :searchInput="searchInput">
                      <template slot-scope="{ suggestion, key }">
                        <slot :suggestion="suggestion" :index="key" >
                          {{ suggestion.item }}
                        </slot>
                      </template>
                    </component>
                    <slot name="footer"/>
                </div>
        </div>
    </div>
</template>

<script>
import DefaultSection from "./parts/DefaultSection.js";
import { addClass, removeClass } from "./utils";
export default {
  name: "autosuggest",
  components: {
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
      default: []
    },
    renderSuggestion: {
      type: Function,
      required: false
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
    }
  },
  data: () => ({
    component_attr_id_autosuggest: "autosuggest",
    component_attr_class_autosuggest__results_container: "autosuggest__results-container",
    component_attr_class_autosuggest__results: "autosuggest__results",
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
      autocomplete: "off"
    },
    defaultSectionConfig: {
      name: "default",
      type: "default-section"
    }
  }),
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
          this.loading = false;
          this.$listeners.click && this.$listeners.click(this.currentItem);

          if(this.inputProps.onClick){
            this.onClick(this.currentItem);
          }
          this.$nextTick(() => {
            this.ensureItemVisible(this.currentItem, this.currentIndex);
          });
        }
      };
    },
    isOpen() {
      return this.getSize() > 0 && this.shouldRenderSuggestions() && !this.loading;
    }
  },
  methods: {
    _onSelected() {
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
      } else {
        this.onSelected && this.onSelected(this.currentItem);
      }
    },
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
          this.$nextTick(() => {
            if (this.getSize() > 0 && this.currentIndex >= 0) {
              this.setChangeItem(this.getItemByIndex(this.currentIndex), true);
              this.didSelectFromOptions = true;
            }
            this.loading = true;
            this.$nextTick(() => {
              this._onSelected(this.didSelectFromOptions);
            });
          });
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
      if (this.currentIndex === null) {
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
      const resultsScrollElement = document.querySelector(
        `.${this.component_attr_class_autosuggest__results}`
      );

      if (!item || (!index && index !== 0) || !resultsScrollElement) {
        return;
      }

      const itemElement = document.querySelector(`#autosuggest__results_item-${index}`);
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
    onDocumentMouseUp(e) {
      /** Do not re-render list on input click  */
      const isChild = this.$el.contains(e.target);
      if (isChild && e.target.tagName === 'INPUT') {
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
        this._onSelected(true);
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

      const element = document.getElementById(`autosuggest__results_item-${this.currentIndex}`);
      const hoverClass = "autosuggest__results_item-highlighted";
      if (document.querySelector(`.${hoverClass}`)) {
        removeClass(document.querySelector(`.${hoverClass}`), hoverClass);
      }
      if (element) {
        addClass(element, hoverClass);
      }
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
  created() {
    /** Take care of nested input props */
    this.internal_inputProps = { ...this.defaultInputProps, ...this.inputProps };
    this.inputProps.autocomplete = this.internal_inputProps.autocomplete;
    this.inputProps.name = this.internal_inputProps.name; // TODO: 2.0 Deprecate default name value

    this.searchInput = this.internal_inputProps.initialValue; // set default query, e.g. loaded server side.
  },
  mounted() {
    document.addEventListener("mouseup", this.onDocumentMouseUp);
    this.loading = true;
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
  }
};
</script>
