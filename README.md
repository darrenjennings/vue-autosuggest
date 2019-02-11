<div>
<h1>vue-autosuggest</h1>

<p>🔍 Autosuggest component built for Vue.</a></p>
</div>

<hr />

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![version][version-badge]][package]
[![downloads][downloads-badge]][npmtrends]
[![MIT License][license-badge]][LICENSE]
[![gzip size][size-badge]](https://unpkg.com/vue-autosuggest@latest)

[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs]
[![Code of Conduct][coc-badge]][coc]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

## Table of Contents

* [Examples](#examples)
* [Features](#features)
* [Installation](#installation)
* [Usage](#usage)
* [Props](#props)
* [Inspiration](#inspiration)
* [Contributors](#contributors)
* [LICENSE](#license)

## Examples

* <a href="https://darrenjennings.github.io/vue-autosuggest">Demo</a>
* <a href="https://darrenjennings.github.io/vue-autosuggest/storybook">Storybook</a> Helpful to see all
  variations of component's props.<br/>
* <a href="https://jsfiddle.net/darrenjennings/dugbvezs/">JSFiddle</a> Helpful for playing around
  and sharing.
* Codesandbox Demos:

  * [Deeply nested data objects as suggestions](https://codesandbox.io/s/627qlx66oz)
  * [Api Fetching suggestions with Multiple sections](https://codesandbox.io/s/mjqrk7v2rx)
  * [Form Validation with VeeValidate](https://codesandbox.io/s/o503m66r59)
  * [Multiple VueAutosuggest instances on same page](https://codesandbox.io/s/2olxlv9q9r)
* [Integration with Algolia](https://www.algolia.com/doc/guides/building-search-ui/resources/ui-and-ux-patterns/in-depth/autocomplete/vue/?language=vue#results-page-with-autocomplete) thanks to [@haroenv](https://github.com/haroenv)!

## Features

* WAI-ARIA complete autosuggest component built with the power of Vue.
* Full control over rendering with built in defaults or custom components for rendering.
* Easily integrate AJAX data fetching for list presentation.
* Supports multiple sections.
* No opinions on CSS, full control over styling.
* Rigorously tested.

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```
npm install --save vue-autosuggest
```

or

```
yarn add vue-autosuggest
```

## Usage

Load VueAutosuggest into your vue app globally.

```js
import VueAutosuggest from "vue-autosuggest";
Vue.use(VueAutosuggest);
```

or locally inside a component:

```js
import { VueAutosuggest } from 'vue-autosuggest';
export default {
  ...
  components: {
      VueAutosuggest
  }
  ...
};
```

Place the component into your app!

```html
<vue-autosuggest
    :suggestions="[{data:['Frodo', 'Samwise', 'Gandalf', 'Galadriel', 'Faramir', 'Éowyn']}]"
    :input-props="{id:'autosuggest__input', onInputChange: onInputChange, placeholder:'Do you feel lucky, punk?'}"
    @selected="selectHandler"
    @click="clickHandler"
>  
  <template slot-scope="{suggestion}">
    <span class="my-suggestion-item">{{suggestion.item}}</span>
  </template>
</vue-autosuggest>

```

Advanced usage:

<details><summary>Click to expand</summary><p>

```html
<template>
<div>
    <h1>Vue-autosuggest 🔮</h1>
    <div style="padding-top:10px; margin-bottom: 10px;"><span v-if="selected">You have selected '{{JSON.stringify(selected,null,2)}}'</span></div>
        <vue-autosuggest
            :suggestions="filteredOptions"
            @focus="focusMe"
            @click="clickHandler"
            @selected="onSelected"
            :render-suggestion="renderSuggestion"
            :get-suggestion-value="getSuggestionValue"
            :input-props="{id:'autosuggest__input', onInputChange: this.onInputChange, placeholder:'Do you feel lucky, punk?'}"/>
</div>
</template>

<script>
import { VueAutosuggest } from "vue-autosuggest";

export default {
  components: {
    VueAutosuggest
  },
  data() {
    return {
      selected: "",
      filteredOptions: [],
      suggestions: [
        {
          data: [
            { id: 1, name: "Frodo", avatar: "./frodo.jpg" },
            { id: 2, name: "Samwise", avatar: "./samwise.jpg" },
            { id: 3, name: "Gandalf", avatar: "./gandalf.png" },
            { id: 4, name: "Aragorn", avatar: "./aragorn.jpg" }
          ]
        }
      ]
    };
  },
  methods: {
    onInputChange(text, oldText) {
      if (text === null) {
        /* Maybe the text is null but you wanna do
        *  something else, but don't filter by null.
        */
        return;
      }

      // Full customizability over filtering
      const filteredData = this.suggestions[0].data.filter(option => {
        return option.name.toLowerCase().indexOf(text.toLowerCase()) > -1;
      });

      // Store data in one property, and filtered in another
      this.filteredOptions = [{ data: filteredData }];
    },
    clickHandler(item) {
      // items are selected by default on click, but you can add some more behavior here!
    },
    onSelected(item) {
      this.selected = item;
    },
    /**
     * renderSuggestion will override the default suggestion template slot.
     */
    renderSuggestion(suggestion) {
      /* You will need babel-plugin-transform-vue-jsx for this kind of syntax for
       * rendering. If you don't use babel or the jsx transform, then you can create 
       * the you can create the virtual node yourself using this.$createElement.
       */
      const character = suggestion.item;
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center"
          }}
        >
          <img
            style={{
              width: "25px",
              height: "25px",
              borderRadius: "15px",
              marginRight: "10px"
            }}
            src={character.avatar}
          />{" "}
          <span style={{ color: "navyblue" }}>{character.name}</span>
        </div>
      );
    },
    /**
     * This is what the <input/> value is set to when you are selecting a suggestion.
     */
    getSuggestionValue(suggestion) {
      return suggestion.item.name;
    },
    focusMe(e) {
      console.log(e)
    }
  }
};
</script>
```

</p></details>

For more advanced usage, check out the examples below, and explore the
<a href="#props">properties</a> you can use.

## [Slots](#slots)

### header/footer
Slots for injecting content above all the results inside the results container.

```html
<vue-autosuggest ...>
  <template slot="header">
    <h1>header content goes here</h1>
  </template>
  <template slot="footer">
    <h1>footer content goes here</h1>
  </template>
</vue-autosuggest>
```

### suggestion item (i.e. default slot)
Used to style each suggestion inside the `<li>` tag. Using [scoped slots](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots) 
you have access to the `suggestion` item inside the `v-for` suggestions loop. This gives you the power of Vue templating, since 
vue-autosuggest does not have an opinion about how you render the items in your list.

```vue
<vue-autosuggest>
  <template slot-scope="{suggestion}">
    <!-- suggestion.name corresponds to which section the item is in -->
    <div v-if="suggestion.name === 'blog'">
      <!-- suggestion.item corresponds to the suggestion object -->
      <a target="_blank" :href="suggestion.item.url">{{suggestion.item.value}}</a>
    </div>
    <div v-else>{{suggestion.item}}</div>
  </template>
</vue-autosuggest>
```

> This slot will be overridden when the [`render-suggestion`](#renderSuggestion) prop is used.



## [Props](#props)

| Prop                                        | Type     | Required | Description                                               |
| :------------------------------------------ | :------- | :------: | :-------------------------------------------------------- |
| [`suggestions`](#suggestionsProp)           | Array    |    ✓     | Suggestions to be rendered. e.g.`suggestions: [{data: ['harry','ron','hermione']}]`                               |
| [`input-props`](#inputPropsTable)            | Object   |    ✓     | Add props to the `<input>`.                               |
| [`section-configs`](#sectionConfigsProp)     | Object   |          | Define multiple sections `<input>`.                       |
| [`render-suggestion`](#renderSuggestion)     | Function |          | Tell vue-autosuggest how to render inside the `<li>` tag. Overrides what is inside the default suggestion template slot. |
| [`get-suggestion-value`](#getSuggestionValue) | Function |          | Tells vue-autosuggest what to put in the `<input/>` value |
| `@selected`            | Function   |    ✓     | suggestion select handler. equivalent to sectionConfigs `on-selected` but for all items             |
| `component-attr-id-autosuggest` | String |          | `id` of entire component |
| `component-attr-class-autosuggest-results-container` | String |          | `class` of container of results container |
| `component-attr-class-autosuggest-results` | String |          | `class` of results container |

<a name="inputPropsTable"></a>

### inputProps

| Prop                     | Type                |  Required  | Description                                                                                                                                                                  |
| :----------------------- | :------------------ | :--------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`id`](#inputPropsTable) | String              |     ✓      | id attribute on `<input>`.                                                                                                                                                   |
| [`on-input-change`](#)     | Function            |     ✓      | Triggers everytime the `<input>` changes. This is triggered via a Vue watcher, so you have both current value, and previous value access e.g. `onInputChange(text, oldText)` |
| ~~onClick~~              | ~~Function~~        | Deprecated | ~~Triggers everytime the &lt;input> is clicked.~~ You can now use `@click` which will map to the underlying `<input />`                                                      |
| ~~onBlur~~               | ~~Function~~</span> | Deprecated | ~~HTML onblur event on &lt;input> same as Vue @blur event binding~~. You can now use `@blur` which will map to the underlying `<input />`                                    |
| ~~onFocus~~              | ~~Function~~        | Deprecated | ~~HTML onfocus event on &lt;input> same as Vue @focus event binding~~ You can now use `@focus` which will map to the underlying `<input />`                                  |
| [`initial-value`](#)      | String              |            | Set some initial value for the `<input>`.                                                                                                                                    |
| Any DOM Props            | \*                  |            | You can add any props to `<input>` as the component will `v-bind` inputProps. Similar to rest spread in JSX. See more details here: https://vuejs.org/v2/api/#v-bind. The `name` attribute is set to "`q`" by default.         |

<a name="sectionConfigsProp"></a>

### sectionConfigs

Multiple sections can be defined in the `sectionConfigs` prop which defines the control behavior for
each section.

| Prop         | Type     | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| :----------- | :------- | :------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `on-selected` | Function |    ✓     | Determine behavior for what should happen when a suggestion is selected. e.g. Submit a form, open a link, update a vue model, tweet at Ken Wheeler etc.                                                                                                                                                                                                                                                                                                                                                                     |
| `type`       | String   |          | Vue component name for specifying which type to implement using Vue's `<component :is="componentName"></component>` functionality. See [DefaultSection.vue](https://github.com/darrenjennings/vue-autosuggest/blob/master/src/parts/DefaultSection.vue) for scaffolding a new type. You must declare your component in the scope of the app using `Vue.component()`. You can extend DefaultSection using `extends`. See [UrlSection](https://github.com/darrenjennings/vue-autosuggest/blob/master/docs/UrlSection.vue) for an example. |
| `limit`      | Number   |          | Limit each section by some value. Default: `Infinity`                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

Below we have defined a `default` section and a `blog` section. The `blog` section has a component
`type` of `url-section` which corresponds to which component the Autosuggest loads. When type is not
defined, Vue-autosuggest will use a built in `DefaultSection.vue` component.

```js
sectionConfigs: {
    'default': {
        limit: 6,
        onSelected: function(item, originalInput) {
            console.log(item, originalInput, `Selected "${item.item}"`);
        }
    },
    'blog': {
        limit: 3,
        type: "url-section",
        onSelected: function() {
            console.log("url: " + item.item.url);
        }
    }
}
```

<a name="renderSuggestion"></a>

### renderSuggestion

This function can be used to tell vue-autosuggest how to render the html inside the `<li>` tag when you do not want to use the 
default template slot for suggestions but would rather have the power of javascript / jsx.

In its most basic form it just returns an object property:

```js
renderSuggestion(suggestion) {
    return suggestion.name;
},
```

But usually it returns a JSX fragment, which is transformed into a virtual node description with babel-plugin-transform-vue-jsx:

```jsx
renderSuggestion(suggestion) {
    return <div style={{ color: "red" }}>{suggestion.name}</div>;
},
```

If you're not using babel-plugin-transform-vue-jsx, you can create the virtual node description yourself:

```js
renderSuggestion(suggestion) {
    return this.$createElement('div', { 'style': { color: 'red'} }, suggestion.name);
},
```

<a name="getSuggestionValue"></a>

### getSuggestionValue

This function will tell vue-autosuggest what to put in the `<input/>` as the value.

```js
getSuggestionValue(suggestion) {
    return suggestion.item.name;
},
```

## FAQ

> How do I update the input programatically?

* You can assign a ref to the component `<vue-autosuggest ref="myRefName" ... />` and then access
  the input value through `this.$refs.myRefName.searchInput`. This is useful mainly for clearing the
  input. ⚠️ Note, refs are more of an "escape hatch" as they call it, so it won't trigger the
  `onInputChange` method.

## Inspiration

* Misha Moroshko's react-autosuggest component inspired the api + WAI-ARIA completeness
  https://github.com/moroshko/react-autosuggest

## Contributors

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars.githubusercontent.com/u/5770711?v=4" width="100px;"/><br /><sub><b>Darren Jennings</b></sub>](https://guuu.io)<br />[💻](https://github.com/darrenjennings/vue-autosuggest/commits?author=darrenjennings "Code") [📖](https://github.com/darrenjennings/vue-autosuggest/commits?author=darrenjennings "Documentation") [🚇](#infra-darrenjennings "Infrastructure (Hosting, Build-Tools, etc)") [⚠️](https://github.com/darrenjennings/vue-autosuggest/commits?author=darrenjennings "Tests") [🎨](#design-darrenjennings "Design") [💡](#example-darrenjennings "Examples") | [<img src="https://avatars2.githubusercontent.com/u/411772?v=4" width="100px;"/><br /><sub><b>Evgeniy Kulish</b></sub>](https://github.com/ekulish)<br />[💻](https://github.com/darrenjennings/vue-autosuggest/commits?author=ekulish "Code") [🎨](#design-ekulish "Design") [💡](#example-ekulish "Examples") [⚠️](https://github.com/darrenjennings/vue-autosuggest/commits?author=ekulish "Tests") | [<img src="https://avatars3.githubusercontent.com/u/1824850?v=4" width="100px;"/><br /><sub><b>Scott Smith</b></sub>](https://github.com/scottadamsmith)<br />[🐛](https://github.com/darrenjennings/vue-autosuggest/issues?q=author%3Ascottadamsmith "Bug reports") [💻](https://github.com/darrenjennings/vue-autosuggest/commits?author=scottadamsmith "Code") [⚠️](https://github.com/darrenjennings/vue-autosuggest/commits?author=scottadamsmith "Tests") |
| :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification. Contributions of any
kind welcome!

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/darrenjennings/vue-autosuggest.svg?style=flat-square
[build]: https://travis-ci.org/darrenjennings/vue-autosuggest
[size-badge]: https://img.badgesize.io/https://unpkg.com/vue-autosuggest@latest/dist/vue-autosuggest.esm.js?compression=gzip&style=flat-square
[coverage-badge]: https://img.shields.io/codecov/c/github/darrenjennings/vue-autosuggest.svg?style=flat-square
[coverage]: https://codecov.io/github/darrenjennings/vue-autosuggest
[version-badge]: https://img.shields.io/npm/v/vue-autosuggest.svg?style=flat-square
[package]: https://www.npmjs.com/package/vue-autosuggest
[downloads-badge]: https://img.shields.io/npm/dm/vue-autosuggest.svg?style=flat-square
[npmtrends]: http://www.npmtrends.com/vue-autosuggest
[license-badge]: https://img.shields.io/npm/l/vue-autosuggest.svg?style=flat-square
[license]: https://github.com/darrenjennings/vue-autosuggest/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/darrenjennings/vue-autosuggest/blob/master/other/CODE_OF_CONDUCT.md
[github-watch-badge]: https://img.shields.io/github/watchers/darrenjennings/vue-autosuggest.svg?style=social
[github-watch]: https://github.com/darrenjennings/vue-autosuggest/watchers
[github-star-badge]: https://img.shields.io/github/stars/darrenjennings/vue-autosuggest.svg?style=social
[github-star]: https://github.com/darrenjennings/vue-autosuggest/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20vue-autosuggest%20by%20%40darrenjennings%20https%3A%2F%2Fgithub.com%2Fdarrenjennings%2Fvue-autosuggest%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/darrenjennings/vue-autosuggest.svg?style=social
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors

<!-- [donate-badge]: https://img.shields.io/badge/$-support-green.svg?style=flat-square -->
