<template>
    <ul role="listbox" aria-labelledby="autosuggest">
        <li v-if="section.label" :class="className">{{section.label}}</li>
        <li v-for="(val, key) in list"
            role="option" 
            class="autosuggest__results_item" 
            :key="getItemIndex(key)" 
            :class="{'autosuggest__results_item-highlighted' : getItemIndex(key) == currentIndex, 'autosuggest__results_item':true}" 
            :data-suggestion-index="getItemIndex(key)"
            :data-section-name="section.name"
            @mouseenter="onMouseEnter"
            @mouseleave="onMouseLeave"
            :id="`autosuggest__results_item-${getItemIndex(key)}`">{{val.value}}</li>
        
    </ul>
</template>

<script>
export default {
  name: "url-section",
  props: {
    section: { type: Object, required: true },
    currentIndex: { type: Number, required: false, default: Infinity },
    updateCurrentIndex: { type: Function, required: true }
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
      return (
        "autosuggest__results_title " +
        "autosuggest__results_title_" +
        this.section.name
      );
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
      return this.section.data[i].value;
    },
    onMouseEnter(event) {
      this.updateCurrentIndex(
        event.currentTarget.getAttribute("data-suggestion-index")
      );
    },
    onMouseLeave() {
      this.updateCurrentIndex(null);
    }
  }
};
</script>
