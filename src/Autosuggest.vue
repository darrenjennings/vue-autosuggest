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
                <div
                    role="listbox" 
                    class="autosuggest__results" 
                    aria-labelledby="autosuggest"
                    v-if="getSize() > 0 && !loading"
                    >
                    <component v-for="(cs, key) in this.computedSections" 
                        :is="cs.name" :section="cs" :ref="getSectionRef(key)" :key="getSectionRef(key)" :updateCurrentIndex="updateCurrentIndex" :searchInput="searchInput"></component>
                </div>
        </div>
    </div>
</template>

<script>

import DefaultSection from './parts/DefaultSection.vue';
import UrlSection from './parts/UrlSection.vue';

export default {
        name: 'autosuggest',
        components: {
            DefaultSection,
            UrlSection
        },
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
            },
            sectionConfigs: {
                type: Object,
                required: false
            }
        },
        data: () => ({
            searchInput: '',
            searchInputOriginal: '',
            currentIndex: null,
            currentItem: null,
            loading: false, /** Helps with making sure the dropdown doesn't stay open after certain actions */
            didSelectFromOptions: false,
            computedSections: [],
            computedSize: 0,
            onSelected: function(){
                if (this.currentItem && this.sectionConfigs[this.currentItem.type]) {
                    this.sectionConfigs[this.currentItem.type].onSelected(this.currentItem);
                }
            }
        }),
        computed: {
            isOpen() {
                return this.shouldRenderSuggestions() && !this.loading;
            },
            suggestionsFiltered(){
                return this.suggestions.slice(0, this.limit);
            }
        },
        created() {
        },
        methods: {
            getSectionRef(i) {
                return 'computed_section_' + i;
            },
            getSize() {
                return this.computedSize;
            },
            getItemByIndex(index) {
                let obj = false;
                if (!index) return obj;
                for (var i = 0; i < this.computedSections.length; i++) {
                    if (index >= this.computedSections[i].start_index && index <= this.computedSections[i].end_index) {
                        let trueIndex = index - this.computedSections[i].start_index;
                        let childSection = this.$refs['computed_section_' + i][0];
                        if (childSection) {
                            obj = {
                                "type": this.computedSections[i].type,
                                "label": childSection.getLabelByIndex(trueIndex),
                                "item": childSection.getItemByIndex(trueIndex)
                            };
                            break;
                        }
                    }
                }

                return obj;
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
                            this.setCurrentIndex(newIndex, this.getSize(), direction);
                            this.didSelectFromOptions = true;
                            if (this.getSize() > 0 && this.currentIndex >= 0) {
                                this.setChangeItem(this.getItemByIndex(this.currentIndex));
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
                            if (this.getSize() > 0 && this.currentIndex >= 0) {
                                this.setChangeItem(this.getItemByIndex(this.currentIndex));
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
                            this.searchInput = this.searchInputOriginal;
                            e.preventDefault();
                        }
                        break;
                }
            },
            setChangeItem(item) {
                if (item) {
                    this.searchInput = item.label;
                    this.currentItem = item;
                }
            },
            updateCurrentIndex(index) {
                this.currentIndex = index;
            },
            onDocumentMouseUp() {
                /** Clicks outside of dropdown to exit */
                if (this.currentIndex === null) {
                    this.loading = this.shouldRenderSuggestions();
                    return;
                }

                /** Selects an item in the dropdown */
                this.loading = true;
                
                this.setChangeItem(this.getItemByIndex(this.currentIndex));
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
                    this.searchInputOriginal = this.value;
                    this.currentIndex = null;
                    this.inputProps.onInputChange(newValue);
                }
            },
            suggestions() {
                this.computedSections = [];
                this.computedSize = 0;
                var generateName = function(name) {
                    name = name.toString();
                    return name.charAt(0).toUpperCase() + name.slice(1) + 'Section';
                }

                var getType = function(type) {
                    if (!type) {
                        type = 'default';
                    }

                    return type;
                }

                this.suggestions.forEach(function(section) {
                    var n = generateName(getType(section.type));
                    var lim = this.$options.components[n].getLimit();
                    lim = (section.data.length < lim) ? section.data.length : lim;
                    var obj = {
                        limit: lim,
                        name: n,
                        data: section.data,
                        label: section.label,
                        start_index: this.computedSize,
                        end_index: this.computedSize + lim - 1,
                        type: getType(section.type)
                    };
                    this.computedSections.push(obj);
                    this.computedSize += lim;
                }, this);
            }
        }
    }
</script>