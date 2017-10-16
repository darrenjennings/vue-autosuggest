<template>
    <div id="autosuggest" class="search__container">
        <input id="autosuggest__input" class="form-control" name="q" type="text" maxlength="256" autocomplete="off" v-model="searchInput" :class="{'autosuggest__input-open': isOpen}" @keydown="handleKeyStroke" v-bind="inputProps" aria-autosuggest="list" aria-owns="autosuggest__results" :aria-activedescendant="isOpen ? `autosuggest__results--item-${currentIndex}` : null" :aria-haspopup="suggestions.length > 0" />
        <div id="autosuggest__results-container">
            <ul role="listbox" v-if="suggestions.length > 0 && searchInput !== '' && !loading" class="autosuggest__results" aria-labelledby="autosuggest">
                <li v-bind:key="index" :data-suggestion-index="index" @mouseenter="onSuggestionMouseEnter" @mouseleave="resetHighlightedSuggestionOnMouseLeave" role="option" v-for="(result, index) in suggestions" class="autosuggest__results_item" :class="{'autosuggest__results_item-highlighted' : index == currentIndex}">
                    <span v-html="styleItem(result.query_terms)"></span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'autosuggest',
    props: {
        inputProps: {
            onInputChange: {
                type: Function,
                required: true
            },
            currentQuery: {
                type: String,
                required: true
            },
            placeholder: {
                type: String,
                required: true
            }
        },
        limit: {
            type: Number,
            required: false,
            default: Infinity
        },
        onSelected: {
            type: Function,
            required: true,
            default: () => {
            }
        },
        suggestions: {
            type: Array,
            required: true,
            default: []
        }
    },
    data: () => ({
        searchInput: '',
        currentIndex: null,
        loading: false /** Helps with making sure the dropdown doesn't stay open after certain actions */
    }),
    computed: {
        isOpen() {
            return this.suggestions.length > 0;
        }
    },
    methods: {
        styleItem(item) {
            const r = new RegExp(`${this.searchInput}`, 'ig');
            return item.replace(r, `<b>${this.searchInput}</b>`);
        },
        handleKeyStroke(e) {
            const { keyCode } = e;
            this.loading = false;
            switch (keyCode) {
                case 40: // ArrowDown
                case 38: // ArrowUp
                    e.preventDefault();
                    if (this.isOpen) {
                        // Determine direction of arrow up/down and determine new currentIndex
                        const direction = keyCode === 40 ? 1 : -1;
                        const newIndex = this.currentIndex + direction;
                        this.setCurrentIndex(newIndex, this.suggestions.length, direction);
                    }
                    break;
                case 13:  // Enter
                    e.preventDefault();
                    if (keyCode === 229) { // https://github.com/moroshko/react-autosuggest/pull/388
                        break;
                    }
                    this.$nextTick(() => {
                        if (this.suggestions.length > 0 && this.currentIndex >= 0) {
                            this.setChangeItem(this.suggestions[this.currentIndex].query_terms);
                        }
                        this.onSelected();
                        this.loading = true;
                    });
                    break;
                case 27: // Escape
                    if (this.isOpen) {
                        this.setResults([]);
                        /* For 'search' input type, make sure the browser doesn't clear the input when Escape is pressed. */
                        e.preventDefault();
                    }
                    break;
            }
        },
        setChangeItem(item) {
            this.searchInput = item;
        },
        setResults(data) {
            this.results = data.slice(0, this.limit);
        },
        onSuggestionMouseEnter(event) {
            this.setCurrentIndex(event.currentTarget.getAttribute('data-suggestion-index'));
        },
        resetHighlightedSuggestionOnMouseLeave() {
            this.setCurrentIndex(null);
        },
        onDocumentMouseUp() {
            if (this.currentIndex === null || !this.suggestions[this.currentIndex]) {
                return;
            }
            this.setChangeItem(this.suggestions[this.currentIndex].query_terms);
            this.onSelected();
            this.loading = true;
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
                adjustedValue = limit - 1;
            }
            this.currentIndex = adjustedValue;
        }
    },
    mounted() {
        document.addEventListener('mouseup', this.onDocumentMouseUp);
    },
    watch: {
        searchInput(newValue, oldValue) {
            this.currentIndex = null;
            this.inputProps.onInputChange(newValue);
        },
        suggestions(newData, oldData) {
            this.setResults(newData);
        }
    }
}
</script>