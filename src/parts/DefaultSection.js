const DefaultSection = {
  name: "default-section",
  props: {
    section: { type: Object, required: true },
    currentIndex: { type: [Number, String], required: false, default: Infinity },
    updateCurrentIndex: { type: Function, required: true },
    renderSuggestion: { type: Function, required: false },
    normalizeItemFunction: { type: Function, required: true }
  },
  data: function() {
    return {
      _currentIndex: null
    }
  },
  computed: {
    list: function() {
      let { limit, data } = this.section;
      if (data.length < limit) {
        limit = data.length;
      }
      return data.slice(0, limit);
    },
    className: function() {
      return `autosuggest__results_title autosuggest__results_title_${this.section.name}`;
    }
  },
  methods: {
    getItemIndex(i) {
      return this.section.start_index + i;
    },
    getItemByIndex(i) {
      return this.section.data[i];
    },
    onMouseEnter(event) {
      const idx = event.currentTarget.getAttribute("data-suggestion-index")
      this._currentIndex = idx
      this.updateCurrentIndex(idx)
    },
    onMouseLeave() {
      this.updateCurrentIndex(null);
    }
  },
  // eslint-disable-next-line no-unused-vars
  render(h) {
    let sectionTitle = this.section.label ? (
      <li class={this.className}>{this.section.label}</li>
    ) : (
      ""
    );
    return h(
      "ul",
      {
        attrs: { role: "listbox", "aria-labelledby": "autosuggest" }
      },
      [
        sectionTitle,
        this.list.map((val, key) => {
          let item = this.normalizeItemFunction(this.section.name, this.section.type, this.section.label, val)
          return h(
            "li",
            {
              attrs: {
                role: "option",
                "data-suggestion-index": this.getItemIndex(key),
                "data-section-name": this.section.name,
                id: "autosuggest__results_item-" + this.getItemIndex(key)
              },
              key: this.getItemIndex(key),
              class: {
                "autosuggest__results_item-highlighted":
                  this.getItemIndex(key) == this.currentIndex,
                autosuggest__results_item: true
              },
              on: {
                mouseenter: this.onMouseEnter,
                mouseleave: this.onMouseLeave
              }
            },
            [this.renderSuggestion ? this.renderSuggestion(item) 
              : this.$scopedSlots.default && this.$scopedSlots.default({
                key: key,
                suggestion: item
            })]
          );
        })
      ]
    );
  }
};

export default DefaultSection;
