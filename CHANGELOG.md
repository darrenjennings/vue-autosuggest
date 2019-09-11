# CHANGELOG

Abridged versions of releases. See [release notes](https://github.com/Educents/vue-autosuggest/releases) for more details.

* [2.0.4](https://github.com/darrenjennings/vue-autosuggest/releases/tag/v2.0.4) Bugfix
  * Fixes #124
* [2.0.3](https://github.com/darrenjennings/vue-autosuggest/releases/tag/v2.0.3) Bugfix
  * Fixes #142
* [2.0.2](https://github.com/darrenjennings/vue-autosuggest/releases/tag/v2.0.2) Bugfixes
  * Fixes #136, Fixes #135, Fixes #129
* [2.0.1](https://github.com/darrenjennings/vue-autosuggest/releases/tag/v2.0.1) Bugfix
  * Fixes #129 where in some cases, re-renders would cause the default autocomplete="off" to be unset.
* [2.0.0](https://github.com/darrenjennings/vue-autosuggest/releases/tag/v2.0.0) :sparkles: Major Release
  * See [full release notes](https://github.com/darrenjennings/vue-autosuggest/releases/tag/v2.0.0)
* [1.8.3](https://github.com/darrenjennings/vue-autosuggest/tree/v1.8.3) Bugfix
  * Bugfix to support IE/Edge since they don't support scrollTo. #40
* [1.8.2](https://github.com/darrenjennings/vue-autosuggest/tree/v1.8.2) Bugfix
  * Fixes #102 Clicking on the scroll bar has been a rough go. This release aims to rid us of the all the frustration.
* [1.8.1](https://github.com/darrenjennings/vue-autosuggest/tree/v1.8.1) Bugfix
  * Fix incorrect scrollbar click calculation
* [1.8.0-1](https://github.com/darrenjennings/vue-autosuggest/tree/v1.8.0-1) Bugfix
  * Removes form-control as an always present css class on the `<input />`
  * Migration from 1.x -> 1.8.0-1
    * If you had class set on the inputProps property, then vue-autosuggest used to always append form-control. If class is 
      empty, the form-control class is the default, but if you have it set then now you need to specifically add form
      control to `inputProps.class` if you are wanting it.
* [1.7.3](https://github.com/darrenjennings/vue-autosuggest/tree/v1.7.3) Bugfix, multiple instances navigation fixes
  * From [#78](https://github.com/darrenjennings/vue-autosuggest/pull/78)
* [1.7.1-2](https://github.com/darrenjennings/vue-autosuggest/tree/v1.7.1-2) Bugfix
  * fix(mousedown) check for presence of results 
  * Fixes [#66](https://github.com/darrenjennings/vue-autosuggest/issues/66)
* [1.7.1-1](https://github.com/darrenjennings/vue-autosuggest/releases/tag/v1.7.1-1) bugfixes scrollbar clicking and event management
  * fix(scroll) don't close autosuggest when clicking on scrollbar (#64)
  * destroy event listeners in beforeDestroy lifecycle
  * Fixes [#63](https://github.com/darrenjennings/vue-autosuggest/issues/63)
  * The biggest benefit for this release is not only the ability to click and drag the scroll bar, but the cleanup of event     listeners, which would previously hang around even after the component would be destroyed.

* [1.7.0](https://github.com/darrenjennings/vue-autosuggest/tree/v1.7.0) @suggestion and minify esm bundle
  * feat(events) add suggestion as event @suggestion
    * chore(eslint) add eslint vue/recommended configuration and have
    * autosuggest lib conform
    * chore(rollup) uglify esm module for smaller lib size
  * Migrating from 1.6-1.7:
    * The on-selected event is now @selected
  * Fixes [#58](https://github.com/darrenjennings/vue-autosuggest/issues/58), From #62

* [1.6.0](https://github.com/darrenjennings/vue-autosuggest/tree/v1.6.0) - Attribute prop customization
  * Added component id and class customization props:
    * component-attr-id-autosuggest
    * component-attr-class-autosuggest-results-container
    * component-attr-class-autosuggest-results
* [1.5.0](https://github.com/Educents/vue-autosuggest/releases/tag/v1.5.0) - Slots
  * Slots - header, footer, and suggestion items
* [1.4.3](https://github.com/Educents/vue-autosuggest/releases/tag/1.4.3) - bugfix [46](https://github.com/Educents/vue-autosuggest/pull/46)
* [1.4.1](https://github.com/Educents/vue-autosuggest/releases/tag/1.4.1) - Native events using transparent wrappers, bugfixes
* [1.3.1](https://github.com/Educents/vue-autosuggest/releases/tag/v1.3.1) - various improvements
  * Blur and Focus events added to inputProps
  * passing in oldText for onInputChange(val, oldVal) watcher event
  * Ability to set input autocomplete value. Default = off
* [1.1.2](https://github.com/Educents/vue-autosuggest/releases/tag/v1.1.2) - getSuggestionValue, renderSuggestion props, scrollTo behavior
