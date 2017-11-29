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
import DefaultSection from '../src/parts/DefaultSection.vue';
export default {
  name: "url-section",
  extends: DefaultSection,
  methods: {
    getLabelByIndex(i) {
      return this.section.data[i].value;
    }
  }
};
</script>
