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
               :aria-activedescendant="isOpen && currentIndex !== null ? `autosuggest__results--item-${currentIndex}` : ''"
               :aria-haspopup="isOpen ? 'true' : 'false'"
        />
        <div class="autosuggest__results-container">
                <div
                    role="listbox" 
                    class="autosuggest__results" 
                    aria-labelledby="autosuggest"
                    v-if="getSize() > 0 && !loading"
                    >
                    <component v-for="(cs, key) in this.computedSections" :is="cs.type" :section="cs" :ref="getSectionRef(key)" :key="getSectionRef(key)" :updateCurrentIndex="updateCurrentIndex" :searchInput="searchInput"></component>
                </div>
        </div>
    </div>
</template>

<script>
import DefaultSection from "./parts/DefaultSection.vue";
export default {
        name: "autosuggest",
        components: {
            DefaultSection
        },
        props: {
            inputProps: {
                id: {
                    type: String,
                    default: "autosuggest__input"
                },
                onInputChange: {
                    type: Function,
                    required: true
                },
                initialValue: {
                    type: String,
                    default: ""
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
            sectionConfigs: {
                type: Object,
                required: false,
                default: () => {
                    return {
                        default: {
                            onSelected: null
                        }
                    };
                }
            },
            onSelected: {
                type: Function,
                required: false,
                default: null
            }
        },
        data: () => ({
            searchInput: "",
            searchInputOriginal: null,
            currentIndex: null,
            currentItem: null,
            loading: false /** Helps with making sure the dropdown doesn't stay open after certain actions */,
            didSelectFromOptions: false,
            computedSections: [],
            computedSize: 0
        }),
        computed: {
            isOpen() {
                return (
                    (this.getSize() > 0 &&
                        this.shouldRenderSuggestions() &&
                        !this.loading) || this.searchInputOriginal == null
                );
            }
        },
        created(){
            if(!this.inputProps.onClick){
                this.inputProps.onClick = this._onClick;
            }
        },
        methods: {
            _onClick(){
                return this;
            },
            _onSelected() {
                if (
                    this.currentItem &&
                    this.sectionConfigs[this.currentItem.name] &&
                    this.sectionConfigs[this.currentItem.name].onSelected
                ) { 
                    this.sectionConfigs[this.currentItem.name].onSelected(
                        this.currentItem,
                        this.searchInputOriginal
                    );
                } else if(this.sectionConfigs["default"].onSelected){
                    this.sectionConfigs["default"].onSelected(
                        null,
                        this.searchInputOriginal
                    );
                } else {
                    this.onSelected && this.onSelected(this.currentItem)
                }
            },
            getSectionRef(i) {
                return "computed_section_" + i;
            },
            getSize() {
                return this.computedSize;
            },
            getItemByIndex(index) {
                let obj = false;
                if (index === null) return obj;
                for (var i = 0; i < this.computedSections.length; i++) {
                    if (
                        index >= this.computedSections[i].start_index &&
                        index <= this.computedSections[i].end_index
                    ) {
                        let trueIndex =
                            index - this.computedSections[i].start_index;
                        let childSection = this.$refs["computed_section_" + i][0];
                        if (childSection) {
                            obj = {
                                name: this.computedSections[i].name,
                                type: this.computedSections[i].type,
                                label: childSection.getLabelByIndex(trueIndex),
                                item: childSection.getItemByIndex(trueIndex)
                            };
                            break;
                        }
                    }
                }

                return obj;
            },
            handleKeyStroke(e) {
                const { keyCode } = e;

                const ignoredKeyCodes = [
                    16, // Shift
                    9, // Tab
                    18, // alt/option
                    91, // OS Key
                    93 // Right OS Key
                ];

                if (ignoredKeyCodes.indexOf(keyCode) > -1) {
                    return;
                }

                this.loading = false;
                this.didSelectFromOptions = false;
                switch (keyCode) {
                    case 40: // ArrowDown
                    case 38: // ArrowUp
                        e.preventDefault();
                        if (this.isOpen) {
                            if (keyCode === 38 && this.currentIndex === null) {
                                break;
                            }
                            // Determine direction of arrow up/down and determine new currentIndex
                            const direction = keyCode === 40 ? 1 : -1;
                            const newIndex = this.currentIndex + direction;
                            this.setCurrentIndex(
                                newIndex,
                                this.getSize(),
                                direction
                            );
                            this.didSelectFromOptions = true;
                            if (this.getSize() > 0 && this.currentIndex >= 0) {
                                this.setChangeItem(
                                    this.getItemByIndex(this.currentIndex)
                                );
                                this.didSelectFromOptions = true;
                            } else if (this.currentIndex == -1) {
                                this.currentIndex = null;
                                this.searchInput = this.searchInputOriginal;
                                e.preventDefault();
                            }
                        }
                        break;
                    case 13: // Enter
                        e.preventDefault();
                        if (keyCode === 229) {
                            // https://github.com/moroshko/react-autosuggest/pull/388
                            break;
                        }
                        this.$nextTick(() => {
                            if (this.getSize() > 0 && this.currentIndex >= 0) {
                                this.setChangeItem(
                                    this.getItemByIndex(this.currentIndex), true
                                );
                                this.didSelectFromOptions = true;
                            }
                            this.loading = true;
                            this.$nextTick(() => {
                                this._onSelected(this.didSelectFromOptions);
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
            setChangeItem(item, overrideOriginalInput = false) {
                if (this.currentIndex === null) {
                    this.currentItem = null;
                } else if (item) {
                    this.searchInput = item.label;
                    this.currentItem = item;
                    if (overrideOriginalInput){
                        this.searchInputOriginal = item.label;
                    }
                }
            },
            updateCurrentIndex(index) {
                this.currentIndex = index;
            },
            onDocumentMouseUp() {
                /** Clicks outside of dropdown to exit */
                if (this.currentIndex === null || !this.isOpen) {
                    this.loading = this.shouldRenderSuggestions();
                    return;
                }

                /** Selects an item in the dropdown */
                this.loading = true;
                this.didSelectFromOptions = true;
                this.setChangeItem(this.getItemByIndex(this.currentIndex), true);
                this.$nextTick(() => {
                    this._onSelected(true);
                });
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

                const element = document.getElementById(
                    `autosuggest__results_item-${this.currentIndex}`
                );
                const hoverClass = "autosuggest__results_item-highlighted";
                if (document.querySelector(`.${hoverClass}`)) {
                    this.removeClass(
                        document.querySelector(`.${hoverClass}`),
                        hoverClass
                    );
                }
                if (element) {
                    this.addClass(element, hoverClass);
                }
            },
            onClick() {
                this.loading = false;
                this.inputProps.onClick();
            },

            /** DOM Utilities */
            hasClass(el, className) {
                return !!el.className.match(
                    new RegExp("(\\s|^)" + className + "(\\s|$)")
                );
            },
            addClass(el, className) {
                if (!this.hasClass(el, className))
                    el.className += " " + className;
            },
            removeClass(el, className) {
                if (el.classList) {
                    el.classList.remove(className);
                }
            },
            getSectionName(section) {
                if (!section.name) {
                    section.name = "default";
                }

                return section.name;
            }
        },
        mounted() {
            document.addEventListener("mouseup", this.onDocumentMouseUp);
            this.searchInput = this.inputProps.initialValue; // set default query, e.g. loaded server side.
            this.loading = true;
        },
        watch: {
            searchInput(newValue) {
                this.value = newValue;
                if (!this.didSelectFromOptions) {
                    this.searchInputOriginal = this.value;
                    this.currentIndex = null;
                    this.inputProps.onInputChange(newValue);
                }
            },
            suggestions: {
              immediate: true,
              handler() {
                this.computedSections = [];
                this.computedSize = 0;

                this.suggestions.forEach(section => {
                    if (!section.data) return;
                    
                    const name = this.getSectionName(section);
                    let { type, limit, label } = this.sectionConfigs[name];
                    
                    /** Set defaults for section configs. */
                    type = type ? type : "default-section";
                    
                    limit = limit ? limit : Infinity;
                    limit = (section.data.length < limit) ? section.data.length : limit;
                    
                    label = label ? label : section.label;
                    
                    let computedSection = {
                        name,
                        label,
                        type,
                        limit,
                        data: section.data,
                        start_index: this.computedSize,
                        end_index: this.computedSize + limit - 1
                    };
                    this.computedSections.push(computedSection);
                    this.computedSize += limit;
               }, this);
              }  
            }
        }
};
</script>