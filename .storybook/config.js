import { configure } from '@storybook/vue';

import Vue from 'vue';
import VueAutosuggest from "../src/Autosuggest.vue";

function loadStories() {
  // You can require as many stories as you need.
  require('../src/stories');
}

configure(loadStories, module);
