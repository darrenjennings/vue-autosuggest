const DefaultSection = {
  name: "default-section",
  props: {
    section: { type: Object, required: true },
    currentIndex: { type: Number, required: false, default: Infinity },
    updateCurrentIndex: { type: Function, required: true },
    searchInput: { type: String, required: false, default: "" },
    renderSuggestion: { type: Function, required: true }
  },
  computed: {
    list: function() {
      var l = this.section.limit;
      if (this.section.data.length < l) {
        l = this.section.data.length;
      }
      return this.section.data.slice(0, l);
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
    getLabelByIndex(i) {
      return this.section.data[i];
    },
    onMouseEnter(event) {
      this.updateCurrentIndex(event.currentTarget.getAttribute("data-suggestion-index"));
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
            [this.renderSuggestion(val)]
          );
        })
      ]
    );
  }
};

export default DefaultSection;
