import { h, defineComponent, Fragment  } from 'vue'

const DefaultSection = defineComponent({
  name: "default-section",
  props: {
    /** @type ResultSection */
    section: { type: Object, required: true },
    currentIndex: { type: [Number, String], required: false, default: Infinity },
    renderSuggestion: { type: Function, required: false },
    normalizeItemFunction: { type: Function, required: true },
    componentAttrPrefix: { type: String, required: true },
    componentAttrIdAutosuggest: { type: String, required: true }
  },
  data: function () {
    return {
      /** @type Number */
      _currentIndex: this.currentIndex
    }
  },
  computed: {
    /**
     * Suggestions from the section
     */
    list: function () {
      let { limit, data } = this.section;
      if (data.length < limit) {
        limit = data.length;
      }
      return data.slice(0, limit);
    }
  },
  methods: {
    getItemIndex (i) {
      return this.section.start_index + i;
    },
    getItemByIndex (i) {
      return this.section.data[i];
    },
    onMouseEnter (event) {
      const idx = parseInt(event.currentTarget.getAttribute("data-suggestion-index"))
      this._currentIndex = idx
      this.$emit('updateCurrentIndex', idx)
    },
    onMouseLeave () {
      this.$emit('updateCurrentIndex', null)
    }
  },
  // eslint-disable-next-line no-unused-vars
  render () {
    const componentAttrPrefix = this.componentAttrPrefix
    const slots = {
      beforeSection: this.$slots[`before-section-${this.section.name}`],
      afterSectionDefault: this.$slots[`after-section`],
      afterSectionNamed: this.$slots[`after-section-${this.section.name}`]
    }

    const beforeClassName = `${componentAttrPrefix}__results-before ${componentAttrPrefix}__results-before--${this.section.name}`
    const before = slots.beforeSection && slots.beforeSection({
      section: this.section,
      className: beforeClassName
    })
    // Skip fragments without children, this can be for example `<slot>` or empty `<template>`
    .filter(x=>x.type !== Fragment && x.children.length === 0) || []

    return h(
      "ul",
      {
        role: "listbox",
        class: this.section.ulClass,
        "aria-labelledby": this.section.label && `${this.componentAttrIdAutosuggest}-${this.section.label}`
      },
      [
        before[0] && before[0] || this.section.label && h('li', {
          class: beforeClassName,
          id: `${this.componentAttrIdAutosuggest}-${this.section.label}`
        }, [this.section.label]) || '',
        this.list.map((val, key) => {
          const item = this.normalizeItemFunction(this.section.name, this.section.type, this.section.label, this.section.liClass, val)
          const itemIndex = this.getItemIndex(key)
          const isHighlighted = this._currentIndex === itemIndex || parseInt(this.currentIndex) === itemIndex

          return h(
            "li",
            {
              role: "option",
              "data-suggestion-index": itemIndex,
              "data-section-name": item.name,
              id: `${componentAttrPrefix}__results-item--${itemIndex}`,
              ...item.liAttributes,
              key: itemIndex,
              class: {
                [`${componentAttrPrefix}__results-item--highlighted`]: isHighlighted,
                [`${componentAttrPrefix}__results-item`]: true,
                ...item.liClass
              },
              onMouseenter: this.onMouseEnter,
              onMouseleave: this.onMouseLeave
            },
            [this.renderSuggestion ? this.renderSuggestion(item)
              : this.$slots.default && this.$slots.default({
                _key: key,
                suggestion: item
              })]
          );
        }),
        slots.afterSectionDefault && slots.afterSectionDefault({
          section: this.section,
          className: `${componentAttrPrefix}__results-after ${componentAttrPrefix}__results-after--${this.section.name}`
        }),
        slots.afterSectionNamed && slots.afterSectionNamed({
          section: this.section,
          className: `${componentAttrPrefix}__results_after ${componentAttrPrefix}__results-after--${this.section.name}`
        })
      ]
    );
  }
});

export default DefaultSection;
