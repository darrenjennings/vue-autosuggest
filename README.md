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

[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs]
[![Code of Conduct][coc-badge]][coc]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION. It'll update automatically -->

- [Examples](#examples)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Props](#props)
- [Inspiration](#inspiration)
- [Contributors](#contributors)
- [LICENSE](#license)
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Examples
- <a href="https://educents.github.io/vue-autosuggest">Demo</a>
- <a href="https://educents.github.io/vue-autosuggest/storybook">Storybook</a> Helpful to see all variations of component's props.<br/>
- <a href="https://jsfiddle.net/darrenjennings/dugbvezs/">JSFiddle</a> Helpful for playing around and sharing.

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
import VueAutosuggest from 'vue-autosuggest';
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
    :onSelected="clickHandler"
    :inputProps="{id:'autosuggest__input', onInputChange: this.onInputChange, placeholder:'Do you feel lucky, punk?'}"
/>
```

For more advanced usage, check out the examples below, and explore the <a href="#props">properties</a> you can use.


## [Props](#props)
| Prop | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| [`suggestions`](#suggestionsProp) | Array | ✓ | Suggestions to be rendered. |
| [`inputProps`](#inputPropsTable) | Object | ✓ | Add props to the `<input>`.|
| [`sectionConfigs`](#sectionConfigsProp) | Object | | Define multiple sections `<input>`.|
| [`renderSuggestion`](#renderSuggestion) | Function |  | Tell vue-autosuggest how to render inside the `<li>` tag. |
| [`getSuggestionValue`](#getSuggestionValue) | Function |  | Tells vue-autosuggest what to put in the `<input/>` value|


<a name="inputPropsTable"></a>
### inputProps
| Prop | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| [`id`](#inputPropsTable) | String | ✓ | id attribute on `<input>`.|
| [`onInputChange`](#) | Function | ✓ | Triggers everytime the `<input>` changes.|
| [`onClick`](#) | Function |  | Triggers everytime the `<input>` is clicked.|
| [`initialValue`](#) | String | | Set some initial value for the `<input>`.|
| Any DOM Props | * |  | You can add any props to `<input>` as the component will `v-bind` inputProps. Similar to rest spread in JSX. See more details here: https://vuejs.org/v2/api/#v-bind |

<a name="sectionConfigsProp"></a>
### sectionConfigs
Multiple sections can be defined in the `sectionConfigs` prop which defines the control behavior for each section. 

| Prop | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `onSelected` | Function | ✓ | Determine behavior for what should happen when a suggestion is selected. e.g. Submit a form, open a link, update a vue model, tweet at Ken Wheeler etc.|
| `type` | String |  | Vue component name for specifying which type to implement using Vue's `<component :is="componentName"></component>` functionality. See [DefaultSection.vue](https://github.com/Educents/vue-autosuggest/blob/master/src/parts/DefaultSection.vue) for scaffolding a new type. You must declare your component in the scope of the app using `Vue.component()`. You can extend DefaultSection using `extends`. See [UrlSection](https://github.com/Educents/vue-autosuggest/blob/master/docs/UrlSection.vue) for an example.|
| `limit` | Number |  | Limit each section by some value. Default: `Infinity`|

Below we have defined a `default` section and a `blog` section. The `blog` section has a component `type` of `url-section` which corresponds to which component the Autosuggest loads. When type is not defined, Vue-autosuggest will use a built in `DefaultSection.vue` component. 
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
This function will tell vue-autosuggest how to render the html inside the `<li>` tag. If you're not using `babel-plugin-transform-vue-jsx` then this method won't be too beneficial, but if your data is a list of objects you can return a specific object.

```jsx
renderSuggestion(suggestion) {
    return <div style={{ color: "red" }}>{suggestion.name}</div>;
},
```

<a name="getSuggestionValue"></a>
### getSuggestionValue
This function will tell vue-autosuggest what to put in the `<input/>` as the value.

```js
getSuggestionValue(suggestion) {
    return suggestion.name;
},
```

## Inspiration

- Misha Moroshko's react-autosuggest component inspired the api + WAI-ARIA completeness https://github.com/moroshko/react-autosuggest
- Spatie inspired the vue component setup + docs https://github.com/spatie/vue-table-component

## Contributors

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars.githubusercontent.com/u/5770711?v=4" width="100px;"/><br /><sub><b>Darren Jennings</b></sub>](https://darrenjennings.github.io)<br />[💻](https://github.com/Educents/vue-autosuggest/commits?author=darrenjennings "Code") [📖](https://github.com/Educents/vue-autosuggest/commits?author=darrenjennings "Documentation") [🚇](#infra-darrenjennings "Infrastructure (Hosting, Build-Tools, etc)") [⚠️](https://github.com/Educents/vue-autosuggest/commits?author=darrenjennings "Tests") [🎨](#design-darrenjennings "Design") [💡](#example-darrenjennings "Examples") | [<img src="https://avatars2.githubusercontent.com/u/411772?v=4" width="100px;"/><br /><sub><b>Evgeniy Kulish</b></sub>](https://github.com/ekulish)<br />[💻](https://github.com/Educents/vue-autosuggest/commits?author=ekulish "Code") [🎨](#design-ekulish "Design") [💡](#example-ekulish "Examples") [⚠️](https://github.com/Educents/vue-autosuggest/commits?author=ekulish "Tests") |
| :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/Educents/vue-autosuggest.svg?style=flat-square
[build]: https://travis-ci.org/Educents/vue-autosuggest
[coverage-badge]: https://img.shields.io/codecov/c/github/Educents/vue-autosuggest.svg?style=flat-square
[coverage]: https://codecov.io/github/Educents/vue-autosuggest
[version-badge]: https://img.shields.io/npm/v/vue-autosuggest.svg?style=flat-square
[package]: https://www.npmjs.com/package/vue-autosuggest
[downloads-badge]: https://img.shields.io/npm/dm/vue-autosuggest.svg?style=flat-square
[npmtrends]: http://www.npmtrends.com/vue-autosuggest
[license-badge]: https://img.shields.io/npm/l/vue-autosuggest.svg?style=flat-square
[license]: https://github.com/Educents/vue-autosuggest/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/Educents/vue-autosuggest/blob/master/other/CODE_OF_CONDUCT.md
[github-watch-badge]: https://img.shields.io/github/watchers/Educents/vue-autosuggest.svg?style=social
[github-watch]: https://github.com/Educents/vue-autosuggest/watchers
[github-star-badge]: https://img.shields.io/github/stars/Educents/vue-autosuggest.svg?style=social
[github-star]: https://github.com/Educents/vue-autosuggest/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20vue-autosuggest%20by%20%40educents%20https%3A%2F%2Fgithub.com%2Feducents%2Fvue-autosuggest%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/Educents/vue-autosuggest.svg?style=social
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
<!-- [donate-badge]: https://img.shields.io/badge/$-support-green.svg?style=flat-square -->
