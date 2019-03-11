<template>
  <div :id="componentAttrIdAutosuggest">
    <slot name="before-input" /><input
      :type="inputProps['type'] ? inputProps['type'] : 'text'"
      :value="internalValue"
      :autocomplete="inputProps.autocomplete"
      role="combobox"
      :class="[isOpen ? 'autosuggest__input-open' : '', inputProps['class']]"
      v-bind="inputProps"
      aria-autocomplete="list"
      aria-owns="autosuggest__results"
      :aria-activedescendant="isOpen && currentIndex !== null ? `autosuggest__results_item-${currentIndex}` : ''"
      :aria-haspopup="isOpen ? 'true' : 'false'"
      :aria-expanded="isOpen ? 'true' : 'false'"
      @input="inputHandler"
      @keydown="handleKeyStroke"
      v-on="listeners"
    ><slot name="after-input" />
    <div :class="componentAttrClassAutosuggestResultsContainer">
      <div 
        v-if="isOpen"
        :class="componentAttrClassAutosuggestResults"
        :aria-labelledby="componentAttrIdAutosuggest"
      >
        <slot name="before-suggestions" />
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
        <slot name="after-suggestions" />
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
    value: {
      type: String,
      default: null
    },
    inputProps: {
      type: Object,
      required: true
    },
    limit: {
      type: Number,
      required: false,
      default: Infinity
    },
    suggestions: {
      type: Array,
      required: true
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
      default: (totalResults, loading) => {
        return totalResults > 0 && !loading;
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
      internalValue: null,
      searchInputOriginal: null,
      currentIndex: null,
      currentItem: null,
      loading: false /** Helps with making sure the dropdown doesn't stay open after certain actions */,
      didSelectFromOptions: false,
      internal_inputProps: {}, // Nest default prop values don't work currently in Vue
      defaultInputProps: {
        autocomplete: "off",
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
        input: e => {
          // Don't do anything native here, since we have inputHandler
          return
        },
        click: () => {
          /* eslint-disable-next-line vue/no-side-effects-in-computed-properties */
          this.loading = false;
          this.$listeners.click && this.$listeners.click(this.currentItem);

          this.ensureItemVisible(this.currentItem, this.currentIndex);
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
          }
          this.setChangeItem(null)
        }
      };
    },
    isOpen() {
      return this.shouldRenderSuggestions(this.totalResults, this.loading)
    },
    /**
     * @returns <Array>
     */
    computedSections() {
      let tmpSize = 0

      return this.suggestions.map(section => {
        if (!section.data) return;

        const name = section.name ? section.name : this.defaultSectionConfig.name;

        let { type, limit, label } = this.sectionConfigs[name];

        limit = limit || this.limit

        /** Set defaults for section configs. */
        type = type ? type : this.defaultSectionConfig.type;

        limit = limit ? limit : Infinity;
        limit = section.data.length < limit ? section.data.length : limit;
        label = label ? label : section.label;

        const computedSection = {
          name,
          label,
          type,
          limit,
          data: section.data,
          start_index: tmpSize,
          end_index: tmpSize + limit - 1
        }
        
        tmpSize += limit;
        
        return computedSection
      })
    },
    totalResults () {
      return this.computedSections.reduce((acc, section) => {
        // For each section, make sure we calculate the size
        // based on how many are rendered, which maxes out at
        // the limit but can be less than the limit.
        const { limit, data } = section
        return acc + (data.length >= limit ? limit : data.length)
      }, 0)
    }
  },
  // Watcher to support initialValue
  watch: {
    value: {
      handler(newValue){
        this.internalValue = newValue
      },
      immediate: true
    }
  },
  created() {
    /** Take care of nested input props */
    this.internal_inputProps = { ...this.defaultInputProps, ...this.inputProps };
    this.inputProps.autocomplete = this.internal_inputProps.autocomplete;
    this.loading = true;
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
    inputHandler(e) {
      const newValue = e.target.value
      this.$emit('input', newValue)
      this.internalValue = newValue
      if (!this.didSelectFromOptions) {
        this.searchInputOriginal = newValue;
        this.currentIndex = null;
      }
    },
    getSectionRef(i) {
      return "computed_section_" + i;
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
              childSection.section.label,
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

            this.setCurrentIndex(newIndex, this.totalResults, direction);
            this.didSelectFromOptions = true;
            if (this.totalResults > 0 && this.currentIndex >= 0) {
              this.setChangeItem(this.getItemByIndex(this.currentIndex));
              this.didSelectFromOptions = true;
            } else if (this.currentIndex == -1) {
              this.currentIndex = null;
              this.internalValue = this.searchInputOriginal;
              e.preventDefault();
            }
          }
          break;
        case 13: // Enter
          e.preventDefault();

          if (this.totalResults > 0 && this.currentIndex >= 0) {
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
            this.internalValue = this.searchInputOriginal
            this.$emit('input', this.searchInputOriginal);
            e.preventDefault();
          }
          break;
      }
    },
    setChangeItem(item, overrideOriginalInput = false) {
      if (this.currentIndex === null || !item) {
        this.currentItem = null;
      } else if (item) {
        this.currentItem = item;
        const v = this.getSuggestionValue(item)
        this.internalValue = v;
        if (overrideOriginalInput) {
          this.searchInputOriginal = v;
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
    clickedOnScrollbar(mouseX){
      const results = this.$el.querySelector(`.${this.componentAttrClassAutosuggestResults}`);
      return results && (results.clientWidth <= (mouseX + 16) && mouseX + 16 <= results.clientWidth + 16 ) || false;
    },
    onDocumentMouseDown(e) {
      var rect = e.target.getBoundingClientRect ? e.target.getBoundingClientRect() : 0;
      this.clientXMouseDownInitial = e.clientX - rect.left;
    },
    onDocumentMouseUp(e) {
      /** Do not re-render list on input click  */
      const isChild = this.$el.contains(e.target);
      if (isChild && e.target.tagName === 'INPUT' || this.clickedOnScrollbar(this.clientXMouseDownInitial)) {
        return;
      }
      
      /** Clicks outside of dropdown to exit */
      if (this.currentIndex === null || !this.isOpen) {
        this.loading = true;
        return;
      }

      /** Selects an item in the dropdown */
      this.loading = true;
      this.didSelectFromOptions = true;
      this.setChangeItem(this.getItemByIndex(this.currentIndex), true);
      this.listeners.selected(true);
    },
    setCurrentIndex(newIndex, limit = -1, direction) {
      let adjustedValue = newIndex;

      // if we hit the lower limit then stop iterating the index
      if (this.currentIndex === null) {
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
    }
  },
};
</script>
