<template>
    <div id="autosuggest">
        <input class="form-control"
               name="q"
               type="text"
               maxlength="256"
               autocomplete="off"
               v-model="searchInput"
               :class="[isOpen ? 'autosuggest__input-open' : '', inputProps['class']]"
               @keydown="handleKeyStroke"
               @click="onClick"
               v-bind="inputProps"
               aria-autosuggest="list"
               aria-owns="autosuggest__results"
               :aria-activedescendant="isOpen ? `autosuggest__results--item-${currentIndex}` : ''"
               :aria-haspopup="isOpen"
        />
        <div class="autosuggest__results-container">
            <ul role="listbox" v-if="suggestions.length > 0 && !loading" class="autosuggest__results" aria-labelledby="autosuggest">
                <slot name="autosuggest" 
                    :result="result"
                    :mouseenter="onSuggestionMouseEnter"
                    :mouseleave="resetHighlightedSuggestionOnMouseLeave"
                    :data-suggestion-index="index"
                    role="option"
                    :styleItem="styleItem"
                    class="autosuggest__results_item"
                    :class="{'autosuggest__results_item-highlighted' : index == currentIndex, 'autosuggest__results_item':true}" 
                    :id="`autosuggest__results_item-${index}`"
                    v-for="(result, index) in suggestions"
                >
                    <li @mouseenter="onSuggestionMouseEnter"
                        @mouseleave="resetHighlightedSuggestionOnMouseLeave"
                        :data-suggestion-index="index"
                        role="option"
                        class="autosuggest__results_item"
                        :class="{'autosuggest__results_item-highlighted' : index == currentIndex, 'autosuggest__results_item':true}" 
                        :id="`autosuggest__results_item-${index}`" 
                        :key="index">
                        <span v-html="result[resultItemKey]"></span>
                    </li>
                </slot>
            </ul>
        </div>
    </div>
</template>

<script>

export default {
        name: 'autosuggest',
        props: {
            inputProps: {
                id: {
                    type: String,
                    default: 'autosuggest__input'
                },
                onInputChange: {
                    type: Function,
                    required: true
                },
                initialValue: {
                    type: String,
                    default: ""
                },
                placeholder: {
                    type: String,
                    required: true
                },
                onClick: {
                    type: Function,
                    required: false
                }
            },
            limit: {
                type: Number,
                required: false,
                default: Infinity
            },
            onSelected: {
                type: Function,
                required: false,
                default: () => {}
            },
            suggestions: {
                type: Array,
                required: true,
                default: []
            },
            shouldRenderSuggestions: {
                type: Function,
                required: false,
                default: () => {
                    return true;
                }
            },
            resultItemKey: {
                type: String,
                required: false
            }
        },
        data: () => ({
            searchInput: '',
            currentIndex: null,
            loading: false, /** Helps with making sure the dropdown doesn't stay open after certain actions */
            didSelectFromOptions: false
        }),
        computed: {
            isOpen() {
                return this.shouldRenderSuggestions() && !this.loading;
            }
        },
        methods: {
            styleItem(item) {
                if(!this.didSelectFromOptions){
                    const value = this.searchInput.trim();
                    const r = new RegExp(`${value}`, 'ig');
                    return item.replace(r, `<b>${value}</b>`);
                }
                return item;
            },
            handleKeyStroke(e) {
                const {keyCode} = e;
                this.loading = false;
                this.didSelectFromOptions = false;
                switch (keyCode) {
                    case 40: // ArrowDown
                    case 38: // ArrowUp
                        e.preventDefault();
                        if (this.isOpen) {
                            // Determine direction of arrow up/down and determine new currentIndex
                            const direction = keyCode === 40 ? 1 : -1;
                            const newIndex = this.currentIndex + direction;
                            this.setCurrentIndex(newIndex, this.suggestions.length, direction);
                            this.didSelectFromOptions = true;
                            if (this.suggestions.length > 0 && this.currentIndex >= 0 && this.suggestions[this.currentIndex][this.resultItemKey]) {
                                this.setChangeItem(this.suggestions[this.currentIndex][this.resultItemKey]);
                                this.didSelectFromOptions = true;
                            }
                        }
                        break;
                    case 13:  // Enter
                        e.preventDefault();
                        if (keyCode === 229) { // https://github.com/moroshko/react-autosuggest/pull/388
                            break;
                        }
                        this.$nextTick(() => {
                            if (this.suggestions.length > 0 && this.currentIndex >= 0 && this.suggestions[this.currentIndex]) {
                                this.setChangeItem(this.suggestions[this.currentIndex][this.resultItemKey]);
                                this.didSelectFromOptions = true;
                            }
                            this.loading = true;
                            this.$nextTick(() => {
                                this.onSelected(this.didSelectFromOptions);
                            });
                        });
                        break;
                    case 27: // Escape
                        if (this.isOpen) {
                            /* For 'search' input type, make sure the browser doesn't clear the input when Escape is pressed. */
                            this.loading = true;
                            this.currentIndex = null;
                            e.preventDefault();
                        }
                        break;
                }
            },
            setChangeItem(item) {
                this.searchInput = item;
            },
            onSuggestionMouseEnter(event) {
                this.currentIndex = event.currentTarget.getAttribute('data-suggestion-index');
            },
            resetHighlightedSuggestionOnMouseLeave() {
                this.currentIndex = null;
            },
            onDocumentMouseUp() {
                /** Clicks outside of dropdown to exit */
                if (this.currentIndex === null || !this.suggestions[this.currentIndex][this.resultItemKey]) {
                    this.loading = this.shouldRenderSuggestions();
                    return;
                }
                /** Selects an item in the dropdown */
                this.loading = true;
                this.setChangeItem(this.suggestions[this.currentIndex][this.resultItemKey]);
                this.$nextTick(() => {
                    this.onSelected(true);
                })
            },
            setCurrentIndex(newIndex, limit = -1, direction) {
                let adjustedValue = newIndex;

                // if we hit the lower limit then stop iterating the index
                if (this.currentIndex === null) {
                    adjustedValue = 0;
                }

                if (this.currentIndex < 0 && direction === 1) {
                    adjustedValue = 0;
                }
                // if we hit the upper limit then just stop iterating the index
                if (newIndex >= limit) {
                    adjustedValue = 0;
                }
                this.currentIndex = adjustedValue;
                
                const element = document.getElementById(`autosuggest__results_item-${this.currentIndex}`);
                const hoverClass = 'autosuggest__results_item-highlighted';
                if(document.querySelector(`.${hoverClass}`)){
                    this.removeClass(document.querySelector(`.${hoverClass}`),hoverClass);
                }
                if(element){
                    this.addClass(element, hoverClass);
                }
            },
            onClick() {
                this.loading = false;
                this.inputProps.onClick();
            },
            
            /** DOM Utilities */
            hasClass(el, className) {
                if (el.classList)
                    return el.classList.contains(className)
                else
                    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
            },
            addClass(el, className) {
                if (el.classList)
                    el.classList.add(className)
                else if (!hasClass(el, className)) el.className += " " + className
            },
            removeClass(el, className) {
                if (el.classList){
                    el.classList.remove(className)
                }
                else if (hasClass(el, className)) {
                    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
                    el.className = el.className.replace(reg, ' ')
                }
            }
        },
        mounted() {
            document.addEventListener('mouseup', this.onDocumentMouseUp);
            const input = document.getElementById(this.inputProps.id);
            if(input){
                input.value = this.inputProps.initialValue; // set default query, e.g. loaded server side.
            }
        },
        watch: {
            searchInput(newValue, oldValue) {
                this.value = newValue;
                if(!this.didSelectFromOptions){
                    this.currentIndex = null;
                    this.inputProps.onInputChange(newValue);
                }
            }
        }
    }
</script>