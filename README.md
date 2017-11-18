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

- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Props](#props)
- [FAQ](#faq)
- [Inspiration](#inspiration)
- [Other Solutions](#other-solutions)
- [Contributors](#contributors)
- [LICENSE](#license)
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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
Basic usage:
```html
<vue-autosuggest 
    :suggestions="['Frodo', 'Samwise', 'Gandalf', 'Galadriel', 'Faramir', 'Éowyn']"
    :on-selected="clickHandler"
    :input-props="{id:'autosuggest__input', onInputChange: this.onInputChange, placeholder:'Do you feel lucky, punk?'}"
/>
```


## Examples
- <a href="https://educents.github.io/vue-autosuggest/">Storybook</a><br/>
- <a href="https://jsfiddle.net/darrenjennings/dugbvezs/">JSFiddle</a>

## Props
| Prop | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| [`suggestions`](#suggestionsProp) | Array | ✓ | Suggestions to be rendered. |
| [`input-props`](#inputPropsProp) | Object | ✓ | Add props to the `<input>`.|

## Inspiration

- Misha Moroshko's react-autosuggest component inspired the api + WAI-ARIA completeness https://github.com/moroshko/react-autosuggest
- Spatie inspired the vue component setup + docs https://github.com/spatie/vue-table-component

## Contributors

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars.githubusercontent.com/u/5770711?v=4" width="100px;"/><br /><sub><b>Darren Jennings</b></sub>](https://darrenjennings.github.io)<br />[💻](https://github.com/darrenjennings/vue-autosuggest/commits?author=darrenjennings "Code") [📖](https://github.com/darrenjennings/vue-autosuggest/commits?author=darrenjennings "Documentation") [🚇](#infra-darrenjennings "Infrastructure (Hosting, Build-Tools, etc)") [⚠️](https://github.com/darrenjennings/vue-autosuggest/commits?author=darrenjennings "Tests") [🎨](#design-darrenjennings "Design") [💡](#example-darrenjennings "Examples") | [<img src="https://avatars2.githubusercontent.com/u/411772?v=4" width="100px;"/><br /><sub><b>Evgeniy Kulish</b></sub>](https://github.com/ekulish)<br />[💻](https://github.com/darrenjennings/vue-autosuggest/commits?author=ekulish "Code") [🎨](#design-ekulish "Design") [💡](#example-ekulish "Examples") [⚠️](https://github.com/darrenjennings/vue-autosuggest/commits?author=ekulish "Tests") |
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